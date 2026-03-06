import { useParams, Link } from "react-router-dom";
import { Dna, ArrowLeft, ExternalLink, FlaskConical } from "lucide-react";
import { genes, getDiseasesForGene, getCategoriesForGene, getAssociationType } from "@/data/seedData";
import CategoryBadge from "@/components/CategoryBadge";
import PrevalenceBadge from "@/components/PrevalenceBadge";

export default function GeneDetail() {
  const { id } = useParams();
  const gene = genes.find((g) => g.gene_id === id);

  if (!gene) {
    return (
      <div className="container py-20 text-center">
        <p className="text-muted-foreground">Gene not found.</p>
        <Link to="/genes" className="text-primary mt-4 inline-block">← Back to Genes</Link>
      </div>
    );
  }

  const associatedDiseases = getDiseasesForGene(gene.gene_id);
  const categories = getCategoriesForGene(gene.gene_id);

  return (
    <div className="container py-10 max-w-4xl">
      <Link to="/genes" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition mb-6">
        <ArrowLeft className="h-4 w-4" /> Back to Genes
      </Link>

      <div className="rounded-xl border border-border bg-card p-8 mb-8">
        <div className="flex items-start gap-4 mb-6">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 shrink-0">
            <Dna className="h-7 w-7 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground">{gene.gene_symbol}</h1>
            <p className="text-lg text-muted-foreground">{gene.full_gene_name}</p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 mb-6">
          <div className="rounded-lg bg-secondary p-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Gene Type</p>
            <p className="text-sm font-medium text-foreground capitalize">{gene.gene_type}</p>
          </div>
          <div className="rounded-lg bg-secondary p-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">OMIM ID</p>
            <a href={`https://omim.org/entry/${gene.omim_id}`} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-primary hover:underline inline-flex items-center gap-1">
              {gene.omim_id} <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map((c) => (
            <span key={c.category_id} className="rounded-md bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
              {c.category_name}
            </span>
          ))}
        </div>

        <div>
          <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-2">Description</h2>
          <p className="text-muted-foreground leading-relaxed">{gene.description}</p>
        </div>
      </div>

      {/* Associated Diseases */}
      <h2 className="text-xl font-display font-bold text-foreground mb-4 flex items-center gap-2">
        <FlaskConical className="h-5 w-5 text-primary" />
        Associated Diseases ({associatedDiseases.length})
      </h2>
      <div className="space-y-4">
        {associatedDiseases.map((d) => {
          const assocType = getAssociationType(gene.gene_id, d.disease_id);
          return (
            <Link
              key={d.disease_id}
              to={`/disease/${d.disease_id}`}
              className="block rounded-xl border border-border bg-card p-5 transition hover:shadow-md hover:border-primary/30"
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-display font-semibold text-foreground">{d.disease_name}</h3>
                {assocType && (
                  <span className="rounded-md bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground capitalize">{assocType}</span>
                )}
              </div>
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{d.description}</p>
              <div className="flex flex-wrap gap-2">
                <CategoryBadge category={d.disease_category} />
                <PrevalenceBadge level={d.ph_prevalence} />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
