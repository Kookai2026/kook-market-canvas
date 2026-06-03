# KMC (KOOK Market Canvas) 동기화 API 규격서 (KMC Syncer)

사내(Company) 기지국 서버의 Hermes/Scoring 데몬에서 최종 가공된 데이터를 외부 퍼블릭 Supabase 데이터베이스로 갱신하기 위해 사용하는 API 페이로드 규격입니다.

---

## 🔗 1. 데이터 동기화 플로우 개요

```text
[사내 Hermes 수집/연산 엔진] 
       | (매시간 혹은 마감 시 연산 완료)
       v
[동기화 배치 클라이언트 (kmc_syncer.py)]
       |
       | ───> 1. POST /api/v1/sync/instruments (종목 마스터 갱신)
       | ───> 2. POST /api/v1/sync/metrics (실시간 시세 및 기술지표 갱신)
       | ───> 3. POST /api/v1/sync/scores (적합도/과열도 스코어카드 갱신)
       | ───> 4. POST /api/v1/sync/canvas (섹터/노드/관계 캔버스 상태 갱신)
       v
[외부 Supabase DB / BFF Gateway]
```

---

## 📡 2. 엔드포인트별 페이로드 규격 (JSON)

### 1. 종목 마스터 업로드 및 갱신 (`POST /api/v1/sync/instruments`)
- **목적**: 캔버스에 추가된 새로운 종목 마스터나 ETF 제품을 원격 DB에 등록/갱신. (UPSERT)
- **페이로드**:
```json
{
  "sync_time": "2026-06-03T23:30:00+09:00",
  "instruments": [
    {
      "symbol": "267260",
      "market": "KRX",
      "name": "HD현대일렉트릭",
      "asset_type": "stock",
      "leverage_factor": 1.0
    },
    {
      "symbol": "ETN",
      "market": "US",
      "name": "Eaton Corp plc",
      "asset_type": "stock",
      "leverage_factor": 1.0
    }
  ]
}
```

### 2. 시세 및 기술지표 스냅샷 갱신 (`POST /api/v1/sync/metrics`)
- **목적**: 사내 감시 데몬이 수집한 실시간 종목 가격 및 RSI 지표, 5일 외국인/기관 수급액을 일괄 갱신.
- **페이로드**:
```json
{
  "sync_time": "2026-06-03T23:30:00+09:00",
  "metrics": [
    {
      "symbol": "267260",
      "price": 445000,
      "rsi_14": 68.2,
      "foreign_5d_net": 12800000000,
      "inst_5d_net": 7600000000,
      "as_of": "2026-06-03T23:00:00+09:00"
    },
    {
      "symbol": "ETN",
      "price": 312.5,
      "rsi_14": 52.8,
      "foreign_5d_net": 42000000,
      "inst_5d_net": -15000000,
      "as_of": "2026-06-03T23:00:00+09:00"
    }
  ]
}
```

### 3. 투자 적합도 및 과열도 점수 카드 갱신 (`POST /api/v1/sync/scores`)
- **목적**: 파이썬 스코어링 엔진이 합성 연산한 최종 투자 판단 점수(0~100)와 룰 기반 한줄판정 문구를 Supabase DB에 적재.
- **페이로드**:
```json
{
  "sync_time": "2026-06-03T23:30:00+09:00",
  "scores": [
    {
      "symbol": "267260",
      "fit_score": 82,
      "overheat_score": 71,
      "one_liner": "펀더멘털 대비 가격 부담은 존재하나 높은 수주 가시성으로 눌림 분할 진입이 유리",
      "as_of": "2026-06-03T23:25:00+09:00"
    },
    {
      "symbol": "ETN",
      "fit_score": 78,
      "overheat_score": 62,
      "one_liner": "북미 전력 배전 수요 지속에 따른 안정적 실적 구간 진입",
      "as_of": "2026-06-03T23:25:00+09:00"
    }
  ]
}
```

### 4. 캔버스 밸류체인 상태 동기화 (`POST /api/v1/sync/canvas`)
- **목적**: 사내 에디터가 편집한 섹터 캔버스의 노드 정보와 연결 관계(Edge), 증빙 자료를 일괄 반영.
- **페이로드**:
```json
{
  "sync_time": "2026-06-03T23:30:00+09:00",
  "sector": {
    "slug": "ai-electrification",
    "name": "AI 전력망 인프라",
    "description": "빅테크 AI 데이터센터 전력 수급 및 글로벌 노후 전력망 교체 테제"
  },
  "nodes": [
    {
      "title": "초고압 변압기",
      "node_type": "component",
      "thesis": "변압기 공급 부족 장기화 수혜",
      "risks": "원자재 구리 가격 변동성"
    }
  ],
  "relations": [
    {
      "from_node_title": "초고압 변압기",
      "to_node_title": "AI 데이터센터",
      "relation_type": "supplier",
      "strength": 85,
      "evidences": [
        {
          "title": "HD현대일렉트릭 2026년 대규모 공급 공시",
          "url": "https://dart.fss.or.kr/...",
          "excerpt": "미국 변전소용 고압변압기 초장기 독점 공급 계약 체결",
          "reliability": "A"
        }
      ]
    }
  ]
}
```

---

## 🔒 3. 보안 인증 정책 (HMAC 서명)

무료 Vercel 배포망과 사내 기지국 간의 보안을 보장하기 위해, API 요청 헤더에 **HMAC-SHA256 디지털 서명**을 포함하여 인증을 수행합니다.

- **헤더 명**: `X-KMC-Signature`
- **서명 생성 방식**:
```text
Signature = HexEncode(HMAC_SHA256(SecretKey, RequestPayload + RequestTimestamp))
```
- Vercel/BFF 단에서 `SecretKey`를 대조하여 서명이 유효한 경우에만 Supabase DB 쓰기(UPSERT)를 허용함으로써, 외부 악의적 데이터 인입을 완전 차단합니다.
