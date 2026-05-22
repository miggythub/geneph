## Goal

Produce a filled-in version of `GenePH_Grading_Sheet.docx.pdf` with the **Functional Specifications** and **Non-Functional Specifications** sections completed for GenePH, following the format of the sample in pages 4–5. Deliver as a downloadable file in `/mnt/documents/`.

## Deliverable

A new document `GenePH_Grading_Sheet_Filled.pdf` (and `.docx` source so the team can tweak it) containing the original form layout, with these two sections filled in. All other fields (grades, dev names, login info, comments) are left blank for the project managers to score themselves — only the spec *content* is filled in, matching what the sample does.

## Functional Specifications content (per usertype)

Based on the GenePH role model in the codebase (`useAuth`, `AdminPage`, public pages, suggestion flow):

**Usertype: Public Visitor (unauthenticated)**
1. Browse the homepage and dashboard charts
2. Search genes and diseases
3. Use the unified Discover page to filter gene–disease associations
4. View gene detail pages
5. View disease detail pages
6. Submit a gene–disease suggestion via the public suggestion form

**Usertype: Signed-in User**
1. All Public Visitor functions
2. Register via email whitelist + temporary key
3. Log in / log out securely
4. Track own submitted suggestions

**Usertype: Manager**
1. All Signed-in User functions
2. Access the Admin panel
3. Review, approve, and reject suggestions (with admin notes)
4. Create, edit, and delete genes
5. Create, edit, and delete diseases
6. Create, edit, and delete gene–disease associations
7. Create, edit, and delete functional categories
8. Use edit shortcuts on gene/disease detail pages

**Usertype: Super Admin**
1. All Manager functions
2. Manage the email whitelist (add/remove)
3. Generate and copy temporary registration keys
4. Promote users to Manager / Super Admin roles
5. View registration status of whitelisted users

## Non-Functional Specifications content

**User Interface Design**
Burgundy/maroon primary palette with a clean, academic aesthetic appropriate for a genomic research database. Right-aligned navigation, semantic design tokens throughout, and consistent card-based layouts for genes, diseases, and associations. Dashboard uses charts to summarize Philippine-specific genomic data.

**Usability**
Unified `/discover` interface consolidates gene and disease exploration so users do not need to learn two separate pages. Public pages (search, discover, dashboard, suggestion form) are accessible without an account, lowering the barrier for researchers and students. Admin panel uses tabs (Suggestions, Genes, Diseases, Associations, Categories, User Management) for clear navigation. Pending suggestions are surfaced with a badge count.

**Security**
- Login required for all data management and user management functions.
- Role-based access control enforced via a separate `user_roles` table with a `has_role()` security definer function to prevent privilege escalation.
- Row-Level Security policies on all backend tables.
- Registration is whitelist-gated: only emails added by a Super Admin, combined with a one-time temporary key, can sign up.
- First user is automatically promoted to Super Admin; all subsequent elevated roles require explicit assignment.

## Technical approach

1. Generate the filled form as a `.docx` using `docx-js` (per the docx skill), preserving the structure of pages 1–3 (the blank form) and only populating the Functional Specs and Non-Functional Specs blocks.
2. Convert the `.docx` to PDF with LibreOffice.
3. QA: render each PDF page to image and visually verify layout/wrapping/no clipped text. Fix and re-render if needed.
4. Save both files to `/mnt/documents/` and emit `presentation-artifact` tags for download.

Other form fields (grades, individual student scores, accomplished-by, dates, manager comments) are intentionally left as blank lines — those are the project managers' to fill in.
