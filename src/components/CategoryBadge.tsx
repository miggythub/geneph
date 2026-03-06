import type { DiseaseCategory } from "@/data/types";

const categoryStyles: Record<DiseaseCategory, string> = {
  "Blood / Hematologic": "bg-cat-blood/15 text-cat-blood border-cat-blood/30",
  "Metabolic / Endocrine": "bg-cat-metabolic/15 text-cat-metabolic border-cat-metabolic/30",
  "Neuromuscular / Neurologic": "bg-cat-neuro/15 text-cat-neuro border-cat-neuro/30",
  "Sensory / Ophthalmologic": "bg-cat-sensory/15 text-cat-sensory border-cat-sensory/30",
  "Hepatic / Systemic": "bg-cat-hepatic/15 text-cat-hepatic border-cat-hepatic/30",
  "Cancer": "bg-cat-cancer/15 text-cat-cancer border-cat-cancer/30",
};

export default function CategoryBadge({ category }: { category: DiseaseCategory }) {
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${categoryStyles[category]}`}>
      {category}
    </span>
  );
}
