'use client';

import { useState, useEffect } from 'react';
import { Lock, Unlock, TrendingUp, Plus, Trash2, Calendar, DollarSign, Percent } from 'lucide-react';
import { STOCKS_POOL } from './FavoriteList';

export default function TaehaPortfolio() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  
  // 포트폴리오 목록 상태
  const [holdings, setHoldings] = useState([
    { id: 1, name: 'HD현대일렉트릭', ticker: '267260', buyDate: '2026-04-15', avgPrice: 210000, quantity: 50 },
    { name: '엔비디아 (NVIDIA)', ticker: 'NVDA', buyDate: '2026-05-10', avgPrice: 95, quantity: 20 }
  ]);

  // 신규 등록 폼 상태
  const [formName, setFormName] = useState('HD현대일렉트릭');
  const [formTicker, setFormTicker] = useState('267260');
  const [formDate, setFormDate] = useState('2026-06-04');
  const [formPrice, setFormPrice] = useState('');
  const [formQty, setFormQty] = useState('');

  // 비밀번호 검증 (0225로 변경 - 피드백 반영)
  const handleLogin = (e) => {
    e.preventDefault();
    if (password === '0225') {
      setIsAuthenticated(true);
      setErrorMsg('');
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('portfolio_auth', 'true');
      }
    } else {
      setErrorMsg('비밀번호가 올바르지 않습니다. (힌트: 사령관님 부부만의 기념일 암호 4자리)');
    }
  };

  // 세션 복원 및 로컬스토리지에서 자산 정보 복원
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const auth = sessionStorage.getItem('portfolio_auth');
      if (auth === 'true') {
        setIsAuthenticated(true);
      }
      
      const savedHoldings = localStorage.getItem('taeha_portfolio');
      if (savedHoldings) {
        try {
          setHoldings(JSON.parse(savedHoldings));
        } catch (e) {
          console.error(e);
        }
      }
    }
  }, []);

  const saveHoldings = (newHoldings) => {
    setHoldings(newHoldings);
    localStorage.setItem('taeha_portfolio', JSON.stringify(newHoldings));
  };

  // 종목 풀에서 현재가 가져오기
  const getCurrentPriceNum = (ticker) => {
    const stock = STOCKS_POOL.find(s => s.ticker === ticker);
    if (!stock) return 0;
    
    // '284,500원' -> 284500, '$1,150' -> 1150
    const cleanStr = stock.price.replace(/[^\d.]/g, '');
    return parseFloat(cleanStr);
  };

  const isUSD = (ticker) => {
    return ticker.match(/^[A-Z]{2,4}$/) !== null;
  };

  // 신규 종목 추가
  const handleAddHolding = (e) => {
    e.preventDefault();
    if (!formPrice || !formQty) return alert('평단가와 수량을 입력하세요.');

    const targetStock = STOCKS_POOL.find(s => s.ticker === formTicker);
    const name = targetStock ? targetStock.name : formName;

    const newHolding = {
      id: Date.now(),
      name,
      ticker: formTicker,
      buyDate: formDate,
      avgPrice: parseFloat(formPrice),
      quantity: parseFloat(formQty)
    };

    const updated = [...holdings, newHolding];
    saveHoldings(updated);
    
    // 폼 클리어
    setFormPrice('');
    setFormQty('');
  };

  // 종목 삭제
  const handleDeleteHolding = (id) => {
    if (confirm('정말 삭제하시겠습니까?')) {
      const updated = holdings.filter(h => h.id !== id);
      saveHoldings(updated);
    }
  };

  // 자산 계산용 통계 계산
  let totalBuyKRW = 0;
  let totalEvalKRW = 0;
  let totalBuyUSD = 0;
  let totalEvalUSD = 0;

  holdings.forEach(h => {
    const currentPrice = getCurrentPriceNum(h.ticker);
    const buyVal = h.avgPrice * h.quantity;
    const evalVal = currentPrice * h.quantity;
    
    if (isUSD(h.ticker)) {
      totalBuyUSD += buyVal;
      totalEvalUSD += evalVal;
    } else {
      totalBuyKRW += buyVal;
      totalEvalKRW += evalVal;
    }
  });

  const krwProfit = totalEvalKRW - totalBuyKRW;
  const krwProfitRate = totalBuyKRW > 0 ? (krwProfit / totalBuyKRW) * 100 : 0;
  
  const usdProfit = totalEvalUSD - totalBuyUSD;
  const usdProfitRate = totalBuyUSD > 0 ? (usdProfit / totalBuyUSD) * 100 : 0;

  if (!isAuthenticated) {
    return (
      <div 
        className="panel animate-fade-in" 
        style={{ 
          maxWidth: '450px', 
          margin: '60px auto', 
          padding: '30px', 
          textAlign: 'center',
          boxShadow: '0 12px 40px var(--accent-glow)' 
        }}
      >
        <Lock size={48} className="text-accent" style={{ color: 'var(--accent-light)', marginBottom: '16px' }} />
        <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#fff', marginBottom: '8px' }}>
          태하 하우스 자산현황 보호
        </h2>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '20px' }}>
          우리집 패밀리 전용 포트폴리오 페이지입니다. 비밀번호를 입력해 주십시오.
        </p>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <input 
            type="password" 
            placeholder="비밀번호 4자리 입력"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              padding: '12px 16px',
              color: '#fff',
              fontSize: '15px',
              textAlign: 'center',
              outline: 'none'
            }}
          />
          {errorMsg && <p style={{ fontSize: '12px', color: 'var(--danger)' }}>{errorMsg}</p>}
          <button 
            type="submit"
            style={{
              background: 'var(--accent)',
              color: '#fff',
              border: 'none',
              padding: '12px',
              borderRadius: '8px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'var(--transition)'
            }}
          >
            포트폴리오 잠금 해제
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="portfolio-container animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* 타이틀 및 해제 상태 */}
      <div className="canvas-header" style={{ borderBottom: '1px solid var(--border)', paddingBottom: '14px' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Unlock size={20} className="text-accent" style={{ color: 'var(--success)' }} />
            <span>태하 하우스 투자 포트폴리오</span>
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            우리집 매수 평단가와 수량을 관리하는 독립 투자 계부입니다.
          </p>
        </div>
        <button 
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)', color: 'var(--text-secondary)', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}
          onClick={() => {
            setIsAuthenticated(false);
            sessionStorage.removeItem('portfolio_auth');
          }}
        >
          다시 잠그기
        </button>
      </div>

      {/* 요약 대시보드 카드 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
        {/* 국내 주식 요약 */}
        <div className="panel" style={{ background: 'linear-gradient(135deg, rgba(22, 26, 36, 0.6) 0%, rgba(16, 185, 129, 0.05) 100%)' }}>
          <h4 style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', marginBottom: '8px' }}>
            국내 자산 요약 (KRW)
          </h4>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '12px' }}>
            <span style={{ fontSize: '24px', fontWeight: '700', color: '#fff' }}>
              {totalEvalKRW.toLocaleString()}원
            </span>
            <span style={{ fontSize: '15px', fontWeight: '700', color: krwProfit >= 0 ? 'var(--danger)' : '#60a5fa' }}>
              {krwProfit >= 0 ? '+' : ''}{krwProfitRate.toFixed(2)}%
            </span>
          </div>
          <div style={{ fontSize: '12.5px', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>총 매수 금액:</span>
              <span>{totalBuyKRW.toLocaleString()}원</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>총 평가 손익:</span>
              <span style={{ color: krwProfit >= 0 ? 'var(--danger)' : '#60a5fa', fontWeight: '600' }}>
                {krwProfit >= 0 ? '+' : ''}{krwProfit.toLocaleString()}원
              </span>
            </div>
          </div>
        </div>

        {/* 미국 주식 요약 */}
        <div className="panel" style={{ background: 'linear-gradient(135deg, rgba(22, 26, 36, 0.6) 0%, rgba(139, 92, 246, 0.05) 100%)' }}>
          <h4 style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', marginBottom: '8px' }}>
            미국 자산 요약 (USD)
          </h4>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '12px' }}>
            <span style={{ fontSize: '24px', fontWeight: '700', color: '#fff' }}>
              ${totalEvalUSD.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <span style={{ fontSize: '15px', fontWeight: '700', color: usdProfit >= 0 ? 'var(--danger)' : '#60a5fa' }}>
              {usdProfit >= 0 ? '+' : ''}{usdProfitRate.toFixed(2)}%
            </span>
          </div>
          <div style={{ fontSize: '12.5px', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>총 매수 금액:</span>
              <span>${totalBuyUSD.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>총 평가 손익:</span>
              <span style={{ color: usdProfit >= 0 ? 'var(--danger)' : '#60a5fa', fontWeight: '600' }}>
                {usdProfit >= 0 ? '+' : ''}${usdProfit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 보유 종목 상세 내역 테이블 */}
      <div className="panel">
        <h3 className="panel-title">우리집 보유 종목 상세 내역</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13.5px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '12px 8px' }}>종목명</th>
                <th style={{ padding: '12px 8px' }}>티커</th>
                <th style={{ padding: '12px 8px' }}>매수날짜</th>
                <th style={{ padding: '12px 8px', textAlign: 'right' }}>매수평단가</th>
                <th style={{ padding: '12px 8px', textAlign: 'right' }}>보유수량</th>
                <th style={{ padding: '12px 8px', textAlign: 'right' }}>현재가</th>
                <th style={{ padding: '12px 8px', textAlign: 'right' }}>평가금액</th>
                <th style={{ padding: '12px 8px', textAlign: 'right' }}>수익률</th>
                <th style={{ padding: '12px 8px', textAlign: 'center' }}>삭제</th>
              </tr>
            </thead>
            <tbody>
              {holdings.map((h, index) => {
                const currentPrice = getCurrentPriceNum(h.ticker);
                const evalVal = currentPrice * h.quantity;
                const buyVal = h.avgPrice * h.quantity;
                const profitRate = h.avgPrice > 0 ? ((currentPrice - h.avgPrice) / h.avgPrice) * 100 : 0;
                const sign = isUSD(h.ticker) ? '$' : '';

                return (
                  <tr key={h.id || index} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)', color: 'var(--text-primary)' }}>
                    <td style={{ padding: '14px 8px', fontWeight: '600' }}>{h.name}</td>
                    <td style={{ padding: '14px 8px', fontFamily: 'monospace', color: 'var(--text-secondary)' }}>{h.ticker}</td>
                    <td style={{ padding: '14px 8px', color: 'var(--text-muted)' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Calendar size={11} />
                        {h.buyDate}
                      </span>
                    </td>
                    <td style={{ padding: '14px 8px', textAlign: 'right', fontWeight: '600' }}>
                      {sign}{h.avgPrice.toLocaleString()}
                    </td>
                    <td style={{ padding: '14px 8px', textAlign: 'right' }}>{h.quantity}</td>
                    <td style={{ padding: '14px 8px', textAlign: 'right', fontWeight: '600', color: '#fff' }}>
                      {sign}{currentPrice.toLocaleString()}
                    </td>
                    <td style={{ padding: '14px 8px', textAlign: 'right', fontWeight: '700' }}>
                      {sign}{evalVal.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </td>
                    <td style={{ padding: '14px 8px', textAlign: 'right', fontWeight: '700', color: profitRate >= 0 ? 'var(--danger)' : '#60a5fa' }}>
                      {profitRate >= 0 ? '+' : ''}{profitRate.toFixed(2)}%
                    </td>
                    <td style={{ padding: '14px 8px', textAlign: 'center' }}>
                      <button 
                        onClick={() => handleDeleteHolding(h.id)}
                        style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
                      >
                        <Trash2 size={14} className="hover-red" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 신규 매수 데이터 추가 폼 */}
      <div className="panel">
        <h3 className="panel-title">
          <Plus size={16} />
          <span>신규 거래 기록 추가</span>
        </h3>
        <form onSubmit={handleAddHolding} style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', minWidth: '160px' }}>
            <label style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '700' }}>대상 종목 선택</label>
            <select
              value={formTicker}
              onChange={(e) => {
                setFormTicker(e.target.value);
                const selected = STOCKS_POOL.find(s => s.ticker === e.target.value);
                if (selected) setFormName(selected.name);
              }}
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid var(--border)',
                borderRadius: '6px',
                padding: '8px 12px',
                color: '#fff',
                outline: 'none'
              }}
            >
              {STOCKS_POOL.map(s => (
                <option key={s.ticker} value={s.ticker} style={{ background: '#12141a', color: '#fff' }}>
                  {s.name} ({s.ticker})
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', minWidth: '140px' }}>
            <label style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '700' }}>매수 거래일</label>
            <input 
              type="date"
              value={formDate}
              onChange={(e) => setFormDate(e.target.value)}
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid var(--border)',
                borderRadius: '6px',
                padding: '7px 12px',
                color: '#fff',
                outline: 'none'
              }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', minWidth: '120px', flex: 1 }}>
            <label style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '700' }}>매수 평단가</label>
            <input 
              type="number"
              placeholder="예: 210000 또는 950"
              value={formPrice}
              onChange={(e) => setFormPrice(e.target.value)}
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid var(--border)',
                borderRadius: '6px',
                padding: '8px 12px',
                color: '#fff',
                outline: 'none'
              }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', minWidth: '100px', flex: 1 }}>
            <label style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '700' }}>매수 수량</label>
            <input 
              type="number"
              placeholder="예: 50"
              value={formQty}
              onChange={(e) => setFormQty(e.target.value)}
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid var(--border)',
                borderRadius: '6px',
                padding: '8px 12px',
                color: '#fff',
                outline: 'none'
              }}
            />
          </div>

          <button 
            type="submit"
            style={{
              background: 'var(--accent)',
              color: '#fff',
              border: 'none',
              padding: '9px 20px',
              borderRadius: '6px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'var(--transition)',
              height: '37px'
            }}
          >
            기록 추가
          </button>
        </form>
      </div>

      <style jsx global>{`
        .hover-red:hover {
          color: var(--danger) !important;
          transform: scale(1.1);
        }
      `}</style>
    </div>
  );
}
