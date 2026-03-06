import { Link } from "react-router-dom";
import { FlaskConical, ArrowRight, Baby } from "lucide-react";
import { type Disease } from "@/data/types";
import { getGenesForDisease } from "@/data/seedData";
import CategoryBadge from "./CategoryBadge";
import PrevalenceBadge from "./PrevalenceBadge";

export default function DiseaseCard({ disease }: { disease: Disease }) {
  const genes = getGenesForDisease(disease.disease_id);

  return (
    <Link
      to={`/disease/${disease.disease_id}`}
      className="group block rounded-xl border border-border bg-card p-5 transition-all hover:shadow-lg hover:border-primary/30"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <FlaskConical className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-display font-bold text-foreground text-base leading-tight">
              {disease.disease_name}
            </h3>
          </div>
        </div>
        <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{disease.description}</p>
      <div className="flex flex-wrap items-center gap-1.5">
        <CategoryBadge category={disease.disease_category} />
        <PrevalenceBadge level={disease.ph_prevalence} />
        {disease.newborn_screening_ph && (
          <span className="inline-flex items-center gap-1 rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
            <Baby className="h-3 w-3" /> NBS
          </span>
        )}
        <span className="rounded-md bg-secondary px-2 py-0.5 text-[11px] font-medium text-secondary-foreground">
          {genes.length} gene{genes.length !== 1 ? "s" : ""}
        </span>
      </div>
    </Link>
  );
}
