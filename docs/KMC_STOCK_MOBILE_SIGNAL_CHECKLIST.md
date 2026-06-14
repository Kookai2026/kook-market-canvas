# KMC Stock Mobile Signal Update Checklist

- Created: 2026-06-11
- Scope: KMC Stock (`APP_STOCK`) mobile-first daily investment check experience
- Rule: Proceed one step at a time. After each step, run the listed verification and update this checklist before moving on.

## 0. Current Diagnosis

KMC Stock is currently closer to a desktop research workbench than a daily phone app.

Key issues:

- First screen starts from `5년 투자 원칙`, not today's decision.
- Top navigation exposes too many tabs for daily mobile use.
- `오늘의 점검` contains useful rules but reads like a long report.
- `SignalFeed` is still a static sample feed, not an embedding-based signal surface.
- Some investment statements need stricter source, `as_of`, and verification status.
- Prices are not live; current app needs a delayed/free snapshot layer and clear external real-time links.

## 1. Existing Design References

No local Figma, screenshot, image, or visual reference asset was found in the repository.

Internal design references that do exist:

- `docs/deep-research-report.md`
  - `모바일 뷰 권장안`
  - `모바일 랜딩 와이어프레임`
  - `모바일 캔버스 와이어프레임`
  - Design system guidance: card, badge, score-table components; mobile touch optimization.
- `docs/long-term-investment-operating-plan.md`
  - Defines KMC as a 5-year long-term investment operating dashboard for the couple and close users.
  - Defines daily checks: allocation drift, Musk Stack grade changes, thesis damage, overheat, and major disclosures/news.
- Current app visual system:
  - `apps/web/styles/globals.css`
  - Dark premium card UI, violet accent, badge/card-heavy design.

Design conclusion:

Use the existing dark card UI, but shift the layout from research-desk tabs to a phone-first daily decision flow.

## 2. Target Product Shape

New framing:

```text
KMC Stock = daily mobile investment check app
```

Primary daily question:

```text
What should we avoid, watch, or verify today?
```

Primary screen order:

1. Today verdict
2. Do-not-buy / wait / verify cards
3. Favorite ticker and sector changes
4. Embedded external signals
5. Links into canvas and long-term principles

## 3. Crawling vs Embedding Policy

External sources such as X, news, disclosures, and official pages are collection inputs.

```text
Collect
-> normalize metadata
-> deduplicate
-> embed
-> match to ticker / sector / value-chain node
-> summarize
-> display only selected daily signal cards
```

Rules:

- Do not show raw X/news firehose as the main UX.
- Do not call raw collection "embedding".
- Every signal card must carry source, checked date, verification status, and confidence.
- Official disclosures and primary sources outrank social posts.
- X/social content can trigger investigation but should not become an A-grade signal by itself.

## 4. Implementation Checklist

### Step 1. Product Direction Lock

- [x] Confirm target app is `APP_STOCK`, not `APP_KM`.
- [x] Confirm direction: phone-first daily app for repeated couple use.
- [x] Confirm design references available in docs, not external design files.
- [x] Update README or planning doc with mobile-first daily signal direction.

Verification:

- [x] Repository path checked: `/mnt/c/Active/APP_STOCK`
- [x] Existing design references searched with `rg`
- [x] No image/Figma design references found locally
- [x] README contains mobile-first daily signal direction and external signal display policy

### Step 2. Navigation Simplification Plan

Proposed visible tabs:

- `오늘`
- `관심`
- `캔버스`
- `원칙`

Absorbed into inner cards:

- `Musk Stack 검증`
- `정책 리스크 샘플`
- `리밸런싱 로그`

Tasks:

- [ ] Decide exact tab labels.
- [x] Decide exact tab labels.
- [x] Decide whether to keep top tabs or move to mobile bottom nav.
- [x] Make `오늘` the default landing tab.
- [x] Keep desktop usable without creating a separate app.

Verification:

- [x] `apps/web/app/page.js` default tab points to the daily view.
- [x] Mobile viewport does not require horizontal tab scanning for core use.
- [x] Desktop still shows all core routes or cards clearly.

### Step 3. Today Screen Redesign

Target first viewport:

```text
KMC Today
as_of / data status

[오늘 결론]
Do not chase / Watch / Verify

[우리 관심 변화]
favorite ticker/sector movements

[임베딩 시그널]
3 selected source-backed cards
```

Tasks:

- [x] Convert long `DailyCheckTab` report into mobile-first summary sections.
- [x] Keep deeper allocation and thesis checks below the first viewport.
- [x] Add clear `sample` or `as_of` status.
- [x] Reduce long paragraphs in top cards.

Verification:

- [x] First mobile viewport answers today's decision question.
- [x] Top cards fit a phone screen without dense grid overflow.
- [x] No unsupported "real-time" wording.

### Step 4. Signal Feed Reframe

Tasks:

- [x] Rename sample news feed concept to embedding-based signal cards.
- [x] Add fields: `source_type`, `source_name`, `as_of`, `verification`, `matched_to`, `confidence`.
- [x] Distinguish official disclosure/news/social/analyst note.
- [x] Keep sample status explicit until real pipeline exists.

Verification:

- [x] `SignalFeed` no longer reads like a raw news list.
- [x] Each card explains why it appears.
- [x] X/social is framed as investigation input, not final proof.

### Step 5. Data Pipeline Planning

Tasks:

- [x] Document collection inputs: X, Naver News, OpenDART, company IR, official agency pages.
- [x] Define embedding target units: article, tweet/thread, disclosure, paragraph, evidence item.
- [x] Define matching targets: ticker, sector, canvas node, relation card.
- [x] Define ranking: relevance, recency, source reliability, portfolio relevance.

Verification:

- [x] Pipeline doc distinguishes collection, embedding, retrieval, summarization, display.
- [x] No plan requires browser-side API secrets.
- [x] Public app only reads processed read-model data.

### Step 6. Mobile/PWA Polish

Tasks:

- [x] Add or verify PWA manifest.
- [x] Check mobile spacing, tap targets, card widths, text wrapping.
- [x] Avoid nested card clutter.
- [x] Keep the first screen fast and mostly static.

Verification:

- [x] `npm run build` passes.
- [ ] Mobile viewport screenshot reviewed if a dev server is run. Blocked locally: Playwright/Chromium is not installed.
- [x] No layout overflow in the main daily flow.
- [x] Dev server HTTP checks passed for `/`, `/manifest.webmanifest`, and `/icon.svg`.

### Step 7. Free Delayed Price Snapshot

Target:

```text
Free/delayed source
-> small scheduled syncer
-> market snapshot read model
-> KMC cards render snapshot + as_of + status
-> real-time charts stay external links
```

Tasks:

- [x] Add `public/market-snapshot.json` and a `marketSnapshot` read-model helper for delayed/sample status.
- [x] Overlay card prices through the snapshot helper instead of treating hardcoded values as live.
- [x] Add price status wording: delayed/sample/private.
- [x] Add external real-time chart links on instrument cards and canvas node detail rows.
- [x] Replace static snapshot items with a free scheduled syncer output path.
- [x] Prepare GitHub Actions schedule for free delayed snapshot updates. Deployment note: pushing a new workflow requires a GitHub token with `workflow` scope.
- [x] Add `npm run sync:market` for manual refresh from `apps/web`.
- [x] Add stale state when snapshot age exceeds 36 hours.

Verification:

- [x] UI no longer claims internal prices are real-time.
- [x] Missing/private symbols degrade to sample/private status.
- [x] External chart path exists for Korean and US tickers.
- [x] `npm run sync:market` writes a valid snapshot.
- [x] `npm run build` passes after implementation.

## 5. Open Decisions

- [x] Should the app use top segmented tabs or bottom mobile navigation? Decision: mobile uses fixed bottom navigation; desktop keeps compact top tabs.
- [x] Should `Musk Stack` remain one tap away for the couple, or become a filter inside `캔버스`? Decision: absorb into Canvas as a relationship filter layer.
- [x] Should policy/Trump Stack remain a separate section? Decision: absorb into Canvas as `정책 리스크` filter layer; keep source component for reference only.
- [x] Should X validation states be represented in `SignalFeed` samples? Decision: use `raw_social`, `candidate`, `needs_source`, `corroborated`, `rejected`.
- [ ] Should X be included in P0, or only after OpenDART/news/company sources are stable?
- [ ] Should the app show exact portfolio percentages, or only risk bands until account integration is real?
- [x] Should KMC host true live charts internally? Decision: no. Use free delayed snapshots internally and route real-time/interactive chart needs to external finance pages.

## 6. Work Log

### 2026-06-11

- Created checklist.
- Verified target app is `APP_STOCK`.
- Found internal mobile design references in `docs/deep-research-report.md`.
- Found no local Figma/image/screenshot design reference assets.
- Completed Step 1 by updating `README.md` with mobile-first daily signal direction.
- Verified Step 1 with `rg -n "모바일 우선|외부 자료 노출 원칙|오늘의 점검" README.md`.
- Completed Step 2 by reducing top tabs to `오늘`, `관심`, `캔버스`, `원칙`.
- Kept `Musk Stack`, policy risk, and rebalance log out of top-level tabs; later cycles absorbed Musk and policy risk into Canvas filters.
- Verified Step 2 with `rg` checks against `apps/web/app/page.js`.
- Completed Step 3 by adding a `KMC Today` first-viewport decision surface to `DailyCheckTab`.
- Added mobile CSS for stacked verdict and watch cards.
- Verified Step 3 with `rg` checks and `npm run build`.
- Completed Step 4 by reframing `SignalFeed` as embedding-style signal cards.
- Added source, matching, verification, confidence, and reason fields to sample signal cards.
- Verified Step 4 with `rg` checks and `npm run build`.
- Completed Step 5 by adding `docs/KMC_STOCK_SIGNAL_PIPELINE.md`.
- Documented collection inputs, embedding units, matching targets, signal scoring, daily read model, and P1 feedback loop.
- Verified Step 5 with `rg` checks against `docs/KMC_STOCK_SIGNAL_PIPELINE.md`.
- Completed Step 6 by adding `apps/web/app/manifest.js` and `apps/web/public/icon.svg`.
- Updated app metadata for mobile/PWA install behavior.
- Verified Step 6 with `npm run build` and HTTP checks against the local dev server.
- Visual screenshot verification remains pending because no Playwright/Chromium executable is installed locally.
- Cycle 2: Added fixed mobile bottom navigation and dark-theme Canvas relationship filter styles.
- Cycle 2: Absorbed `Musk Stack` into `ValueChainCanvas` as a filter layer.
- Cycle 3: Absorbed policy/Trump Stack exposure into `ValueChainCanvas` as `정책 리스크`.
- Cycle 3: Connected X/social validation states to `SignalFeed` sample data and rendering.
