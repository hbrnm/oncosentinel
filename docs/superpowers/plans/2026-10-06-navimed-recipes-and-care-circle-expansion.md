# NaviMed Recipes & Care Circle Expansion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Expand NaviMed's evidence-based nutrition system with interactive grocery lists, smart symptom-to-meal suggestions, automated supporter circle alerts, and persistent backup verification.

**Architecture:** React 19 + TypeScript + Tailwind CSS v4 local-first architecture. Ingredients from `ONCOLOGY_RECIPES` can be checked off or exported to an interactive shopping list in `localStorage`. Symptoms logged on the Dashboard inform smart recipe suggestions in the Guide tab.

**Tech Stack:** React 19, TypeScript, Lucide React, Vite, Tailwind CSS v4, Canvas Confetti, Supabase JS, Web Notifications API.

**Spec:** Integration of authoritative guidelines from Breast Cancer UK ("Organic Flavours"), WCRF ("Cook Through Cancer"), and PCRM ("Cancer Survivor's Guide") into NaviMed's DCIS/Tamoxifen care plan.

## Global Constraints
- WCAG AAA contrast standard strictly enforced (no low-contrast text on colored cards).
- Strict Grapefruit and Seville orange contraindication warning preserved on all nutrition screens.
- Local-first architecture: all data resides in `localStorage` and synchronizes gracefully with Supabase without breaking offline availability.
- No third-party UI framework dependencies; keep clean Tailwind CSS v4 utility classes.

## Review Focus
1. User marks ingredients as purchased or adds them to a shopping list without page reload loss.
2. Search and filter query properly handles Romanian diacritics and case-insensitivity.
3. Automated Supporter SMS/WhatsApp links correctly encode special characters and phone numbers internationally.
4. Backup JSON import strictly validates schema structure before restoring state.
5. Daily symptom score triggers appropriate non-pharmacological recipe recommendation.

---

### Task 1: Recipe Interactive Ingredients & Shopping List Drawer

**Files:**
- Create: `src/components/ShoppingListModal.tsx`
- Modify: `src/components/RecipesSection.tsx`
- Modify: `src/App.tsx`
- Test: Build verification (`npx.cmd vite build`)

**Interfaces:**
- Consumes: `RecipeItem` from `src/lib/recipes.ts`
- Produces: `ShoppingListModal` component, `navimed_shopping_list` stored in `localStorage`

- [x] **Step 1: Create ShoppingListModal component**
  Build a dedicated modal with checkboxes to mark items as bought, clear checked items, copy list to clipboard, and add custom groceries.

- [x] **Step 2: Add "Adaugă în Lista de Cumpărături" button in RecipesSection**
  In `RecipesSection.tsx`, add an action button in each expanded recipe card allowing the patient to add all or selected ingredients directly to their shopping list with one tap.

- [x] **Step 3: Wire ShoppingListModal into App.tsx and RecipesSection**
  Add state `isShoppingListOpen` in `App.tsx` or `RecipesSection.tsx` and provide quick access floating/header button.

- [x] **Step 4: Verify build and reactivity**
  Run `npx.cmd vite build` and verify that ingredients persist in `localStorage`.

---

### Task 2: Smart Symptom-to-Recipe Recommendation Link

**Files:**
- Modify: `src/components/DashboardTab.tsx`
- Modify: `src/components/GuideTab.tsx`
- Test: Build verification (`npx.cmd vite build`)

**Interfaces:**
- Consumes: `SymptomLog` and quick symptom state from `DashboardTab`
- Produces: Dynamic recommendation banner (e.g., if hot flashes score >= 2 -> recommend "Infuzie de Hibiscus" / "Ceai rece de salvie"; if fatigue score >= 3 -> recommend "Smoothie Energie Curată").

- [x] **Step 1: Implement recommendation helper in DashboardTab**
  Evaluate logged symptoms for the day and display a subtle, empathetic banner linking directly to the recommended recipe in the Guide tab.

- [x] **Step 2: Add direct recipe deep-linking prop to GuideTab**
  Allow navigation with a pre-selected recipe or search filter when transitioning from Dashboard to Guide tab.

- [x] **Step 3: Verify build**
  Run `npx.cmd vite build`.

---

### Task 3: Supporter Circle Automated Missed Dose Safeguard

**Files:**
- Modify: `src/components/SupporterModal.tsx`
- Modify: `src/components/DashboardTab.tsx`
- Test: Build verification (`npx.cmd vite build`)

**Interfaces:**
- Consumes: `supporter` settings and `todayDose` state
- Produces: Missed dose quick alert generator (pre-filled WhatsApp/SMS to partner/supporter if dose is delayed past the reminder time).

- [x] **Step 1: Add missed dose alert generator in SupporterModal**
  Include pre-formatted messages for both "Stare bună azi" (celebration) and "Ajutor / Memento doza de Tamoxifen" (safety net).

- [x] **Step 2: Connect safety prompt to DashboardTab when dose is pending late**
  If current time is past reminder time and dose status is not `taken`, show an optional helper in Dashboard to alert the supporter.

- [x] **Step 3: Verify build**
  Run `npx.cmd vite build`.

---

### Task 4: Complete Backup Schema Integrity & Test Verification

**Files:**
- Modify: `src/lib/backupService.ts`
- Modify: `src/components/TimelineTab.tsx`
- Test: Build verification (`npx.cmd vite build`)

**Interfaces:**
- Consumes: `navimed_*` local storage keys
- Produces: Versioned JSON schema validation with fallback error reporting.

- [x] **Step 1: Enhance import verification in `backupService.ts`**
  Validate structure of imported JSON (ensure `profile`, `doses`, etc. are valid JSON strings or objects before writing to `localStorage`).

- [x] **Step 2: Add visual success/failure feedback in TimelineTab**
  Display a clear toast or banner confirming the number of doses, documents, and symptoms restored.

- [x] **Step 3: Run full production build**
  Run `npx.cmd vite build` and confirm 0 errors.

