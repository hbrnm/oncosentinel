# Base44 Organic Redesign & Enhancement Implementation Plan

> **For Antigravity:** REQUIRED WORKFLOW: Use `.agent/workflows/execute-plan.md` to execute this plan in single-flow mode.

**Goal:** Transform OncoSentinel's UI and components based on the Base44 export specifications to achieve a 100% faithful organic, calm, empathetic design system while preserving all offline storage, Supabase sync, safety checks, and passing 100% of tests.

**Architecture:** 
1. Port design system tokens, classes, and botanical SVG assets (`BotanicalBranch`, `LeafSprig`, `PillIcon`) into `src/index.css` and `src/components/Botanical.tsx`.
2. Adapt the Base44 components (`QuickActions`, `MedicationHeroCard`, `MoodPicker`, `AppointmentBanner`, `SectionHeader`, `BottomNav`) into TypeScript components that seamlessly integrate with our local storage and state management.
3. Update `DashboardTab.tsx` (Astăzi) to match the exact visual layout from Base44 (Header with Botanical branch + Notification Bell, Hero Card, 4 QuickActions, Side-by-side Next Control & Blush Quote, 5-level Mood Check-in with feedback, Clinical Guide & News cards with thumbnail, Inspiration Banner).
4. Integrate the 4 QuickActions to smoothly navigate between tabs and trigger modals (`/tratament`, `/ghiduri`, doctor modal, relaxing resources).
5. Verify with automated Vitest tests and production Vite build.

**Tech Stack:** React 19, TypeScript, Tailwind CSS v4, Lucide React, Vitest, Canvas Confetti.

---

### Task 1: Design Tokens, CSS Utilities & Botanical SVG Components

**Files:**
- Modify: `src/index.css`
- Create: `src/components/Botanical.tsx`
- Test: `src/test/botanical.test.tsx`

**Step 1: Write the failing test**
Create `src/test/botanical.test.tsx` verifying that `BotanicalBranch`, `LeafSprig`, and `PillIcon` render SVG elements with correct accessibility attributes.

**Step 2: Run test to verify it fails**
Run: `node ./node_modules/vitest/vitest.mjs run src/test/botanical.test.tsx`
Expected: FAIL with missing module `Botanical.tsx`.

**Step 3: Implement Botanical components & CSS utilities**
- Add `.app-shell`, `.organic-card`, `.sage-card`, `.blush-card`, `.micro-label`, `.tap-scale` in `src/index.css`.
- Create `src/components/Botanical.tsx` with `BotanicalBranch`, `LeafSprig`, and `PillIcon`.

**Step 4: Run test to verify it passes**
Run: `node ./node_modules/vitest/vitest.mjs run src/test/botanical.test.tsx`
Expected: PASS.

**Step 5: Commit**
`git add src/index.css src/components/Botanical.tsx src/test/botanical.test.tsx`
`git commit -m "feat(design): add Base44 design tokens, card utilities, and botanical SVG assets"`

---

### Task 2: Port QuickActions Grid (4 Direct Access Buttons)

**Files:**
- Create: `src/components/QuickActions.tsx`
- Test: `src/test/quick-actions.test.tsx`

**Step 1: Write the failing test**
Create `src/test/quick-actions.test.tsx` testing rendering of the 4 actions: "Calendar tratament", "Ghiduri medicale", "Medici și centre", "Resurse utile" and clicking each invokes the appropriate navigation / action handler callback.

**Step 2: Run test to verify it fails**
Run: `node ./node_modules/vitest/vitest.mjs run src/test/quick-actions.test.tsx`
Expected: FAIL with missing module `QuickActions.tsx`.

**Step 3: Implement QuickActions.tsx**
Create `src/components/QuickActions.tsx` accepting handlers for:
- `onNavigateToTab(tab: string)`
- `onOpenDoctorModal()`
- `onOpenResources()`
Styled with `.organic-card`, `.tap-scale`, and the exact tints from Base44 (`bg-sage-soft` and `bg-blush`).

**Step 4: Run test to verify it passes**
Run: `node ./node_modules/vitest/vitest.mjs run src/test/quick-actions.test.tsx`
Expected: PASS.

**Step 5: Commit**
`git add src/components/QuickActions.tsx src/test/quick-actions.test.tsx`
`git commit -m "feat(ui): add 4-grid QuickActions component from Base44 export"`

---

### Task 3: Enhance DashboardTab ("Astăzi") to Match Base44 Layout Exactly

**Files:**
- Modify: `src/components/DashboardTab.tsx`
- Test: `src/test/dashboard-base44.test.tsx`

**Step 1: Write the test**
Create `src/test/dashboard-base44.test.tsx` validating:
- Botanical branch background element in header + bell icon.
- Medication Hero Card with pill icon, 20 mg, and toggle logic.
- 4 Quick Actions grid rendered immediately below Hero card.
- Dual cards: Next control countdown + Blush quote with leaf sprig.
- Mood check-in with 5 circular emojis and empathetic feedback text.
- Guide card with thumbnail and news update card with shield icon.
- Botanical inspirational banner.

**Step 2: Run test to verify it fails or exposes differences**
Run: `node ./node_modules/vitest/vitest.mjs run src/test/dashboard-base44.test.tsx`

**Step 3: Update DashboardTab.tsx**
Refactor `src/components/DashboardTab.tsx` to integrate:
- `BotanicalBranch` in top right corner behind header.
- Bell notification icon with blush unread indicator.
- `QuickActions` component placed right under the Hero card.
- Exact styling for Next Control card and Blush Quote card using `.organic-card` and `.blush-card`.
- Guide preview card with mountain scenery thumbnail placeholder and clinical source tag.
- News card with shield icon and date.
- Keep SOS and emergency support accessible as fallback.

**Step 4: Run all tests to verify 100% pass**
Run: `node ./node_modules/vitest/vitest.mjs run`
Expected: PASS across all test files.

**Step 5: Commit**
`git add src/components/DashboardTab.tsx src/test/dashboard-base44.test.tsx`
`git commit -m "feat(dashboard): align Astăzi tab 1:1 with Base44 export layout"`

---

### Task 4: Bottom Navigation Alignment & Active States

**Files:**
- Modify: `src/components/Navbar.tsx`
- Test: `src/test/user-journey.test.tsx`

**Step 1: Check existing navigation**
Verify that the 5 navigation tabs (`Astăzi`, `Tratament`, `Dosar/Jurnal`, `Ghiduri`, `Profil`) have organic pill indicator pills, `.tap-scale` feedback, and proper Lucide icons matching Base44 `BottomNav.jsx`.

**Step 2: Update Navbar.tsx styling**
Refine bottom dock with `.rounded-[28px]`, `.shadow-organic`, and sage active pill indicator.

**Step 3: Run full verification suite**
Run: `node ./node_modules/vitest/vitest.mjs run`
Run: `cmd /c "npm run build"`

**Step 4: Commit & Push**
`git add -A`
`git commit -m "feat(nav): polish bottom nav with Base44 organic dock styling"`
`git push origin main`
