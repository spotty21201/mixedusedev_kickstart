# PRD — Mixed Use Destination Kickstart (Release 0.0)

## Product title
**Mixed Use Destination Kickstart**

## One-line summary
A scenario generator and **land acquisition evaluator** for small-site, vertical mixed-use destinations that converts site + regulation + program targets into **ranked, buildable stack options**, an **investor-grade snapshot**, and a **land price reasonableness verdict** (asking price/m² vs residual land value vs uplift scenarios).

## Why this exists
Smaller urban lots in Indonesia (and similar markets) increasingly demand **vertical, multi-level mixed-use** solutions. Early-stage planning is high-risk because decisions about **cores, stacking, parking strategy, podium/tower split, and efficiency** quickly determine feasibility and financeability.

Most teams either:
- start with sketches and spreadsheets (slow, inconsistent, hard to defend), or
- jump into 3D massing (looks good, but weak underwriting discipline).

This tool aims to produce **investment-grade clarity early**, without pretending to be a full BIM/code-compliance suite.

## Relationship to Masterplan Kickstart
- **Masterplan Kickstart:** horizontal, 2D, parcel/roads/open space, larger sites.
- **Mixed Use Destination Kickstart:** compact sites, **vertical stacks**, podium/tower logic, core + parking feasibility.

Both are “Kickstart” tools: **fast permutations → ranked scenarios → exportable decision artifacts**.

---

## Goals
1. Generate **credible vertical mixed-use scenarios** from minimal inputs.
2. Provide a **ranking system** aligned with private developer + investor lenses (not just design).
3. Output a **one-page Investment Snapshot** per scenario, plus side-by-side comparison.
4. Make assumptions explicit, editable, and exportable.
5. **Land acquisition evaluation:** determine whether a proposed **land asking price (IDR/m²)** is attractive given the project’s uplift potential under plausible planning/design scenarios.

## Non-goals (Release 0.0)
- Full local code compliance engine (fire egress, travel distance, detailed accessibility).
- Detailed structural/MEP design.
- Photo-real rendering.
- Fully bankable financial model (Release 0.0 provides **proxy underwriting** and ranges).

---

## Primary users
1. **Private Developer / Owner-rep** (default): needs fast feasibility, a clean investor narrative grounded in numbers, and a tool that helps choose *what to build* (and in what stack) before spending on design.
2. **Strategy planner / master planner**: needs scenario logic, defensible metrics, and a consistent assumption system.
3. **Investor-facing team / finance**: needs a concise snapshot, risk controls, and exportable tables.

## Core jobs-to-be-done
- “In 1–2 hours, produce 6–12 feasible vertical mixed-use options and pick the top 3 with defensible metrics.”
- “Generate an investor package that is numbers-first and exportable (no cover page).”
- “Stress test parking, efficiency, and stacking before spending weeks on design.”
- “Evaluate whether the **land price is good**: compute **residual land value**, acquisition feasibility, and upside/downside uplift scenarios.”

---

## MVP deliverables (Release 0.0)
### 0) Guided workflow (mirrors Masterplan Kickstart)
A simple 3-step flow that users can finish without getting lost:
1. **Project Setup** (site + regulation + presets/overrides)
2. **Mix + Stack Allocation** (allocate program across uses; choose typology + parking strategy)
3. **Quick FS** (proxy underwriting outputs + risk controls)

### 1) Scenario Generator
- Generates a set of scenarios based on:
  - envelope options
  - stack typologies
  - parking strategies
  - program mix constraints

### 2) Scenario Comparison Board
- Side-by-side for key metrics
- “Top 3” highlighted based on scoring weights

### 3) Investment Snapshot (PDF-ready)
One page per scenario with:
- site & envelope summary
- stack diagram
- GFA/NLA tables
- parking achieved vs required
- capex + schedule ranges
- revenue/EBITDA/IRR proxy
- risk controls

### 4) Exports
- **PDF snapshot only; no cover page**
- CSV (scenario metrics table)
- Snapshot must include a **Land-on-Sale Acquisition Box**:
  - Asking price IDR/m²
  - Land area m²
  - Total asking price IDR
  - Residual Land Value IDR/m² (base/down/up)
  - Verdict (Good/Borderline/Overpriced) + headroom %

### 5) Controls
- **Reset** returns defaults
- **Rebalance to Preset** fixes allocations back to bands (keeps locked items)

## Key assumptions philosophy
- Use **bands and curves**, not fake precision.
- Every metric must show:
  - **Base case** (default)
  - **Range** (low–high) where appropriate
- All assumptions are visible and editable.

---

## Inputs

### A. Site
- Site boundary (polygon) OR simplified rectangle (Release 0.0 supports both)
- Site area (auto from polygon)
- Frontage(s) count + primary frontage length (optional)
- Adjacent road ROW widths (optional)

### B. Regulation (code-lite)
- Setbacks: front / side / rear
- Max height (m) and/or max floors
- KDB (site coverage) and KLB/FAR
- Optional: podium height cap (floors)
- Optional: basement allowance (yes/no)

### C. Program — modular, combinable land uses
Release 0.0 must support **combinations of uses** and remain extensible.
- Select functions (any subset): Retail (podium/ground), Office, Hotel, Apartment/Residential, Clinic/Hospital (lite)
- Optional add-ons (as “future-use modules” in the taxonomy): F&B, Entertainment, Community, Education, Co-working, Serviced apartment, Event hall, Transit hub (placeholders in v0.0; full logic later)
- Target mix (by % GFA or by absolute GFA)
- Typical module presets:
  - Retail: target NLA % band
  - Office: NLA % band
  - Hotel: keys + average key size + back-of-house factor
  - Residential: unit mix presets + avg unit sizes + sellable efficiency
  - Clinic/Hospital-lite: lease type + GFA placeholders

### D. Parking rules (required; first-class constraint)
- Choose rule preset per function:
  - per 100 m² NLA
  - per key
  - per unit
- Parking strategy options:
  - Surface (if possible)
  - Podium
  - Basement
- Stall size + efficiency factor preset
- Output must explicitly show: required, achieved, gap, and whether the scenario is compliant.

### E. Financial inputs (proxy; private developer defaults)
- Rent (Retail / Office) per m² per month
- Hotel ADR + Occupancy
- Residential selling price per m²
- Target gross yield band
- EBITDA margin band per asset class or blended
- Hospital lease structure (fixed / revenue share / hybrid) (lite)

### E2. Land acquisition inputs (required for investor pitch / land-on-sale use case)
- **Asking land price (IDR/m²)**
- **Land area (m²)** (auto from polygon; editable override)
- **Total asking price (IDR)** (auto-calculated; allow override if the seller quotes a lump sum)
- Acquisition cost adders (editable bands): BPHTB/PPN/fees, due diligence, brokerage, legal (as % or lump sum)
- Holding period assumption (months) + holding cost proxy (optional)

### F. Capex & schedule inputs (proxy)
- Capex per m² by function (band)
- Parking cost multipliers (podium vs basement)
- Schedule multipliers (height + basements)

- Capex per m² by function (band)
- Parking cost multipliers (podium vs basement)
- Schedule multipliers (height + basements)

### G. Presets + overrides (speed with transparency)
- Preset profiles set reasonable default bands for efficiency, parking, capex, yield, and schedule multipliers.
- Users can override any assumption at project level.

## Outputs (required)

### A. Land & development metrics
- Total Site Area (m²)
- Effective Developable Area (m²)
- KDB & KLB assumption used
- Total planned GFA per function
- NLA efficiency (%) per asset class + blended
- Parking ratio (achieved vs required)

### B. Capex
- Capex per m² by function
- Total Phase 1 capex (base + range)
- Infrastructure/parking allocation (core vs optional)
- Construction duration (months)

### C. Revenue assumptions
- Revenue per m² (Retail, Office)
- ADR, occupancy
- Residential selling price per m²
- Hospital lease structure

### D. Financial outputs (proxy)
- Stabilized gross revenue (annual)
- EBITDA margin (%)
- Return metric (Return Score in v0.0; IRR optional later)
- Payback period (years)
- Land value uplift scenario (%)

### D2. Land price reasonableness outputs (new; investor pitch critical)
- **Asking price IDR/m²** and **Total asking price IDR** (headline)
- **Residual Land Value (RLV) IDR/m²** by scenario (base / downside / upside)
- **Acquisition feasibility status** (Good / Borderline / Overpriced) based on RLV vs asking
- **Headroom %** = (RLV − Asking) / Asking
- **Break-even asking price** (max price/m² that still meets target return)
- Optional: sensitivity mini-grid (3×3) on (rent/ADR/sales) × (capex) → impact on RLV

### E. Risk control numbers
- Anchor dependency ratio (% of revenue tied to anchor ecosystem)
- Pre-lease / pre-sales target (%) before construction
- Debt-to-equity ratio target
- Vertical complexity score (derived)

---

## Scenario engine (Release 0.0)

### Step 1 — Envelope generation
Compute buildable envelope candidates from:
- setbacks
- KDB
- height/floors cap
- optional podium cap

Output: 3–6 envelopes (ranked by buildable volume potential)

### Step 2 — Typology templates
Release 0.0 includes 3 archetypes:
1. **Podium + Tower** (default mixed-use)
2. **Mid-rise Slab** (office/resi dominant)
3. **Courtyard Podium + Slim Tower** (destination + amenity emphasis)

### Step 3 — Stacking rules (code-lite)
Rule-based placement (editable presets):
- Retail prioritizes Ground + L2 (and podium levels if destination-led)
- Office prefers lower-to-mid tower, separate lobby optional
- Hotel requires lobby + BOH factor, prefers mid-to-upper
- Residential prefers upper, privacy separation weight
- Clinic/Hospital-lite prefers best access, lower/mid with dedicated circulation weight

### Step 4 — Core & efficiency model
Use preset curves:
- Core area % increases with height and mixed-occupancy count
- Efficiency penalties for:
  - multiple lobbies
  - separated lifts
  - basement ramps
  - podium parking floors

Output: NLA by function + blended efficiency

### Step 5 — Parking feasibility loop
For each scenario:
- compute required stalls
- compute achievable stalls per selected strategy
- if short:
  - add podium parking floors or basements (within caps)
  - or reduce program / adjust mix

### Step 6 — Capex & schedule proxy
- capex = Σ (GFA_function × capex_band) + parking premium
- schedule = base months × height multiplier × basement multiplier

### Step 7 — Financial proxy
Compute:
- stabilized revenue from rents/ADR/sales
- EBITDA using margin band
- return metric (Return Score in v0.0)

### Step 7B — Residual Land Value (RLV) / Land Price Test (new)
Purpose: convert scenario economics into a **max supportable land price** and compare to asking.

Release 0.0 method (proxy, transparent):
- Compute **Stabilized NOI/EBITDA** (from Step 7)
- Compute **Terminal Value** using yield band (or cap rate proxy)
- Estimate **Total Development Cost (TDC)** = Capex + soft costs band + financing/contingency proxy
- Apply **Target Return / Developer Profit** band
- Derive **Residual Land Value**:
  - RLV_total = Terminal Value − TDC − Target Profit (proxy)
  - RLV_per_m² = RLV_total / Land Area

Then compare:
- If Asking ≤ (RLV_per_m² × safety factor) → “Good”
- If Asking near RLV → “Borderline”
- If Asking > RLV → “Overpriced”

Include Base / Downside / Upside cases driven by:
- pricing (rent/ADR/sales)
- capex band
- yield band

### Step 8 — Scoring & ranking
Each scenario gets:
- **Investor Score** (return + de-risking)
- **Buildability Score** (parking compliance + complexity)
- **Efficiency Score** (NLA efficiency)
- **Phaseability Score** (Phase 1 capex & schedule)

Weights are adjustable (default profile: investor).

---

## IRR proxy approach (Release 0.0)
Release 0.0 should behave like Masterplan Kickstart’s Quick FS: fast, transparent, and explicitly “FS-lite.”

Two options; pick one for v0.0:

### Option A — Real IRR (lite model)
- simple cashflow timeline using:
  - construction outflows over duration
  - stabilization ramp
  - terminal value using yield band
- outputs: project IRR and equity IRR (with D/E target)

### Option B — Return Score (if IRR is too heavy for v0.0)
Composite score using normalized metrics:
- EBITDA / Capex
- Payback proxy
- Yield-based terminal value ratio

PRD default: **Option B for Release 0.0**, with a clear upgrade path to Option A in Release 0.1/0.2.

---

## UX / UI (Release 0.0)

### Visual design system (locked for v0.0)
**Typography**
- Sans-serif only (clean, modern, analytical tone)
- Recommended stack: Inter / Helvetica Neue / system-ui fallback
- Clear hierarchy:
  - H1: bold, tight tracking
  - H2: semi-bold
  - Body: regular, high legibility
  - Numeric highlights: tabular numbers enabled

**Color palette**
- Electric Blue (primary accent; actions, highlights, selection states)
- Orange (secondary accent; warnings, uplift, headroom, opportunity)
- Neutral Gray scale (backgrounds, cards, dividers, muted text)
- White dominant background (minimalistic, no gradients in v0.0)

**Design tone**
- Minimalistic
- No decorative illustrations
- Data-first aesthetic
- Large white space
- Subtle shadows only (no heavy borders)

### Design principles (borrowed from Masterplan Kickstart)
- **Guided 3-step workflow**: Setup → Allocation → Quick FS
- **Live feedback**: always show key metrics updating in real time
- **Presets first**: fast start via profiles; overrides remain visible
- **Simple controls**: Reset and Rebalance-to-Preset

### Information architecture
1. **Project Setup** (site + regulation + presets/overrides)
2. **Mix + Stack Allocation** (program allocation + typology + parking strategy)
3. **Quick FS** (capex/revenue inputs + outputs + risk controls)
4. **Compare (optional in v0.0 UI)** (sortable scenario table)
5. **Scenario Detail** (stack diagram + envelope + tables)
6. **Export** (PDF snapshot only; CSV)

### Global “dashboard” header (persistent)
A fixed header bar displaying:
- Site Area
- Effective Buildable Envelope
- Total GFA (base)
- Blended NLA Efficiency
- Parking Compliance (Required vs Achieved)
- Phase 1 Capex (base)
- Return metric (Return Score in v0.0)

Visual behavior:
- Blue highlight when metrics improve
- Orange highlight when constraints are violated (e.g., parking gap, overpriced land)

### Key screens

#### 1) Project Setup
- Clean two-column layout
- Blue accent on editable inputs
- Live envelope preview in grayscale massing
- Summary cards in light gray containers
- Preset selector as pill-style buttons

#### 2) Mix + Stack Allocation
- Slider controls (blue track)
- Locked items display orange lock icon
- Rebalance button in gray with blue hover state
- Real-time metric updates above allocation table

#### 3) Quick FS
- Two-column layout:
  - Left: inputs (clean form grid)
  - Right: financial summary cards
- “Land Acquisition Box” styled in subtle gray card with:
  - Asking price highlighted in neutral
  - RLV in blue
  - Verdict badge:
    - Blue = Good
    - Gray = Borderline
    - Orange = Overpriced

#### 4) Compare Board
- Minimal table
- Sort arrows in blue
- Highlight top scenario with subtle blue border

#### 5) Scenario Detail
- Stack diagram in grayscale with blue/orange labels
- Metric cards evenly spaced
- No heavy graphics

#### 6) Export
- PDF mirrors UI design
- White background
- Blue numeric highlights
- Orange risk indicators
- No cover page

#### Utility controls
- Reset (neutral gray)
- Export (electric blue primary button)

## Data model (conceptual)

### Entities
- Project
- Site
- RegulationAssumptions
- ProgramMix
- ParkingRules
- FinancialAssumptions
- CapexAssumptions
- Scenario
- ScenarioMetrics
- ExportArtifact

### ScenarioMetrics (must include)
- gfa_by_function
- nla_by_function
- efficiency_by_function + blended
- parking_required, parking_achieved, parking_gap
- capex_total, capex_phase1
- duration_months
- revenue_stabilized
- ebitda
- irr_project, irr_equity (or return_score)
- payback_years
- uplift_pct
- dependency_ratio
- prelease_target
- debt_to_equity
- complexity_score

---

## Complexity score (Release 0.0)
A simple index (0–100) derived from:
- number of functions (mixed-occupancy complexity)
- height tier
- number of basement levels
- number of lobbies/cores
- parking strategy

Used for ranking and for risk control messaging.

---

## Defaults (Indonesia-friendly presets)
Release 0.0 ships with:
- 3 archetypes (above)
- Parking rule presets per function
- Efficiency bands per function
- Capex bands per function (editable)
- Schedule multipliers (editable)

All defaults must be editable at project level.

---

## Edge cases & constraints
- Very irregular polygons → envelope generation may produce fewer viable options.
- Extreme parking requirements → scenario generator should surface “infeasible” rather than forcing nonsense.
- Mixed-use with hospital full scope → treated as “lite” in v0.0.

---

## Success metrics
- Time to first defensible scenario set: **< 20 minutes** after inputs.
- Scenarios generated: **6–12** with clear ranking.
- % scenarios parking-compliant: target **> 60%** (given reasonable inputs).
- Export quality: snapshot usable in investor discussions with minimal cleanup.
- Land test usefulness: tool produces a clear **max supportable land price** and a defensible verdict in **< 5 minutes** once assumptions are entered.

## Security & privacy
- Projects saved per user.
- Export artifacts generated on demand.
- No external sharing in v0.0 unless explicitly enabled.

---

## Technical notes (implementation-neutral)
- Frontend: scenario compare + stack visualization
- Backend: scenario generator + calculation engine
- Storage: project JSON + exports
- Deterministic engine first; ML/AI optional later.

---

## Release plan

### Release 0.0 (this PRD)
- Inputs: site + regulation + program + parking + financial/capex bands
- Engine: envelopes + 3 archetypes + parking loop + proxy finance
- Outputs: compare + snapshot PDF + CSV

### Release 0.1 (next)
- Better envelope tools (street edges, multiple frontages)
- Operator presets (hotel brand assumptions, retail productivity bands)
- Scenario notes & narrative blocks for investor deck

### Release 0.2 (later)
- Optional 3D export (SketchUp/Rhino)
- Better code-lite checks (stairs triggers, occupancy separation)
- Multi-phase optimizer

---

## Open questions (to lock before build)
1. Should Release 0.0 compute real IRR (lite model) or use return score?
2. Which functions are mandatory in MVP (retail + resi + hotel?) vs optional?
3. Default investor profile: Indonesia REPE? family office? institutional?
4. How strict should parking compliance be (hard gate vs weighted penalty)?
5. Export style: single-page per scenario + cover page, or one-page only?

