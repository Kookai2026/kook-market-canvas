'use client';

import { useState, useEffect } from 'react';
import { 
  AlertTriangle, CheckCircle, HelpCircle, XCircle, Info, Lock, 
  TrendingUp, ArrowRight, ShieldCheck, ChevronRight, Activity, Settings
} from 'lucide-react';
import TaehaPortfolio from '../favorites/TaehaPortfolio';

export default function DailyCheckTab() {
  // 실제 사용자의 비중 시뮬레이션 상태
  const [currentWeights, setCurrentWeights] = useState({
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

  // 태하 포트폴리오 로그인 연동
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const auth = sessionStorage.getItem('portfolio_auth');
      if (auth === 'true') {
        setIsUnlocked(true);
      }
    }
  }, []);

  const handleUnlock = (e) => {
    e.preventDefault();
    if (password === '0225') {
      setIsUnlocked(true);
      setLoginError('');
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('portfolio_auth', 'true');
      }
    } else {
      setLoginError('비밀번호가 일치하지 않습니다. (힌트: 부부 기념일 4자리)');
    }
  };

  const handleLock = () => {
    setIsUnlocked(false);
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('portfolio_auth');
    }
  };

  // 편차 계산
  const getDeviation = (key) => {
    const diff = currentWeights[key] - baseWeights[key];
    return diff.toFixed(1);
  };

  const getStatusBadge = (key) => {
    const diff = parseFloat(getDeviation(key));
    if (Math.abs(diff) <= 2.0) {
      return { text: '정상', color: 'var(--success)', bg: 'rgba(16, 185, 129, 0.1)' };
    } else if (diff > 2.0) {
      return { text: '과중 (+)', color: 'var(--danger)', bg: 'rgba(239, 68, 68, 0.1)' };
    } else {
      return { text: '부족 (-)', color: 'var(--accent-light)', bg: 'rgba(139, 92, 246, 0.1)' };
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', paddingBottom: '40px' }}>
      
      {/* 최상단 가이드 배너 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        
        {/* 오늘의 행동 지침 */}
        <div className="panel" style={{ borderLeft: '4px solid var(--success)', background: 'rgba(16, 185, 129, 0.03)' }}>
          <h2 className="panel-title" style={{ color: 'var(--success)' }}>
            <CheckCircle size={18} />
            <span>오늘의 행동 지침</span>
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '14px' }}>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
              <span className="badge badge-success" style={{ padding: '2px 8px', fontSize: '11px', flexShrink: 0 }}>신규 매수</span>
              <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                반도체/HBM 비중이 목표(25%) 대비 부족(-2.9%) 상태입니다. 시장 변동성을 활용하여 분할 매수를 검토하십시오.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
              <span className="badge" style={{ padding: '2px 8px', fontSize: '11px', flexShrink: 0, background: 'rgba(255,255,255,0.05)', color: '#fff' }}>비중 조절</span>
              <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                전체 포트폴리오의 비중 편차가 리밸런싱 한계치(±5.0%) 이내이므로 오늘은 매매하지 않고 포지션을 유지합니다.
              </p>
            </div>
          </div>
        </div>

        {/* 오늘의 금지 행동 */}
        <div className="panel" style={{ borderLeft: '4px solid var(--danger)', background: 'rgba(239, 68, 68, 0.03)' }}>
          <h2 className="panel-title" style={{ color: 'var(--danger)' }}>
            <AlertTriangle size={18} />
            <span>오늘의 금지 행동</span>
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '14px' }}>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
              <span className="badge badge-danger" style={{ padding: '2px 8px', fontSize: '11px', flexShrink: 0 }}>추격 금지</span>
              <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                전력 인프라 섹터가 단기 급등하여 과열도 82 수준에 도달했습니다. 신규 추격 매수를 금지합니다.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
              <span className="badge badge-danger" style={{ padding: '2px 8px', fontSize: '11px', flexShrink: 0 }}>비중 제한</span>
              <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                Musk Stack의 비상장사 및 C등급(공식 미검증) 공급망 종목에 대한 신규 편입은 비중 상한(2.0%)을 초과할 수 없습니다.
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* 비중 모니터링 현황 */}
      <div className="panel">
        <h2 className="panel-title" style={{ marginBottom: '6px' }}>기준 배분 vs 현재 비중 점검</h2>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '24px' }}>포트폴리오의 실제 비중 편차를 실시간으로 점검하고 조절 사유를 진단합니다.</p>

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
              <div key={idx} style={{ 
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
                  기준: <span style={{ fontWeight: '700' }}>{baseWeights[item.key]}%</span>
                </div>
                <div style={{ fontSize: '13px', color: '#fff', textAlign: 'center' }}>
                  현재: <span style={{ fontWeight: '700' }}>{currentWeights[item.key]}%</span>
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
                    minWidth: '50px',
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
            <span>장기 논리 훼손 여부 (5-Year Thesis)</span>
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
            <span>섹터별 과열도 및 진입 가이드</span>
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[
              { sector: 'AI 전력 인프라', score: 82, status: '과열 (추격 매수 금지)', color: 'var(--danger)' },
              { sector: 'AI 반도체 / HBM / Packaging', score: 64, status: '분할매수 후보 (진입 권장)', color: 'var(--success)' },
              { sector: 'AI 데이터센터 냉각/전력', score: 71, status: '중립 (비중 유지)', color: 'var(--text-secondary)' },
              { sector: 'BESS / ESS 전력 유연성', score: 58, status: '중립 (관찰 단계)', color: 'var(--text-secondary)' },
              { sector: 'Musk Stack 검증군', score: 76, status: '조심 (증빙 A등급 위주)', color: 'var(--warning)' }
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

      {/* 태하 하우스 자산 가계부 (0225 비밀 게이트) */}
      <div className="panel" style={{ 
        background: isUnlocked ? 'rgba(16, 185, 129, 0.02)' : 'rgba(139, 92, 246, 0.01)',
        border: isUnlocked ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(139, 92, 246, 0.2)',
        borderRadius: '20px',
        padding: '24px'
      }}>
        {!isUnlocked ? (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ 
              background: 'rgba(139, 92, 246, 0.1)', 
              color: 'var(--accent-light)', 
              width: '48px', 
              height: '48px', 
              borderRadius: '24px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              margin: '0 auto 16px' 
            }}>
              <Lock size={20} />
            </div>
            <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '8px' }}>
              🔒 실 자산 가계부 및 리밸런싱 입력 (태하 하우스 전용)
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', maxWidth: '480px', margin: '0 auto 20px', lineHeight: '1.5' }}>
              태하 하우스의 실보유 수량 및 평단가 관리, 상세 리밸런싱 계산 도구를 활성화하려면 비밀번호가 필요합니다.
            </p>
            <form onSubmit={handleUnlock} style={{ display: 'flex', gap: '8px', justifyContent: 'center', maxWidth: '320px', margin: '0 auto' }}>
              <input
                type="password"
                placeholder="비밀번호 4자리 입력"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid var(--border)',
                  color: '#fff',
                  padding: '8px 14px',
                  borderRadius: '8px',
                  fontSize: '13px',
                  outline: 'none',
                  flexGrow: 1
                }}
              />
              <button
                type="submit"
                style={{
                  background: 'var(--accent)',
                  color: '#fff',
                  border: 0,
                  padding: '8px 16px',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                해제
              </button>
            </form>
            {loginError && <p style={{ color: 'var(--danger)', fontSize: '12px', marginTop: '10px', fontWeight: '600' }}>{loginError}</p>}
          </div>
        ) : (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShieldCheck size={18} />
                <span>태하 하우스 실 자산 관리 (잠금 해제됨)</span>
              </h3>
              <button
                onClick={handleLock}
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid var(--border)',
                  color: 'var(--text-muted)',
                  padding: '4px 10px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  cursor: 'pointer'
                }}
              >
                다시 잠그기
              </button>
            </div>
            
            {/* 내부 가계부 컴포넌트 렌더링 */}
            <TaehaPortfolio />
          </div>
        )}
      </div>

    </div>
  );
}
