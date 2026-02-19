# Scorecard — Product Requirements Document

**Date:** 2026-02-19
**Version:** 1.4 (added scoring completeness indicators)

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

## 15. Design Decisions Log

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
