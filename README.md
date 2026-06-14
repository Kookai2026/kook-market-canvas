# KMC : KOOK Market Canvas (투자 리서치 작업대)

산업 밸류체인과 시장 데이터를 연결해 장기 투자 아이디어를 점검하는 퍼블릭 투자 리서치 웹앱입니다.

KMC의 1차 사용 경험은 데스크톱 리서치 화면이 아니라, 부부와 지정 사용자가 스마트폰에서 매일 짧게 확인하는 **모바일 우선 일일 투자 점검 앱**입니다. 첫 화면은 장기 원칙 설명보다 오늘의 금지 행동, 관심 종목 변화, 검증이 필요한 외부 시그널을 먼저 보여주는 방향으로 운영합니다.

---

## 🌐 1. 웹 서비스 접속 정보

* **퍼블릭 주소**: **[https://kook-market-canvas.vercel.app](https://kook-market-canvas.vercel.app)**
* **예비 시스템 도메인**: [KMC Vercel Deployment Link](https://kook-market-canvas-7vpf2q40g-kookai2026s-projects.vercel.app)

---

## 📱 2. 접속 및 검증 방법

1. **사외 스마트폰 / 태블릿**: LTE/5G 환경에서 주소([https://kook-market-canvas.vercel.app](https://kook-market-canvas.vercel.app))로 접속해 오늘의 점검, 관심 종목 변화, 밸류체인 캔버스, 5년 투자 원칙을 확인합니다.
2. **사무실 랩톱 / PC**: 별도 VPN 프로그램(Tailscale 등)을 켤 필요 없이 브라우저로 직접 진입하여 이용 가능합니다.
3. **관심 종목 검증**: 밸류체인 캔버스 또는 Musk Stack 리포트에서 종목 별표를 누르면 브라우저 로컬 저장소에 관심 목록이 저장됩니다.

---

## 🔄 3. 데이터 동기화 및 갱신 주기

* **현재 공개 앱 가격 상태**: 앱 내부 가격은 실시간 체결가가 아니라 무료 지연 스냅샷입니다. 매매 전 정밀 확인은 종목 카드의 외부 차트 링크(네이버증권, Yahoo Finance, TradingView 등)로 이동해 확인합니다.
* **무료 가격 갱신 방식**: `npm run sync:market`이 Yahoo Finance 무료 지연 데이터를 받아 `apps/web/public/market-snapshot.json`을 갱신합니다. 자동 스케줄 배포는 GitHub 토큰에 `workflow` 권한을 부여한 뒤 `.github/workflows/market-snapshot.yml`을 푸시하면 활성화됩니다.
* **오래된 데이터 처리**: 스냅샷이 36시간 이상 갱신되지 않으면 앱은 가격 상태를 `오래됨`으로 표시합니다.
* **현재 공개 앱 리서치 상태**: 점수, 뉴스 피드는 출시 전 검증용 샘플 리서치 데이터입니다.
* **외부 자료 노출 원칙**: X/뉴스/공시/IR 자료는 원문 피드처럼 그대로 노출하지 않고, 수집 후 중복 제거, 임베딩, 종목·섹터·밸류체인 매칭, 요약을 거쳐 `오늘의 시그널` 카드로 제한 노출합니다.
* **사내 기지국 ↔ 클라우드 DB 연동 계획**:
  * 사내 서버의 수집 엔진(Hermes)에서 계산된 투자 적합도, 과열도, 수급 지표는 사내 Syncer([kmc_syncer.py](file:///mnt/c/Active/APP_STOCK/services/materializer/kmc_syncer.py))를 거쳐 원격 API로 아웃바운드 단방향 업로드하는 구조로 설계되어 있습니다.
  * 실제 운영 전에는 API 엔드포인트, HMAC 비밀키, 데이터 원천, `as_of` 검증을 완료해야 합니다.

---

## 📂 4. 소스코드 및 인프라 구조

* **GitHub 원격 저장소**: **[https://github.com/Kookai2026/kook-market-canvas](https://github.com/Kookai2026/kook-market-canvas)**
* **자동 배포 파이프라인**: GitHub `main` 브랜치에 코드를 푸시하면 Vercel이 변경을 감지하여 퍼블릭 웹 주소의 정적 최적화 빌드를 갱신 배포합니다.
* **시스템 아키텍처 가이드**: 세부 아키텍처 흐름 및 다이어그램은 [architecture.md](file:///mnt/c/Active/APP_STOCK/docs/architecture.md)에서 확인하실 수 있습니다.
* **데이터 모델 명세 DDL**: [erd.md](file:///mnt/c/Active/APP_STOCK/docs/erd.md) 및 [api_spec.md](file:///mnt/c/Active/APP_STOCK/docs/api_spec.md)를 참고해 주십시오.
