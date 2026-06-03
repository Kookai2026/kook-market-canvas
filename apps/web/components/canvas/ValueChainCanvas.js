'use client';

import { useState, useRef } from 'react';
import { Network, HelpCircle, Layers, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import InstrumentCard from '../cards/InstrumentCard';

// 11대 개별 섹터 고유의 밸류체인 상세 맵 데이터 (피드백 반영 - 짬뽕하지 않고 독립적으로 분할)
const CANVASES_DATA = {
  tesla_universe: {
    title: '👑 xAI & 테슬라 (머스크 유니버스)',
    description: '일론 머스크 생태계의 중앙 허브. 기가 텍사스, 멤피스 슈퍼클러스터, 옵티머스 휴머노이드 연계 핵심.',
    nodes: {
      hub: {
        id: 'hub',
        name: '👑 테슬라 & xAI 중추',
        x: 370, y: 230, w: 260, h: 70,
        description: '머스크의 핵심 AI 의사결정체. FSD, 옵티머스 로봇, 데이터센터 등을 유기적으로 통제.',
        instruments: [
          { name: '테슬라 (Tesla)', ticker: 'TSLA', sector: '머스크 유니버스', fit: 90, overheat: 58, price: '$178.4', change: '+3.2%', volumeSignal: '기관 매수 우위', analysis: '자율주행 FSD 라이선싱 시도 및 차세대 보급형 차량 모멘텀 대기.' }
        ]
      },
      memphis: {
        id: 'memphis',
        name: '🖥️ xAI 멤피스 슈퍼클러스터',
        x: 50, y: 120, w: 230, h: 60,
        description: '10만 개의 H100 GPU가 가동되는 세계 최대 인공지능 학습 기지. 150MW급 전력 조달이 핵심 과제.',
        instruments: [
          { name: '버티브 홀딩스 (Vertiv)', ticker: 'VRT', sector: '머스크 유니버스', fit: 88, overheat: 84, price: '$94.2', change: '+6.2%', volumeSignal: '외인 순매수', analysis: '멤피스 데이터센터용 핵심 액체냉각 솔루션 메인 공급사.' }
        ]
      },
      starlink: {
        id: 'starlink',
        name: '📡 스페이스X 스타링크 위성망',
        x: 390, y: 50, w: 220, h: 60,
        description: '지구상 모든 오지와 바다를 연결하는 저궤도 위성 통신망. 자율주행 차량 및 데이터센터 백업 연결성.',
        instruments: [
          { name: '스페이스X (SpaceX 비상장)', ticker: 'SPACE.X', sector: '머스크 유니버스', fit: 80, overheat: 50, price: '비상장', change: '0.0%', volumeSignal: '사외 거래 활발', analysis: '스타링크 흑자 달성 및 스타쉽 발사 성공에 따른 기업 가치 급증.' }
        ]
      },
      optimus: {
        id: 'optimus',
        name: '🤖 옵티머스 휴머노이드',
        x: 720, y: 120, w: 230, h: 60,
        description: '기가팩토리 현장에 실제 배치되어 노동력을 보조할 테슬라 자체 휴머노이드 로봇 플랫폼.',
        instruments: [
          { name: '레인보우로보틱스', ticker: '277810', sector: '머스크 유니버스', fit: 86, overheat: 64, price: '168,500원', change: '+2.8%', volumeSignal: '기관 매집', analysis: '삼성 및 글로벌 로봇 부품 공급망 확보 수혜.' }
        ]
      },
      megapack: {
        id: 'megapack',
        name: '🔋 메가팩 배터리 ESS',
        x: 390, y: 410, w: 220, h: 60,
        description: '신재생 에너지의 전력 간헐성을 보완해주는 메가와트급 산업용 에너지 저장장치.',
        instruments: [
          { name: '서진시스템', ticker: '178320', sector: '머스크 유니버스', fit: 84, overheat: 72, price: '29,450원', change: '+5.3%', volumeSignal: '외인 집중 순매수', analysis: '글로벌 주요 ESS 캐비닛 및 케이스 조립 OEM 최고 지위 수혜.' }
        ]
      }
    },
    edges: [
      { from: 'hub', to: 'memphis' },
      { from: 'hub', to: 'starlink' },
      { from: 'hub', to: 'optimus' },
      { from: 'hub', to: 'megapack' }
    ]
  },
  arch48v: {
    title: '🔌 1. 48V 전력 아키텍처',
    description: '자동차 전압 체계를 12V에서 48V로 늘려 구리 배선을 1/4로 단축하고 전력 효율을 혁신하는 차세대 자동차 E/E 설계.',
    nodes: {
      upstream: {
        id: 'upstream',
        name: '소재/소자: SiC 전력 반도체',
        x: 70, y: 250, w: 220, h: 60,
        description: '48V 고압 스위칭 및 변환 시 발생하는 에너지 손실을 극소화하는 차량용 반도체 소자.',
        instruments: [
          { name: '온세미 (onsemi)', ticker: 'ON', sector: '48V 전력 아키텍처', fit: 85, overheat: 58, price: '$72.4', change: '+1.2%', volumeSignal: '외인 매수 우위', analysis: '실리콘카바이드(SiC) 전력 소자 선두권 보유. 48V E/E 변환 핵심 수혜.' }
        ]
      },
      midstream: {
        id: 'midstream',
        name: '모듈/제조: 고밀도 DC-DC 컨버터',
        x: 390, y: 250, w: 220, h: 60,
        description: '48V 고전압을 차량 내 통신 및 센서용 저전압으로 미세 조율해주는 전력 변환 컨버터 모듈.',
        instruments: [
          { name: '바이코 (Vicor Corp)', ticker: 'VICR', sector: '48V 전력 아키텍처', fit: 88, overheat: 62, price: '$42.8', change: '+3.5%', volumeSignal: '기관 순매수 전환', analysis: '테슬라 사이버트럭용 48V 파워 모듈 공급 파트너. 변환 모듈 1인자 기술력.' }
        ]
      },
      downstream: {
        id: 'downstream',
        name: '통합/조립: 하네스 및 커넥터',
        x: 710, y: 250, w: 220, h: 60,
        description: '48V 통합 기판에 쓰이는 고내구성 차세대 와이어링 하네스 및 핀 커넥터.',
        instruments: [
          { name: '이튼 코퍼레이션 (Eaton)', ticker: 'ETN', sector: '48V 전력 아키텍처', fit: 84, overheat: 65, price: '$312.4', change: '+1.8%', volumeSignal: '기관 매집', analysis: '산업용에서 자율주행 차량 전력 관리 허브로 공급 비중 확대 중.' }
        ]
      }
    },
    edges: [
      { from: 'upstream', to: 'midstream' },
      { from: 'midstream', to: 'downstream' }
    ]
  },
  hvt: {
    title: '⚡ 2. 초고압 변압기 (HVT Grid)',
    description: '송전망의 핵심 장비. 발전소에서 송출된 고압 전력을 변환하여 노후 인프라를 교체하고 전력망 쇼티지를 돌파하는 산업.',
    nodes: {
      upstream: {
        id: 'upstream',
        name: '원부자재: 방향성 전기강판 & 동선',
        x: 70, y: 250, w: 220, h: 60,
        description: '변압기 코어(철심)와 코일용 고순도 전기강판 및 동(구리) 자재 공급망.',
        instruments: [
          { name: '포스코홀딩스', ticker: '005490', sector: '초고압 변압기', fit: 74, overheat: 42, price: '385,000원', change: '+1.2%', volumeSignal: '기관 순매수', analysis: '변압기 철심의 최고급 재료인 방향성 전기강판(GO) 국내 독점적 공급.' },
          { name: '풍산', ticker: '103140', sector: '초고압 변압기', fit: 80, overheat: 68, price: '64,200원', change: '+3.5%', volumeSignal: '거래 급증', analysis: '구리 가격 랠리와 연동되어 변압기 전선용 동 가공 수혜 흡수.' }
        ]
      },
      midstream: {
        id: 'midstream',
        name: '완제품: 초고압 변압기 제조',
        x: 390, y: 250, w: 220, h: 60,
        description: '송전 그리드의 중추가 되는 고전압(220kV~765kV) 전력 변압기 완제품 조립 및 설계.',
        instruments: [
          { name: 'HD현대일렉트릭', ticker: '267260', sector: '초고압 변압기', fit: 92, overheat: 88, price: '284,500원', change: '+8.4%', volumeSignal: '외인 매수 우위', analysis: '미국 데이터센터 수주 폭발로 2029년까지 물량 예약 완료. 수익성 극대화.' },
          { name: '효성중공업', ticker: '298040', sector: '초고압 변압기', fit: 86, overheat: 76, price: '312,000원', change: '+4.2%', volumeSignal: '기관 유입', analysis: '미국 현지 멤피스 변압기 공장의 매출 반영이 본격 시작되는 시점.' }
        ]
      },
      downstream: {
        id: 'downstream',
        name: '수요처: 북미 그리드 & 유틸리티',
        x: 710, y: 250, w: 220, h: 60,
        description: '변압기를 대량 매집하여 송배전 전력망을 실제로 운영하는 인프라 기업.',
        instruments: [
          { name: '넥스트에라 에너지 (NextEra)', ticker: 'NEE', sector: '초고압 변압기', fit: 78, overheat: 52, price: '$72.4', change: '+0.5%', volumeSignal: '안정수급', analysis: '북미 최대 유틸리티사로 변압기 등 인프라 조달을 대량 진행 중.' }
        ]
      }
    },
    edges: [
      { from: 'upstream', to: 'midstream' },
      { from: 'midstream', to: 'downstream' }
    ]
  },
  distribution: {
    title: '🔌 3. 배전 및 전력 제어',
    description: '변전소에서 공급된 전기를 데이터센터나 가정으로 분배하고 사고를 방지하기 위해 전력을 최종 제어하는 하드웨어 솔루션.',
    nodes: {
      upstream: {
        id: 'upstream',
        name: '부품: 차단기 & 계전기',
        x: 70, y: 250, w: 220, h: 60,
        description: '과전류 발생 시 즉시 전기를 차단해 기기를 보호하는 내부 핵심 전기 전자 부품.',
        instruments: [
          { name: 'LS일렉트릭', ticker: '010120', sector: '배전 및 전력 제어', fit: 82, overheat: 74, price: '198,200원', change: '+2.1%', volumeSignal: '개인 매수', analysis: '스마트 스위치기어 및 차단기 설비 미국 진출 가시성 확보.' }
        ]
      },
      midstream: {
        id: 'midstream',
        name: '완제품: 수배전반 및 스위치기어',
        x: 390, y: 250, w: 220, h: 60,
        description: '스위치와 릴레이 등을 하나의 철제 함에 집약하여 배전을 총 제어하는 시스템 캐비닛.',
        instruments: [
          { name: '이튼 코퍼레이션 (Eaton)', ticker: 'ETN', sector: '배전 및 전력 제어', fit: 84, overheat: 65, price: '$312.4', change: '+1.8%', volumeSignal: '기관 매집', analysis: '미국 배전 시장 독과점 주주. 데이터센터 랙 전원 차단 시스템 주도.' }
        ]
      },
      downstream: {
        id: 'downstream',
        name: '수요처: 데이터센터 지능형 전력제어',
        x: 710, y: 250, w: 220, h: 60,
        description: 'AI 가속기 랙의 부하 급증에 맞춰 전력을 동적으로 분산 조절하는 최종 엔지니어링 시스템.',
        instruments: [
          { name: '슈나이더 일렉트릭 (Schneider)', ticker: 'SU.PA', sector: '배전 및 전력 제어', fit: 80, overheat: 58, price: '215.3€', change: '+0.9%', volumeSignal: '유럽 자금', analysis: '스마트 빌딩 및 AI 데이터센터 에너지 제어 소프트웨어 강점.' }
        ]
      }
    },
    edges: [
      { from: 'upstream', to: 'midstream' },
      { from: 'midstream', to: 'downstream' }
    ]
  },
  smr: {
    title: '⚛️ 4. SMR & 원자력 발전',
    description: '화석 연료를 배제하고 기후 규제에서 완전히 자유로운 무탄소 기저 부하 전력 조달의 유일한 해법.',
    nodes: {
      upstream: {
        id: 'upstream',
        name: '제조: 원자로 주기기 & 배관',
        x: 70, y: 250, w: 220, h: 60,
        description: '소형 모듈형 원자로(SMR)에 들어가는 고인성 합금 압력 용기 및 핵심 기자재 제조.',
        instruments: [
          { name: '뉴스케일 파워 (NuScale)', ticker: 'SMR', sector: 'SMR & 원자력 발전', fit: 76, overheat: 65, price: '$10.4', change: '+1.5%', volumeSignal: '개인 유입', analysis: '미국 SMR 개발사 중 유일하게 NRC 설계 승인을 완료해 실증 최고 수혜.' }
        ]
      },
      midstream: {
        id: 'midstream',
        name: '설계/건설: 원전 EPC',
        x: 390, y: 250, w: 220, h: 60,
        description: '원자력 노형 설계 특허를 활용해 발전소를 안전하게 건설하는 종합 엔지니어링.',
        instruments: [
          { name: '비스트라 에너지 (Vistra)', ticker: 'VST', sector: 'SMR & 원자력 발전', fit: 87, overheat: 79, price: '$88.4', change: '+5.3%', volumeSignal: '헤지펀드 매집', analysis: '텍사스 내 대규모 민간 원전 인수로 전력 공급 능력 탑티어 부각.' }
        ]
      },
      downstream: {
        id: 'downstream',
        name: '운영: 원전 발전 & PPA 계약',
        x: 710, y: 250, w: 220, h: 60,
        description: '가동 중인 원전의 배전 권리를 가지고 테크 자이언트에게 장기 전력 구매 계약(PPA)을 맺는 최종 홀딩스.',
        instruments: [
          { name: '콘스텔레이션 에너지 (CEG)', ticker: 'CEG', sector: 'SMR & 원자력 발전', fit: 90, overheat: 82, price: '$220.5', change: '+4.8%', volumeSignal: '거래대금 상위', analysis: 'MS 스리마일섬 원전 전력 공급 PPA 성사로 전력-AI 밸류에이션 리레이팅 선도.' }
        ]
      }
    },
    edges: [
      { from: 'upstream', to: 'midstream' },
      { from: 'midstream', to: 'downstream' }
    ]
  },
  cooling: {
    title: '❄️ 5. 액체 냉각 솔루션',
    description: '고출력 AI 가속기 랙의 발열 제어를 위해 전통적 공랭 방식을 탈피해 액체 냉매를 순환시키는 필수 하드웨어.',
    nodes: {
      upstream: {
        id: 'upstream',
        name: '원자재: 지능형 절연 냉매액',
        x: 70, y: 250, w: 220, h: 60,
        description: '직접 침전식 냉각(Immersion Cooling)에 사용되는 전자 비도전성 절연 특수 냉각액.',
        instruments: [
          { name: '모다인 매뉴팩처링 (Modine)', ticker: 'MOD', sector: '액체 냉각 솔루션', fit: 78, overheat: 69, price: '$112.5', change: '+3.1%', volumeSignal: '기관 순매수', analysis: '특수 목적 냉매 관리 열교환기 라인 확보로 고밀도 랙 대응 본격화.' }
        ]
      },
      midstream: {
        id: 'midstream',
        name: '모듈: CDU & 다이렉트 콜드플레이트',
        x: 390, y: 250, w: 220, h: 60,
        description: '칩셋에 직접 접촉해 열을 배출하는 콜드플레이트 및 냉각액 제어 장치(CDU).',
        instruments: [
          { name: '버티브 홀딩스 (Vertiv)', ticker: 'VRT', sector: '액체 냉각 솔루션', fit: 88, overheat: 84, price: '$94.2', change: '+6.2%', volumeSignal: '외인 순매수', analysis: '엔비디아 블랙웰 수냉 설계 공식 파트너. 차세대 쿨링 모듈 납품 지위 확고.' }
        ]
      },
      downstream: {
        id: 'downstream',
        name: '수요: AI 데이터센터 통합 설계',
        x: 710, y: 250, w: 220, h: 60,
        description: '서버 랙 전체를 액체 냉각 파이프라인과 통합하여 공조 인프라를 완성하는 종합 설계.',
        instruments: [
          { name: '테슬라 (Tesla)', ticker: 'TSLA', sector: '액체 냉각 솔루션', fit: 90, overheat: 58, price: '$178.4', change: '+3.2%', volumeSignal: '기관 유입', analysis: '멤피스 데이터센터 및 자체 Dojo 클러스터에 첨단 DLC 전면 도입 진행 중.' }
        ]
      }
    },
    edges: [
      { from: 'upstream', to: 'midstream' },
      { from: 'midstream', to: 'downstream' }
    ]
  },
  hbm: {
    title: '💾 6. HBM 적층 패키징',
    description: 'D램 단일 칩셋들을 TSV 통로를 통해 수직 적층하여 데이터 대역폭과 인터페이스 속도를 극대화하는 후공정 어드밴스드 반도체.',
    nodes: {
      upstream: {
        id: 'upstream',
        name: '장비: 에칭 & TC 본더',
        x: 70, y: 250, w: 220, h: 60,
        description: '실리콘을 미세 관통하고, 적층된 D램을 열압착하여 정밀 접합하는 후공정 장비.',
        instruments: [
          { name: '한미반도체', ticker: '042700', sector: 'HBM 패키징', fit: 91, overheat: 78, price: '148,200원', change: '+6.8%', volumeSignal: '기관 순매수', analysis: '듀얼 TC 본더의 고점수 점유율 유지. 마이크론 및 글로벌 후공정 확장 수혜.' },
          { name: 'ASMPT (홍콩)', ticker: '0522.HK', sector: 'HBM 패키징', fit: 76, overheat: 62, price: '92.4HK$', change: '+1.2%', volumeSignal: '중국계 자금', analysis: 'TSMC CoWoS 공정용 칩 온 웨이퍼 열압착 패키징 장비 납품 준비.' }
        ]
      },
      midstream: {
        id: 'midstream',
        name: '제조: HBM 메모리 어셈블리',
        x: 390, y: 250, w: 220, h: 60,
        description: '에칭과 본딩 가공을 통해 수집된 최종 HBM 3E / HBM4 메모리 다이.',
        instruments: [
          { name: 'SK하이닉스', ticker: '000660', sector: 'HBM 패키징', fit: 89, overheat: 72, price: '188,500원', change: '+3.2%', volumeSignal: '외인/기관 매수', analysis: '엔비디아 HBM3E 점유율 독점 및 12단 양산 수율 선제 확보 메리트 유효.' },
          { name: '삼성전자', ticker: '005930', sector: 'HBM 패키징', fit: 75, overheat: 50, price: '72,400원', change: '+0.8%', volumeSignal: '개인 유입', analysis: 'HBM3E 납품 테스트 완료 시 공급 다변화 퀄테스트 모멘텀 기대.' }
        ]
      },
      downstream: {
        id: 'downstream',
        name: '수요처: 파운드리 통합 CoWoS',
        x: 710, y: 250, w: 220, h: 60,
        description: 'HBM과 GPU 칩셋을 최종 실리콘 인터포저 위에 얹어 하나로 패키지화하는 파운드리 공정.',
        instruments: [
          { name: '티에스엠씨 (TSMC)', ticker: 'TSM', sector: 'HBM 패키징', fit: 92, overheat: 70, price: '$152.4', change: '+2.5%', volumeSignal: '외인 매집', analysis: '어드밴스드 CoWoS 패키징 설비 확대로 빅테크 칩셋 수주 장벽 독점.' }
        ]
      }
    },
    edges: [
      { from: 'upstream', to: 'midstream' },
      { from: 'midstream', to: 'downstream' }
    ]
  },
  glass: {
    title: '🔬 7. 차세대 유리 기판',
    description: '실리콘 인터포저 없이 미세 패키징의 전기 신호를 30% 단축하고 뒤틀림과 전력 열화를 원천 차단하는 신기술.',
    nodes: {
      upstream: {
        id: 'upstream',
        name: '소재/코어: 초정밀 특수 유리',
        x: 70, y: 250, w: 220, h: 60,
        description: '에칭 홀을 안정적으로 미세 에칭할 수 있게 고안된 특수 성분의 플랫 글래스 원천 기술.',
        instruments: [
          { name: 'SKC', ticker: '011790', sector: '차세대 유리 기판', fit: 82, overheat: 69, price: '138,500원', change: '+4.5%', volumeSignal: '기관 매집', analysis: '유리기판 자회사 앱솔릭스의 미국 현지 최초 승인 및 상업 가동 기대.' }
        ]
      },
      midstream: {
        id: 'midstream',
        name: '기판 제조: 유리 코어 기판(TGV)',
        x: 390, y: 250, w: 220, h: 60,
        description: '유리에 에칭 홀을 뚫고 구리를 도금하여 미세 반도체 기판으로 완성하는 공정.',
        instruments: [
          { name: '삼성전기', ticker: '009150', sector: '차세대 유리 기판', fit: 76, overheat: 58, price: '152,000원', change: '+1.3%', volumeSignal: '외인 순매수', analysis: '2026년 조기 유리기판 양산 목표 제시. MLCC 시황 개선과 연동.' }
        ]
      },
      downstream: {
        id: 'downstream',
        name: '수요: 고출력 AI 프로세서 기판 탑재',
        x: 710, y: 250, w: 220, h: 60,
        description: '차세대 AI GPU 혹은 커스텀 전력 가속기에 장착되어 기판 스케일을 키우는 인프라.',
        instruments: [
          { name: '엔비디아 (NVIDIA)', ticker: 'NVDA', sector: '차세대 유리 기판', fit: 95, overheat: 85, price: '$120.5', change: '+4.1%', volumeSignal: '역대급 대금', analysis: '인텔/AMD 등과 기판 변환 연합 형성. 향후 블랙웰 차차세대 적용 기대.' }
        ]
      }
    },
    edges: [
      { from: 'upstream', to: 'midstream' },
      { from: 'midstream', to: 'downstream' }
    ]
  },
  ess: {
    title: '🔋 8. 대용량 ESS 저장',
    description: '유틸리티 규모 신재생 에너지 전원망이나 데이터센터 백업 시스템에 쓰이는 기가와트(GW)급 대용량 배터리 저장 장치.',
    nodes: {
      upstream: {
        id: 'upstream',
        name: '소재/배터리: 배터리 셀 제조',
        x: 70, y: 250, w: 220, h: 60,
        description: 'ESS 안전성을 확보해주는 고수명 리튬인산철(LFP) 및 삼원계 배터리 셀.',
        instruments: [
          { name: '서진시스템', ticker: '178320', sector: '대용량 ESS 저장', fit: 84, overheat: 72, price: '29,450원', change: '+5.3%', volumeSignal: '외인 매수 우위', analysis: 'ESS 완성품 컨테이너형 조립 조달의 중심 공급사. 실적 퀀텀점프 진행 중.' }
        ]
      },
      midstream: {
        id: 'midstream',
        name: '시스템: 전력 변환 & 열관리 인클로저',
        x: 390, y: 250, w: 220, h: 60,
        description: '직류 배터리를 교류 전력망과 연동시켜주는 변환 인버터(PCS) 및 온도 조절 캐비닛.',
        instruments: [
          { name: 'LS전선', ticker: '006260', sector: '대용량 ESS 저장', fit: 85, overheat: 72, price: '124,500원', change: '+5.1%', volumeSignal: '외인/기관 양매수', analysis: '대용량 ESS 연동에 쓰이는 초고압 버스덕트 및 케이블 연결부 수주.' }
        ]
      },
      downstream: {
        id: 'downstream',
        name: '운영: 상업 유틸리티 전력망 연계',
        x: 710, y: 250, w: 220, h: 60,
        description: '테슬라 메가팩 등 초대형 배터리 컨테이너를 설치해 상업 전기 송배전 효율을 맞추는 사업자.',
        instruments: [
          { name: '테슬라 (Tesla)', ticker: 'TSLA', sector: '대용량 ESS 저장', fit: 90, overheat: 58, price: '$178.4', change: '+3.2%', volumeSignal: '기관 매수', analysis: '기가 네바다 및 라스롭 메가팩 공장 증설 가동. 에너지 매출 고성장세 진입.' }
        ]
      }
    },
    edges: [
      { from: 'upstream', to: 'midstream' },
      { from: 'midstream', to: 'downstream' }
    ]
  },
  starlink: {
    title: '📡 9. 위성 스타링크 통신',
    description: '지구 저궤도에 다량의 소형 인공위성을 배치하여 지상 국경 제한 없이 다이렉트 위성 데이터 통신을 공급하는 우주 인터넷망.',
    nodes: {
      upstream: {
        id: 'upstream',
        name: '부품: 위성 RF 소자 및 안테나',
        x: 70, y: 250, w: 220, h: 60,
        description: '지상 위성 수신 단말기용 평판 위성 안테나 및 송수신 RF 회로 설계.',
        instruments: [
          { name: '풍산', ticker: '103140', sector: '위성 스타링크 통신', fit: 80, overheat: 68, price: '64,200원', change: '+3.5%', volumeSignal: '거래 급증', analysis: '우주/방산용 구리 합금 소재 및 관련 정밀 도금 핀 공급망 형성.' }
        ]
      },
      midstream: {
        id: 'midstream',
        name: '제조: 저궤도 통신 위성 및 발사체',
        x: 390, y: 250, w: 220, h: 60,
        description: 'SpaceX 팰컨9을 통해 궤도에 수시로 안착되는 초경량 통신 위성 제조망.',
        instruments: [
          { name: '스페이스X (SpaceX 비상장)', ticker: 'SPACE.X', sector: '위성 스타링크 통신', fit: 80, overheat: 50, price: '비상장', change: '0.0%', volumeSignal: '장외 거래 활발', analysis: '저궤도 위성 통신 부문 세계 최고 수준 발사 횟수 및 비용 경쟁력 독점.' }
        ]
      },
      downstream: {
        id: 'downstream',
        name: '수요: 차량/해상/데이터센터 위성 연결',
        x: 710, y: 250, w: 220, h: 60,
        description: '자율주행 차량 지연율 보완, 선박 통신 및 오지 원격 기지국의 실시간 위성 통신 조달.',
        instruments: [
          { name: '테슬라 (Tesla)', ticker: 'TSLA', sector: '위성 스타링크 통신', fit: 90, overheat: 58, price: '$178.4', change: '+3.2%', volumeSignal: '기관 우위', analysis: '테슬라 사이버트럭 및 차세대 보급형 차량 스타링크 수신기 탑재 로드맵 구체화.' }
        ]
      }
    },
    edges: [
      { from: 'upstream', to: 'midstream' },
      { from: 'midstream', to: 'downstream' }
    ]
  },
  robot: {
    id: 'robot',
    title: '🤖 10. 휴머노이드 로봇',
    description: '인간의 움직임을 모사하여 생산 공장 및 생활 공간 노동을 보조하는 자율 물리 인공지능 로봇 조립망.',
    nodes: {
      upstream: {
        id: 'upstream',
        name: '부품: 하모닉 감속기 & 액추에이터',
        x: 70, y: 250, w: 220, h: 60,
        description: '정밀 제어 모터의 토크를 조절해 로봇의 손가락 및 팔다리 관절을 구동하는 핵심 부품.',
        instruments: [
          { name: '에스비비테크', ticker: '389500', sector: '휴머노이드 로봇', fit: 78, overheat: 58, price: '28,200원', change: '+1.5%', volumeSignal: '개인 유입', analysis: '로봇용 하모닉 드라이브 감속기 특허 및 라인업 보유에 따른 모멘텀.' }
        ]
      },
      midstream: {
        id: 'midstream',
        name: '조립/제어: 통합 휴머노이드 설계',
        x: 390, y: 250, w: 220, h: 60,
        description: '모터, 프레임, 임베디드 컴퓨터를 하우징하여 휴머노이드 골격을 완성하고 모션을 제어하는 공정.',
        instruments: [
          { name: '레인보우로보틱스', ticker: '277810', sector: '휴머노이드 로봇', fit: 86, overheat: 64, price: '168,500원', change: '+2.8%', volumeSignal: '기관 순매수', analysis: '삼성전자 스마트팩토리 현장 투입용 로봇 관절 및 구동 솔루션 구축 최선두.' }
        ]
      },
      downstream: {
        id: 'downstream',
        name: '인텔리전스: 물리 AI 모델 & 시각 신경망',
        x: 710, y: 250, w: 220, h: 60,
        description: '로봇이 세상을 인지하고 스스로 행동할 수 있게 만들어주는 비전 카메라와 학습 알고리즘.',
        instruments: [
          { name: '테슬라 (Tesla)', ticker: 'TSLA', sector: '휴머노이드 로봇', fit: 90, overheat: 58, price: '$178.4', change: '+3.2%', volumeSignal: '기관 매수', analysis: '차세대 옵티머스 Gen2 휴머노이드 로봇의 테슬라 기가팩토리 실배치 모니터링 가속화.' }
        ]
      }
    },
    edges: [
      { from: 'upstream', to: 'midstream' },
      { from: 'midstream', to: 'downstream' }
    ]
  },
  bio_ai: {
    title: '🧪 11. Bio-AI & 합성생물학',
    description: '물리학과 컴퓨터 비전 인공지능을 접목해 난치병 표적 단백질 구조를 설계하고 차세대 신약을 도출하는 고출력 바이오 컴퓨팅.',
    nodes: {
      upstream: {
        id: 'upstream',
        name: '연산: 물리학 계산 분자 플랫폼',
        x: 70, y: 250, w: 220, h: 60,
        description: '약물 분자간 결합 강도를 인공지능과 전산 화학 시뮬레이션으로 미세 분석하는 컴퓨팅 소프트웨어.',
        instruments: [
          { name: '슈뢰딩거 (Schrodinger)', ticker: 'SDGR', sector: 'Bio-AI & 합성생물학', fit: 83, overheat: 54, price: '$22.5', change: '+0.8%', volumeSignal: '외인 매집', analysis: '글로벌 제약회사들이 사용하는 물리 연산 AI 신약 소프트웨어 시장 점유율 1위.' }
        ]
      },
      midstream: {
        id: 'midstream',
        name: '실증: 타겟 단백질 발현 및 스크리닝',
        x: 390, y: 250, w: 220, h: 60,
        description: 'AI가 디자인한 단백질을 실제 합성하여 효능 및 표적 부합도를 임상적으로 판별하는 실증 공정.',
        instruments: [
          { name: '삼성전자', ticker: '005930', sector: 'Bio-AI & 합성생물학', fit: 75, overheat: 50, price: '72,400원', change: '+0.8%', volumeSignal: '개인 유입', analysis: '자회사 바이오로직스의 AI 기반 맞춤형 항체/바이오 시밀러 대량 조달 연계성.' }
        ]
      },
      downstream: {
        id: 'downstream',
        name: '수요: 글로벌 제약사 라이선스 아웃',
        x: 710, y: 250, w: 220, h: 60,
        description: '도출된 후보물질을 매집하여 글로벌 3상 임상을 거쳐 시판하는 글로벌 대형 제약 유통망.',
        instruments: [
          { name: '엔비디아 (NVIDIA)', ticker: 'NVDA', sector: 'Bio-AI & 합성생물학', fit: 95, overheat: 85, price: '$120.5', change: '+4.1%', volumeSignal: '역대급 대금', analysis: 'AI 신약 설계 플랫폼 에보젠(BioNeMo) 생태계를 확장하여 바이오 인프라를 공급.' }
        ]
      }
    },
    edges: [
      { from: 'upstream', to: 'midstream' },
      { from: 'midstream', to: 'downstream' }
    ]
  }
};

export default function ValueChainCanvas({ favorites, onToggleFavorite }) {
  const [selectedSector, setSelectedSector] = useState('tesla_universe');
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  
  // 줌 및 드래그 상태 관리
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const containerRef = useRef(null);

  const activeCanvas = CANVASES_DATA[selectedSector] || CANVASES_DATA.tesla_universe;
  const nodesList = Object.values(activeCanvas.nodes);
  
  // 현재 선택된 노드의 상세 정보 및 종목 카드
  const selectedNode = activeCanvas.nodes[selectedNodeId] || nodesList[0];

  const handleMouseDown = (e) => {
    if (e.target.closest('.canvas-node-item') || e.target.closest('.zoom-controls') || e.target.closest('.canvas-selector')) return;
    setIsDragging(true);
    dragStart.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.current.x,
      y: e.clientY - dragStart.current.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.15, 2.0));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.15, 0.5));
  const handleZoomReset = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const handleSelectSector = (sectorKey) => {
    setSelectedSector(sectorKey);
    setSelectedNodeId(null); // 섹터 교체 시 노드 선택 초기화
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  return (
    <div className="canvas-container animate-fade-in" ref={containerRef}>
      {/* 캔버스 헤더 */}
      <div className="canvas-header">
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Network size={20} className="text-accent" style={{ color: 'var(--accent-light)' }} />
            <span>KMC 11대 독립 유망 밸류체인 캔버스</span>
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            {activeCanvas.description}
          </p>
        </div>

        {/* 줌 제어 단추 */}
        <div className="zoom-controls" style={{ display: 'flex', gap: '6px', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)', padding: '4px', borderRadius: '8px', zIndex: 10 }}>
          <button className="canvas-sel-btn" onClick={handleZoomIn} style={{ padding: '6px 10px' }} title="확대">
            <ZoomIn size={14} />
          </button>
          <button className="canvas-sel-btn" onClick={handleZoomOut} style={{ padding: '6px 10px' }} title="축소">
            <ZoomOut size={14} />
          </button>
          <button className="canvas-sel-btn" onClick={handleZoomReset} style={{ padding: '6px 10px' }} title="초기화">
            <RotateCcw size={14} />
          </button>
          <span style={{ fontSize: '11px', color: 'var(--text-secondary)', padding: '6px', fontWeight: '600', minWidth: '45px', textAlign: 'center' }}>
            {Math.round(zoom * 100)}%
          </span>
        </div>
      </div>

      {/* 11대 독립 밸류체인 셀렉터 단추 리스트 (피드백 반영) */}
      <div className="canvas-selector" style={{ flexWrap: 'wrap', gap: '6px', marginBottom: '16px', background: 'rgba(255,255,255,0.02)', padding: '10px', borderRadius: '10px', border: '1px solid var(--border)' }}>
        <button className={`canvas-sel-btn ${selectedSector === 'tesla_universe' ? 'active' : ''}`} onClick={() => handleSelectSector('tesla_universe')}>👑 머스크 유니버스</button>
        <button className={`canvas-sel-btn ${selectedSector === 'arch48v' ? 'active' : ''}`} onClick={() => handleSelectSector('arch48v')}>🔌 1. 48V 아키텍처</button>
        <button className={`canvas-sel-btn ${selectedSector === 'hvt' ? 'active' : ''}`} onClick={() => handleSelectSector('hvt')}>⚡ 2. 초고압 변압기</button>
        <button className={`canvas-sel-btn ${selectedSector === 'distribution' ? 'active' : ''}`} onClick={() => handleSelectSector('distribution')}>🔌 3. 배전 및 전력제어</button>
        <button className={`canvas-sel-btn ${selectedSector === 'smr' ? 'active' : ''}`} onClick={() => handleSelectSector('smr')}>⚛️ 4. SMR/원자력</button>
        <button className={`canvas-sel-btn ${selectedSector === 'cooling' ? 'active' : ''}`} onClick={() => handleSelectSector('cooling')}>❄️ 5. 액체 냉각</button>
        <button className={`canvas-sel-btn ${selectedSector === 'hbm' ? 'active' : ''}`} onClick={() => handleSelectSector('hbm')}>💾 6. HBM 패키징</button>
        <button className={`canvas-sel-btn ${selectedSector === 'glass' ? 'active' : ''}`} onClick={() => handleSelectSector('glass')}>🔬 7. 유리 기판</button>
        <button className={`canvas-sel-btn ${selectedSector === 'ess' ? 'active' : ''}`} onClick={() => handleSelectSector('ess')}>🔋 8. 대용량 ESS</button>
        <button className={`canvas-sel-btn ${selectedSector === 'starlink' ? 'active' : ''}`} onClick={() => handleSelectSector('starlink')}>📡 9. 스타링크 통신</button>
        <button className={`canvas-sel-btn ${selectedSector === 'robot' ? 'active' : ''}`} onClick={() => handleSelectSector('robot')}>🤖 10. 휴머노이드 로봇</button>
        <button className={`canvas-sel-btn ${selectedSector === 'bio_ai' ? 'active' : ''}`} onClick={() => handleSelectSector('bio_ai')}>🧪 11. Bio-AI</button>
      </div>

      {/* 줌 & 팬 뷰포트 영역 */}
      <div 
        className="canvas-map-wrapper"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{
          cursor: isDragging ? 'grabbing' : 'grab',
          position: 'relative',
          height: '450px',
          overflow: 'hidden'
        }}
      >
        {/* 드래그 및 줌 효과를 반영하는 거대 캔버스 이너 */}
        <div
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: 'center center',
            transition: isDragging ? 'none' : 'transform 0.15s cubic-bezier(0.16, 1, 0.3, 1)',
            width: '1000px',
            height: '450px',
            position: 'absolute',
            left: 'calc(50% - 500px)',
            top: 'calc(50% - 225px)'
          }}
        >
          {/* 절대좌표 SVG 레이어 - 섹터별 엣지 라인 동적 렌더링 */}
          <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 1 }}>
            <defs>
              <marker id="arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 2 L 10 5 L 0 8 z" fill="rgba(139, 92, 246, 0.35)" />
              </marker>
            </defs>
            {/* activeCanvas.edges 동적 SVG 그리기 */}
            {activeCanvas.edges.map((edge, index) => {
              const fromNode = activeCanvas.nodes[edge.from];
              const toNode = activeCanvas.nodes[edge.to];
              if (!fromNode || !toNode) return null;
              
              // 노드 중심 좌표 계산
              const x1 = fromNode.x + fromNode.w / 2;
              const y1 = fromNode.y + fromNode.h / 2;
              const x2 = toNode.x + toNode.w / 2;
              const y2 = toNode.y + toNode.h / 2;

              return (
                <line
                  key={index}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="rgba(139, 92, 246, 0.45)"
                  strokeWidth="2.5"
                  markerEnd="url(#arrow)"
                />
              );
            })}
          </svg>

          {/* 노드 렌더러 */}
          {nodesList.map((node) => {
            const isSelected = selectedNodeId === node.id || (!selectedNodeId && nodesList[0].id === node.id);
            return (
              <div
                key={node.id}
                className={`canvas-node-item ${isSelected ? 'selected' : ''}`}
                style={{
                  position: 'absolute',
                  left: `${node.x}px`,
                  top: `${node.y}px`,
                  width: `${node.w}px`,
                  height: `${node.h}px`,
                  zIndex: 5,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  padding: '12px 14px',
                  boxShadow: isSelected ? '0 0 15px rgba(139, 92, 246, 0.4)' : 'none',
                  border: isSelected ? '2px solid var(--accent-light)' : '1px solid var(--border)'
                }}
                onClick={() => setSelectedNodeId(node.id)}
              >
                <div className="canvas-node-name" style={{ fontSize: '13px', fontWeight: '700' }}>
                  {node.name}
                </div>
                <div className="canvas-node-stocks">
                  {node.instruments.map((inst, idx) => (
                    <span key={idx} className="canvas-stock-badge" style={{ fontSize: '9px' }}>
                      {inst.name}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 하단 노드 상세 및 투자 정보 패널 */}
      {selectedNode && (
        <div className="node-drawer animate-fade-in" style={{ marginTop: '20px' }}>
          <div className="node-drawer-header">
            <div>
              <span style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', color: 'var(--accent-light)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Layers size={11} />
                공부와 분석을 겸비한 캔버스 리포트
              </span>
              <h3 className="node-drawer-title">{selectedNode.name}</h3>
            </div>
            <button className="close-btn" onClick={() => setSelectedNodeId(null)}>
              [ 패널 닫기 × ]
            </button>
          </div>
          
          <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
            {selectedNode.description}
          </p>

          <div style={{ marginTop: '10px' }}>
            <h4 style={{ fontSize: '14px', color: '#fff', marginBottom: '12px', fontWeight: '600' }}>
              연결 관련 종목 / ETF 투자 가치 판단
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))', gap: '16px' }}>
              {selectedNode.instruments.map((inst, idx) => {
                const isFav = favorites.includes(inst.ticker);
                return (
                  <InstrumentCard 
                    key={idx}
                    instrument={{ ...inst, sector: selectedNode.name }}
                    isFavorite={isFav}
                    onToggleFavorite={onToggleFavorite}
                  />
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
