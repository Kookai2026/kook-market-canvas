# KMC : KOOK Market Canvas (투자 리서치 작업대)

산업 밸류체인과 시장 데이터를 연동하여 사외(외부망)에서도 Tailscale VPN 연결 없이 신속하게 모니터링할 수 있는 퍼블릭 투자 분석 웹앱입니다.

---

## 🌐 1. 웹 서비스 접속 정보

* **실시간 퍼블릭 주소**: **[https://kook-market-canvas.vercel.app](https://kook-market-canvas.vercel.app)**
* **예비 시스템 도메인**: [KMC Vercel Deployment Link](https://kook-market-canvas-7vpf2q40g-kookai2026s-projects.vercel.app)
* **🔑 태하 하우스 투자 비밀번호**: `0225` (부부 기념일 암호 4자리)

---

## 📱 2. 접속 및 검증 방법

1. **사외 스마트폰 / 태블릿**: LTE/5G 환경에서 주소([https://kook-market-canvas.vercel.app](https://kook-market-canvas.vercel.app))로 접속하면 1초 내에 Glassmorphism 다크 테마 화면이 열립니다.
2. **사무실 랩톱 / PC**: 별도 VPN 프로그램(Tailscale 등)을 켤 필요 없이 브라우저로 다이렉트 진입하여 이용 가능합니다.
3. **태하 하우스 자산 현황 해제**: 상단 메뉴 가장 우측의 **[태하 하우스 투자]** 탭을 클릭하고 비밀번호 `0225`를 입력하여 진입합니다. 보유 종목 추가/삭제 및 평단가 대비 실시간 수익률 계산 기능을 테스트해 보실 수 있습니다.

---

## 🔄 3. 데이터 동기화 및 갱신 주기

* **화면 가상 체감 시세**: 7초 간격으로 주가 및 등락율이 미세하게 갱신되며, 동기화 타이머가 깜빡입니다.
* **사내 기지국 ↔ 클라우드 DB 연동**:
  * 사내 서버의 수집 엔진(Hermes)에서 계산된 고비용 연산 지표(투자 적합도, 과열도) 데이터는 사내 Syncer([kmc_syncer.py](file:///mnt/c/Active/APP_STOCK/services/materializer/kmc_syncer.py))를 거쳐 원격 Supabase DB로 **아웃바운드(Outbound)** 단방향 업로드됩니다.
  * 사내 서버 `crontab` 설정에 따라 기본적으로 **매시간(정각)** 또는 **매 15분** 주기로 자동 동기화 배치가 수행됩니다.

---

## 📂 4. 소스코드 및 인프라 구조

* **GitHub 원격 저장소**: **[https://github.com/Kookai2026/kook-market-canvas](https://github.com/Kookai2026/kook-market-canvas)**
* **자동 배포 파이프라인**: GitHub `main` 브랜치에 코드를 푸시하면 Vercel이 실시간 감지하여 1분 이내에 무료 퍼블릭 웹 주소로 정적 최적화 빌드를 자동 갱신 배포합니다.
* **시스템 아키텍처 가이드**: 세부 아키텍처 흐름 및 다이어그램은 [architecture.md](file:///mnt/c/Active/APP_STOCK/docs/architecture.md)에서 확인하실 수 있습니다.
* **데이터 모델 명세 DDL**: [erd.md](file:///mnt/c/Active/APP_STOCK/docs/erd.md) 및 [api_spec.md](file:///mnt/c/Active/APP_STOCK/docs/api_spec.md)를 참고해 주십시오.
