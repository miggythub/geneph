import { useParams, Link } from "react-router-dom";
import { FlaskConical, ArrowLeft, ExternalLink, Dna } from "lucide-react";
import { useDisease, useGenes, useGeneDiseaseAssociations } from "@/hooks/useDatabase";

export default function DiseaseDetail() {
  const { id } = useParams();
  const { data: disease, isLoading } = useDisease(id);
  const { data: allGenes = [] } = useGenes();
  const { data: associations = [] } = useGeneDiseaseAssociations();

  if (isLoading) return <div className="container py-20 text-center text-muted-foreground">Loading...</div>;

  if (!disease) {
    return (
      <div className="container py-20 text-center">
        <p className="text-muted-foreground">Disease not found.</p>
        <Link to="/discover" className="text-primary mt-4 inline-block">← Back to Discover</Link>
      </div>
    );
  }

  const geneAssocs = associations.filter((a) => a.disease_id === disease.disease_id);
  const associatedGenes = allGenes.filter((g) => geneAssocs.some((a) => a.gene_id === g.gene_id));

  return (
    <div className="container py-10 max-w-4xl">
      <Link to="/discover" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition mb-6">
        <ArrowLeft className="h-4 w-4" /> Back to Discover
      </Link>

      <div className="rounded-xl border border-border bg-card p-8 mb-8">
        <div className="flex items-start gap-4 mb-6">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 shrink-0">
            <FlaskConical className="h-7 w-7 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground">{disease.disease_name}</h1>
            <span className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary mt-2">
              {disease.disease_category}
            </span>
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-4 mb-6">
          <div className="rounded-lg bg-secondary p-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Inheritance</p>
            <p className="text-sm font-medium text-foreground">{disease.inheritance_pattern}</p>
          </div>
          <div className="rounded-lg bg-secondary p-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">OMIM ID</p>
            {disease.omim_id ? (
              <a href={`https://www.omim.org/entry/${disease.omim_id}`} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-primary hover:underline inline-flex items-center gap-1">
                {disease.omim_id} <ExternalLink className="h-3 w-3" />
              </a>
            ) : (
              <p className="text-sm text-muted-foreground">N/A</p>
            )}
          </div>
          <div className="rounded-lg bg-secondary p-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Category</p>
            <p className="text-sm font-medium text-foreground">{disease.disease_category}</p>
          </div>
        </div>

        {disease.description && (
          <div>
            <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-2">Description</h2>
            <p className="text-muted-foreground leading-relaxed">{disease.description}</p>
          </div>
        )}
      </div>

      <h2 className="text-xl font-display font-bold text-foreground mb-4 flex items-center gap-2">
        <Dna className="h-5 w-5 text-primary" />
        Associated Genes ({associatedGenes.length})
      </h2>
      <div className="space-y-4">
        {associatedGenes.map((g) => {
          const assocType = geneAssocs.find((a) => a.gene_id === g.gene_id)?.association_type;
          return (
            <Link
              key={g.gene_id}
              to={`/gene/${g.gene_id}`}
              className="block rounded-xl border border-border bg-card p-5 transition hover:shadow-md hover:border-primary/30"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-display font-bold text-foreground text-lg">{g.gene_symbol}</h3>
                  <p className="text-sm text-muted-foreground">{g.full_gene_name}</p>
                </div>
                {assocType && (
                  <span className="rounded-md bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground capitalize">{assocType}</span>
                )}
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2">{g.description}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
