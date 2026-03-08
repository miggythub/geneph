import { Link } from "react-router-dom";
import { Dna, ArrowRight, ExternalLink } from "lucide-react";
import { type Gene } from "@/data/types";
import { getDiseasesForGene, getCategoriesForGene } from "@/data/seedData";

export default function GeneCard({ gene }: { gene: Gene }) {
  const diseases = getDiseasesForGene(gene.gene_id);
  const categories = getCategoriesForGene(gene.gene_id);

  return (
    <Link
      to={`/gene/${gene.gene_id}`}
      className="group block rounded-xl border border-border bg-card p-5 transition-all hover:shadow-lg hover:border-primary/30"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Dna className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-display font-bold text-foreground text-lg leading-none">
              {gene.gene_symbol}
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">{gene.gene_type}</p>
          </div>
        </div>
        <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
      <p className="text-sm text-muted-foreground mb-1 line-clamp-2">{gene.full_gene_name}</p>
      <a
        href={`https://www.omim.org/entry/${gene.omim_id}`}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => e.stopPropagation()}
        className="inline-flex items-center gap-1 text-xs text-primary hover:underline mb-3"
      >
        OMIM: {gene.omim_id} <ExternalLink className="h-3 w-3" />
      </a>
      <div className="flex flex-wrap gap-1.5">
        {categories.map((c) => (
          <span key={c.category_id} className="rounded-md bg-secondary px-2 py-0.5 text-[11px] font-medium text-secondary-foreground">
            {c.category_name}
          </span>
        ))}
        <span className="rounded-md bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
          {diseases.length} disease{diseases.length !== 1 ? "s" : ""}
        </span>
      </div>
    </Link>
  );
}
