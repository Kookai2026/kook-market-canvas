'use client';

import { useState } from 'react';
import { Flag, ExternalLink, Link2, HelpCircle, AlertTriangle, Calendar, Award } from 'lucide-react';
import InstrumentCard from './InstrumentCard';

// 정책 민감 섹터 샘플 데이터. 실제 운영에서는 공식 공시와 검증 워크플로를 통과한 항목만 노출한다.
const TRUMP_STACK_DATA = [
  {
    id: 'djt_media',
    subject: 'Trump Media & Technology Group 정책 민감도',
    rank: 'C',
    relationType: '정책/인물 이벤트 민감 자산',
    summary: '정치 이벤트와 여론 변화에 가격 변동성이 커질 수 있는 고위험 관찰 자산입니다.',
    evidence: '공식 공시와 가격 변동성 자료를 별도 검증하기 전까지 샘플 관찰 항목으로만 분류',
    evidenceUrl: 'https://www.oge.gov',
    sourceType: '미 정부 공직자윤리국(OGE) 공식 연례 보고서',
    verifiedAt: '2026-06-05',
    instrument: {
      name: 'Trump Media & Tech Group',
      ticker: 'DJT',
      sector: '소셜 미디어 & 테크',
      fit: 95,
      overheat: 85,
      price: '$42.50',
      change: '+12.4%',
      volumeSignal: '소매/세력 수급 집중',
      analysis: '기초 펀더멘탈보다 이벤트성 변동이 클 수 있어 실제 편입 전 공식 공시, 유동성, 변동성 검증이 필요합니다.'
    }
  },
  {
    id: 'xom_energy',
    subject: 'Exxon Mobil ↔ 에너지 정책 민감도',
    rank: 'C',
    relationType: '정책 변화 민감 섹터',
    summary: '전통 에너지 섹터는 규제, 세제, 연방 토지 정책 변화에 영향을 받을 수 있는 관찰 대상입니다.',
    evidence: '정책 변화와 섹터 실적의 연결은 공식 법안, 규정, 기업 공시 확인 후 판단',
    evidenceUrl: 'https://corporate.exxonmobil.com',
    sourceType: '기업 공시 및 정책 자료 확인 필요',
    verifiedAt: '2026-06-05',
    instrument: {
      name: 'Exxon Mobil Corp',
      ticker: 'XOM',
      sector: '전통 에너지 / 정유',
      fit: 85,
      overheat: 58,
      price: '$118.20',
      change: '+1.5%',
      volumeSignal: '외인/기관 동반 매수',
      analysis: '정책 방향만으로 직접 관계를 단정하지 않고, 유가, 정제마진, CAPEX, 배당 지속성을 함께 검토해야 합니다.'
    }
  },
  {
    id: 'lmt_defense',
    subject: 'Lockheed Martin ↔ 국방 예산 민감도',
    rank: 'C',
    relationType: '예산/정책 변화 관찰 섹터',
    summary: '방산주는 국방 예산, 안보 환경, 수주 잔고 변화에 영향을 받는 정책 민감 섹터입니다.',
    evidence: '공식 예산안, 기업 수주 공시, 실적 자료 확인 전까지 샘플 관찰 항목으로 유지',
    evidenceUrl: 'https://www.lockheedmartin.com',
    sourceType: '기업 공시 및 예산 자료 확인 필요',
    verifiedAt: '2026-06-05',
    instrument: {
      name: 'Lockheed Martin Corp',
      ticker: 'LMT',
      sector: '방위 산업 / 우주 항공',
      fit: 82,
      overheat: 62,
      price: '$465.10',
      change: '+2.1%',
      volumeSignal: '기관 장기 보유 신호',
      analysis: '예산 방향보다 실제 수주, 마진, 납기, 지정학 리스크를 우선 확인해야 합니다.'
    }
  },
  {
    id: 'tsla_doge',
    subject: 'Tesla ↔ 규제/정책 이벤트 민감도',
    rank: 'C',
    relationType: '규제 변화 관찰 섹터',
    summary: '자율주행, 전기차 보조금, 에너지 저장 정책 변화에 따라 변동성이 확대될 수 있는 관찰 자산입니다.',
    evidence: '공식 규제 문서와 기업 공시 확인 전까지 직접 관계로 해석하지 않음',
    evidenceUrl: 'https://ir.tesla.com',
    sourceType: '기업 공시 및 규제 자료 확인 필요',
    verifiedAt: '2026-06-05',
    instrument: {
      name: 'Tesla Inc',
      ticker: 'TSLA',
      sector: '전기차 / 자율주행 / 로봇',
      fit: 90,
      overheat: 75,
      price: '$220.80',
      change: '+3.8%',
      volumeSignal: '거래대금 최상위 수급',
      analysis: '정책 이벤트보다 인도량, 마진, 에너지 사업 성장, FSD 규제 승인 자료를 분리해 검토해야 합니다.'
    }
  }
];

export default function TrumpStackTab({ favorites, onToggleFavorite }) {
  const [activeFilter, setActiveFilter] = useState('ALL');

  const cleanData = TRUMP_STACK_DATA.filter(item => item.rank !== 'D' && item.rank !== 'X');

  const filteredData = activeFilter === 'ALL' 
    ? cleanData 
    : cleanData.filter(item => item.rank === activeFilter);

  const getRankBadgeClass = (rank) => {
    return `evidence-badge rank-${rank.toLowerCase()}`;
  };

  const getRankLabel = (rank) => {
    switch (rank) {
      case 'A': return 'A급: 공식 문서 검증 완료';
      case 'B': return 'B급: 공식 자료 기반 관계 확인';
      case 'C': return 'C급: 정책 민감 관찰군';
      default: return '';
    }
  };

  return (
    <div className="musk-stack-container animate-fade-in">
      <div className="canvas-header" style={{ marginBottom: '20px' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Flag size={20} className="text-accent" style={{ color: 'var(--accent-light)', filter: 'drop-shadow(0 0 6px var(--accent))' }} />
            <span>정책 민감 섹터 리스크 샘플</span>
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            정치 이벤트와 정책 변화에 민감한 자산을 직접 관계로 단정하지 않고, 공식 자료 확인 전까지 샘플 관찰군으로 분류합니다.
          </p>
        </div>

        {/* 등급별 필터 단추 */}
        <div className="canvas-selector">
          {['ALL', 'C'].map((filter) => (
            <button
              key={filter}
              className={`canvas-sel-btn ${activeFilter === filter ? 'active' : ''}`}
              onClick={() => setActiveFilter(filter)}
            >
              {filter === 'ALL' ? '전체 보기' : `${filter} 등급`}
            </button>
          ))}
        </div>
      </div>

      <div className="musk-stack-grid">
        {filteredData.map((item) => {
          const isFav = favorites.includes(item.instrument.ticker);
          return (
            <div 
              key={item.id} 
              className="panel animate-fade-in"
              style={{
                display: 'grid',
                gridTemplateColumns: '1.2fr 1fr',
                gap: '24px',
                background: 'linear-gradient(135deg, rgba(22, 26, 36, 0.5) 0%, rgba(13, 15, 20, 0.7) 100%)'
              }}
            >
              {/* 왼쪽: 관계 및 증빙 */}
              <div style={{ display: 'flex', flexDirection: 'column', justifycontent: 'space-between', gap: '12px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <span className={getRankBadgeClass(item.rank)}>
                      {item.rank}
                    </span>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                      {getRankLabel(item.rank)}
                    </span>
                  </div>
                  
                  <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#fff', marginBottom: '6px' }}>
                    {item.subject}
                  </h3>
                  
                  {/* C등급일 경우 비중 2% 이하 경고 가이드 */}
                  {item.rank === 'C' && (
                    <div style={{ 
                      background: 'rgba(239, 68, 68, 0.1)', 
                      border: '1px solid rgba(239, 68, 68, 0.25)', 
                      color: 'var(--danger)', 
                      padding: '6px 12px', 
                      borderRadius: '6px', 
                      fontSize: '11.5px', 
                      fontWeight: '700',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      marginBottom: '10px'
                    }}>
                      <AlertTriangle size={12} />
                      <span>🚨 원칙: 전체 포트폴리오 비중 2.0% 이하 제한 필수</span>
                    </div>
                  )}

                  <span style={{ fontSize: '13px', color: 'var(--accent-light)', fontWeight: '600', display: 'block', marginBottom: '10px' }}>
                    관계 유형: {item.relationType}
                  </span>
                  
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                    {item.summary}
                  </p>
                </div>

                <div style={{ background: 'rgba(0,0,0,0.2)', padding: '12px 14px', borderRadius: '8px', borderLeft: '3px solid var(--accent-light)' }}>
                  
                  {/* 메타데이터: 출처 유형 & 마지막 검증일 */}
                  <div style={{ display: 'flex', gap: '16px', marginBottom: '8px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '6px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: 'var(--text-muted)' }}>
                      <Award size={11} />
                      <span>출처: <strong style={{ color: 'var(--text-secondary)' }}>{item.sourceType}</strong></span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: 'var(--text-muted)' }}>
                      <Calendar size={11} />
                      <span>검증일: <strong style={{ color: 'var(--text-secondary)' }}>{item.verifiedAt}</strong></span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: 'var(--text-muted)', fontWeight: '600' }}>
                    <Link2 size={11} />
                    <span>신뢰도 증빙 출처</span>
                  </div>
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px', lineHeight: '1.4' }}>
                    {item.evidence}
                  </p>
                  <a 
                    href={item.evidenceUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="evidence-link"
                  >
                    <span>공식 사이트 확인</span>
                    <ExternalLink size={11} />
                  </a>
                </div>
              </div>

              {/* 오른쪽: 관련 종목 판정 카드 */}
              <div>
                <InstrumentCard 
                  instrument={item.instrument}
                  isFavorite={isFav}
                  onToggleFavorite={onToggleFavorite}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-muted)', padding: '10px' }}>
        <HelpCircle size={14} />
        <span>본 정보는 정책 민감 섹터를 설명하기 위한 샘플 리서치 자료입니다. 공식 공시와 원문 자료 검증 전까지 직접 관계 또는 매매 근거로 사용하지 않습니다.</span>
      </div>
    </div>
  );
}
