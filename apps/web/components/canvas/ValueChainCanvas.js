'use client';

import { useState, useRef, useEffect } from 'react';
import { Network, HelpCircle, Layers, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import InstrumentCard from '../cards/InstrumentCard';

// 10대 밸류체인 노드망 데이터 기획 (NVIDIA 가격 분할 후 $120.5 보정 완료)
const NODES_POOL = {
  center: {
    id: 'center',
    name: '👑 xAI & 테슬라 (Tesla Hub)',
    x: 370, y: 250,
    w: 260, h: 70,
    description: '일론 머스크의 멤피스 AI 데이터센터와 테슬라 FSD/휴머노이드 생태계를 연결하는 중앙 전략 기지.',
    instruments: [
      { name: '테슬라 (Tesla)', ticker: 'TSLA', sector: 'ESS & 스타링크', fit: 90, overheat: 58, price: '$178.4', change: '+3.2%', volumeSignal: '기관 매수 우위', analysis: '전기차 본업 외에 메가팩(Megapack) 및 자율주행 FSD 가치가 생태계 성장 견인.' }
    ]
  },
  hvt: {
    id: 'hvt',
    name: '⚡ 1. 초고압 변압기 (HVT)',
    x: 50, y: 250,
    w: 220, h: 60,
    description: '전력 전송 그리드 병목의 주역. 미국 유틸리티 수주 숏티지 장기 수혜.',
    instruments: [
      { name: 'HD현대일렉트릭', ticker: '267260', sector: '초고압 변압기', fit: 92, overheat: 88, price: '284,500원', change: '+8.4%', volumeSignal: '외인 집중 매수', analysis: '수주 잔고 최고치 경신. 고마진 장기 수주 위주 믹스 개선.' },
      { name: '효성중공업', ticker: '298040', sector: '초고압 변압기', fit: 86, overheat: 76, price: '312,000원', change: '+4.2%', volumeSignal: '기관 매수세 유입', analysis: '미국 멤피스 공장 본격 가동에 따른 외형 급성장 단계.' }
    ]
  },
  grid: {
    id: 'grid',
    name: '🔌 2. 배전 & 전력 관리',
    x: 50, y: 130,
    w: 220, h: 60,
    description: '데이터센터 내부 전력 부하 분산 및 기기 보호 스위치기어 공급망.',
    instruments: [
      { name: '이튼 코퍼레이션 (Eaton)', ticker: 'ETN', sector: '배전 및 전력관리', fit: 84, overheat: 65, price: '$312.4', change: '+1.8%', volumeSignal: '안정적 기관 매집', analysis: '북미 배전 시장 점유율 1위. 안정적인 데이터센터 PPA 프로젝트 참여 증가.' },
      { name: 'LS일렉트릭', ticker: '010120', sector: '배전 및 전력기기', fit: 82, overheat: 74, price: '198,200원', change: '+2.1%', volumeSignal: '개인 매수 우위', analysis: '초고압 설비 및 스마트 배전반 신규 공장 증설 모멘텀.' }
    ]
  },
  nuclear: {
    id: 'nuclear',
    name: '⚛️ 3. SMR & 원자력 발전',
    x: 730, y: 130,
    w: 220, h: 60,
    description: '24시간 무중단 친환경 에너지를 요구하는 테크 거인들의 원천 전력망.',
    instruments: [
      { name: '콘스텔레이션 에너지 (CEG)', ticker: 'CEG', sector: 'SMR & 원자력 발전', fit: 90, overheat: 82, price: '$220.5', change: '+4.8%', volumeSignal: '거래대금 상위', analysis: '마이크로소프트와의 스리마일섬 원전 전력 공급 PPA 계약 체결로 업종 리더 도약.' },
      { name: '뉴스케일 파워 (NuScale)', ticker: 'SMR', sector: 'SMR & 원자력 발전', fit: 76, overheat: 65, price: '$10.4', change: '+1.5%', volumeSignal: '개인 관심 급증', analysis: '소형 모듈러 원자로(SMR) 설계 승인을 획득한 상징적 핵심주.' }
    ]
  },
  cooling: {
    id: 'cooling',
    name: '❄️ 4. 액체 냉각 솔루션',
    x: 730, y: 250,
    w: 220, h: 60,
    description: '고성능 GPU 발열 제어용 Direct Liquid Cooling 하드웨어 공급처.',
    instruments: [
      { name: '버티브 홀딩스 (Vertiv)', ticker: 'VRT', sector: '액체 냉각 솔루션', fit: 88, overheat: 84, price: '$94.2', change: '+6.2%', volumeSignal: '외인 순매수', analysis: '엔비디아 블랙웰 수냉 쿨링 시스템 독점 파트너사 지위 유지.' }
    ]
  },
  hbm: {
    id: 'hbm',
    name: '💾 5. HBM 적층 패키징',
    x: 380, y: 480,
    w: 240, h: 60,
    description: 'TSV 공정 및 TC 본더 접합 기술을 이용한 초고속 메모리 패키징망.',
    instruments: [
      { name: 'SK하이닉스', ticker: '000660', sector: 'HBM 패키징', fit: 89, overheat: 72, price: '188,500원', change: '+3.2%', volumeSignal: '외인/기관 양매수', analysis: '엔비디아 블랙웰용 HBM3E 독보적 점유율 및 고마진 수율 유지.' },
      { name: '한미반도체', ticker: '042700', sector: 'HBM 패키징', fit: 91, overheat: 78, price: '148,200원', change: '+6.8%', volumeSignal: '기관 순매수 전환', analysis: '하이닉스 및 마이크론향 듀얼 TC 본더의 고점수 마진 발생 지속.' }
    ]
  },
  glass: {
    id: 'glass',
    name: '🔬 6. 차세대 유리 기판',
    x: 90, y: 410,
    w: 220, h: 60,
    description: '실리콘 인터포저를 대체하여 대역폭과 전력 효율을 30% 높이는 신소재.',
    instruments: [
      { name: 'SKC', ticker: '011790', sector: '유리 기판', fit: 82, overheat: 69, price: '138,500원', change: '+4.5%', volumeSignal: '기관 매집세', analysis: '자회사 앱솔릭스의 조지아 공장 세계 최초 유리기판 양산 개시 임박.' },
      { name: '삼성전기', ticker: '009150', sector: '유리 기판', fit: 76, overheat: 58, price: '152,000원', change: '+1.3%', volumeSignal: '외인 매수 유입', analysis: '파일럿 라인 가동 및 글로벌 AI 기판 수급 다변화 수혜.' }
    ]
  },
  ess: {
    id: 'ess',
    name: '🔋 7. 대용량 ESS 저장',
    x: 180, y: 40,
    w: 200, h: 60,
    description: '독립 전력망 및 데이터센터 비상 발전을 위한 메가팩 배터리 공급망.',
    instruments: [
      { name: '서진시스템', ticker: '178320', sector: 'ESS & 스타링크', fit: 84, overheat: 72, price: '29,450원', change: '+5.3%', volumeSignal: '외인 집중 순매수', analysis: '글로벌 주요 ESS 메이커향 케이스 및 배터리 조립 수주 집중.' }
    ]
  },
  starlink: {
    id: 'starlink',
    name: '📡 8. 위성 스타링크 통신',
    x: 400, y: 40,
    w: 200, h: 60,
    description: '사외 외딴 데이터센터와 우주 기지를 잇는 초고속 저지연 위성 그리드.',
    instruments: [
      { name: '스페이스X (SpaceX 비상장)', ticker: 'SPACE.X', sector: '우주항공', fit: 80, overheat: 50, price: '비상장', change: '0.0%', volumeSignal: '사외 거래 활발', analysis: '독점 우주 수송 기술 기반. 스타링크 가입자 고성장으로 자생적 성장 구조 확립.' }
    ]
  },
  ondevice: {
    id: 'ondevice',
    name: '📱 9. 온디바이스 AI 칩셋',
    x: 630, y: 40,
    w: 220, h: 60,
    description: '서버를 거치지 않고 단말에서 직접 LLM을 실행하는 고성능 NPU 프로세서.',
    instruments: [
      { name: '퀄컴 (Qualcomm)', ticker: 'QCOM', sector: '온디바이스 AI', fit: 86, overheat: 68, price: '$202.4', change: '+2.2%', volumeSignal: '외인 매집', analysis: '스냅드래곤 X 엘리트 AP의 PC 시장 연착륙. 모바일에서 오토/PC로 포트폴리오 확장.' }
    ]
  },
  gpu: {
    id: 'gpu',
    name: '🧠 10. AI 가속기 GPU',
    x: 690, y: 410,
    w: 220, h: 60,
    description: 'AI 딥러닝 연산의 표준 가속 반도체 및 실리콘 통합 솔루션.',
    instruments: [
      { name: '엔비디아 (NVIDIA)', ticker: 'NVDA', sector: 'AI 가속기 GPU', fit: 95, overheat: 85, price: '$120.5', change: '+4.1%', volumeSignal: '역대급 거래대금', analysis: '액면분할 후 $120선 안착. 후공정 병목 제어로 강력한 마켓 독점 pricing power 발휘.' },
      { name: '티에스엠씨 (TSMC)', ticker: 'TSM', sector: 'AI 가속기 GPU', fit: 92, overheat: 70, price: '$152.4', change: '+2.5%', volumeSignal: 'ADR 외인 매집', analysis: '최첨단 3나노 파운드리 및 CoWoS 후공정 수주 쏠림 심화.' }
    ]
  }
};

export default function ValueChainCanvas({ favorites, onToggleFavorite }) {
  const [selectedNode, setSelectedNode] = useState(NODES_POOL.center);
  
  // 줌 및 드래그 상태 관리
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const containerRef = useRef(null);

  const handleMouseDown = (e) => {
    if (e.target.closest('.canvas-node-item') || e.target.closest('.zoom-controls')) return;
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

  return (
    <div className="canvas-container animate-fade-in" ref={containerRef}>
      {/* 캔버스 컨트롤 헤더 */}
      <div className="canvas-header">
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Network size={20} className="text-accent" style={{ color: 'var(--accent-light)' }} />
            <span>KMC 10대 핵심 밸류체인 마인드 맵</span>
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            중앙 xAI 생태계에서 사방으로 연계된 10대 밸류체인입니다. 드래그하여 움직이거나 마우스 휠로 줌(Zoom) 해보세요.
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
          height: '560px',
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
            height: '560px',
            position: 'absolute',
            left: 'calc(50% - 500px)',
            top: 'calc(50% - 280px)'
          }}
        >
          {/* 절대좌표 SVG 레이어 - 10방향 엣지선 */}
          <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 1 }}>
            <defs>
              <marker id="arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 2 L 10 5 L 0 8 z" fill="rgba(139, 92, 246, 0.35)" />
              </marker>
            </defs>
            {/* Center (500, 285)에서 10개 노드로 향하는 수송/연동 엣지 */}
            {/* 1. HVT (50, 250) */}
            <path d="M 370 285 L 280 280" stroke="rgba(139, 92, 246, 0.4)" strokeWidth="2" markerEnd="url(#arrow)" />
            {/* 2. Grid (50, 130) */}
            <path d="M 370 270 L 280 190" stroke="rgba(139, 92, 246, 0.4)" strokeWidth="2" markerEnd="url(#arrow)" />
            {/* 3. Nuclear (730, 130) */}
            <path d="M 630 270 L 720 190" stroke="rgba(139, 92, 246, 0.4)" strokeWidth="2" markerEnd="url(#arrow)" />
            {/* 4. Cooling (730, 250) */}
            <path d="M 630 285 L 720 280" stroke="rgba(139, 92, 246, 0.4)" strokeWidth="2" markerEnd="url(#arrow)" />
            {/* 5. HBM (380, 480) */}
            <path d="M 500 320 L 500 470" stroke="rgba(139, 92, 246, 0.4)" strokeWidth="2.5" markerEnd="url(#arrow)" />
            {/* 6. Glass (90, 410) */}
            <path d="M 380 320 L 280 410" stroke="rgba(139, 92, 246, 0.4)" strokeWidth="2" markerEnd="url(#arrow)" />
            {/* 7. ESS (180, 40) */}
            <path d="M 430 250 L 310 110" stroke="rgba(139, 92, 246, 0.4)" strokeWidth="2" markerEnd="url(#arrow)" />
            {/* 8. Starlink (400, 40) */}
            <path d="M 500 250 L 500 110" stroke="rgba(139, 92, 246, 0.4)" strokeWidth="2" markerEnd="url(#arrow)" />
            {/* 9. On-Device (630, 40) */}
            <path d="M 570 250 L 680 110" stroke="rgba(139, 92, 246, 0.4)" strokeWidth="2" markerEnd="url(#arrow)" />
            {/* 10. GPU (690, 410) */}
            <path d="M 610 320 L 710 410" stroke="rgba(139, 92, 246, 0.4)" strokeWidth="2.5" markerEnd="url(#arrow)" />
          </svg>

          {/* 노드 렌더러 */}
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
