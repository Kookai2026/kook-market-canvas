# APP_STOCK 착수 전 개발계획서

작성일: 2026-06-03  
기준 문서: `docs/deep-research-report.md`

## 1. 개발 목표

APP_STOCK의 1차 목표는 단순 주식 정보 서비스가 아니라, **유망섹터 밸류체인 캔버스**, **Musk Stack 관계 검증 탭**, **종목/ETF 판단 카드**, **개인화 랜딩**을 결합한 투자 리서치 작업대를 구축하는 것이다.

초기 제품은 사용자가 뉴스에서 출발해 산업 노드, 관계 증빙, 관련 종목/ETF, 투자 적합도와 과열도를 한 화면 흐름으로 확인하고, 관심 대상을 즐겨찾기와 알림으로 다시 랜딩에 반영하는 구조를 목표로 한다.

## 2. MVP 범위

### P0 필수 범위

| 기능 | 설명 | 산출물 |
|---|---|---|
| 개인화 랜딩 | 주요 뉴스, 즐겨찾기, 오늘의 시그널, 최근 캔버스 업데이트 | 랜딩 화면, 랜딩 API |
| 유망섹터 밸류체인 | 섹터별 노드/엣지/종목/ETF 연결 탐색 | 캔버스 화면, 노드 상세 패널 |
| Musk Stack | 직접 계약/납품/검증 관계 중심 탭 | 관계카드, 검증등급, 증빙 링크 |
| 종목/ETF 카드 | 한줄판정, 투자 적합도, 과열도, 수급, 컨센서스 | 카드 UI, 스코어 API |
| 즐겨찾기 | 종목, ETF, 노드, 캔버스, 관계카드 저장 | 즐겨찾기 모델, 랜딩 반영 |
| 캔버스 버전관리 | 초안, 검토, 발행, 롤백, 변경 비교 | 버전 모델, diff 정책 |

### P1 확장 범위

| 기능 | 설명 |
|---|---|
| 뉴스/공시 피드 | Naver News API, OpenDART 중심 메타 피드 |
| 히트맵 | 국내/미국/암호화폐 유니버스의 등락/거래대금 시각화 |
| 알림 | 점수 변화, 공시, 뉴스, 캔버스 변경, 관계등급 변경 |
| 관리자 CMS | 노드/엣지/증빙/발행 승인 관리 |

### P2 후속 범위

| 기능 | 설명 |
|---|---|
| 고급 검색 | PostgreSQL FTS 이후 시맨틱 검색 검토 |
| 협업 편집 | 댓글, 승인 플로우, 변경 리뷰 |
| 프리미엄 데이터 | Reuters/Bloomberg/고급 컨센서스 라이선스 연동 |
| 네이티브 앱 보강 | 홈 위젯, 네이티브 알림, 백그라운드 작업 |

## 3. 권장 아키텍처

### 전체 구조

```text
Web/PWA + Admin
    |
    v
API Gateway / BFF
    |
    +-- Landing / Favorites / Alerts API
    +-- Sector Canvas / Musk Stack API
    +-- Instrument Card / Scoring API
    +-- Search API
    |
    v
Domain Services
    |
    +-- Canvas Service
    +-- Market Ingestion
    +-- News & Disclosure Ingestion
    +-- Scoring Engine
    +-- Materializer
    +-- Alert Worker
    |
    v
Storage
    |
    +-- PostgreSQL
    +-- Redis
    +-- Object Storage
```

### 기술 스택 권장안

| 영역 | 권장안 | 사유 |
|---|---|---|
| 프론트엔드 | Next.js App Router 기반 PWA | 랜딩/섹터 페이지 초기 속도, 설치형 웹앱 대응 |
| 관리자 | Next.js Admin | 캔버스/증빙/CMS 운영 화면 공통화 |
| BFF/API | TypeScript 기반 NestJS 또는 Fastify | 프론트 전용 API 조합, 인증, 캐시, 레이트리밋 |
| 수집 워커 | Python 또는 TypeScript | 외부 API 어댑터와 배치 처리 |
| 스코어링 | Python | 지표 계산, 정규화, 룰 기반 한줄판정 |
| DB | PostgreSQL | 관계형 모델, JSONB, FTS, pg_trgm |
| 캐시/큐 | Redis | 핫 카드 캐시, 레이트리밋, 워커 버퍼 |
| 원시 데이터 | S3 호환 Object Storage | 재처리, 감사, 원본 보존 |
| 배포 | GitHub Actions + Terraform | MVP 단계의 명확한 CI/CD와 IaC |

## 4. 데이터 소스 계획

| 데이터 영역 | 1순위 | 용도 | 주의사항 |
|---|---|---|---|
| 국내 시세/ETF/ETN/수급 | KIS Open API | 카드, 히트맵, 수급 | 인증키와 레이트리밋은 BFF/워커에서 관리 |
| 국내 공시/재무 | OpenDART | 재무, 공시, 관계 증빙 | 호출량 제한과 원문 링크 보존 필요 |
| 국내 뉴스 | Naver News API | 랜딩/섹터 뉴스 메타 | 본문 저장보다 메타/링크 중심 |
| 미국 가격 | Polygon | 미국 카드/히트맵 | 플랜별 지연/범위 확인 |
| 미국 컨센서스 | Finnhub | 목표주가/투자의견 | Premium 여부와 라이선스 확인 |
| 기술지표 | 자체 계산, Alpha Vantage 보조 | RSI, 변동성, 추세 | 핵심 지표는 자체 재현성 우선 |
| 암호화폐 | Upbit | KRW 마켓 히트맵 | 프론트 직호출 대신 BFF 프록시 |
| 프리미엄 미디어 | Reuters/Bloomberg | 후속 고급 피드 | 계약 전 본문/데이터 내재화 금지 |

## 5. 핵심 데이터 모델

| 엔터티 | 역할 |
|---|---|
| `user` | 사용자 계정과 개인화 기준 |
| `sector` | 유망섹터 상위 분류 |
| `value_chain_node` | 세부 산업/기술/부품 노드 |
| `node_relation` | 노드 간 관계와 방향성 |
| `instrument` | 주식, ETF, ETN, 레버리지, 코인 |
| `node_instrument_link` | 노드와 종목/ETF의 연결 |
| `relation_evidence` | 계약, 납품, 공시, IR 등 증빙 |
| `metric_snapshot` | 가격, 수급, 재무, 기술지표 스냅샷 |
| `score_snapshot` | 투자 적합도, 과열도, 신뢰도 |
| `consensus_snapshot` | 목표주가, 투자의견, 커버리지 |
| `news_item` | 뉴스 메타데이터 |
| `disclosure_item` | 공시 메타데이터 |
| `canvas` | 캔버스 단위 |
| `canvas_version` | 초안/검토/발행/보관 버전 |
| `favorite` | 종목/노드/관계/캔버스 즐겨찾기 |
| `alert_rule` | 사용자 알림 조건 |
| `audit_log` | 편집, 발행, 권한 변경 감사 |

## 6. API 설계 초안

| 메서드 | 엔드포인트 | 설명 |
|---|---|---|
| GET | `/api/v1/landing` | 개인화 랜딩 데이터 |
| GET | `/api/v1/sectors` | 유망섹터 목록 |
| GET | `/api/v1/sectors/{slug}/canvas` | 섹터 캔버스 |
| GET | `/api/v1/musk-stack/canvas` | Musk Stack 캔버스 |
| GET | `/api/v1/nodes/{nodeId}` | 노드 상세 |
| GET | `/api/v1/instruments/{symbol}/card` | 종목/ETF 대표 카드 |
| GET | `/api/v1/relations/{relationId}` | 관계카드 상세 |
| GET | `/api/v1/heatmap` | 시장 히트맵 |
| GET | `/api/v1/news` | 뉴스/공시 피드 |
| POST | `/api/v1/favorites` | 즐겨찾기 생성 |
| GET | `/api/v1/favorites` | 즐겨찾기 조회 |
| POST | `/api/v1/alerts` | 알림 규칙 생성 |
| GET | `/api/v1/canvases/{id}/versions` | 캔버스 버전 목록 |
| POST | `/api/v1/admin/canvases/{id}/publish` | 캔버스 발행 |
| POST | `/api/v1/admin/relations/evidence` | 관계 증빙 등록 |

## 7. 점수 정책 초안

### 투자 적합도

```text
InvestmentFit =
  0.30 * Quality
+ 0.25 * Valuation
+ 0.20 * Flow
+ 0.15 * Technical
+ 0.10 * Catalyst
```

### 과열도

```text
Overheat =
  0.40 * RSIExcess
+ 0.25 * ReturnZ20
+ 0.20 * TurnoverZ20
+ 0.15 * TargetGapStretch
```

### 해석 기준

| 과열도 | 의미 |
|---|---|
| 0~34 | 저평가·관찰 |
| 35~54 | 정상 |
| 55~69 | 탄력 구간 |
| 70~84 | 과열 경계 |
| 85~100 | 고위험 추격 구간 |

### Musk Stack 관계 검증등급

| 등급 | 의미 |
|---|---|
| A | 직접 계약/납품 확인 |
| B | 직접 고객/파트너 언급 확인 |
| C | 간접 공급망 확인 |
| D | 연관성은 있으나 상업관계 불명확 |
| X | 제외 대상 |

## 8. 착수 전 폴더트리

```text
APP_STOCK/
├─ apps/
│  ├─ web/
│  │  ├─ app/
│  │  ├─ components/
│  │  │  ├─ cards/
│  │  │  ├─ canvas/
│  │  │  ├─ favorites/
│  │  │  ├─ heatmap/
│  │  │  └─ news/
│  │  ├─ hooks/
│  │  ├─ stores/
│  │  └─ styles/
│  ├─ admin/
│  │  ├─ app/
│  │  ├─ components/
│  │  └─ modules/
│  └─ api/
│     └─ src/
│        ├─ common/
│        └─ modules/
│           ├─ alerts/
│           ├─ auth/
│           ├─ canvas/
│           ├─ favorites/
│           ├─ instruments/
│           ├─ landing/
│           ├─ relations/
│           ├─ search/
│           └─ sectors/
├─ services/
│  ├─ alert-worker/
│  ├─ ingestion-disclosure/
│  ├─ ingestion-market/
│  ├─ ingestion-news/
│  ├─ materializer/
│  └─ scoring-engine/
├─ packages/
│  ├─ config/
│  ├─ schemas/
│  ├─ types/
│  ├─ ui/
│  └─ utils/
├─ data/
│  ├─ canvas/
│  ├─ mappings/
│  ├─ seed/
│  └─ taxonomy/
├─ infra/
│  ├─ docker/
│  ├─ k8s/
│  └─ terraform/
│     ├─ envs/
│     ├─ modules/
│     └─ policies/
├─ docs/
│  ├─ adr/
│  ├─ api/
│  ├─ erd/
│  ├─ prd/
│  ├─ qa/
│  └─ runbooks/
└─ .github/
   └─ workflows/
```

## 9. 단계별 개발 계획

| 단계 | 기간 | 목표 | 주요 산출물 |
|---|---:|---|---|
| Phase 0 | 2주 | 기획 확정 | PRD, 정보구조, taxonomy, 점수 정책서 |
| Phase 1 | 3주 | 데이터/백엔드 기반 | ERD, API 명세, 소스 매핑, 샘플 데이터 |
| Phase 2 | 4주 | 핵심 화면 MVP | 랜딩, 유망섹터 캔버스, Musk Stack, 카드 |
| Phase 3 | 3주 | 개인화/시장 탐색 | 즐겨찾기, 알림, 히트맵 |
| Phase 4 | 3주 | 운영 기능 | 관리자 CMS, 버전 diff, 롤백, 감사로그 |
| Phase 5 | 3주 | 모바일/PWA/품질 | PWA 설치, 웹 푸시, QA, 성능 개선 |
| Phase 6 | 4주 | 고급 확장 | 프리미엄 데이터, 고급 검색, 협업 편집 |

## 10. 착수 전 결정 필요사항

| 항목 | 결정 필요 내용 |
|---|---|
| 우선 시장 | 국내 중심 MVP인지, 국내+미국 동시 MVP인지 |
| 데이터 계약 | KIS, DART, Naver, Polygon, Finnhub, Upbit API 키 확보 일정 |
| Musk Stack 기준 | A/B 등급만 노출할지, C 등급까지 노출할지 |
| 초기 섹터 | AI 인프라, 전력망, HBM, 로봇, 우주 등 1차 taxonomy 확정 |
| 인증 방식 | 개인 계정 필수 여부, 게스트 범위 |
| 운영자 역할 | 리서치 에디터/관리자/검수자 권한 구분 |
| 배포 환경 | 클라우드 벤더, 리전, 도메인, 인증서 |
| 법무 검토 | 뉴스/리서치/미디어 데이터 저장 범위 |

## 11. 리스크와 대응

| 리스크 | 영향 | 대응 |
|---|---|---|
| 외부 API 레이트리밋 | 카드/뉴스 지연 | BFF 캐시, 워커 큐, stale badge |
| 라이선스 위반 | 서비스 중단/법무 리스크 | 계약 전 본문 저장 금지, 메타/링크 중심 |
| 관계 검증 부실 | Musk Stack 신뢰도 하락 | A/B/C/D/X 등급과 증빙 필수화 |
| 점수 불신 | 사용자 이탈 | 점수 산식 공개, 근거 태그 역추적 |
| 캔버스 오발행 | 잘못된 투자 판단 유도 | 발행 승인, 롤백, 감사로그 |
| 모바일 성능 저하 | 반복 사용성 저하 | PWA 캐시, 카드 단위 lazy loading |

## 12. 착수 조건

개발 착수 전 아래 항목을 완료해야 한다.

| 체크 | 항목 |
|---|---|
| [ ] | MVP 범위 P0/P1/P2 승인 |
| [ ] | 1차 섹터 taxonomy 확정 |
| [ ] | Musk Stack 검증등급 운영 기준 확정 |
| [ ] | 데이터 소스별 API 키/계약 상태 확인 |
| [ ] | ERD 초안 승인 |
| [ ] | API 명세 초안 승인 |
| [ ] | 디자인 방향과 핵심 화면 와이어프레임 승인 |
| [ ] | 배포/운영 환경 결정 |
| [ ] | 개인정보/뉴스/리서치 라이선스 검토 |

## 13. 무료 퍼블릭 웹 배포 전략 (KMC)

KMC(KOOK Market Canvas)는 내부 시스템이 아닌 외부 퍼블릭 웹에서 동작하며, 사령관님 부부가 언제 어디서나 모바일/PC로 조회하고 작업할 수 있어야 합니다. 이를 위해 **비용 0원(Free Tier)으로 가동하는 클라우드 퍼블리싱 아키텍처**를 다음과 같이 설계합니다.

### 🌐 인프라 무료 티어 매핑안

| 서비스 영역 | 무료 클라우드 플랫폼 | 역할 | 특징 |
|---|---|---|---|
| **프론트엔드 (Apps/Web)** | **Vercel** 또는 **Cloudflare Pages** | Next.js App Router & PWA 정적 셸 배포 | 전 세계 초고속 CDN 무료 제공, 무제한 대역폭(CF), 모바일 홈화면 설치 대응 |
| **데이터베이스 (PostgreSQL)** | **Supabase** 또는 **Neon.tech** | 지식 그래프, 종목/관계 스냅샷 및 즐겨찾기 저장 | 500MB 무료 용량 제공 (개인/부부 리서치 용도로 넉넉함), RESTful API 자동 맵 제공 |
| **백엔드 API (Apps/Api)** | **Koyeb** 또는 **Render** | BFF Gateway & 인증 처리 | Docker 컨테이너 무료 배포. Koyeb은 상시 구동 무료 인스턴스 1개 제공 |

### 🛠️ 하이브리드 수집/스코어링 전략 (비용 및 보안 극대화)
퍼블릭 클라우드에 24시간 수집기나 Python 스코어링 데몬을 띄우는 것은 무료 티어 한계(CPU 시간 초과, 메모리 부족)에 부딪히기 쉽고, API 키가 노출될 수 있습니다. 이를 해결하기 위해 **사내(Company) 서버에 설치된 KOOK-MECHA(로컬 기지국)와 KMC(퍼블릭 웹)를 비동기로 결합하는 하이브리드 데이터 플로우**를 채택합니다.

```text
[사내(Company) 기지국: KOOK-MECHA]
 - Hermes 수집 데몬 (DART, KIS, Naver 뉴스, Upbit)
 - Python 스코어링 엔진 (투자 적합도, 과열도 연산)
        | (회사 인프라 리소스 사용 완료)
        v
 [BFF API 업로드] -> HTTPS POST /api/v1/sync
        |
        v
[퍼블릭 웹: KMC 클라우드]
 - Supabase DB (Read Model 데이터만 동적 업데이트)
 - Vercel Next.js Web/PWA (사령관님 부부 모바일/PC 브라우저 조회)
```

- **장점**:
  1. **완전 무료**: 클라우드 CPU 사용량을 거의 0으로 억제하여 Vercel/Supabase의 평생 무료 플랜만으로 무중단 서비스 제공 가능.
  2. **API 시크릿 보안**: KIS, OpenDART 등의 마스터 키가 안전한 사내 내부 서버에만 보관됨.
  3. **초고속 응답**: 프론트엔드는 클라우드 DB에 적재된 가벼운 결과 데이터(Read Model)만 읽으므로 속도가 매우 빠름.

---

## 14. 분석 섹터 선정 기준 및 종목 리밸런싱 정책

### 🎯 초기 분석 섹터 선정의 3대 가치(Value) 기준
KMC에 올릴 최초의 유망 섹터는 다음 세 가지 명확한 가치 프레임워크를 기반으로 엄격하게 선별합니다.

1. **투자 자본지출(CAPEX) 견인성**: 글로벌 빅테크 및 전력 기업의 대규모 선행 인프라 투자가 강제 집행되어, 하위 공급망의 실적 턴어라운드가 재무적으로 확정되는 섹터 (예: AI 데이터센터 전력망, HBM 패키징 공정).
2. **공급망 증빙 명확성 (Musk Stack 부합도)**: 단순 연상이나 테마 중심이 아니라, 실제 대기업(Tesla, SpaceX, Nvidia 등)과의 납품 계약 공시(DART) 또는 원재료 직공급 연결 고리가 문서로 증명되는 노드 구조.
3. **금융 상품(ETF) 익스포저 적합성**: 개별 종목의 변동성 리스크를 회피하고 섹터 전체 성장에 쉽게 베팅할 수 있도록, 시장에 활성화된 ETF 구성종목과 정합성이 높은 노드 매핑.

### 🔄 지표 기반 동적 리밸런싱 정책
캔버스 내부의 관계 및 종목 리스트는 고정되지 않고 시장 상황에 맞춰 주기적으로 갱신됩니다.

1. **1차 수동 기획 매핑**: 서비스 착수 및 캔버스 초기 생성 시에는 사령관님의 기획과 리서치 데이터를 바탕으로 선도주와 밸류체인 관계를 1차로 수동 매핑합니다.
2. **기술적/수급 지표 기반 자동 재편성 제안**:
   - 수집 워커가 업데이트하는 시장 가격 및 수급 지표를 기반으로, 연결 종목의 단기 과열 여부(RSI > 75 또는 < 30)나 수급 붕괴(기관/외국인 동반 순매도)가 감지되면 해당 노드의 연결 강도를 캔버스 상에 색상으로 경고합니다.
   - 주기적으로 목표주가 괴리율과 스코어 변화를 계산하여, 동일 노드 내 저평가/고효율 대안 종목으로의 **포트폴리오 리밸런싱 알림 및 교체 종목 추천** 기능을 가동합니다.

---

## 15. 결론 및 착수 체크리스트

APP_STOCK은 차트 중심 앱이 아니라 **산업 지식 그래프와 투자 판단 카드를 결합한 리서치 운영 시스템**으로 설계해야 한다. 1차 개발은 유망섹터 캔버스, Musk Stack, 대표 카드, 개인화 랜딩, 캔버스 버전관리를 중심으로 제한하고, 히트맵·알림·관리자 CMS를 뒤이어 붙이는 순서가 적절하다.

### 📋 최종 착수 조건 체크리스트

- [ ] MVP 범위 P0/P1/P2 승인
- [ ] 1차 섹터 taxonomy 및 3대 밸류 기준 확정
- [ ] Musk Stack 검증등급 운영 기준 확정
- [ ] 무료 클라우드(Vercel, Supabase, Koyeb) 개발용 가입 완료 및 API 키 확보
- [ ] 사내 기지국 <-> 퍼블릭 KMC 동기화 API 스펙 정의
- [ ] ERD 초안 승인
- [ ] 디자인 방향과 핵심 화면 와이어프레임 승인
- [ ] 1차 수동 기획 종목 선정 및 2차 지표 기반 리밸런싱 트리거 규칙 확정

이 계획서 기준으로 다음 산출물은 `PRD`, `ERD`, `API 명세`, `초기 taxonomy`, `와이어프레임`이다. 이 다섯 가지가 확정된 뒤 실제 구현에 들어가는 것이 맞다.

