'use client';

import { useState } from 'react';
import { Flag, ExternalLink, Link2, HelpCircle, AlertTriangle, Calendar, Award } from 'lucide-react';
import InstrumentCard from './InstrumentCard';

// Trump Stack 관계 데이터
const TRUMP_STACK_DATA = [
  {
    id: 'djt_media',
    subject: 'Trump Media & Technology Group ↔ Truth Social 직접 지분',
    rank: 'A',
    relationType: '직접 지분 소유 및 설립자 테마',
    summary: '도널드 트럼프 대통령이 대주주로 있는 Truth Social의 모회사로, 정치적 모멘텀 및 당선 지지율과 100% 동조되어 움직이는 초고변동성 직접 수혜 자산.',
    evidence: 'OGE 연례 공직자 자산 공개 보고서 (Form 278e) 직접 공시 내용 확인',
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
      analysis: '기초 펀더멘탈 대비 정무적 촉매에 의해 가격이 결정되는 상징적 자산. 리스크 관리를 위해 포트폴리오 내 비중 극소량 제한 권장.'
    }
  },
  {
    id: 'xom_energy',
    subject: 'Exxon Mobil ↔ 친화석 연료 규제 완화 및 내각 매집',
    rank: 'B',
    relationType: '정책 수혜 및 공직자 다수 매매',
    summary: '트럼프 정부의 에너지 자립 정책 및 연방토지 시추 규제 완화(Drill, Baby, Drill) 조치에 따른 전통 화석 연료 및 석유정제 최대 수혜주.',
    evidence: 'TrumpTrades.com / Open Cabinet 의회 및 내각 거래 통계 분석 (Q1 관료 매집 Top 5 진입)',
    evidenceUrl: 'https://trumpstrades.com',
    sourceType: 'Open Cabinet 및 의원 거래 추적 데이터베이스',
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
      analysis: '규제 완화 수혜와 함께 고배당 성향 및 원자재 인플레이션 헷지 자산으로서 공화당 주요 관료들의 장기 보유 비중이 매우 높음.'
    }
  },
  {
    id: 'lmt_defense',
    subject: 'Lockheed Martin ↔ 공화당 국방 예산 증액 및 안보 통제',
    rank: 'B',
    relationType: '국방부 관료 거래 및 방산 예산 수혜',
    summary: '글로벌 안보 강화 정책 및 미국 우선주의 방위 분담금 재협상에 따른 미국 국방부 예산 증액 흐름. 국방 및 정보 당국 고위 공직자들의 꾸준한 매매 포착.',
    evidence: 'Trump Tracker / ProPublica 상하원의원 및 안보보좌관 거래 공시 추적',
    evidenceUrl: 'https://trumptracker.org',
    sourceType: 'ProPublica 의회 거래 분석 데이터',
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
      analysis: '미국 국방 예산 집행률 1위 사업자로, 신정부의 국방 강화 기조에 발맞춰 수주 잔고가 안정적으로 보장되는 안보 관료 포트폴리오의 필수 구성 요소.'
    }
  },
  {
    id: 'tsla_doge',
    subject: 'Tesla ↔ 정부효율성위원회(DOGE) 자율주행 수혜',
    rank: 'C',
    relationType: '간접 인물 연동 및 규제 혁신',
    summary: '일론 머스크의 신정부 효율성위원회(DOGE) 공동 의장 임명에 따라 미국 전역 자율주행(FSD) 연방 규제 표준화 및 우주 산업 우대 조치 수혜 기대.',
    evidence: '백악관 공식 보도자료 및 DOGE 위원회 설치 공시 서명',
    evidenceUrl: 'https://open-cabinet.org',
    sourceType: '백악관(White House) 브리핑룸 공식 공시',
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
      analysis: '머스크의 정계 영향력이 테슬라 FSD의 법적 승인 가속화로 직결될 수 있는 구조적 밸류체인이나, 정치적 변동성에 따른 노이즈 가능성 상존.'
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
      case 'A': return 'A급: 직접 지분 소유 및 설립자 관계';
      case 'B': return 'B급: 직간접 정책 수혜 및 관료 매매 검증';
      case 'C': return 'C급: 인물 네트워크 및 규제 우대 기대';
      default: return '';
    }
  };

  return (
    <div className="musk-stack-container animate-fade-in">
      <div className="canvas-header" style={{ marginBottom: '20px' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Flag size={20} className="text-accent" style={{ color: 'var(--accent-light)', filter: 'drop-shadow(0 0 6px var(--accent))' }} />
            <span>Trump & Cabinet 관료 정책 추적 리포트</span>
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            신정부 행정부 관료(OGE) 및 국회의원들의 주식 거래 데이터(TrumpTrades, Open Cabinet)와 직접 수혜 정책을 교차 분석한 특별 포트폴리오
          </p>
        </div>

        {/* 등급별 필터 단추 */}
        <div className="canvas-selector">
          {['ALL', 'A', 'B', 'C'].map((filter) => (
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
        <span>본 정보는 사외 공직자 윤리 보고서 및 오픈소스 연동 데이터베이스(Open Cabinet, TrumpTrades 등)의 지연 공시 데이터를 기반으로 가공되었습니다. 본 리포트는 단순 교육용 리서치 참고 자료로 제공되며, 실제 매매에 따른 최종 판단과 책임은 투자자 본인에게 있습니다.</span>
      </div>
    </div>
  );
}
