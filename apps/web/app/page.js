'use client';

import { useState } from 'react';
import { 
  FileText, Star, Activity, Sparkles, CheckCircle2, 
  TrendingUp, Compass, User, ExternalLink, Network 
} from 'lucide-react';

export default function Home() {
  const [copied, setCopied] = useState(false);
  const user = { name: 'KOOK & Partner', role: 'Premium Workspace' };

  // Mock News Feed
  const newsList = [
    {
      id: 1,
      tag: '초고압 변압기',
      time: '2시간 전',
      title: 'HD현대일렉트릭, 북미 전력청 대상 2,800억 규모 초고압 변압기 추가 수주 공시',
      summary: '미국 데이터센터 증설로 인한 고전압 변압기 숏티지 장기화 수혜. 백로그 마진 상승 견인.'
    },
    {
      id: 2,
      tag: 'xAI 전력망',
      time: '5시간 전',
      title: 'Elon Musk의 xAI, 테네시 멤피스 슈퍼클러스터용 150MW 신규 변전소 계약 타결',
      summary: '멤피스 지역 전력청과의 직접 인프라 조달 합의 완료. Musk Stack 공급망 연결 강도 상승.'
    },
    {
      id: 3,
      tag: 'HBM 패키징',
      time: '어제',
      title: 'NVIDIA-TSMC, CoWoS 패키징 생산 능력 2026년까지 연 2배 확장 목표 제시',
      summary: '한미반도체 TC본더 및 SK하이닉스 밸류체인 직결. 하반기 CAPEX 집행 가속화 전망.'
    }
  ];

  // Mock Favorite Stocks (Score cards)
  const favorites = [
    { name: 'HD현대일렉트릭', ticker: '267260', sector: '초고압 변압기', fit: 82, overheat: 71 },
    { name: 'Eaton Corp plc', ticker: 'ETN', sector: '전력 배전 및 제어', fit: 78, overheat: 62 },
    { name: 'NVIDIA Corp', ticker: 'NVDA', sector: 'AI 가속기 GPU', fit: 90, overheat: 86 }
  ];

  const copyUrl = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="container animate-fade-in">
      {/* Header */}
      <header className="landing-header">
        <div className="page-title">
          <Network size={24} className="text-accent" style={{ color: 'var(--accent-light)' }} />
          <span className="logo-glow">KMC : KOOK Market Canvas</span>
        </div>
        <div className="user-badge">
          <User size={14} />
          <span>{user.name}</span>
          <span style={{ fontSize: '10px', background: 'var(--accent)', color: '#fff', padding: '1px 5px', borderRadius: '4px', marginLeft: '4px' }}>{user.role}</span>
        </div>
      </header>

      {/* Public connection verify banner */}
      <div className="verification-banner">
        <CheckCircle2 size={24} style={{ color: 'var(--success)' }} />
        <div className="banner-content" style={{ flex: 1 }}>
          <h4>🌐 퍼블릭 웹 퍼블리싱 검증 통과</h4>
          <p>이 웹앱은 Vercel 클라우드에 0원으로 성공적으로 배포되었습니다. 부인분과 이 URL을 공유하여 외부망 접속을 테스트하십시오.</p>
        </div>
        <button 
          onClick={copyUrl}
          style={{
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid var(--border)',
            color: '#fff',
            padding: '8px 16px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '13px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          {copied ? '복사 완료' : '공유 URL 복사'}
        </button>
      </div>

      {/* 2-Column Grid Layout */}
      <div className="main-grid">
        {/* Left Col: News & Signal Feed */}
        <section className="panel">
          <h2 className="panel-title">
            <FileText size={18} style={{ color: 'var(--accent-light)' }} />
            <span>오늘의 핵심 투자 시그널 (DART & News)</span>
          </h2>
          <div className="news-list">
            {newsList.map(news => (
              <article key={news.id} className="news-card">
                <div className="news-meta">
                  <span className="tag-badge">{news.tag}</span>
                  <span className="news-time">{news.time}</span>
                </div>
                <h3 className="news-title">{news.title}</h3>
                <p className="news-summary">{news.summary}</p>
              </article>
            ))}
          </div>
        </section>

        {/* Right Col: Favorite Nodes & Scores */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Favorite node cards */}
          <section className="panel">
            <h2 className="panel-title">
              <Star size={18} style={{ color: 'var(--warning)' }} />
              <span>내 관심 밸류체인 스냅샷</span>
            </h2>
            <div className="stock-grid">
              {favorites.map((fav, idx) => (
                <div key={idx} className="stock-card">
                  <div className="stock-info">
                    <div className="stock-name-row">
                      <span className="stock-name">{fav.name}</span>
                      <span className="stock-ticker">{fav.ticker}</span>
                    </div>
                    <span className="stock-sector">{fav.sector}</span>
                  </div>
                  <div className="stock-scores">
                    <div className="score-box">
                      <span className={`score-num ${fav.fit >= 80 ? 'high' : 'medium'}`}>{fav.fit}</span>
                      <span className="score-label">적합도</span>
                    </div>
                    <div className="score-box">
                      <span className={`score-num ${fav.overheat >= 75 ? 'low' : (fav.overheat >= 60 ? 'medium' : 'high')}`}>{fav.overheat}</span>
                      <span className="score-label">과열도</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Quick links & CMS status info */}
          <section className="panel">
            <h2 className="panel-title">
              <Activity size={18} style={{ color: 'var(--accent-light)' }} />
              <span>동기화 및 CMS 감시 상태</span>
            </h2>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>사내(Company) 동기화 파이프라인</span>
                <span style={{ color: 'var(--success)', fontWeight: '600' }}>● 활성화 (Hermes)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>최근 데이터 갱신 시각</span>
                <span>2026-06-03 23:00 KST</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>캔버스 버전</span>
                <span className="stock-ticker">KMC v0.9.0 (Draft)</span>
              </div>
              <hr style={{ border: 0, borderBottom: '1px solid var(--border)', margin: '4px 0' }} />
              <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                이 웹 사이트는 사내 기지국(KOOK-MECHA)에서 연산된 최종 밸류체인 데이터를 동기화받아 0원 클라우드 DB로 가동되는 퍼블릭 읽기 전용 대시보드입니다.
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
