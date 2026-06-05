'use client';

import { useState, useEffect } from 'react';
import { 
  FileText, Star, User, Network, Layers, ShieldCheck, BookOpen, CheckSquare, Flag
} from 'lucide-react';

import SignalFeed from '../components/news/SignalFeed';
import FavoriteList from '../components/favorites/FavoriteList';
import ValueChainCanvas from '../components/canvas/ValueChainCanvas';
import MuskStackTab from '../components/cards/MuskStackTab';
import TrumpStackTab from '../components/cards/TrumpStackTab';

import PrinciplesTab from '../components/principles/PrinciplesTab';
import DailyCheckTab from '../components/check/DailyCheckTab';
import RebalanceLogTab from '../components/log/RebalanceLogTab';

export default function Home() {
  const [activeTab, setActiveTab] = useState('principles'); // 기본 첫 랜딩화면을 '5년 투자 원칙'으로 설정
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
            <span>KMC Members</span>
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
          className={`tab-btn ${activeTab === 'principles' ? 'active' : ''}`}
          onClick={() => setActiveTab('principles')}
        >
          <BookOpen size={16} />
          <span>5년 투자 원칙</span>
        </button>
        <button 
          className={`tab-btn ${activeTab === 'daily-check' ? 'active' : ''}`}
          onClick={() => setActiveTab('daily-check')}
        >
          <CheckSquare size={16} />
          <span>오늘의 점검</span>
        </button>
        <button 
          className={`tab-btn ${activeTab === 'canvas' ? 'active' : ''}`}
          onClick={() => setActiveTab('canvas')}
        >
          <Layers size={16} />
          <span>밸류체인 캔버스</span>
        </button>
        <button 
          className={`tab-btn ${activeTab === 'musk' ? 'active' : ''}`}
          onClick={() => setActiveTab('musk')}
        >
          <ShieldCheck size={16} />
          <span>Musk Stack 검증</span>
        </button>
        <button 
          className={`tab-btn ${activeTab === 'trump' ? 'active' : ''}`}
          onClick={() => setActiveTab('trump')}
        >
          <Flag size={16} />
          <span>Trump Stack 검증</span>
        </button>
        <button 
          className={`tab-btn ${activeTab === 'favorites' ? 'active' : ''}`}
          onClick={() => setActiveTab('favorites')}
        >
          <Star size={16} />
          <span>관심 종목</span>
        </button>
        <button 
          className={`tab-btn ${activeTab === 'rebalance-log' ? 'active' : ''}`}
          onClick={() => setActiveTab('rebalance-log')}
        >
          <FileText size={16} />
          <span>리밸런싱 로그</span>
        </button>
      </nav>

      {/* 탭 내용 분기 */}
      {activeTab === 'principles' && (
        <PrinciplesTab />
      )}

      {activeTab === 'daily-check' && (
        <DailyCheckTab />
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

      {activeTab === 'trump' && (
        <TrumpStackTab 
          favorites={favorites} 
          onToggleFavorite={toggleFavorite} 
        />
      )}

      {activeTab === 'favorites' && (
        <div className="main-grid">
          {/* 좌측: 뉴스 및 시그널 피드 */}
          <section style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <SignalFeed />
          </section>

          {/* 우측: 내 관심 종목 리포트 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <section className="panel">
              <FavoriteList 
                favorites={favorites} 
                onToggleFavorite={toggleFavorite} 
              />
            </section>
          </div>
        </div>
      )}

      {activeTab === 'rebalance-log' && (
        <RebalanceLogTab />
      )}
    </main>
  );
}
