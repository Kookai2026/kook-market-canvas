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
| 히트맵 | 정적 데이터 + 7초 랜덤 변동 | 실시간 표현 금지 필요 |
| 포트폴리오 | 공개 번들에 가족 포트폴리오/비밀번호 포함 | 즉시 제거 필요 |
| 데이터 파이프라인 | UI상 CONNECTED 표시 | 실제 연결 검증 부재 |

### 코드상 확인 근거

| 영역 | 근거 |
|---|---|
| 포트폴리오 하드코딩 | [TaehaPortfolio.js](/mnt/c/Active/APP_STOCK/apps/web/components/favorites/TaehaPortfolio.js:13) 기본 보유 종목, [TaehaPortfolio.js](/mnt/c/Active/APP_STOCK/apps/web/components/favorites/TaehaPortfolio.js:25) 비밀번호 `0604`/`1234` |
| 히트맵 랜덤 변동 | [MarketHeatmap.js](/mnt/c/Active/APP_STOCK/apps/web/components/heatmap/MarketHeatmap.js:56) 7초 시뮬레이션, [MarketHeatmap.js](/mnt/c/Active/APP_STOCK/apps/web/components/heatmap/MarketHeatmap.js:68) `Math.random()` |
| Musk Stack 검증 미달 | [MuskStackTab.js](/mnt/c/Active/APP_STOCK/apps/web/components/cards/MuskStackTab.js:11) HD현대일렉트릭-xAI A등급, [MuskStackTab.js](/mnt/c/Active/APP_STOCK/apps/web/components/cards/MuskStackTab.js:55) 루머 표현 포함 |
| 개인/가족 UX 노출 | [page.js](/mnt/c/Active/APP_STOCK/apps/web/app/page.js:81) `KOOK & Family`, [page.js](/mnt/c/Active/APP_STOCK/apps/web/app/page.js:140) `태하 하우스 투자` 탭 |
| 파이프라인 오인 가능 | [page.js](/mnt/c/Active/APP_STOCK/apps/web/app/page.js:173) 동기화 활성화, [page.js](/mnt/c/Active/APP_STOCK/apps/web/app/page.js:177) Supabase CONNECTED 표시 |

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

### 5.1 가족 포트폴리오와 하드코딩 비밀번호

현재 공개 사이트에 `태하 하우스 투자` 탭이 있고, 번들에 초기 보유 종목과 비밀번호가 그대로 들어 있다. 이건 출시 전 즉시 제거해야 한다.

문제:

- 공개 웹 번들에서 비밀번호 확인 가능
- 개인/가족 보유 종목으로 보이는 데이터 노출
- 로컬스토리지 기반이라 실제 인증/보안이 아님
- 제품명 KMC의 공용 투자 리서치 도구 성격과 맞지 않음

조치:

- 프로덕션 배포에서 포트폴리오 탭 제거
- 개인 포트폴리오는 별도 인증 후 2단계 기능으로 분리
- 데모가 필요하면 `Demo Portfolio`로 익명 샘플만 사용

### 5.2 “실시간” 표현 금지

히트맵은 현재 실제 API가 아니라 7초마다 랜덤 변동한다. 출시 전에는 `실시간`, `CONNECTED`, `동기화 활성화` 같은 표현을 쓰면 안 된다.

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
| 하드코딩 비밀번호 | 0건 |
| 가족/개인 명칭 | 공개 UI 제거 |
| 로컬스토리지 민감정보 | 금지 |
| 인증 | 실제 서버 검증 기반 |

## 9. 개선 우선순위

### 즉시 조치

1. `태하 하우스 투자` 탭 제거.
2. 하드코딩 비밀번호와 기본 보유 종목 제거.
3. 히트맵의 `실시간` 표현 제거 또는 샘플 배지 추가.
4. `CONNECTED`, `동기화 활성화` 등 실제 연결처럼 보이는 문구 제거.
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
깊은 3개 팩트 기반 캔버스
    ↓
검증등급이 붙은 관계 그래프
    ↓
종목 카드와 알림 연결
    ↓
확장 섹터 추가
```

1차 출시명도 `KMC Beta`가 아니라 **`KMC Research Preview`** 정도가 적절하다. 실제 데이터 API, 검증 워크플로, 버전관리, 보안 분리가 끝나기 전에는 정식 출시로 부르면 안 된다.

## 11. 참고 소스

아래 소스는 본 보고서 작성 중 공개 웹에서 확인한 주요 근거다.

| 주제 | 소스 |
|---|---|
| xAI Memphis 150MW | https://memphischamber.com/blog/press-release/xai-phase-one-substation-63-providing-150mw-of-power-to-facility/ |
| xAI/MLGW 2025 Update | https://www.mlgw.com/images/content/files/pdf/new/xAI%202025%20Update.pdf |
| Constellation-Microsoft PPA | https://investors.constellationenergy.com/news-releases/news-release-details/constellation-launch-crane-clean-energy-center-restoring-jobs/ |
| Hyosung Memphis expansion | https://www.tn.gov/ecd/news/2025/5/14/governor-lee--commissioner-mcwhorter-announce-hyosung-hico--ltd-to-expand-at-u-s--manufacturing-headquarters.html |
| Hyosung UHV transformer expansion | https://www.hyosung.com/en/newsroom/view/18125 |
| HD Hyundai Electric North America order context | https://en.yna.co.kr/view/AEN20250922007900320 |
| Vicor 48V architecture context | https://www.vicorpower.com/ja-jp/resource-library/articles/automotive/48v-power-architecture-supports-12v |

## 12. 최종 판단

KMC의 방향은 좋다. 하지만 현재 사이트는 출시용 제품이 아니라 **아이디어 데모**다. 출시 가능한 수준으로 만들려면 화면을 더 화려하게 하는 것이 아니라, 밸류체인 데이터를 **팩트, 증빙, 검증등급, 변경이력** 중심으로 다시 만들어야 한다.

가장 중요한 원칙은 하나다.

**증빙 없는 직접 관계는 노출하지 않는다. 증빙 있는 산업 수혜만 노출한다.**

이 원칙을 지키면 KMC는 일반 테마주 페이지와 달라진다. 지키지 않으면 Musk Stack은 가장 큰 차별점이 아니라 가장 큰 리스크가 된다.
