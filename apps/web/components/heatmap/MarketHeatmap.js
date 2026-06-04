'use client';

import { useState, useEffect } from 'react';
import { Activity, RefreshCw, Layers } from 'lucide-react';

const INITIAL_HEATMAP_DATA = [
  // 1. 국내 주식 (KRX)
  { name: 'HD현대일렉트릭', ticker: '267260', change: 8.4, sector: '초고압 변압기', price: '335,500원', market: 'KR' },
  { name: '효성중공업', ticker: '298040', change: 4.2, sector: '초고압 변압기', price: '352,000원', market: 'KR' },
  { name: 'LS일렉트릭', ticker: '010120', change: 2.1, sector: '초고압 변압기', price: '218,000원', market: 'KR' },
  { name: 'LS전선', ticker: '006260', change: 5.1, sector: '구리/케이블', price: '128,500원', market: 'KR' },
  { name: '풍산', ticker: '103140', change: 3.5, sector: '구리/케이블', price: '68,200원', market: 'KR' },
  { name: '포스코홀딩스', ticker: '005490', change: 1.2, sector: '철강/GO소재', price: '374,000원', market: 'KR' },
  { name: 'SK하이닉스', ticker: '000660', change: 3.2, sector: 'HBM 패키징', price: '203,500원', market: 'KR' },
  { name: '한미반도체', ticker: '042700', change: 6.8, sector: 'HBM 패키징', price: '162,000원', market: 'KR' },
  { name: '삼성전자', ticker: '005930', change: 0.8, sector: 'HBM 패키징', price: '77,400원', market: 'KR' },
  { name: 'SKC', ticker: '011790', sector: '차세대 유리 기판', change: 4.5, price: '142,500원', market: 'KR' },
  { name: '삼성전기', ticker: '009150', sector: '차세대 유리 기판', change: 1.3, price: '158,000원', market: 'KR' },
  { name: '서진시스템', ticker: '178320', sector: 'ESS & 스타링크', change: 5.3, price: '29,450원', market: 'KR' },
  { name: '두산로보틱스', ticker: '454910', sector: '로봇 & 자동화', change: 2.5, price: '82,400원', market: 'KR' },
  { name: '레인보우로보틱스', ticker: '277810', sector: '로봇 & 자동화', change: 2.8, price: '168,500원', market: 'KR' },
  { name: '에스비비테크', ticker: '389500', sector: '로봇 & 자동화', change: 1.5, price: '28,200원', market: 'KR' },
  { name: '인텔리안테크', ticker: '189300', sector: '위성 통신', change: 2.1, price: '58,400원', market: 'KR' },
  { name: '현대모비스', ticker: '012330', sector: '자율주행 ADAS', change: 1.2, price: '232,500원', market: 'KR' },

  // 2. 해외 주식 (US)
  { name: '바이코 (Vicor)', ticker: 'VICR', change: 3.5, sector: '48V 전력 아키텍처', price: '$44.5', market: 'US' },
  { name: '온세미 (onsemi)', ticker: 'ON', change: 1.2, sector: '48V 전력 아키텍처', price: '$74.2', market: 'US' },
  { name: '엔비디아 (NVIDIA)', ticker: 'NVDA', change: 4.1, sector: 'AI 가속기 GPU', price: '$121.2', market: 'US' },
  { name: '티에스엠씨 (TSMC)', ticker: 'TSM', change: 2.5, sector: 'AI 가속기 GPU', price: '$154.2', market: 'US' },
  { name: '버티브 홀딩스 (Vertiv)', ticker: 'VRT', change: 6.2, sector: '열관리 솔루션', price: '$98.4', market: 'US' },
  { name: '모다인 매뉴팩처링 (Modine)', ticker: 'MOD', change: 3.1, sector: '열관리 솔루션', price: '$118.5', market: 'US' },
  { name: '이튼 코퍼레이션 (Eaton)', ticker: 'ETN', change: 1.8, sector: '배전 및 전력관리', price: '$324.5', market: 'US' },
  { name: '슈나이더 일렉트릭 (Schneider)', ticker: 'SU.PA', change: 0.9, sector: '배전 및 전력관리', price: '215.3€', market: 'US' },
  { name: '콘스텔레이션 에너지 (CEG)', ticker: 'CEG', change: 4.8, sector: 'SMR & 원자력 발전', price: '$225.5', market: 'US' },
  { name: '비스트라 에너지 (Vistra)', ticker: 'VST', change: 5.3, sector: 'SMR & 원자력 발전', price: '$90.4', market: 'US' },
  { name: '뉴스케일 파워 (NuScale)', ticker: 'SMR', change: 1.5, sector: 'SMR & 원자력 발전', price: '$12.4', market: 'US' },
  { name: '넥스트에라 에너지 (NextEra)', ticker: 'NEE', change: 0.5, sector: '유틸리티/그리드', price: '$72.4', market: 'US' },
  { name: '듀크 에너지 (Duke)', ticker: 'DUK', change: -0.3, sector: '유틸리티/그리드', price: '$101.2', market: 'US' },
  { name: '일본제철 (Nippon Steel)', ticker: '5401.T', change: -0.8, sector: '철강/GO소재', price: '3,120¥', market: 'US' },
  { name: '퀄컴 (Qualcomm)', ticker: 'QCOM', change: 2.2, sector: '온디바이스 AI', price: '$202.4', market: 'US' },
  { name: '슈뢰딩거 (Schrodinger)', ticker: 'SDGR', change: 0.8, sector: 'Bio-AI & 합성생물학', price: '$22.5', market: 'US' },
  { name: '아이온큐 (IonQ)', ticker: 'IONQ', change: 5.4, sector: '양자 컴퓨팅', price: '$9.8', market: 'US' },
  { name: '리지티 (Rigetti)', ticker: 'RGTI', change: 2.1, sector: '양자 컴퓨팅', price: '$1.45', market: 'US' },
  { name: '디웨이브 시스템즈 (D-Wave)', ticker: 'QBTS', change: 3.5, sector: '양자 컴퓨팅', price: '$1.82', market: 'US' },
  { name: '아이비엠 (IBM)', ticker: 'IBM', change: 1.1, sector: '양자 컴퓨팅', price: '$172.5', market: 'US' },
  { name: '모빌아이 (Mobileye)', ticker: 'MBLY', change: 1.0, sector: '자율주행 ADAS', price: '$24.5', market: 'US' },
  { name: '테슬라 (Tesla)', ticker: 'TSLA', change: 3.2, sector: '머스크 유니버스', price: '$176.5', market: 'US' }
];

export default function MarketHeatmap() {
  const [selectedItem, setSelectedItem] = useState(null);
  const [heatmapData, setHeatmapData] = useState(INITIAL_HEATMAP_DATA);
  const [lastUpdated, setLastUpdated] = useState('');

  // 7초마다 실시간 시세 변동 시뮬레이션 적용
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setLastUpdated(now.toLocaleTimeString());
    };
    
    updateTime();

    const interval = setInterval(() => {
      setHeatmapData(prevData => 
        prevData.map(item => {
          const fluctuation = parseFloat((Math.random() * 0.6 - 0.3).toFixed(2));
          const newChange = parseFloat((item.change + fluctuation).toFixed(2));
          
          let newPrice = item.price;
          const numVal = parseFloat(item.price.replace(/[^\d.]/g, ''));
          if (!isNaN(numVal)) {
            const isKR = item.price.includes('원');
            const isUSD = item.price.startsWith('$');
            const isEUR = item.price.includes('€');
            const isYEN = item.price.includes('¥');

            const priceFluc = numVal * (1 + fluctuation / 100);
            if (isKR) newPrice = `${Math.round(priceFluc).toLocaleString()}원`;
            else if (isUSD) newPrice = `$${priceFluc.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}`;
            else if (isEUR) newPrice = `${priceFluc.toFixed(1)}€`;
            else if (isYEN) newPrice = `${Math.round(priceFluc).toLocaleString()}¥`;
          }

          return {
            ...item,
            change: newChange,
            price: newPrice
          };
        })
      );
      updateTime();
    }, 7000);

    return () => clearInterval(interval);
  }, []);

  const getCellColor = (changeVal) => {
    if (changeVal > 0) {
      const intensity = Math.min(Math.round((changeVal / 8) * 10) / 10, 1);
      return `rgba(239, 68, 68, ${0.15 + intensity * 0.75})`;
    } else {
      const intensity = Math.min(Math.round((Math.abs(changeVal) / 2) * 10) / 10, 1);
      return `rgba(59, 130, 246, ${0.15 + intensity * 0.75})`;
    }
  };

  const renderGroupedHeatmap = (marketCode, marketTitle) => {
    const marketItems = heatmapData.filter(item => item.market === marketCode);
    const sectors = Array.from(new Set(marketItems.map(item => item.sector)));

    return (
      <div key={marketCode} style={{ marginBottom: '24px' }}>
        <h3 style={{ fontSize: '15px', color: '#fff', borderLeft: '3px solid var(--accent)', paddingLeft: '8px', marginBottom: '16px', fontWeight: '700' }}>
          {marketTitle}
        </h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {sectors.map(sector => {
            const sectorItems = marketItems.filter(item => item.sector === sector);
            return (
              <div key={sector} style={{ background: 'rgba(255,255,255,0.01)', padding: '14px', borderRadius: '8px', border: '1px solid var(--border)' }}>
                <h4 style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '4px', textTransform: 'uppercase', fontWeight: '700' }}>
                  <Layers size={11} />
                  {sector} 밸류체인
                </h4>
                
                <div className="heatmap-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))' }}>
                  {sectorItems.map((item, idx) => {
                    const cellColor = getCellColor(item.change);
                    const isSelected = selectedItem?.ticker === item.ticker;
                    return (
                      <div
                        key={idx}
                        className="heatmap-cell"
                        style={{
                          backgroundColor: cellColor,
                          border: isSelected ? '2px solid #ffffff' : '1px solid rgba(255,255,255,0.04)',
                          boxShadow: isSelected ? '0 0 15px rgba(255,255,255,0.3)' : 'none',
                          minHeight: '75px'
                        }}
                        onClick={() => setSelectedItem(item)}
                      >
                        <div>
                          <span style={{ fontSize: '9px', color: 'rgba(255,255,255,0.6)', fontFamily: 'monospace' }}>{item.ticker}</span>
                          <div className="heatmap-name" style={{ fontSize: '12px', fontWeight: '600' }}>{item.name}</div>
                        </div>
                        <div className="heatmap-change" style={{ fontSize: '13px' }}>
                          {item.change > 0 ? `+${item.change}%` : `${item.change}%`}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="heatmap-wrapper animate-fade-in">
      <div className="canvas-header" style={{ marginBottom: '16px' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Activity size={20} className="text-accent" style={{ color: 'var(--accent-light)' }} />
            <span>KMC 실시간 마켓 히트맵 (그룹화)</span>
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            국가별 대분류 및 내부 밸류체인 테마별 그룹 매핑 (7초 단위 시세 연동)
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-secondary)', background: 'rgba(255,255,255,0.03)', padding: '6px 12px', borderRadius: '20px', border: '1px solid var(--border)' }}>
            <RefreshCw size={12} className="text-accent" style={{ animation: 'spin 4s linear infinite', color: 'var(--accent-light)' }} />
            <span>실시간 갱신: {lastUpdated}</span>
          </div>
        </div>
      </div>

      {/* 대분류(국내/해외) 및 중분류(밸류체인) 히트맵 렌더링 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {renderGroupedHeatmap('KR', '🇰🇷 대한민국 코스피 / 코스닥')}
        {renderGroupedHeatmap('US', '🇺🇸 미국 나스닥 / 뉴욕증시 (ADR 포함)')}
      </div>

      {/* 선택 셀 상세 정보 패널 */}
      {selectedItem && (
        <div 
          className="panel animate-fade-in"
          style={{
            marginTop: '16px',
            borderLeft: `4px solid ${selectedItem.change > 0 ? 'var(--danger)' : 'var(--accent)'}`,
            background: 'rgba(255, 255, 255, 0.02)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <h4 style={{ fontSize: '14px', color: '#fff', fontWeight: '600' }}>
              선택 종목 퀵 리뷰
            </h4>
            <button 
              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '12px' }}
              onClick={() => setSelectedItem(null)}
            >
              [ 닫기 × ]
            </button>
          </div>
          <div style={{ display: 'flex', gap: '24px', alignItems: 'baseline', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '18px', fontWeight: '700', color: '#fff' }}>{selectedItem.name} ({selectedItem.ticker})</span>
            <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>밸류체인: {selectedItem.sector}</span>
            <span style={{ fontSize: '20px', fontWeight: '700', color: '#fff' }}>실시간가: {selectedItem.price}</span>
            <span style={{ fontSize: '16px', fontWeight: '700', color: selectedItem.change > 0 ? 'var(--danger)' : '#60a5fa' }}>
              변동률: {selectedItem.change > 0 ? `+${selectedItem.change}%` : `${selectedItem.change}%`}
            </span>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
