'use client';

import { useState } from 'react';
import { FileText, Sparkles, AlertCircle } from 'lucide-react';

const SIGNAL_FEED_DATA = [
  {
    id: 1,
    tag: '초고압 변압기',
    source_type: 'news',
    source_name: '샘플 뉴스 메타',
    as_of: '2026-06-11',
    verification: '검증 필요',
    validation_status: 'candidate',
    matched_to: 'AI 전력 인프라 · 267260',
    confidence: 72,
    title: '북미 송배전 설비 수요 확대 신호',
    summary: '데이터센터 전력 수요와 노후 전력망 교체 사이클이 같은 방향으로 움직이는지 확인하는 샘플 시그널입니다.',
    why: '관심 종목과 AI 전력 인프라 노드에 동시에 매칭됨',
    sentiment: 'positive'
  },
  {
    id: 2,
    tag: 'xAI 전력망',
    source_type: 'official',
    source_name: '샘플 공공기관 자료',
    as_of: '2026-06-11',
    verification: '직접 수주 미확인',
    validation_status: 'needs_source',
    matched_to: 'Musk Stack · xAI 전력망',
    confidence: 64,
    title: 'xAI 멤피스 전력 공급망 업데이트 확인 필요',
    summary: 'MLGW/TVA 전력 공급 관련 공개 자료는 추적 대상이나, 개별 장비사의 직접 수주로 해석하지 않습니다.',
    why: 'Musk 관계 카드의 등급 변경 후보로 매칭됨',
    sentiment: 'neutral'
  },
  {
    id: 3,
    tag: 'HBM 패키징',
    source_type: 'ir',
    source_name: '샘플 IR/공급망 메타',
    as_of: '2026-06-11',
    verification: '샘플',
    validation_status: 'candidate',
    matched_to: 'HBM/Advanced Packaging',
    confidence: 78,
    title: 'CoWoS/HBM 병목 지속 여부 확인',
    summary: 'HBM, TC 본더, 후공정 장비 노드가 함께 움직이는지 확인하는 샘플 리서치 시그널입니다.',
    why: '장기 핵심 섹터와 관심 종목 후보군에 동시 매칭됨',
    sentiment: 'positive'
  },
  {
    id: 4,
    tag: '원자력 발전',
    source_type: 'disclosure',
    source_name: '샘플 공시/계약 메타',
    as_of: '2026-06-11',
    verification: '공식 근거 우선',
    validation_status: 'corroborated',
    matched_to: 'AI 전력 PPA',
    confidence: 69,
    title: 'AI 전력 PPA는 계약 상대를 분리해 확인',
    summary: '원전 PPA와 Tesla/Megapack 관계를 자동 연결하지 않고, 계약 상대와 프로젝트명을 분리 검증합니다.',
    why: '정책/전력 리스크 카드의 오인 가능성 차단',
    sentiment: 'neutral'
  },
  {
    id: 5,
    tag: '구리 원자재',
    source_type: 'market',
    source_name: '샘플 원자재 메타',
    as_of: '2026-06-11',
    verification: '가격 데이터 필요',
    validation_status: 'candidate',
    matched_to: '구리/전선 · 전력망',
    confidence: 61,
    title: '구리 가격 압박은 전력망 비용 변수',
    summary: '전선주 강세보다 변압기/케이블 원가와 가격 전가 가능성을 먼저 확인해야 하는 샘플 시그널입니다.',
    why: '전력 인프라 노드의 비용 리스크에 매칭됨',
    sentiment: 'positive'
  },
  {
    id: 6,
    tag: 'X 루머 필터',
    source_type: 'social',
    source_name: 'X 샘플 포스트',
    as_of: '2026-06-11',
    verification: '공식 근거 없음',
    validation_status: 'raw_social',
    matched_to: 'Musk Stack · 조사 후보',
    confidence: 34,
    title: 'X 단독 언급은 조사 대기열로만 이동',
    summary: 'X에서 나온 공급망 언급은 공식 링크나 공시가 없으면 오늘의 투자 근거가 아니라 조사 후보로만 남깁니다.',
    why: '문서화된 상태값 raw_social 예시. A/B 등급 신호로 승격 불가',
    sentiment: 'neutral'
  },
  {
    id: 7,
    tag: '중복/오인 제거',
    source_type: 'social',
    source_name: 'X 샘플 포스트',
    as_of: '2026-06-11',
    verification: '오인 가능성 높음',
    validation_status: 'rejected',
    matched_to: '정책 리스크 · 제외',
    confidence: 18,
    title: '출처 없는 정책 수혜 주장은 제외',
    summary: '공식 법안, 규정, 기업 공시와 연결되지 않는 정책 수혜 주장은 신호 카드에서 제외할 후보로 표시합니다.',
    why: '문서화된 상태값 rejected 예시. 화면에는 표시하되 검증 실패 샘플로 분리',
    sentiment: 'negative'
  }
];

export default function SignalFeed() {
  const [activeTab, setActiveTab] = useState('ALL'); // ALL, SIGNIFICANT

  const getSentimentStyle = (sentiment) => {
    if (sentiment === 'positive') return { borderLeft: '3px solid var(--success)' };
    if (sentiment === 'negative') return { borderLeft: '3px solid var(--danger)' };
    return { borderLeft: '3px solid var(--border)' };
  };

  const getValidationLabel = (status) => {
    switch (status) {
      case 'raw_social': return 'raw_social · 원문 수집';
      case 'candidate': return 'candidate · 관련 후보';
      case 'needs_source': return 'needs_source · 공식 근거 필요';
      case 'corroborated': return 'corroborated · 근거 보강';
      case 'rejected': return 'rejected · 제외 후보';
      default: return status || 'unknown';
    }
  };

  return (
    <div className="panel animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: '10px' }}>
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileText size={18} className="text-accent" style={{ color: 'var(--accent-light)' }} />
            <span>임베딩 투자 시그널 샘플</span>
          </h2>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '5px' }}>
            <AlertCircle size={12} />
            <span>수집 원문을 그대로 보여주지 않고, 종목·섹터·캔버스에 매칭된 샘플 카드만 표시합니다.</span>
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
            <span>공식 근거 중심</span>
          </button>
        </div>
      </div>

      <div className="news-list">
        {SIGNAL_FEED_DATA
          .filter(signal => activeTab === 'ALL' ? true : signal.validation_status === 'corroborated' || signal.source_type === 'official' || signal.source_type === 'disclosure')
          .map((signal) => (
            <article 
              key={signal.id} 
              className="news-card"
              style={getSentimentStyle(signal.sentiment)}
            >
              <div className="news-meta">
                <span className="tag-badge">{signal.tag}</span>
                <span className="news-time">{signal.source_type} · {signal.as_of}</span>
              </div>
              <h3 className="news-title">{signal.title}</h3>
              <p className="news-summary">{signal.summary}</p>
              <div className="signal-meta-grid">
                <span><b>출처</b>{signal.source_name}</span>
                <span><b>매칭</b>{signal.matched_to}</span>
                <span><b>검증</b>{signal.verification}</span>
                <span><b>상태</b>{getValidationLabel(signal.validation_status)}</span>
                <span><b>신뢰도</b>{signal.confidence}/100</span>
              </div>
              <p className="signal-why">{signal.why}</p>
            </article>
          ))}
      </div>
    </div>
  );
}
