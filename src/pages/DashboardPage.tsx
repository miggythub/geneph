import { BarChart3, Dna, FlaskConical, Link2, Layers } from "lucide-react";
import { useGenes, useDiseases, useGeneDiseaseAssociations, useFunctionalCategories } from "@/hooks/useDatabase";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";

const VIBRANT_PALETTE = [
  "hsl(350, 65%, 45%)",   // deep rose
  "hsl(25, 85%, 55%)",    // warm amber
  "hsl(170, 55%, 40%)",   // teal
  "hsl(220, 60%, 50%)",   // royal blue
  "hsl(45, 80%, 50%)",    // golden
  "hsl(280, 50%, 55%)",   // purple
  "hsl(0, 55%, 60%)",     // soft red
  "hsl(140, 45%, 45%)",   // forest green
  "hsl(200, 70%, 50%)",   // sky blue
  "hsl(330, 60%, 50%)",   // magenta
];

const STAT_COLORS = [
  { bg: "bg-rose-500/10", text: "text-rose-600", border: "border-rose-200" },
  { bg: "bg-amber-500/10", text: "text-amber-600", border: "border-amber-200" },
  { bg: "bg-teal-500/10", text: "text-teal-600", border: "border-teal-200" },
  { bg: "bg-blue-500/10", text: "text-blue-600", border: "border-blue-200" },
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

  // Diseases by category — TOP 10
  const catCounts: Record<string, number> = {};
  diseases.forEach((d) => {
    catCounts[d.disease_category] = (catCounts[d.disease_category] || 0) + 1;
  });
  const categoryData = Object.entries(catCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

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

      {/* Stat Cards — with distinct colors */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {stats.map(({ label, value, icon: Icon }, idx) => {
          const color = STAT_COLORS[idx];
          return (
            <div key={label} className={`rounded-xl border ${color.border} bg-card p-5 transition-shadow hover:shadow-md`}>
              <div className="flex items-center gap-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${color.bg}`}>
                  <Icon className={`h-5 w-5 ${color.text}`} />
                </div>
                <div>
                  <p className="text-2xl font-display font-bold text-foreground">{value}</p>
                  <p className="text-xs text-muted-foreground">{label}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Top Genes — horizontal bar with gradient colors */}
        <ChartCard title="Top 10 Genes by Associations" className="md:col-span-2">
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={topGenes} margin={{ left: 10, right: 20, top: 5, bottom: 5 }}>
              <XAxis dataKey="name" tick={{ fontSize: 12 }} angle={-30} textAnchor="end" height={60} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{ borderRadius: "8px", border: "1px solid hsl(var(--border))", background: "hsl(var(--card))" }}
              />
              <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                {topGenes.map((_, i) => (
                  <Cell key={i} fill={VIBRANT_PALETTE[i % VIBRANT_PALETTE.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Diseases by Category — Top 10 */}
        <ChartCard title="Top 10 Disease Categories">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryData} layout="vertical" margin={{ left: 100, right: 20 }}>
              <XAxis type="number" tick={{ fontSize: 12 }} />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} width={100} />
              <Tooltip
                contentStyle={{ borderRadius: "8px", border: "1px solid hsl(var(--border))", background: "hsl(var(--card))" }}
              />
              <Bar dataKey="count" radius={[0, 6, 6, 0]}>
                {categoryData.map((_, i) => (
                  <Cell key={i} fill={VIBRANT_PALETTE[i % VIBRANT_PALETTE.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* PH Prevalence */}
        <ChartCard title="PH Prevalence Distribution">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={prevalenceData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} innerRadius={50} label>
                {prevalenceData.map((_, i) => (
                  <Cell key={i} fill={VIBRANT_PALETTE[i % VIBRANT_PALETTE.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid hsl(var(--border))", background: "hsl(var(--card))" }} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Association Types */}
        <ChartCard title="Association Types">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={assocTypeData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} innerRadius={50} label>
                {assocTypeData.map((_, i) => (
                  <Cell key={i} fill={VIBRANT_PALETTE[i % VIBRANT_PALETTE.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid hsl(var(--border))", background: "hsl(var(--card))" }} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Gene Types */}
        <ChartCard title="Gene Types Distribution">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={geneTypeData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} innerRadius={50} label>
                {geneTypeData.map((_, i) => (
                  <Cell key={i} fill={VIBRANT_PALETTE[i % VIBRANT_PALETTE.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid hsl(var(--border))", background: "hsl(var(--card))" }} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}

function ChartCard({ title, children, className = "" }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-xl border border-border bg-card p-5 transition-shadow hover:shadow-md ${className}`}>
      <h3 className="font-display font-semibold text-foreground mb-4">{title}</h3>
      {children}
    </div>
  );
}
