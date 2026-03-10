import { supabase } from "@/integrations/supabase/client";

/**
 * Attempts to add a gene-disease association to the database
 * when a suggestion with gene + disease is approved.
 * Returns { success, message }.
 */
export async function addSuggestionToDatabase(
  geneName: string,
  diseaseName: string
): Promise<{ success: boolean; message: string }> {
  if (!geneName || geneName === "N/A" || !diseaseName || diseaseName === "N/A") {
    return { success: true, message: "No gene/disease to add." };
  }

  // Look up existing gene by symbol (case-insensitive)
  const { data: existingGene } = await supabase
    .from("genes")
    .select("gene_id")
    .ilike("gene_symbol", geneName.trim())
    .maybeSingle();

  // Look up existing disease by name (case-insensitive)
  const { data: existingDisease } = await supabase
    .from("diseases")
    .select("disease_id")
    .ilike("disease_name", diseaseName.trim())
    .maybeSingle();

  let geneId = existingGene?.gene_id;
  let diseaseId = existingDisease?.disease_id;

  // Create gene if not found
  if (!geneId) {
    const newGeneId = `GENE-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
    const { error } = await supabase.from("genes").insert({
      gene_id: newGeneId,
      gene_symbol: geneName.trim().toUpperCase(),
      full_gene_name: geneName.trim(),
      gene_type: "Protein-coding",
    });
    if (error) return { success: false, message: `Failed to create gene: ${error.message}` };
    geneId = newGeneId;
  }

  // Create disease if not found
  if (!diseaseId) {
    const newDiseaseId = `DIS-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
    const { error } = await supabase.from("diseases").insert({
      disease_id: newDiseaseId,
      disease_name: diseaseName.trim(),
      disease_category: "Other",
      inheritance_pattern: "Unknown",
    });
    if (error) return { success: false, message: `Failed to create disease: ${error.message}` };
    diseaseId = newDiseaseId;
  }

  // Check if association already exists
  const { data: existingAssoc } = await supabase
    .from("gene_disease_associations")
    .select("gene_disease_id")
    .eq("gene_id", geneId)
    .eq("disease_id", diseaseId)
    .maybeSingle();

  if (existingAssoc) {
    return { success: true, message: "Association already exists." };
  }

  // Create association
  const newAssocId = `GDA-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
  const { error } = await supabase.from("gene_disease_associations").insert({
    gene_disease_id: newAssocId,
    gene_id: geneId,
    disease_id: diseaseId,
    association_type: "Germline",
  });

  if (error) return { success: false, message: `Failed to create association: ${error.message}` };
  return { success: true, message: "Gene-disease association added to database." };
}
