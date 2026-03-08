import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface DbGene {
  gene_id: string;
  gene_symbol: string;
  full_gene_name: string;
  gene_type: string;
  omim_id: string | null;
  description: string | null;
  chromosomal_location: string | null;
}

export interface DbDisease {
  disease_id: string;
  disease_name: string;
  disease_category: string;
  inheritance_pattern: string;
  omim_id: string | null;
  description: string | null;
}

export interface DbFunctionalCategory {
  category_id: string;
  category_name: string;
  description: string | null;
}

export interface DbGeneDiseaseAssociation {
  gene_disease_id: string;
  gene_id: string;
  disease_id: string;
  association_type: string;
  ph_prevalence: string | null;
  study_type: string | null;
  citation: string | null;
  study_link: string | null;
  description: string | null;
}

export interface DbGeneCategoryMapping {
  gene_category_id: string;
  gene_id: string;
  category_id: string;
}

export function useGenes() {
  return useQuery({
    queryKey: ["genes"],
    queryFn: async () => {
      const { data, error } = await supabase.from("genes").select("*").order("gene_symbol");
      if (error) throw error;
      return data as DbGene[];
    },
  });
}

export function useDiseases() {
  return useQuery({
    queryKey: ["diseases"],
    queryFn: async () => {
      const { data, error } = await supabase.from("diseases").select("*").order("disease_name");
      if (error) throw error;
      return data as DbDisease[];
    },
  });
}

export function useFunctionalCategories() {
  return useQuery({
    queryKey: ["functional_categories"],
    queryFn: async () => {
      const { data, error } = await supabase.from("functional_categories").select("*").order("category_name");
      if (error) throw error;
      return data as DbFunctionalCategory[];
    },
  });
}

export function useGeneDiseaseAssociations() {
  return useQuery({
    queryKey: ["gene_disease_associations"],
    queryFn: async () => {
      const { data, error } = await supabase.from("gene_disease_associations").select("*");
      if (error) throw error;
      return data as DbGeneDiseaseAssociation[];
    },
  });
}

export function useGeneCategoryMappings() {
  return useQuery({
    queryKey: ["gene_category_mappings"],
    queryFn: async () => {
      const { data, error } = await supabase.from("gene_category_mappings").select("*");
      if (error) throw error;
      return data as DbGeneCategoryMapping[];
    },
  });
}

export function useGene(id: string | undefined) {
  return useQuery({
    queryKey: ["gene", id],
    queryFn: async () => {
      if (!id) return null;
      const { data, error } = await supabase.from("genes").select("*").eq("gene_id", id).single();
      if (error) throw error;
      return data as DbGene;
    },
    enabled: !!id,
  });
}

export function useDisease(id: string | undefined) {
  return useQuery({
    queryKey: ["disease", id],
    queryFn: async () => {
      if (!id) return null;
      const { data, error } = await supabase.from("diseases").select("*").eq("disease_id", id).single();
      if (error) throw error;
      return data as DbDisease;
    },
    enabled: !!id,
  });
}
