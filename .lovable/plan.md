## Goal

Produce three professional documents for the GenePH project, delivered as downloadable PDFs (with `.docx` sources) in `/mnt/documents/`:

1. **SRS** — Software Requirements Specification
2. **RTM** — Requirements Traceability Matrix
3. **User Manual** — End-user guide for all roles

The GitHub repo already has an installation manual, so installation steps will be referenced, not duplicated.

## Document 1: SRS (Software Requirements Specification)

IEEE 830-style structure:

1. **Introduction** — Purpose, scope, definitions/acronyms (gene, disease, association, PH-prevalence, RLS, whitelist), references, overview
2. **Overall Description** — Product perspective, product functions, user classes (Public Visitor, Signed-in User, Manager, Super Admin), operating environment (React 18 + Vite + Tailwind + Lovable Cloud/Supabase), design constraints, assumptions
3. **Specific Requirements**
   - Functional Requirements (FR-001…FR-NN) covering: browse/search, discover filtering, dashboard charts, gene/disease detail views, suggestion submission (guest + signed-in), authentication (whitelist + temp key), admin CRUD (genes, diseases, associations, categories), suggestion review, whitelist management, role promotion, auto-approval for managers
   - Non-Functional Requirements: performance (6s fallback to seed data, 5min query cache), security (RLS, `has_role` security definer, whitelist-gated signup, first-user-as-Super-Admin), usability (unified `/discover`, public read access), reliability (offline seed fallback), maintainability (semantic design tokens), portability (web, responsive)
4. **External Interface Requirements** — UI (burgundy/maroon palette, right-aligned nav), hardware (modern browser), software (Lovable Cloud), communications (HTTPS to Supabase)
5. **Appendices** — Data model summary (genes, diseases, gene_disease_associations, functional_categories, gene_category_mappings, suggestions, whitelist, profiles, user_roles)

## Document 2: RTM (Requirements Traceability Matrix)

Landscape table with columns:

| Req ID | Requirement | Type | Source/User Class | Implementation (file/component) | Test Reference | Status |

Rows map each SRS FR/NFR to:
- The page/component implementing it (e.g. FR-005 Discover filter → `src/pages/DiscoverPage.tsx`)
- The user class that uses it
- A simple manual test step ("Open /discover, apply category filter, verify list filters")
- Status: Implemented / Partial / Planned

Will cover ~25–35 traced requirements across browsing, auth, suggestions, admin CRUD, user management, and NFRs.

## Document 3: User Manual

Audience-segmented guide:

1. **Getting Started** — What GenePH is, accessing the live site (`https://geneph.lovable.app`), supported browsers, link to GitHub install manual for local setup
2. **Public Visitor Guide** — Home/dashboard tour, search, Discover page filters, gene/disease detail pages, submitting a suggestion as guest
3. **Signed-in User Guide** — Registration (whitelist + temp key flow), login/logout, tracking your suggestions, viewing suggestion status
4. **Manager Guide** — Accessing `/admin`, reviewing suggestions (approve/reject + admin notes), CRUD for genes/diseases/associations/categories, edit shortcuts on detail pages, auto-approval behavior
5. **Super Admin Guide** — User Management tab, adding emails to whitelist, generating/copying temp keys, promoting users to Manager/Super Admin
6. **Troubleshooting** — Slow load on weak Wi-Fi (seed-data fallback after 6s), login errors, where to find the publishable key (references `LOCAL_DEMO.md`)
7. **FAQ** — How is the first Super Admin created? How do I share access with a colleague? What happens if a suggestion is rejected?

Screenshots are NOT included (would require live capture); the manual is text + clear step-by-step instructions with section/button names matching the UI.

## Technical Approach

1. Generate each document as `.docx` using `docx-js` (per the docx skill), with consistent styling: Arial body, burgundy accent on headings, US Letter page size, 1" margins.
2. Convert each to PDF with LibreOffice.
3. QA: render every page of each PDF to JPEG with `pdftoppm` and visually inspect for clipping, overflow, broken tables, or empty pages. Fix and re-render if needed.
4. Save all 6 files (3 `.docx` + 3 `.pdf`) to `/mnt/documents/` and emit `presentation-artifact` tags so the user can download them.

## Out of Scope

- Installation steps (already in GitHub README)
- Screenshots (no live capture available in this session)
- Filling grading-sheet-style fields (separate document)
