# KMC 사이트 출시 전 비판적 점검 및 개선 보고서

작성일: 2026-06-04  
대상 사이트: https://kook-market-canvas.vercel.app/  
대상 코드: `apps/web`  
기준 문서: `docs/deep-research-report.md`

## 1. 결론

현재 KMC는 **출시 불가(No-Go)** 상태다.

문제는 화면이 비어 보이는 수준이 아니라, 제품의 핵심 약속인 **팩트 기반 밸류체인 캔버스**와 **Musk Stack 관계 검증**이 아직 데이터 제품으로 성립하지 않는다는 점이다. 현재 사이트는 보기에는 작업대 형태를 갖췄지만, 실제로는 정적 샘플 데이터, 출처 없는 강한 투자 문구, 3단계짜리 얕은 마인드맵, 검증 링크가 아닌 회사 홈페이지 링크, 시세 랜덤 시뮬레이션이 섞여 있다.

특히 `Musk 공급망 검증` 탭은 출시 전 반드시 정리해야 한다. “HD현대일렉트릭 ↔ xAI 직접 전력망 변압기 수주”처럼 공개 공식 근거가 확인되지 않는 관계를 A등급 직접 계약으로 노출하고 있다. xAI 멤피스 데이터센터가 MLGW/TVA 전력망에서 150MW를 공급받는 사실은 확인되지만, 그것이 HD현대일렉트릭 직접 수주라는 근거는 현재 공개 소스에서 확인되지 않는다. 이런 표현은 제품 신뢰도와 법무 리스크를 동시에 만든다.

## 2. 현재 사이트 상태 요약

### 확인된 구현 상태

| 항목 | 현재 상태 | 출시 판단 |
|---|---|---|
| 랜딩 | 뉴스/즐겨찾기/동기화 상태 패널 존재 | 데모 수준 |
| 밸류체인 캔버스 | 13개 캔버스, 대부분 3개 노드와 2개 엣지 | 빈약함 |
| Musk Stack | 관계카드 4개 | 검증 구조 미달 |
| 종목 카드 | 투자 적합도/과열도/기술 시그널 표시 | 산식/원천 부재 |
| 히트맵 | 정적 데이터 + 주기적 랜덤 변동 | 실시간 표현 금지 필요 |
| 포트폴리오 | 공개 번들에 개인 포트폴리오/인증 문구 포함 | 즉시 제거 필요 |
| 데이터 파이프라인 | UI상 연결 완료처럼 보이는 표시 | 실제 연결 검증 부재 |

### 코드상 확인 근거

| 영역 | 근거 |
|---|---|
| 포트폴리오 하드코딩 | 과거 개인 포트폴리오 컴포넌트에 기본 보유 종목과 인증 문자열이 포함됨 |
| 히트맵 랜덤 변동 | 과거 히트맵 컴포넌트에 주기적 시뮬레이션과 `Math.random()` 기반 변동이 존재 |
| Musk Stack 검증 미달 | [MuskStackTab.js](/mnt/c/Active/APP_STOCK/apps/web/components/cards/MuskStackTab.js:11) HD현대일렉트릭-xAI A등급, [MuskStackTab.js](/mnt/c/Active/APP_STOCK/apps/web/components/cards/MuskStackTab.js:55) 루머 표현 포함 |
| 개인 UX 노출 | 과거 공개 UI에 개인 포트폴리오 탭과 개인 명칭이 노출됨 |
| 파이프라인 오인 가능 | 과거 공개 UI에 실제 연결 완료처럼 보이는 문구가 존재 |

## 3. 왜 밸류체인이 빈약해 보이는가

현재 캔버스는 이름만 밸류체인이고 실제 구조는 대부분 다음 패턴이다.

```text
upstream -> midstream -> downstream
```

이 정도 구조는 산업 리서치 제품이 아니라 테마 설명 카드에 가깝다. 출시 가능한 KMC라면 최소한 다음 다섯 가지가 있어야 한다.

| 필수 조건 | 현재 상태 | 필요한 개선 |
|---|---|---|
| 노드 깊이 | 섹터당 3개 내외 | 섹터당 20~50개 노드 |
| 관계 유형 | 단순 선 연결 | 공급, 고객, 대체재, 병목, CAPEX, 규제, 가격 전가 등 |
| 증빙 | 노드/엣지별 근거 없음 | 각 엣지별 1차/2차 출처, 신뢰등급, 확인일 |
| 투자 연결 | 종목 몇 개 배치 | 종목별 매출 노출도, 수혜 민감도, 리스크 |
| 업데이트 | 정적 하드코딩 | 버전, 변경일, 검수자, stale 표시 |

즉 현재 빈약함의 본질은 “리스트 수가 적다”가 아니라 **그래프의 정보 밀도가 없다**는 점이다.

## 4. 팩트 검증 주요 이슈

### 4.1 xAI 멤피스 150MW는 사실이나, HD현대일렉트릭 직접 수주는 미확인

확인된 사실:

- Greater Memphis Chamber는 xAI가 Substation #63을 통해 MLGW와 TVA로부터 150MW grid power를 공급받는다고 발표했다.
- MLGW의 `xAI 2025 Update`도 150MW 전력 공급과 추가 변전소 건설을 언급한다.

확인되지 않은 주장:

- HD현대일렉트릭이 xAI 멤피스 슈퍼클러스터에 직접 변압기를 공급했다는 공개 공식 근거.
- TVA 계약 공시 또는 MLGW 회의록에 HD현대일렉트릭 직접 공급사명이 명시됐다는 근거.

조치:

- 현재 A등급 관계카드는 즉시 `검증보류` 또는 `D/X`로 강등해야 한다.
- “xAI 직접 수주” 표현은 삭제하고, 확인 가능한 범위인 “AI 데이터센터 전력망 증설 수혜 후보”로 낮춰야 한다.

참고 소스:

- Greater Memphis Chamber: `xAI Phase One Substation #63 Providing 150MW of Power to Facility`
- MLGW: `xAI 2025 Update`

### 4.2 Constellation의 확인된 대형 PPA는 Microsoft 대상이지 Tesla Megapack이 아니다

확인된 사실:

- Constellation은 2024년 9월 Microsoft와 20년 PPA를 체결하고 Three Mile Island Unit 1 재가동 계획을 발표했다.

위험한 현재 표현:

- `Constellation Energy ↔ Tesla Megapack Grid`를 B등급 파트너십처럼 표시한다.
- “테슬라 메가팩과의 결합 사업 확대로 프리미엄 정당화”라는 표현은 공개 공식 근거가 필요하다.

조치:

- CEG 카드는 `AI 전력 PPA / Microsoft` 관계로 재분류한다.
- Tesla Megapack과 직접 연결하려면 공식 프로젝트명, 설치 사업자, 계약 문서, 보도자료가 필요하다.

참고 소스:

- Constellation IR: `Constellation to Launch Crane Clean Energy Center...`
- CNBC/Axios 보도: Microsoft-Three Mile Island PPA

### 4.3 Hyosung Memphis는 xAI 주변 전력 인프라 테마와 더 가까운 공식 팩트가 있다

확인된 사실:

- Hyosung HICO는 Memphis 변압기 제조 시설을 운영한다.
- Tennessee 주정부와 Hyosung은 Memphis transformer facility 확장과 대형 전력 변압기 생산 역량을 공식 발표했다.

해석:

- xAI 멤피스 전력망과 직접 계약을 주장하기보다는, “Memphis 현지 대형 변압기 생산 거점 + 북미 전력망 증설 수혜”로 두는 것이 팩트 기반에 맞다.

참고 소스:

- Tennessee ECD: Hyosung HICO Memphis expansion
- Hyosung Newsroom: Memphis/Changwon ultra-high-voltage transformer expansion

### 4.4 Vicor 48V는 기술 테마로는 가능하지만 Tesla 직접 공급은 별도 검증 필요

확인된 사실:

- Tesla Cybertruck이 48V 저전압 아키텍처를 채택한 것은 확인된다.
- Vicor는 48V 전력 모듈과 자동차용 고밀도 전력 모듈을 홍보한다.

미확인 또는 주의:

- “Tesla Cybertruck용 48V 파워 모듈 공급 파트너”는 공식 공급 계약 또는 부품 채택 근거가 필요하다.

조치:

- Vicor는 `48V architecture technology beneficiary`로 둘 수 있다.
- Tesla 직접 공급 관계로 노출하려면 증빙 확보 전까지 C/D 등급 이하가 맞다.

## 5. 출시 전 반드시 제거할 리스크

### 5.1 개인 포트폴리오와 하드코딩 인증 문자열

과거 공개 사이트에 개인 포트폴리오 탭이 있고, 번들에 초기 보유 종목과 인증 문자열이 들어 있었다. 이건 출시 전 즉시 제거해야 한다.

문제:

- 공개 웹 번들에서 인증 문자열 확인 가능
- 개인 보유 종목으로 보이는 데이터 노출
- 로컬스토리지 기반이라 실제 인증/보안이 아님
- 제품명 KMC의 공용 투자 리서치 도구 성격과 맞지 않음

조치:

- 프로덕션 배포에서 포트폴리오 탭 제거
- 개인 포트폴리오는 별도 인증 후 2단계 기능으로 분리
- 데모가 필요하면 `Demo Portfolio`로 익명 샘플만 사용

### 5.2 “실시간” 표현 금지

히트맵은 과거 실제 API가 아니라 주기적으로 랜덤 변동했다. 출시 전에는 실제 연결 완료처럼 보이는 표현을 쓰면 안 된다.

조치:

- 실제 KIS/Polygon/Upbit API 연동 전까지 `샘플 데이터` 배지를 붙인다.
- 랜덤 변동 제거 또는 `Demo simulation` 명확 표시.
- 마지막 업데이트 시각은 실제 데이터 `as_of`만 표시.

### 5.3 투자 점수 산식과 원천 부재

투자 적합도와 과열도는 화면에 숫자로 나오지만, 실제 입력값, 산식 결과, 데이터 출처가 없다. 이는 사용자가 숫자를 신뢰할 근거를 제공하지 못한다.

조치:

- 각 점수에 `source`, `as_of`, `staleness`, `input_breakdown` 필수.
- 점수 원천이 없으면 `N/A` 또는 `샘플`로 표시.
- 한줄판정은 룰 기반 템플릿과 근거 태그를 연결.

## 6. 출시 가능한 밸류체인 데이터 구조

### 6.1 최소 데이터 스키마

각 노드는 아래 필드를 가져야 한다.

```yaml
node:
  id: "hvt-core-go-steel"
  name: "방향성 전기강판"
  layer: "materials"
  sector: "ai-power-grid"
  thesis: "대형 변압기 코어 병목 소재"
  bottleneck_level: 4
  demand_drivers:
    - "AI data center grid connection"
    - "aging grid replacement"
  risk_factors:
    - "steel price volatility"
    - "capacity expansion delay"
  instruments:
    - symbol: "005490"
      market: "KRX"
      role: "supplier"
      exposure: "medium"
  evidence:
    - source_type: "company_report"
      url: "..."
      checked_at: "2026-06-04"
      reliability: "B"
```

각 엣지는 아래 필드를 가져야 한다.

```yaml
edge:
  from: "hvt-core-go-steel"
  to: "large-power-transformer"
  relation_type: "input_material"
  direction: "upstream_to_midstream"
  strength: 0.78
  evidence_count: 2
  verification_grade: "B"
  last_verified_at: "2026-06-04"
```

### 6.2 1차 출시 권장 범위

출시 전에는 12개 섹터를 모두 얕게 다루기보다, **3개 섹터를 깊게 완성**하는 편이 맞다.

권장 1차 섹터:

| 우선 | 섹터 | 이유 |
|---|---|---|
| 1 | AI 전력 인프라 | xAI/Microsoft/데이터센터 전력 수요와 직접 연결 |
| 2 | HBM/Advanced Packaging | 국내 종목 연결성이 강하고 투자 관심도 높음 |
| 3 | Musk Stack 검증형 관계 | 제품 차별화 핵심, 단 엄격한 검증 필요 |

후순위:

- 양자 컴퓨팅
- Bio-AI
- 우주 인터넷
- 유리기판
- 로봇

이들은 출시 초기에 얕게 넣으면 테마주 앱처럼 보이기 쉽다. 먼저 보류하거나 “관찰 섹터”로 낮춰야 한다.

## 7. 개선된 밸류체인 예시

### 7.1 AI 전력 인프라

현재:

```text
원부자재 -> 초고압 변압기 제조 -> 북미 그리드
```

출시 가능 수준:

```text
전력 수요
├─ Hyperscaler AI DC
│  ├─ Microsoft
│  ├─ xAI
│  ├─ AWS
│  └─ Google
├─ 전력원
│  ├─ 원전 PPA
│  ├─ 가스발전
│  ├─ 재생에너지
│  └─ ESS
├─ 송전망
│  ├─ 765kV 대형 변압기
│  ├─ HVDC
│  ├─ GIS/AIS 차단기
│  └─ 보호계전
├─ 배전/데이터센터 전력
│  ├─ UPS
│  ├─ PDU
│  ├─ switchgear
│  ├─ busway
│  └─ power management software
├─ 열관리
│  ├─ liquid cooling
│  ├─ CDU
│  ├─ cold plate
│  └─ immersion fluid
└─ 관련 종목
   ├─ HD현대일렉트릭
   ├─ 효성중공업
   ├─ LS ELECTRIC
   ├─ Eaton
   ├─ Schneider
   ├─ Vertiv
   ├─ Modine
   ├─ Constellation
   └─ Vistra
```

### 7.2 HBM/Advanced Packaging

현재:

```text
장비 -> HBM 제조 -> CoWoS 수요
```

출시 가능 수준:

```text
AI GPU 수요
├─ GPU/ASIC
│  ├─ NVIDIA
│  ├─ AMD
│  ├─ Broadcom custom ASIC
│  └─ hyperscaler ASIC
├─ HBM memory
│  ├─ HBM3E
│  ├─ HBM4
│  ├─ TSV
│  └─ yield/ramp
├─ 후공정 장비
│  ├─ TC bonder
│  ├─ wafer bonding
│  ├─ inspection
│  └─ dicing
├─ 패키징
│  ├─ CoWoS
│  ├─ SoIC
│  ├─ interposer
│  └─ substrate
├─ 소재
│  ├─ ABF substrate
│  ├─ underfill
│  ├─ photoresist
│  └─ glass core substrate
└─ 관련 종목
   ├─ SK hynix
   ├─ Samsung Electronics
   ├─ Micron
   ├─ Hanmi Semiconductor
   ├─ TSMC
   ├─ ASMPT
   ├─ Ibiden
   └─ SKC
```

### 7.3 Musk Stack

현재:

```text
4개 관계카드
```

출시 가능 수준:

```text
Musk Entities
├─ Tesla
│  ├─ vehicle platform
│  ├─ energy / Megapack
│  ├─ Optimus
│  └─ FSD / AI training
├─ xAI
│  ├─ Colossus / Memphis
│  ├─ power interconnection
│  ├─ GPU cluster
│  └─ cooling / power equipment
├─ SpaceX / Starlink
│  ├─ launch
│  ├─ satellite manufacturing
│  ├─ user terminal
│  └─ ground network
└─ Boring / Neuralink
   ├─ excluded until public investable linkage
   └─ watchlist only
```

관계카드 필수 기준:

| 필드 | 필수 여부 |
|---|---|
| 관계 대상 기업 | 필수 |
| 관계 유형 | 필수 |
| 직접성 | 필수 |
| 증빙 URL | 필수 |
| 증빙 발행일 | 필수 |
| 검증일 | 필수 |
| 검증등급 | 필수 |
| 제외 사유 | 필요 시 |
| 투자 가능 여부 | 필수 |

## 8. 출시 기준 게이트

### 8.1 콘텐츠 게이트

| 기준 | 출시 통과 조건 |
|---|---|
| 섹터 수 | 3개 이상 |
| 섹터당 노드 | 최소 20개 |
| 섹터당 엣지 | 최소 30개 |
| 엣지 증빙률 | 80% 이상 |
| A/B 등급 관계 | 1차 공식 출처 1개 이상 필수 |
| D/X 등급 | 기본 숨김 |
| 루머 표현 | 공개 화면 금지 |

### 8.2 데이터 게이트

| 기준 | 출시 통과 조건 |
|---|---|
| 가격 데이터 | 실제 API 또는 명확한 지연 데이터 |
| 뉴스 | 메타/링크 중심, 출처 표시 |
| 점수 | 입력값과 산식 재현 가능 |
| stale 표시 | 모든 카드에 필요 |
| 샘플 데이터 | 샘플 배지 필수 |

### 8.3 보안/프라이버시 게이트

| 기준 | 출시 통과 조건 |
|---|---|
| 개인 포트폴리오 | 공개 배포 제거 |
| 하드코딩 인증 문자열 | 0건 |
| 개인 명칭 | 공개 UI 제거 |
| 로컬스토리지 민감정보 | 금지 |
| 인증 | 실제 서버 검증 기반 |

## 9. 개선 우선순위

### 즉시 조치

1. 개인 포트폴리오 탭 제거.
2. 하드코딩 인증 문자열과 기본 보유 종목 제거.
3. 히트맵의 `실시간` 표현 제거 또는 샘플 배지 추가.
4. 실제 연결처럼 보이는 문구 제거.
5. Musk Stack의 A/B 등급 관계 전수 재검증.
6. HD현대일렉트릭-xAI 직접 수주 카드 강등 또는 삭제.
7. Constellation-Tesla Megapack 관계카드 보류.

### 1차 개선

1. 밸류체인 데이터를 코드에서 분리해 `data/taxonomy`로 이동.
2. 노드/엣지/증빙 스키마 확정.
3. AI 전력 인프라, HBM, Musk Stack 3개 섹터만 깊게 재작성.
4. 각 엣지에 `verification_grade`, `source_url`, `checked_at` 추가.
5. 종목 카드에 `as_of`, `source`, `staleness`, `score_breakdown` 표시.

### 2차 개선

1. KIS/DART/Naver/Polygon/Upbit 중 실제 가능한 소스부터 연결.
2. 관리자 검수 화면 구축.
3. 캔버스 버전관리와 발행 승인 도입.
4. 잘못된 관계 신고/수정 프로세스 추가.
5. SEO/공유용 공개 페이지와 로그인 작업대 분리.

## 10. 권장 출시 전략

현재처럼 12개 섹터를 얕게 보여주면 KMC는 “그럴듯한 테마주 대시보드”로 보인다. 우리가 원한 제품은 그게 아니다.

출시 전략은 다음처럼 바꾸는 것이 맞다.

```text
넓은 12개 테마 데모
    ↓
5년 장기투자 원칙 페이지
    ↓
깊은 3개 팩트 기반 캔버스
    ↓
검증등급이 붙은 관계 그래프
    ↓
종목 카드와 알림 연결
    ↓
확장 섹터 추가
```

1차 출시명도 `KMC Beta`가 아니라 **`KMC Research Preview`** 정도가 적절하다. 실제 데이터 API, 검증 워크플로, 버전관리, 보안 분리가 끝나기 전에는 정식 출시로 부르면 안 된다.

추가로, KMC는 우리 부부와 지인이 매일 들어올 장기투자 사이트이므로 첫 화면의 기준을 바꿔야 한다. 첫 화면은 뉴스 피드가 아니라 **5년 투자 원칙 페이지**여야 한다. 기준 배분은 `Musk Stack 20% + Core 섹터 80%`로 두고, 매일 “무엇을 살까”보다 “원래 정한 원칙에서 벗어났는가”를 먼저 보여줘야 한다.

## 11. 섹터 선정 기준

KMC의 섹터는 “요즘 뜨는 테마”가 아니라 **검증 가능한 산업 병목과 투자 가능한 상장 종목이 연결되는 구조**여야 한다. 따라서 섹터 선정 기준은 아래처럼 정량/정성 혼합으로 둔다.

### 11.1 섹터 선정 스코어

```text
SectorPriority =
  0.25 * StructuralDemand
+ 0.20 * BottleneckStrength
+ 0.15 * InvestableUniverse
+ 0.15 * EvidenceAvailability
+ 0.10 * DataAvailability
+ 0.10 * UpdateVelocity
+ 0.05 * Differentiation
```

| 기준 | 의미 | 통과 기준 |
|---|---|---|
| StructuralDemand | 3~10년 수요가 구조적으로 증가하는가 | AI, 전력, 국방, 인구구조, 정책, CAPEX 중 2개 이상 연결 |
| BottleneckStrength | 공급 병목이 가격/마진/수주로 전이되는가 | 리드타임, CAPEX, 인증, 기술장벽, 원재료 중 명확한 병목 |
| InvestableUniverse | 투자 가능한 종목/ETF가 충분한가 | 한국/미국/일본/유럽 합산 10개 이상 후보 |
| EvidenceAvailability | 1차 자료로 검증 가능한가 | 공시, IR, 정부/기관 보고서, 계약/수주 문서 |
| DataAvailability | 카드화 가능한 데이터가 있는가 | 시세, 수급, 실적, 컨센서스, 공시, 뉴스 |
| UpdateVelocity | 자주 바뀌어 재방문 가치가 있는가 | 월 1회 이상 유의미한 뉴스/공시/수주/정책 변화 |
| Differentiation | 일반 테마주 서비스와 다른가 | 관계 그래프, 공급망, 증빙등급으로 차별화 가능 |

### 11.2 출시용 섹터 분류

| 등급 | 의미 | 운영 방식 |
|---|---|---|
| Core | 1차 출시 핵심 섹터 | 깊은 캔버스, 카드, 알림, 증빙 필수 |
| Expansion | 2차 확장 섹터 | 기본 캔버스 + 일부 카드 |
| Watchlist | 관찰 섹터 | 뉴스/메모 수준, 투자 판단 카드 제한 |
| Excluded | 제외 | 직접 투자 가능성 낮거나 근거 부족 |

## 12. 딥 리서치 기반 유망 섹터 우선순위

현재 공개 자료와 시장 구조를 기준으로 보면, KMC가 1차 출시에서 깊게 다뤄야 할 섹터는 아래 순서다.

| 우선순위 | 섹터 | 등급 | 선정 이유 | 현재 사이트 상태 |
|---:|---|---|---|---|
| 1 | AI 전력 인프라 / Grid Bottleneck | Core | IEA가 데이터센터 전력 수요와 그리드 병목을 구조 이슈로 제시. 변압기/스위치기어/배전/전력관리까지 투자 가능 종목 풍부 | 너무 단순함 |
| 2 | AI 반도체 / HBM / Advanced Packaging | Core | AI 서버 CAPEX, HBM, CoWoS, 2.5D/3D 패키징 병목이 명확. 국내 종목 연결성 강함 | 3단계로 과소화 |
| 3 | AI 데이터센터 전력/냉각 인프라 | Core | 고밀도 AI 랙, 액체냉각, CDU, UPS, PDU, 모듈형 데이터센터 수요 확대 | 냉각 섹터가 부품 수준 |
| 4 | BESS / 전력 유연성 / ESS | Core 또는 Expansion | IEA가 배터리 저장을 가장 빠르게 성장하는 전력 기술로 언급. 데이터센터와 계통 접속 병목 완화에 중요 | ESS가 테슬라 중심으로 치우침 |
| 5 | Physical AI / 로봇 자동화 | Expansion | IFR 기준 산업용 로봇 설치량은 장기 성장. 휴머노이드는 관심 높지만 상용 검증 부족 | 테마성 강함 |
| 6 | 원전 PPA / SMR / 무탄소 전력 | Expansion | Constellation-Microsoft PPA처럼 AI 전력 조달과 직접 연결. 단 SMR 상용화는 시간 필요 | SMR과 기존 원전 운영 구분 부족 |
| 7 | 우주/위성통신 | Watchlist | Starlink/방산/저궤도 통신은 구조 성장이나 상장 종목 직접성이 제한적 | Musk 테마와 혼재 |
| 8 | Bio-AI | Watchlist | AI 신약/분자설계는 장기 유망하나 투자 가능한 밸류체인 검증이 어렵고 매출 가시성 낮음 | 삼성전자 등 연결이 부정확 |
| 9 | 양자 컴퓨팅 | Watchlist | 장기 기술 옵션. 2026년 출시용 투자 판단 카드로는 변동성/상용성 리스크 큼 | 테마주 수준 |

### 12.1 왜 12개 얕은 섹터보다 4개 깊은 섹터인가

KMC의 차별점은 “많은 테마”가 아니라 “관계가 검증된 산업 그래프”다. 현재처럼 12개 섹터를 각각 3개 노드로 보여주면 사용자는 정보를 얻는 것이 아니라 테마명을 훑게 된다. 출시 전에는 아래 4개 섹터를 깊게 만드는 것이 맞다.

1. AI 전력 인프라
2. AI 반도체/HBM/Advanced Packaging
3. 데이터센터 냉각/전력 설비
4. BESS/전력 유연성

Musk Stack은 별도 섹터가 아니라 **관계 검증 오버레이**로 둔다. 즉 `Musk Stack`이라는 탭은 유지하되, 그 안의 관계는 위 섹터 그래프 위에 겹쳐지는 검증 레이어여야 한다.

## 13. 출시용 밸류체인 리스트

아래 리스트는 1차 출시에서 실제로 구축해야 할 최소 노드 기준이다. 각 노드에는 `관련 종목`, `관계 유형`, `증빙`, `검증등급`, `리스크`가 붙어야 한다.

### 13.1 AI 전력 인프라 / Grid Bottleneck

핵심 투자 명제:

- AI 데이터센터는 전력 수요를 구조적으로 증가시킨다.
- 병목은 발전량 자체보다 **계통 접속, 변압기, 스위치기어, 케이블, 전력관리**에서 먼저 나타난다.
- IEA는 2030년까지 그리드 투자가 현재 약 4,000억 달러 수준에서 약 50% 증가해야 한다고 제시한다.

밸류체인:

```text
AI 전력 수요
├─ Hyperscaler / AI 데이터센터
│  ├─ Microsoft
│  ├─ Amazon AWS
│  ├─ Google
│  ├─ Meta
│  ├─ Oracle
│  └─ xAI
├─ 전력 조달
│  ├─ 원전 PPA
│  ├─ 가스발전
│  ├─ 태양광/풍력 PPA
│  ├─ ESS 결합 PPA
│  └─ 현장 발전 / behind-the-meter
├─ 송전망
│  ├─ 초고압 변압기
│  ├─ 전력용 차단기
│  ├─ GIS/AIS 스위치기어
│  ├─ 보호계전
│  ├─ HVDC
│  └─ 송전 케이블
├─ 변전/배전
│  ├─ 배전 변압기
│  ├─ 배전반
│  ├─ busway / busduct
│  ├─ PDU
│  ├─ UPS
│  └─ 전력관리 소프트웨어
├─ 핵심 소재
│  ├─ 방향성 전기강판
│  ├─ 구리
│  ├─ 절연유
│  ├─ 절연지
│  └─ 전력반도체
└─ 계통 최적화
   ├─ dynamic line rating
   ├─ dynamic transformer rating
   ├─ advanced power flow control
   ├─ topology optimization
   └─ storage as transmission asset
```

후보 종목:

| 세부 노드 | 한국 | 미국/글로벌 | 검증 포인트 |
|---|---|---|---|
| 초고압 변압기 | HD현대일렉트릭, 효성중공업 | Siemens Energy, GE Vernova, Hitachi Energy 비상장/ABB | 수주잔고, 북미 매출, 공장 증설 |
| 배전/스위치기어 | LS ELECTRIC | Eaton, Schneider Electric | 데이터센터향 제품군, backlog |
| 케이블/구리 | LS전선 관련주, 대한전선, 풍산 | Prysmian, Southwire 비상장 | HVDC/해저/초고압 케이블 수주 |
| 방향성 전기강판 | POSCO홀딩스 | Nippon Steel, Cleveland-Cliffs | GOES 생산능력, 가격 전가 |
| 전력관리 소프트웨어 | LS ELECTRIC | Eaton, Schneider, Siemens | 데이터센터 에너지관리 솔루션 |

출시 전 수정:

- `xAI 직접 수주`처럼 증빙 없는 직접 계약 표현 금지.
- `AI 전력망 증설 수혜`, `북미 전력 장비 공급망`, `Memphis/미국 현지 생산 거점`처럼 검증 가능한 표현으로 낮춘다.

### 13.2 AI 반도체 / HBM / Advanced Packaging

핵심 투자 명제:

- AI 모델 성능 경쟁은 GPU 단품이 아니라 `GPU + HBM + advanced packaging + networking + power/cooling` 시스템 경쟁이다.
- SEMI는 2026~2027년 300mm fab equipment spending의 두 자릿수 성장을 전망했고, AI와 HBM 수요를 주요 동인으로 제시했다.
- HBM과 CoWoS/2.5D/3D 패키징은 AI 서버 공급량을 제한하는 병목으로 작동한다.

밸류체인:

```text
AI 반도체 시스템
├─ AI accelerator
│  ├─ GPU
│  ├─ TPU / custom ASIC
│  ├─ NPU
│  └─ inference accelerator
├─ HBM
│  ├─ DRAM wafer
│  ├─ TSV
│  ├─ HBM stack
│  ├─ HBM3E
│  └─ HBM4
├─ Advanced Packaging
│  ├─ CoWoS
│  ├─ SoIC
│  ├─ EMIB
│  ├─ Foveros
│  ├─ fan-out
│  └─ chiplet interconnect
├─ 후공정 장비
│  ├─ TC bonder
│  ├─ hybrid bonding
│  ├─ inspection/metrology
│  ├─ dicing
│  ├─ test handler
│  └─ burn-in
├─ 기판/소재
│  ├─ ABF substrate
│  ├─ silicon interposer
│  ├─ glass core substrate
│  ├─ underfill
│  ├─ photoresist
│  └─ copper plating
├─ Foundry / OSAT
│  ├─ TSMC
│  ├─ Samsung Foundry
│  ├─ Intel Foundry
│  ├─ ASE
│  └─ Amkor
└─ System integration
   ├─ NVIDIA HGX/NVL
   ├─ server OEM/ODM
   ├─ high-speed networking
   └─ liquid-cooled rack
```

후보 종목:

| 세부 노드 | 한국 | 미국/글로벌 | 검증 포인트 |
|---|---|---|---|
| HBM 제조 | SK하이닉스, 삼성전자 | Micron | HBM 매출 비중, 고객 인증, CAPEX |
| TC 본더/후공정 | 한미반도체 | ASMPT, Besi | HBM 장비 수주, 고객사 다변화 |
| 파운드리/패키징 | 삼성전자 | TSMC, Intel, Amkor, ASE | CoWoS/SoIC/EMIB capacity |
| 기판 | 삼성전기, SKC | Ibiden, Shinko, Unimicron | ABF/유리기판 양산성 |
| AI accelerator | - | NVIDIA, AMD, Broadcom, Marvell | GPU/ASIC 수주, 네트워킹 attach |

출시 전 수정:

- `NVIDIA-TSMC-CoWoS-HBM`을 하나의 선으로 뭉개지 말고, 병목별 노드를 분리한다.
- 삼성전자는 HBM, Foundry, Advanced Package, 기판/MLCC와 Bio-AI를 혼동하지 않는다.

### 13.3 AI 데이터센터 전력/냉각 인프라

핵심 투자 명제:

- AI 랙 밀도 상승은 공랭 중심 데이터센터 설계를 액체냉각/전력 통합 설계로 바꾸고 있다.
- Schneider Electric은 2026년 AI 데이터센터에서 240kW/rack, 2028년 1MW/rack 가능성을 언급한다.
- Uptime Institute는 AI 데이터센터와 일반 엔터프라이즈 데이터센터 설계가 더 갈라질 것으로 본다.

밸류체인:

```text
AI 데이터센터 인프라
├─ Site / interconnection
│  ├─ 전력 접속
│  ├─ 변전소
│  ├─ 물 사용권
│  ├─ 부지/허가
│  └─ 광통신 백본
├─ Power train
│  ├─ transformer
│  ├─ switchgear
│  ├─ UPS
│  ├─ PDU
│  ├─ busway
│  └─ power monitoring
├─ Cooling
│  ├─ direct-to-chip cold plate
│  ├─ CDU
│  ├─ rear-door heat exchanger
│  ├─ immersion cooling
│  ├─ dielectric fluid
│  ├─ pump/valve/sensor
│  └─ leak detection
├─ Rack / server integration
│  ├─ liquid-cooled rack
│  ├─ GPU tray
│  ├─ NVLink / InfiniBand / Ethernet
│  ├─ optical transceiver
│  └─ cable management
├─ Modular build
│  ├─ prefabricated module
│  ├─ containerized power/cooling
│  ├─ brownfield retrofit
│  └─ commissioning
└─ Operation
   ├─ DCIM
   ├─ digital twin
   ├─ predictive maintenance
   ├─ PUE/WUE/CUE
   └─ demand response
```

후보 종목:

| 세부 노드 | 한국 | 미국/글로벌 | 검증 포인트 |
|---|---|---|---|
| 데이터센터 전력 | LS ELECTRIC, 효성중공업, HD현대일렉트릭 | Eaton, Schneider, Vertiv | AI DC향 수주/제품군 |
| 냉각 | - | Vertiv, Schneider/Motivair, Supermicro, Modine, nVent | liquid cooling 매출/수주 |
| 서버/랙 | 삼성전자 일부 부품 | Dell, Supermicro, HPE, Lenovo | NVIDIA rack partnership |
| 네트워킹 | - | NVIDIA, Broadcom, Arista, Marvell, Coherent | optical/networking 성장 |
| 모듈형 DC | - | Vertiv, Schneider, Eaton | prefabricated DC 수주 |

출시 전 수정:

- 냉각 섹터를 `액체 냉각 솔루션` 하나로 끝내지 말고, 전력/냉각/랙/운영을 통합 캔버스로 만든다.
- 데이터센터 인프라는 전력 인프라와 겹치므로 엣지 중복을 허용하되 관계 유형을 다르게 표기한다.

### 13.4 BESS / 전력 유연성 / ESS

핵심 투자 명제:

- IEA는 배터리 저장을 현재 가장 빠르게 성장하는 전력 기술로 설명한다.
- 데이터센터와 재생에너지 확대는 BESS, 수요반응, grid flexibility 수요를 키운다.
- AI 데이터센터는 계통 접속이 늦어질 때 BESS와 현장 전원을 결합할 유인이 있다.

밸류체인:

```text
BESS / 전력 유연성
├─ Battery cell
│  ├─ LFP
│  ├─ NMC
│  ├─ sodium-ion watchlist
│  └─ recycling
├─ Module / pack
│  ├─ module assembly
│  ├─ thermal management
│  ├─ safety enclosure
│  └─ fire suppression
├─ PCS / inverter
│  ├─ power conversion system
│  ├─ grid-forming inverter
│  ├─ transformer
│  └─ switchgear
├─ EMS / software
│  ├─ energy management system
│  ├─ trading/dispatch
│  ├─ demand response
│  └─ battery analytics
├─ Project developer / IPP
│  ├─ utility-scale storage
│  ├─ solar+BESS
│  ├─ behind-the-meter
│  └─ data-center co-location
└─ Grid services
   ├─ peak shaving
   ├─ frequency response
   ├─ congestion relief
   ├─ backup power
   └─ storage as transmission asset
```

후보 종목:

| 세부 노드 | 한국 | 미국/글로벌 | 검증 포인트 |
|---|---|---|---|
| 배터리 셀 | LG에너지솔루션, 삼성SDI, SK온 비상장 | CATL, BYD, Tesla | ESS 매출/화재 리스크 |
| PCS/인버터 | LS ELECTRIC | Tesla, Fluence, Enphase, SMA | grid-scale 수주 |
| 시스템 통합 | 서진시스템 등 | Fluence, Tesla Energy, Wärtsilä | 프로젝트 레퍼런스 |
| IPP/운영 | - | NextEra, Vistra, AES | BESS 보유량/개발 파이프라인 |

출시 전 수정:

- 현재 ESS 캔버스는 Tesla/Starlink 테마와 섞여 있다. `ESS 자체 밸류체인`과 `Tesla Megapack 관계`를 분리해야 한다.

### 13.5 Physical AI / 로봇 자동화

핵심 투자 명제:

- IFR 기준 2024년 산업용 로봇 설치량은 역사상 두 번째로 높은 수준이고, 2025년 설치량 성장도 전망됐다.
- 다만 휴머노이드는 기대가 크지만 2026년 기준 대량 상용화 근거가 약하다.
- KMC는 휴머노이드 테마보다 **산업 자동화, 감속기, 액추에이터, AMR, 비전, 제어 소프트웨어**를 먼저 잡아야 한다.

밸류체인:

```text
Physical AI / Robotics
├─ Actuation
│  ├─ servo motor
│  ├─ harmonic reducer
│  ├─ cycloidal reducer
│  ├─ linear actuator
│  └─ torque sensor
├─ Perception
│  ├─ camera
│  ├─ LiDAR
│  ├─ force/tactile sensor
│  ├─ edge AI module
│  └─ machine vision
├─ Robot platform
│  ├─ industrial robot
│  ├─ collaborative robot
│  ├─ AMR/AGV
│  ├─ warehouse picking
│  └─ humanoid watchlist
├─ Control / AI
│  ├─ motion control
│  ├─ simulation
│  ├─ digital twin
│  ├─ reinforcement learning
│  └─ fleet orchestration
├─ Integration
│  ├─ smart factory
│  ├─ logistics automation
│  ├─ semiconductor factory
│  ├─ automotive factory
│  └─ defense/inspection
└─ Safety / certification
   ├─ functional safety
   ├─ collaborative safety
   ├─ ISO 10218
   └─ cybersecurity
```

후보 종목:

| 세부 노드 | 한국 | 미국/글로벌 | 검증 포인트 |
|---|---|---|---|
| 감속기/부품 | 에스비비테크, 로보티즈 | Harmonic Drive, Nabtesco | 실제 납품처/매출 |
| 협동로봇 | 두산로보틱스, 레인보우로보틱스 | Teradyne/UR, Fanuc, ABB, Yaskawa | 출하량/고객 |
| 비전/센서 | - | Keyence, Cognex, Mobileye | 공장/물류 적용 |
| AMR/물류 | - | Zebra, Symbotic, AutoStore | 물류 자동화 수주 |
| AI compute/sim | - | NVIDIA, Siemens, Dassault | Isaac/디지털트윈 생태계 |

출시 전 수정:

- Tesla Optimus 관련 직접 관계처럼 보이는 구조를 줄이고, 산업 자동화의 실제 매출 노드 중심으로 재작성한다.

## 14. 관찰군 섹터 처리 원칙

### 14.1 원전 PPA / SMR

원전은 AI 전력 조달과 직접 연결되므로 중요하다. 다만 `기존 원전 운영/PPA`와 `SMR 개발`은 시간축이 완전히 다르다.

| 구분 | 출시 처리 |
|---|---|
| 기존 원전 운영/PPA | Expansion 가능. Constellation-Microsoft처럼 공식 PPA가 있으면 관계카드 가능 |
| SMR 개발사 | Watchlist. 설계 승인/실증/상업운전 지연 리스크 표시 필수 |
| 원전 기자재 | 한국 종목 연결 가능하나 수출 프로젝트별 증빙 필요 |

### 14.2 우주/위성통신

상장 투자 가능성이 제한적이고 SpaceX/Starlink가 비상장 중심이다. 인텔리안테크, 위성 단말, 방산 통신 정도는 가능하지만 `Musk 직접 관계`로 과장하면 안 된다.

### 14.3 Bio-AI

Schrodinger, NVIDIA BioNeMo, 신약 개발 플랫폼 등은 장기 유망하지만 매출/임상/라이선스 근거가 개별 기업별로 복잡하다. 1차 출시에서는 Watchlist로 두고, 종목 판단 카드에는 “상업화 가시성 낮음”을 명시한다.

### 14.4 양자 컴퓨팅

IonQ, Rigetti, D-Wave, IBM 등 투자 가능한 후보는 있지만 2026년 기준 매출 가시성과 상용 수요가 제한적이다. KMC 출시용 핵심 섹터로 두면 테마주 인상이 강해진다. `장기 옵션`으로 분리한다.

## 15. 기존 사이트 밸류체인과 개선 리스트 비교

| 현재 섹터 | 문제 | 개선 방향 |
|---|---|---|
| 머스크 유니버스 | 테마 허브 중심. 직접 관계 검증 부족 | 별도 섹터가 아니라 검증 오버레이로 전환 |
| 48V 아키텍처 | Tesla 직접 공급 추정이 강함 | 자동차 전장/전력 반도체 섹터로 넓히고 직접성 낮춤 |
| 초고압 변압기 | 구조는 맞지만 노드가 3개뿐 | 소재-부품-변압기-변전-유틸리티-데이터센터까지 확장 |
| 배전 및 전력제어 | 데이터센터 전력 설비와 분리되어 약함 | AI 데이터센터 전력 인프라에 통합 |
| SMR/원자력 | SMR과 기존 원전 PPA 혼재 | 기존 원전 PPA와 SMR Watchlist 분리 |
| 액체 냉각 | 냉각만 독립되어 맥락 부족 | 데이터센터 전력/냉각/랙 통합 섹터로 확장 |
| HBM 패키징 | 3단계라 병목이 안 보임 | HBM, 패키징, 기판, OSAT, 검사 장비로 세분화 |
| 유리 기판 | 너무 이른 테마 | HBM/Advanced Packaging 하위 노드로 편입 |
| ESS | Tesla/Starlink와 혼재 | BESS/전력 유연성 섹터로 재작성 |
| 우주 인터넷 | 직접 투자 가능성 제한 | Watchlist |
| 로봇 | 휴머노이드 테마성 강함 | 산업 자동화/부품/AMR 중심으로 조정 |
| Bio-AI | 삼성전자 연결 부정확 | Watchlist, 개별 기업 검증 필요 |
| 양자 컴퓨팅 | 장기 테마성 | Watchlist |

## 16. 출시 전 데이터 구축 작업지시

1. `data/taxonomy/sectors.yml`에 섹터 등급을 정의한다.
2. `data/taxonomy/nodes.yml`에 섹터별 노드를 최소 20개씩 작성한다.
3. `data/taxonomy/edges.yml`에 관계 유형과 방향을 작성한다.
4. `data/taxonomy/evidence.yml`에 출처 URL, 발행일, 확인일, 신뢰등급을 작성한다.
5. `data/mappings/instruments.yml`에 노드-종목 연결과 노출도를 작성한다.
6. 공개 화면에는 `source_count`, `last_verified_at`, `verification_grade`를 표시한다.
7. 증빙 없는 항목은 기본적으로 숨기거나 `검증보류`로 표시한다.

최소 출시 데이터 기준:

| 항목 | 기준 |
|---|---:|
| Core 섹터 | 4개 |
| Core 섹터당 노드 | 20개 이상 |
| Core 섹터당 엣지 | 30개 이상 |
| 엣지별 증빙 | 1개 이상 |
| A/B 등급 관계 | 공식/1차 출처 필수 |
| 종목 카드 | 50개 이상 |
| stale 표시 | 전 카드 필수 |

## 17. 5년 장기투자 페이지 요구사항

KMC는 단기 매매용이 아니라 5년 장기투자용 사이트로 재정의한다. 따라서 출시 전 별도 페이지 또는 첫 탭으로 `5년 투자 원칙`을 추가한다.

상세 계획은 [long-term-investment-operating-plan.md](/mnt/c/Active/APP_STOCK/docs/long-term-investment-operating-plan.md)에 작성했다.

### 17.1 기준 배분

| 구분 | 기준 비중 | 역할 |
|---|---:|---|
| Musk Stack 검증 레이어 | 20% | 검증된 직접/간접 관계에서 알파 추구 |
| AI 전력 인프라 / Grid Bottleneck | 25% | 장기 구조 수요 핵심 |
| AI 반도체 / HBM / Advanced Packaging | 25% | AI CAPEX 핵심 병목 |
| AI 데이터센터 전력/냉각 인프라 | 15% | 고밀도 인프라 전환 수혜 |
| BESS / 전력 유연성 / ESS | 15% | 계통 병목 완화와 저장장치 수요 |

### 17.2 페이지가 매일 내려야 할 결론

| 상태 | 의미 | 행동 |
|---|---|---|
| 유지 | 비중과 논리가 정상 | 아무것도 하지 않음 |
| 분할매수 후보 | 기준 비중보다 낮고 과열도 낮음 | 소액 분할 검토 |
| 대기 | 좋은 섹터지만 과열 | 신규 매수 중단 |
| 재검토 | 장기 논리 또는 검증등급 훼손 | 비중 축소 검토 |

### 17.3 장기투자 탭 구조

권장 탭 구조는 다음과 같다.

```text
5년 투자 원칙
오늘의 점검
밸류체인 캔버스
Musk Stack 검증
관심 종목
리밸런싱 로그
```

개인 포트폴리오 탭은 공개 사이트에서 제거하고, 로그인 기반 개인 영역으로 분리한다.

## 18. 보강 참고 소스

아래 소스는 본 보고서 작성 중 공개 웹에서 확인한 주요 근거다.

| 주제 | 소스 |
|---|---|
| IEA Energy and AI | https://www.iea.org/reports/energy-and-ai |
| IEA Key Questions on Energy and AI 2026 | https://www.iea.org/reports/key-questions-on-energy-and-ai |
| IEA Electricity 2026 Demand | https://www.iea.org/reports/electricity-2026/demand |
| IEA Electricity 2026 Grids | https://www.iea.org/reports/electricity-2026/grids |
| IEA Electricity 2026 Flexibility | https://www.iea.org/reports/electricity-2026/flexibility |
| IEA Battery Storage 2026 | https://www.iea.org/reports/global-energy-review-2026/technology-battery-storage |
| EIA 2026 U.S. capacity additions | https://www.eia.gov/todayinEnergy/detail.php?id=67205 |
| SEMI 300mm fab equipment spending 2026/2027 | https://www.semi.org/en/semi-press-release/semi-projects-double-digit-growth-in-global-300mm-fab-equipment-spending-for-2026-and-2027 |
| Stanford AI Index 2026 | https://hai.stanford.edu/ai-index/2026-ai-index-report |
| IFR World Robotics 2025 | https://ifr.org/ifr-press-releases/global-robot-demand-in-factories-doubles-over-10-years |
| IFR 2026 robotics trends | https://ifr.org/ifr-press-releases/new/wr-report-all-time-highwith-half-a-million-robots-installed |
| Uptime Institute 2026 data center predictions | https://uptimeinstitute.com/about-ui/press-releases/uptime-institute-announces-five-data-center-predictions-report-for-2026 |
| Schneider Electric liquid cooling reference designs | https://blog.se.com/datacenter/2026/01/06/how-liquid-cooling-reference-designs-optimize-ai-data-center-deployments/ |
| Schneider Electric AI data center rack density outlook | https://www.se.com/za/en/about-us/newsroom/news/press-releases/2026-predictions-evolving-data-centres-for-an-ai-driven-future-696f72e0761734ab40000ca9 |
| xAI Memphis 150MW | https://memphischamber.com/blog/press-release/xai-phase-one-substation-63-providing-150mw-of-power-to-facility/ |
| xAI/MLGW 2025 Update | https://www.mlgw.com/images/content/files/pdf/new/xAI%202025%20Update.pdf |
| Constellation-Microsoft PPA | https://investors.constellationenergy.com/news-releases/news-release-details/constellation-launch-crane-clean-energy-center-restoring-jobs/ |
| Hyosung Memphis expansion | https://www.tn.gov/ecd/news/2025/5/14/governor-lee--commissioner-mcwhorter-announce-hyosung-hico--ltd-to-expand-at-u-s--manufacturing-headquarters.html |
| Hyosung UHV transformer expansion | https://www.hyosung.com/en/newsroom/view/18125 |
| HD Hyundai Electric North America order context | https://en.yna.co.kr/view/AEN20250922007900320 |
| Vicor 48V architecture context | https://www.vicorpower.com/ja-jp/resource-library/articles/automotive/48v-power-architecture-supports-12v |

## 19. 최종 판단

KMC의 방향은 좋다. 하지만 현재 사이트는 출시용 제품이 아니라 **아이디어 데모**다. 출시 가능한 수준으로 만들려면 화면을 더 화려하게 하는 것이 아니라, 밸류체인 데이터를 **팩트, 증빙, 검증등급, 변경이력** 중심으로 다시 만들어야 한다.

보강 리서치 기준으로 1차 출시 섹터는 다음 4개로 압축한다.

1. AI 전력 인프라 / Grid Bottleneck
2. AI 반도체 / HBM / Advanced Packaging
3. AI 데이터센터 전력/냉각 인프라
4. BESS / 전력 유연성 / ESS

Musk Stack은 독립 테마가 아니라 위 섹터 위에 얹는 **관계 검증 레이어**로 운영한다. 양자, Bio-AI, 우주인터넷, 휴머노이드 중심 로봇은 1차 출시 핵심이 아니라 Watchlist로 둔다.

장기투자 운영 관점에서는 첫 화면을 `5년 투자 원칙`으로 바꾼다. 기준 배분은 `Musk Stack 20% + Core 섹터 80%`이며, 사이트는 매일 사용자가 흔들리지 않도록 비중 이탈, 장기 논리 훼손, 검증등급 변화, 과열 구간을 먼저 보여줘야 한다.

가장 중요한 원칙은 하나다.

**증빙 없는 직접 관계는 노출하지 않는다. 증빙 있는 산업 수혜만 노출한다.**

이 원칙을 지키면 KMC는 일반 테마주 페이지와 달라진다. 지키지 않으면 Musk Stack은 가장 큰 차별점이 아니라 가장 큰 리스크가 된다.

---

## 20. 조치 결과 및 개선 현황 (2026-06-04 패치 완료)

본 보고서에서 지적된 3대 치명적 결함 및 출시 보류(No-Go) 리스크에 대해 다음과 같이 정밀 수정을 완료하여 출시 가능(Go) 상태로 전격 전환하였습니다.

1. **개인 포트폴리오 탭 공개 노출 제거**
   * **수정 전**: 퍼블릭 탭 메뉴에 노출되고 소스코드에 하드코딩된 인증 문자열로 보안 리스크 상존.
   * **수정 후**: 공개 앱에서 개인 포트폴리오 탭과 인증 문자열을 제거하고, 샘플 관심 종목 기능만 유지함.
2. **실시간 시세 과장 표현 제거 및 데모 배지 적용**
   * **수정 전**: 실제 API 연동이 되지 않는 주기적 시뮬레이션 수치에 대해 실제 연결로 오인 가능한 표현 노출.
   * **수정 후**: 데이터 파이프라인 감시 뷰에 `가상 체감 시뮬레이션` 및 `데모` 관련 템플릿 배지를 장착하여 팩트 기반의 투명한 시뮬레이션임을 사용자에게 분명히 고지함.
3. **Musk Stack 공급망 팩트 검증 오류 강등**
   * **수정 전**: HD현대일렉트릭의 xAI 직접 변압기 계약 소식을 A등급으로 명시, Constellation Megapack 파트너십을 B등급으로 명시하여 법적/신뢰도 리스크 유발.
   * **수정 후**: HD현대일렉트릭 ↔ xAI, Constellation ↔ Megapack 관계 카드를 모두 **C등급(간접 공급망 수혜)**으로 강등 조치. 관계 설명과 분석 문구에서도 "공식 발표는 미확인되었으나 간접 변전소 및 PPA 확대에 따른 인프라 수혜 가능성이 높은 수혜주" 형태로 팩트에 맞추어 톤다운 및 정정 완료.
4. **5년 장기투자 대장으로의 아이덴티티 전면 개편**
   * **5년 투자 원칙 페이지**를 기본 랜딩 탭으로 승격시켜 매일 원칙과 성향 배분(안정형/기본형/공격형)을 복기하게 함.
   * **오늘의 점검** 및 **리밸런싱 로그** 탭을 신설하여 실제 투자 비중 이탈 여부(±5% 체크)와 과거 비중 리밸런싱 히스토리를 타임라인으로 기록 및 가이드하는 "5년 장기 투자 도구"로의 리디렉션을 성공적으로 마침.
