'use client';

import { useState, useEffect } from 'react';
import { 
  FileText, Star, Activity, Sparkles, CheckCircle2, 
  TrendingUp, Compass, User, ExternalLink, Network, Layers, ShieldCheck
} from 'lucide-react';

import SignalFeed from '../components/news/SignalFeed';
import FavoriteList, { STOCKS_POOL } from '../components/favorites/FavoriteList';
import ValueChainCanvas from '../components/canvas/ValueChainCanvas';
import MuskStackTab from '../components/cards/MuskStackTab';
import MarketHeatmap from '../components/heatmap/MarketHeatmap';

export default function Home() {
  const [activeTab, setActiveTab] = useState('dashboard'); // dashboard, canvas, musk, heatmap
  const [favorites, setFavorites] = useState(['267260', 'NVDA']); // 기본 즐겨찾기 종목
  const [copied, setCopied] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // 로컬스토리지에서 즐겨찾기 복원
  useEffect(() => {
    setIsMounted(true);
    const saved = localStorage.getItem('kmc_favorites');
    if (saved) {
      try {
        setFavorites(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const toggleFavorite = (ticker) => {
    const updated = favorites.includes(ticker)
      ? favorites.filter(t => t !== ticker)
      : [...favorites, ticker];
    
    setFavorites(updated);
    localStorage.setItem('kmc_favorites', JSON.stringify(updated));
  };

  const copyUrl = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // 마운트 전에는 서버사이드 렌더링 에러 방지용 스텁 렌더링
  if (!isMounted) {
    return (
      <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0a0b0d', color: '#fff' }}>
        <span>KMC 작업대 로드 중...</span>
      </div>
    );
  }

  return (
    <main className="container animate-fade-in">
      {/* Premium Header */}
      <header className="landing-header">
        <div className="page-title">
          <Network size={24} className="text-accent" style={{ color: 'var(--accent-light)', filter: 'drop-shadow(0 0 8px var(--accent))' }} />
          <span className="logo-glow">KMC : KOOK Market Canvas</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div className="user-badge">
            <User size={14} />
            <span>KOOK & Family</span>
            <span style={{ fontSize: '9px', background: 'var(--accent)', color: '#fff', padding: '1px 5px', borderRadius: '4px', marginLeft: '4px', fontWeight: '700' }}>
              PRO
            </span>
          </div>
          <button 
            onClick={copyUrl}
            style={{
              background: 'rgba(139, 92, 246, 0.1)',
              border: '1px solid rgba(139, 92, 246, 0.25)',
              color: 'var(--accent-light)',
              padding: '6px 14px',
              borderRadius: '20px',
              cursor: 'pointer',
              fontSize: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'var(--transition)'
            }}
            className="hover-glow"
          >
            {copied ? '복사 완료' : '공유 URL 복사'}
          </button>
        </div>
      </header>

      {/* 탭 네비게이션 바 */}
      <nav className="tab-nav">
        <button 
          className={`tab-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          <Compass size={16} />
          <span>투자 리서치 대시보드</span>
        </button>
        <button 
          className={`tab-btn ${activeTab === 'canvas' ? 'active' : ''}`}
          onClick={() => setActiveTab('canvas')}
        >
          <Layers size={16} />
          <span>밸류체인 캔버스 맵</span>
        </button>
        <button 
          className={`tab-btn ${activeTab === 'musk' ? 'active' : ''}`}
          onClick={() => setActiveTab('musk')}
        >
          <ShieldCheck size={16} />
          <span>Musk 공급망 검증</span>
        </button>
        <button 
          className={`tab-btn ${activeTab === 'heatmap' ? 'active' : ''}`}
          onClick={() => setActiveTab('heatmap')}
        >
          <TrendingUp size={16} />
          <span>마켓 히트맵</span>
        </button>
      </nav>

      {/* 탭 내용 분기 */}
      {activeTab === 'dashboard' && (
        <div className="main-grid">
          {/* 좌측: 실시간 뉴스 및 시그널 피드 */}
          <section style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <SignalFeed />
          </section>

          {/* 우측: 내 관심 종목 리포트 & 동기화 상태 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <section className="panel">
              <FavoriteList 
                favorites={favorites} 
                onToggleFavorite={toggleFavorite} 
              />
            </section>

            <section className="panel">
              <h2 className="panel-title">
                <Activity size={18} style={{ color: 'var(--accent-light)' }} />
                <span>데이터 파이프라인 감시</span>
              </h2>
              <div style={{ fontSize: '13px', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>사내(Company) Syncer 상태</span>
                  <span style={{ color: 'var(--success)', fontWeight: '600' }}>● 동기화 활성화</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>원격 Supabase 연결 상태</span>
                  <span style={{ color: 'var(--success)', fontWeight: '600' }}>● CONNECTED</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>마지막 연산 배치 실행</span>
                  <span style={{ fontFamily: 'monospace' }}>2026-06-03 23:30 KST</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>클라우드 동기화 모드</span>
                  <span className="stock-ticker">Read Model 단방향 배포</span>
                </div>
                <hr style={{ border: 0, borderBottom: '1px solid var(--border)', margin: '4px 0' }} />
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                  이 시스템은 사내 기지국(Hermes 엔진)에서 계산된 고비용 연산 결과(RSI, 과열도)만 클라우드 DB로 밀어내 배포하는 하이브리드 인프라 모델로 가동됩니다.
                </p>
              </div>
            </section>
          </div>
        </div>
      )}

      {activeTab === 'canvas' && (
        <ValueChainCanvas 
          favorites={favorites} 
          onToggleFavorite={toggleFavorite} 
        />
      )}

      {activeTab === 'musk' && (
        <MuskStackTab 
          favorites={favorites} 
          onToggleFavorite={toggleFavorite} 
        />
      )}

      {activeTab === 'heatmap' && (
        <MarketHeatmap />
      )}
    </main>
  );
}
