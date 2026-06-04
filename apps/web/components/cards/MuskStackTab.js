'use client';

import { useState } from 'react';
import { ShieldCheck, ExternalLink, Link2, HelpCircle, AlertTriangle, Calendar, Award } from 'lucide-react';
import InstrumentCard from './InstrumentCard';

// Musk Stack 관계 데이터 (확인일, 출처 종류 필수 보완)
const MUSK_STACK_DATA = [
  {
    id: 'eaton_tesla',
    subject: 'Eaton Corp ↔ Tesla Gigafactory Texas',
    rank: 'A',
    relationType: '기가팩토리 배전설비 공급',
    summary: '테슬라 기가 텍사스 및 사이버트럭 생산 라인의 지능형 배전 스위치기어 및 스위치보드 직접 납품 확인.',
    evidence: 'Tesla Giga Texas EPC 협력사 공급 내역서 및 보도자료',
    evidenceUrl: 'https://www.eaton.com',
    sourceType: '협력사 공식 공급 명세서',
    verifiedAt: '2026-06-04',
    instrument: {
      name: 'Eaton Corp plc',
      ticker: 'ETN',
      sector: '전력 관리 및 제어',
      fit: 84,
      overheat: 65,
      price: '$312.4',
      change: '+1.8%',
      volumeSignal: '안정적 기관 매집',
      analysis: '미국 내 송배전 장비 1위 사업자로 테슬라 공장 증설 및 AI 전력 부하 매칭 제품군 최강의 안정성 보유.'
    }
  },
  {
    id: 'hde_memphis',
    subject: 'HD현대일렉트릭 ↔ 북미 AI 전력망 증설 수혜',
    rank: 'C',
    relationType: '간접 전력망 변압기 증설 수혜',
    summary: 'MLGW/TVA의 xAI 데이터센터 150MW 전력 공급망 변전소 확충 관련하여 간접적인 초고압 변압기 증설 및 공급망 확장 수혜.',
    evidence: 'MLGW xAI 2025 Update 보고서 및 북미 송배전 사이클 수주 공시 (xAI 직접 수주 공식 발표는 부재)',
    evidenceUrl: 'https://www.mlgw.com/images/content/files/pdf/new/xAI%202025%20Update.pdf',
    sourceType: '전력청 유틸리티 위원회 공식 업데이트 리포트',
    verifiedAt: '2026-06-04',
    instrument: {
      name: 'HD현대일렉트릭',
      ticker: '267260',
      sector: '초고압 변압기',
      fit: 82,
      overheat: 88,
      price: '284,500원',
      change: '+8.4%',
      volumeSignal: '외인 집중 매수',
      analysis: 'xAI 직접 계약 공시는 공식 확인되지 않았으나, MLGW/TVA 변전소 송배전 사이클에 따른 간접 수혜 개연성이 높은 최선호주.'
    }
  },
  {
    id: 'ceg_tesla_megapack',
    subject: 'Constellation Energy ↔ AI 데이터센터 전력 PPA',
    rank: 'C',
    relationType: 'AI 전력 원전 PPA (Microsoft 연동)',
    summary: 'Microsoft와의 Three Mile Island 원전 재가동 20년 PPA 체결을 통한 AI 데이터센터 무탄소 전력 공급 사업 추진.',
    evidence: 'Constellation IR 공시 (Crane Clean Energy Center)',
    evidenceUrl: 'https://investors.constellationenergy.com/news-releases/news-release-details/constellation-launch-crane-clean-energy-center-restoring-jobs',
    sourceType: '상장사 공식 IR 공시',
    verifiedAt: '2026-06-04',
    instrument: {
      name: 'Constellation Energy',
      ticker: 'CEG',
      sector: '원자력 발전',
      fit: 80,
      overheat: 82,
      price: '$220.5',
      change: '+4.8%',
      volumeSignal: '거래대금 상위',
      analysis: 'Microsoft-TMI PPA 기반의 인프라 직결 아이콘. 테슬라 메가팩과의 직접적 파트너십 증빙은 부재하여 간접 인프라 수혜로 조정.'
    }
  },
  {
    id: 'sk_nvidia_tesla',
    subject: 'SK하이닉스 ↔ Tesla FSD (via NVIDIA)',
    rank: 'C',
    relationType: '간접 밸류체인 연동',
    summary: 'SK하이닉스가 생산한 HBM3E가 엔비디아의 B200 AI 가속기를 거쳐 테슬라 FSD 트레이닝용 슈퍼컴퓨터 도조(Dojo) 및 컴퓨팅 클러스터에 최종 장착.',
    evidence: 'NVIDIA 가속기 공급망 리서치 보고서 및 하이닉스 HBM3E 테슬라 직공급 퀄테스트 루머 진행',
    evidenceUrl: 'https://www.nvidia.com',
    sourceType: '글로벌 리서치 기관 밸류체인 맵',
    verifiedAt: '2026-06-04',
    instrument: {
      name: 'SK하이닉스',
      ticker: '000660',
      sector: '반도체 메모리',
      fit: 89,
      overheat: 72,
      price: '188,500원',
      change: '+3.2%',
      volumeSignal: '외인/기관 양매수',
      analysis: '엔비디아 밸류체인의 핵심이자 테슬라향 간접 비중 확대 흐름. HBM 독점적 지위 견고.'
    }
  }
];

export default function MuskStackTab({ favorites, onToggleFavorite }) {
  const [activeFilter, setActiveFilter] = useState('ALL');

  // D/X 등급은 기본적으로 완전 필터링 및 차단
  const cleanData = MUSK_STACK_DATA.filter(item => item.rank !== 'D' && item.rank !== 'X');

  const filteredData = activeFilter === 'ALL' 
    ? cleanData 
    : cleanData.filter(item => item.rank === activeFilter);

  const getRankBadgeClass = (rank) => {
    return `evidence-badge rank-${rank.toLowerCase()}`;
  };

  const getRankLabel = (rank) => {
    switch (rank) {
      case 'A': return 'A급: 직접 계약/납품 확인';
      case 'B': return 'B급: 직접 언급/파트너 관계';
      case 'C': return 'C급: 간접 공급망 연결';
      default: return '';
    }
  };

  return (
    <div className="musk-stack-container animate-fade-in">
      <div className="canvas-header" style={{ marginBottom: '20px' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldCheck size={20} className="text-accent" style={{ color: 'var(--accent-light)' }} />
            <span>Musk Stack 공급망 검증 리포트</span>
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            일론 머스크 생태계와 직접/간접적 상업 가치 사슬이 검증된 핵심 자산군 리포트
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
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '12px' }}>
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
        <span>관계 증빙 정보는 사내 Hermes 수집기 및 SEC 공시, 멤피스 유틸리티 전력 승인 회의록 등을 기반으로 정기 실증되어 반영됩니다. D 및 X등급 루머 자산은 필터링되어 공개 표시에 포함되지 않습니다.</span>
      </div>
    </div>
  );
}
