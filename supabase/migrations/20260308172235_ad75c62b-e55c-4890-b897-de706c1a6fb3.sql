
ALTER TABLE public.genes ADD COLUMN IF NOT EXISTS chromosomal_location text;

ALTER TABLE public.gene_disease_associations 
  ADD COLUMN IF NOT EXISTS ph_prevalence text,
  ADD COLUMN IF NOT EXISTS study_type text,
  ADD COLUMN IF NOT EXISTS citation text,
  ADD COLUMN IF NOT EXISTS study_link text,
  ADD COLUMN IF NOT EXISTS description text;
