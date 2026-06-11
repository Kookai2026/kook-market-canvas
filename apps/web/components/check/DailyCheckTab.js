'use client';

import { useState } from 'react';
import { 
  AlertTriangle, CheckCircle, Info, 
  TrendingUp, ArrowRight, ShieldCheck, Activity
} from 'lucide-react';

export default function DailyCheckTab() {
  // 데모용 샘플 비중 데이터
  const [currentWeights] = useState({
    musk: 18.5,
    power: 28.2,
    semicon: 22.1,
    cooling: 14.7,
    bess: 16.5
  });

  const baseWeights = {
    musk: 20.0,
    power: 25.0,
    semicon: 25.0,
    cooling: 15.0,
    bess: 15.0
  };

  // 편차 계산
  const getDeviation = (key) => {
    const diff = currentWeights[key] - baseWeights[key];
    return diff.toFixed(1);
  };

  const getStatusBadge = (key) => {
    const diff = parseFloat(getDeviation(key));
    if (Math.abs(diff) <= 2.0) {
      return { text: '정상 범위', color: 'var(--success)', bg: 'rgba(16, 185, 129, 0.1)' };
    } else if (diff > 2.0) {
      return { text: '비중 과중 (+)', color: 'var(--danger)', bg: 'rgba(239, 68, 68, 0.1)' };
    } else {
      return { text: '비중 부족 (-)', color: 'var(--accent-light)', bg: 'rgba(139, 92, 246, 0.1)' };
    }
  };

  const todayCards = [
    {
      label: '금지',
      title: 'AI 전력 인프라 추격 매수 금지',
      body: '과열도 82 샘플 구간입니다. 신규 비중 확대보다 기존 보유 점검이 우선입니다.',
      tone: 'danger',
      icon: AlertTriangle
    },
    {
      label: '대기',
      title: 'HBM/HPC는 눌림 확인',
      body: '비중 부족 신호는 있으나, 가격보다 과열도와 수급 안정 확인 후 판단합니다.',
      tone: 'watch',
      icon: Activity
    },
    {
      label: '검증',
      title: 'Musk 관계는 공식 근거만 반영',
      body: 'X/뉴스 언급은 조사 트리거입니다. A등급은 계약, 공시, IR 확인 후 부여합니다.',
      tone: 'verify',
      icon: ShieldCheck
    }
  ];

  const watchChanges = [
    { name: 'HD현대일렉트릭', meta: '관심 종목', status: '과열 확인' },
    { name: 'NVDA', meta: '관심 종목', status: 'HBM 연동' },
    { name: 'xAI 전력망', meta: '관계 카드', status: '직접 수주 검증 보류' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', paddingBottom: '40px' }}>
      <section className="today-brief">
        <div className="today-brief-head">
          <div>
            <span className="today-kicker">KMC Today</span>
            <h1>오늘은 사는 날보다 확인하는 날입니다.</h1>
            <p>샘플 데이터 기준입니다. 실제 운영 전까지 모든 판단은 검증 카드와 원칙 점검용으로만 사용합니다.</p>
          </div>
          <div className="today-asof">
            <span>as_of</span>
            <strong>2026-06-11</strong>
            <em>sample</em>
          </div>
        </div>

        <div className="today-card-grid">
          {todayCards.map((card) => {
            const Icon = card.icon;
            return (
              <article key={card.label} className={`today-verdict-card ${card.tone}`}>
                <div className="today-card-label">
                  <Icon size={16} />
                  <span>{card.label}</span>
                </div>
                <h2>{card.title}</h2>
                <p>{card.body}</p>
              </article>
            );
          })}
        </div>

        <div className="today-watch-strip">
          <div>
            <strong>우리 관심 변화</strong>
            <span>즐겨찾기와 관계 카드에서 먼저 볼 항목</span>
          </div>
          <div className="today-watch-list">
            {watchChanges.map(item => (
              <span key={item.name}>
                <b>{item.name}</b>
                <em>{item.meta} · {item.status}</em>
              </span>
            ))}
          </div>
        </div>
      </section>
      
      {/* 데모/샘플 배지 안내 */}
      <div style={{
        background: 'rgba(245, 158, 11, 0.08)',
        border: '1px solid rgba(245, 158, 11, 0.25)',
        color: '#F59E0B',
        padding: '12px 18px',
        borderRadius: '12px',
        fontSize: '13px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        <Info size={16} />
        <span>
          <strong>[데모 시뮬레이션 상태]</strong> 아래의 행동 지침과 비중 계산은 예시 템플릿 데이터입니다. 실제 개인 포트폴리오를 연동하기 전까지는 투자 가이드라인 시뮬레이션용으로 활용하십시오.
        </span>
      </div>

      {/* 오늘의 경고 및 지침 (금지 행동 최상단 우선 강조) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px' }}>
        
        {/* 오늘의 금지 행동 (가장 크게 강조) */}
        <div className="panel" style={{ 
          borderLeft: '5px solid var(--danger)', 
          background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.05) 0%, rgba(0,0,0,0) 100%)',
          boxShadow: '0 0 15px rgba(239, 68, 68, 0.05)'
        }}>
          <h2 className="panel-title" style={{ color: 'var(--danger)', fontSize: '18px', fontWeight: '800' }}>
            <AlertTriangle size={20} />
            <span>오늘 절대 하지 말아야 할 행동 (강력 주의)</span>
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '16px' }}>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
              <span className="badge badge-danger" style={{ padding: '3px 8px', fontSize: '11px', flexShrink: 0, fontWeight: '700' }}>추격 매수 금지</span>
              <p style={{ margin: 0, fontSize: '13px', color: '#fff', lineHeight: '1.5', fontWeight: '500' }}>
                AI 전력 인프라 섹터의 단기 급등(과열지수 82 돌파)이 포착되었습니다. 기준 비중을 초과한 추격 성격의 신규 매수는 원칙적으로 절대 금지합니다.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
              <span className="badge badge-danger" style={{ padding: '3px 8px', fontSize: '11px', flexShrink: 0, fontWeight: '700' }}>비공식 루머 배제</span>
              <p style={{ margin: 0, fontSize: '13px', color: '#fff', lineHeight: '1.5', fontWeight: '500' }}>
                머스크 생태계(xAI, SpaceX 등) 협력 관계가 1차 자료(공식 계약/공시)로 완전히 검증되기 전인 C등급 이하 종목은 포트폴리오의 2%를 절대로 넘길 수 없습니다.
              </p>
            </div>
          </div>
        </div>

        {/* 오늘의 예시 지침 */}
        <div className="panel" style={{ borderLeft: '4px solid var(--accent)', background: 'rgba(139, 92, 246, 0.02)' }}>
          <h2 className="panel-title" style={{ color: 'var(--accent-light)' }}>
            <CheckCircle size={18} />
            <span>오늘의 예시 행동 규칙</span>
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px' }}>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
              <span className="badge" style={{ padding: '2px 8px', fontSize: '11px', flexShrink: 0, background: 'rgba(255,255,255,0.06)', color: 'var(--accent-light)', border: '1px solid rgba(139, 92, 246, 0.2)' }}>예시 매수</span>
              <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                AI 반도체 / HBM 비중 부족 상태가 감지될 시에는 매매를 서두르기보다 차분한 기술적 눌림(과열도 확인 필수) 구간에서만 보수적으로 진입을 검토합니다.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
              <span className="badge" style={{ padding: '2px 8px', fontSize: '11px', flexShrink: 0, background: 'rgba(255,255,255,0.05)', color: '#fff' }}>예시 유지</span>
              <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                현재 포트폴리오 비중 편차가 리밸런싱 한계치(±5.0%) 이내이므로 매매 불필요 상태입니다. 포지션 유지를 권장합니다.
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* 비중 모니터링 현황 */}
      <div className="panel">
        <h2 className="panel-title" style={{ marginBottom: '6px' }}>
          <span>포트폴리오 비중 배분율 시뮬레이션 (샘플 검사)</span>
        </h2>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '24px' }}>
          정해둔 5년 기준 배분율과 가상 데모 포트폴리오의 비중 편차입니다. (실제 데이터와 직접 연동되지 않음)
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {[
            { key: 'musk', label: 'Musk Stack 검증 레이어', color: '#8B5CF6' },
            { key: 'power', label: 'AI 전력 인프라 / Grid Bottleneck', color: '#F59E0B' },
            { key: 'semicon', label: 'AI 반도체 / HBM / Packaging', color: '#3B82F6' },
            { key: 'cooling', label: 'AI 데이터센터 전력/냉각 인프라', color: '#EF4444' },
            { key: 'bess', label: 'BESS / 전력 유연성 / ESS', color: '#10B981' }
          ].map((item, idx) => {
            const badge = getStatusBadge(item.key);
            const dev = parseFloat(getDeviation(item.key));
            return (
              <div key={idx} className="allocation-row" style={{ 
                display: 'grid', 
                gridTemplateColumns: '2.5fr 1fr 1fr 1fr 1fr', 
                alignItems: 'center', 
                gap: '16px',
                background: 'rgba(255,255,255,0.01)',
                padding: '12px 16px',
                borderRadius: '12px',
                border: '1px solid var(--border)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '4px', height: '24px', background: item.color, borderRadius: '2px' }} />
                  <span style={{ fontSize: '14px', fontWeight: '600' }}>{item.label}</span>
                </div>
                <div style={{ fontSize: '13px', color: 'var(--text-secondary)', textAlign: 'center' }}>
                  권장 배분: <span style={{ fontWeight: '700' }}>{baseWeights[item.key]}%</span>
                </div>
                <div style={{ fontSize: '13px', color: 'var(--text-muted)', textAlign: 'center' }}>
                  샘플 비중: <span style={{ fontWeight: '700' }}>{currentWeights[item.key]}%</span>
                </div>
                <div style={{ 
                  fontSize: '13px', 
                  fontWeight: '700', 
                  color: dev > 0 ? 'var(--danger)' : dev < 0 ? 'var(--accent-light)' : '#fff',
                  textAlign: 'center'
                }}>
                  편차: {dev > 0 ? `+${dev}` : dev}%
                </div>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <span style={{
                    color: badge.color,
                    background: badge.bg,
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '11px',
                    fontWeight: '700',
                    border: `1px solid ${badge.color}20`,
                    minWidth: '70px',
                    textAlign: 'center'
                  }}>
                    {badge.text}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 장기 투자 가정 및 과열 진입 대기판 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px' }}>
        
        {/* 장기 논리 훼손 여부 체크 */}
        <div className="panel">
          <h2 className="panel-title" style={{ marginBottom: '16px' }}>
            <ShieldCheck size={18} style={{ color: 'var(--success)' }} />
            <span>5년 장기 투자 핵심 논리 상태 (Thesis Validation)</span>
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[
              { title: 'AI 전력 수요 폭증 가정', thesis: 'AI 데이터센터 증설에 따른 유틸리티 전력 소모의 구조적 증가세 유지', status: '유지 (정상)', icon: CheckCircle, color: 'var(--success)' },
              { title: 'HBM 공급망 병목 가정', thesis: 'CoWoS 패키징 및 고대역폭 메모리의 타이트한 수급 밸런스 지속', status: '유지 (정상)', icon: CheckCircle, color: 'var(--success)' },
              { title: '데이터센터 액체냉각 필수화', thesis: '기존 공랭 설계 한계 극대화로 랙당 100kW 이상 시 액체냉각 전환 필수', status: '유지 (정상)', icon: CheckCircle, color: 'var(--success)' },
              { title: 'BESS 설치 의무 및 접속 병목', thesis: '북미/유럽 재생에너지 신규 연계 및 대기 시간 장기화로 분산 전원 수혜 지속', status: '유지 (정상)', icon: CheckCircle, color: 'var(--success)' }
            ].map((check, idx) => (
              <div key={idx} style={{ background: 'rgba(0,0,0,0.15)', border: '1px solid var(--border)', padding: '14px', borderRadius: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontSize: '13px', fontWeight: '700' }}>{check.title}</span>
                  <span style={{ fontSize: '12px', fontWeight: '700', color: check.color, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <check.icon size={14} />
                    <span>{check.status}</span>
                  </span>
                </div>
                <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-muted)', lineHeight: '1.4' }}>{check.thesis}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 과열 및 진입 대기판 */}
        <div className="panel">
          <h2 className="panel-title" style={{ marginBottom: '16px' }}>
            <Activity size={18} style={{ color: 'var(--accent-light)' }} />
            <span>섹터별 기술적 과열도 및 진입 가이드 (예시)</span>
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[
              { sector: 'AI 전력 인프라', score: 82, status: '과열 (추격 매수 금지)', color: 'var(--danger)' },
              { sector: 'AI 반도체 / HBM / Packaging', score: 64, status: '중립 (차분한 대기)', color: 'var(--success)' },
              { sector: 'AI 데이터센터 냉각/전력', score: 71, status: '중립 (비중 유지)', color: 'var(--text-secondary)' },
              { sector: 'BESS / ESS 전력 유연성', score: 58, status: '중립 (관찰 단계)', color: 'var(--text-secondary)' },
              { sector: 'Musk Stack 검증군', score: 76, status: '주의 (A등급 위주 선별)', color: 'var(--warning)' }
            ].map((sec, idx) => (
              <div key={idx} style={{ 
                background: 'rgba(255,255,255,0.01)', 
                border: '1px solid var(--border)', 
                padding: '12px 14px', 
                borderRadius: '12px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: '600' }}>{sec.sector}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>{sec.status}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '16px', fontWeight: '800', color: sec.color }}>{sec.score} / 100</div>
                  <div style={{ height: '4px', width: '60px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', overflow: 'hidden', marginTop: '4px' }}>
                    <div style={{ width: `${sec.score}%`, height: '100%', background: sec.color }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
