'use client';

import { useState } from 'react';
import { Activity, RefreshCw } from 'lucide-react';

const HEATMAP_DATA = [
  { name: 'HD현대일렉트릭', ticker: '267260', change: +8.4, sector: '초고압 변압기', price: '284,500원' },
  { name: '한미반도체', ticker: '042700', change: +6.8, sector: '반도체 장비', price: '148,200원' },
  { name: 'Vertiv Holdings', ticker: 'VRT', change: +6.2, sector: '열관리 솔루션', price: '$94.2' },
  { name: 'Vistra Corp', ticker: 'VST', change: +5.3, sector: '유틸리티 발전', price: '$88.4' },
  { name: 'LS전선', ticker: '006260', change: +5.1, sector: '전선/케이블', price: '124,500원' },
  { name: 'Constellation Energy', ticker: 'CEG', change: +4.8, sector: '원자력 발전', price: '$220.5' },
  { name: 'NVIDIA Corp', ticker: 'NVDA', change: +4.1, sector: 'AI 가속기', price: '$1,150' },
  { name: '풍산', ticker: '103140', change: +3.5, sector: '비철금속', price: '64,200원' },
  { name: 'SK하이닉스', ticker: '000660', change: +3.2, sector: '반도체 메모리', price: '188,500원' },
  { name: 'Modine Mfg', ticker: 'MOD', change: +3.1, sector: '산업용 냉각', price: '$112.5' },
  { name: 'TSMC', ticker: 'TSM', change: +2.5, sector: '글로벌 파운드리', price: '$152.4' },
  { name: 'LS일렉트릭', ticker: '010120', change: +2.1, sector: '전력기기', price: '198,200원' },
  { name: 'Eaton Corp', ticker: 'ETN', change: +1.8, sector: '전력 관리', price: '$312.4' },
  { name: '포스코홀딩스', ticker: '005490', change: +1.2, sector: '철강/소재', price: '385,000원' },
  { name: '삼성전자', ticker: '005930', change: +0.8, sector: '반도체 종합', price: '72,400원' },
  { name: 'NextEra Energy', ticker: 'NEE', change: +0.5, sector: '미국 유틸리티', price: '$72.4' },
  { name: 'Duke Energy', ticker: 'DUK', change: -0.3, sector: '미국 유틸리티', price: '$101.2' },
  { name: 'Nippon Steel', ticker: '5401.T', change: -0.8, sector: '글로벌 철강', price: '3,250¥' }
];

export default function MarketHeatmap() {
  const [selectedItem, setSelectedItem] = useState(null);
  const [marketFilter, setMarketFilter] = useState('ALL'); // ALL, KR, US

  const filteredData = HEATMAP_DATA.filter(item => {
    const isUS = item.ticker.match(/^[A-Z]{2,4}$/); // Ticker 영어 대문자 2~4글자면 미국주식으로 간주
    if (marketFilter === 'KR') return !isUS;
    if (marketFilter === 'US') return isUS;
    return true;
  });

  // 한국식 컬러 매핑 함수 (상승: 빨강, 하락: 파랑)
  const getCellColor = (changeVal) => {
    if (changeVal > 0) {
      // 상승 폭에 따라 빨간색 농도 조절 (최대 +8% 기준)
      const intensity = Math.min(Math.round((changeVal / 8) * 10) / 10, 1);
      return `rgba(239, 68, 68, ${0.15 + intensity * 0.75})`; // Red alpha
    } else {
      // 하락 폭에 따라 파란색 농도 조절
      const intensity = Math.min(Math.round((Math.abs(changeVal) / 2) * 10) / 10, 1);
      return `rgba(59, 130, 246, ${0.15 + intensity * 0.75})`; // Blue alpha
    }
  };

  const handleCellClick = (item) => {
    setSelectedItem(item);
  };

  return (
    <div className="heatmap-wrapper animate-fade-in">
      <div className="canvas-header" style={{ marginBottom: '16px' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Activity size={20} className="text-accent" style={{ color: 'var(--accent-light)' }} />
            <span>KMC 실시간 마켓 히트맵</span>
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            밸류체인 유니버스 핵심 종목들의 등락 현황 시각화 (한국식 빨강/파랑 테마)
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <div className="canvas-selector">
            {['ALL', 'KR', 'US'].map((market) => (
              <button
                key={market}
                className={`canvas-sel-btn ${marketFilter === market ? 'active' : ''}`}
                onClick={() => {
                  setMarketFilter(market);
                  setSelectedItem(null);
                }}
              >
                {market === 'ALL' ? '전체' : market === 'KR' ? '국내 주식' : '미국 주식'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 히트맵 그리드 */}
      <div className="heatmap-grid">
        {filteredData.map((item, idx) => {
          const cellColor = getCellColor(item.change);
          const isSelected = selectedItem?.ticker === item.ticker;
          return (
            <div
              key={idx}
              className="heatmap-cell"
              style={{
                backgroundColor: cellColor,
                border: isSelected ? '2px solid #ffffff' : '1px solid rgba(255,255,255,0.05)',
                boxShadow: isSelected ? '0 0 15px rgba(255,255,255,0.3)' : 'none'
              }}
              onClick={() => handleCellClick(item)}
            >
              <div>
                <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.6)', fontFamily: 'monospace' }}>{item.ticker}</span>
                <div className="heatmap-name">{item.name}</div>
              </div>
              <div className="heatmap-change">
                {item.change > 0 ? `+${item.change}%` : `${item.change}%`}
              </div>
            </div>
          );
        })}
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
            <h4 style={{ fontSize: '15px', color: '#fff', fontWeight: '600' }}>
              선택 종목 간편 시세
            </h4>
            <button 
              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '12px' }}
              onClick={() => setSelectedItem(null)}
            >
              [ 닫기 × ]
            </button>
          </div>
          <div style={{ display: 'flex', gap: '20px', alignItems: 'baseline', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '18px', fontWeight: '700', color: '#fff' }}>{selectedItem.name} ({selectedItem.ticker})</span>
            <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>섹터: {selectedItem.sector}</span>
            <span style={{ fontSize: '20px', fontWeight: '700', color: '#fff' }}>현재가: {selectedItem.price}</span>
            <span style={{ fontSize: '16px', fontWeight: '700', color: selectedItem.change > 0 ? 'var(--danger)' : '#60a5fa' }}>
              전일대비 {selectedItem.change > 0 ? `+${selectedItem.change}%` : `${selectedItem.change}%`}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
