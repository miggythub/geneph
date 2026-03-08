import { useState, useMemo } from "react";
import { FlaskConical, ExternalLink } from "lucide-react";
import { useGenes, useDiseases, useGeneDiseaseAssociations } from "@/hooks/useDatabase";
import { Link } from "react-router-dom";

const PREVALENCE_COLORS: Record<string, string> = {
  high: "bg-destructive/10 text-destructive",
  moderate: "bg-accent/20 text-accent-foreground",
  low: "bg-primary/10 text-primary",
};

export default function DiscoverPage() {
  const { data: genes = [] } = useGenes();
  const { data: diseases = [] } = useDiseases();
  const { data: associations = [] } = useGeneDiseaseAssociations();
  const [prevFilter, setPrevFilter] = useState("all");
  const [catFilter, setCatFilter] = useState("all");

  const diseaseCategories = useMemo(
    () => [...new Set(diseases.map((d) => d.disease_category))].sort(),
    [diseases]
  );

  const enriched = useMemo(() => {
    return associations.map((a) => {
      const gene = genes.find((g) => g.gene_id === a.gene_id);
      const disease = diseases.find((d) => d.disease_id === a.disease_id);
      return { ...a, gene, disease };
    });
  }, [associations, genes, diseases]);

  const filtered = useMemo(() => {
    return enriched.filter((item) => {
      if (prevFilter !== "all" && (item.ph_prevalence || "").toLowerCase() !== prevFilter) return false;
      if (catFilter !== "all" && item.disease?.disease_category !== catFilter) return false;
      return true;
    });
  }, [enriched, prevFilter, catFilter]);

  return (
    <div className="container py-10">
      <div className="flex items-center gap-2 mb-2">
        <FlaskConical className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-display font-bold text-foreground">Discovery View</h1>
      </div>
      <p className="text-muted-foreground mb-6">
        Filter gene-disease associations by Philippine prevalence and disease category.
      </p>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-8">
        <select
          value={prevFilter}
          onChange={(e) => setPrevFilter(e.target.value)}
          className="rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground"
        >
          <option value="all">All Prevalence</option>
          <option value="high">High</option>
          <option value="moderate">Moderate</option>
          <option value="low">Low</option>
        </select>
        <select
          value={catFilter}
          onChange={(e) => setCatFilter(e.target.value)}
          className="rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground"
        >
          <option value="all">All Categories</option>
          {diseaseCategories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Association Cards */}
      <div className="space-y-4">
        {filtered.map((item) => (
          <div
            key={item.gene_disease_id}
            className="rounded-xl border border-border bg-card p-5 transition hover:shadow-md hover:border-primary/30"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <Link
                  to={`/gene/${item.gene_id}`}
                  className="text-primary font-display font-bold hover:underline"
                >
                  {item.gene?.gene_symbol || item.gene_id}
                </Link>
                <span className="text-muted-foreground">→</span>
                <Link
                  to={`/disease/${item.disease_id}`}
                  className="font-display font-semibold text-foreground hover:underline"
                >
                  {item.disease?.disease_name || item.disease_id}
                </Link>
              </div>
              {item.ph_prevalence && (
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${PREVALENCE_COLORS[item.ph_prevalence.toLowerCase()] || "bg-secondary text-secondary-foreground"}`}>
                  {item.ph_prevalence}
                </span>
              )}
            </div>

            {item.description && (
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{item.description}</p>
            )}

            <div className="flex flex-wrap items-center gap-2">
              {item.disease?.disease_category && (
                <span className="rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                  {item.disease.disease_category}
                </span>
              )}
              {item.study_type && (
                <span className="rounded-md bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground">
                  {item.study_type}
                </span>
              )}
              {item.citation && (
                <span className="text-xs text-muted-foreground italic">{item.citation}</span>
              )}
              {item.study_link && (
                <a
                  href={item.study_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                >
                  View Study <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <FlaskConical className="h-12 w-12 text-muted-foreground/40 mx-auto mb-4" />
            <p className="text-lg text-muted-foreground">No associations match your filters</p>
          </div>
        )}
      </div>
    </div>
  );
}
