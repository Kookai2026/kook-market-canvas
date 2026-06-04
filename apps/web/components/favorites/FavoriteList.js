'use client';

import { Star, AlertCircle } from 'lucide-react';
import InstrumentCard from '../cards/InstrumentCard';

// 5년 텐버거 유니버스 종목 풀 (실시세 근접 보정 및 양자컴퓨팅/범용 자율주행 추가)
const STOCKS_POOL = [
  // 1. 48V 전력 아키텍처 (E/E Architecture)
  { name: '바이코 (Vicor Corp)', ticker: 'VICR', sector: '48V 전력 아키텍처', fit: 88, overheat: 62, price: '$44.5', change: '+3.5%', volumeSignal: '기관 순매수 전환', analysis: '테슬라 48V 아키텍처 변환의 최대 수혜주. 고밀도 전력 모듈 독점 기술 보유.' },
  { name: '온세미 (onsemi)', ticker: 'ON', sector: '48V 전력 아키텍처', fit: 85, overheat: 58, price: '$74.2', change: '+1.2%', volumeSignal: '외인 매수 우위', analysis: '차량용 전력 반도체(SiC) 강자. 48V 변환에 따른 지능형 파워 모듈 공급 비중 증가.' },

  // 2. 초고압 변압기 / 배전 (실시세 30만원대 보정)
  { name: 'HD현대일렉트릭', ticker: '267260', sector: '초고압 변압기', fit: 92, overheat: 88, price: '335,500원', change: '+8.4%', volumeSignal: '외인 집중 매수', analysis: '북미 수주 숏티지 지속 및 신규 증설 계획 발표로 리레이팅.' },
  { name: '효성중공업', ticker: '298040', sector: '초고압 변압기', fit: 86, overheat: 76, price: '352,000원', change: '+4.2%', volumeSignal: '기관 매수세 유입', analysis: '미국 멤피스 공장 증설 가동 본격화로 하반기 외형 성장 기대.' },
  { name: 'LS일렉트릭', ticker: '010120', sector: '배전 및 전력기기', fit: 82, overheat: 74, price: '218,000원', change: '+2.1%', volumeSignal: '개인 매수 우위', analysis: '초고압 송전망(HVDC) 및 전력기기 수요 연동 고성장.' },
  { name: '이튼 코퍼레이션 (Eaton)', ticker: 'ETN', sector: '배전 및 전력기기', fit: 84, overheat: 65, price: '$324.5', change: '+1.8%', volumeSignal: '안정적 기관 매집', analysis: '북미 전력 배전 점유율 선두 기업. 데이터센터 입입 프로젝트 증가로 백로그 견조.' },

  // 3. 구리 및 소재 (실시세 보정)
  { name: '포스코홀딩스', ticker: '005490', sector: '철강/GO소재', fit: 74, overheat: 42, price: '374,000원', change: '+1.2%', volumeSignal: '기관 순매수 우위', analysis: '전기강판 부문 독점적 지위이나 철강 시황 둔화 영향 혼조.' },
  { name: '일본제철 (Nippon Steel)', ticker: '5401.T', sector: '철강/GO소재', fit: 70, overheat: 48, price: '3,120¥', change: '-0.8%', volumeSignal: '외인 매도세', analysis: '미국 철강 인수 건 노이즈로 밸류에이션 저평가 국면.' },
  { name: '풍산', ticker: '103140', sector: '구리/케이블', fit: 80, overheat: 68, price: '68,200원', change: '+3.5%', volumeSignal: '거래량 급증', analysis: '구리 가격 상승 및 방산 수출 실적 개선 더블 모멘텀 수혜.' },
  { name: 'LS전선', ticker: '006260', sector: '구리/케이블', fit: 85, overheat: 72, price: '128,500원', change: '+5.1%', volumeSignal: '외인/기관 양매수', analysis: '해저케이블 및 초고압 권선 수요 폭발로 수주 잔고 사상 최대.' },

  // 4. 냉각 솔루션
  { name: '버티브 홀딩스 (Vertiv)', ticker: 'VRT', sector: '액체 냉각 솔루션', fit: 88, overheat: 84, price: '$98.4', change: '+6.2%', volumeSignal: '외인 순매수', analysis: '엔비디아 블랙웰 아키텍처 필수 냉각 공급사. 밸류 고평가 논란 있으나 실적 독점력 우수.' },
  { name: '모다인 매뉴팩처링 (Modine)', ticker: 'MOD', sector: '액체 냉각 솔루션', fit: 78, overheat: 69, price: '$118.5', change: '+3.1%', volumeSignal: '기관 유입세', analysis: '차량용 냉각에서 데이터센터 수냉 시스템으로 고성장 사업 재편 성공.' },

  // 5. 원자력 및 SMR
  { name: '콘스텔레이션 에너지 (CEG)', ticker: 'CEG', sector: 'SMR & 원자력 발전', fit: 90, overheat: 82, price: '$225.5', change: '+4.8%', volumeSignal: '거래대금 상위', analysis: '마이크로소프트와의 스리마일섬 전력 PPA 계약 체결로 AI 에너지의 신기원 주도.' },
  { name: '비스트라 에너지 (Vistra)', ticker: 'VST', sector: 'SMR & 원자력 발전', fit: 87, overheat: 79, price: '$90.4', change: '+5.3%', volumeSignal: '헤지펀드 매집', analysis: '텍사스 독립 전력 시장 지배주주. 전력 단가 급등 수혜 고스란히 흡수.' },
  { name: '뉴스케일 파워 (NuScale)', ticker: 'SMR', sector: 'SMR & 원자력 발전', fit: 76, overheat: 65, price: '$12.4', change: '+1.5%', volumeSignal: '개인 관심 급증', analysis: '미국 내 최초 SMR 설계 승인 보유 기업으로 모멘텀 변동성 큼.' },

  // 6. HBM 및 반도체 장비 / 유리기판 (실시세 하이닉스 20만원선 보정)
  { name: '한미반도체', ticker: '042700', sector: 'HBM 패키징', fit: 91, overheat: 78, price: '162,000원', change: '+6.8%', volumeSignal: '기관 순매수 전환', analysis: '듀얼 TC 본더의 압도적 시장 점유율. SK하이닉스향 지속 납품 및 마이크론 신규 진입.' },
  { name: 'ASMPT (홍콩)', ticker: '0522.HK', sector: 'HBM 패키징', fit: 76, overheat: 62, price: '94.2HK$', change: '+1.2%', volumeSignal: '중국계 자금 매수', analysis: 'TSMC CoWoS 공정용 어드밴스드 본더 시장 진입 타진 중.' },
  { name: 'SK하이닉스', ticker: '000660', sector: 'HBM 패키징', fit: 89, overheat: 72, price: '203,500원', change: '+3.2%', volumeSignal: '외인/기관 양매수', analysis: '엔비디아 HBM3E 독점적 지배력 유지. 12단 HBM 양산 수율 선두 질주.' },
  { name: '삼성전자', ticker: '005930', sector: 'HBM 패키징', fit: 75, overheat: 50, price: '77,400원', change: '+0.8%', volumeSignal: '개인 매수 유입', analysis: '엔비디아 HBM3E 승인 지연 노이즈. 하반기 공급 다변화 승인 여부가 핵심 키맨.' },
  { name: 'SKC', ticker: '011790', sector: '차세대 유리 기판', fit: 82, overheat: 69, price: '142,500원', change: '+4.5%', volumeSignal: '기관 매집세', analysis: '앱솔릭스 유리기판 미국 양산 개시 임박에 따른 선제적 기대감 유입.' },
  { name: '삼성전기', ticker: '009150', sector: '차세대 유리 기판', fit: 76, overheat: 58, price: '158,000원', change: '+1.3%', volumeSignal: '외인 매수 유입', analysis: '2026년 유리기판 조기 양산 로드맵 발표 및 MLCC 견고세 유지.' },

  // 7. AI 가속기 GPU (실시세 $121.2 보정)
  { name: '엔비디아 (NVIDIA)', ticker: 'NVDA', sector: 'AI 가속기 GPU', fit: 95, overheat: 85, price: '$121.2', change: '+4.1%', volumeSignal: '역대급 거래대금', analysis: '10:1 액면분할 후 주가 $120선 안착. 호퍼 및 차세대 블랙웰 칩셋 전 세계 90% 이상 점유.' },
  { name: '티에스엠씨 (TSMC)', ticker: 'TSM', sector: 'AI 가속기 GPU', fit: 92, overheat: 70, price: '$154.2', change: '+2.5%', volumeSignal: 'ADR 외인 매집', analysis: 'CoWoS 후공정 패키징 병목 집중 투자. 단가 인상 주도권 쥐고 고수익성 확보.' },

  // 8. 양자 컴퓨팅 (Quantum Computing - 신규)
  { name: '아이온큐 (IonQ)', ticker: 'IONQ', sector: '양자 컴퓨팅', fit: 82, overheat: 60, price: '$9.8', change: '+5.4%', volumeSignal: '개인 수급 급증', analysis: '이온트랩(Ion trap) 방식 독보적 하드웨어 리더. 에러 보정 및 상업용 양자 칩셋 가치.' },
  { name: '리지티 (Rigetti)', ticker: 'RGTI', sector: '양자 컴퓨팅', fit: 70, overheat: 54, price: '$1.45', change: '+2.1%', volumeSignal: '변동성 확대', analysis: '초전도 큐비트 설계 및 하이브리드 양자/클래식 컴퓨팅 가속 부각.' },
  { name: '디웨이브 시스템즈 (D-Wave)', ticker: 'QBTS', sector: '양자 컴퓨팅', fit: 74, overheat: 58, price: '$1.82', change: '+3.5%', volumeSignal: '개인 매입', analysis: '양자 어닐링(Annealing) 상용 서비스 제공사. 최적화 문제 특화 솔루션.' },
  { name: '아이비엠 (IBM)', ticker: 'IBM', sector: '양자 컴퓨팅', fit: 86, overheat: 62, price: '$172.5', change: '+1.1%', volumeSignal: '안정적 연기금', analysis: '1000큐비트급 양자 시스템 로드맵 실행. 하이브리드 클라우드 양자 서비스 통합.' },

  // 9. 미래 로봇 & 자동화 (Industrial & Service Robotics)
  { name: '두산로보틱스', ticker: '454910', sector: '로봇 & 자동화', fit: 85, overheat: 68, price: '82,400원', change: '+2.5%', volumeSignal: '기관 순매수', analysis: '글로벌 협동 로봇 라인업 경쟁력. 스마트 팩토리 대기업향 협력 공급망 확보.' },
  { name: '레인보우로보틱스', ticker: '277810', sector: '로봇 & 자동화', fit: 86, overheat: 64, price: '168,500원', change: '+2.8%', volumeSignal: '기관 순매수 전환', analysis: '삼성전자 지분 투자 및 콜옵션 보유. 휴머노이드 연구개발 협력 고성장 수혜.' },
  { name: '에스비비테크', ticker: '389500', sector: '로봇 & 자동화', fit: 78, overheat: 58, price: '28,200원', change: '+1.5%', volumeSignal: '개인 매수 유입', analysis: '로봇 관절에 들어가는 핵심 하모닉 감속기 국산화 독보적 지위.' },

  // 10. Bio-AI & 합성생물학
  { name: '슈뢰딩거 (Schrodinger)', ticker: 'SDGR', sector: 'Bio-AI & 합성생물학', fit: 83, overheat: 54, price: '$22.5', change: '+0.8%', volumeSignal: '외인 매집', analysis: '물리학 기반 AI 신약 플랫폼 최선두 주자. 글로벌 빅파마와의 라이선스 로열티 유입 증가.' },

  // 11. 우주 인터넷 & 위성 통신 (Space & Satellite)
  { name: '인텔리안테크', ticker: '189300', sector: '위성 통신', fit: 82, overheat: 60, price: '58,400원', change: '+2.1%', volumeSignal: '기관 순매집', analysis: '저궤도 위성용 평판 안테나 글로벌 선두 공급망. 원웹 및 위성망 조달 가시화.' },
  { name: '스페이스X (SpaceX 비상장)', ticker: 'SPACE.X', sector: '위성 통신', fit: 80, overheat: 50, price: '비상장', change: '0.0%', volumeSignal: '사외 거래 활발', analysis: '스타링크 흑자 기조 유지 및 저궤도 위성 시장 발사 압도적 원가 독점력.' },

  // 12. 범용 자율주행 (Autonomous ADAS)
  { name: '모빌아이 (Mobileye)', ticker: 'MBLY', sector: '자율주행 ADAS', fit: 78, overheat: 52, price: '$24.5', change: '+1.0%', volumeSignal: '기관 매입세', analysis: '카메라 기반 ADAS 칩셋의 압도적 시장 점유율. 차세대 슈퍼비전 플랫폼 적용 확대.' },
  { name: '현대모비스', ticker: '012330', sector: '자율주행 ADAS', fit: 80, overheat: 56, price: '232,500원', change: '+1.2%', volumeSignal: '개인 매수', analysis: '자율주행 핵심 전장 모듈 국산화 및 현대차 그룹 자율주행 완성 수혜.' },

  // 13. 머스크 유니버스용 (독립 테마)
  { name: '테슬라 (Tesla)', ticker: 'TSLA', sector: '머스크 유니버스', fit: 90, overheat: 58, price: '$176.5', change: '+3.2%', volumeSignal: '기관 매수 우위', analysis: '에너지 부문 메가팩 고성장 기조 안착 및 FSD V12 상업화 퀄테스트 모멘텀.' }
];

export default function FavoriteList({ favorites, onToggleFavorite }) {
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
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
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
export { STOCKS_POOL };
