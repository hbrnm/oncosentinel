# Personal Notes, Food Menus, and Medical Dossier Implementation Plan

> **For Antigravity:** REQUIRED WORKFLOW: Use `.agent/workflows/execute-plan.md` to execute this plan in single-flow mode.

**Goal:** Reintegrate legacy app features (Personal Notes, Food Menus, Medical Dossier) into the new Base44 layout using localized UI elements (Journal text area, Guide sub-tabs, Profile sub-tabs).

**Architecture:** We will add state to existing tabs (Journal, Guide, Profile) to manage sub-navigation and capture input. The changes rely on React `useState` and UI components built with Tailwind CSS.

**Tech Stack:** React, TypeScript, Tailwind CSS, Vite

---

### Task 1: Add Personal Notes Field to JournalTab

**Files:**
- Modify: `src/components/JournalTab.tsx`

**Step 1: Add state for notes**

In `src/components/JournalTab.tsx`, add `const [note, setNote] = useState('');` next to `selectedMood`.

**Step 2: Add textarea UI**

Below the mood selector grid in `JournalTab.tsx`, add a textarea for personal notes with Base44 organic styling.

```tsx
<div className="mt-8">
  <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4">Gândurile mele de azi</h3>
  <textarea
    value={note}
    onChange={(e) => setNote(e.target.value)}
    placeholder="Notează un gând, un simptom sau o bucurie de azi..."
    className="w-full h-32 p-4 rounded-3xl bg-[#FDFBF7] dark:bg-darkbg-card border border-[#EAE5DE] dark:border-darkbg-border text-sm text-gray-800 dark:text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sage-300 transition-all resize-none shadow-sm"
  />
</div>
```

**Step 3: Update save logic**

Update the "Salvează în jurnal" button to visually (or via mock console.log) save the note along with the mood.

**Step 4: Commit**

```bash
git add src/components/JournalTab.tsx
git commit -m "feat: add personal notes field to journal tab"
```

---

### Task 2: Create Recipes Data and Menus Tab

**Files:**
- Create: `src/data/recipes.ts`
- Modify: `src/components/GuideTab.tsx`

**Step 1: Create recipes data**

Create `src/data/recipes.ts` exporting a `RECIPES` array with at least 2 mock recipes/menus containing Markdown content. Include `id, tag, title, summary, content, image_url`.

**Step 2: Add Sub-tabs to GuideTab**

Modify `src/components/GuideTab.tsx` to include state: `const [activeCategory, setActiveCategory] = useState<'clinical' | 'news' | 'nutrition'>('clinical');`. Add a 3-button toggle at the top (Ghiduri, Noutăți, Nutriție & Rețete).

**Step 3: Render Recipes**

When `activeCategory === 'nutrition'`, map over `RECIPES` and render them using the existing `organic-card` structure.

**Step 4: Commit**

```bash
git add src/data/recipes.ts src/components/GuideTab.tsx
git commit -m "feat: add nutrition and recipes tab to guides"
```

---

### Task 3: Add Medical Dossier to ProfileTab

**Files:**
- Modify: `src/components/ProfileTab.tsx`

**Step 1: Add horizontal tab state**

In `src/components/ProfileTab.tsx`, add state: `const [activeTab, setActiveTab] = useState<'settings' | 'dossier'>('settings');`.

**Step 2: Render Tab Buttons**

Add a horizontal flex container at the top of the profile content to switch between "Setări & Tratament" and "Dosar Medical".

**Step 3: Render Dossier UI**

Create a mock UI for the dossier state showing folders:
- Analize de sânge
- Imagistică (RMN/Mamografie)
- Scrisori medicale
And an "Încarcă document" button.

**Step 4: Commit**

```bash
git add src/components/ProfileTab.tsx
git commit -m "feat: add medical dossier sub-tab to profile"
```
