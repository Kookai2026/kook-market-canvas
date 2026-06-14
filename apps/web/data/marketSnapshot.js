import MARKET_SNAPSHOT from '../public/market-snapshot.json';

const STALE_HOURS = 36;

function isSnapshotStale(asOf) {
  if (!asOf) return true;
  const parsed = new Date(asOf);
  if (Number.isNaN(parsed.getTime())) return true;
  return Date.now() - parsed.getTime() > STALE_HOURS * 60 * 60 * 1000;
}

export function getMarketSnapshotMeta() {
  return {
    asOf: MARKET_SNAPSHOT.as_of,
    source: MARKET_SNAPSHOT.source,
    mode: MARKET_SNAPSHOT.mode,
    refreshPolicy: MARKET_SNAPSHOT.refresh_policy
  };
}

export function getChartLinks(ticker) {
  if (!ticker || ticker === '공급망' || ticker === 'SPACE.X') {
    return [];
  }

  if (/^[0-9]{6}$/.test(ticker)) {
    return [
      { label: '실시간 차트', url: `https://m.stock.naver.com/domestic/stock/${ticker}/total` },
      { label: '공시', url: `https://m.stock.naver.com/domestic/stock/${ticker}/disclosure` }
    ];
  }

  return [
    { label: '실시간 차트', url: `https://finance.yahoo.com/quote/${ticker}` },
    { label: 'TradingView', url: `https://www.tradingview.com/symbols/${ticker}/` }
  ];
}

export function enrichInstrumentWithSnapshot(instrument) {
  const snapshot = MARKET_SNAPSHOT.items[instrument.ticker];
  const stale = Boolean(snapshot?.stale) || isSnapshotStale(MARKET_SNAPSHOT.as_of);

  if (!snapshot) {
    return {
      ...instrument,
      priceStatus: instrument.ticker === 'SPACE.X' ? 'private' : 'sample',
      priceSource: instrument.ticker === 'SPACE.X' ? '비상장/직접 시세 없음' : '샘플 리서치 데이터',
      priceAsOf: instrument.asOf || null,
      priceLinks: getChartLinks(instrument.ticker)
    };
  }

  return {
    ...instrument,
    price: snapshot.price,
    change: snapshot.change,
    priceStatus: stale ? 'stale' : 'delayed',
    priceSource: stale ? `${snapshot.source} (오래됨)` : snapshot.source,
    priceAsOf: MARKET_SNAPSHOT.as_of,
    priceLinks: getChartLinks(instrument.ticker)
  };
}
