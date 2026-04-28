
# Add Data Management for Genes, Diseases, Associations & Categories

Right now, admins/managers can only approve suggestions — there's no UI to edit existing gene/disease profiles, fix mistakes, or manage functional categories and associations. This plan adds full edit/add/remove capability.

## Scope

Both **Super Admin** and **Manager** roles get full data management (matches existing RLS, which already grants both `ALL` access on data tables). Only Super Admin keeps exclusive access to User Management.

## What gets added

### 1. New tabs in the Admin/Manager Panel (`/admin`)

Add four new tabs alongside the existing "Suggestions" tab:

- **Genes** — list, search, add, edit, delete
- **Diseases** — list, search, add, edit, delete
- **Associations** — list gene–disease links, add, edit (assoc type, prevalence, study info, citations), delete
- **Categories** — manage functional categories + assign categories to genes

Each tab uses a searchable table with row actions (Edit / Delete) and an "Add new" button that opens a dialog form.

### 2. Editable fields per entity

**Gene form**: gene_symbol, full_gene_name, gene_type (Protein-coding / Non-coding), omim_id, chromosomal_location, description, plus a multi-select of functional categories.

**Disease form**: disease_name, disease_category (dropdown of known categories), inheritance_pattern, omim_id, description.

**Association form**: gene (searchable dropdown), disease (searchable dropdown), association_type, ph_prevalence, study_type, citation, study_link, description.

**Category form**: category_name, description.

### 3. Inline "Edit" buttons on detail pages

On `/gene/:id` and `/disease/:id`, show a small **Edit** button (pencil icon) in the header **only when the user is admin or manager**. Clicking opens the same edit dialog used in the admin panel, pre-filled with current values.

### 4. Delete safety

- Deleting a gene or disease warns that all related associations and category mappings will also be removed (handled in the delete handler with cascading cleanup queries).
- Confirmation dialog (AlertDialog) before any destructive action.

### 5. Data refresh

After any create/update/delete, invalidate the relevant React Query caches (`genes`, `diseases`, `gene_disease_associations`, `functional_categories`, `gene_category_mappings`) so all pages reflect changes immediately.

## Technical Details

- **No DB schema migration needed** — RLS already permits admins/managers to perform `ALL` operations on `genes`, `diseases`, `gene_disease_associations`, `functional_categories`, and `gene_category_mappings`.
- New components in `src/components/admin/`:
  - `GenesManager.tsx`, `DiseasesManager.tsx`, `AssociationsManager.tsx`, `CategoriesManager.tsx`
  - `GeneFormDialog.tsx`, `DiseaseFormDialog.tsx`, `AssociationFormDialog.tsx`, `CategoryFormDialog.tsx`
  - Shared `ConfirmDeleteDialog.tsx`
- Use existing shadcn primitives: `Dialog`, `AlertDialog`, `Tabs`, `Table`, `Input`, `Textarea`, `Select`, `Command` (for searchable gene/disease pickers).
- Mutations use `supabase.from(...).insert/update/delete` with `useQueryClient().invalidateQueries(...)`.
- IDs for new rows generated client-side with the same pattern already used in `useSuggestionApproval.ts` (e.g., `GENE-XXXXXXXX`, `DIS-XXXXXXXX`, `GDA-XXXXXXXX`, `CAT-XXXXXXXX`).
- Edit buttons on detail pages gated by `useAuth().isAdmin || isManager`.

## Out of scope (can do later if you want)

- Bulk import/CSV upload
- Audit log of who edited what
- Soft-delete / undo
