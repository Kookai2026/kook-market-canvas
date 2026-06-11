# KMC Stock Signal Pipeline

- Created: 2026-06-11
- Scope: P1 feedback loop for external signals, embeddings, and daily mobile display

## 1. Product Rule

KMC Stock should not become a raw feed reader.

The app should collect external material, but users should only see small, source-backed daily signal cards.

```text
External material is input.
Daily signal cards are product output.
```

## 2. Pipeline Overview

```text
Collect
-> Normalize
-> Deduplicate
-> Store source record
-> Chunk
-> Embed
-> Retrieve and match
-> Score and verify
-> Summarize
-> Publish read model
-> Display on mobile Today / Interest / Canvas screens
```

## 3. Collection Inputs

P1 priority:

| Source | Role | Notes |
|---|---|---|
| OpenDART | Official disclosure and contract evidence | Highest reliability for Korean listed companies |
| Company IR / press pages | Primary company statements | Keep original URL and checked date |
| Public agency pages | Infrastructure, policy, energy, procurement context | Useful for xAI/MLGW/TVA-style infrastructure claims |
| Naver News API | News metadata and discovery | Store metadata/link first; avoid uncontrolled full-text storage |
| X / Twitter | Early signal and rumor detection | Investigation trigger only, never A-grade proof by itself |
| Market data APIs | Price, volume, RSI, overheat, flow | Use backend/syncer only; do not expose keys to browser |

## 4. Normalized Source Record

Every collected item should become a normalized source record.

```yaml
source_record:
  source_id: "src_..."
  source_type: "disclosure | official | ir | news | social | market"
  source_name: "OpenDART"
  title: "..."
  url: "https://..."
  author_or_org: "..."
  published_at: "2026-06-11T09:00:00+09:00"
  collected_at: "2026-06-11T09:05:00+09:00"
  language: "ko"
  raw_text_ref: "local_or_object_storage_key"
  license_policy: "metadata_only | excerpt_allowed | internal_only"
  hash: "content_hash"
```

## 5. Embedding Units

Embed small, evidence-friendly units rather than entire pages only.

| Unit | Use |
|---|---|
| Article summary paragraph | News and IR matching |
| Disclosure section | Contract, supply, financing, and risk evidence |
| X post/thread summary | Early signal clustering |
| Evidence item | Relation grade support |
| Canvas node thesis | Match external material to value-chain nodes |
| Instrument profile | Match signals to tickers |

Recommended embedding record:

```yaml
embedding_item:
  item_id: "emb_..."
  source_id: "src_..."
  item_type: "paragraph | disclosure_section | social_summary | evidence | node_thesis | instrument_profile"
  text: "..."
  embedding_model: "..."
  vector_ref: "..."
  created_at: "2026-06-11T09:10:00+09:00"
```

## 6. Matching Targets

Signals should match against product entities, not just keywords.

Targets:

- Ticker / instrument
- Sector
- Value-chain node
- Node relation
- Musk Stack relation card
- Policy risk card
- Favorite list
- Portfolio allocation bucket

Matching output:

```yaml
signal_match:
  source_id: "src_..."
  item_id: "emb_..."
  target_type: "instrument | sector | node | relation | favorite | allocation"
  target_id: "267260"
  relevance: 0.82
  reason: "mentions transformer demand and North America grid expansion"
```

## 7. Scoring and Verification

Ranking formula should combine relevance and reliability.

```text
SignalScore =
  0.35 * portfolio_relevance
+ 0.25 * source_reliability
+ 0.20 * recency
+ 0.10 * novelty
+ 0.10 * verification_strength
```

Reliability ladder:

| Grade | Evidence type |
|---|---|
| A | Official contract, disclosure, regulator or company primary source |
| B | Official mention plus reliable secondary confirmation |
| C | Indirect supply-chain evidence |
| D | Thematic relation only |
| X | Rumor, unsourced social post, or contradicted claim |

Social/X rule:

```text
X/social can raise an investigation task.
X/social cannot directly produce an A-grade signal.
```

X/social validation states:

| Status | Meaning | Display rule |
|---|---|---|
| `raw_social` | Raw social post collected but not checked | Investigation queue only |
| `candidate` | Relevant to a ticker, sector, node, or relation | Can appear as low-confidence sample/context |
| `needs_source` | Needs official source before use | Show only as verification task |
| `corroborated` | Supported by official or reliable secondary source | Eligible for daily signal cards |
| `rejected` | Rumor, duplicate, contradiction, or bad match | Keep for audit; do not use as investment signal |

## 8. Daily Signal Read Model

The public app should read a small processed model.

```yaml
daily_signal:
  signal_id: "sig_..."
  as_of: "2026-06-11"
  title: "xAI Memphis power infrastructure update requires verification"
  summary: "..."
  source_type: "official"
  source_name: "MLGW sample source"
  source_url: "https://..."
  verification: "direct supplier unconfirmed"
  validation_status: "needs_source"
  confidence: 64
  matched_to:
    - type: "relation"
      id: "musk_xai_power_grid"
      label: "Musk Stack · xAI 전력망"
  action: "verify"
  display_zone: "today | interest | canvas"
  reason: "Musk relation grade may change if confirmed"
```

## 9. Mobile Display Policy

Today screen:

- Show 3 to 5 signals only.
- Put avoid/wait/verify above external signals.
- Never show raw scrolling X/news feed.

Interest screen:

- Show signals matched to favorites.
- Include source, verification status, and confidence.

Canvas screen:

- Show signals attached to nodes and relations.
- Use signals to explain why a node changed, not to create hype.

## 10. P1 Feedback Loop

Each signal should create a traceable loop.

```text
Signal detected
-> matched to KMC entity
-> verification status assigned
-> displayed or held
-> user/operator marks useful, wrong, duplicate, or needs follow-up
-> ranking and relation grade updated
```

Feedback fields:

```yaml
signal_feedback:
  signal_id: "sig_..."
  actor: "operator | user"
  feedback: "useful | wrong | duplicate | follow_up | hide"
  note: "..."
  created_at: "2026-06-11T10:00:00+09:00"
```

## 11. Security and Cost Rules

- Do not call paid/source APIs from the browser.
- Keep collection workers on the internal server or controlled backend.
- Public app reads only processed read-model data.
- Store source URLs and metadata even when full text storage is restricted.
- Respect media/data licensing; metadata and links are safer than republishing full content.

## 12. Implementation Order

1. Keep current static sample cards but use final field names.
2. Add local JSON/read-model fixture for `daily_signal`.
3. Add backend or syncer upload path later.
4. Add vector storage and retrieval after source records are stable.
5. Add feedback capture after daily signal display is stable.
