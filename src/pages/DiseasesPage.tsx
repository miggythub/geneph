import { useState, useMemo } from "react";
import { FlaskConical } from "lucide-react";
import { diseases } from "@/data/seedData";
import type { DiseaseCategory } from "@/data/types";
import DiseaseCard from "@/components/DiseaseCard";

const categories: DiseaseCategory[] = [
  "Blood / Hematologic",
  "Metabolic / Endocrine",
  "Neuromuscular / Neurologic",
  "Sensory / Ophthalmologic",
  "Hepatic / Systemic",
];

export default function DiseasesPage() {
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [prevalenceFilter, setPrevalenceFilter] = useState<string>("all");
  const [nbsFilter, setNbsFilter] = useState(false);

  const filtered = useMemo(() => {
    return diseases.filter((d) => {
      if (categoryFilter !== "all" && d.disease_category !== categoryFilter) return false;
      if (prevalenceFilter !== "all" && d.ph_prevalence !== prevalenceFilter) return false;
      if (nbsFilter && !d.newborn_screening_ph) return false;
      return true;
    });
  }, [categoryFilter, prevalenceFilter, nbsFilter]);

  return (
    <div className="container py-10">
      <div className="flex items-center gap-2 mb-2">
        <FlaskConical className="h-6 w-6 text-primary" />
        <h1 className="text-3xl font-display font-bold text-foreground">Disease Database</h1>
      </div>
      <p className="text-muted-foreground mb-6">
        Browse all {diseases.length} diseases with Philippine prevalence data
      </p>

      {/* Filters */}
      <div className="space-y-3 mb-8">
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Category</p>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => setCategoryFilter("all")} className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${categoryFilter === "all" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-muted"}`}>
              All
            </button>
            {categories.map((c) => (
              <button key={c} onClick={() => setCategoryFilter(c)} className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${categoryFilter === c ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-muted"}`}>
                {c}
              </button>
            ))}
          </div>
        </div>
        <div className="flex flex-wrap gap-4">
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">PH Prevalence</p>
            <div className="flex gap-2">
              {["all", "high", "moderate", "low"].map((p) => (
                <button key={p} onClick={() => setPrevalenceFilter(p)} className={`rounded-lg px-3 py-1.5 text-sm font-medium capitalize transition-colors ${prevalenceFilter === p ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-muted"}`}>
                  {p === "all" ? "All" : p}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Newborn Screening</p>
            <button onClick={() => setNbsFilter(!nbsFilter)} className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${nbsFilter ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-muted"}`}>
              🇵🇭 NBS Only
            </button>
          </div>
        </div>
      </div>

      <p className="text-sm text-muted-foreground mb-4">Showing {filtered.length} of {diseases.length} diseases</p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((d) => (
          <DiseaseCard key={d.disease_id} disease={d} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <FlaskConical className="h-12 w-12 text-muted-foreground/40 mx-auto mb-4" />
          <p className="text-lg text-muted-foreground">No diseases match the current filters</p>
        </div>
      )}
    </div>
  );
}
