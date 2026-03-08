import { BarChart3, Dna, FlaskConical, Link2, Layers } from "lucide-react";
import { useGenes, useDiseases, useGeneDiseaseAssociations, useFunctionalCategories } from "@/hooks/useDatabase";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";

const BURGUNDY_PALETTE = [
  "hsl(0, 30%, 35%)",
  "hsl(0, 25%, 50%)",
  "hsl(0, 20%, 65%)",
  "hsl(0, 15%, 75%)",
  "hsl(35, 60%, 50%)",
  "hsl(0, 10%, 45%)",
];

export default function DashboardPage() {
  const { data: genes = [] } = useGenes();
  const { data: diseases = [] } = useDiseases();
  const { data: associations = [] } = useGeneDiseaseAssociations();
  const { data: categories = [] } = useFunctionalCategories();

  const stats = [
    { label: "Total Genes", value: genes.length, icon: Dna },
    { label: "Total Diseases", value: diseases.length, icon: FlaskConical },
    { label: "Associations", value: associations.length, icon: Link2 },
    { label: "Functional Categories", value: categories.length, icon: Layers },
  ];

  // Prevalence distribution
  const prevCounts: Record<string, number> = {};
  associations.forEach((a) => {
    const key = a.ph_prevalence || "Unknown";
    prevCounts[key] = (prevCounts[key] || 0) + 1;
  });
  const prevalenceData = Object.entries(prevCounts).map(([name, value]) => ({ name, value }));

  // Diseases by category
  const catCounts: Record<string, number> = {};
  diseases.forEach((d) => {
    catCounts[d.disease_category] = (catCounts[d.disease_category] || 0) + 1;
  });
  const categoryData = Object.entries(catCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  // Top genes by associations
  const geneCounts: Record<string, number> = {};
  associations.forEach((a) => {
    geneCounts[a.gene_id] = (geneCounts[a.gene_id] || 0) + 1;
  });
  const topGenes = Object.entries(geneCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([geneId, count]) => ({
      name: genes.find((g) => g.gene_id === geneId)?.gene_symbol || geneId,
      count,
    }));

  // Association types
  const assocTypeCounts: Record<string, number> = {};
  associations.forEach((a) => {
    assocTypeCounts[a.association_type] = (assocTypeCounts[a.association_type] || 0) + 1;
  });
  const assocTypeData = Object.entries(assocTypeCounts).map(([name, value]) => ({ name, value }));

  // Gene types
  const geneTypeCounts: Record<string, number> = {};
  genes.forEach((g) => {
    geneTypeCounts[g.gene_type] = (geneTypeCounts[g.gene_type] || 0) + 1;
  });
  const geneTypeData = Object.entries(geneTypeCounts).map(([name, value]) => ({ name, value }));

  return (
    <div className="container py-10">
      <div className="flex items-center gap-2 mb-2">
        <BarChart3 className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-display font-bold text-foreground">Analytics Dashboard</h1>
      </div>
      <p className="text-muted-foreground mb-8">Overview of GenePH database statistics.</p>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {stats.map(({ label, value, icon: Icon }) => (
          <div key={label} className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-display font-bold text-foreground">{value}</p>
                <p className="text-xs text-muted-foreground">{label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* PH Prevalence */}
        <ChartCard title="PH Prevalence Distribution">
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={prevalenceData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label>
                {prevalenceData.map((_, i) => (
                  <Cell key={i} fill={BURGUNDY_PALETTE[i % BURGUNDY_PALETTE.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Diseases by Category */}
        <ChartCard title="Diseases by Category">
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={categoryData} layout="vertical" margin={{ left: 80 }}>
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 12 }} width={80} />
              <Tooltip />
              <Bar dataKey="count" fill="hsl(0, 30%, 35%)" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Top Genes */}
        <ChartCard title="Top Genes by Associations">
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={topGenes} layout="vertical" margin={{ left: 60 }}>
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 12 }} width={60} />
              <Tooltip />
              <Bar dataKey="count" fill="hsl(0, 25%, 50%)" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Association Types */}
        <ChartCard title="Association Types">
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={assocTypeData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label>
                {assocTypeData.map((_, i) => (
                  <Cell key={i} fill={BURGUNDY_PALETTE[i % BURGUNDY_PALETTE.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Gene Types */}
        <ChartCard title="Gene Types Distribution">
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={geneTypeData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label>
                {geneTypeData.map((_, i) => (
                  <Cell key={i} fill={BURGUNDY_PALETTE[i % BURGUNDY_PALETTE.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <h3 className="font-display font-semibold text-foreground mb-4">{title}</h3>
      {children}
    </div>
  );
}
