# Context

The project already has 13 technical diagram figures for an Elastic engineering blog post about PromQL in Elasticsearch. The request is to add Figure 14: **Partial Results & Aggregation Internals** — a diagram explaining how partial results are represented as Pages/Blocks, transferred to the coordinator via the exchange layer, and how the coordinator's HashAggregationOperator uses BlockHash (including PackedValuesBlockHash "packing dimensions") to build a compact hash table from those partial pages.

Target audience: senior/staff engineers. Style: minimalist flat architectural, same grammar as existing figures.

---

# Plan

## New file
`src/figures/Figure14PartialAgg.tsx`

## Visual layout (960 × 660 SVG)

Three horizontal zones separated by two ExchangeBoundary lines:

```
[ DATA NODE (partial agg) ]  |--|  [ NETWORK EXCHANGE ]  |--|  [ COORDINATOR (merge agg) ]
```

### Zone 1 — Data Node (x 20–340)

- **GroupLabel** "DATA NODE" at top
- A "Page" structure callout (inset box, ~200×140) showing:
  - Titled "Page  positionCount=1024" (Node, variant `neutral`)
  - 3 stacked Block chips inside: `IntBlock [pod_id]`, `LongBlock [ts]`, `BytesRefBlock [label]`
  - Small annotation "columnar • ref-counted"
- Below: partial **HashAggregationOperator** Node (variant `physical`, ElasticBlue)
  - Sub-label "BlockHash → group IDs"
- Below that: **PackedValuesBlockHash callout** (Boundary box, teal variant) showing byte packing layout:
  - Row of colored boxes: `null bits | col₀ (4B) | col₁ (8B) | col₂ (var)` → `BytesRefHash → ordinal`
  - Annotation "compact key = packed bytes per row"
- Arrow (physical) from Page → HashAggregationOperator
- Arrow (physical) from HashAgg to partial result pages (3 small Node chips: `partial Page`, variant muted)

### Zone 2 — Network Exchange (x 340–620)

- **ExchangeBoundary** horizontal dashed line at y~330
- Label "EXCHANGE LAYER"
- In the middle: 3 small page chips animating left → right with Arrow (network variant, dashed)
- Annotation: "ExchangeSinkOperator → serialize → ExchangeSourceOperator"
- Backpressure note: small Chip "backpressure via IsBlockedResult"

### Zone 3 — Coordinator (x 620–940)

- **GroupLabel** "COORDINATOR"
- Final **HashAggregationOperator** Node (variant `physical`) — "merge partial states"
  - Inside / sub: "BlockHash rebuilds global group IDs"
- Below: hash table visualization (Boundary, semantic/teal) showing:
  - Grid of group rows: `group 0 | sum=… | count=…`, `group 1 | …`, etc.
  - Label "GroupingAggregators — dense accumulators"
- Below: output result Page (variant `semantic`)
  - Chips: `BytesRefBlock [label]`, `LongBlock [sum]`, `IntBlock [count]`
- Arrows: partial pages → final HashAgg → hash table → result Page

## Color / variant mapping

| Element | Variant / color |
|---|---|
| Page nodes | `neutral` |
| Block chips | `C.ink` mono chips |
| HashAggregationOperator | `physical` (ElasticBlue) |
| PackedValuesBlockHash boundary | teal border `C.teal` |
| Exchange arrows | `network` (dashed gray) |
| Hash table boundary | `semantic` (Teal) |
| Result page | `semantic` |
| Backpressure chip | `muted` |

## App.tsx change

Import `Figure14PartialAgg` and append to the `figures` array:
```ts
{ node: <Figure14PartialAgg />, weight: "major" }
```

---

# Verification

1. Dev server is already running — open preview panel and scroll to Figure 14 at the bottom of the gallery.
2. Check: three zones are visually distinct; Page/Block callout is readable; packed-key byte layout is legible; arrows flow left→right; no overlapping labels.
3. Check: no TypeScript errors in the new file (grammar primitives are all typed).
