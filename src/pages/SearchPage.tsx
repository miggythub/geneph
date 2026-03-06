import { useState, useMemo } from "react";
import { Search, Dna, FlaskConical } from "lucide-react";
import { genes, diseases } from "@/data/seedData";
import GeneCard from "@/components/GeneCard";
import DiseaseCard from "@/components/DiseaseCard";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState<"all" | "genes" | "diseases">("all");

  const q = query.toLowerCase().trim();

  const filteredGenes = useMemo(
    () =>
      q
        ? genes.filter(
            (g) =>
              g.gene_symbol.toLowerCase().includes(q) ||
              g.full_gene_name.toLowerCase().includes(q) ||
              g.description.toLowerCase().includes(q)
          )
        : genes,
    [q]
  );

  const filteredDiseases = useMemo(
    () =>
      q
        ? diseases.filter(
            (d) =>
              d.disease_name.toLowerCase().includes(q) ||
              d.disease_category.toLowerCase().includes(q) ||
              d.description.toLowerCase().includes(q)
          )
        : diseases,
    [q]
  );

  const showGenes = tab === "all" || tab === "genes";
  const showDiseases = tab === "all" || tab === "diseases";

  return (
    <div className="container py-10">
      <div className="max-w-2xl mx-auto mb-10">
        <h1 className="text-3xl font-display font-bold text-foreground text-center mb-2">
          Search Genes & Diseases
        </h1>
        <p className="text-center text-muted-foreground mb-6">
          Type a gene symbol, disease name, or keyword to explore associations
        </p>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="e.g. G6PD, thalassemia, hemophilia..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-xl border border-border bg-card pl-12 pr-4 py-4 text-foreground text-base placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition shadow-sm"
          />
        </div>
        <div className="flex justify-center gap-2 mt-4">
          {(["all", "genes", "diseases"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`rounded-lg px-4 py-2 text-sm font-medium capitalize transition-colors ${
                tab === t
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-muted"
              }`}
            >
              {t === "all" ? "All" : t === "genes" ? `Genes (${filteredGenes.length})` : `Diseases (${filteredDiseases.length})`}
            </button>
          ))}
        </div>
      </div>

      {showGenes && filteredGenes.length > 0 && (
        <section className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <Dna className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-display font-semibold text-foreground">
              Genes ({filteredGenes.length})
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredGenes.map((g) => (
              <GeneCard key={g.gene_id} gene={g} />
            ))}
          </div>
        </section>
      )}

      {showDiseases && filteredDiseases.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <FlaskConical className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-display font-semibold text-foreground">
              Diseases ({filteredDiseases.length})
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDiseases.map((d) => (
              <DiseaseCard key={d.disease_id} disease={d} />
            ))}
          </div>
        </section>
      )}

      {showGenes && filteredGenes.length === 0 && showDiseases && filteredDiseases.length === 0 && (
        <div className="text-center py-16">
          <Search className="h-12 w-12 text-muted-foreground/40 mx-auto mb-4" />
          <p className="text-lg text-muted-foreground">No results found for "{query}"</p>
          <p className="text-sm text-muted-foreground/70 mt-1">Try a different search term</p>
        </div>
      )}
    </div>
  );
}
