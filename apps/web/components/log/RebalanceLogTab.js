'use client';

import { Calendar, ArrowRight } from 'lucide-react';

const LOGS = [
  {
    date: '2026-06-04',
    title: '6월 공개 앱 보안 및 검증 문구 정리',
    author: 'KMC System Operator',
    type: '보안 및 구조 조정',
    actions: [
      { sector: 'Musk Stack', change: 'A등급 직접 계약 필터 강화 및 일부 C등급 강등', reason: 'HD현대일렉트릭 xAI 공급 미검증 소식 반영' },
      { sector: '개인 포트폴리오', change: '공개 앱 노출 제거 및 샘플 관심 종목 기능만 유지', reason: '퍼블릭 출시 리스크 방지 및 보안 등급 상승' }
    ],
    details: '투자 리서치 대시보드에서 5년 장기투자 원칙 랜딩으로 첫 화면을 전환하고, 검증 전 데이터는 샘플 리서치 데이터로 표시하도록 정리하였습니다.'
  },
  {
    date: '2026-05-20',
    title: '5월 양자 컴퓨팅 섹터 Watchlist 편입 및 비중 축소',
    author: 'KMC System Operator',
    type: '섹터 등급 강등',
    actions: [
      { sector: '양자 컴퓨팅', change: 'Core ➡️ Watchlist 등급 변경 (비중 0%)', reason: '2026년 기준 상업화 매출 가시성 미달 및 변동성 과다' },
      { sector: 'AI 전력 인프라', change: '기존 20% ➡️ 25% 확대 편입', reason: 'IEA 보고서 기반 배선망 병목 수주 가시성 상향' }
    ],
    details: '양자컴퓨팅(IonQ 등)은 고유 가치가 존재하나 5년 내 실질 매출 기여도가 낮으므로 포트폴리오 안정성을 위해 핵심 Core 영역에서 제외하고 단순 관찰 관심군(Watchlist)으로 조정하였습니다.'
  },
  {
    date: '2026-04-15',
    title: 'BESS 및 전력 유연성 섹터 Core Holding 승격',
    author: 'KMC System Operator',
    type: '섹터 신설 및 비중 확대',
    actions: [
      { sector: 'BESS / ESS', change: 'Watchlist ➡️ Core 15% 배정', reason: '데이터센터 계통 지연에 따른 현장 배터리 저장 장치 결합 가속화' }
    ],
    details: '미국 현지 데이터센터 신규 연계를 대기 중인 개발사들이 피크 저감 및 그리드 혼잡 우회를 위해 대형 ESS를 동반 구축하는 트렌드가 명확해짐에 따라 핵심 자산군으로 격상하였습니다.'
  }
];

export default function RebalanceLogTab() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '40px' }}>
      
      {/* 타이틀 및 가이드 */}
      <div className="panel">
        <h2 className="panel-title" style={{ marginBottom: '6px' }}>월간 / 분기별 리밸런싱 로그</h2>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
          KMC 5년 투자 원칙에 입각하여 실행한 포트폴리오 비중 변경 및 섹터 조정 이력을 시간순으로 기록합니다.
        </p>
      </div>

      {/* 타임라인 로그 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', position: 'relative', paddingLeft: '24px' }}>
        
        {/* 세로 축 라인 */}
        <div style={{
          position: 'absolute',
          top: '8px',
          bottom: '8px',
          left: '7px',
          width: '2px',
          background: 'linear-gradient(180deg, var(--accent) 0%, rgba(139, 92, 246, 0.1) 100%)'
        }} />

        {LOGS.map((log, idx) => (
          <div key={idx} style={{ position: 'relative' }}>
            
            {/* 노드 점 */}
            <div style={{
              position: 'absolute',
              left: '-23px',
              top: '4px',
              width: '12px',
              height: '12px',
              borderRadius: '6px',
              background: idx === 0 ? 'var(--accent)' : 'rgba(255,255,255,0.2)',
              border: idx === 0 ? '3px solid rgba(139, 92, 246, 0.3)' : '3px solid #0a0b0d',
              boxShadow: idx === 0 ? '0 0 10px var(--accent)' : 'none',
              zIndex: 2
            }} />

            {/* 로그 카드 */}
            <div className="panel hover-glow" style={{ transition: 'var(--transition)' }}>
              
              {/* 로그 헤더 */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '14px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <Calendar size={13} style={{ color: 'var(--text-muted)' }} />
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'monospace' }}>{log.date}</span>
                    <span style={{
                      background: log.type.includes('강등') ? 'rgba(239, 68, 68, 0.1)' : 'rgba(139, 92, 246, 0.1)',
                      color: log.type.includes('강등') ? 'var(--danger)' : 'var(--accent-light)',
                      fontSize: '10px',
                      padding: '2px 8px',
                      borderRadius: '10px',
                      fontWeight: '700',
                      border: log.type.includes('강등') ? '1px solid rgba(239, 68, 68, 0.2)' : '1px solid rgba(139, 92, 246, 0.2)'
                    }}>
                      {log.type}
                    </span>
                  </div>
                  <h3 style={{ fontSize: '16px', fontWeight: '700' }}>{log.title}</h3>
                </div>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>작성자: {log.author}</span>
              </div>

              {/* 주요 액션 표 */}
              <div style={{
                background: 'rgba(0,0,0,0.15)',
                border: '1px solid var(--border)',
                borderRadius: '10px',
                padding: '12px',
                marginBottom: '14px',
                fontSize: '13px'
              }}>
                <h4 style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px', fontWeight: '700' }}>
                  실행된 비중 조정 내용
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {log.actions.map((act, aid) => (
                    <div key={aid} style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                        <span style={{ fontWeight: '700', color: 'var(--accent-light)' }}>[{act.sector}]</span>
                        <ArrowRight size={12} style={{ color: 'var(--text-muted)' }} />
                        <span style={{ fontWeight: '600' }}>{act.change}</span>
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)', paddingLeft: '12px' }}>
                        * 사유: {act.reason}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 상세 비고 */}
              <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                {log.details}
              </p>

            </div>
          </div>
        ))}

      </div>

    </div>
  );
}
