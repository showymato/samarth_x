# Predictor data (owner must fill: never invent)

The desk-terminal commands `predict jee <percentile>` and `predict neet <marks>` read these files.
Until `rows` is filled, the terminal says so and hands off to WhatsApp. It never makes up colleges,
cutoffs or closing ranks.

**Fill only from official sources** and set `source` (URL) and `year`:

- `jee.json`: JoSAA opening/closing ranks (https://josaa.nic.in → "Opening and Closing Ranks"), final round.
- `neet.json`: MCC (All India Quota) allotment / closing ranks (https://mcc.nic.in), plus your state counselling authority if you add state quota.

## jee.json

```json
{
  "source": "https://josaa.nic.in/…",
  "year": 2026,
  "rows": [
    { "institute": "…", "program": "…", "quota": "AI", "category": "OPEN", "gender": "Gender-Neutral", "openingRank": 0, "closingRank": 0 }
  ]
}
```

`predict jee 97.4` estimates a CRL rank as `(100 − percentile) × TOTAL_CANDIDATES / 100`.
`TOTAL_CANDIDATES` is `predictor.jeeTotalCandidates` in `lib/content.ts` (`{{JEE_MAIN_TOTAL_CANDIDATES}}`):
set it to the official NTA count of candidates for that year. Then it lists rows where `closingRank ≥ rank`
(category `OPEN` unless given: `predict jee 97.4 obc-ncl`).

## neet.json

```json
{
  "source": "https://mcc.nic.in/…",
  "year": 2026,
  "marksToRank": [ { "marks": 0, "rank": 0 } ],
  "rows": [
    { "college": "…", "state": "…", "quota": "AIQ", "category": "OPEN", "closingRank": 0 }
  ]
}
```

`marksToRank` must come from the official NTA result data (marks vs. AIR). `predict neet 610`
interpolates a rank from it and lists rows where `closingRank ≥ rank`.

Every output says "estimate based on <year> data, not a guarantee."
