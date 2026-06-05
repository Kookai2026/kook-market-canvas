'use client';

import { useState } from 'react';
import { 
  Star, Activity, ArrowUpRight, AlertTriangle, 
  LineChart, ExternalLink, HelpCircle, Calendar
} from 'lucide-react';

export default function InstrumentCard({ instrument, isFavorite, onToggleFavorite }) {
  const { name, ticker, sector, fit, overheat, analysis, price, change, volumeSignal, asOf } = instrument;
  const [showChart, setShowChart] = useState(false);
  const [showFitInfo, setShowFitInfo] = useState(false);

  // TradingView 심볼 변환기
  const getTradingViewSymbol = (tick) => {
    if (tick.match(/^[0-9]{6}$/)) {
      return `KRX:${tick}`; // 한국 주식
    }
    if (tick === '5401.T') return 'TSE:5401'; // 일본 신일철
    if (tick === '0522.HK') return 'HKEX:0522'; // 홍콩 ASMPT
    if (tick === 'SU.PA') return 'EURONEXT:SU'; // 유럽 슈나이더
    
    // 미국 주식들
    return `NASDAQ:${tick}`;
  };

  // 외부 링크 생성
  const getExternalLinks = (tick) => {
    const isKorean = tick.match(/^[0-9]{6}$/);
    if (isKorean) {
      return [
        { label: '네이버 종토방', url: `https://m.stock.naver.com/domestic/stock/${tick}/discuss` },
        { label: '네이버 공시', url: `https://m.stock.naver.com/domestic/stock/${tick}/disclosure` }
      ];
    } else {
      return [
        { label: '야후 파이낸스', url: `https://finance.yahoo.com/quote/${tick}` },
        { label: 'Stocktwits 토론', url: `https://stocktwits.com/symbol/${tick}` }
      ];
    }
  };

  // 샘플 기술적 시그널 매칭. 실제 운영에서는 수집 파이프라인 결과로 교체한다.
  const getTechnicalSignals = (tick) => {
    // 종목별 보조지표 매칭
    const signals = {
      '267260': ['120일 이평선 지지', '정배열 지속', 'MACD 골든크로스'],
      '042700': ['골든크로스 발생', 'RSI 58 안정', '60일선 돌파'],
      'NVDA': ['5일선 지지 돌파', '과열 주의보', '이격도 상단'],
      '005930': ['RSI 30이하 과매도', '120일선 하향 이탈', '분할 매수 유효'],
      '000660': ['MACD 상향 돌파', '외인/기관 대량 순매수', '정배열 진입'],
      '005490': ['RSI 28 극단적 과매도', '이평선 역배열 반등 준비'],
      'ETN': ['120일선 장기 지지 성공', 'RSI 45 정상'],
      'VRT': ['정배열 상단 돌파', '볼린저밴드 상단 터치'],
      'CEG': ['5일선 우상향 정배열', 'MACD 데드크로스 경계'],
      'DJT': ['RSI 72 과열 진입', '초고변동성 주의', '5일선 이격 발생'],
      'XOM': ['200일선 장기 지지선 반등', '정배열 수렴 완료', '배당 매력도 우수'],
      'LMT': ['120일선 정배열 우상향', 'RSI 52 정상', '기관 매수 유입'],
      'TSLA': ['RSI 65 과열 경계', '볼린저 밴드 상단', '120일선 지지 돌파']
    };
    return signals[tick] || ['RSI 40~55 정상 구간', '이평선 수렴 대기'];
  };

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

  const tvSymbol = getTradingViewSymbol(ticker);
  const links = getExternalLinks(ticker);
  const techSignals = getTechnicalSignals(ticker);
  const dateStr = asOf ? asOf.substring(0, 10) : '2026-06-04';

  return (
    <div className="instrument-card panel animate-fade-in">
      {/* 카드 헤더 */}
      <div className="card-header">
        <div>
          <div className="title-row">
            <h3 className="inst-name">{name}</h3>
            <span className="inst-ticker">{ticker}</span>
          </div>
          <span className="inst-sector">{sector}</span>
        </div>
        <div style={{ display: 'flex', gap: '6px' }}>
          <button 
            className="fav-btn"
            onClick={() => setShowChart(!showChart)}
            title="미니 차트 열기"
            style={{ color: showChart ? 'var(--accent-light)' : 'var(--text-muted)' }}
          >
            <LineChart size={18} />
          </button>
          <button 
            className={`fav-btn ${isFavorite ? 'active' : ''}`}
            onClick={() => onToggleFavorite(ticker)}
            aria-label="즐겨찾기 토글"
          >
            <Star size={18} fill={isFavorite ? 'var(--warning)' : 'none'} stroke={isFavorite ? 'var(--warning)' : 'var(--text-secondary)'} />
          </button>
        </div>
      </div>

      {/* 시세 행 및 작성일자 */}
      <div className="price-row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
          <span className="inst-price">{price}</span>
          <span className={`inst-change ${change.startsWith('+') ? 'up' : 'down'}`}>
            <ArrowUpRight size={14} style={{ display: 'inline', transform: change.startsWith('+') ? 'none' : 'rotate(90deg)' }} />
            {change}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: 'var(--text-muted)' }}>
          <Calendar size={11} />
          <span>업데이트: {dateStr}</span>
        </div>
      </div>

      {/* 투자 적합도 & 시장 과열도 */}
      <div className="metrics-grid">
        {/* 적합도 게이지 */}
        <div className="metric-gauge-box">
          <div className="gauge-label">
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              투자 적합도 
              <HelpCircle 
                size={12} 
                style={{ cursor: 'pointer', color: 'var(--text-muted)' }} 
                onClick={() => setShowFitInfo(!showFitInfo)}
              />
            </span>
            <span style={{ color: getFitColor(fit), fontWeight: '700' }}>{fit}%</span>
          </div>
          <div className="gauge-track">
            <div className="gauge-bar fit-bar" style={{ width: `${fit}%` }}></div>
          </div>
        </div>

        {/* 적합도 기준 안내 팝업 */}
        {showFitInfo && (
          <div style={{ background: 'rgba(0,0,0,0.3)', padding: '10px', borderRadius: '6px', border: '1px solid var(--border)', fontSize: '11px', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
            <strong>[투자 적합도 평가 기준]</strong><br />
            - Quality (30%): 독점력 및 수주 가시성<br />
            - Valuation (25%): 밸류에이션 저평가 매력도<br />
            - Flow (20%): 메이저 세력(외인/기관) 매집량<br />
            - Technical (15%): 이평선 정배열 및 모멘텀<br />
            - Catalyst (10%): 검증된 구조적 촉매 및 공식 관계
          </div>
        )}

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

      {/* 달인들의 보조지표 포착 배지 (피드백 5 반영) */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>
          샘플 기술 신호
        </span>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {techSignals.map((sig, i) => (
            <span 
              key={i} 
              style={{ 
                fontSize: '11px', 
                background: sig.includes('과매도') ? 'rgba(239, 68, 68, 0.15)' : 'rgba(255, 255, 255, 0.04)', 
                color: sig.includes('과매도') ? '#f87171' : 'var(--text-secondary)',
                padding: '2px 8px', 
                borderRadius: '4px',
                border: sig.includes('과매도') ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid var(--border)'
              }}
            >
              {sig}
            </span>
          ))}
        </div>
      </div>

      {/* TradingView 외부 차트 위젯 */}
      {showChart && (
        <div style={{ height: '220px', width: '100%', background: '#12141a', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border)' }}>
          <iframe
            src={`https://s.tradingview.com/widgetembed/?frameElementId=tradingview_chart&symbol=${tvSymbol}&interval=D&hidesidetoolbar=1&symboledit=0&saveimage=1&toolbarbg=12141a&theme=dark&style=1&timezone=Asia/Seoul&locale=ko`}
            style={{ width: '100%', height: '100%', border: 'none' }}
          ></iframe>
        </div>
      )}

      {/* 카드 분석 코멘트 */}
      <div className="card-footer" style={{ gap: '10px' }}>
        <div className="footer-item">
          <Activity size={12} className="text-accent" style={{ color: 'var(--accent-light)' }} />
          <span>샘플 수급 신호: {volumeSignal}</span>
        </div>
        <div className="footer-item" style={{ color: 'var(--warning)' }}>
          <AlertTriangle size={12} />
          <span>가격/점수는 샘플 리서치 데이터입니다.</span>
        </div>
        <div className="inst-analysis">
          {overheat >= 80 && <AlertTriangle size={12} style={{ color: 'var(--danger)', verticalAlign: 'middle', marginRight: '4px', display: 'inline' }} />}
          {analysis}
        </div>

        {/* 외부 종토방/토론방 퀵 링크 (피드백 4 반영) */}
        <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
          {links.map((lnk, idx) => (
            <a 
              key={idx}
              href={lnk.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontSize: '11px',
                color: 'var(--accent-light)',
                background: 'rgba(139, 92, 246, 0.05)',
                border: '1px solid rgba(139, 92, 246, 0.15)',
                padding: '4px 10px',
                borderRadius: '4px',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                transition: 'var(--transition)'
              }}
              className="hover-glow"
            >
              <span>{lnk.label}</span>
              <ExternalLink size={10} />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
