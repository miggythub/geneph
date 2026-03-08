
-- Diseases table
CREATE TABLE public.diseases (
  disease_id TEXT PRIMARY KEY,
  disease_name TEXT NOT NULL,
  disease_category TEXT NOT NULL,
  inheritance_pattern TEXT NOT NULL,
  omim_id TEXT,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Genes table
CREATE TABLE public.genes (
  gene_id TEXT PRIMARY KEY,
  gene_symbol TEXT NOT NULL,
  full_gene_name TEXT NOT NULL,
  gene_type TEXT NOT NULL DEFAULT 'Protein-coding',
  omim_id TEXT,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Functional categories table
CREATE TABLE public.functional_categories (
  category_id TEXT PRIMARY KEY,
  category_name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Gene-Disease associations table
CREATE TABLE public.gene_disease_associations (
  gene_disease_id TEXT PRIMARY KEY,
  gene_id TEXT NOT NULL REFERENCES public.genes(gene_id) ON DELETE CASCADE,
  disease_id TEXT NOT NULL REFERENCES public.diseases(disease_id) ON DELETE CASCADE,
  association_type TEXT NOT NULL DEFAULT 'Germline',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Gene-Category mappings table
CREATE TABLE public.gene_category_mappings (
  gene_category_id TEXT PRIMARY KEY,
  gene_id TEXT NOT NULL REFERENCES public.genes(gene_id) ON DELETE CASCADE,
  category_id TEXT NOT NULL REFERENCES public.functional_categories(category_id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.diseases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.genes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.functional_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gene_disease_associations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gene_category_mappings ENABLE ROW LEVEL SECURITY;

-- Public read access policies (reference data)
CREATE POLICY "Anyone can read diseases" ON public.diseases FOR SELECT USING (true);
CREATE POLICY "Anyone can read genes" ON public.genes FOR SELECT USING (true);
CREATE POLICY "Anyone can read functional_categories" ON public.functional_categories FOR SELECT USING (true);
CREATE POLICY "Anyone can read gene_disease_associations" ON public.gene_disease_associations FOR SELECT USING (true);
CREATE POLICY "Anyone can read gene_category_mappings" ON public.gene_category_mappings FOR SELECT USING (true);

-- Admin write access
CREATE POLICY "Admins can manage diseases" ON public.diseases FOR ALL USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage genes" ON public.genes FOR ALL USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage functional_categories" ON public.functional_categories FOR ALL USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage gene_disease_associations" ON public.gene_disease_associations FOR ALL USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage gene_category_mappings" ON public.gene_category_mappings FOR ALL USING (has_role(auth.uid(), 'admin'));
