#!/usr/bin/env node

import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '../..');
const outputPath = path.join(repoRoot, 'apps/web/public/market-snapshot.json');

const WATCHLIST = [
  { ticker: 'TSLA', yahoo: 'TSLA' },
  { ticker: 'NVDA', yahoo: 'NVDA' },
  { ticker: 'ETN', yahoo: 'ETN' },
  { ticker: 'VRT', yahoo: 'VRT' },
  { ticker: 'MOD', yahoo: 'MOD' },
  { ticker: 'CEG', yahoo: 'CEG' },
  { ticker: 'VST', yahoo: 'VST' },
  { ticker: 'SMR', yahoo: 'SMR' },
  { ticker: 'IONQ', yahoo: 'IONQ' },
  { ticker: 'RGTI', yahoo: 'RGTI' },
  { ticker: 'QBTS', yahoo: 'QBTS' },
  { ticker: 'IBM', yahoo: 'IBM' },
  { ticker: 'MBLY', yahoo: 'MBLY' },
  { ticker: '267260', yahoo: '267260.KS' },
  { ticker: '298040', yahoo: '298040.KS' },
  { ticker: '010120', yahoo: '010120.KS' },
  { ticker: '005490', yahoo: '005490.KS' },
  { ticker: '103140', yahoo: '103140.KS' },
  { ticker: '006260', yahoo: '006260.KS' },
  { ticker: '042700', yahoo: '042700.KS' },
  { ticker: '000660', yahoo: '000660.KS' },
  { ticker: '005930', yahoo: '005930.KS' },
  { ticker: '011790', yahoo: '011790.KS' },
  { ticker: '009150', yahoo: '009150.KS' },
  { ticker: '189300', yahoo: '189300.KQ' },
  { ticker: '012330', yahoo: '012330.KS' }
];

const currencyPrefix = {
  USD: '$',
  KRW: '',
  JPY: '¥',
  HKD: 'HK$',
  EUR: '€'
};

function formatDateKst(date = new Date()) {
  const parts = new Intl.DateTimeFormat('sv-SE', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  }).formatToParts(date).reduce((acc, part) => {
    acc[part.type] = part.value;
    return acc;
  }, {});

  return `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}:${parts.second}+09:00`;
}

function formatPrice(value, currency) {
  if (!Number.isFinite(value)) return null;
  const prefix = currencyPrefix[currency] ?? '';

  if (currency === 'KRW') {
    return `${Math.round(value).toLocaleString('ko-KR')}원`;
  }

  const digits = value >= 100 ? 2 : 2;
  return `${prefix}${value.toLocaleString('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits
  })}`;
}

function formatChange(percent) {
  if (!Number.isFinite(percent)) return null;
  const sign = percent > 0 ? '+' : '';
  return `${sign}${percent.toFixed(2)}%`;
}

async function readExistingSnapshot() {
  try {
    return JSON.parse(await readFile(outputPath, 'utf8'));
  } catch {
    return { items: {} };
  }
}

async function fetchYahooQuote(symbol) {
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?range=2d&interval=1d`;
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'KMC-Stock-Snapshot/1.0'
    }
  });

  if (!response.ok) {
    throw new Error(`${symbol} HTTP ${response.status}`);
  }

  const payload = await response.json();
  const result = payload.chart?.result?.[0];
  const meta = result?.meta;
  if (!meta || !Number.isFinite(meta.regularMarketPrice)) {
    throw new Error(`${symbol} missing quote`);
  }

  const previousClose = Number.isFinite(meta.chartPreviousClose)
    ? meta.chartPreviousClose
    : meta.previousClose;
  const changePercent = Number.isFinite(previousClose) && previousClose !== 0
    ? ((meta.regularMarketPrice - previousClose) / previousClose) * 100
    : null;

  return {
    price: formatPrice(meta.regularMarketPrice, meta.currency),
    change: formatChange(changePercent),
    source: 'Yahoo Finance 무료 지연 데이터',
    provider_symbol: symbol,
    currency: meta.currency ?? null,
    exchange: meta.exchangeName ?? null,
    market_state: meta.marketState ?? null
  };
}

async function main() {
  const existing = await readExistingSnapshot();
  const items = {};
  const errors = [];

  for (const item of WATCHLIST) {
    try {
      const quote = await fetchYahooQuote(item.yahoo);
      items[item.ticker] = quote;
      process.stdout.write(`OK ${item.ticker} ${quote.price} ${quote.change}\n`);
    } catch (error) {
      const fallback = existing.items?.[item.ticker];
      if (fallback) {
        items[item.ticker] = {
          ...fallback,
          source: `${fallback.source || '이전 스냅샷'} (갱신 실패 보존)`,
          stale: true
        };
      }
      errors.push({ ticker: item.ticker, provider_symbol: item.yahoo, message: error.message });
      process.stderr.write(`WARN ${item.ticker}: ${error.message}\n`);
    }
  }

  const snapshot = {
    as_of: formatDateKst(),
    source: 'Yahoo Finance 무료 지연 스냅샷',
    mode: 'delayed_snapshot',
    refresh_policy: 'GitHub Actions schedule, 장중 약 30분 주기',
    items,
    errors
  };

  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(outputPath, `${JSON.stringify(snapshot, null, 2)}\n`, 'utf8');

  if (Object.keys(items).length === 0) {
    throw new Error('No market snapshot items were written.');
  }

  process.stdout.write(`Wrote ${Object.keys(items).length} items to ${outputPath}\n`);
}

main().catch((error) => {
  process.stderr.write(`ERROR ${error.message}\n`);
  process.exit(1);
});
