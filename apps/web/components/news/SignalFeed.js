'use client';

import { useState } from 'react';
import { FileText, Sparkles, AlertCircle } from 'lucide-react';

const NEWS_FEED_DATA = [
  {
    id: 1,
    tag: '초고압 변압기',
    time: '샘플',
    title: 'HD현대일렉트릭, 북미 송배전 설비 수요 확대 관찰',
    summary: '데이터센터 전력 수요와 노후 전력망 교체 사이클을 함께 점검하는 샘플 리서치 항목입니다.',
    sentiment: 'positive'
  },
  {
    id: 2,
    tag: 'xAI 전력망',
    time: '샘플',
    title: 'xAI 멤피스 전력 공급망 업데이트 확인 필요',
    summary: 'MLGW/TVA 전력 공급 관련 공개 자료는 추적 대상이나, 개별 장비사의 직접 수주로 해석하지 않습니다.',
    sentiment: 'neutral'
  },
  {
    id: 3,
    tag: 'HBM 패키징',
    time: '샘플',
    title: 'NVIDIA-TSMC, CoWoS 패키징 생산 능력 2026년까지 연 2배 확장 목표 제시',
    summary: '한미반도체 TC본더 및 SK하이닉스 밸류체인 직결. 하반기 CAPEX 집행 가속화 전망.',
    sentiment: 'positive'
  },
  {
    id: 4,
    tag: '원자력 발전',
    time: '샘플',
    title: 'Constellation Energy, MS 전력 공급 소식에 주가 사상 최고치 경신',
    summary: '인공지능(AI) 구동용 무탄소 에너지원으로서 원전 가치 재조명. 대형 PPA 건들의 실증 단계 진입.',
    sentiment: 'neutral'
  },
  {
    id: 5,
    tag: '구리 원자재',
    time: '샘플',
    title: '런던금속거래소(LME) 구리 재고 급감 소식에 관련 전선주 강세',
    summary: '글로벌 전력 인프라 및 신재생 케이블 수요 집중으로 동선 가격 압박 가속화.',
    sentiment: 'positive'
  }
];

export default function SignalFeed() {
  const [activeTab, setActiveTab] = useState('ALL'); // ALL, SIGNIFICANT

  const getSentimentStyle = (sentiment) => {
    if (sentiment === 'positive') return { borderLeft: '3px solid var(--success)' };
    if (sentiment === 'negative') return { borderLeft: '3px solid var(--danger)' };
    return { borderLeft: '3px solid var(--border)' };
  };

  return (
    <div className="panel animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: '10px' }}>
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileText size={18} className="text-accent" style={{ color: 'var(--accent-light)' }} />
            <span>핵심 투자 시그널 샘플</span>
          </h2>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '5px' }}>
            <AlertCircle size={12} />
            <span>DART/News 자동 수집 전까지 검증용 샘플 피드로 표시합니다.</span>
          </p>
        </div>
        <div style={{ display: 'flex', gap: '6px' }}>
          <button 
            onClick={() => setActiveTab('ALL')}
            style={{
              background: activeTab === 'ALL' ? 'rgba(255,255,255,0.08)' : 'none',
              border: 'none',
              color: activeTab === 'ALL' ? '#fff' : 'var(--text-secondary)',
              fontSize: '12px',
              padding: '4px 8px',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            전체 피드
          </button>
          <button 
            onClick={() => setActiveTab('SIGNIFICANT')}
            style={{
              background: activeTab === 'SIGNIFICANT' ? 'rgba(255,255,255,0.08)' : 'none',
              border: 'none',
              color: activeTab === 'SIGNIFICANT' ? '#fff' : 'var(--text-secondary)',
              fontSize: '12px',
              padding: '4px 8px',
              borderRadius: '4px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '3px'
            }}
          >
            <Sparkles size={11} style={{ color: 'var(--warning)' }} />
            <span>수주/공시 중심</span>
          </button>
        </div>
      </div>

      <div className="news-list">
        {NEWS_FEED_DATA
          .filter(news => activeTab === 'ALL' ? true : news.tag === '초고압 변압기' || news.tag === 'xAI 전력망')
          .map((news) => (
            <article 
              key={news.id} 
              className="news-card"
              style={getSentimentStyle(news.sentiment)}
            >
              <div className="news-meta">
                <span className="tag-badge">{news.tag}</span>
                <span className="news-time">{news.time}</span>
              </div>
              <h3 className="news-title">{news.title}</h3>
              <p className="news-summary">{news.summary}</p>
            </article>
          ))}
      </div>
    </div>
  );
}
