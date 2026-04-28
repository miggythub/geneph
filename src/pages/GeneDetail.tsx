import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Dna, ArrowLeft, ExternalLink, FlaskConical, MapPin, Pencil } from "lucide-react";
import { useGene, useDiseases, useGeneDiseaseAssociations, useFunctionalCategories, useGeneCategoryMappings } from "@/hooks/useDatabase";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { GeneFormDialog } from "@/components/admin/GeneFormDialog";

const PREVALENCE_COLORS: Record<string, string> = {
  high: "bg-destructive/10 text-destructive",
  moderate: "bg-accent/20 text-accent-foreground",
  low: "bg-primary/10 text-primary",
};

export default function GeneDetail() {
  const { id } = useParams();
  const { data: gene, isLoading } = useGene(id);
  const { data: allDiseases = [] } = useDiseases();
  const { data: associations = [] } = useGeneDiseaseAssociations();
  const { data: allCategories = [] } = useFunctionalCategories();
  const { data: categoryMappings = [] } = useGeneCategoryMappings();
  const { isAdmin, isManager } = useAuth();
  const canEdit = isAdmin || isManager;
  const [editOpen, setEditOpen] = useState(false);

  if (isLoading) return <div className="container py-20 text-center text-muted-foreground">Loading...</div>;

  if (!gene) {
    return (
      <div className="container py-20 text-center">
        <p className="text-muted-foreground">Gene not found.</p>
        <Link to="/search" className="text-primary mt-4 inline-block">← Back to Search</Link>
      </div>
    );
  }

  const diseaseAssocs = associations.filter((a) => a.gene_id === gene.gene_id);
  const associatedDiseases = allDiseases.filter((d) => diseaseAssocs.some((a) => a.disease_id === d.disease_id));
  const catIds = categoryMappings.filter((m) => m.gene_id === gene.gene_id).map((m) => m.category_id);
  const categories = allCategories.filter((c) => catIds.includes(c.category_id));

  return (
    <div className="container py-10 max-w-4xl">
      <Link to="/search" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition mb-6">
        <ArrowLeft className="h-4 w-4" /> Back to Search
      </Link>

      <div className="rounded-xl border border-border bg-card p-8 mb-8">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 shrink-0">
              <Dna className="h-7 w-7 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-display font-bold text-foreground">{gene.gene_symbol}</h1>
              <p className="text-lg text-muted-foreground">{gene.full_gene_name}</p>
            </div>
          </div>
          {gene.chromosomal_location && (
            <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-3 py-1 text-sm font-medium text-secondary-foreground">
              <MapPin className="h-3.5 w-3.5" /> {gene.chromosomal_location}
            </span>
          )}
        </div>

        <div className="grid sm:grid-cols-2 gap-4 mb-6">
          <div className="rounded-lg bg-secondary p-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Gene Type</p>
            <p className="text-sm font-medium text-foreground capitalize">{gene.gene_type}</p>
          </div>
          <div className="rounded-lg bg-secondary p-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">OMIM ID</p>
            {gene.omim_id ? (
              <a href={`https://www.omim.org/entry/${gene.omim_id}`} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-primary hover:underline inline-flex items-center gap-1">
                {gene.omim_id} <ExternalLink className="h-3 w-3" />
              </a>
            ) : (
              <p className="text-sm text-muted-foreground">N/A</p>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map((c) => (
            <span key={c.category_id} className="rounded-md bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
              {c.category_name}
            </span>
          ))}
        </div>

        {gene.description && (
          <div>
            <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-2">Description</h2>
            <p className="text-muted-foreground leading-relaxed">{gene.description}</p>
          </div>
        )}
      </div>

      <h2 className="text-xl font-display font-bold text-foreground mb-4 flex items-center gap-2">
        <FlaskConical className="h-5 w-5 text-primary" />
        Associated Diseases ({associatedDiseases.length})
      </h2>
      <div className="space-y-4">
        {associatedDiseases.map((d) => {
          const assoc = diseaseAssocs.find((a) => a.disease_id === d.disease_id);
          return (
            <Link
              key={d.disease_id}
              to={`/disease/${d.disease_id}`}
              className="block rounded-xl border border-border bg-card p-5 transition hover:shadow-md hover:border-primary/30"
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-display font-semibold text-foreground">{d.disease_name}</h3>
                {assoc?.ph_prevalence && (
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${PREVALENCE_COLORS[assoc.ph_prevalence.toLowerCase()] || "bg-secondary text-secondary-foreground"}`}>
                    {assoc.ph_prevalence}
                  </span>
                )}
              </div>
              {assoc?.description && (
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{assoc.description}</p>
              )}
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                  {d.disease_category}
                </span>
                {assoc?.study_type && (
                  <span className="rounded-md bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground">
                    {assoc.study_type}
                  </span>
                )}
                {assoc?.citation && (
                  <span className="text-xs text-muted-foreground italic">{assoc.citation}</span>
                )}
                {assoc?.study_link && (
                  <span
                    onClick={(e) => { e.preventDefault(); window.open(assoc.study_link!, '_blank'); }}
                    className="inline-flex items-center gap-1 text-xs text-primary hover:underline cursor-pointer"
                  >
                    View Study <ExternalLink className="h-3 w-3" />
                  </span>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
