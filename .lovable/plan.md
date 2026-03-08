

# Redesign to Match Figma ("GenePH")

This is a comprehensive visual and structural redesign. The Figma introduces a new color scheme, branding, navigation structure, two new pages, and additional data fields not currently in the database.

---

## 1. Database Migration

Add missing columns the Figma design relies on:

- **`genes` table**: add `chromosomal_location` (text, nullable) -- shown as badge on Gene Detail (e.g. "17q21.31")
- **`gene_disease_associations` table**: add `ph_prevalence` (text, nullable -- "high"/"moderate"/"low"), `study_type` (text, nullable), `citation` (text, nullable), `study_link` (text, nullable), `description` (text, nullable)

These fields appear prominently in the Discover page cards and Gene Detail associated disease cards.

---

## 2. Color Scheme Overhaul

Change primary color from teal (`168 60% 28%`) to burgundy/maroon (`0 30% 35%`) across `src/index.css`. Update all CSS custom properties: `--primary`, `--ring`, `--sidebar-primary`, etc. The accent remains similar. Category colors stay.

---

## 3. Branding & Header (`AppHeader.tsx`)

- Logo text: "PH-GDAE" → **"GenePH"**, subtitle → **"Philippine Genomic Database"**
- Navigation items (right-aligned): **Search, Discover, Dashboard, Admin**
- Remove Home, Genes, Diseases, Suggest, Sign In/Out from top nav
- Active nav item: filled burgundy pill background
- Logo icon color: burgundy

---

## 4. Footer Component (new)

Create `src/components/AppFooter.tsx`:
- Centered text: "GenePH -- Philippine Gene-Disease Association Database"
- Light gray text, bottom of every page

---

## 5. New Pages

### A. Dashboard Page (`src/pages/DashboardPage.tsx`)
- Title: "Analytics Dashboard" with bar-chart icon
- Subtitle: "Overview of GenePH database statistics."
- 4 stat cards in a row: Total Genes, Total Diseases, Associations, Functional Categories
- Charts (using recharts, already installed):
  - PH Prevalence Distribution (pie chart)
  - Diseases by Category (horizontal bar chart)
  - Top Genes by Associations (horizontal bar chart)
  - Association Types (pie chart)
  - Gene Types Distribution (pie chart)
- All charts use burgundy color palette

### B. Discover Page (`src/pages/DiscoverPage.tsx`)
- Title: "Discovery View" with flask icon
- Subtitle: "Filter gene-disease associations by Philippine prevalence and disease category."
- Filter dropdowns: All Prevalence, All Categories
- List of association cards showing:
  - Gene symbol (burgundy) → Disease name (bold), PH Prevalence badge (right)
  - Description text
  - Category badge (colored), Study type badge (gray), Citation text

---

## 6. Page Redesigns

### Gene Detail (`GeneDetail.tsx`)
- "← Back to Search" link
- Gene symbol as large heading, full name as subtitle
- Chromosomal location badge (top-right, pill/rounded)
- Description paragraph
- "Associated Diseases" section with cards showing: disease name, PH Prevalence badge, description, study type badge, citation, "View Study" link

### Auth Page (`AuthPage.tsx`)
- Centered card with shield icon (burgundy circle)
- Title: "Admin Portal", subtitle: "Sign in to manage gene-disease data."
- Email + Password fields, burgundy "Sign In" button
- "Need an account? Sign up" link

### Search Page
- Keep similar but adapt to burgundy theme

---

## 7. Routing Updates (`App.tsx`)

- Add `/discover` → DiscoverPage
- Add `/dashboard` → DashboardPage
- Keep `/search`, `/gene/:id`, `/disease/:id`, `/auth`, `/admin`
- Remove or redirect `/genes`, `/diseases` (or keep as hidden routes)

---

## 8. Files Changed

| File | Action |
|------|--------|
| `src/index.css` | Update color variables to burgundy |
| `src/components/AppHeader.tsx` | Rebrand + restructure nav |
| `src/components/AppFooter.tsx` | Create footer |
| `src/pages/DashboardPage.tsx` | Create analytics dashboard |
| `src/pages/DiscoverPage.tsx` | Create discover/association list |
| `src/pages/GeneDetail.tsx` | Redesign layout |
| `src/pages/AuthPage.tsx` | Redesign to match Figma |
| `src/pages/SearchPage.tsx` | Theme updates |
| `src/App.tsx` | Add routes, add footer |
| `src/hooks/useDatabase.ts` | Update types for new columns |
| Database migration | Add columns to genes & associations |

