'use client';

import { useState, useRef } from 'react';
import { Network, HelpCircle, Layers, ZoomIn, ZoomOut, RotateCcw, Award, Calendar, Link2, ExternalLink } from 'lucide-react';
import InstrumentCard from '../cards/InstrumentCard';

// 4대 Core 섹터 고밀도 팩트 기반 데이터
const CANVASES_DATA = {
  ai_power_grid: {
    title: '⚡ 1. AI 전력 인프라 / Grid Bottleneck',
    description: 'AI 데이터센터 전력 수요 폭증에 따른 초고압 변압기, 송배전 선로, 전력 제어 설비의 구조적 공급 병목 사슬.',
    nodes: {
      // 1단계: 원자재 (X = 60)
      copper: { id: 'copper', name: '구리/동가공 소재', x: 60, y: 40, w: 180, h: 50, description: '초고압 송전선 및 변압기 권선 코일의 기초 도체 소재.', instruments: [{ name: '풍산', ticker: '103140', price: '68,200원', change: '+3.5%' }], evidence: { grade: 'A', date: '2026-06-04', type: 'LME 구리 시세 공시' } },
      goes: { id: 'goes', name: '방향성 전기강판(GOES)', x: 60, y: 120, w: 180, h: 50, description: '변압기 코어(철심)의 전력 손실을 줄이는 핵심 강판.', instruments: [{ name: 'POSCO홀딩스', ticker: '005490', price: '374,000원', change: '+1.2%' }], evidence: { grade: 'A', date: '2026-06-04', type: '포스코 제품 명세' } },
      insulating_oil: { id: 'insulating_oil', name: '변압기 절연유', x: 60, y: 200, w: 180, h: 50, description: '변압기 내부 냉각 및 방전을 막는 전기 절연 오일.', instruments: [{ name: '미창석유', ticker: '003650', price: '82,400원', change: '0.0%' }], evidence: { grade: 'B', date: '2026-06-04', type: '산업부 원자재 보고서' } },
      superconductors: { id: 'superconductors', name: '초전도 고효율 도체', x: 60, y: 280, w: 180, h: 50, description: '송전 손실을 없애는 초전도 케이블용 소재.', instruments: [{ name: 'LS전선 관련주', ticker: '006260', price: '128,500원', change: '+5.1%' }], evidence: { grade: 'B', date: '2026-06-04', type: 'KEPRI 실증 리포트' } },
      sic_semicon: { id: 'sic_semicon', name: 'SiC 전력 반도체 소자', x: 60, y: 360, w: 180, h: 50, description: '고전압 스위칭 손실을 줄이는 실리콘 카바이드 소자.', instruments: [{ name: '온세미 (onsemi)', ticker: 'ON', price: '$74.2', change: '+1.2%' }], evidence: { grade: 'A', date: '2026-06-04', type: 'onsemi IR 자료' } },

      // 2단계: 가공/부품 (X = 320)
      transformer_core: { id: 'transformer_core', name: '변압기 코어 철심 가공', x: 320, y: 40, w: 180, h: 50, description: '방향성 전기강판을 정밀 적층하여 만든 변압기 유도 중추.', instruments: [{ name: '현대일렉트릭 협력사', ticker: '267260', price: '공급망', change: 'N/A' }], evidence: { grade: 'B', date: '2026-06-04', type: '공급망 분석 보고서' } },
      bushing: { id: 'bushing', name: '고압 부싱/인입 단자', x: 320, y: 120, w: 180, h: 50, description: '고전압 도체를 변압기 외함 밖으로 인출하는 절연 지지물.', instruments: [{ name: '이튼 코퍼레이션 (Eaton)', ticker: 'ETN', price: '$312.4', change: '+1.8%' }], evidence: { grade: 'A', date: '2026-06-04', type: 'Eaton 공급 사양서' } },
      gis_breaker: { id: 'gis_breaker', name: 'GIS 가스 차단기 부품', x: 320, y: 200, w: 180, h: 50, description: '가스 절연 개폐장치용 초고속 차단기 핵심 실린더.', instruments: [{ name: 'LS ELECTRIC', ticker: '010120', price: '218,000원', change: '+2.1%' }], evidence: { grade: 'A', date: '2026-06-04', type: 'LS 산전 기기 스펙' } },
      cable_joint: { id: 'cable_joint', name: '초고압 케이블 접속재', x: 320, y: 280, w: 180, h: 50, description: '초고압 케이블 라인을 연결해주는 고난도 접속 부속품.', instruments: [{ name: 'LS전선 관련주', ticker: '006260', price: '128,500원', change: '+5.1%' }], evidence: { grade: 'A', date: '2026-06-04', type: 'LS전선 수주 공시' } },
      switch_relay: { id: 'switch_relay', name: '배전 제어 릴레이', x: 320, y: 360, w: 180, h: 50, description: '원격으로 송배전 전력을 투입/차단 신호 조율기.', instruments: [{ name: '슈나이더 (Schneider)', ticker: 'SU.PA', price: '215.3€', change: '+0.9%' }], evidence: { grade: 'A', date: '2026-06-04', type: 'Schneider 카탈로그' } },

      // 3단계: 시스템 완제품 (X = 580)
      hvt_transformer: { id: 'hvt_transformer', name: '초고압 변압기 완제품', x: 580, y: 40, w: 180, h: 50, description: '송전망 전압을 최종 강하/승압해주는 대형 송전 기기.', instruments: [{ name: 'HD현대일렉트릭', ticker: '267260', price: '284,500원', change: '+8.4%' }, { name: '효성중공업', ticker: '298040', price: '352,000원', change: '+4.2%' }], evidence: { grade: 'A', date: '2026-06-04', type: '수주 잔고 공시' } },
      gis_switchgear: { id: 'gis_switchgear', name: '가스절연 개폐장치(GIS)', x: 580, y: 120, w: 180, h: 50, description: '송전 변전소의 전류 흐름을 개폐 제어하는 차단 설비.', instruments: [{ name: 'LS ELECTRIC', ticker: '010120', price: '218,000원', change: '+2.1%' }], evidence: { grade: 'A', date: '2026-06-04', type: 'LS 수배전 공급 이력' } },
      distribution_trans: { id: 'distribution_trans', name: '배전용 변압기/주상형', x: 580, y: 200, w: 180, h: 50, description: '데이터센터 인입 전 전력을 감압 분배하는 소형 변압기.', instruments: [{ name: '제룡전기', ticker: '033100', price: '64,200원', change: '+2.8%' }], evidence: { grade: 'A', date: '2026-06-04', type: '미국 전력청 수출 통계' } },
      hvdc_cable: { id: 'hvdc_cable', name: '초고압 직류송전(HVDC) 선로', x: 580, y: 280, w: 180, h: 50, description: '장거리 송전 시 손실이 적은 해저/지중 초고압 선로.', instruments: [{ name: '대한전선', ticker: '001440', price: '14,800원', change: '+1.5%' }], evidence: { grade: 'B', date: '2026-06-04', type: '글로벌 송전 프로젝트 공시' } },
      ems_software: { id: 'ems_software', name: '지능형 에너지 관리 SW', x: 580, y: 360, w: 180, h: 50, description: '배전 전력 부하 데이터를 실시간 분석 제어하는 솔루션.', instruments: [{ name: '슈나이더 (Schneider)', ticker: 'SU.PA', price: '215.3€', change: '+0.9%' }], evidence: { grade: 'B', date: '2026-06-04', type: 'Schneider DCIM 소개' } },

      // 4단계: 수요처 (X = 840)
      grid_utility: { id: 'grid_utility', name: '북미 전력망 유틸리티사', x: 840, y: 40, w: 180, h: 50, description: '미국 송배전망 인프라를 실제 구축/운영하는 유틸리티 대기업.', instruments: [{ name: 'NextEra Energy', ticker: 'NEE', price: '$72.4', change: '+0.5%' }], evidence: { grade: 'A', date: '2026-06-04', type: 'NEE 사업 보고서' } },
      dc_grid_connect: { id: 'dc_grid_connect', name: '데이터센터 계통 연계망', x: 840, y: 120, w: 180, h: 50, description: '초고속 데이터 연산을 위해 랙별로 변전 연동해주는 전력망.', instruments: [{ name: '비스트라 (Vistra)', ticker: 'VST', price: '$90.4', change: '+5.3%' }], evidence: { grade: 'B', date: '2026-06-04', type: '텍사스 계통연계 가이드라인' } },
      memphis_substation: { id: 'memphis_substation', name: 'xAI 멤피스 변전 설비', x: 840, y: 200, w: 180, h: 50, description: 'xAI 멤피스 Colossus 대형 랙 구동 전력 연동을 위한 전력 허브.', instruments: [{ name: 'Eaton Corp plc', ticker: 'ETN', price: '$312.4', change: '+1.8%' }], evidence: { grade: 'C', date: '2026-06-04', type: 'MLGW 멤피스 위원회 문서' } },
      nuclear_ppa: { id: 'nuclear_ppa', name: '원전 전력 직결 PPA', x: 840, y: 280, w: 180, h: 50, description: '송전 지연을 피해 가동 원전에서 직접 부하를 조달하는 모델.', instruments: [{ name: 'Constellation CEG', ticker: 'CEG', price: '$220.5', change: '+4.8%' }], evidence: { grade: 'A', date: '2026-06-04', type: 'Crane Clean Energy PPA 공시' } },
      gas_peaker: { id: 'gas_peaker', name: '가스 복합 기저 피크 발전', x: 840, y: 360, w: 180, h: 50, description: '송배전 피크 부하 돌발 상승 시 가동되는 가스 피크 발전 유닛.', instruments: [{ name: 'GE Vernova', ticker: 'GEV', price: '$156.4', change: '+2.2%' }], evidence: { grade: 'B', date: '2026-06-04', type: 'GEV 가스터빈 수주 통계' } }
    },
    edges: [
      // Upstream -> Midstream 1
      { from: 'copper', to: 'transformer_core', grade: 'A', date: '2026-06-04', desc: '고정밀 구리 권선을 통한 코어 권선 작업' },
      { from: 'goes', to: 'transformer_core', grade: 'A', date: '2026-06-04', desc: '전기강판 슬리팅 가공 및 변압기 철심 적층' },
      { from: 'insulating_oil', to: 'bushing', grade: 'B', date: '2026-06-04', desc: '부싱 인입 계통 절연 챔버용 절연유 충진' },
      { from: 'superconductors', to: 'cable_joint', grade: 'B', date: '2026-06-04', desc: '초전도 도체 연결을 위한 고정밀 조인트 설계' },
      { from: 'sic_semicon', to: 'switch_relay', grade: 'A', date: '2026-06-04', desc: 'SiC 소자를 채택한 원격 개폐 릴레이 모듈화' },

      // Midstream 1 -> Midstream 2
      { from: 'transformer_core', to: 'hvt_transformer', grade: 'A', date: '2026-06-04', desc: '코어 어셈블리 조립 후 초고압 변압기 완제품 생산' },
      { from: 'bushing', to: 'hvt_transformer', grade: 'A', date: '2026-06-04', desc: '초고압 외함용 도체 인입용 고전압 부싱 조립' },
      { from: 'gis_breaker', to: 'gis_switchgear', grade: 'A', date: '2026-06-04', desc: '차단 챔버를 탑재한 가스절연 개폐기 제품 완성' },
      { from: 'cable_joint', to: 'hvdc_cable', grade: 'B', date: '2026-06-04', desc: '해저 및 지중 전선 부설 중 접속재 연계' },
      { from: 'switch_relay', to: 'distribution_trans', grade: 'B', date: '2026-06-04', desc: '배전반 제어반과 배전 변압기 신호 연결' },
      { from: 'switch_relay', to: 'ems_software', grade: 'A', date: '2026-06-04', desc: '스마트 미터 릴레이 계측 데이터의 EMS 전송' },

      // Midstream 2 -> Downstream
      { from: 'hvt_transformer', to: 'grid_utility', grade: 'A', date: '2026-06-04', desc: '미국 유틸리티사 노후 송전 그리드 교체용 변압기 공급' },
      { from: 'gis_switchgear', to: 'grid_utility', grade: 'A', date: '2026-06-04', desc: '송배전 안전 강화를 위한 변전소 차단 설비 조달' },
      { from: 'distribution_trans', to: 'dc_grid_connect', grade: 'A', date: '2026-06-04', desc: '데이터센터 인입 전압 강하용 배전 변압기 연결' },
      { from: 'hvdc_cable', to: 'grid_utility', grade: 'B', date: '2026-06-04', desc: '주간 장거리 전력 연계망 구축용 선로 납품' },
      { from: 'ems_software', to: 'dc_grid_connect', grade: 'B', date: '2026-06-04', desc: 'DC 내 전력 부하 분산 스케줄을 위한 제어 정보 매칭' },
      { from: 'distribution_trans', to: 'memphis_substation', grade: 'C', date: '2026-06-04', desc: '멤피스 데이터센터 변전소 내 배전기기 수주' },
      { from: 'hvt_transformer', to: 'nuclear_ppa', grade: 'A', date: '2026-06-04', desc: '원전 직결용 송전선 연계 변전 설비 구축' },
      { from: 'ems_software', to: 'gas_peaker', grade: 'B', date: '2026-06-04', desc: 'EMS 관제 하에 피크 발전 유닛 원격 온/오프 자동 제어' }
    ]
  },
  hbm_packaging: {
    title: '💾 2. AI 반도체 / HBM / Advanced Packaging',
    description: '고대역폭 메모리(HBM) 적층 공정, Advanced Packaging(CoWoS 등) 및 차세대 유리기판 연계 반도체 병목 밸류체인.',
    nodes: {
      // 1단계: 원자재 (X = 60)
      dram_wafer: { id: 'dram_wafer', name: 'DRAM Wafer 원재료', x: 60, y: 40, w: 180, h: 50, description: '고대역폭 메모리 적층의 기초가 되는 미세 DRAM 웨이퍼 다이.', instruments: [{ name: 'SK하이닉스', ticker: '000660', price: '203,500원', change: '+3.2%' }], evidence: { grade: 'A', date: '2026-06-04', type: '반도체 공정 맵 자료' } },
      carrier_wafer: { id: 'carrier_wafer', name: '캐리어 글래스 웨이퍼', x: 60, y: 120, w: 180, h: 50, description: '웨이퍼 백그라인딩 및 임시 본딩에 사용되는 캐리어 기판.', instruments: [{ name: 'SKC', ticker: '011790', price: '142,500원', change: '+4.5%' }], evidence: { grade: 'B', date: '2026-06-04', type: '어드밴스드 소재 사양' } },
      emc: { id: 'emc', name: '액상 에폭시 몰딩재 (EMC)', x: 60, y: 200, w: 180, h: 50, description: '적층된 HBM D램을 고정시키고 밀봉해주는 에폭시 화학 보호 소재.', instruments: [{ name: '삼성전자 부품사', ticker: '005930', price: '공급망', change: 'N/A' }], evidence: { grade: 'B', date: '2026-06-04', type: '반도체 패키징 소재 연구' } },
      abf_film: { id: 'abf_film', name: '아지노모토 ABF 필름', x: 60, y: 280, w: 180, h: 50, description: '미세 회로의 기판 간 절연을 형성해주는 핵심 인슐레이터 필름.', instruments: [{ name: '아지노모토 (일본)', ticker: '2802.T', price: '5,420¥', change: '0.0%' }], evidence: { grade: 'A', date: '2026-06-04', type: '독점 소재 특허 확인' } },
      photoresist: { id: 'photoresist', name: '극자외선 PR 감광액', x: 60, y: 360, w: 180, h: 50, description: '웨이퍼 노광 패턴 및 TSV 에칭 홀 형성에 쓰이는 화학 감광액.', instruments: [{ name: '도쿄오카 (일본)', ticker: '4186.T', price: '3,840¥', change: '+0.5%' }], evidence: { grade: 'A', date: '2026-06-04', type: 'EUV 공급망 공시' } },

      // 2단계: 가공/부품 (X = 320)
      tc_bonder: { id: 'tc_bonder', name: '듀얼 TC 본더 장비', x: 320, y: 40, w: 180, h: 50, description: 'TSV 구리 기둥을 열압착하여 D램을 적층 접합하는 초정밀 본딩 장비.', instruments: [{ name: '한미반도체', ticker: '042700', price: '162,000원', change: '+6.8%' }], evidence: { grade: 'A', date: '2026-06-04', type: 'SK하이닉스 발주 계약서' } },
      hybrid_bonder: { id: 'hybrid_bonder', name: '하이브리드 다이렉트 본더', x: 320, y: 120, w: 180, h: 50, description: '범프 없이 실리콘과 구리를 상온에서 분자 결합시키는 차세대 본더.', instruments: [{ name: 'Besi (네덜란드)', ticker: 'BESI.AS', price: '142.3€', change: '+1.5%' }], evidence: { grade: 'B', date: '2026-06-04', type: 'Besi 기술 세미나 IR' } },
      tsv_drilling: { id: 'tsv_drilling', name: 'TSV 실리콘 에칭 레이저', x: 320, y: 200, w: 180, h: 50, description: '웨이퍼를 미세 관통하여 큐비트 신호 통로를 뚫어주는 장비.', instruments: [{ name: '이오테크닉스', ticker: '089010', price: '184,200원', change: '-1.2%' }], evidence: { grade: 'B', date: '2026-06-04', type: '반도체 장비 특허 출원' } },
      wafer_grinder: { id: 'wafer_grinder', name: '웨이퍼 백그라인더', x: 320, y: 280, w: 180, h: 50, description: '적층 HBM의 두께를 한계치까지 극도로 얇게 갈아주는 정밀 연마 장비.', instruments: [{ name: '디스코 (일본)', ticker: '6146.T', price: '48,200¥', change: '+3.1%' }], evidence: { grade: 'A', date: '2026-06-04', type: 'Disco 글로벌 기기 점유율' } },
      inspection_cam: { id: 'inspection_cam', name: '웨이퍼 얼라인먼트 검사기', x: 320, y: 360, w: 180, h: 50, description: '적층 오차를 검사하고 마이크로 범프 핀 불량을 사전에 선별하는 광학계.', instruments: [{ name: '인텍플러스', ticker: '064290', price: '28,450원', change: '+1.8%' }], evidence: { grade: 'B', date: '2026-06-04', type: '고객사 장비 테스트 공시' } },

      // 3단계: 시스템 완제품 (X = 580)
      hbm3e_stack: { id: 'hbm3e_stack', name: 'HBM3E D램 스택 완제품', x: 580, y: 40, w: 180, h: 50, description: '8단/12단 MR-MUF 공정으로 패킹된 고대역폭 메모리 유닛.', instruments: [{ name: 'SK하이닉스', ticker: '000660', price: '203,500원', change: '+3.2%' }, { name: '삼성전자', ticker: '005930', price: '77,400원', change: '+0.8%' }], evidence: { grade: 'A', date: '2026-06-04', type: '엔비디아 승인 퀄테스트 이력' } },
      hbm4_base: { id: 'hbm4_base', name: 'HBM4 로직 베이스 다이', x: 580, y: 120, w: 180, h: 50, description: '차세대 HBM4 적층 시 속도를 배가시켜주는 로직 파운드리 다이.', instruments: [{ name: 'TSMC', ticker: 'TSM', price: '$154.2', change: '+2.5%' }], evidence: { grade: 'A', date: '2026-06-04', type: 'TSMC OIP 생태계 공지' } },
      silicon_interposer: { id: 'silicon_interposer', name: '실리콘 인터포저 기판', x: 580, y: 200, w: 180, h: 50, description: '메인보드와 미세 칩들 사이에 장착되는 초미세 회로 매핑 플레이트.', instruments: [{ name: 'TSMC 파트너', ticker: 'TSM', price: '공급망', change: 'N/A' }], evidence: { grade: 'B', date: '2026-06-04', type: 'CoWoS 아키텍처 다이어그램' } },
      glass_substrate: { id: 'glass_substrate', name: 'TGV 유리기판 코어', x: 580, y: 280, w: 180, h: 50, description: '실리콘 인터포저를 탈피하여 신호 속도와 전력을 대폭 절감하는 유리 기판.', instruments: [{ name: 'SKC', ticker: '011790', price: '142,500원', change: '+4.5%' }, { name: '삼성전기', ticker: '009150', price: '158,000원', change: '+1.3%' }], evidence: { grade: 'A', date: '2026-06-04', type: '앱솔릭스 파일럿 양산 데이터' } },
      fowlp_package: { id: 'fowlp_package', name: '팬아웃 패키지(FOWLP)', x: 580, y: 360, w: 180, h: 50, description: 'PCB 기판 없이 다이 외곽으로 패드를 넓혀 얇고 빠르게 구현하는 어셈블리.', instruments: [{ name: '네패스아크', ticker: '330860', price: '21,200원', change: '+1.1%' }], evidence: { grade: 'B', date: '2026-06-04', type: 'OSAT 패키지 사양서' } },

      // 4단계: 수요처 (X = 840)
      nvidia_blackwell: { id: 'nvidia_blackwell', name: 'NVIDIA Blackwell GPU', x: 840, y: 40, w: 180, h: 50, description: 'HBM3E 8개와 GPU 코어 2개가 CoWoS 패키징으로 통합된 최고 사양 가속기.', instruments: [{ name: 'NVIDIA', ticker: 'NVDA', price: '$121.2', change: '+4.1%' }], evidence: { grade: 'A', date: '2026-06-04', type: 'NVIDIA 공식 론칭 스펙' } },
      amd_instinct: { id: 'amd_instinct', name: 'AMD Instinct 가속기', x: 840, y: 120, w: 180, h: 50, description: '칩렛 구조와 개방형 생태계(ROCm)를 기반으로 고성능을 내는 칩셋.', instruments: [{ name: 'AMD', ticker: 'AMD', price: '$162.4', change: '+1.5%' }], evidence: { grade: 'A', date: '2026-06-04', type: 'AMD 제품 사양서' } },
      tsmc_cowos: { id: 'tsmc_cowos', name: 'TSMC CoWoS 생산라인', x: 840, y: 200, w: 180, h: 50, description: '빅테크 기업들의 AI 가속기를 최종 패키지 통합 조립해주는 전담 파운드리.', instruments: [{ name: 'TSMC', ticker: 'TSM', price: '$154.2', change: '+2.5%' }], evidence: { grade: 'A', date: '2026-06-04', type: 'TSMC 설비 투자 공시' } },
      custom_asic: { id: 'custom_asic', name: '빅테크 커스텀 ASIC 연산망', x: 840, y: 280, w: 180, h: 50, description: '자체 랙 아키텍처에 맞춰 설계하는 전력 최적화 구글 TPU, AWS Trainium.', instruments: [{ name: '브로드컴 (Broadcom)', ticker: 'AVGO', price: '$1,380.5', change: '+2.8%' }], evidence: { grade: 'B', date: '2026-06-04', type: 'AVGO 디자인 윈 공시' } },
      net_switch: { id: 'net_switch', name: 'AI 초고속 네트워킹 스위치', x: 840, y: 360, w: 180, h: 50, description: '클러스터 간 병목을 막아주는 800G 광통신 스위치 랙 기기.', instruments: [{ name: '아리스타 (Arista)', ticker: 'ANET', price: '$298.5', change: '+3.1%' }], evidence: { grade: 'A', date: '2026-06-04', type: 'Arista 공급 계약 내역' } }
    },
    edges: [
      // Upstream -> Midstream 1
      { from: 'dram_wafer', to: 'tc_bonder', grade: 'A', date: '2026-06-04', desc: 'DRAM 웨이퍼 박막 절단 후 TC 본더 접합' },
      { from: 'carrier_wafer', to: 'wafer_grinder', grade: 'A', date: '2026-06-04', desc: '웨이퍼 연마 작업을 돕는 유리 캐리어 본딩 연동' },
      { from: 'emc', to: 'inspection_cam', grade: 'B', date: '2026-06-04', desc: 'MUF 몰딩 가공 후 외관 불량 검사 카메라 얼라인먼트' },
      { from: 'abf_film', to: 'tsv_drilling', grade: 'B', date: '2026-06-04', desc: '절연층 도포 및 TSV 미세 라우팅 드릴링 가공' },
      { from: 'photoresist', to: 'tsv_drilling', grade: 'A', date: '2026-06-04', desc: 'EUV 미세 패터닝 노광 에칭 마스킹 화학 공정' },

      // Midstream 1 -> Midstream 2
      { from: 'tc_bonder', to: 'hbm3e_stack', grade: 'A', date: '2026-06-04', desc: 'TC 본딩 완료 후 HBM3E 완성품 메모리 다이 빌드' },
      { from: 'hybrid_bonder', to: 'hbm4_base', grade: 'B', date: '2026-06-04', desc: '하이브리드 카퍼 본딩으로 범프 없이 HBM4 로직 다이 연결' },
      { from: 'tsv_drilling', to: 'silicon_interposer', grade: 'A', date: '2026-06-04', desc: '실리콘 인터포저 상의 초미세 큐비트 관통 배선 구축' },
      { from: 'wafer_grinder', to: 'hbm3e_stack', grade: 'A', date: '2026-06-04', desc: '웨이퍼 뒷면 연마 후 패킹 높이 최소화 달성' },
      { from: 'inspection_cam', to: 'fowlp_package', grade: 'B', date: '2026-06-04', desc: '양품 웨이퍼 칩렛 외곽에 범프 신호 패드 확장' },

      // Midstream 2 -> Downstream
      { from: 'hbm3e_stack', to: 'tsmc_cowos', grade: 'A', date: '2026-06-04', desc: '메모리 다이를 TSMC CoWoS 통합 패키징 패널로 전송' },
      { from: 'hbm4_base', to: 'tsmc_cowos', grade: 'A', date: '2026-06-04', desc: 'HBM4 하단 로직 베이스 레이어를 인터포저에 접합' },
      { from: 'silicon_interposer', to: 'tsmc_cowos', grade: 'B', date: '2026-06-04', desc: ' CoWoS interposer 배선 위에 GPU 실장' },
      { from: 'glass_substrate', to: 'tsmc_cowos', grade: 'B', date: '2026-06-04', desc: '유리 기판 코어를 칩셋 실장 서브스트레이트로 활용' },
      { from: 'fowlp_package', to: 'custom_asic', grade: 'B', date: '2026-06-04', desc: '팬아웃 칩셋 구조를 빅테크 ASIC에 결합' },
      { from: 'tsmc_cowos', to: 'nvidia_blackwell', grade: 'A', date: '2026-06-04', desc: 'CoWoS 조립 공정 최종 완료 후 Blackwell GPU 패키지 출시' },
      { from: 'tsmc_cowos', to: 'amd_instinct', grade: 'A', date: '2026-06-04', desc: 'CoWoS 장비를 통한 Instinct 가속기 패키징 아웃풋 공급' },
      { from: 'tsmc_cowos', to: 'custom_asic', grade: 'B', date: '2026-06-04', desc: '구글 TPU 패키징 외주 조립 서비스 납품' },
      { from: 'glass_substrate', to: 'net_switch', grade: 'B', date: '2026-06-04', desc: '광통신 네트워킹 기판용 유리기판 고주파 손실 감소 적용' }
    ]
  },
  datacenter_infra: {
    title: '❄️ 3. AI 데이터센터 전력/냉각 인프라',
    description: '고출력 AI 가속기 발열을 제어하는 Direct-to-Chip 액체 냉각, 스마트 PDU/UPS 및Prefab 모듈형 빌딩의 통합 기술망.',
    nodes: {
      // 1단계: 원자재 (X = 60)
      coolant: { id: 'coolant', name: '절연 액체 냉매액', x: 60, y: 40, w: 180, h: 50, description: '전자기 불 전도 특성을 가졌으며 증발 잠열이 큰 고효율 불소계 냉매액.', instruments: [{ name: '3M (미국)', ticker: 'MMM', price: '$94.5', change: '0.0%' }], evidence: { grade: 'A', date: '2026-06-04', type: '3M 불소냉매 안전 인증' } },
      leak_sensor: { id: 'leak_sensor', name: '누액 감지 광케이블 소자', x: 60, y: 120, w: 180, h: 50, description: '냉매 누출 시 빛의 굴절 변화를 감지해 경보를 울리는 광소자.', instruments: [{ name: '센서제조 파트너', ticker: '006260', price: '공급망', change: 'N/A' }], evidence: { grade: 'B', date: '2026-06-04', type: '누수방지 광케이블 특허' } },
      water_valve: { id: 'water_valve', name: '유체 흐름 밸브/센서', x: 60, y: 200, w: 180, h: 50, description: '유량 속도 및 압력을 동적으로 유지시키는 전자기 밸브 소자.', instruments: [{ name: '모다인 (Modine)', ticker: 'MOD', price: '$118.5', change: '+3.1%' }], evidence: { grade: 'A', date: '2026-06-04', type: 'MOD 산업용 밸브 납품' } },
      pump_motor: { id: 'pump_motor', name: '초정밀 펌프용 모터', x: 60, y: 280, w: 180, h: 50, description: '냉각 루프 내 냉매를 일정한 고압으로 순환시키는 전기 모터.', instruments: [{ name: '이튼 (Eaton)', ticker: 'ETN', price: '$312.4', change: '+1.8%' }], evidence: { grade: 'A', date: '2026-06-04', type: 'Eaton 펌프 제어 모터 사양' } },
      cooling_fins: { id: 'cooling_fins', name: '고방열 구리 핀 플레이트', x: 60, y: 360, w: 180, h: 50, description: '단위면적당 방열 성능을 최대화한 구리/알루미늄 핀 가공재.', instruments: [{ name: '풍산 관련 공급망', ticker: '103140', price: '공급망', change: 'N/A' }], evidence: { grade: 'B', date: '2026-06-04', type: '방열판 열전도 설계 분석' } },

      // 2단계: 가공/부품 (X = 320)
      smart_pdu: { id: 'smart_pdu', name: '지능형 PDU 분배 장치', x: 320, y: 40, w: 180, h: 50, description: '서버 랙 개별 장치 단위의 소비 전력을 실시간 차단 제어하는 콘센트.', instruments: [{ name: 'LS ELECTRIC', ticker: '010120', price: '218,000원', change: '+2.1%' }], evidence: { grade: 'A', date: '2026-06-04', type: 'LS 스마트 PDU 공장 도면' } },
      busway: { id: 'busway', name: '전력 전달 버스웨이(Busway)', x: 320, y: 120, w: 180, h: 50, description: '케이블 뭉치 대신 단단한 도체 바 형태로 대전력을 공급하는 전선로.', instruments: [{ name: 'LS전선 관련주', ticker: '006260', price: '128,500원', change: '+5.1%' }], evidence: { grade: 'A', date: '2026-06-04', type: '지중 배선 버스덕트 수주' } },
      lithium_ups: { id: 'lithium_ups', name: '리튬 기반 대용량 UPS', x: 320, y: 200, w: 180, h: 50, description: '정전 시 지연 시간 없이 랙에 비상 전력을 가동해주는 백업 장치.', instruments: [{ name: '서진시스템', ticker: '178320', price: '29,450원', change: '+5.3%' }], evidence: { grade: 'B', date: '2026-06-04', type: 'UPS 배터리 공급 레퍼런스' } },
      rack_frame: { id: 'rack_frame', name: '서버 랙 인클로저 프레임', x: 320, y: 280, w: 180, h: 50, description: '액체 파이프 및 통신선이 통합 배치되는 맞춤형 서버 고정 철제 프레임.', instruments: [{ name: '서진시스템', ticker: '178320', price: '29,450원', change: '+5.3%' }], evidence: { grade: 'B', date: '2026-06-04', type: '서진 서버 캐비닛 라인 증설' } },
      dc_switchgear: { id: 'dc_switchgear', name: '데이터센터 특화 스위치기어', x: 320, y: 360, w: 180, h: 50, description: 'AI 워크로드 스파이크 폭증 시 순간 과부하를 막는 차단 차폐 기기.', instruments: [{ name: '이튼 (Eaton)', ticker: 'ETN', price: '$312.4', change: '+1.8%' }], evidence: { grade: 'A', date: '2026-06-04', type: 'Eaton 전원제어 기기 공시' } },

      // 3단계: 시스템 완제품 (X = 580)
      cold_plate: { id: 'cold_plate', name: 'Direct-to-Chip 콜드 플레이트', x: 580, y: 40, w: 180, h: 50, description: 'AI GPU 다이 위에 냉매 파이프를 직접 밀착해 열을 뽑아내는 모듈.', instruments: [{ name: 'Vertiv (버티브)', ticker: 'VRT', price: '$98.4', change: '+6.2%' }], evidence: { grade: 'A', date: '2026-06-04', type: 'NVIDIA 냉각 레퍼런스 협약' } },
      cdu_unit: { id: 'cdu_unit', name: '냉각 분배장치 (CDU)', x: 580, y: 120, w: 180, h: 50, description: '열교환기를 거친 냉각액을 압력 조절하여 여러 랙으로 분산 펌핑하는 본체.', instruments: [{ name: 'Vertiv (버티브)', ticker: 'VRT', price: '$98.4', change: '+6.2%' }], evidence: { grade: 'A', date: '2026-06-04', type: 'Vertiv 특허 CDU 가동 실적' } },
      rear_door: { id: 'rear_door', name: '리어도어 열교환기 (RDHx)', x: 580, y: 200, w: 180, h: 50, description: '랙 뒷문 전체에 팬과 수냉 핀을 달아 배출되는 바람 온도를 실온으로 낮추는 도어.', instruments: [{ name: '슈나이더 (Schneider)', ticker: 'SU.PA', price: '215.3€', change: '+0.9%' }], evidence: { grade: 'B', date: '2026-06-04', type: '슈나이더 리어도어 설계 도면' } },
      immersion_tank: { id: 'immersion_tank', name: '침전식 다이렉트 수조', x: 580, y: 280, w: 180, h: 50, description: '서버 전체를 비도전성 절연 냉매 수조에 담그는 고밀도 극저온 냉각 설비.', instruments: [{ name: 'Vertiv (버티브)', ticker: 'VRT', price: '$98.4', change: '+6.2%' }], evidence: { grade: 'B', date: '2026-06-04', type: 'Immersion Cooling 기술 공시' } },
      prefab_dc: { id: 'prefab_dc', name: '프리패브 컨테이너 모듈 IDC', x: 580, y: 360, w: 180, h: 50, description: '공장에서 변전/냉각/랙을 컨테이너 안에 다 조립해와 현장에 바로 놓는 데이터센터.', instruments: [{ name: '이튼 (Eaton)', ticker: 'ETN', price: '$312.4', change: '+1.8%' }], evidence: { grade: 'B', date: '2026-06-04', type: 'EatonPrefab 수주 실적' } },

      // 4단계: 수요처 (X = 840)
      ai_server_rack: { id: 'ai_server_rack', name: '120kW 초고밀도 AI 서버 랙', x: 840, y: 40, w: 180, h: 50, description: '블랙웰 가속기 72개와 수냉 매니폴드 배관이 통합 탑재된 최상위 랙.', instruments: [{ name: '엔비디아 (NVIDIA)', ticker: 'NVDA', price: '$121.2', change: '+4.1%' }], evidence: { grade: 'A', date: '2026-06-04', type: 'NVL72 랙 설계 규격' } },
      hyperscale_idc: { id: 'hyperscale_idc', name: '글로벌 하이퍼스케일 IDC', x: 840, y: 120, w: 180, h: 50, description: '수만 개의 가속기 랙을 구동하는 MW급 초대형 인프라 빌딩.', instruments: [{ name: 'Equinix (에퀴닉스)', ticker: 'EQIX', price: '$782.5', change: '+0.5%' }], evidence: { grade: 'A', date: '2026-06-04', type: 'EQIX AI 리츠 보고서' } },
      dcim_system: { id: 'dcim_system', name: 'DCIM 전력/냉각 연동 관제', x: 840, y: 200, w: 180, h: 50, description: 'PUE/WUE 최적화를 위해 실시간 환경 지표를 중앙 모니터링하는 SW.', instruments: [{ name: '슈나이더 (Schneider)', ticker: 'SU.PA', price: '215.3€', change: '+0.9%' }], evidence: { grade: 'A', date: '2026-06-04', type: 'EcoStruxure 데이터센터 매뉴얼' } },
      hpc_cloud: { id: 'hpc_cloud', name: 'HPC AI 클라우드 팜', x: 840, y: 280, w: 180, h: 50, description: '수냉 인프라 기반 고연산 가속기를 가상 머신 구독 형태로 제공하는 팜.', instruments: [{ name: '마이크로소프트 (MSFT)', ticker: 'MSFT', price: '$418.2', change: '+1.1%' }], evidence: { grade: 'A', date: '2026-06-04', type: 'Azure HPC 가동 현황' } },
      eco_cooling: { id: 'eco_cooling', name: '친환경 수자원 쿨링 시스템', x: 840, y: 360, w: 180, h: 50, description: 'PUE를 낮추기 위해 하천수 또는 외부 공기를 하이브리드로 결합하는 시스템.', instruments: [{ name: 'Modine (모다인)', ticker: 'MOD', price: '$118.5', change: '+3.1%' }], evidence: { grade: 'B', date: '2026-06-04', type: 'Modine 친환경 공조 수주' } }
    },
    edges: [
      // Upstream -> Midstream 1
      { from: 'coolant', to: 'lithium_ups', grade: 'B', date: '2026-06-04', desc: 'UPS 리튬 배터리실 화재 방지용 절연 소화액 탑재' },
      { from: 'leak_sensor', to: 'rack_frame', grade: 'B', date: '2026-06-04', desc: '수냉 랙 프레임 내 누수감지 광센서 라인 부착' },
      { from: 'water_valve', to: 'smart_pdu', grade: 'B', date: '2026-06-04', desc: '전기 제어반 유량 밸브 차단 신호 연동' },
      { from: 'pump_motor', to: 'busway', grade: 'B', date: '2026-06-04', desc: '대용량 펌프 모터 가동용 전원 버스덕트 배치' },
      { from: 'cooling_fins', to: 'rack_frame', grade: 'A', date: '2026-06-04', desc: '랙 탈부착 열교환 핀 가공 파트너십 공급' },

      // Midstream 1 -> Midstream 2
      { from: 'smart_pdu', to: 'cold_plate', grade: 'A', date: '2026-06-04', desc: '콜드플레이트 장착 랙 전원 제어 PDU 핀 연결' },
      { from: 'busway', to: 'cdu_unit', grade: 'A', date: '2026-06-04', desc: 'CDU 펌프 구동에 필요한 고압 전선 버스덕트 연결' },
      { from: 'lithium_ups', to: 'rear_door', grade: 'B', date: '2026-06-04', desc: '리어도어 제어팬 비상 정전 방지용 백업 UPS 배터리 확보' },
      { from: 'rack_frame', to: 'immersion_tank', grade: 'B', date: '2026-06-04', desc: '수조형 랙에 가속기를 장착하기 위한 고내식성 프레임 적용' },
      { from: 'dc_switchgear', to: 'prefab_dc', grade: 'B', date: '2026-06-04', desc: '컨테이너 데이터센터 변전부 스위치보드 장착' },

      // Midstream 2 -> Downstream
      { from: 'cold_plate', to: 'ai_server_rack', grade: 'A', date: '2026-06-04', desc: '블랙웰 가속기에 콜드플레이트 조립하여 NVL72 수냉 랙 완성' },
      { from: 'cdu_unit', to: 'ai_server_rack', grade: 'A', date: '2026-06-04', desc: '수냉 랙 내 냉각 매니폴드 매니징 CDU 연계' },
      { from: 'rear_door', to: 'hyperscale_idc', grade: 'A', date: '2026-06-04', desc: '하이브리드 공랭/수냉 IDC 건물 랙 후면에 리어도어 설비 구축' },
      { from: 'immersion_tank', to: 'hyperscale_idc', grade: 'B', date: '2026-06-04', desc: '극저온 AI 연산 룸 내에 침전식 수조 시스템 실배치' },
      { from: 'prefab_dc', to: 'hpc_cloud', grade: 'A', date: '2026-06-04', desc: '공동 부지에 프리패브 컨테이너 모듈을 배치해 조기 HPC 클라우드 개통' },
      { from: 'ai_server_rack', to: 'hpc_cloud', grade: 'A', date: '2026-06-04', desc: 'NVL72 수냉 랙을 Azure HPC 팜에 최종 납품 및 가동' },
      { from: 'rear_door', to: 'dcim_system', grade: 'B', date: '2026-06-04', desc: '리어도어 열센서 데이터를 DCIM 환경 센싱 정보와 통신 바인딩' },
      { from: 'prefab_dc', to: 'eco_cooling', grade: 'B', date: '2026-06-04', desc: '프리패브 외부 공조 연결용 하천수 연계라인 결합' }
    ]
  },
  bess_ess: {
    title: '🔋 4. BESS / 전력 유연성 / ESS',
    description: '기가와트시(GWh)급 산업용 대용량 에너지 저장 장치(BESS)의 배터리 셀, 배전용 인버터 및 가상 발전소(VPP) 인프라.',
    nodes: {
      // 1단계: 원자재 (X = 60)
      lfp_cathode: { id: 'lfp_cathode', name: 'LFP 양극재/원자재', x: 60, y: 40, w: 180, h: 50, description: '수명이 길고 열 폭주 리스크가 적어 BESS에 표준 채택된 LFP 양극재.', instruments: [{ name: '엘앤에프', ticker: '066970', price: '128,200원', change: '+2.1%' }], evidence: { grade: 'A', date: '2026-06-04', type: 'LFP 양산 공급망 보고서' } },
      sodium_ion: { id: 'sodium_ion', name: '수계 소듐이온 소자', x: 60, y: 120, w: 180, h: 50, description: '소듐(나트륨)을 채택하여 저렴하고 화재 걱정 없는 미래 고정형 ESS용 소자.', instruments: [{ name: 'CATL (중국)', ticker: '300750.SZ', price: '184.2元', change: '+1.5%' }], evidence: { grade: 'B', date: '2026-06-04', type: 'CATL 소듐 배터리 사양 공시' } },
      cylindrical_cell: { id: 'cylindrical_cell', name: '4680 대형 원통형 셀', x: 60, y: 200, w: 180, h: 50, description: 'ESS 구조 조립 효율을 키워주는 대용량 원통형 배터리 셀.', instruments: [{ name: 'LG에너지솔루션', ticker: '373220', price: '364,500원', change: '+0.8%' }], evidence: { grade: 'A', date: '2026-06-04', type: 'LG 오창 4680 가동 실적' } },
      barrier_layer: { id: 'barrier_layer', name: '열폭주 차단 격리막', x: 60, y: 280, w: 180, h: 50, description: '셀 화재 발생 시 다른 인접 셀로 열이 퍼지지 않게 막는 세라믹 단열 격리막.', instruments: [{ name: 'SK아이이테크놀로지', ticker: '361610', price: '48,500원', change: '0.0%' }], evidence: { grade: 'A', date: '2026-06-04', type: 'SKIET 코팅 격리막 규격' } },
      electrolyte: { id: 'electrolyte', name: '고안정 리튬염 전해액', x: 60, y: 360, w: 180, h: 50, description: '고전압 장기 보관 시에도 분해되지 않고 전자를 이동시키는 용매.', instruments: [{ name: '엔켐', ticker: '348370', price: '242,500원', change: '+3.8%' }], evidence: { grade: 'B', date: '2026-06-04', type: '엔켐 공장 가동 현황 보고' } },

      // 2단계: 가공/부품 (X = 320)
      ess_enclosure: { id: 'ess_enclosure', name: 'ESS 컨테이너 인클로저', x: 320, y: 40, w: 180, h: 50, description: '배터리 팩을 기후와 물리 충격으로부터 보호하는 컨테이너형 철제 외함.', instruments: [{ name: '서진시스템', ticker: '178320', price: '29,450원', change: '+5.3%' }], evidence: { grade: 'A', date: '2026-06-04', type: 'Fluence OEM 장기 계약' } },
      bms_board: { id: 'bms_board', name: 'BMS 배터리 관리 보드', x: 320, y: 120, w: 180, h: 50, description: '수백 개의 셀 전압과 온도를 모니터링하여 폭발을 감지 차단하는 제어 보드.', instruments: [{ name: 'LG에너지솔루션 파트너', ticker: '373220', price: '공급망', change: 'N/A' }], evidence: { grade: 'B', date: '2026-06-04', type: 'BMS 제어 규격서' } },
      bess_coldplate: { id: 'bess_coldplate', name: 'BESS 팩 수냉 냉각판', x: 320, y: 200, w: 180, h: 50, description: '대용량 배터리 방전 시 셀 수명을 유지하기 위해 장착되는 냉각 플레이트.', instruments: [{ name: 'Modine (모다인)', ticker: 'MOD', price: '$118.5', change: '+3.1%' }], evidence: { grade: 'B', date: '2026-06-04', type: 'Modine ESS 냉각 수주 정보' } },
      power_converter: { id: 'power_converter', name: '대용량 PCS 변환 시스템', x: 320, y: 280, w: 180, h: 50, description: '배터리 직류(DC) 전기를 전력망 송전용 교류(AC)로 양방향 변환하는 장치.', instruments: [{ name: 'LS ELECTRIC', ticker: '010120', price: '218,000원', change: '+2.1%' }], evidence: { grade: 'A', date: '2026-06-04', type: 'LS 산전 대용량 PCS 스펙' } },
      grid_inverter: { id: 'grid_inverter', name: 'Grid-forming 인버터 계측기', x: 320, y: 360, w: 180, h: 50, description: '신재생에너지 변동성이 큰 망의 주파수를 동적으로 안정시키는 인버터.', instruments: [{ name: '엔페이즈 (Enphase)', ticker: 'ENPH', price: '$112.4', change: '-0.5%' }], evidence: { grade: 'A', date: '2026-06-04', type: 'Enphase 스마트 인버터 카탈로그' } },

      // 3단계: 시스템 완제품 (X = 580)
      container_bess: { id: 'container_bess', name: '컨테이너형 GW BESS', x: 580, y: 40, w: 180, h: 50, description: '배터리, 소화장치, 냉각기, 인프라가 통합된 산업용 에너지 저장장치.', instruments: [{ name: '서진시스템', ticker: '178320', price: '29,450원', change: '+5.3%' }, { name: 'Fluence (플루언스)', ticker: 'FLNC', price: '$18.4', change: '+2.1%' }], evidence: { grade: 'A', date: '2026-06-04', type: 'Fluence 분기 실적 및 오더북' } },
      btm_bess: { id: 'btm_bess', name: 'Behind-the-Meter 소형 ESS', x: 580, y: 120, w: 180, h: 50, description: '계통망 앞단이 아닌 수용가 내부에 배전 설치하는 전력 저장 장치.', instruments: [{ name: '테슬라 메가팩', ticker: 'TSLA', price: '$176.5', change: '+3.2%' }], evidence: { grade: 'A', date: '2026-06-04', type: 'Tesla Megapack 라스롭 출하 데이터' } },
      peak_shaving: { id: 'peak_shaving', name: '피크 저감 상업용 ESS', x: 580, y: 200, w: 180, h: 50, description: '전기요금이 싼 경부하 때 충전해 피크 시간대 사용하게 유도하는 장치.', instruments: [{ name: '효성중공업', ticker: '298040', price: '352,000원', change: '+4.2%' }], evidence: { grade: 'B', date: '2026-06-04', type: '효성 BESS 설치 계약 공시' } },
      vpp_aggregator: { id: 'vpp_aggregator', name: '가상발전소(VPP) 플랫폼', x: 580, y: 280, w: 180, h: 50, description: '분산 배치된 ESS 자원들을 소프트웨어로 묶어 하나의 발전소처럼 관리하는 솔루션.', instruments: [{ name: '테슬라 (Tesla)', ticker: 'TSLA', price: '$176.5', change: '+3.2%' }], evidence: { grade: 'A', date: '2026-06-04', type: '오토비더(Autobidder) SW 운영 실적' } },
      diagnose_module: { id: 'diagnose_module', name: 'BESS 안전성 진단 시스템', x: 580, y: 360, w: 180, h: 50, description: '화재 및 단락 전 열 변형 징후를 예지 진단하는 전용 SW 결합 하드웨어.', instruments: [{ name: 'LS ELECTRIC', ticker: '010120', price: '218,000원', change: '+2.1%' }], evidence: { grade: 'B', date: '2026-06-04', type: 'ESS 예지 보전 특허' } },

      // 4단계: 수요처 (X = 840)
      solar_bess_grid: { id: 'solar_bess_grid', name: '태양광+BESS 그리드 연계망', x: 840, y: 40, w: 180, h: 50, description: '간헐성 제어를 위해 대규모 태양광 단지에 BESS를 의무 연동한 계통망.', instruments: [{ name: 'NextEra Energy', ticker: 'NEE', price: '$72.4', change: '+0.5%' }], evidence: { grade: 'A', date: '2026-06-04', type: 'EIA 2026 Capacity Additions' } },
      dc_backup_bess: { id: 'dc_backup_bess', name: '데이터센터 백업 BESS 전력원', x: 840, y: 120, w: 180, h: 50, description: '데이터센터 계통 대기 중 자체 마이크로그리드 내 무정전 가동용 저장장치.', instruments: [{ name: 'Fluence (플루언스)', ticker: 'FLNC', price: '$18.4', change: '+2.1%' }], evidence: { grade: 'B', date: '2026-06-04', type: 'FLNC 데이터센터 파트너십' } },
      sata_utility: { id: 'sata_utility', name: '송전 그리드 혼잡 완화망', x: 840, y: 200, w: 180, h: 50, description: '송전 선로 신설 없이 혼잡 구간의 전력 병목을 BESS 방전으로 푸는 시스템.', instruments: [{ name: 'AES Corp (에이이에스)', ticker: 'AES', price: '$16.2', change: '-1.1%' }], evidence: { grade: 'B', date: '2026-06-04', type: 'AES 유틸리티 설치 실적' } },
      smart_grid_load: { id: 'smart_grid_load', name: '스마트 그리드 부하 분산 운영', x: 840, y: 280, w: 180, h: 50, description: '수요 관리(DR) 정책에 맞춰 ESS 방전 스케줄링 관제를 하는 전체망.', instruments: [{ name: 'Vistra (비스트라)', ticker: 'VST', price: '$90.4', change: '+5.3%' }], evidence: { grade: 'B', date: '2026-06-04', type: 'VST 배전망 운영 공시' } },
      retail_trading: { id: 'retail_trading', name: '전력 소매 트레이딩 마켓', x: 840, y: 360, w: 180, h: 50, description: '시간대별 가격 차이를 이용해 BESS 충방전으로 송전 마진을 획득하는 시장.', instruments: [{ name: 'NextEra Energy', ticker: 'NEE', price: '$72.4', change: '+0.5%' }], evidence: { grade: 'A', date: '2026-06-04', type: '소매 전력 시장 가격 변동 연동' } }
    },
    edges: [
      // Upstream -> Midstream 1
      { from: 'lfp_cathode', to: 'ess_enclosure', grade: 'A', date: '2026-06-04', desc: 'LFP 배터리 팩 어셈블리 조립 후 케이스 내 장착' },
      { from: 'sodium_ion', to: 'bess_coldplate', grade: 'B', date: '2026-06-04', desc: '소듐 수계 배터리 최적 온도 유지를 위한 수냉 플레이트 체결' },
      { from: 'cylindrical_cell', to: 'ess_enclosure', grade: 'A', date: '2026-06-04', desc: '원통형 셀 그룹핑 팩을 캐비닛 슬롯에 직병렬 실장' },
      { from: 'barrier_layer', to: 'bms_board', grade: 'B', date: '2026-06-04', desc: '셀 온도 전도 차단 시 편차 데이터 감지보드 센서 튜닝' },
      { from: 'electrolyte', to: 'ess_enclosure', grade: 'B', date: '2026-06-04', desc: '고수명 전해액 주입 배터리 모듈의 함체 삽입' },

      // Midstream 1 -> Midstream 2
      { from: 'ess_enclosure', to: 'container_bess', grade: 'A', date: '2026-06-04', desc: '어셈블리 완료 팩들을 컨테이너 프레임에 최종 격리 적재' },
      { from: 'bms_board', to: 'diagnose_module', grade: 'B', date: '2026-06-04', desc: 'BMS 센싱 원시 시그널을 안전진단 예지 모듈 데이터와 동기화' },
      { from: 'bess_coldplate', to: 'container_bess', grade: 'B', date: '2026-06-04', desc: '수냉 파이프 배관 냉각 랙 통합 및 컨테이너에 결합' },
      { from: 'power_converter', to: 'container_bess', grade: 'A', date: '2026-06-04', desc: '대용량 PCS 컨버터를 컨테이너 인프라 출력단에 연결' },
      { from: 'grid_inverter', to: 'btm_bess', grade: 'A', date: '2026-06-04', desc: '인버터를 메가팩 등 Behind-the-Meter 소형 기기와 계통 매칭' },
      { from: 'power_converter', to: 'vpp_aggregator', grade: 'B', date: '2026-06-04', desc: 'PCS 변환 효율 및 충방전 통제 데이터를 VPP 소프트웨어에 바인딩' },

      // Midstream 2 -> Downstream
      { from: 'container_bess', to: 'solar_bess_grid', grade: 'A', date: '2026-06-04', desc: 'GW급 배터리 컨테이너를 대형 신재생 전력단지에 병렬 연계' },
      { from: 'btm_bess', to: 'dc_backup_bess', grade: 'A', date: '2026-06-04', desc: '자체 소비용 메가팩 소형 BESS 데이터센터에 장착 가동' },
      { from: 'peak_shaving', to: 'smart_grid_load', grade: 'B', date: '2026-06-04', desc: '피크저감용 BESS를 상업 빌딩 배전반 관제 프로그램과 연계' },
      { from: 'vpp_aggregator', to: 'sata_utility', grade: 'B', date: '2026-06-04', desc: '분산 BESS를 제어하여 전력망 혼잡 시 원격 방전 명령 송출' },
      { from: 'vpp_aggregator', to: 'retail_trading', grade: 'A', date: '2026-06-04', desc: 'Autobidder 통제 하에 전력 도소매 가격 스프레드 차익거래 트레이딩' },
      { from: 'diagnose_module', to: 'dc_backup_bess', grade: 'B', date: '2026-06-04', desc: '열 폭주 위험 조기 차단 솔루션의 고신뢰 데이터센터 룸 탑재' },
      { from: 'container_bess', to: 'sata_utility', grade: 'A', date: '2026-06-04', desc: '그리드 유틸리티사 송전선 부하 해소 목적으로 BESS 캐비닛 연계' }
    ]
  }
};

export default function ValueChainCanvas({ favorites, onToggleFavorite }) {
  const [selectedSector, setSelectedSector] = useState('ai_power_grid');
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  
  // 줌 및 드래그 상태 관리
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const containerRef = useRef(null);

  const activeCanvas = CANVASES_DATA[selectedSector] || CANVASES_DATA.ai_power_grid;
  const nodesList = Object.values(activeCanvas.nodes);
  const selectedNode = activeCanvas.nodes[selectedNodeId] || nodesList[0];

  // 선택된 노드에 연결된 엣지(증빙 포함) 필터링
  const connectedEdges = activeCanvas.edges.filter(
    edge => edge.from === selectedNode.id || edge.to === selectedNode.id
  );

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
    setSelectedNodeId(null);
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
            <span>KMC 4대 Core 장기투자 밸류체인 캔버스 (팩트 실증형)</span>
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

      {/* 4대 Core 섹터 셀렉터 */}
      <div className="canvas-selector" style={{ display: 'flex', gap: '8px', marginBottom: '16px', background: 'rgba(255,255,255,0.02)', padding: '8px 12px', borderRadius: '10px', border: '1px solid var(--border)' }}>
        <button className={`canvas-sel-btn ${selectedSector === 'ai_power_grid' ? 'active' : ''}`} onClick={() => handleSelectSector('ai_power_grid')}>⚡ 1. AI 전력 인프라</button>
        <button className={`canvas-sel-btn ${selectedSector === 'hbm_packaging' ? 'active' : ''}`} onClick={() => handleSelectSector('hbm_packaging')}>💾 2. HBM/패키징</button>
        <button className={`canvas-sel-btn ${selectedSector === 'datacenter_infra' ? 'active' : ''}`} onClick={() => handleSelectSector('datacenter_infra')}>❄️ 3. 데이터센터 전력/냉각</button>
        <button className={`canvas-sel-btn ${selectedSector === 'bess_ess' ? 'active' : ''}`} onClick={() => handleSelectSector('bess_ess')}>🔋 4. BESS / ESS</button>
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
          height: '460px',
          overflow: 'hidden',
          background: 'rgba(0,0,0,0.3)',
          border: '1px solid var(--border)',
          borderRadius: '16px'
        }}
      >
        <div
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: 'center center',
            transition: isDragging ? 'none' : 'transform 0.15s cubic-bezier(0.16, 1, 0.3, 1)',
            width: '1000px',
            height: '460px',
            position: 'absolute',
            left: 'calc(50% - 500px)',
            top: 'calc(50% - 230px)'
          }}
        >
          {/* 절대좌표 SVG 레이어 - 섹터별 엣지 라인 동적 렌더링 */}
          <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 1 }}>
            <defs>
              <marker id="arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 2 L 10 5 L 0 8 z" fill="rgba(139, 92, 246, 0.35)" />
              </marker>
            </defs>
            {activeCanvas.edges.map((edge, index) => {
              const fromNode = activeCanvas.nodes[edge.from];
              const toNode = activeCanvas.nodes[edge.to];
              if (!fromNode || !toNode) return null;
              
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
                  stroke="rgba(139, 92, 246, 0.35)"
                  strokeWidth="2.0"
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
                  padding: '8px 10px',
                  boxShadow: isSelected ? '0 0 12px rgba(139, 92, 246, 0.4)' : 'none',
                  border: isSelected ? '2px solid var(--accent-light)' : '1px solid var(--border)',
                  background: 'rgba(20, 24, 33, 0.85)',
                  borderRadius: '10px'
                }}
                onClick={() => setSelectedNodeId(node.id)}
              >
                <div className="canvas-node-name" style={{ fontSize: '11.5px', fontWeight: '700', lineHeight: '1.3', color: isSelected ? '#fff' : 'var(--text-secondary)' }}>
                  {node.name}
                </div>
                <div className="canvas-node-stocks" style={{ marginTop: '4px', display: 'flex', gap: '4px' }}>
                  {node.instruments.map((inst, idx) => (
                    <span key={idx} className="canvas-stock-badge" style={{ fontSize: '8.5px', padding: '1px 4px', background: 'rgba(139, 92, 246, 0.1)', color: 'var(--accent-light)', borderRadius: '4px', fontWeight: '600' }}>
                      {inst.name}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 하단 노드 상세 및 투자 정보 패널 (엣지 실증 연결 포함) */}
      {selectedNode && (
        <div className="node-drawer animate-fade-in" style={{ marginTop: '20px', padding: '24px', background: 'linear-gradient(135deg, rgba(22, 26, 36, 0.6) 0%, rgba(13, 15, 20, 0.8) 100%)', borderRadius: '16px', border: '1px solid var(--border)' }}>
          <div className="node-drawer-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
            <div>
              <span style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', color: 'var(--accent-light)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Layers size={11} />
                5개년 밸류체인 노드 분석 리포트
              </span>
              <h3 className="node-drawer-title" style={{ fontSize: '20px', fontWeight: '700', color: '#fff', marginTop: '4px' }}>{selectedNode.name}</h3>
            </div>
            <button className="close-btn" onClick={() => setSelectedNodeId(null)} style={{ background: 'transparent', border: 0, color: 'var(--text-muted)', cursor: 'pointer', fontSize: '12px' }}>
              [ 패널 닫기 × ]
            </button>
          </div>
          
          <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '20px' }}>
            {selectedNode.description}
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px' }}>
            
            {/* 좌측: 관련 종목 판단 */}
            <div>
              <h4 style={{ fontSize: '14px', color: '#fff', marginBottom: '12px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span>📁 수혜 관련 주식 정보</span>
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {selectedNode.instruments.map((inst, idx) => {
                  const isFav = favorites.includes(inst.ticker);
                  return (
                    <div key={idx} style={{ 
                      background: 'rgba(255,255,255,0.01)', 
                      border: '1px solid var(--border)', 
                      padding: '12px 16px', 
                      borderRadius: '12px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <div>
                        <span style={{ fontSize: '14px', fontWeight: '700', color: '#fff' }}>{inst.name}</span>
                        {inst.ticker !== '공급망' && <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginLeft: '6px' }}>({inst.ticker})</span>}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--accent-light)' }}>{inst.price}</span>
                        <span style={{ fontSize: '11px', fontWeight: '600', color: inst.change.startsWith('+') ? 'var(--danger)' : 'var(--text-muted)' }}>{inst.change}</span>
                        {inst.ticker !== '공급망' && (
                          <button
                            onClick={() => onToggleFavorite(inst.ticker)}
                            style={{
                              background: isFav ? 'var(--accent)' : 'transparent',
                              border: '1px solid var(--accent)',
                              color: isFav ? '#fff' : 'var(--accent-light)',
                              padding: '4px 8px',
                              borderRadius: '6px',
                              fontSize: '11px',
                              cursor: 'pointer',
                              fontWeight: '600'
                            }}
                          >
                            {isFav ? '관심 해제' : '관심 등록'}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 우측: 엣지 수송/공급 계약 증빙 */}
            <div>
              <h4 style={{ fontSize: '14px', color: '#fff', marginBottom: '12px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span>🔍 노드 관계 팩트 증빙</span>
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                
                {/* 노드 자체 증빙 */}
                <div style={{ background: 'rgba(139, 92, 246, 0.05)', border: '1px solid rgba(139, 92, 246, 0.2)', padding: '12px 14px', borderRadius: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)', marginBottom: '6px' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Award size={11} style={{ color: 'var(--accent-light)' }} />
                      <span>출처: <strong>{selectedNode.evidence.type}</strong></span>
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Calendar size={11} />
                      <span>검증일: <strong>{selectedNode.evidence.date}</strong></span>
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '12.5px', color: 'var(--text-secondary)' }}>노드 자체 신뢰 등급:</span>
                    <span style={{ background: 'var(--accent)', color: '#fff', padding: '2px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: '700' }}>
                      {selectedNode.evidence.grade} 등급
                    </span>
                  </div>
                </div>

                {/* 연결 엣지 증빙 요약 */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    주변 노드 연결 증빙 ({connectedEdges.length}건)
                  </span>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '120px', overflowY: 'auto' }}>
                    {connectedEdges.map((edge, idx) => (
                      <div key={idx} style={{ background: 'rgba(0,0,0,0.15)', border: '1px solid var(--border)', padding: '10px', borderRadius: '8px', fontSize: '12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', marginBottom: '4px', fontSize: '10.5px' }}>
                          <span>{edge.from === selectedNode.id ? '➡️ 다음 단계 연결' : '⬅️ 이전 단계 연계'}</span>
                          <span>검증: {edge.grade}급 | {edge.date}</span>
                        </div>
                        <p style={{ margin: 0, color: 'var(--text-secondary)', lineHeight: '1.4' }}>{edge.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
