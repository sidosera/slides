# PromQL-in-Elasticsearch — Engineering Blog Visuals

## Goal

Create the complete visual system and all technical figures for the already-written engineering blog post:

**“Building PromQL into Elasticsearch: from prototype to GA”**

This is NOT a request to design a blog page.

Do not:
- build an article shell
- recreate the article text
- design navigation/header/footer
- invent prose
- make a landing page
- turn the post into a presentation

The deliverable is a collection of elegant, publication-quality technical figures that will be embedded at specific points in the existing blog article.

Every visual must have a concrete editorial purpose:
- explain a technical idea that is difficult to communicate in prose alone
- appear naturally immediately after the paragraph/section it supports
- advance the engineering story
- avoid repeating what the prose already says clearly

The diagrams should feel like they were drawn by the engineers building the Elasticsearch query engine and then polished for publication.

Audience:
- senior/staff engineers
- database engineers
- distributed-systems engineers
- query-engine engineers
- observability / metrics engineers

Aesthetic:
- white theme
- minimalist
- precise
- architectural
- restrained
- technical
- elegant
- generous whitespace

Think:

**query planner + compiler paper + distributed database design doc + Elastic branding**

Not:

**marketing infographic + launch deck + feature cards**

---

# 1. Editorial principle

Do not create diagrams simply because a section exists.

Each visual must answer a specific engineering question.

A good figure should make the reader understand something faster than another paragraph would.

The article should alternate naturally between:

prose → visual explanation → prose → deeper visual explanation

rather than becoming a gallery of diagrams.

Figures should therefore vary in density.

Some are lightweight conceptual illustrations.

Others are deep execution-plan diagrams.

Do not make every figure equally large or equally complicated.

---

# 2. Brand system

Use the Elastic brand palette from the provided brand reference.

The article background is white.

Exact palette:

Sky          #45A8FF
LightBlue    #1893FF
ElasticBlue  #0B64DD
DarkBlue     #0A52B3

LightTeal    #48EFCF
Teal         #02BCB7
DarkTeal     #128D91

LightPoppy   #FF957D
Poppy        #FA744E
DarkPoppy    #E55940

LightPink    #F990C6
Pink         #F04E98

Yellow       #FEC514
LightYellow  #FFDF56

Midnight     #15338B
DevBlue      #101C3F

White        #FFFFFF
LightGray    #F5F7FA
MediumGray   #DCE2EA
DarkGray     #ABB4C4

Ink          #343741
DarkInk      #1C1E23

---

# 3. Semantic color grammar

Colors must have stable meaning across the article.

## ElasticBlue

Physical Elasticsearch execution:

- execution operators
- physical plans
- data movement
- exchanges
- shared compute engine

## Teal

PromQL / Prometheus semantics:

- parser
- logical PromQL concepts
- selectors
- API boundary
- language-specific planning

## Ink / DarkInk

Neutral structural content:

- normal nodes
- text
- ordinary logical edges

## Gray

Secondary / de-emphasized structure:

- inactive path
- alternative
- table/grid
- supporting context

## Poppy

Only for technical problems:

- incorrect transformation
- reset
- unsupported path
- invariant violation

## Secondary colors

Pink / Sky / Yellow / LightBlue may differentiate:

- independent time series
- independent branches
- series sets

Do not use color merely to make figures colourful.

---

# 4. Shared visual language

Build a small reusable visual vocabulary first.

All figures must reuse it.

## Plan/operator node

White fill.

1px MediumGray border.

6–8px radius.

Compact.

No shadow.

Important physical operator:
- subtle ElasticBlue tint
- ElasticBlue border

PromQL semantic operator:
- subtle Teal tint
- Teal border

## Code chips

For:

`rate(http_requests_total[5m])`

`on(cluster)`

`{service="foo"}`

Use monospace.

Very light gray fill.

Small radius.

## Connectors

Logical transformation:
- thin Ink / Gray

Physical execution/data movement:
- slightly stronger ElasticBlue

Network exchange:
- visually distinct
- dashed or clearly labelled
- no cloud/network clip art

## Boundaries

Subtle labelled regions such as:

PROMQL SEMANTICS

SHARED ELASTICSEARCH ENGINE

DATA NODES

COORDINATOR

Do not use large coloured containers.

## Annotations

Short.

Technical.

Usually one line.

Examples:

“selectors remain branch-local”

“match by label key”

“collapse onto evaluation grid”

---

# 5. Typography

Use Inter for normal text.

Use a clean monospace font for:

- queries
- label sets
- sample values
- API endpoints

Hierarchy:

Figure number / eyebrow:
11–12px

Figure title:
18–22px

Short subtitle:
13–14px

Node:
12–14px

Annotation:
11–12px

Code:
11–13px

No paragraphs inside diagrams.

---

# 6. Figure sizing

These figures will be embedded in a normal white technical blog.

Design primarily for approximately:

**900–1000px rendered width**

They should still be readable around:

**750–800px width**

Do not optimize for a giant presentation slide.

Suggested Figma frame widths:

- standard: 1200px
- compact: 1000–1100px
- hero: ~1400–1600px

Height should follow the composition.

Do not force all diagrams into the same aspect ratio.

---

# 7. ARTICLE-MAPPED FIGURES

The following figures correspond directly to specific sections in the existing article.

They should be designed in article order.

---

## FIGURE 01 — PromQL becomes another Elasticsearch frontend

### Placement

Near the beginning of the article, immediately after the introduction establishes:

- users already have Prometheus tooling
- we decided to preserve the Prometheus interface
- PromQL executes on Elasticsearch rather than through a separate Prometheus engine

This is the first conceptual visual.

### Editorial question

**What did we actually build?**

### Visual

PromQL and ES|QL enter from separate frontend branches:

                 PromQL
                    \
                     \
                      Elasticsearch
                     compute engine
                     /
                    /
                  ES|QL
                    |
                    v
             Elasticsearch storage

PromQL should be Teal.

Shared execution should be ElasticBlue.

Do not expose detailed compiler stages yet.

This is a simple conceptual diagram.

### Tone

Elegant.

Sparse.

Almost cover-art quality, but still architectural.

No decorative artwork.

---

## FIGURE 02 — PromQL compilation path

### Placement

Inside the section:

**“PromQL as another Elasticsearch frontend”**

Place immediately after the prose explaining that PromQL is parsed and compiled into Elasticsearch plans.

### Editorial question

**How does a PromQL request become something Elasticsearch can execute?**

### Visual

Prometheus HTTP API
        ↓
     PromQL
        ↓
 Parser / AST
        ↓
PromQL logical plan
        ↓
Lowering + optimization
        ↓
Elasticsearch physical plan
        ↓
Distributed compute
        ↓
Prometheus response

Visually separate:

PROMQL-SPECIFIC

from:

SHARED ELASTICSEARCH ENGINE

The transition between logical PromQL semantics and physical Elasticsearch execution is the main idea.

Do not make it look like a generic software architecture stack.

It should feel compiler-like.

---

## FIGURE 03 — `rate()` changes the execution model

### Placement

Immediately after the article explains that PromQL semantics do not map cleanly to relational operators and introduces:

`sum by (service) (rate(http_requests_total[5m]))`

### Editorial question

**Why isn't PromQL just another syntax over relational aggregation?**

### Visual structure

Small left-hand comparison:

NAIVE

scan
 ↓
group
 ↓
aggregate

De-emphasize this.

Main visual:

samples
 ↓
partition by series
 ↓
window [5m]
 ↓
order by timestamp
 ↓
detect counter reset
 ↓
rate per series
 ↓
evaluation timestamp
 ↓
aggregate by service

Alongside the middle stages show 2–3 tiny counter series.

One series:

95 → 103 → 4 → 11

Highlight only the reset:

103 → 4

with restrained Poppy.

### Main message

`rate()` is computed independently per series before aggregation.

Do not turn the eight stages into eight giant cards.

Use compact operator-plan geometry.

---

## FIGURE 04 — One series, many execution rows

### Placement

Inside the section:

**“One series, many rows”**

Place immediately after the article explains the mismatch between the engine representation and Prometheus `query_range`.

### Editorial question

**Why did query_range need a new execution primitive?**

### Visual

Three-part transformation.

LEFT:

engine rows

series_a   10:00   42
series_a   10:01   43
series_a   10:02   41

series_b   10:00   12
series_b   10:01   14

CENTER:

TimeSeriesCollapse

Make this a clear physical execution operator.

RIGHT:

series_a
[(10:00,42), (10:01,43), (10:02,41)]

series_b
[(10:00,12), (10:01,14)]

Use two stable secondary colors for A/B.

Small annotation:

“collapse onto the requested evaluation-step grid”

### Composition

This should be one of the cleanest diagrams in the post.

Almost like a data-structure transformation diagram.

---

## FIGURE 05 — Binary arithmetic becomes a join

### Placement

At the start of:

**“Binary expressions are really joins”**

after:

`rate(http_errors_total[5m]) / rate(http_requests_total[5m])`

### Editorial question

**What really happens before `/` can execute?**

### Visual

                 "/"
               /     \
              /       \
        errors         requests
          |               |
        rate()           rate()
          |               |
     series set A     series set B
           \             /
            \           /
             SERIES MATCH
                  |
               divide
                  |
            result series

The visual emphasis is on:

SERIES MATCH

not `/`.

Below, show a tiny matching example.

LEFT:

{cluster="a", instance="1"}
{cluster="a", instance="2"}
{cluster="b", instance="1"}

RIGHT:

{cluster="a"}
{cluster="b"}

Chips:

`on(cluster)`

`group_left`

### Tone

Looks like an execution-plan join.

Not like a Prometheus tutorial.

---

## FIGURE 06 — Selector locality bug

### Placement

Immediately after the article describes the optimizer bug where filters from two operands could become:

`service="foo" AND service="bar"`

### Editorial question

**What went wrong in the planner?**

### Visual

Side-by-side.

LEFT:

INCORRECT

              global filter

 service="foo" AND service="bar"

                    ↓

              EmptyRelation

Use Gray + minimal Poppy.

RIGHT:

CORRECT

                  "/"
                /     \
               /       \
 service="foo"         service="bar"
       |                     |
 errors branch         requests branch

Small callout:

“selectors remain attached to their operand”

### Tone

Debugging / optimizer diagram.

Very little decoration.

This should feel like an actual bug postmortem visual.

---

## FIGURE 07 — Prometheus compatibility is an API surface

### Placement

Inside:

**“Prometheus compatibility is bigger than PromQL”**

after the article explains that Grafana depends on more than query execution.

### Editorial question

**What does “Prometheus compatible” actually include?**

### Visual

Central Elasticsearch Prometheus boundary.

Around it, logically grouped protocol surfaces:

QUERY

/api/v1/query
/api/v1/query_range

DISCOVERY

/api/v1/labels
/api/v1/series
/api/v1/metadata

CAPABILITY

/api/v1/status/buildinfo

TRANSPORT

GET
POST

INGEST

Remote Write

### Important

Do not render these as five feature cards.

Prefer a protocol/interface map.

For example, requests enter through a boundary around Elasticsearch.

The boundary itself is the concept.

### Main message

Compatibility is the entire client protocol surface, not merely PromQL evaluation.

---

## FIGURE 08 — How we measured compatibility

### Placement

Inside:

**“Testing the queries people actually write”**

after the article introduces the real-world Grafana corpus.

### Editorial question

**How did we decide what compatibility actually matters?**

### Main visual

Methodology first:

Public Grafana dashboards
        ↓
extract PromQL
        ↓
normalize
        ↓
execute in Elasticsearch
        ↓
execute in Prometheus
        ↓
compare behaviour
        ↓
compatibility corpus

Then, secondary:

Tech Preview  ~60%
GA            ~80%

Use restrained horizontal coverage bars.

No giant 80%.

### Main message

The interesting thing is the test methodology.

The percentage is supporting evidence.

---

## FIGURE 09 — Classic vs native histogram representation

### Placement

Inside:

**“Native histograms”**

immediately after the article explains:

classic histogram → buckets represented as series

native histogram → histogram represented as a value

### Editorial question

**Why does the same PromQL function lower differently for native histograms?**

### Layout

Two parallel execution paths.

TOP — CLASSIC

le="0.1"
le="0.5"
le="1"
le="+Inf"

      ↓

histogram_quantile()

      ↓

quantile


BOTTOM — NATIVE

┌ exponential_histogram ┐
│ buckets inside value  │
└───────────────────────┘

          ↓

PromQL histogram_quantile

          ↓

ES histogram execution

          ↓

quantile

Small annotation:

classic → buckets are series

native → histogram is a value

Tiny secondary note:

q=0 → min
q=1 → max
other q → percentile

### Visual character

Data-representation diagram, not an API feature illustration.

---

## FIGURE 10 — `offset` moves selector evaluation

### Placement

Inside the section discussing instant queries / offsets.

Place directly after:

`rate(http_requests_total[5m] offset 1h)`

### Editorial question

**What exactly does `offset 1h` move?**

### Visual

Use two minimal timelines.

NORMAL

T-5m                         T
 |===========================|
                          evaluation


OFFSET 1h

T-1h-5m            T-1h                T
 |===================|------------------|
 selector window                         output evaluation

Clearly show:

the final evaluation remains at `T`.

Only the selector's source window moves.

### Annotation

“offset shifts selector evaluation, not the result timestamp”

### Tone

Extremely simple.

This should be one of the lightest figures.

---

## FIGURE 11 — Vector matching in a distributed engine

### Placement

Inside:

**“GA does not mean every PromQL query”**

after the article identifies full vector matching as the largest remaining gap and explains why matching independently evaluated branches is difficult.

### Editorial question

**Where does PromQL series matching happen when both operands are distributed?**

### Visual

Two real distributed branches.

LEFT

shard 1 ─┐
shard 2 ─┼→ partial left series
shard 3 ─┘

RIGHT

shard 1 ─┐
shard 2 ─┼→ partial right series
shard 3 ─┘


Both feed:

EXCHANGE / SHUFFLE

matching key:

(cluster, namespace)

        ↓

distributed series match

        ↓

cardinality validation

        ↓

output labels

        ↓

arithmetic

Nearby small PromQL chips:

`on(...)`

`ignoring(...)`

`group_left(...)`

`group_right(...)`

### Visual emphasis

The exchange boundary.

The matching key.

The fact that left/right branches may originate on different shards.

This must look like a distributed database execution plan.

Not like two sets of coloured cards.

---

## FIGURE 12 — Pack dimensions before exchange

### Placement

Inside:

**“The next bottleneck is memory”**

immediately after the article introduces the planner change that moves dimension packing from the coordinator to the data nodes.

### Editorial question

**Why does changing one operator's location reduce coordinator memory?**

### Visual

Side-by-side physical plans with an explicit network boundary.

BEFORE

DATA NODE

TS
 ↓
partial stats
 ↓
read dimensions
 ↓

================ NETWORK ================

cluster vector
namespace vector
pod vector
container vector
...

 ↓

COORDINATOR

final stats
 ↓
pack dimensions


AFTER

DATA NODE

TS
 ↓
partial stats
 ↓
read dimensions
 ↓
pack dimensions
 ↓

================ NETWORK ================

packed key
series ordinal / dictionary

 ↓

COORDINATOR

final stats

### Main visual technique

Make the amount of state crossing the exchange visibly different.

Before:
many thin vectors.

After:
one compact packed representation.

### Annotation

“compress cardinality-related state before exchange”

Secondary:

“less coordinator state”

### Importance

This is one of the strongest engineering visuals in the article.

Spend extra design attention here.

---

## FIGURE 13 — The shared engine

### Placement

Inside the final section:

**“Where this is going”**

after the article says:

the goal was not to embed Prometheus inside Elasticsearch, but to make PromQL another native way to program the query engine.

### Editorial question

**What architecture did all of this work converge on?**

### Visual

              ES|QL             PromQL
                 \               /
                  \             /
                   logical plans
                        ↓
                    optimizer
                        ↓
                distributed compute
                        ↓
            columnar/vectorized operators
                        ↓
               Elasticsearch storage

Subtle peripheral labels attached to the shared execution layers:

- exchanges
- aggregation
- memory accounting
- circuit breakers
- vectorized execution

### Main message

PromQL owns Prometheus semantics.

Elasticsearch owns execution.

### Visual relationship

This figure should echo Figure 01.

Figure 01 is the simple thesis.

Figure 13 is the technically informed version of the same thesis after the reader has finished the article.

---

# 8. Figure hierarchy

Not all figures should have equal visual weight.

## Major technical figures

Spend most effort on:

04 — TimeSeriesCollapse

05 — Binary expressions / series matching

06 — Selector locality

11 — Distributed vector matching

12 — Pack before exchange

These should feel closest to query-engine design-document diagrams.

## Medium-weight figures

02 — compilation

03 — rate execution

07 — API surface

09 — native histograms

## Light figures

01 — architectural thesis

08 — compatibility methodology

10 — offset timeline

13 — concluding architecture

This variation is important for article rhythm.

---

# 9. Elegance rules

Every visual should be understandable in approximately 5–15 seconds.

Elegance does NOT mean removing technical information.

Elegance means:

- strong visual hierarchy
- clear topology
- few unnecessary containers
- concise labels
- carefully aligned operators
- generous whitespace
- consistent geometry
- restrained colors
- obvious flow direction

Avoid:

- nested cards
- unnecessary border boxes
- giant headings inside figures
- icons for concepts that are clearer as text
- repetitive captions
- decorative arrows
- gradients
- shadows
- floating abstract shapes

Use whitespace as the main separation mechanism.

---

# 10. Shared components

Build reusable Figma/code primitives for:

- OperatorNode
- SemanticNode
- PhysicalNode
- CodeChip
- LabelSet
- Boundary
- Arrow
- ExchangeBoundary
- Callout
- ErrorMarker
- SeriesSamples
- Shard
- Coordinator
- FigureTitle

Do not build a broad product design system.

This is a small diagram grammar specifically for this engineering article.

---

# 11. Naming

Create one working page / area:

**PromQL Blog Visuals**

Organize frames in article order:

01 — PromQL as a frontend
02 — Compilation pipeline
03 — rate() execution
04 — TimeSeriesCollapse
05 — Binary expressions are joins
06 — Selector locality
07 — Prometheus compatibility surface
08 — Compatibility methodology
09 — Native histograms
10 — Offset semantics
11 — Distributed vector matching
12 — Pack before exchange
13 — Shared engine

Also create:

**Diagram primitives**

for reusable components.

---

# 12. Export readiness

Each figure must:

- work independently on pure white
- not rely on surrounding article UI
- have transparent or white background
- be cleanly exportable as SVG
- remain editable
- avoid raster text
- keep labels legible around 800px render width

The figure title itself may either:

1. be included as a small editable header above the diagram, or
2. be removable so the article heading can serve as the title.

Do not bake article body copy into the visual.

---

# 13. Final consistency pass

Once all 13 exist, inspect them together.

Verify that the article feels like one visual system.

Check:

### Color

Teal always means PromQL / Prometheus semantics.

ElasticBlue always means physical/shared ES execution.

Poppy means something went wrong or changed discontinuously.

### Geometry

Same operator nodes.

Same radius.

Same borders.

Same arrowheads.

Same code chips.

Same exchange boundary.

### Technical clarity

Ask of every figure:

“What technical fact becomes easier to understand because this exists?”

If there is no strong answer, simplify or remove the figure.

### Article flow

The sequence should feel like an engineering narrative:

architecture
→ semantic mismatch
→ new execution primitive
→ branching/join semantics
→ planner bug
→ ecosystem compatibility
→ test methodology
→ new data type
→ temporal semantics
→ distributed matching
→ memory optimization
→ final architecture

That progression is more important than making every section visually symmetrical.

---

# Final quality bar

The visuals should feel native to the article.

They should not look like assets that were designed separately and later attached to it.

A reader should feel that the prose and diagrams were developed together:

the prose introduces a problem,

the figure makes the underlying structure obvious,

and the next paragraph can continue from that shared mental model.

The overall impression should be:

**“an engineer explaining how this actually works”**

rather than:

**“a company illustrating what the product now supports.”**