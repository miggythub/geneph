import type { Gene, Disease, GeneDiseaseAssociation, FunctionalCategory, GeneCategoryMapping } from "./types";

export const genes: Gene[] = [
  { gene_id: "g1", gene_symbol: "G6PD", full_gene_name: "Glucose-6-Phosphate Dehydrogenase", gene_type: "protein-coding", omim_id: "305900", description: "Encodes glucose-6-phosphate dehydrogenase, a key enzyme in the pentose phosphate pathway. Deficiency is the most common enzyme deficiency worldwide, particularly prevalent in Southeast Asia including the Philippines." },
  { gene_id: "g2", gene_symbol: "HBB", full_gene_name: "Hemoglobin Subunit Beta", gene_type: "protein-coding", omim_id: "141900", description: "Encodes the beta-globin chain of hemoglobin. Mutations cause beta-thalassemia and sickle cell disease. Filipino carriers often carry the IVS1-5 and Codon 41/42 variants." },
  { gene_id: "g3", gene_symbol: "HBA1", full_gene_name: "Hemoglobin Subunit Alpha 1", gene_type: "protein-coding", omim_id: "141800", description: "Encodes the alpha-globin chain. Deletions in the HBA1/HBA2 region cause alpha-thalassemia, common among Southeast Asian populations." },
  { gene_id: "g4", gene_symbol: "F8", full_gene_name: "Coagulation Factor VIII", gene_type: "protein-coding", omim_id: "300841", description: "Encodes coagulation factor VIII. Deficiency or dysfunction causes hemophilia A, the most common severe bleeding disorder." },
  { gene_id: "g5", gene_symbol: "F9", full_gene_name: "Coagulation Factor IX", gene_type: "protein-coding", omim_id: "300746", description: "Encodes coagulation factor IX. Deficiency causes hemophilia B (Christmas disease)." },
  { gene_id: "g6", gene_symbol: "PAH", full_gene_name: "Phenylalanine Hydroxylase", gene_type: "protein-coding", omim_id: "612349", description: "Encodes phenylalanine hydroxylase. Deficiency causes phenylketonuria (PKU), screened in the Philippine Newborn Screening Program." },
  { gene_id: "g7", gene_symbol: "BCKDHA", full_gene_name: "Branched Chain Keto Acid Dehydrogenase E1 Subunit Alpha", gene_type: "protein-coding", omim_id: "608348", description: "Encodes a subunit of the branched-chain alpha-ketoacid dehydrogenase complex. Mutations cause maple syrup urine disease (MSUD)." },
  { gene_id: "g8", gene_symbol: "GALT", full_gene_name: "Galactose-1-Phosphate Uridylyltransferase", gene_type: "protein-coding", omim_id: "606999", description: "Encodes GALT enzyme. Deficiency causes classic galactosemia, included in PH newborn screening." },
  { gene_id: "g9", gene_symbol: "CYP21A2", full_gene_name: "Cytochrome P450 Family 21 Subfamily A Member 2", gene_type: "protein-coding", omim_id: "613815", description: "Encodes steroid 21-hydroxylase. Mutations cause congenital adrenal hyperplasia (CAH), one of the most commonly detected conditions in PH newborn screening." },
  { gene_id: "g10", gene_symbol: "TSHR", full_gene_name: "Thyroid Stimulating Hormone Receptor", gene_type: "protein-coding", omim_id: "603372", description: "Mutations can cause congenital hypothyroidism. One of the original conditions in the Philippine Newborn Screening Program." },
  { gene_id: "g11", gene_symbol: "MUT", full_gene_name: "Methylmalonyl-CoA Mutase", gene_type: "protein-coding", omim_id: "609058", description: "Encodes methylmalonyl-CoA mutase. Deficiency causes methylmalonic acidemia." },
  { gene_id: "g12", gene_symbol: "PCCA", full_gene_name: "Propionyl-CoA Carboxylase Subunit Alpha", gene_type: "protein-coding", omim_id: "232000", description: "Encodes a subunit of propionyl-CoA carboxylase. Mutations cause propionic acidemia." },
  { gene_id: "g13", gene_symbol: "SMN1", full_gene_name: "Survival Motor Neuron 1", gene_type: "protein-coding", omim_id: "600354", description: "Encodes the survival motor neuron protein. Homozygous deletion/mutation causes spinal muscular atrophy (SMA), one of the leading genetic causes of infant mortality." },
  { gene_id: "g14", gene_symbol: "DMD", full_gene_name: "Dystrophin", gene_type: "protein-coding", omim_id: "300377", description: "Encodes dystrophin. Mutations cause Duchenne (severe) or Becker (milder) muscular dystrophy. X-linked recessive." },
  { gene_id: "g15", gene_symbol: "MECP2", full_gene_name: "Methyl-CpG Binding Protein 2", gene_type: "protein-coding", omim_id: "300005", description: "Encodes MeCP2 protein involved in neuronal maturation. Mutations cause Rett syndrome, primarily affecting females." },
  { gene_id: "g16", gene_symbol: "RHO", full_gene_name: "Rhodopsin", gene_type: "protein-coding", omim_id: "180380", description: "Encodes rhodopsin, the light-sensitive receptor in rod photoreceptors. Mutations cause autosomal dominant retinitis pigmentosa." },
  { gene_id: "g17", gene_symbol: "MYO7A", full_gene_name: "Myosin VIIA", gene_type: "protein-coding", omim_id: "276903", description: "Encodes an unconventional myosin. Mutations cause Usher syndrome type 1B (combined deafness and retinitis pigmentosa)." },
  { gene_id: "g18", gene_symbol: "ATP7B", full_gene_name: "ATPase Copper Transporting Beta", gene_type: "protein-coding", omim_id: "606882", description: "Encodes a copper-transporting ATPase. Mutations cause Wilson disease, leading to copper accumulation in liver and brain." },
  { gene_id: "g19", gene_symbol: "CFTR", full_gene_name: "CF Transmembrane Conductance Regulator", gene_type: "protein-coding", omim_id: "602421", description: "Encodes a chloride channel. Mutations cause cystic fibrosis, less common but documented in Filipino populations." },
];

export const diseases: Disease[] = [
  // Blood / Hematologic
  { disease_id: "d1", disease_name: "G6PD Deficiency", disease_category: "Blood / Hematologic", inheritance_pattern: "X-linked recessive", omim_id: "300908", description: "Most common enzyme deficiency worldwide. Causes hemolytic anemia triggered by certain foods, drugs, or infections. Very high prevalence among Filipino males.", ph_prevalence: "high", newborn_screening_ph: true, local_notes: "One of the most frequently detected conditions in the Philippine Newborn Screening Program. The Filipino variant (G6PD Vanua Lava) is common.", references: ["DOH Newborn Screening Reference Center", "Philippine Journal of Pediatrics"] },
  { disease_id: "d2", disease_name: "Beta-Thalassemia", disease_category: "Blood / Hematologic", inheritance_pattern: "Autosomal recessive", omim_id: "613985", description: "A group of inherited blood disorders characterized by reduced or absent beta-globin chain synthesis, leading to anemia.", ph_prevalence: "moderate", newborn_screening_ph: false, local_notes: "Carrier rate in the Philippines estimated at 1-5%. IVS1-5 (G>C) is the most common mutation among Filipino carriers.", references: ["Philippine Society of Hematology and Blood Transfusion"] },
  { disease_id: "d3", disease_name: "Alpha-Thalassemia", disease_category: "Blood / Hematologic", inheritance_pattern: "Autosomal recessive", omim_id: "604131", description: "Inherited hemoglobin disorder caused by deletions in alpha-globin genes. Southeast Asian deletion (--SEA) is the most common severe form in the region.", ph_prevalence: "moderate", newborn_screening_ph: false, local_notes: "The --SEA deletion is prevalent among Filipinos. Hemoglobin H disease cases are regularly diagnosed in Philippine hospitals." },
  { disease_id: "d4", disease_name: "Hemophilia A", disease_category: "Blood / Hematologic", inheritance_pattern: "X-linked recessive", omim_id: "306700", description: "A bleeding disorder caused by deficiency of clotting factor VIII. Severity depends on factor level.", ph_prevalence: "low", newborn_screening_ph: false, local_notes: "Managed by the Philippine Hemophilia Foundation. Treatment access remains a challenge in rural areas." },
  { disease_id: "d5", disease_name: "Hemophilia B", disease_category: "Blood / Hematologic", inheritance_pattern: "X-linked recessive", omim_id: "306900", description: "A bleeding disorder caused by deficiency of clotting factor IX (Christmas disease). Less common than hemophilia A.", ph_prevalence: "low", newborn_screening_ph: false },

  // Metabolic / Endocrine
  { disease_id: "d6", disease_name: "Phenylketonuria (PKU)", disease_category: "Metabolic / Endocrine", inheritance_pattern: "Autosomal recessive", omim_id: "261600", description: "Inborn error of metabolism where phenylalanine cannot be properly metabolized, leading to intellectual disability if untreated.", ph_prevalence: "low", newborn_screening_ph: true, local_notes: "Included in the Expanded Newborn Screening panel. Cases are rare but early detection is critical.", references: ["Newborn Screening Reference Center – NIH Philippines"] },
  { disease_id: "d7", disease_name: "Maple Syrup Urine Disease (MSUD)", disease_category: "Metabolic / Endocrine", inheritance_pattern: "Autosomal recessive", omim_id: "248600", description: "A metabolic disorder affecting branched-chain amino acid metabolism. Named for the sweet odor of affected infants' urine.", ph_prevalence: "low", newborn_screening_ph: true, local_notes: "Detected through expanded newborn screening in the Philippines." },
  { disease_id: "d8", disease_name: "Classic Galactosemia", disease_category: "Metabolic / Endocrine", inheritance_pattern: "Autosomal recessive", omim_id: "230400", description: "Inability to metabolize galactose properly, leading to liver damage, cataracts, and developmental issues if untreated.", ph_prevalence: "low", newborn_screening_ph: true, local_notes: "Part of the Philippine newborn screening expanded panel." },
  { disease_id: "d9", disease_name: "Congenital Adrenal Hyperplasia", disease_category: "Metabolic / Endocrine", inheritance_pattern: "Autosomal recessive", omim_id: "201910", description: "A group of autosomal recessive disorders of adrenal steroidogenesis. 21-hydroxylase deficiency accounts for ~95% of cases.", ph_prevalence: "high", newborn_screening_ph: true, local_notes: "One of the most commonly detected conditions in PH newborn screening. The Philippines has among the highest detection rates in Southeast Asia.", references: ["DOH Newborn Screening Reference Center", "Southeast Asian Journal of Tropical Medicine"] },
  { disease_id: "d10", disease_name: "Congenital Hypothyroidism", disease_category: "Metabolic / Endocrine", inheritance_pattern: "Variable", omim_id: "275200", description: "Thyroid hormone deficiency present at birth. The most common preventable cause of intellectual disability.", ph_prevalence: "high", newborn_screening_ph: true, local_notes: "The first condition included in the Philippine Newborn Screening Program (1996). Has the highest detection rate among all screened conditions.", references: ["Republic Act 9288 – Newborn Screening Act of 2004"] },
  { disease_id: "d11", disease_name: "Methylmalonic Acidemia", disease_category: "Metabolic / Endocrine", inheritance_pattern: "Autosomal recessive", omim_id: "251000", description: "An organic acidemia caused by deficiency of methylmalonyl-CoA mutase, leading to metabolic crises.", ph_prevalence: "low", newborn_screening_ph: true },
  { disease_id: "d12", disease_name: "Propionic Acidemia", disease_category: "Metabolic / Endocrine", inheritance_pattern: "Autosomal recessive", omim_id: "606054", description: "An organic acidemia caused by deficiency of propionyl-CoA carboxylase. Can cause life-threatening metabolic crises in infancy.", ph_prevalence: "low", newborn_screening_ph: true },

  // Neuromuscular / Neurologic
  { disease_id: "d13", disease_name: "Spinal Muscular Atrophy (SMA)", disease_category: "Neuromuscular / Neurologic", inheritance_pattern: "Autosomal recessive", omim_id: "253300", description: "A progressive neuromuscular disease caused by degeneration of motor neurons. Leading genetic cause of infant mortality.", ph_prevalence: "moderate", newborn_screening_ph: false, local_notes: "Carrier frequency estimated at ~1:50 in the Filipino population. New gene therapies (Zolgensma) are becoming available but costly.", references: ["Philippine Neurological Association"] },
  { disease_id: "d14", disease_name: "Duchenne Muscular Dystrophy", disease_category: "Neuromuscular / Neurologic", inheritance_pattern: "X-linked recessive", omim_id: "310200", description: "Severe progressive muscle degeneration. Affects approximately 1 in 3,500 male births worldwide.", ph_prevalence: "moderate", newborn_screening_ph: false, local_notes: "Philippine Muscular Dystrophy Association provides support and advocacy." },
  { disease_id: "d15", disease_name: "Becker Muscular Dystrophy", disease_category: "Neuromuscular / Neurologic", inheritance_pattern: "X-linked recessive", omim_id: "300376", description: "A milder form of dystrophinopathy compared to Duchenne, with later onset and slower progression.", ph_prevalence: "low", newborn_screening_ph: false },
  { disease_id: "d16", disease_name: "Rett Syndrome", disease_category: "Neuromuscular / Neurologic", inheritance_pattern: "X-linked dominant", omim_id: "312750", description: "A neurodevelopmental disorder primarily affecting females. Characterized by loss of hand skills and spoken language after a period of normal development.", ph_prevalence: "low", newborn_screening_ph: false },

  // Sensory / Ophthalmologic
  { disease_id: "d17", disease_name: "Retinitis Pigmentosa", disease_category: "Sensory / Ophthalmologic", inheritance_pattern: "Variable (AD, AR, X-linked)", omim_id: "268000", description: "A group of inherited retinal dystrophies causing progressive vision loss. Night blindness is usually the first symptom.", ph_prevalence: "low", newborn_screening_ph: false, local_notes: "Several Filipino families with RP have been characterized. Gene therapy trials are ongoing internationally." },
  { disease_id: "d18", disease_name: "Usher Syndrome", disease_category: "Sensory / Ophthalmologic", inheritance_pattern: "Autosomal recessive", omim_id: "276900", description: "Combined congenital sensorineural hearing loss and progressive retinitis pigmentosa. The most common cause of combined deafness-blindness.", ph_prevalence: "low", newborn_screening_ph: false },

  // Hepatic / Systemic
  { disease_id: "d19", disease_name: "Wilson Disease", disease_category: "Hepatic / Systemic", inheritance_pattern: "Autosomal recessive", omim_id: "277900", description: "A disorder of copper metabolism leading to copper accumulation in liver, brain, and other organs. Treatable if detected early.", ph_prevalence: "low", newborn_screening_ph: false, local_notes: "Cases documented in Philippine General Hospital and other tertiary centers." },
  { disease_id: "d20", disease_name: "Cystic Fibrosis", disease_category: "Hepatic / Systemic", inheritance_pattern: "Autosomal recessive", omim_id: "219700", description: "A multisystem disease caused by defective chloride transport. Primarily affects lungs and digestive system.", ph_prevalence: "low", newborn_screening_ph: false, local_notes: "Rare in the Philippines but cases have been documented. The F508del mutation is less common in Asian populations." },
];

export const functionalCategories: FunctionalCategory[] = [
  { category_id: "fc1", category_name: "Enzyme", description: "Genes encoding enzymes that catalyze metabolic reactions" },
  { category_id: "fc2", category_name: "Structural Protein", description: "Genes encoding proteins that provide structural support to cells and tissues" },
  { category_id: "fc3", category_name: "Transport Protein", description: "Genes encoding proteins involved in transporting molecules across membranes" },
  { category_id: "fc4", category_name: "Receptor", description: "Genes encoding cell surface or nuclear receptors" },
  { category_id: "fc5", category_name: "Transcription Factor", description: "Genes encoding proteins that regulate gene expression" },
  { category_id: "fc6", category_name: "Coagulation Factor", description: "Genes encoding blood clotting factors" },
  { category_id: "fc7", category_name: "Ion Channel", description: "Genes encoding ion channel proteins" },
  { category_id: "fc8", category_name: "Motor Protein", description: "Genes encoding proteins involved in cellular movement" },
];

export const geneDiseaseAssociations: GeneDiseaseAssociation[] = [
  { gene_disease_id: "gd1", gene_id: "g1", disease_id: "d1", association_type: "driver" },
  { gene_disease_id: "gd2", gene_id: "g2", disease_id: "d2", association_type: "driver" },
  { gene_disease_id: "gd3", gene_id: "g3", disease_id: "d3", association_type: "driver" },
  { gene_disease_id: "gd4", gene_id: "g4", disease_id: "d4", association_type: "driver" },
  { gene_disease_id: "gd5", gene_id: "g5", disease_id: "d5", association_type: "driver" },
  { gene_disease_id: "gd6", gene_id: "g6", disease_id: "d6", association_type: "driver" },
  { gene_disease_id: "gd7", gene_id: "g7", disease_id: "d7", association_type: "driver" },
  { gene_disease_id: "gd8", gene_id: "g8", disease_id: "d8", association_type: "driver" },
  { gene_disease_id: "gd9", gene_id: "g9", disease_id: "d9", association_type: "driver" },
  { gene_disease_id: "gd10", gene_id: "g10", disease_id: "d10", association_type: "driver" },
  { gene_disease_id: "gd11", gene_id: "g11", disease_id: "d11", association_type: "driver" },
  { gene_disease_id: "gd12", gene_id: "g12", disease_id: "d12", association_type: "driver" },
  { gene_disease_id: "gd13", gene_id: "g13", disease_id: "d13", association_type: "driver" },
  { gene_disease_id: "gd14", gene_id: "g14", disease_id: "d14", association_type: "driver" },
  { gene_disease_id: "gd15", gene_id: "g14", disease_id: "d15", association_type: "driver" },
  { gene_disease_id: "gd16", gene_id: "g15", disease_id: "d16", association_type: "driver" },
  { gene_disease_id: "gd17", gene_id: "g16", disease_id: "d17", association_type: "driver" },
  { gene_disease_id: "gd18", gene_id: "g17", disease_id: "d18", association_type: "driver" },
  { gene_disease_id: "gd19", gene_id: "g18", disease_id: "d19", association_type: "driver" },
  { gene_disease_id: "gd20", gene_id: "g19", disease_id: "d20", association_type: "driver" },
];

export const geneCategoryMappings: GeneCategoryMapping[] = [
  { gene_category_id: "gc1", gene_id: "g1", category_id: "fc1" },
  { gene_category_id: "gc2", gene_id: "g2", category_id: "fc2" },
  { gene_category_id: "gc3", gene_id: "g3", category_id: "fc2" },
  { gene_category_id: "gc4", gene_id: "g4", category_id: "fc6" },
  { gene_category_id: "gc5", gene_id: "g5", category_id: "fc6" },
  { gene_category_id: "gc6", gene_id: "g6", category_id: "fc1" },
  { gene_category_id: "gc7", gene_id: "g7", category_id: "fc1" },
  { gene_category_id: "gc8", gene_id: "g8", category_id: "fc1" },
  { gene_category_id: "gc9", gene_id: "g9", category_id: "fc1" },
  { gene_category_id: "gc10", gene_id: "g10", category_id: "fc4" },
  { gene_category_id: "gc11", gene_id: "g11", category_id: "fc1" },
  { gene_category_id: "gc12", gene_id: "g12", category_id: "fc1" },
  { gene_category_id: "gc13", gene_id: "g13", category_id: "fc2" },
  { gene_category_id: "gc14", gene_id: "g14", category_id: "fc2" },
  { gene_category_id: "gc15", gene_id: "g15", category_id: "fc5" },
  { gene_category_id: "gc16", gene_id: "g16", category_id: "fc4" },
  { gene_category_id: "gc17", gene_id: "g17", category_id: "fc8" },
  { gene_category_id: "gc18", gene_id: "g18", category_id: "fc3" },
  { gene_category_id: "gc19", gene_id: "g19", category_id: "fc7" },
];

// Helper functions
export function getGenesForDisease(diseaseId: string): Gene[] {
  const geneIds = geneDiseaseAssociations
    .filter((a) => a.disease_id === diseaseId)
    .map((a) => a.gene_id);
  return genes.filter((g) => geneIds.includes(g.gene_id));
}

export function getDiseasesForGene(geneId: string): Disease[] {
  const diseaseIds = geneDiseaseAssociations
    .filter((a) => a.gene_id === geneId)
    .map((a) => a.disease_id);
  return diseases.filter((d) => diseaseIds.includes(d.disease_id));
}

export function getCategoriesForGene(geneId: string): FunctionalCategory[] {
  const catIds = geneCategoryMappings
    .filter((m) => m.gene_id === geneId)
    .map((m) => m.category_id);
  return functionalCategories.filter((c) => catIds.includes(c.category_id));
}

export function getAssociationType(geneId: string, diseaseId: string): string | undefined {
  return geneDiseaseAssociations.find(
    (a) => a.gene_id === geneId && a.disease_id === diseaseId
  )?.association_type;
}
