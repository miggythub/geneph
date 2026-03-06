export interface Gene {
  gene_id: string;
  gene_symbol: string;
  full_gene_name: string;
  gene_type: "protein-coding" | "non-coding";
  omim_id: string;
  description: string;
}

export interface Disease {
  disease_id: string;
  disease_name: string;
  disease_category: DiseaseCategory;
  inheritance_pattern: string;
  omim_id: string;
  description: string;
  ph_prevalence: "high" | "moderate" | "low";
  newborn_screening_ph: boolean;
  local_notes?: string;
  references?: string[];
}

export type DiseaseCategory =
  | "Blood / Hematologic"
  | "Metabolic / Endocrine"
  | "Neuromuscular / Neurologic"
  | "Sensory / Ophthalmologic"
  | "Hepatic / Systemic"
  | "Cancer";

export interface FunctionalCategory {
  category_id: string;
  category_name: string;
  description: string;
}

export interface GeneDiseaseAssociation {
  gene_disease_id: string;
  gene_id: string;
  disease_id: string;
  association_type: "predisposition" | "driver" | "somatic" | "germline";
}

export interface GeneCategoryMapping {
  gene_category_id: string;
  gene_id: string;
  category_id: string;
}

export const CATEGORY_COLORS: Record<DiseaseCategory, string> = {
  "Blood / Hematologic": "bg-cat-blood",
  "Metabolic / Endocrine": "bg-cat-metabolic",
  "Neuromuscular / Neurologic": "bg-cat-neuro",
  "Sensory / Ophthalmologic": "bg-cat-sensory",
  "Hepatic / Systemic": "bg-cat-hepatic",
  "Cancer": "bg-cat-cancer",
};

export const CATEGORY_TEXT_COLORS: Record<DiseaseCategory, string> = {
  "Blood / Hematologic": "text-cat-blood",
  "Metabolic / Endocrine": "text-cat-metabolic",
  "Neuromuscular / Neurologic": "text-cat-neuro",
  "Sensory / Ophthalmologic": "text-cat-sensory",
  "Hepatic / Systemic": "text-cat-hepatic",
  "Cancer": "text-cat-cancer",
};
