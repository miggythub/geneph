import { useState, useMemo } from "react";
import { FlaskConical } from "lucide-react";
import { useDiseases } from "@/hooks/useDatabase";
import DiseaseCard from "@/components/DiseaseCard";

export default function DiseasesPage() {
  const { data: diseases = [], isLoading } = useDiseases();
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  const categories = useMemo(() => [...new Set(diseases.map((d) => d.disease_category))].sort(), [diseases]);

  const filtered = useMemo(() => {
    if (categoryFilter === "all") return diseases;
    return diseases.filter((d) => d.disease_category === categoryFilter);
  }, [diseases, categoryFilter]);

  if (isLoading) return <div className="container py-20 text-center text-muted-foreground">Loading...</div>;

  return (
    <div className="container py-10">
      <div className="flex items-center gap-2 mb-2">
        <FlaskConical className="h-6 w-6 text-primary" />
        <h1 className="text-3xl font-display font-bold text-foreground">Disease Database</h1>
      </div>
      <p className="text-muted-foreground mb-6">
        Browse all {diseases.length} diseases in the database
      </p>

      <div className="mb-8">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Category</p>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => setCategoryFilter("all")} className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${categoryFilter === "all" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-muted"}`}>
            All ({diseases.length})
          </button>
          {categories.map((c) => (
            <button key={c} onClick={() => setCategoryFilter(c)} className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${categoryFilter === c ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-muted"}`}>
              {c} ({diseases.filter((d) => d.disease_category === c).length})
            </button>
          ))}
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
