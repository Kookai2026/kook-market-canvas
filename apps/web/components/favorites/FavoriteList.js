'use client';

import { Star, AlertCircle } from 'lucide-react';
import InstrumentCard from '../cards/InstrumentCard';

// 밸류체인 유니버스 내 전체 종목 리스트 (한글명 병기 - 피드백 반영)
const STOCKS_POOL = [
  { name: 'HD현대일렉트릭', ticker: '267260', sector: '초고압 변압기', fit: 92, overheat: 88, price: '284,500원', change: '+8.4%', volumeSignal: '외인 집중 매수', analysis: '북미 수주 숏티지로 영업이익률 20% 상회 지속. 단기 과열 경계 필요.' },
  { name: '효성중공업', ticker: '298040', sector: '초고압 변압기', fit: 86, overheat: 76, price: '312,000원', change: '+4.2%', volumeSignal: '기관 매수세 유입', analysis: '미국 멤피스 공장 증설 가동 본격화로 하반기 외형 성장 기대.' },
  { name: 'LS일렉트릭', ticker: '010120', sector: '배전 및 전력기기', fit: 82, overheat: 74, price: '198,200원', change: '+2.1%', volumeSignal: '개인 매수 우위', analysis: '초고압 시장 진입 가속화 및 초고압 송전망(HVDC) 신규 모멘텀 형성.' },
  { name: '포스코홀딩스', ticker: '005490', sector: '철강/소재', fit: 74, overheat: 42, price: '385,000원', change: '+1.2%', volumeSignal: '기관 순매수 우위', analysis: '전기강판 부문 독점적 지위이나 철강 시황 둔화 영향 혼조.' },
  { name: '일본제철 (Nippon Steel)', ticker: '5401.T', sector: '글로벌 철강', fit: 70, overheat: 48, price: '3,250¥', change: '-0.8%', volumeSignal: '외인 매도세', analysis: '미국 철강 인수 건 노이즈로 밸류에이션 저평가 국면.' },
  { name: '풍산', ticker: '103140', sector: '비철금속', fit: 80, overheat: 68, price: '64,200원', change: '+3.5%', volumeSignal: '거래량 급증', analysis: '구리 가격 상승 및 방산 수출 실적 개선 더블 모멘텀 수혜.' },
  { name: 'LS전선', ticker: '006260', sector: '전선/케이블', fit: 85, overheat: 72, price: '124,500원', change: '+5.1%', volumeSignal: '외인/기관 양매수', analysis: '해저케이블 및 초고압 권선 수요 폭발로 수주 잔고 사상 최대.' },
  { name: '버티브 홀딩스 (Vertiv)', ticker: 'VRT', sector: '열관리 솔루션', fit: 88, overheat: 84, price: '$94.2', change: '+6.2%', volumeSignal: '외인 순매수', analysis: '엔비디아 블랙웰 아키텍처 필수 냉각 공급사. 밸류 고평가 논란 있으나 실적 독점력 우수.' },
  { name: '모다인 매뉴팩처링 (Modine)', ticker: 'MOD', sector: '산업용 냉각', fit: 78, overheat: 69, price: '$112.5', change: '+3.1%', volumeSignal: '기관 유입세', analysis: '차량용 냉각에서 데이터센터 수냉 시스템으로 고성장 사업 재편 성공.' },
  { name: '이튼 코퍼레이션 (Eaton)', ticker: 'ETN', sector: '전력 관리', fit: 84, overheat: 65, price: '$312.4', change: '+1.8%', volumeSignal: '안정적 기관 매집', analysis: '북미 전력 배전 점유율 선두 기업. 데이터센터 입입 프로젝트 증가로 백로그 견조.' },
  { name: '슈나이더 일렉트릭 (Schneider)', ticker: 'SU.PA', sector: '에너지 관리', fit: 80, overheat: 58, price: '215.3€', change: '+0.9%', volumeSignal: '유럽 자금 유입', analysis: '글로벌 탄소 배출 규제 수혜 및 데이터센터 지능형 전력망 솔루션 강점.' },
  { name: '콘스텔레이션 에너지 (Constellation)', ticker: 'CEG', sector: '원자력 발전', fit: 90, overheat: 82, price: '$220.5', change: '+4.8%', volumeSignal: '거래대금 상위', analysis: '마이크로소프트와의 스리마일섬 전력 PPA 계약 체결로 AI 에너지의 신기원 주도.' },
  { name: '비스트라 에너지 (Vistra)', ticker: 'VST', sector: '유틸리티 발전', fit: 87, overheat: 79, price: '$88.4', change: '+5.3%', volumeSignal: '헤지펀드 매집', analysis: '텍사스 독립 전력 시장 지배주주. 전력 단가 급등 수혜 고스란히 흡수.' },
  { name: '한미반도체', ticker: '042700', sector: '반도체 장비', fit: 91, overheat: 78, price: '148,200원', change: '+6.8%', volumeSignal: '기관 순매수 전환', analysis: '듀얼 TC 본더의 압도적 시장 점유율. SK하이닉스향 지속 납품 및 마이크론 신규 진입.' },
  { name: 'ASMPT (홍콩)', ticker: '0522.HK', sector: '글로벌 후공정', fit: 76, overheat: 62, price: '92.4HK$', change: '+1.2%', volumeSignal: '중국계 자금 매수', analysis: 'TSMC CoWoS 공정용 어드밴스드 본더 시장 진입 타진 중.' },
  { name: 'SK하이닉스', ticker: '000660', sector: '반도체 메모리', fit: 89, overheat: 72, price: '188,500원', change: '+3.2%', volumeSignal: '외인/기관 양매수', analysis: '엔비디아 HBM3E 독점적 지배력 유지. 12단 HBM 양산 수율 선두 질주.' },
  { name: '삼성전자', ticker: '005930', sector: '반도체 종합', fit: 75, overheat: 50, price: '72,400원', change: '+0.8%', volumeSignal: '개인 매수 유입', analysis: '엔비디아 HBM3E 승인 지연 노이즈. 하반기 공급 다변화 승인 여부가 핵심 키맨.' },
  { name: '엔비디아 (NVIDIA)', ticker: 'NVDA', sector: 'AI 가속기', fit: 95, overheat: 85, price: '$1,150', change: '+4.1%', volumeSignal: '역대급 거래대금', analysis: '호퍼(H100/H200) 및 차세대 블랙웰(GB200) 칩셋 전 세계 90% 이상 독점. 실적 증가세 지속.' },
  { name: '티에스엠씨 (TSMC)', ticker: 'TSM', sector: '글로벌 파운드리', fit: 92, overheat: 70, price: '$152.4', change: '+2.5%', volumeSignal: 'ADR 외인 매집', analysis: 'CoWoS 후공정 패키징 병목 집중 투자. 단가 인상 주도권 쥐고 고수익성 확보.' },
  { name: '넥스트에라 에너지 (NextEra)', ticker: 'NEE', sector: '미국 유틸리티', fit: 78, overheat: 52, price: '$72.4', change: '+0.5%', volumeSignal: '안정적 배당수급', analysis: '미국 최대 신재생 발전사로 금리 인하 사이클 도래 시 자금 조달 매력 부각.' },
  { name: '듀크 에너지 (Duke)', ticker: 'DUK', sector: '미국 유틸리티', fit: 72, overheat: 46, price: '$101.2', change: '-0.3%', volumeSignal: '평이한 거래량', analysis: '보수적 포트폴리오로 방어적 성격 강함. 전력 수요 증가 연동 완만 성장.' }
];

export default function FavoriteList({ favorites, onToggleFavorite }) {
  // 즐겨찾기 상태인 종목 필터링
  const favoriteStocks = STOCKS_POOL.filter(stock => favorites.includes(stock.ticker));

  return (
    <div className="favorites-container animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--border)', paddingBottom: '10px' }}>
        <Star size={18} fill="var(--warning)" stroke="var(--warning)" />
        <span>내 관심 밸류체인 스냅샷</span>
      </h2>

      {favoriteStocks.length === 0 ? (
        <div 
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px 20px',
            background: 'rgba(255, 255, 255, 0.01)',
            border: '1px dashed var(--border)',
            borderRadius: '12px',
            color: 'var(--text-secondary)',
            gap: '8px',
            textAlign: 'center'
          }}
        >
          <AlertCircle size={24} style={{ color: 'var(--text-muted)' }} />
          <h4 style={{ fontSize: '14px', color: '#fff', fontWeight: '600' }}>등록된 관심 종목이 없습니다</h4>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            밸류체인 캔버스 뷰 또는 Musk Stack 리포트에서 종목 카드의 별표(★)를 눌러 즐겨찾기에 등록해보세요.
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
          {favoriteStocks.map((stock) => (
            <InstrumentCard 
              key={stock.ticker}
              instrument={stock}
              isFavorite={true}
              onToggleFavorite={onToggleFavorite}
            />
          ))}
        </div>
      )}
    </div>
  );
}
export { STOCKS_POOL }; // page.js 등에서도 데이터 풀 재사용 가능하도록 내보내기
