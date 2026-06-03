'use client';

import { useState, useEffect } from 'react';
import { Activity, RefreshCw, Layers } from 'lucide-react';

const INITIAL_HEATMAP_DATA = [
  // 1. 국내 주식 (KRX)
  { name: 'HD현대일렉트릭', ticker: '267260', change: 8.4, sector: '초고압 변압기', price: '284,500원', market: 'KR' },
  { name: '효성중공업', ticker: '298040', change: 4.2, sector: '초고압 변압기', price: '312,000원', market: 'KR' },
  { name: 'LS일렉트릭', ticker: '010120', change: 2.1, sector: '초고압 변압기', price: '198,200원', market: 'KR' },
  { name: 'LS전선', ticker: '006260', change: 5.1, sector: '구리/케이블', price: '124,500원', market: 'KR' },
  { name: '풍산', ticker: '103140', change: 3.5, sector: '구리/케이블', price: '64,200원', market: 'KR' },
  { name: '포스코홀딩스', ticker: '005490', change: 1.2, sector: '철강/GO소재', price: '385,000원', market: 'KR' },
  { name: 'SK하이닉스', ticker: '000660', change: 3.2, sector: 'HBM 패키징', price: '188,500원', market: 'KR' },
  { name: '한미반도체', ticker: '042700', change: 6.8, sector: 'HBM 패키징', price: '148,200원', market: 'KR' },
  { name: '삼성전자', ticker: '005930', change: 0.8, sector: 'HBM 패키징', price: '72,400원', market: 'KR' },

  // 2. 해외 주식 (US)
  { name: 'NVIDIA Corp', ticker: 'NVDA', change: 4.1, sector: 'AI 가속기', price: '$1,150', market: 'US' },
  { name: 'TSMC ADR', ticker: 'TSM', change: 2.5, sector: 'AI 가속기', price: '$152.4', market: 'US' },
  { name: 'Vertiv Holdings', ticker: 'VRT', change: 6.2, sector: '열관리 솔루션', price: '$94.2', market: 'US' },
  { name: 'Modine Mfg', ticker: 'MOD', change: 3.1, sector: '열관리 솔루션', price: '$112.5', market: 'US' },
  { name: 'Eaton Corp plc', ticker: 'ETN', change: 1.8, sector: '배전/전력관리', price: '$312.4', market: 'US' },
  { name: 'Schneider Elec', ticker: 'SU.PA', change: 0.9, sector: '배전/전력관리', price: '215.3€', market: 'US' },
  { name: 'Constellation', ticker: 'CEG', change: 4.8, sector: '원자력/발전', price: '$220.5', market: 'US' },
  { name: 'Vistra Corp', ticker: 'VST', change: 5.3, sector: '원자력/발전', price: '$88.4', market: 'US' },
  { name: 'NextEra Energy', ticker: 'NEE', change: 0.5, sector: '유틸리티/그리드', price: '$72.4', market: 'US' },
  { name: 'Duke Energy', ticker: 'DUK', change: -0.3, sector: '유틸리티/그리드', price: '$101.2', market: 'US' },
  { name: 'Nippon Steel', ticker: '5401.T', change: -0.8, sector: '철강/GO소재', price: '3,250¥', market: 'US' }
];

export default function MarketHeatmap() {
  const [selectedItem, setSelectedItem] = useState(null);
  const [heatmapData, setHeatmapData] = useState(INITIAL_HEATMAP_DATA);
  const [lastUpdated, setLastUpdated] = useState('');

  // 7초마다 실시간 시세 변동 시뮬레이션 적용 (피드백 6번 반영)
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setLastUpdated(now.toLocaleTimeString());
    };
    
    updateTime();

    const interval = setInterval(() => {
      setHeatmapData(prevData => 
        prevData.map(item => {
          // 등락폭 미세 조정 (-0.3% ~ +0.3% 사이 무작위 변동)
          const fluctuation = parseFloat((Math.random() * 0.6 - 0.3).toFixed(2));
          const newChange = parseFloat((item.change + fluctuation).toFixed(2));
          
          // 현재가 문자열 파싱 후 미세 변동 적용
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

  // 한국식 컬러 매핑 함수 (상승: 빨강, 하락: 파랑)
  const getCellColor = (changeVal) => {
    if (changeVal > 0) {
      const intensity = Math.min(Math.round((changeVal / 8) * 10) / 10, 1);
      return `rgba(239, 68, 68, ${0.15 + intensity * 0.75})`;
    } else {
      const intensity = Math.min(Math.round((Math.abs(changeVal) / 2) * 10) / 10, 1);
      return `rgba(59, 130, 246, ${0.15 + intensity * 0.75})`;
    }
  };

  // 시장(KR/US) 및 밸류체인 카테고리별로 데이터 그룹화 처리 (피드백 6번 반영)
  const renderGroupedHeatmap = (marketCode, marketTitle) => {
    const marketItems = heatmapData.filter(item => item.market === marketCode);
    
    // 밸류체인별 그룹 키 추출
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
