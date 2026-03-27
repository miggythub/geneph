
-- Make user_id nullable for anonymous suggestions
ALTER TABLE public.suggestions ALTER COLUMN user_id DROP NOT NULL;

-- Drop existing insert policy
DROP POLICY IF EXISTS "Users can insert suggestions" ON public.suggestions;

-- Allow anyone (including anon) to insert suggestions
CREATE POLICY "Anyone can insert suggestions"
ON public.suggestions
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Drop existing select policy
DROP POLICY IF EXISTS "Users can view own suggestions" ON public.suggestions;

CREATE POLICY "Users can view own suggestions or admins/managers all"
ON public.suggestions
FOR SELECT
TO authenticated
USING (
  auth.uid() = user_id
  OR has_role(auth.uid(), 'admin')
  OR has_role(auth.uid(), 'manager')
);

-- Update admin update policy to also allow managers
DROP POLICY IF EXISTS "Admins can update suggestions" ON public.suggestions;

CREATE POLICY "Admins and managers can update suggestions"
ON public.suggestions
FOR UPDATE
TO authenticated
USING (
  has_role(auth.uid(), 'admin')
  OR has_role(auth.uid(), 'manager')
);

-- Allow managers to manage genes, diseases, associations
DROP POLICY IF EXISTS "Admins can manage genes" ON public.genes;
CREATE POLICY "Admins and managers can manage genes"
ON public.genes FOR ALL TO public
USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'manager'));

DROP POLICY IF EXISTS "Admins can manage diseases" ON public.diseases;
CREATE POLICY "Admins and managers can manage diseases"
ON public.diseases FOR ALL TO public
USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'manager'));

DROP POLICY IF EXISTS "Admins can manage gene_disease_associations" ON public.gene_disease_associations;
CREATE POLICY "Admins and managers can manage associations"
ON public.gene_disease_associations FOR ALL TO public
USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'manager'));

DROP POLICY IF EXISTS "Admins can manage functional_categories" ON public.functional_categories;
CREATE POLICY "Admins and managers can manage categories"
ON public.functional_categories FOR ALL TO public
USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'manager'));

DROP POLICY IF EXISTS "Admins can manage gene_category_mappings" ON public.gene_category_mappings;
CREATE POLICY "Admins and managers can manage gene_category_mappings"
ON public.gene_category_mappings FOR ALL TO public
USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'manager'));

-- Whitelist: only super admin (admin role) can manage
-- Already has correct policy, no changes needed
