import { useState, useMemo } from "react";
import { Dna } from "lucide-react";
import { useGenes, useFunctionalCategories, useGeneCategoryMappings } from "@/hooks/useDatabase";
import GeneCard from "@/components/GeneCard";

export default function GenesPage() {
  const { data: genes = [], isLoading } = useGenes();
  const { data: categories = [] } = useFunctionalCategories();
  const { data: mappings = [] } = useGeneCategoryMappings();
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  const filtered = useMemo(() => {
    if (categoryFilter === "all") return genes;
    const geneIds = mappings.filter((m) => m.category_id === categoryFilter).map((m) => m.gene_id);
    return genes.filter((g) => geneIds.includes(g.gene_id));
  }, [genes, mappings, categoryFilter]);

  if (isLoading) return <div className="container py-20 text-center text-muted-foreground">Loading...</div>;

  return (
    <div className="container py-10">
      <div className="flex items-center gap-2 mb-2">
        <Dna className="h-6 w-6 text-primary" />
        <h1 className="text-3xl font-display font-bold text-foreground">Gene Database</h1>
      </div>
      <p className="text-muted-foreground mb-6">
        Browse all {genes.length} genes in the PH-GDAE database
      </p>

      <div className="flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => setCategoryFilter("all")}
          className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${categoryFilter === "all" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-muted"}`}
        >
          All ({genes.length})
        </button>
        {categories.map((fc) => {
          const count = mappings.filter((m) => m.category_id === fc.category_id).length;
          return (
            <button
              key={fc.category_id}
              onClick={() => setCategoryFilter(fc.category_id)}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${categoryFilter === fc.category_id ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-muted"}`}
            >
              {fc.category_name} ({count})
            </button>
          );
        })}
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((g) => (
          <GeneCard key={g.gene_id} gene={g} />
        ))}
      </div>
    </div>
  );
}
