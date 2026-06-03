'use client';

import { useState } from 'react';
import { Network, HelpCircle, Layers } from 'lucide-react';
import InstrumentCard from '../cards/InstrumentCard';

// 밸류체인 Mock 데이터
const CANVAS_DATA = {
  transformer: {
    title: '초고압 변압기 밸류체인',
    description: '북미 인프라 노후화 및 AI 데이터센터 건설 수혜를 입는 전력 전송의 핵심 그리드',
    stages: [
      {
        id: 'materials',
        title: '1단계: 원부자재 & 부품',
        nodes: [
          {
            id: 'steel',
            name: '방향성 전기강판 (GO)',
            description: '변압기 코어(철심)의 핵심 소재로 에너지 손실을 최소화하는 특수강판. 글로벌 쇼티지 상황.',
            instruments: [
              { name: '포스코홀딩스', ticker: '005490', sector: '철강/소재', fit: 74, overheat: 42, price: '385,000원', change: '+1.2%', volumeSignal: '기관 순매수 우위', analysis: '전기강판 부문 독점적 지위이나 철강 시황 둔화 영향 혼조.' },
              { name: 'Nippon Steel', ticker: '5401.T', sector: '글로벌 철강', fit: 70, overheat: 48, price: '3,250¥', change: '-0.8%', volumeSignal: '외인 매도세', analysis: '미국 철강 인수 건 노이즈로 밸류에이션 저평가 국면.' }
            ]
          },
          {
            id: 'copper',
            name: '동선 & 구리 소재',
            description: '변압기 권선(코일)에 사용되는 고순도 동선재. 구리 원자재 가격 변동과 연동.',
            instruments: [
              { name: '풍산', ticker: '103140', sector: '비철금속', fit: 80, overheat: 68, price: '64,200원', change: '+3.5%', volumeSignal: '거래량 급증', analysis: '구리 가격 상승 및 방산 수출 실적 개선 더블 모멘텀 수혜.' },
              { name: 'LS전선', ticker: '006260', sector: '전선/케이블', fit: 85, overheat: 72, price: '124,500원', change: '+5.1%', volumeSignal: '외인/기관 양매수', analysis: '해저케이블 및 초고압 권선 수요 폭발로 수주 잔고 사상 최대.' }
            ]
          }
        ]
      },
      {
        id: 'manufacturing',
        title: '2단계: 중전기기 제조 (초고압)',
        nodes: [
          {
            id: 'hvt',
            name: '초고압 변압기 (HVT)',
            description: '발전소에서 생산된 고전압 전력을 송전용 초고압(220kV~765kV)으로 변환하는 그리드 병목의 핵심.',
            instruments: [
              { name: 'HD현대일렉트릭', ticker: '267260', sector: '중전기기', fit: 92, overheat: 88, price: '284,500원', change: '+8.4%', volumeSignal: '외인 집중 매수', analysis: '북미 수주 숏티지로 영업이익률 20% 상회 지속. 단기 과열 경계 필요.' },
              { name: '효성중공업', ticker: '298040', sector: '중전기기', fit: 86, overheat: 76, price: '312,000원', change: '+4.2%', volumeSignal: '기관 매수세 유입', analysis: '미국 멤피스 공장 증설 가동 본격화로 하반기 외형 성장 기대.' },
              { name: 'LS일렉트릭', ticker: '010120', sector: '배전 및 전력기기', fit: 82, overheat: 74, price: '198,200원', change: '+2.1%', volumeSignal: '개인 매수 우위', analysis: '초고압 시장 진입 가속화 및 초고압 송전망(HVDC) 신규 모멘텀 형성.' }
            ]
          }
        ]
      },
      {
        id: 'engineering',
        title: '3단계: 전력 유틸리티 & 디벨로퍼',
        nodes: [
          {
            id: 'utility',
            name: '북미 전력청 & 배전망',
            description: '송전 선로 설치 및 운영을 전담하며 변압기를 대량 구매하는 최종 인프라 디벨로퍼.',
            instruments: [
              { name: 'NextEra Energy', ticker: 'NEE', sector: '미국 유틸리티', fit: 78, overheat: 52, price: '$72.4', change: '+0.5%', volumeSignal: '안정적 배당수급', analysis: '미국 최대 신재생 발전사로 금리 인하 사이클 도래 시 자금 조달 매력 부각.' },
              { name: 'Duke Energy', ticker: 'DUK', sector: '미국 유틸리티', fit: 72, overheat: 46, price: '$101.2', change: '-0.3%', volumeSignal: '평이한 거래량', analysis: '보수적 포트폴리오로 방어적 성격 강함. 전력 수요 증가 연동 완만 성장.' }
            ]
          }
        ]
      }
    ]
  },
  xai_grid: {
    title: 'xAI 전력망 & 데이터센터 밸류체인',
    description: '일론 머스크의 멤피스 슈퍼클러스터용 대규모 150MW 전력 공급 합의 관련 밸류체인',
    stages: [
      {
        id: 'cooling',
        title: '1단계: 데이터센터 인프라',
        nodes: [
          {
            id: 'liquid_cooling',
            name: '액체 냉각 솔루션 (DLC)',
            description: 'AI 고밀도 랙에서 발생하는 엄청난 열을 제어하기 위한 수냉식 열관리 하드웨어.',
            instruments: [
              { name: 'Vertiv Holdings', ticker: 'VRT', sector: '열관리 솔루션', fit: 88, overheat: 84, price: '$94.2', change: '+6.2%', volumeSignal: '외인 순매수', analysis: '엔비디아 블랙웰 아키텍처 필수 냉각 공급사. 밸류 고평가 논란 있으나 실적 독점력 우수.' },
              { name: 'Modine Manufacturing', ticker: 'MOD', sector: '산업용 냉각', fit: 78, overheat: 69, price: '$112.5', change: '+3.1%', volumeSignal: '기관 유입세', analysis: '차량용 냉각에서 데이터센터 수냉 시스템으로 고성장 사업 재편 성공.' }
            ]
          }
        ]
      },
      {
        id: 'distribution',
        title: '2단계: 배전 및 변전 인프라',
        nodes: [
          {
            id: 'switchgear',
            name: '배전반 & 스위치기어',
            description: '전력 부하를 분산시키고 전력계통 사고 시 회로를 차단하여 고가 장비를 보호하는 안전 제어 기기.',
            instruments: [
              { name: 'Eaton Corp plc', ticker: 'ETN', sector: '전력 관리', fit: 84, overheat: 65, price: '$312.4', change: '+1.8%', volumeSignal: '안정적 기관 매집', analysis: '북미 전력 배전 점유율 선두 기업. 데이터센터 입입 프로젝트 증가로 백로그 견조.' },
              { name: 'Schneider Electric', ticker: 'SU.PA', sector: '에너지 관리', fit: 80, overheat: 58, price: '215.3€', change: '+0.9%', volumeSignal: '유럽 자금 유입', analysis: '글로벌 탄소 배출 규제 수혜 및 데이터센터 지능형 전력망 솔루션 강점.' }
            ]
          }
        ]
      },
      {
        id: 'power_source',
        title: '3단계: 독립 발전 및 원자력 공급',
        nodes: [
          {
            id: 'nuclear',
            name: '원자력 발전 & PPA',
            description: '24시간 무중단 전력을 요구하는 AI 데이터센터 맞춤형 탄소 무배출 전원 공급사.',
            instruments: [
              { name: 'Constellation Energy', ticker: 'CEG', sector: '원자력 발전', fit: 90, overheat: 82, price: '$220.5', change: '+4.8%', volumeSignal: '거래대금 상위', analysis: '마이크로소프트와의 스리마일섬 전력 PPA 계약 체결로 AI 에너지의 신기원 주도.' },
              { name: 'Vistra Corp', ticker: 'VST', sector: '유틸리티 발전', fit: 87, overheat: 79, price: '$88.4', change: '+5.3%', volumeSignal: '헤지펀드 매집', analysis: '텍사스 독립 전력 시장 지배주주. 전력 단가 급등 수혜 고스란히 흡수.' }
            ]
          }
        ]
      }
    ]
  },
  hbm_packaging: {
    title: 'HBM 패키징 밸류체인',
    description: '엔비디아 AI 칩 성능을 좌우하는 HBM 적층 기술 및 CoWoS 어드밴스드 패키징 공급망',
    stages: [
      {
        id: 'equipment',
        title: '1단계: 핵심 식각/접합 장비',
        nodes: [
          {
            id: 'tc_bonder',
            name: 'TC 본더 (열압착 본딩)',
            description: '실리콘 관통전극(TSV)으로 뚫린 D램 칩을 열과 압력으로 정밀 적층하는 HBM 생산 핵심 공정 장비.',
            instruments: [
              { name: '한미반도체', ticker: '042700', sector: '반도체 장비', fit: 91, overheat: 78, price: '148,200원', change: '+6.8%', volumeSignal: '기관 순매수 전환', analysis: '듀얼 TC 본더의 압도적 시장 점유율. SK하이닉스향 지속 납품 및 마이크론 신규 진입.' },
              { name: 'ASMPT Ltd', ticker: '0522.HK', sector: '글로벌 후공정', fit: 76, overheat: 62, price: '92.4HK$', change: '+1.2%', volumeSignal: '중국계 자금 매수', analysis: 'TSMC CoWoS 공정용 어드밴스드 본더 시장 진입 타진 중.' }
            ]
          }
        ]
      },
      {
        id: 'hbm_manufacturing',
        title: '2단계: 메모리 설계 & 적층',
        nodes: [
          {
            id: 'hbm_maker',
            name: 'HBM 메모리 제조사',
            description: 'D램을 8층, 12층 수직 적층하여 데이터 대역폭을 극대화한 고대역폭 메모리 생산사.',
            instruments: [
              { name: 'SK하이닉스', ticker: '000660', sector: '반도체 메모리', fit: 89, overheat: 72, price: '188,500원', change: '+3.2%', volumeSignal: '외인/기관 양매수', analysis: '엔비디아 HBM3E 독점적 지배력 유지. 12단 HBM 양산 수율 선두 질주.' },
              { name: '삼성전자', ticker: '005930', sector: '반도체 종합', fit: 75, overheat: 50, price: '72,400원', change: '+0.8%', volumeSignal: '개인 매수 유입', analysis: '엔비디아 HBM3E 승인 지연 노이즈. 하반기 공급 다변화 승인 여부가 핵심 키맨.' }
            ]
          }
        ]
      },
      {
        id: 'ai_accelerator',
        title: '3단계: AI 가속기 및 파운드리 통합',
        nodes: [
          {
            id: 'accelerator_chip',
            name: 'AI 가속기 & GPU 패키지',
            description: 'HBM과 논리 반도체(GPU)를 실리콘 인터포저 위에 얹어 하나로 패키징하는 최종 지능형 칩셋.',
            instruments: [
              { name: 'NVIDIA Corp', ticker: 'NVDA', sector: 'AI 가속기', fit: 95, overheat: 85, price: '$1,150', change: '+4.1%', volumeSignal: '역대급 거래대금', analysis: '호퍼(H100/H200) 및 차세대 블랙웰(GB200) 칩셋 전 세계 90% 이상 독점. 실적 증가세 지속.' },
              { name: 'TSMC', ticker: 'TSM', sector: '글로벌 파운드리', fit: 92, overheat: 70, price: '$152.4', change: '+2.5%', volumeSignal: 'ADR 외인 매집', analysis: 'CoWoS 후공정 패키징 병목 집중 투자. 단가 인상 주도권 쥐고 고수익성 확보.' }
            ]
          }
        ]
      }
    ]
  }
};

export default function ValueChainCanvas({ favorites, onToggleFavorite }) {
  const [selectedSector, setSelectedSector] = useState('transformer');
  const [selectedNode, setSelectedNode] = useState(null);
  const [selectedInstrument, setSelectedInstrument] = useState(null);

  const activeCanvas = CANVAS_DATA[selectedSector];

  const handleNodeClick = (node) => {
    setSelectedNode(node);
    setSelectedInstrument(null); // 노드가 바뀌면 선택 종목 초기화
  };

  const handleSelectSector = (sectorKey) => {
    setSelectedSector(sectorKey);
    setSelectedNode(null);
    setSelectedInstrument(null);
  };

  return (
    <div className="canvas-container animate-fade-in">
      {/* 캔버스 헤더 및 셀렉터 */}
      <div className="canvas-header">
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Network size={20} className="text-accent" style={{ color: 'var(--accent-light)' }} />
            <span>핵심 산업 밸류체인 캔버스</span>
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            {activeCanvas.description}
          </p>
        </div>
        <div className="canvas-selector">
          <button 
            className={`canvas-sel-btn ${selectedSector === 'transformer' ? 'active' : ''}`}
            onClick={() => handleSelectSector('transformer')}
          >
            초고압 변압기
          </button>
          <button 
            className={`canvas-sel-btn ${selectedSector === 'xai_grid' ? 'active' : ''}`}
            onClick={() => handleSelectSector('xai_grid')}
          >
            xAI 전력망
          </button>
          <button 
            className={`canvas-sel-btn ${selectedSector === 'hbm_packaging' ? 'active' : ''}`}
            onClick={() => handleSelectSector('hbm_packaging')}
          >
            HBM 패키징
          </button>
        </div>
      </div>

      {/* 인터랙티브 노드 맵 (반응형 Grid/Flex) */}
      <div className="canvas-map-wrapper">
        <div className="canvas-stages-row">
          {activeCanvas.stages.map((stage) => (
            <div key={stage.id} className="canvas-stage-column">
              <h3 className="canvas-stage-title">{stage.title}</h3>
              {stage.nodes.map((node) => {
                const isSelected = selectedNode?.id === node.id;
                return (
                  <div 
                    key={node.id} 
                    className={`canvas-node-item ${isSelected ? 'selected' : ''}`}
                    onClick={() => handleNodeClick(node)}
                  >
                    <div className="canvas-node-name">{node.name}</div>
                    <div className="canvas-node-stocks">
                      {node.instruments.map((inst, idx) => (
                        <span key={idx} className="canvas-stock-badge">
                          {inst.name}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
        
        <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-muted)' }}>
          <HelpCircle size={14} />
          <span>산업 노드를 클릭하면 하단 패널에 상세 정보 및 종목별 투자 판단 카드가 노출됩니다.</span>
        </div>
      </div>

      {/* 하단 정보 서랍 (Node & Instrument Drawer) */}
      {selectedNode && (
        <div className="node-drawer animate-fade-in">
          <div className="node-drawer-header">
            <div>
              <span style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', color: 'var(--accent-light)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Layers size={11} />
                밸류체인 산업 노드 분석
              </span>
              <h3 className="node-drawer-title">{selectedNode.name}</h3>
            </div>
            <button className="close-btn" onClick={() => setSelectedNode(null)}>
              [ 패널 닫기 × ]
            </button>
          </div>
          
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
            {selectedNode.description}
          </p>

          <div style={{ marginTop: '10px' }}>
            <h4 style={{ fontSize: '14px', color: '#fff', marginBottom: '12px', fontWeight: '600' }}>
              연결 관련 종목 / ETF 실시간 판정
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
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
