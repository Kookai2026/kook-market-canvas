'use client';

import { Star, Activity, ArrowUpRight, AlertTriangle } from 'lucide-react';

export default function InstrumentCard({ instrument, isFavorite, onToggleFavorite }) {
  const { name, ticker, sector, fit, overheat, analysis, price, change, volumeSignal } = instrument;

  // 과열도 등급 색상 추출
  const getOverheatColor = (val) => {
    if (val >= 85) return 'var(--danger)'; // 고위험 추격 (Red)
    if (val >= 70) return '#f97316';       // 과열 경계 (Orange)
    if (val >= 55) return 'var(--warning)';     // 탄력 구간 (Yellow)
    if (val >= 35) return 'var(--success)';     // 정상 (Green)
    return '#3b82f6';                      // 저평가/관찰 (Blue)
  };

  const getOverheatLabel = (val) => {
    if (val >= 85) return '고위험';
    if (val >= 70) return '과열경계';
    if (val >= 55) return '탄력';
    if (val >= 35) return '정상';
    return '저평가';
  };

  const getFitColor = (val) => {
    if (val >= 80) return 'var(--accent-light)';
    if (val >= 60) return '#a7f3d0';
    return 'var(--text-muted)';
  };

  return (
    <div className="instrument-card panel animate-fade-in">
      <div className="card-header">
        <div>
          <div className="title-row">
            <h3 className="inst-name">{name}</h3>
            <span className="inst-ticker">{ticker}</span>
          </div>
          <span className="inst-sector">{sector}</span>
        </div>
        <button 
          className={`fav-btn ${isFavorite ? 'active' : ''}`}
          onClick={() => onToggleFavorite(ticker)}
          aria-label="즐겨찾기 토글"
        >
          <Star size={18} fill={isFavorite ? 'var(--warning)' : 'none'} stroke={isFavorite ? 'var(--warning)' : 'var(--text-secondary)'} />
        </button>
      </div>

      <div className="price-row">
        <span className="inst-price">{price}</span>
        <span className={`inst-change ${change.startsWith('+') ? 'up' : 'down'}`}>
          <ArrowUpRight size={14} style={{ display: 'inline', transform: change.startsWith('+') ? 'none' : 'rotate(90deg)' }} />
          {change}
        </span>
      </div>

      <div className="metrics-grid">
        {/* 적합도 게이지 */}
        <div className="metric-gauge-box">
          <div className="gauge-label">
            <span>투자 적합도</span>
            <span style={{ color: getFitColor(fit), fontWeight: '700' }}>{fit}%</span>
          </div>
          <div className="gauge-track">
            <div className="gauge-bar fit-bar" style={{ width: `${fit}%` }}></div>
          </div>
        </div>

        {/* 과열도 게이지 */}
        <div className="metric-gauge-box">
          <div className="gauge-label">
            <span>시장 과열도 ({getOverheatLabel(overheat)})</span>
            <span style={{ color: getOverheatColor(overheat), fontWeight: '700' }}>{overheat}%</span>
          </div>
          <div className="gauge-track">
            <div 
              className="gauge-bar overheat-bar" 
              style={{ 
                width: `${overheat}%`, 
                backgroundColor: getOverheatColor(overheat),
                boxShadow: `0 0 8px ${getOverheatColor(overheat)}`
              }}
            ></div>
          </div>
        </div>
      </div>

      <div className="card-footer">
        <div className="footer-item">
          <Activity size={12} className="text-accent" style={{ color: 'var(--accent-light)' }} />
          <span>수급: {volumeSignal}</span>
        </div>
        <div className="inst-analysis">
          {overheat >= 80 && <AlertTriangle size={12} style={{ color: 'var(--danger)', verticalAlign: 'middle', marginRight: '4px', display: 'inline' }} />}
          {analysis}
        </div>
      </div>
    </div>
  );
}
