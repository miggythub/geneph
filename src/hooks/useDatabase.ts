import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  genes as seedGenes,
  diseases as seedDiseases,
  functionalCategories as seedCategories,
  geneDiseaseAssociations as seedAssociations,
  geneCategoryMappings as seedMappings,
} from "@/data/seedData";

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

// Demo fallbacks built from local seed data
const fallbackGenes: DbGene[] = seedGenes.map((g) => ({
  gene_id: g.gene_id,
  gene_symbol: g.gene_symbol,
  full_gene_name: g.full_gene_name,
  gene_type: g.gene_type,
  omim_id: g.omim_id,
  description: g.description,
  chromosomal_location: null,
}));

const fallbackDiseases: DbDisease[] = seedDiseases.map((d) => ({
  disease_id: d.disease_id,
  disease_name: d.disease_name,
  disease_category: d.disease_category,
  inheritance_pattern: d.inheritance_pattern,
  omim_id: d.omim_id,
  description: d.description,
}));

const fallbackCategories: DbFunctionalCategory[] = seedCategories.map((c) => ({
  category_id: c.category_id,
  category_name: c.category_name,
  description: c.description,
}));

const fallbackAssociations: DbGeneDiseaseAssociation[] = seedAssociations.map((a) => ({
  gene_disease_id: a.gene_disease_id,
  gene_id: a.gene_id,
  disease_id: a.disease_id,
  association_type: a.association_type,
  ph_prevalence: null,
  study_type: null,
  citation: null,
  study_link: null,
  description: null,
}));

const fallbackMappings: DbGeneCategoryMapping[] = seedMappings.map((m) => ({
  gene_category_id: m.gene_category_id,
  gene_id: m.gene_id,
  category_id: m.category_id,
}));

// Race a promise against a timeout; throw if timed out
function withTimeout<T>(p: Promise<T>, ms = 6000): Promise<T> {
  return new Promise((resolve, reject) => {
    const t = setTimeout(() => reject(new Error("timeout")), ms);
    p.then(
      (v) => {
        clearTimeout(t);
        resolve(v);
      },
      (e) => {
        clearTimeout(t);
        reject(e);
      }
    );
  });
}

async function fetchWithFallback<T>(
  fetcher: () => Promise<T>,
  fallback: T
): Promise<T> {
  try {
    return await withTimeout(fetcher());
  } catch (err) {
    console.warn("[useDatabase] backend unavailable, using demo data:", err);
    return fallback;
  }
}

export function useGenes() {
  return useQuery({
    queryKey: ["genes"],
    queryFn: () =>
      fetchWithFallback(async () => {
        const { data, error } = await supabase.from("genes").select("*").order("gene_symbol");
        if (error) throw error;
        return data as DbGene[];
      }, fallbackGenes),
  });
}

export function useDiseases() {
  return useQuery({
    queryKey: ["diseases"],
    queryFn: () =>
      fetchWithFallback(async () => {
        const { data, error } = await supabase.from("diseases").select("*").order("disease_name");
        if (error) throw error;
        return data as DbDisease[];
      }, fallbackDiseases),
  });
}

export function useFunctionalCategories() {
  return useQuery({
    queryKey: ["functional_categories"],
    queryFn: () =>
      fetchWithFallback(async () => {
        const { data, error } = await supabase
          .from("functional_categories")
          .select("*")
          .order("category_name");
        if (error) throw error;
        return data as DbFunctionalCategory[];
      }, fallbackCategories),
  });
}

export function useGeneDiseaseAssociations() {
  return useQuery({
    queryKey: ["gene_disease_associations"],
    queryFn: () =>
      fetchWithFallback(async () => {
        const { data, error } = await supabase.from("gene_disease_associations").select("*");
        if (error) throw error;
        return data as DbGeneDiseaseAssociation[];
      }, fallbackAssociations),
  });
}

export function useGeneCategoryMappings() {
  return useQuery({
    queryKey: ["gene_category_mappings"],
    queryFn: () =>
      fetchWithFallback(async () => {
        const { data, error } = await supabase.from("gene_category_mappings").select("*");
        if (error) throw error;
        return data as DbGeneCategoryMapping[];
      }, fallbackMappings),
  });
}

export function useGene(id: string | undefined) {
  return useQuery({
    queryKey: ["gene", id],
    queryFn: () =>
      fetchWithFallback(async () => {
        if (!id) return null;
        const { data, error } = await supabase.from("genes").select("*").eq("gene_id", id).single();
        if (error) throw error;
        return data as DbGene;
      }, fallbackGenes.find((g) => g.gene_id === id) ?? null),
    enabled: !!id,
  });
}

export function useDisease(id: string | undefined) {
  return useQuery({
    queryKey: ["disease", id],
    queryFn: () =>
      fetchWithFallback(async () => {
        if (!id) return null;
        const { data, error } = await supabase
          .from("diseases")
          .select("*")
          .eq("disease_id", id)
          .single();
        if (error) throw error;
        return data as DbDisease;
      }, fallbackDiseases.find((d) => d.disease_id === id) ?? null),
    enabled: !!id,
  });
}
