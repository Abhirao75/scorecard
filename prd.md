# Scorecard — Product Requirements Document

**Date:** 2026-02-20
**Version:** 1.8 (manual override reset)

---

## 1. Overview

**Scorecard** is a personal, web-based feature prioritization tool that helps a PM rank features/initiatives using two industry-standard scoring frameworks:

- **RICE** — Reach, Impact, Confidence, Effort
- **ICE** — Impact, Confidence, Ease

It is a single-user personal productivity tool. Data is stored locally in the browser with JSON export/import as a safety net. No backend, no auth.

---

## 2. Problem Statement

Teams often prioritize features based on gut feeling, loudest voices, or HiPPO (Highest Paid Person's Opinion). RICE and ICE scoring bring structured, quantitative rigor to prioritization. A dedicated app makes this fast, visual, and accessible — replacing scattered spreadsheets.

---

## 3. Goals

- Make RICE and ICE scoring fast and intuitive (< 2 minutes to score a feature)
- Display a live-ranked backlog as scores are entered
- Allow side-by-side comparison of RICE vs. ICE ranking
- Persist data locally with JSON backup/restore for data safety
- Support CSV export for stakeholder sharing and CSV import for migrating existing spreadsheets

---

## 4. Non-Goals (v1)

- User authentication / multi-user collaboration
- AI-assisted scoring suggestions
- Integration with Jira, Linear, or other PM tools
- Mobile-optimized layout
- Dark mode
- Multiple separate project workspaces (tags handle context separation)
- Real-time sharing or collaborative URLs

---

## 5. Scoring Frameworks

### 5.1 RICE Score

```
RICE Score = (Reach × Impact × Confidence) / Effort
```

| Field       | Description                                               | Input Type          | Range / Options                                       |
|-------------|-----------------------------------------------------------|---------------------|-------------------------------------------------------|
| Reach       | # of users affected per quarter                          | Number input        | Any positive integer                                  |
| Impact      | Magnitude of impact per user                             | Dropdown            | Massive=3, High=2, Medium=1, Low=0.5, Minimal=0.25   |
| Confidence  | Certainty in your estimates                              | Dropdown            | High=100%, Medium=80%, Low=50%                        |
| Effort      | Estimated effort to design, build, and ship              | Dropdown (Fibonacci)| 1, 2, 3, 5, 8, 13, 21 story points                   |

### 5.2 ICE Score

```
ICE Score = (Impact × Confidence × Ease) / 10
```

Normalized to a 0–100 scale (max: 10×10×10 / 10 = 100).

| Field      | Description                                              | Input Type              | Range |
|------------|----------------------------------------------------------|-------------------------|-------|
| Impact     | How much will this move the needle?                     | Clickable button grid   | 1–10  |
| Confidence | How confident are you in this estimate?                 | Clickable button grid   | 1–10  |
| Ease       | How easy is this to implement? (inverse of effort)      | Clickable button grid   | 1–10  |

The button grid is an NPS-style row of 10 numbered buttons; the selected value is highlighted.

---

## 6. Core Features

### 6.1 Feature Management

- **Add feature**: Name (required), description (optional), tags (optional), notes (optional)
- **Edit feature**: Update any field inline
- **Delete feature**: With confirmation prompt
- **Duplicate feature**: Clone a feature to quickly create variants
- **Status field**: Each feature has a status — `Planned` | `In Progress` | `Done`
- **Notes/comments**: Freeform text area per feature for reasoning, links, or context

### 6.2 Scoring Interface

- Each feature card expands and shows a **tabbed interface** — one tab for RICE, one for ICE
- Scores calculate in real-time as inputs change
- Visual color-coded chip shows the computed score for each framework
- Features can be scored with RICE, ICE, or both

### 6.3 Ranked Backlog View

- Master list ranked by selected framework (toggle: RICE / ICE / Both)
- **Both view**: Two columns side-by-side with rank delta indicators (▲▼)
  - Drag-and-drop to manually reorder is **disabled** in Both view
  - Switch to single-framework view (RICE or ICE) to drag-reorder
- **Single-framework view**: Supports drag-and-drop reordering; a "manual override" badge appears on features that have been moved
- Unscored features in the other framework appear **grayed out at the bottom** with a "Not scored" placeholder
- Sortable columns: Score, Name, Tag, Date Added, Status
- Filter by tag (autocomplete from existing tags)
- Filter by status

### 6.4 Manual Override

- In single-framework view, drag-and-drop to reorder
- Manually moved features get a visual "manual override" indicator (e.g., a pin icon or badge)
- Override can be cleared to restore score-based ranking

### 6.5 Data Persistence

- All data auto-saved to `localStorage` on every change
- **JSON export**: Download full dataset as a `.json` file for backup
- **JSON import**: Upload a `.json` file to restore data (with a warning about overwriting)
- "Clear all data" option with confirmation

### 6.6 CSV

- **Export**: Ranked list as CSV including all fields (name, description, tags, status, notes, all RICE inputs + score, all ICE inputs + score)
- **Import**: Upload a CSV to bulk-create features. Expected columns: `name` (required), `description`, `tags` (comma-separated), and optionally all RICE/ICE input columns

### 6.7 Empty State

- On first load, show **2–3 pre-loaded sample features** with realistic scores to demonstrate the UI
- A dismissible banner says "These are sample features — delete them and add your own"

---

## 7. User Interface

### 7.1 Visual Style

- **Polished product aesthetic**: subtle shadows, soft gradients, card-based layout
- **Brand / accent color**: Indigo/violet (à la Linear, Notion)
- Light mode only (no dark mode in v1)
- Clean typography with generous whitespace

### 7.2 Layout

```
┌──────────────────────────────────────────────────────────────┐
│  Scorecard                           [Import] [Export ▾]     │
├──────────────────────────────────────────────────────────────┤
│  [+ Add Feature]  View: [RICE] [ICE] [Both]  Filter: [tags▾] │
├──────────────────────────────────────────────────────────────┤
│  RICE Ranked                  │  ICE Ranked                  │
│  ─────────────────────────────│──────────────────────────────│
│  #1  Dark Mode          120.0 │  #1  Dark Mode          81.0 │
│  #2  Search              95.0 │  #2  Onboarding  ▲2    72.0 │
│  #3  Onboarding ▼1       72.0 │  #3  Search      ▼1    64.0 │
│  #4  Offline mode  ⚠ manual   │  #4  Offline mode  Not scored│
└──────────────────────────────────────────────────────────────┘
```

### 7.3 Feature Card (Expanded)

```
┌──────────────────────────────────────────────────────────────┐
│  Search Feature              Status: [Planned ▾]  [Delete]   │
│  "Global search across all content"    #search  #growth      │
│                                                              │
│  [RICE]  [ICE]                   ← tabs                      │
│  ──────────────────────────────────────────────────────────  │
│  Reach:      [  500  ]                                       │
│  Impact:     [High       ▾]                                  │
│  Confidence: [Medium      ▾]                                 │
│  Effort:     [  5    ▾]   (Fibonacci SP)                     │
│                                                              │
│  RICE Score:  ████████░░  80.0                               │
│                                                              │
│  Notes:                                                      │
│  ┌────────────────────────────────────────────────────────┐  │
│  │ Needed for Q2. Research suggests 80% of power users    │  │
│  │ cite this as a top request.                            │  │
│  └────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────┘
```

---

## 8. Technical Architecture

### 8.1 Tech Stack

| Layer     | Choice              | Rationale                                              |
|-----------|---------------------|--------------------------------------------------------|
| Framework | React (Vite)        | Fast dev setup, component model fits card UI           |
| Styling   | Tailwind CSS        | Utility-first, no design system overhead               |
| State     | Zustand             | Lightweight global state, easy localStorage sync       |
| Storage   | localStorage        | Zero backend, works offline, instant persistence       |
| Export    | PapaParse           | CSV parse/generation from JSON                         |
| DnD       | @dnd-kit/sortable   | Accessible drag-and-drop for rank override             |
| Icons     | Lucide React        | Clean icon set, tree-shakeable                         |

### 8.2 Data Model

```typescript
type Status = 'planned' | 'in-progress' | 'done';

interface Feature {
  id: string;           // UUID
  name: string;
  description?: string;
  notes?: string;
  tags: string[];
  status: Status;
  createdAt: string;    // ISO date
  riceManualRank?: number;  // set when user drag-overrides RICE order
  iceManualRank?: number;   // set when user drag-overrides ICE order
  rice: {
    reach: number;
    impact: number;         // 0.25 | 0.5 | 1 | 2 | 3
    confidence: number;     // 0.5 | 0.8 | 1.0
    effort: number;         // Fibonacci SP: 1 | 2 | 3 | 5 | 8 | 13 | 21
    score: number;          // computed: (reach × impact × confidence) / effort
  } | null;
  ice: {
    impact: number;         // 1–10
    confidence: number;     // 1–10
    ease: number;           // 1–10
    score: number;          // computed: (impact × confidence × ease) / 10
  } | null;
}

interface AppState {
  features: Feature[];
  tags: string[];           // derived from all feature tags, for autocomplete
}
```

### 8.3 Scoring Logic

**RICE:**
```
score = (reach × impact × confidence) / effort
```
Round to 1 decimal. Sorted descending. Manual overrides take precedence.

**ICE:**
```
score = (impact × confidence × ease) / 10
```
Normalized 0–100. Round to 1 decimal. Sorted descending.

**Ranking with manual overrides:**
- Features with `riceManualRank` set are sorted by that value first; others fall below sorted by score.
- A visual badge distinguishes manually-ranked items.

### 8.4 File Structure

```
prioritization-app/
├── prd.md
├── package.json
├── vite.config.ts
├── index.html
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── store/
│   │   └── useFeatureStore.ts     # Zustand + localStorage sync
│   ├── components/
│   │   ├── Header.tsx
│   │   ├── AddFeatureModal.tsx
│   │   ├── FeatureCard.tsx
│   │   ├── RiceForm.tsx
│   │   ├── IceForm.tsx            # NPS-style button grid for 1–10 inputs
│   │   ├── RankedList.tsx
│   │   ├── SortableFeatureRow.tsx # dnd-kit wrapper
│   │   └── ExportImportMenu.tsx
│   ├── utils/
│   │   ├── scoring.ts             # RICE/ICE calculation logic
│   │   ├── export.ts              # CSV + JSON export
│   │   ├── import.ts              # CSV + JSON import + validation
│   │   └── sampleData.ts         # Pre-loaded sample features
│   └── types.ts
```

---

## 9. User Stories

| ID   | As a PM, I want to...                                    | So that...                                          |
|------|----------------------------------------------------------|-----------------------------------------------------|
| US-1 | Add a feature and score it with RICE and/or ICE          | I can quantify its priority                         |
| US-2 | See features ranked by RICE or ICE score                 | I can immediately see what to build next            |
| US-3 | Compare RICE vs. ICE rankings side-by-side               | I can spot divergence between frameworks            |
| US-4 | See rank delta indicators (▲▼) in Both view              | I can quickly spot where the frameworks disagree    |
| US-5 | Drag to manually override rank in single-framework view  | I can override the math with judgment when needed   |
| US-6 | Add status (Planned/In Progress/Done) to each feature    | I can see which items have moved to execution       |
| US-7 | Add notes per feature                                    | I can capture reasoning, links, and context         |
| US-8 | Filter by tag and status                                 | I can focus on a specific initiative or phase       |
| US-9 | Export as CSV                                            | I can share rankings in stakeholder presentations   |
|US-10 | Import features from a CSV                              | I can migrate from my existing spreadsheet          |
|US-11 | Export and import a JSON backup                         | I can safeguard my data against browser storage loss|
|US-12 | See sample features on first load                       | I understand what the app looks like before adding data |
|US-13 | See at a glance which frameworks each feature has been scored in | I can quickly spot gaps in my backlog without opening every card |
|US-14 | See a per-framework completeness summary above the ranked list | I know how much of my backlog is scored at a glance    |
|US-15 | Filter to show only unscored features, or sort by completeness | I can focus on filling gaps before a planning session  |

---

## 10. Acceptance Criteria

- [ ] RICE score = `(Reach × Impact × Confidence) / Effort`, rounded to 1 decimal
- [ ] ICE score = `(Impact × Confidence × Ease) / 10`, rounded to 1 decimal (0–100 scale)
- [ ] RICE Effort uses Fibonacci dropdown: 1, 2, 3, 5, 8, 13, 21
- [ ] ICE inputs use a clickable 1–10 button grid (NPS style)
- [ ] Ranked list updates instantly when any input changes
- [ ] Both view shows two columns with rank delta indicators (▲▼)
- [ ] Drag-and-drop ranking works only in single-framework view (RICE or ICE), not Both view
- [ ] Manually ranked features show a visual override badge
- [ ] Features with no ICE score appear at the bottom of the ICE column as "Not scored" (grayed)
- [ ] Status field (Planned / In Progress / Done) visible and editable on each card
- [ ] Tags support free-text input with autocomplete from previously used tags
- [ ] Notes field available on each feature card
- [ ] Data persists across page refresh via localStorage
- [ ] JSON export downloads full dataset; JSON import restores it with an overwrite warning
- [ ] CSV export includes all fields; CSV import creates features from `name` column (minimum)
- [ ] First-time load shows 2–3 sample features with a dismissible "these are samples" banner
- [ ] Deleting a feature requires a confirmation step
- [ ] App works in Chrome, Firefox, and Safari

---

## 11. Out-of-Scope for v1 (Future Backlog)

| Feature                          | Notes                                          |
|----------------------------------|------------------------------------------------|
| Multi-user / team workspaces     | Requires backend + auth                        |
| Cloud sync                       | Could use Supabase or Firebase in v2           |
| Dark mode                        | Light mode only for v1                         |
| WSJF / Kano / MoSCoW frameworks | Additional scoring models for future           |
| AI score suggestions             | LLM-assisted scoring based on feature desc     |
| Jira / Linear import             | Pull feature backlog automatically             |
| Weighted scoring                 | Custom weights per RICE/ICE dimension          |
| Score history / audit log        | Track how scores change over time              |
| Shareable read-only URL          | Requires backend or encoded URL state          |
| Mobile-optimized layout          | Responsive improvements post-v1               |

---

## 12. Framework Info Collapsibles (v1.2 Feature)

### 12.1 Overview

Two layers of educational content help users understand RICE and ICE without leaving the app:

1. **Global info panel** — sits between the controls bar and the ranked list, always accessible
2. **Per-tab info panel** — inside each RICE and ICE tab on every feature card

Both use the same collapsible banner pattern with consistent styling and animation.

---

### 12.2 Collapsed State

Both instances render as a banner-style row when closed:

```
📖 Learn how RICE scoring works                                          ▾
```
```
📖 Learn how ICE scoring works                                           ▾
```

The global version uses a slightly larger, more prominent style. Per-tab versions are more compact to fit within the card.

---

### 12.3 First-Visit Behavior & Persistence

- **First visit ever**: the **global** panel renders **expanded** automatically
- Once the user collapses it (clicks the banner), `scorecard-info-dismissed` is written to `localStorage`
- On all subsequent visits: both global and per-tab panels start **collapsed**
- Individual per-tab panels can always be toggled independently and do not persist state (they reset to collapsed on each page load)

---

### 12.4 Global Info Panel Content

Displayed between the controls bar and the ranked list. Contains four sections:

#### Side-by-side RICE vs ICE comparison table

| | RICE | ICE |
|---|---|---|
| **Formula** | (Reach × Impact × Confidence) / Effort | (Impact × Confidence × Ease) / 10 |
| **Best for** | Data-driven teams with usage metrics | Quick gut-check scoring, early stage |
| **Inputs** | 4 fields (one numeric, three structured) | 3 fields (1–10 scales) |
| **Output range** | Unbounded (higher = better) | 0–100 (normalized) |

#### When to use which framework

- **Use RICE** when you have user data (reach numbers), want to factor in engineering cost precisely, and need a defensible score for stakeholder presentations
- **Use ICE** when you're early-stage or don't have reach data yet, need to score quickly, or want a simple gut-check before deeper analysis
- **Use both** to spot divergence — if a feature ranks very differently across frameworks, that's a signal worth investigating

#### Worked example

Walk through scoring a sample feature ("Email Notifications") in both frameworks, showing all inputs and the resulting score:

- RICE: Reach=600, Impact=High(2), Confidence=Medium(80%), Effort=3sp → Score = (600×2×0.8)/3 = **320.0**
- ICE: Impact=8, Confidence=7, Ease=6 → Score = (8×7×6)/10 = **33.6**

#### External resources

- Link to Intercom's original RICE framework post
- Link to Sean Ellis's ICE scoring article

---

### 12.5 Per-Tab Info Panels (Inside Feature Cards)

Each scoring tab (RICE and ICE) has its own collapsible panel rendered **above** the form fields. Content is scoped to only that framework.

#### RICE tab panel content

**Formula (large, prominent):**
```
RICE = (Reach × Impact × Confidence) / Effort
```
Color-coded: Reach (blue), Impact (green), Confidence (amber), Effort (rose)

**Field explanations with examples:**
- **Reach** — Number of users/customers affected in a quarter. *e.g. 500 = 500 users see this change*
- **Impact** — How much it moves the needle per user. Massive=3× multiplier, down to Minimal=0.25×
- **Confidence** — How sure you are. High=100%, Medium=80%, Low=50%
- **Effort** — Story points to build it. Higher effort shrinks the score

**Score interpretation bands:**
| Score range | Signal |
|---|---|
| 500+ | Exceptional — very high reach or impact, low effort |
| 100–499 | Strong candidate |
| 10–99 | Moderate — worth doing but not urgent |
| < 10 | Low priority or high-effort |

*(Bands are relative guides, not absolutes — always compare features within the same backlog)*

---

#### ICE tab panel content

**Formula (large, prominent):**
```
ICE = (Impact × Confidence × Ease) / 10
```
Color-coded: Impact (blue), Confidence (green), Ease (amber)

**Field explanations with examples:**
- **Impact** — How much will this move the needle? 10 = transformative, 1 = negligible
- **Confidence** — How confident are you in this estimate? 10 = very certain, 1 = pure guess
- **Ease** — How easy to implement? 10 = trivial (days), 1 = extremely complex (months)

**Score interpretation bands (0–100):**
| Score range | Signal |
|---|---|
| 70–100 | High priority — high impact, confident, easy |
| 40–69 | Strong candidate |
| 15–39 | Moderate — trade-offs exist |
| < 15 | Low priority or low-confidence guess |

---

### 12.6 Visual Design

- **Formula rendering**: Large monospace/code-style block with each variable in its own color
- **Color scheme for formula parts**:
  - Reach / Impact (ICE): `indigo`
  - Impact (RICE) / Confidence (ICE): `emerald`
  - Confidence (RICE) / Ease: `amber`
  - Effort: `rose`
- **Score bands**: Rendered as a simple horizontal scale with color-coded segments (green → yellow → red from high to low)
- **Collapsible animation**: smooth `max-height` CSS transition, ~200ms ease-out
- **Panel background**: subtle `indigo-50` tint with a left border accent to visually separate from the form

---

### 12.7 New Components

| Component | Description |
|---|---|
| `FrameworkInfoPanel.tsx` | Reusable collapsible banner. Accepts `framework: 'rice' \| 'ice' \| 'global'` prop. Handles its own open/closed state. |
| `FormulaDisplay.tsx` | Renders the color-coded formula equation |
| `ScoreBands.tsx` | Horizontal score interpretation scale |

---

### 12.8 Acceptance Criteria

- [ ] Global panel renders expanded on first-ever visit; collapses to banner after first dismiss; stays collapsed on all future visits
- [ ] Per-tab panels always start collapsed; can be toggled freely; state does not persist
- [ ] Both collapsed states show the `📖 Learn how [X] scoring works ▾` banner
- [ ] Global panel includes: comparison table, when-to-use guidance, worked example, external links
- [ ] RICE tab panel includes: color-coded formula, field explanations with examples, score interpretation bands
- [ ] ICE tab panel includes: color-coded formula, field explanations with examples, 0–100 score bands
- [ ] Collapsible animation is smooth (no layout jump)
- [ ] External links open in a new tab

---

## 13. Onboarding Flow (v1.3 Feature)

### 13.1 Overview

A welcome modal appears on the very first visit to Scorecard. It uses a split-layout (UI mockup left, content right) with 4 focused slides. Users can skip at any time or jump between slides using clickable dot indicators. After completion, onboarding never appears again — the global info panel also does not auto-open since onboarding already covered that ground.

---

### 13.2 Trigger & Persistence

| localStorage key | Set when | Effect |
|---|---|---|
| `scorecard-onboarding-complete` | User clicks final CTA **or** clicks Skip | Modal never appears again |
| `scorecard-info-dismissed` | Also set when onboarding completes | Global info panel starts collapsed (no duplicate education) |

- If `scorecard-onboarding-complete` is absent → show modal on load, behind it the app is blurred/dimmed
- After completing (or skipping) onboarding → sample features appear, app becomes fully interactive

---

### 13.3 Modal Visual Design

- **Layout**: Two-column split. Left half = visual panel (indigo gradient bg + stylized UI mockup). Right half = text content.
- **Size**: Large centered modal (`max-w-4xl`), full-height panels side by side
- **Background**: App visible but with a `backdrop-blur-sm` + `bg-black/40` overlay
- **Navigation**: Row of clickable dot indicators at the bottom of the right panel. Active dot = filled indigo. Inactive = gray outline.
- **Skip**: Small `Skip` text link in the top-right corner of the modal on every slide
- **Transition**: Slide content fades/transitions smoothly when changing steps

---

### 13.4 Slide Specifications

#### Slide 1 — Welcome

**Left panel (visual):**
- Indigo gradient background
- Stylized mockup of the main Scorecard ranked list: 3 feature rows with rank numbers, score chips, and ▲▼ delta badges visible

**Right panel (content):**
- Headline: `Welcome to Scorecard`
- Subheading: `Stop prioritizing by gut feel.`
- Body: `Scorecard uses two industry-standard frameworks — RICE and ICE — to score and rank your features objectively. No more HiPPO decisions.`
- CTA: `Get started →` (advances to slide 2)

---

#### Slide 2 — Why Structured Scoring?

**Left panel (visual):**
- Before/After split mockup:
  - **Before** (top half, muted): a plain bulleted list with labels like "CEO says so", "Loudest request", "Seems important"
  - **After** (bottom half, vivid): the Scorecard ranked list with numeric scores and ranked positions

**Right panel (content):**
- Headline: `Replace opinions with scores`
- Body: `RICE and ICE are scoring frameworks used by top product teams. Each gives you a number — so you can compare features objectively and defend your roadmap decisions.`
- Mini comparison (2-column):
  - **RICE** — best when you have user data and want to factor in engineering cost
  - **ICE** — best for quick gut-check scoring when you're early-stage
- Note: `Use both to spot where the frameworks disagree — that divergence is worth investigating.`

---

#### Slide 3 — How to Score a Feature

**Left panel (visual):**
- Stylized feature card in its expanded state, showing:
  - Feature name and description at top
  - The RICE / ICE tab switcher
  - RICE tab active: Reach input, Impact dropdown, Confidence dropdown, Effort Fibonacci buttons
  - Score chip showing a computed value (e.g. `RICE 320.0`)

**Right panel (content):**
- Headline: `Scoring takes under 2 minutes`
- Steps (numbered list):
  1. Click `+ Add Feature` and give it a name
  2. Expand the card and open the **RICE** or **ICE** tab
  3. Fill in the fields — scores calculate instantly
  4. Repeat for your backlog — Scorecard ranks everything automatically
- Note: `Not sure what a field means? Hit the 📖 info banner inside each tab.`

---

#### Slide 4 — Reading Results & Staying Safe

**Left panel (visual):**
- Stylized **Both view** showing two ranked columns side by side:
  - RICE column with rank numbers and scores
  - ICE column with matching features, some with ▲2 / ▼1 delta badges
  - One feature showing a "Not scored" placeholder in the ICE column

**Right panel (content):**
- Headline: `Your ranked backlog, your data`
- Three brief bullets:
  - `📊 Switch between RICE, ICE, or Both view using the toggle at the top`
  - `▲▼ Rank deltas in Both view show where the two frameworks disagree`
  - `💾 Your data is saved automatically. Export JSON anytime as a backup.`
- Final CTA button: `Explore the app` (completes onboarding, closes modal)

---

### 13.5 Sequencing After Onboarding Completes

```
User clicks "Explore the app" (or Skip)
  → Set scorecard-onboarding-complete = true
  → Set scorecard-info-dismissed = true
  → Close modal
  → App is now fully interactive
  → Sample features are visible with their dismissible banner
  → Global info panel is collapsed (not auto-opened)
```

---

### 13.6 New Component

| Component | Description |
|---|---|
| `OnboardingModal.tsx` | Self-contained modal. Reads/writes localStorage keys. Manages current slide state. Rendered in `App.tsx` before anything else. |

---

### 13.7 Acceptance Criteria

- [ ] Modal appears automatically on first-ever visit (no `scorecard-onboarding-complete` in localStorage)
- [ ] Modal never appears again after completion or skip
- [ ] Both `scorecard-onboarding-complete` and `scorecard-info-dismissed` are set on completion
- [ ] Skip link is visible on every slide and immediately closes the modal
- [ ] Dot indicators are clickable and jump to the corresponding slide
- [ ] Left panel shows a stylized UI mockup relevant to each slide's content
- [ ] Slide 2 left panel shows the before/after gut-feel vs scored list comparison
- [ ] Slide 3 left panel shows an expanded feature card with RICE scoring fields
- [ ] Slide 4 left panel shows the Both view with rank deltas and a "Not scored" placeholder
- [ ] Final CTA ("Explore the app") closes modal and reveals the app with sample features
- [ ] Backdrop blur is applied to the app behind the modal
- [ ] Slide transitions are smooth

---

## 14. Scoring Completeness Indicators (v1.4 Feature)

### 14.1 Overview

Users need to know at a glance how much of their backlog has been scored — without opening every card. This feature adds three complementary surfaces:

1. **Per-card chip indicator** — score chips on each feature card reflect whether that framework has been scored
2. **Summary stat bar** — a compact per-framework breakdown above the ranked list ("RICE: 8/12 · ICE: 5/12")
3. **Filter & sort controls** — a "Sort by completeness" option and a "Hide scored" toggle in the filter bar

These surfaces work together to make coverage gaps visible and actionable before a planning session.

---

### 14.2 Completeness Definition

A feature is considered **scored** (complete) if it has at least one framework scored — i.e., its `rice` field is not `null` **or** its `ice` field is not `null`.

A feature is **unscored** (incomplete) only if both `rice` and `ice` are `null`.

Completeness is tracked **per framework** for the summary stat and chip indicator:

| State | `rice` | `ice` |
|---|---|---|
| Fully complete | not null | not null |
| RICE only | not null | null |
| ICE only | null | not null |
| Unscored (incomplete) | null | null |

---

### 14.3 Per-Card Completeness Indicator

Score chips on each feature card are updated to always render — one for RICE and one for ICE — regardless of whether a score exists. Their visual state communicates completeness:

| Framework state | Chip appearance |
|---|---|
| Scored | Full opacity — existing color (indigo for RICE, violet for ICE), shows computed score (e.g. `RICE 80.0`) |
| Not scored | ~40% opacity — same chip shape and color, shows `RICE —` or `ICE —` as placeholder text |

**Before (current behavior):** RICE and ICE chips only appear when the score exists (null → no chip rendered).

**After (new behavior):** Both chips always render. The chip is dimmed when the corresponding framework is unscored.

This ensures users always see the scoring coverage state of a feature without having to expand the card.

---

### 14.4 Summary Stat Bar

A compact summary row appears between the controls bar and the ranked list (below the existing framework info panel), replacing or sitting alongside the global info panel.

**Format:**

```
RICE: 8 / 12 scored   ·   ICE: 5 / 12 scored
```

- Numbers update reactively as features are scored
- Counts apply to the **filtered** set of features (respects active tag and status filters)
- Styled as a subdued informational row — small text, muted color — so it doesn't compete with the ranked list

**Placement:** Directly above the ranked list, below the `FrameworkInfoPanel`.

---

### 14.5 Filter & Sort Controls

Two new controls are added to the existing controls bar:

#### Sort by Completeness

A new **"Completeness"** option added to the existing sort-by control (or as a standalone sort toggle if no sort dropdown currently exists). When selected:

- Features with at least one framework scored appear before features with no scores
- Within each completeness tier, the existing score-based sort order is preserved
- The sort applies independently in RICE view, ICE view, and Both view

#### Hide Scored Toggle

A **"Hide scored"** toggle button added to the filter bar. When active:

- Only features where **both** `rice` and `ice` are `null` are shown (i.e., fully unscored features)
- The button is visually distinct when active (filled/indigo state vs. outline state)
- Label: `Hide scored` (toggled off) → `Showing unscored only` (toggled on)
- Clears automatically when "Clear filters" is clicked

```
[+ Add Feature]  [RICE] [ICE] [Both]  [Tags ▾]  [Status ▾]  [Hide scored]  [Clear filters]
```

---

### 14.6 Sorting Behavior

Unscored features (both `rice` and `ice` null) are **always sorted last** within the ranked list, regardless of the active view or sort option. This extends and formalizes the existing behavior where unscored features appear at the bottom in single-framework view.

**Precedence order** (highest to lowest priority):

1. Manual override rank (`riceManualRank` / `iceManualRank`) — existing behavior
2. Completeness tier — scored features rank above unscored features
3. Score-based rank within each tier — descending by score
4. Sort-by-completeness option overrides tier ordering when explicitly selected

---

### 14.7 Visual Design

- **Dimmed chip opacity:** `opacity-40` (Tailwind) — approximately 40% opacity
- **Chip placeholder text:** `RICE —` and `ICE —` (em dash) when unscored
- **Chip colors:** Unchanged from existing — RICE uses `bg-indigo-100 text-indigo-700`, ICE uses `bg-violet-100 text-violet-700`; dimming is achieved with opacity, not color change
- **Summary stat row:** `text-sm text-gray-500`, same line as a subtle horizontal rule, no background fill — keeps visual hierarchy subordinate to the ranked list
- **"Hide scored" toggle:** Matches style of the existing "Clear filters" button — small, outlined; when active, switches to `bg-indigo-100 text-indigo-700` to signal it's filtering

---

### 14.8 Component Changes

No new components required. Changes are localized to existing files:

| File | Change |
|---|---|
| `FeatureCard.tsx` | Always render both RICE and ICE chips; add `opacity-40` when score is null; use `—` as placeholder text |
| `App.tsx` | Add summary stat bar JSX below `FrameworkInfoPanel`; add "Hide scored" toggle and sort option to controls bar; wire up filter state |
| `RankedList.tsx` | Update sort logic to enforce unscored-last ordering; accept `hideScored` and `sortByCompleteness` props |
| `useFeatureStore.ts` | Add derived selector for per-framework scored counts (for summary stat) |

---

### 14.9 Acceptance Criteria

- [ ] Both RICE and ICE score chips always render on every feature card (never absent)
- [ ] When a framework is unscored (`null`), its chip shows at ~40% opacity with `RICE —` / `ICE —` placeholder text
- [ ] When a framework is scored, its chip shows at full opacity with the computed score
- [ ] Summary stat row appears above the ranked list showing `RICE: X / Y scored · ICE: X / Y scored`
- [ ] Summary stat counts update reactively as scores are entered
- [ ] Summary stat counts reflect the currently active tag and status filters
- [ ] "Completeness" sort option is available in the sort controls
- [ ] "Hide scored" toggle button appears in the filter bar
- [ ] "Hide scored" when active shows only features where both `rice` and `ice` are `null`
- [ ] "Hide scored" toggle is cleared when "Clear filters" is clicked
- [ ] Unscored features (both null) always appear below scored features in the ranked list
- [ ] Sort order within the scored tier continues to use score-based descending sort
- [ ] All three completeness surfaces (chips, summary, filter/sort) remain consistent with each other

---

## 15. Context-Aware View Simplification (v1.5 Feature)

### 15.1 Overview

In v1.4 and earlier, every feature card always shows both RICE and ICE score chips, a RICE/ICE tab switcher, a per-card Learn collapsible, and the global Learn panel shows full comparison content regardless of which framework view is active. This creates unnecessary noise: when a user is focused on RICE scoring, ICE elements are irrelevant clutter, and vice versa.

v1.5 makes the UI **context-aware**: what the user sees inside a feature card and above the ranked list changes based on whether they are in RICE view, ICE view, or Both view.

---

### 15.2 Behavior by View

| Surface | RICE view | ICE view | Both view |
|---|---|---|---|
| Feature card scoring area | RICE form directly (no tabs) | ICE form directly (no tabs) | RICE / ICE tab switcher (existing behavior) |
| Score chip(s) on card | RICE chip only | ICE chip only | Both chips (existing v1.4 behavior) |
| Per-card Learn collapsible | Hidden (removed) | Hidden (removed) | Shown (existing behavior) |
| Global Learn panel content | RICE-only content | ICE-only content | Full comparison content (existing behavior) |

---

### 15.3 Feature Card — Scoring Area

**Current behavior (v1.4):** Every expanded feature card shows a `[RICE] [ICE]` tab switcher, regardless of the active view.

**New behavior (v1.5):**

- **RICE view**: The tab switcher is removed. The RICE scoring form renders directly in the card body with no tab chrome. Label/heading "RICE Score" is shown inline above the score output.
- **ICE view**: The tab switcher is removed. The ICE scoring form renders directly in the card body. Label/heading "ICE Score" is shown inline.
- **Both view**: The existing `[RICE] [ICE]` tab switcher is preserved and functions identically to current behavior.

---

### 15.4 Score Chips on Feature Cards

**Current behavior (v1.4):** Both RICE and ICE chips always render on every card (with dimming when unscored, per v1.4 spec).

**New behavior (v1.5):**

- **RICE view**: Only the RICE chip renders. The ICE chip is not rendered at all (not dimmed, not a placeholder — fully absent).
- **ICE view**: Only the ICE chip renders. The RICE chip is fully absent.
- **Both view**: Both chips render exactly as specified in v1.4 (full opacity when scored, ~40% opacity with `RICE —` / `ICE —` placeholder when unscored).

This overrides the v1.4 "always render both chips" behavior for single-framework views.

---

### 15.5 Per-Card Learn Collapsible

**Current behavior (v1.4 / v1.2):** Every feature card, on both the RICE tab and ICE tab, shows a collapsible `📖 Learn how [X] scoring works ▾` panel scoped to that tab's framework.

**New behavior (v1.5):**

- **RICE view**: The per-card Learn collapsible is not rendered. The card shows only the form and score.
- **ICE view**: Same — no per-card Learn collapsible.
- **Both view**: The per-card Learn collapsible is retained on each tab (RICE tab shows RICE content, ICE tab shows ICE content), exactly as currently implemented.

Rationale: In single-framework view, the global Learn panel above the ranked list already provides framework-specific reference. A second Learn entry point on every card is redundant and adds vertical clutter.

---

### 15.6 Global Learn Panel (Above Ranked List)

**Current behavior:** The global `FrameworkInfoPanel` always shows full comparison content: RICE vs ICE comparison table, when-to-use guidance, worked example (both frameworks), and external links — regardless of active view.

**New behavior (v1.5):**

- **RICE view**: The global panel renders **RICE-only content**:
  - RICE formula (color-coded)
  - RICE field explanations with examples (Reach, Impact, Confidence, Effort)
  - RICE score interpretation bands (500+, 100–499, 10–99, < 10)
  - *(No ICE content, no comparison table, no ICE worked example)*

- **ICE view**: The global panel renders **ICE-only content**:
  - ICE formula (color-coded)
  - ICE field explanations with examples (Impact, Confidence, Ease)
  - ICE score interpretation bands (70–100, 40–69, 15–39, < 15)
  - *(No RICE content, no comparison table)*

- **Both view**: The global panel renders the **full comparison content** exactly as currently implemented (comparison table, when-to-use guidance, worked example for both frameworks, external links).

The collapsed banner label updates to match the active view:
- RICE view: `📖 Learn how RICE scoring works ▾`
- ICE view: `📖 Learn how ICE scoring works ▾`
- Both view: `📖 Learn how RICE and ICE scoring works ▾` (existing)

The `FrameworkInfoPanel` component already accepts a `framework: 'rice' | 'ice' | 'global'` prop — v1.5 wires this prop to the active view state.

---

### 15.7 Summary of Changes to Prior Spec Sections

| Prior section | Change |
|---|---|
| §6.2 Scoring Interface | Feature cards no longer always show tab switcher; tabs only appear in Both view |
| §12 Framework Info Collapsibles | Global panel content is now view-scoped; per-card panels removed from single-framework views |
| §14.3 Per-Card Completeness Indicator | "Always render both chips" behavior scoped to Both view only; single-framework views show only the relevant chip |

---

### 15.8 Component Changes

No new components are required. Changes are localized to:

| File | Change |
|---|---|
| `FeatureCard.tsx` | Conditionally render tab switcher only when `activeView === 'both'`; conditionally render per-card Learn collapsible only when `activeView === 'both'`; render only the relevant score chip based on `activeView`; pass `activeView` as a prop (or read from store) |
| `RiceForm.tsx` | No changes to form logic; receives `showLearnPanel` prop (false when `activeView !== 'both'`) |
| `IceForm.tsx` | Same as RiceForm.tsx |
| `FrameworkInfoPanel.tsx` | Update content rendering to branch on `framework` prop: RICE-only content, ICE-only content, or full global content; update collapsed banner label |
| `App.tsx` | Pass active view context down to `FeatureCard` and `FrameworkInfoPanel`; update `FrameworkInfoPanel` prop from hardcoded `'global'` to derived value: `'rice'` | `'ice'` | `'global'` based on active view toggle |

---

### 15.9 Acceptance Criteria

- [ ] In RICE view, feature cards show the RICE form directly with no tab switcher
- [ ] In ICE view, feature cards show the ICE form directly with no tab switcher
- [ ] In Both view, feature cards show the `[RICE] [ICE]` tab switcher (unchanged from current behavior)
- [ ] In RICE view, only the RICE score chip renders on each feature card (ICE chip is absent)
- [ ] In ICE view, only the ICE score chip renders on each feature card (RICE chip is absent)
- [ ] In Both view, both score chips render with full v1.4 completeness indicator behavior (scored = full opacity, unscored = dimmed with `—` placeholder)
- [ ] In RICE view, no per-card Learn collapsible appears on any feature card
- [ ] In ICE view, no per-card Learn collapsible appears on any feature card
- [ ] In Both view, the per-card Learn collapsible on each tab is unchanged from current behavior
- [ ] In RICE view, the global Learn panel shows only RICE content (formula, field explanations, score bands)
- [ ] In ICE view, the global Learn panel shows only ICE content (formula, field explanations, score bands)
- [ ] In Both view, the global Learn panel shows full comparison content (unchanged from current behavior)
- [ ] The global Learn panel collapsed banner label reads `📖 Learn how RICE scoring works ▾` in RICE view, `📖 Learn how ICE scoring works ▾` in ICE view, and the existing label in Both view
- [ ] Switching between views (RICE / ICE / Both) immediately updates all surfaces above without requiring a page reload
- [ ] No regression to existing drag-and-drop, scoring, filtering, or export behavior

---

## 16. Both View Redesign (v1.6 Feature)

### 16.1 Overview

The v1 Both view rendered two independent side-by-side columns — RICE ranked on the left and ICE ranked on the right. While this made rank divergence visible, the dual-column layout duplicated every card and made the list harder to scan. v1.6 collapses Both view into a **single sorted column** with explicit sort controls and retained delta badges, giving users the divergence signal without the duplicated cards.

---

### 16.2 Layout Change

**Before (v1.0–v1.5):** Two-column grid. RICE-ranked list on the left, ICE-ranked list on the right. Every feature card appears twice.

**After (v1.6):** Single column. Every feature appears once. The active sort determines order. Delta badges surface the cross-framework disagreement.

---

### 16.3 Sort Controls

Sort controls appear **directly above the ranked list**, only when Both view is active. They are not added to the main controls bar.

**UI:**

```
Sort by:  [RICE ↑]  [RICE ↓]  [ICE ↑]  [ICE ↓]
──────────────────────────────────────────────────
#1      Feature Name  [ RICE 320.0 ]  [ ICE 56.0 ]
#2  ▲2  Feature Name  [ RICE 280.0 ]  [ ICE 44.0 ]
#3  ▼1  Feature Name  [ RICE 210.0 ]  [ ICE —    ]
```

**Four sort options:**

| Button | Sort key | Direction |
|---|---|---|
| RICE ↑ | RICE score | High → Low (descending) |
| RICE ↓ | RICE score | Low → High (ascending) |
| ICE ↑ | ICE score | High → Low (descending) |
| ICE ↓ | ICE score | Low → High (ascending) |

**Active state:** The selected sort button is highlighted (indigo fill), matching the style of the framework toggle buttons.

**Persistence:** The active sort is stored in `localStorage` under `scorecard-both-sort` (values: `'rice-desc'` | `'rice-asc'` | `'ice-desc'` | `'ice-asc'`). Both view remembers the last-used sort across page loads.

**Default (first-ever use):** `'rice-desc'` (RICE high → low).

---

### 16.4 Rank Badge & Delta Badge

Each row in the single-column Both view shows:
- A **rank badge** — the feature's position in the current sort order (1-based)
- A **delta badge** — how the feature's rank in the active sort framework compares to its rank in the other framework

**Delta calculation:**

- Sorted by RICE: `delta = riceRank − iceRank`
  - `delta < 0` → ▲|delta| (feature ranks higher in RICE than ICE)
  - `delta > 0` → ▼delta (feature ranks lower in RICE than ICE)
  - `delta = 0` → no badge
- Sorted by ICE: `delta = iceRank − riceRank`
  - Same sign logic

**Delta for unscored features:** If the other framework has no score for a feature, no delta badge is shown for that feature.

**Direction when ascending:** The same delta calculation applies regardless of sort direction — delta always expresses the rank difference between the two frameworks, not the sort direction.

---

### 16.5 Unscored Features

- Features without a score in the **active sort framework** appear at the bottom of the list, grayed out at ~50% opacity (same behavior as single-framework views).
- Features with a score in the active sort framework but no score in the other framework: fully visible, ranked normally, no delta badge.

---

### 16.6 Drag-and-Drop in Both View

Drag-and-drop manual reordering is **enabled** in the single-column Both view.

- Dragging while sorted by RICE → sets `riceManualRank` (same store action as the RICE single-framework view)
- Dragging while sorted by ICE → sets `iceManualRank` (same store action as the ICE single-framework view)
- The manual override badge (⚠) still appears on cards with a manual rank set, consistent with single-framework view behavior
- Drag-and-drop is **disabled** when "Sort by Completeness" is active, same as the existing single-framework rule

---

### 16.7 What Changes vs. What Stays the Same

| Behavior | Change? |
|---|---|
| Both view column count | **Changed**: 2 columns → 1 column |
| Sort controls | **New**: 4-button RICE↑/RICE↓/ICE↑/ICE↓ sort bar above the list, only in Both view |
| Sort persistence | **New**: `scorecard-both-sort` in localStorage |
| Rank badge | Unchanged — shows position in current sorted list |
| Delta badge (▲▼) | Unchanged logic — still shows cross-framework rank divergence |
| Both-view score chips | Unchanged — both RICE and ICE chips render on each card (v1.4 / v1.5 behavior) |
| Per-card tabs & learn panel | Unchanged — tabs visible, learn panel on tabs (v1.5 behavior in Both view) |
| "Sort by Completeness" toggle | Unchanged — still available; disables drag when active |
| Drag-and-drop | **Changed**: now enabled in Both view; sets rank for the active sort framework |
| Column headers ("RICE Ranked" / "ICE Ranked") | **Removed**: replaced by the sort control bar |

---

### 16.8 Component Changes

| File | Change |
|---|---|
| `RankedList.tsx` | Replace `BothView` component: remove two-column grid; add single-column list; add sort state (read/write localStorage); add sort control bar JSX; compute both RICE and ICE rank maps; derive delta from active sort; wire drag-and-drop to active sort framework |

No other files require changes.

---

### 16.9 Acceptance Criteria

- [ ] Both view renders a single column (not two side-by-side columns)
- [ ] Sort controls (RICE ↑, RICE ↓, ICE ↑, ICE ↓) appear above the list only when Both view is active
- [ ] Active sort button is visually highlighted
- [ ] Sort defaults to RICE ↑ on first use; subsequently remembers the last-used sort via `scorecard-both-sort` in localStorage
- [ ] Switching between RICE/ICE/Both views does not reset the Both sort preference
- [ ] Features are sorted by the active sort key and direction
- [ ] Each row shows a rank badge (position in current sort) and, where applicable, a delta badge (▲▼ cross-framework rank difference)
- [ ] Delta badge is absent when the feature has no score in the other framework
- [ ] Features without a score in the active sort framework appear at the bottom, grayed out
- [ ] Drag-and-drop reordering works in Both view; dragging while sorted by RICE sets `riceManualRank`; dragging while sorted by ICE sets `iceManualRank`
- [ ] Manual override badge (⚠) still appears on manually-ranked cards
- [ ] Drag-and-drop is disabled when Sort by Completeness is active
- [ ] No regression to single-framework RICE/ICE view behavior

---

## 17. Unified Sort Dropdown (v1.7 Feature)

### 17.1 Overview

In v1.6, sort controls were split across two surfaces: a standalone "Sort: Completeness" toggle button in the global controls bar and an inline 4-button sort bar above the Both view list. v1.7 consolidates all sort controls into a single `<select>` dropdown in the global controls bar. The dropdown is context-aware — its options change based on the active view — and each view independently remembers its last-used sort.

---

### 17.2 Sort Dropdown

**Placement:** In the global controls bar, after the framework toggle and before the tag filter. Always visible regardless of active view.

**Control type:** Native `<select>` dropdown styled to match the existing tag and status filter dropdowns (same border, padding, `ChevronDown` overlay icon).

**Label:** The selected option is displayed as the dropdown's current label. Each option is named so the selected state reads naturally (e.g. `RICE ↑`, `ICE ↓`, `Completeness`).

---

### 17.3 Options Per View

| View | Dropdown options |
|---|---|
| RICE | `RICE ↑` (high → low), `RICE ↓` (low → high), `Completeness` |
| ICE | `ICE ↑` (high → low), `ICE ↓` (low → high), `Completeness` |
| Both | `RICE ↑`, `RICE ↓`, `ICE ↑`, `ICE ↓`, `Completeness` |

When switching views, the dropdown re-renders with the option set for the new view and restores that view's last-used sort.

---

### 17.4 Completeness Sort Behavior

Selecting `Completeness` sorts by how many frameworks are scored, tiered:

1. **Both scored** — `rice` and `ice` both non-null. Sorted by active framework score descending within tier.
2. **One scored** — exactly one of `rice` or `ice` is non-null. Sorted by whichever score exists.
3. **Neither scored** — both `rice` and `ice` are null.

This is the behavior of the existing `sortByCompletenessFirst` utility. When `Completeness` is selected, drag-and-drop is disabled (consistent with prior behavior).

---

### 17.5 Per-View Sort Persistence

Each view has its own localStorage key and default:

| View | localStorage key | Default |
|---|---|---|
| RICE | `scorecard-sort-rice` | `rice-desc` |
| ICE | `scorecard-sort-ice` | `ice-desc` |
| Both | `scorecard-sort-both` | `rice-desc` |

Switching from RICE to ICE view restores ICE's last sort. Switching back to RICE restores RICE's last sort. Sort preferences are never cleared by "Clear filters."

---

### 17.6 What Is Removed

| Removed element | Replaced by |
|---|---|
| "Sort: Completeness" standalone toggle button in controls bar | Dropdown `Completeness` option |
| Both view inline sort bar (RICE ↑ / RICE ↓ / ICE ↑ / ICE ↓ buttons above the list) | Global dropdown |
| `scorecard-both-sort` localStorage key | `scorecard-sort-both` |

---

### 17.7 "Clear Filters" Behavior

Sort is a persistent display preference, not a filter. "Clear filters" only resets tag, status, and hide-scored. It does **not** reset the sort dropdown. `hasActiveFilters` no longer includes sort as a condition.

---

### 17.8 Component Changes

| File | Change |
|---|---|
| `App.tsx` | Replace `sortByCompleteness` boolean state with three per-view sort states (`riceSortOption`, `iceSortOption`, `bothSortOption`), each initialized from localStorage. Add sort dropdown to controls bar with context-aware options. Remove "Sort: Completeness" button. Update `hasActiveFilters` and "Clear filters" to exclude sort. Pass `sortOption` to `RankedList`. |
| `RankedList.tsx` | Update `Props` to accept `sortOption: SortOption` instead of `sortByCompleteness: boolean`. Derive `sortByCompleteness` internally as `sortOption === 'completeness'`. Remove Both view's own sort state, sort persistence, and inline sort bar. Update `sortForBothView` to accept `SortOption`. |
| `types.ts` | Add `SortOption` type: `'rice-desc' \| 'rice-asc' \| 'ice-desc' \| 'ice-asc' \| 'completeness'`. |

---

### 17.9 Acceptance Criteria

- [ ] Sort dropdown appears in the global controls bar for all views
- [ ] RICE view dropdown shows only: `RICE ↑`, `RICE ↓`, `Completeness`
- [ ] ICE view dropdown shows only: `ICE ↑`, `ICE ↓`, `Completeness`
- [ ] Both view dropdown shows: `RICE ↑`, `RICE ↓`, `ICE ↑`, `ICE ↓`, `Completeness`
- [ ] Dropdown label reflects the active selection at all times
- [ ] Each view remembers its own last-used sort across page loads (localStorage)
- [ ] Switching views restores the last sort used in that view
- [ ] `Completeness` sort tiers features: both scored → one scored → neither
- [ ] Drag-and-drop is disabled when `Completeness` sort is active
- [ ] Both view no longer has an inline sort bar above the list
- [ ] "Sort: Completeness" standalone button is removed
- [ ] "Clear filters" does not reset the sort dropdown
- [ ] No regression to filtering, scoring, or drag-and-drop behavior

---

## 18. Manual Override Reset (v1.8 Feature)

### 18.1 Overview

When a user drag-reorders features in RICE or ICE view, a `riceManualRank` or `iceManualRank` value is written to each feature and a ⚠ badge appears on the card. Until now there has been no way to remove these overrides other than re-dragging everything back to score order. v1.8 adds a **"Clear overrides"** button in the global controls bar that wipes the manual ranks for the current view's framework in one action.

---

### 18.2 Button Behavior

**Placement:** In the controls bar, after the sort dropdown and before the hide-scored toggle. Conditionally rendered — only shown when at least one feature has a manual rank set for the current view's active framework.

**Label:** `Clear overrides`

**Visibility logic by view:**

| View | Shown when |
|---|---|
| RICE | Any feature has `riceManualRank !== undefined` |
| ICE | Any feature has `iceManualRank !== undefined` |
| Both (sorted by RICE) | Any feature has `riceManualRank !== undefined` |
| Both (sorted by ICE) | Any feature has `iceManualRank !== undefined` |
| Both (sorted by Completeness) | Any feature has `riceManualRank !== undefined` OR `iceManualRank !== undefined` |

**Action scope — clears only the current view's framework:**

| View | What is cleared |
|---|---|
| RICE | `riceManualRank` set to `undefined` on all features |
| ICE | `iceManualRank` set to `undefined` on all features |
| Both (sorted by RICE) | `riceManualRank` set to `undefined` on all features |
| Both (sorted by ICE) | `iceManualRank` set to `undefined` on all features |
| Both (sorted by Completeness) | Both `riceManualRank` and `iceManualRank` cleared |

---

### 18.3 Confirmation Pattern

The button uses the same two-click confirmation pattern as the existing delete button:

1. **Default state:** `Clear overrides` — styled as a small outlined button (matching the hide-scored toggle style)
2. **First click:** Button transitions to a confirmation state — text changes to `Confirm clear`, background changes to rose/red tint (`bg-rose-50 text-rose-600 border-rose-200`)
3. **Second click:** Clears the manual ranks and button returns to default (or disappears if no overrides remain)
4. **Blur / click away:** Resets button back to default state without clearing anything

---

### 18.4 Component Changes

| File | Change |
|---|---|
| `useFeatureStore.ts` | Add `clearManualRanks(framework: 'rice' \| 'ice' \| 'both')` action — sets `riceManualRank` and/or `iceManualRank` to `undefined` on all features for the specified framework(s) |
| `App.tsx` | Add `confirmClear` boolean state. Derive `hasManualOverrides` and `clearFramework` from `activeFramework` and `currentSortOption`. Render "Clear overrides" button conditionally. Wire click-to-confirm logic. |

---

### 18.5 Acceptance Criteria

- [ ] "Clear overrides" button appears in the controls bar only when at least one feature has a manual rank for the current view's active framework
- [ ] Button does not appear when no manual overrides are present
- [ ] First click puts the button into a rose-tinted confirmation state with text "Confirm clear"
- [ ] Second click clears the relevant manual ranks and the ⚠ badges disappear from affected cards
- [ ] Clicking away (blur) cancels the confirmation without clearing anything
- [ ] In RICE view, only `riceManualRank` is cleared; ICE ranks are unaffected
- [ ] In ICE view, only `iceManualRank` is cleared; RICE ranks are unaffected
- [ ] In Both view sorted by RICE, only `riceManualRank` is cleared
- [ ] In Both view sorted by ICE, only `iceManualRank` is cleared
- [ ] In Both view sorted by Completeness, both `riceManualRank` and `iceManualRank` are cleared
- [ ] After clearing, the ranked list immediately re-sorts by score (no manual rank influencing order)

---

## 19. Design Decisions Log

| Question                              | Decision                                          |
|---------------------------------------|---------------------------------------------------|
| ICE score scale                       | Normalized 0–100 (divided by 10)                 |
| RICE Effort unit                      | Fibonacci story points (1,2,3,5,8,13,21)         |
| ICE input style                       | Clickable 1–10 button grid (NPS-style)           |
| Feature card layout                   | Tabbed — RICE tab and ICE tab                    |
| Partial scores in Both view           | Grayed "Not scored" items at column bottom       |
| Manual rank override                  | Drag in single-framework view only; badge shown  |
| Drag in Both view                     | Disabled — switch to single view to drag         |
| Tags                                  | Free-text with autocomplete from existing tags   |
| Status field                          | Planned / In Progress / Done                     |
| Projects / workspaces                 | Not needed — tags handle context separation      |
| Empty state                           | 2–3 pre-loaded sample features                   |
| Collaboration                         | None in v1 — CSV export is sharing mechanism     |
| Data persistence                      | localStorage + JSON import/export safety net     |
| Visual style                          | Polished, indigo/violet accent, light mode only  |
| App name                              | Scorecard                                        |
| Info panel placement                  | Global (between controls + list) + per-tab       |
| Collapsed state visual                | Banner row: "📖 Learn how X scoring works ▾"     |
| First-visit behavior                  | Global panel open on first visit, then always closed after dismiss |
| Per-tab persistence                   | Always starts collapsed; no persistence          |
| Per-tab expanded style                | Inline collapsible, same pattern as global       |
| Visual aids                           | Color-coded formula, score interpretation bands  |
| Global panel content                  | Comparison table, when-to-use, worked example, external links |
| Formula color coding                  | Reach=indigo, Impact=emerald, Confidence=amber, Effort/Ease=rose |
| Onboarding format                     | Welcome modal, split-layout (UI mockup left, content right)      |
| Onboarding slides                     | 4 slides: Welcome, Why scoring, How to score, Results & safety   |
| Onboarding skip                       | Visible Skip link on every slide                                 |
| Onboarding navigation                 | Clickable dot indicators, free jumping between slides            |
| Onboarding visual side                | Stylized UI mockups of actual app screens                        |
| Slide 2 visual                        | Before/after: gut-feel list vs ranked scored list                |
| Onboarding final CTA                  | "Explore the app" — closes modal, reveals sample features        |
| Onboarding replayability              | None — one-time only                                             |
| Onboarding + info panel interaction   | Both localStorage keys set on completion; info panel stays closed|
| Completeness definition               | "At least one framework scored" (rice OR ice not null); fully unscored = both null |
| Completeness chip behavior            | Always render both chips; dim to ~40% opacity (not remove) when unscored — preserves layout stability |
| Unscored chip placeholder text        | `RICE —` / `ICE —` (em dash) — communicates absence without being alarming |
| Summary stat format                   | Per-framework breakdown (`RICE: X/Y · ICE: X/Y`) rather than aggregate — more actionable for planning |
| Summary stat scope                    | Reflects active filters (tag + status) so the count is contextually relevant |
| Filter/sort mechanism                 | Both a sort option (Completeness) and a Hide Scored toggle — sort for reordering, toggle for focus |
| "Hide scored" semantics               | Hides features with ANY score; shows only fully unscored (both null) — matches completeness definition |
| Sorting: unscored always last         | Formalizes existing implicit behavior; completeness tier takes precedence over score within tier |
| No new components needed              | Changes are confined to FeatureCard, App, RankedList, useFeatureStore — no new files |
| v1.5: Card tabs in single-framework view | Removed entirely — form renders directly with no tab chrome; reduces cognitive load when focused on one framework |
| v1.5: Score chips in single-framework view | Only the active framework's chip shown; other chip fully hidden (not dimmed) — overrides v1.4 "always render both" for single views |
| v1.5: Per-card Learn in single-framework view | Removed; global panel already provides framework-specific reference, making per-card panel redundant |
| v1.5: Global Learn panel scoping | Content scoped to active framework in single views; full comparison content retained in Both view only |
| v1.5: Global Learn banner label | Updates dynamically to match active view ("RICE scoring", "ICE scoring", or "RICE and ICE scoring") |
| v1.5: FrameworkInfoPanel prop wiring | `framework` prop changes from hardcoded `'global'` to derived from active view: `'rice'` / `'ice'` / `'global'` |
| v1.6: Both view layout | Single column — removes duplicate cards, easier to scan; delta badges preserve cross-framework divergence signal |
| v1.6: Sort control placement | Above the list in Both view only — keeps main controls bar uncluttered; contextually relevant |
| v1.6: Sort options | 4 buttons (RICE ↑ / RICE ↓ / ICE ↑ / ICE ↓) — explicit and minimal; toggling direction is a common need |
| v1.6: Sort persistence | `scorecard-both-sort` in localStorage — remembers last-used sort so users don't have to reset on every visit |
| v1.6: Default sort | RICE high→low on first use — RICE is typically the more data-driven framework and a natural default |
| v1.6: Delta badge in single column | Retained — expresses rank divergence between frameworks regardless of which framework is driving the sort |
| v1.6: Drag-and-drop in Both view | Enabled; sets `riceManualRank` or `iceManualRank` based on active sort — consistent with single-framework view behavior, no new data model field needed |
| v1.6: Column headers removed | "RICE Ranked" / "ICE Ranked" headers replaced by sort control bar — single column makes them redundant |
| v1.7: Sort consolidation | Single dropdown replaces standalone completeness toggle + Both view inline sort bar — fewer controls, consistent placement |
| v1.7: Dropdown placement | Global controls bar — always visible, no context-switching required |
| v1.7: Options per view | Context-aware options (RICE view shows only RICE sorts, etc.) — reduces irrelevant choices |
| v1.7: Completeness sort tier definition | Both scored → one scored → neither — more nuanced than binary scored/unscored; uses existing `sortByCompletenessFirst` |
| v1.7: Per-view sort persistence | Each view remembers its own sort — switching back to RICE restores the last RICE sort without surprising the user |
| v1.7: Sort excluded from "Clear filters" | Sort is a display preference, not a filter — clearing tag/status/hideScored should not disturb sort |
| v1.7: SortOption type in types.ts | Centralised — used by both App.tsx and RankedList.tsx without circular imports |
| v1.8: Reset placement | Global controls bar only (not per-card) — single action to clear all overrides is more efficient than hunting each card |
| v1.8: Reset scope | Current view's framework only — avoids accidentally wiping overrides from a view the user isn't looking at |
| v1.8: Both view + Completeness sort | Clears both frameworks — no single active framework in Completeness mode, so both are treated as in scope |
| v1.8: Confirmation pattern | Two-click (same as delete) — destructive action that can't be undone; rose tint signals danger without requiring a modal |
| v1.8: Conditional visibility | Button hidden when no overrides exist — avoids a permanently greyed-out control cluttering the bar |
