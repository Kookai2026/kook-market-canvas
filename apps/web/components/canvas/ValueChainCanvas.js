'use client';

import { useState, useRef } from 'react';
import { Network, HelpCircle, Layers, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import InstrumentCard from '../cards/InstrumentCard';

// 5년 텐버거 미래 먹거리 10대 핵심 섹터 노드망 기획 (48V 아키텍처, 휴머노이드 로봇, Bio-AI 완벽 매핑)
const NODES_POOL = {
  center: {
    id: 'center',
    name: '👑 xAI & 테슬라 (Tesla Hub)',
    x: 370, y: 250,
    w: 260, h: 70,
    description: '일론 머스크 생태계의 중앙 허브. 기가 텍사스, 멤피스 슈퍼클러스터, 옵티머스 휴머노이드 연계 핵심.',
    instruments: [
      { name: '테슬라 (Tesla)', ticker: 'TSLA', sector: 'ESS & 스타링크', fit: 90, overheat: 58, price: '$178.4', change: '+3.2%', volumeSignal: '기관 매수 우위', analysis: 'FSD 자율주행 및 에너지 메가팩 부문 성장이 하반기 주요 드라이버.' }
    ]
  },
  arch48v: {
    id: 'arch48v',
    name: '🔌 1. 48V 전력 아키텍처',
    x: 50, y: 250,
    w: 220, h: 60,
    description: '차량 전압 체계를 12V에서 48V로 늘려 구리 배선을 1/4로 단축하고 전력 효율을 혁신하는 E/E 아키텍처.',
    instruments: [
      { name: '바이코 (Vicor Corp)', ticker: 'VICR', sector: '48V 전력 아키텍처', fit: 88, overheat: 62, price: '$42.8', change: '+3.5%', volumeSignal: '기관 순매수 전환', analysis: '48V E/E 전력 모듈 독보적 점유율. 사이버트럭 및 차세대 양산차 변환 수혜.' },
      { name: '온세미 (onsemi)', ticker: 'ON', sector: '48V 전력 아키텍처', fit: 85, overheat: 58, price: '$72.4', change: '+1.2%', volumeSignal: '외인 매수 우위', analysis: 'SiC 전력 반도체 및 지능형 전력 모듈 공급량 증대 기조.' }
    ]
  },
  hvt: {
    id: 'hvt',
    name: '⚡ 2. 초고압 변압기 (HVT)',
    x: 50, y: 360,
    w: 220, h: 60,
    description: '전력 전송 그리드 병목의 주역. 북미 데이터센터 건설 및 노후 송전망 교체 수혜 최고조.',
    instruments: [
      { name: 'HD현대일렉트릭', ticker: '267260', sector: '초고압 변압기', fit: 92, overheat: 88, price: '284,500원', change: '+8.4%', volumeSignal: '외인 집중 매수', analysis: '영업마진율 20% 돌파 지속. 북미 수주 백로그 단가 상승 지속 수혜.' },
      { name: '효성중공업', ticker: '298040', sector: '초고압 변압기', fit: 86, overheat: 76, price: '312,000원', change: '+4.2%', volumeSignal: '기관 매수세 유입', analysis: '미국 멤피스 공장 풀 가동 본격화로 매출 다변화 개시.' }
    ]
  },
  ess: {
    id: 'ess',
    name: '🔋 3. 대용량 ESS 저장',
    x: 50, y: 140,
    w: 220, h: 60,
    description: '데이터센터 가동율 유지 및 독립형 신재생 전력 백업용 대용량 배터리 저장 장치.',
    instruments: [
      { name: '서진시스템', ticker: '178320', sector: 'ESS & 스타링크', fit: 84, overheat: 72, price: '29,450원', change: '+5.3%', volumeSignal: '외인 집중 순매수', analysis: '글로벌 유틸리티 ESS 고객사들향 조립/공급량 역대 최대치 추적.' }
    ]
  },
  nuclear: {
    id: 'nuclear',
    name: '⚛️ 4. SMR & 원자력 발전',
    x: 730, y: 130,
    w: 220, h: 60,
    description: '기후 규제를 극복하고 무중단 AI 전력을 안정적으로 조달하는 독립 원천 발전 그리드.',
    instruments: [
      { name: '콘스텔레이션 에너지 (CEG)', ticker: 'CEG', sector: 'SMR & 원자력 발전', fit: 90, overheat: 82, price: '$220.5', change: '+4.8%', volumeSignal: '거래대금 상위', analysis: 'MS 전력 독점 공급 계약 체결 영향 유틸리티 대장주 도약.' },
      { name: '뉴스케일 파워 (NuScale)', ticker: 'SMR', sector: 'SMR & 원자력 발전', fit: 76, overheat: 65, price: '$10.4', change: '+1.5%', volumeSignal: '개인 관심 급증', analysis: 'SMR(소형 원자로) 승인 기업 중 가장 빠른 프로젝트 실증 단계 돌입.' }
    ]
  },
  cooling: {
    id: 'cooling',
    name: '❄️ 5. 액체 냉각 솔루션',
    x: 730, y: 250,
    w: 220, h: 60,
    description: '고열을 방출하는 차세대 GPU 데이터센터 필수 지능형 수냉 냉각 공조기기.',
    instruments: [
      { name: '버티브 홀딩스 (Vertiv)', ticker: 'VRT', sector: '액체 냉각 솔루션', fit: 88, overheat: 84, price: '$94.2', change: '+6.2%', volumeSignal: '외인 순매수', analysis: '엔비디아 블랙웰 수냉 쿨링 시스템 독점 파트너사 지위 유지.' }
    ]
  },
  hbm: {
    id: 'hbm',
    name: '💾 6. HBM 적층 패키징',
    x: 380, y: 480,
    w: 240, h: 60,
    description: '실리콘 관통전극(TSV)과 초정밀 접합 TC 본딩 기술 기반 초고속 메모리 가속기 연동망.',
    instruments: [
      { name: 'SK하이닉스', ticker: '000660', sector: 'HBM 패키징', fit: 89, overheat: 72, price: '188,500원', change: '+3.2%', volumeSignal: '외인/기관 양매수', analysis: '엔비디아 HBM3E 독보적 공급 지배력 및 12단 양산 수율 선두 유지.' },
      { name: '한미반도체', ticker: '042700', sector: 'HBM 패키징', fit: 91, overheat: 78, price: '148,200원', change: '+6.8%', volumeSignal: '기관 순매수 전환', analysis: '듀얼 TC 본더 글로벌 압도적 점유율. 영업이익률 최고 수준 방어.' }
    ]
  },
  glass: {
    id: 'glass',
    name: '🔬 7. 차세대 유리 기판',
    x: 90, y: 470,
    w: 220, h: 60,
    description: '반도체 패키징 성능 한계를 극복하기 위해 유기 소재 대신 유리를 채택하는 혁신 공정.',
    instruments: [
      { name: 'SKC', ticker: '011790', sector: '차세대 유리 기판', fit: 82, overheat: 69, price: '138,500원', change: '+4.5%', volumeSignal: '기관 매집세', analysis: '자회사 앱솔릭스의 미국 현지 공장 상업 생산 임박에 따른 시세 선제 유입.' },
      { name: '삼성전기', ticker: '009150', sector: '차세대 유리 기판', fit: 76, overheat: 58, price: '152,000원', change: '+1.3%', volumeSignal: '외인 매수 유입', analysis: '2026년 유리 기판 조기 양산 로드맵 발표 및 AI 부품 비중 확대.' }
    ]
  },
  robot: {
    id: 'robot',
    name: '🤖 8. 휴머노이드 로봇',
    x: 170, y: 40,
    w: 200, h: 60,
    description: '공장 생산직 대체 및 3D 공간 물리 신경망 로봇의 관절용 액추에이터 감속기 공급망.',
    instruments: [
      { name: '레인보우로보틱스', ticker: '277810', sector: '휴머노이드 로봇', fit: 86, overheat: 64, price: '168,500원', change: '+2.8%', volumeSignal: '기관 순매수 전환', analysis: '삼성전자와의 긴밀한 지분 연계 및 차세대 협동/휴머노이드 공동 개발 모멘텀.' },
      { name: '에스비비테크', ticker: '389500', sector: '휴머노이드 로봇', fit: 78, overheat: 58, price: '28,200원', change: '+1.5%', volumeSignal: '개인 매수 유입', analysis: '로봇 관절에 들어가는 핵심 감속기 국산화 라인 보유 소형 강소기업.' }
    ]
  },
  starlink: {
    id: 'starlink',
    name: '📡 9. 위성 스타링크 통신',
    x: 400, y: 40,
    w: 200, h: 60,
    description: '저궤도 인공위성 군집 통신을 통한 전지구 초고속 연결망 구축 및 군사용 활용.',
    instruments: [
      { name: '스페이스X (SpaceX 비상장)', ticker: 'SPACE.X', sector: '우주항공', fit: 80, overheat: 50, price: '비상장', change: '0.0%', volumeSignal: '사외 거래 활발', analysis: '스타링크 초고속 인터넷 부문의 지속적 가입자 증가 및 현금 흐름 흑자화 기조.' }
    ]
  },
  bio: {
    id: 'bio',
    name: '🧪 10. Bio-AI & 합성생물학',
    x: 630, y: 40,
    w: 220, h: 60,
    description: '인공지능을 활용해 신약 단백질 구조를 설계하고 신물질을 분할 연산하는 바이오 테크.',
    instruments: [
      { name: '슈뢰딩거 (Schrodinger)', ticker: 'SDGR', sector: 'Bio-AI & 합성생물학', fit: 83, overheat: 54, price: '$22.5', change: '+0.8%', volumeSignal: '외인 매집', analysis: '화학/물리학 계산 AI 분자 도구 플랫폼 리더. 빅파마 공동 수주 파이프라인 가치 유효.' }
    ]
  },
  gpu: {
    id: 'gpu',
    name: '🧠 AI 가속기 GPU',
    x: 690, y: 410,
    w: 220, h: 60,
    description: '대형 언어 모델 및 생성형 AI 학습/추론에 사용되는 엔비디아 블랙웰/호퍼 통합 칩셋.',
    instruments: [
      { name: '엔비디아 (NVIDIA)', ticker: 'NVDA', sector: 'AI 가속기 GPU', fit: 95, overheat: 85, price: '$120.5', change: '+4.1%', volumeSignal: '역대급 거래대금', analysis: '분할 후 $120선 안착. 호퍼 및 차세대 블랙웰 칩셋 전 세계 90% 이상 점유.' },
      { name: '티에스엠씨 (TSMC)', ticker: 'TSM', sector: 'AI 가속기 GPU', fit: 92, overheat: 70, price: '$152.4', change: '+2.5%', volumeSignal: 'ADR 외인 매집', analysis: 'CoWoS 후공정 패키징 병목 집중 투자. 단가 인상 주도권 쥐고 고수익성 확보.' }
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
            <span>KMC 5년 텐버거 미래 먹거리 10대 핵심 캔버스</span>
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            48V 아키텍처 및 휴머노이드 로봇 등 10대 유망 미래 동력이 테슬라/xAI 생태계와 긴밀히 엣지 선으로 연동되어 있습니다.
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
          {/* 절대좌표 SVG 레이어 */}
          <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 1 }}>
            <defs>
              <marker id="arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 2 L 10 5 L 0 8 z" fill="rgba(139, 92, 246, 0.35)" />
              </marker>
            </defs>
            {/* Center (500, 285)에서 뻗어 나가는 E/E 및 반도체 엣지 */}
            {/* 1. 48V 전력 아키텍처 (50, 250) */}
            <path d="M 370 285 L 280 280" stroke="rgba(139, 92, 246, 0.6)" strokeWidth="2.5" markerEnd="url(#arrow)" />
            {/* 48V에서 -> 2. HVT (50, 360) 및 -> 3. ESS (50, 140) 전력망 연계선 */}
            <path d="M 160 250 L 160 170" stroke="rgba(139, 92, 246, 0.35)" strokeWidth="1.5" markerEnd="url(#arrow)" />
            <path d="M 160 310 L 160 350" stroke="rgba(139, 92, 246, 0.35)" strokeWidth="1.5" markerEnd="url(#arrow)" />
            
            {/* 4. Nuclear (730, 130) */}
            <path d="M 630 270 L 720 190" stroke="rgba(139, 92, 246, 0.4)" strokeWidth="2" markerEnd="url(#arrow)" />
            {/* 5. Cooling (730, 250) */}
            <path d="M 630 285 L 720 280" stroke="rgba(139, 92, 246, 0.4)" strokeWidth="2" markerEnd="url(#arrow)" />
            {/* 6. HBM (380, 480) */}
            <path d="M 500 320 L 500 470" stroke="rgba(139, 92, 246, 0.4)" strokeWidth="2.5" markerEnd="url(#arrow)" />
            {/* 7. Glass (90, 470) */}
            <path d="M 380 320 L 220 460" stroke="rgba(139, 92, 246, 0.4)" strokeWidth="2" markerEnd="url(#arrow)" />
            {/* 8. Robot (170, 40) */}
            <path d="M 370 260 L 250 110" stroke="rgba(139, 92, 246, 0.5)" strokeWidth="2.5" markerEnd="url(#arrow)" />
            {/* 9. Starlink (400, 40) */}
            <path d="M 500 250 L 500 110" stroke="rgba(139, 92, 246, 0.4)" strokeWidth="2" markerEnd="url(#arrow)" />
            {/* 10. Bio-AI (630, 40) */}
            <path d="M 570 250 L 680 110" stroke="rgba(139, 92, 246, 0.4)" strokeWidth="2" markerEnd="url(#arrow)" />
            {/* 11. GPU (690, 410) */}
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
