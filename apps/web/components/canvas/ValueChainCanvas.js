'use client';

import { useState, useRef, useEffect } from 'react';
import { Network, HelpCircle, Layers, ZoomIn, ZoomOut, RotateCcw, ArrowUpRight } from 'lucide-react';
import InstrumentCard from '../cards/InstrumentCard';

// 캔버스 내 노드 구조 데이터 (좌표값 포함)
const NODES_POOL = {
  center: {
    id: 'center',
    name: '👑 xAI & Tesla (머스크 생태계)',
    x: 310, y: 220,
    w: 240, h: 70,
    description: '일론 머스크가 이끄는 AI 및 자율주행, 휴머노이드 로봇 생태계의 중앙 허브. 기가 텍사스 및 멤피스 슈퍼클러스터가 중심축.',
    instruments: [
      { name: 'Tesla Corp', ticker: 'TSLA', sector: '전기차/AI', fit: 95, overheat: 68, price: '$178.4', change: '+3.2%', volumeSignal: '기관 순매집 전환', analysis: 'FSD V12 및 로보택시 공개 기대감. 에너지 및 로봇 부문 잠재 가치 상승 국면.' }
    ]
  },
  spacex: {
    id: 'spacex',
    name: '📡 SpaceX & 스타링크',
    x: 330, y: 50,
    w: 200, h: 60,
    description: '글로벌 초고속 저지연 위성 전력/인터넷망 스타링크 구축. 우주 태양광 전력망 협력 가능성 대두.',
    instruments: [
      { name: 'SpaceX (비상장)', ticker: 'SPACE.X', sector: '우주항공', fit: 80, overheat: 50, price: '비상장', change: '0.0%', volumeSignal: '사외 거래 활발', analysis: '글로벌 우주 인터넷 인프라 독점. 스타링크 흑자 기조 유지로 기업가치 급상승 중.' }
    ]
  },
  datacenter: {
    id: 'datacenter',
    name: '🖥️ xAI 멤피스 데이터센터',
    x: 40, y: 100,
    w: 230, h: 60,
    description: '10만 개의 H100 가속기가 탑재되는 현존 최대 AI 슈퍼클러스터. 대규모 150MW 전력 그리드가 핵심 병목.',
    instruments: [
      { name: 'Modine Manufacturing', ticker: 'MOD', sector: '데이터센터 랙', fit: 78, overheat: 69, price: '$112.5', change: '+3.1%', volumeSignal: '기관 유입세', analysis: '고성능 GPU 랙용 공랭/수랭 제어 시스템 수혜 지속.' }
    ]
  },
  nuclear: {
    id: 'nuclear',
    name: '⚛️ Constellation 원자력 발전',
    x: 580, y: 100,
    w: 230, h: 60,
    description: '24시간 고가동 AI 칩셋 전용 탄소 무배출 전원 공급원. 소형 원자로(SMR) 및 대형 원전 PPA 장기 계약.',
    instruments: [
      { name: 'Constellation Energy', ticker: 'CEG', sector: '원자력 발전', fit: 90, overheat: 82, price: '$220.5', change: '+4.8%', volumeSignal: '거래대금 상위', analysis: '스리마일섬 원전 PPA 계약으로 테크 자이언트들의 타깃 전력 공급사 낙점.' }
    ]
  },
  transformer: {
    id: 'transformer',
    name: '⚡ HD현대일렉트릭 (초고압)',
    x: 30, y: 225,
    w: 230, h: 60,
    description: '발전소 고전압을 변환하는 초고압 송전망 최강자. 미국 전력청 숏티지로 3년치 백로그 마진 확보.',
    instruments: [
      { name: 'HD현대일렉트릭', ticker: '267260', sector: '초고압 변압기', fit: 92, overheat: 88, price: '284,500원', change: '+8.4%', volumeSignal: '외인 집중 매수', analysis: '북미 전력 노후화 수주 폭증. 단기 차익 실현 경계 속 주도주 지위 확고.' },
      { name: '효성중공업', ticker: '298040', sector: '초고압 변압기', fit: 86, overheat: 76, price: '312,000원', change: '+4.2%', volumeSignal: '기관 매수세 유입', analysis: '미국 멤피스 공장 증설 가동 본격화로 하반기 외형 성장 기대.' }
    ]
  },
  cooling: {
    id: 'cooling',
    name: '❄️ Vertiv 액체 냉각 솔루션',
    x: 590, y: 225,
    w: 230, h: 60,
    description: '엔비디아 블랙웰 GPU 아키텍처 공식 냉각 파트너사. AI 데이터센터의 폐열 및 냉각 관리 독점력.',
    instruments: [
      { name: 'Vertiv Holdings', ticker: 'VRT', sector: '열관리 솔루션', fit: 88, overheat: 84, price: '$94.2', change: '+6.2%', volumeSignal: '외인 순매수', analysis: '엔비디아 패키징 밀착 수혜. 데이터센터 전원 및 공조 부문 독점주.' }
    ]
  },
  hbm: {
    id: 'hbm',
    name: '💾 SK하이닉스 & 한미반도체',
    x: 310, y: 400,
    w: 240, h: 60,
    description: 'NVIDIA 가속기 및 테슬라 도조 칩용 고대역폭 메모리 적층 패키징 밸류체인.',
    instruments: [
      { name: 'SK하이닉스', ticker: '000660', sector: '반도체 메모리', fit: 89, overheat: 72, price: '188,500원', change: '+3.2%', volumeSignal: '외인/기관 양매수', analysis: 'HBM3E 양산 수율 독보적 지배력. 엔비디아 블랙웰 공급 지위 견고.' },
      { name: '한미반도체', ticker: '042700', sector: '반도체 장비', fit: 91, overheat: 78, price: '148,200원', change: '+6.8%', volumeSignal: '기관 순매수 전환', analysis: '듀얼 TC 본더의 압도적 영업마진율 30%대 이상 수렴.' }
    ]
  }
};

export default function ValueChainCanvas({ favorites, onToggleFavorite }) {
  const [selectedNode, setSelectedNode] = useState(NODES_POOL.center);
  
  // 줌 및 드래그 상태 관리 (피드백 7번 반영)
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const containerRef = useRef(null);

  // 드래그 시작
  const handleMouseDown = (e) => {
    // 버튼 클릭이나 노드 클릭 시 드래그 방지
    if (e.target.closest('.canvas-node-item') || e.target.closest('.zoom-controls')) return;
    setIsDragging(true);
    dragStart.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
  };

  // 드래그 이동
  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.current.x,
      y: e.clientY - dragStart.current.y
    });
  };

  // 드래그 종료
  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // 줌인/줌아웃 조작
  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.15, 2.0));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.15, 0.5));
  const handleZoomReset = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  return (
    <div className="canvas-container animate-fade-in" ref={containerRef}>
      {/* 캔버스 컨트롤 헤더 */}
      <div className="canvas-header">
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Network size={20} className="text-accent" style={{ color: 'var(--accent-light)' }} />
            <span>확대/축소 무한 마인드 캔버스</span>
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            마우스 드래그로 화면을 이동하고 마우스 휠 및 버튼으로 확대/축소하여 머스크 생태계를 탐색해 보십시오.
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
          height: '520px',
          overflow: 'hidden'
        }}
      >
        {/* 드래그 및 줌 효과를 반영하는 거대 캔버스 이너 */}
        <div
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: 'center center',
            transition: isDragging ? 'none' : 'transform 0.15s cubic-bezier(0.16, 1, 0.3, 1)',
            width: '880px',
            height: '520px',
            position: 'absolute',
            left: 'calc(50% - 440px)',
            top: 'calc(50% - 260px)'
          }}
        >
          {/* 엣지 연결선용 절대좌표 SVG 레이어 (배경) */}
          <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 1 }}>
            <defs>
              <marker id="arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 2 L 10 5 L 0 8 z" fill="rgba(139, 92, 246, 0.3)" />
              </marker>
            </defs>
            {/* 센터에서 각 노드로 향하는 수송/계약 연동 엣지 */}
            {/* SpaceX */}
            <path d="M 430 220 L 430 110" stroke="rgba(139, 92, 246, 0.3)" strokeWidth="2" strokeDasharray="4 4" markerEnd="url(#arrow)" />
            {/* Datacenter */}
            <path d="M 310 240 L 220 160" stroke="rgba(139, 92, 246, 0.3)" strokeWidth="2" markerEnd="url(#arrow)" />
            {/* Nuclear */}
            <path d="M 550 240 L 640 160" stroke="rgba(139, 92, 246, 0.3)" strokeWidth="2" markerEnd="url(#arrow)" />
            {/* Transformer */}
            <path d="M 310 255 L 260 255" stroke="rgba(139, 92, 246, 0.5)" strokeWidth="2" markerEnd="url(#arrow)" />
            {/* Cooling */}
            <path d="M 550 255 L 590 255" stroke="rgba(139, 92, 246, 0.5)" strokeWidth="2" markerEnd="url(#arrow)" />
            {/* HBM */}
            <path d="M 430 290 L 430 400" stroke="rgba(139, 92, 246, 0.4)" strokeWidth="2.5" markerEnd="url(#arrow)" />
          </svg>

          {/* 노드 격자 배치 */}
          {Object.values(NODES_POOL).map((node) => {
            const isSelected = selectedNode?.id === node.id;
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
                  boxShadow: node.id === 'center' ? '0 0 20px rgba(139, 92, 246, 0.4)' : 'none',
                  border: node.id === 'center' ? '2px solid var(--accent-light)' : '1px solid var(--border)'
                }}
                onClick={() => setSelectedNode(node)}
              >
                <div className="canvas-node-name" style={{ fontSize: node.id === 'center' ? '14px' : '12.5px', fontWeight: '700' }}>
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
            <button className="close-btn" onClick={() => setSelectedNode(null)}>
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
