import { Link } from "react-router-dom";
import { Search, Dna, FlaskConical, Filter, ArrowRight, BarChart3, BookOpen } from "lucide-react";
import { motion } from "framer-motion";
import { useGenes, useDiseases } from "@/hooks/useDatabase";

export default function Index() {
  const { data: genes = [] } = useGenes();
  const { data: diseases = [] } = useDiseases();

  const categories = [...new Set(diseases.map((d) => d.disease_category))];

  const stats = [
    { label: "Genes", value: genes.length, icon: Dna },
    { label: "Diseases", value: diseases.length, icon: FlaskConical },
    { label: "Categories", value: categories.length, icon: Filter },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="hero-gradient relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }} />
        <div className="container relative py-20 md:py-28">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            <div className="inline-flex items-center gap-1.5 rounded-full border border-primary-foreground/20 bg-primary-foreground/10 px-3 py-1 text-xs font-medium text-primary-foreground/90 mb-6">
              <Dna className="h-3 w-3" /> Philippine Bioinformatics
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-primary-foreground leading-tight mb-4">
              GenePH: Philippine
              <br />
              Genomic Database
            </h1>
            <p className="text-lg text-primary-foreground/70 mb-8 max-w-lg">
              A centralized platform to explore gene–disease relationships relevant to the Filipino population. Search genes, discover disease associations, and access local research data.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/search"
                className="inline-flex items-center gap-2 rounded-lg bg-primary-foreground px-5 py-3 text-sm font-semibold text-foreground shadow-lg transition hover:shadow-xl hover:scale-[1.02]"
              >
                <Search className="h-4 w-4" /> Start Searching
              </Link>
              <Link
                to="/discover"
                className="inline-flex items-center gap-2 rounded-lg border border-primary-foreground/25 bg-primary-foreground/10 px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary-foreground/20"
              >
                <BookOpen className="h-4 w-4" /> Discover Associations
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="container -mt-8 relative z-10">
        <div className="grid grid-cols-3 gap-4">
          {stats.map(({ label, value, icon: Icon }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.1 }}
              className="rounded-xl border border-border bg-card p-5 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-display font-bold text-foreground">{value}</p>
                  <p className="text-xs text-muted-foreground">{label}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="container py-16">
        <h2 className="text-2xl font-display font-bold text-foreground mb-2">Key Features</h2>
        <p className="text-muted-foreground mb-8">Explore the GenePH Philippine Genomic Database</p>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { title: "Bi-Directional Search", desc: "Search a gene to find diseases, or search a disease to find genes. Fully interconnected data.", icon: Search, link: "/search" },
            { title: "Discovery View", desc: "Filter gene-disease associations by Philippine prevalence and disease category.", icon: FlaskConical, link: "/discover" },
            { title: "Analytics Dashboard", desc: "View database statistics, prevalence distributions, and association insights at a glance.", icon: BarChart3, link: "/dashboard" },
          ].map(({ title, desc, icon: Icon, link }) => (
            <Link
              key={title}
              to={link}
              className="group rounded-xl border border-border bg-card p-6 transition-all hover:shadow-lg hover:border-primary/30"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 mb-4">
                <Icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-display font-semibold text-foreground mb-2">{title}</h3>
              <p className="text-sm text-muted-foreground mb-3">{desc}</p>
              <span className="inline-flex items-center gap-1 text-sm font-medium text-primary group-hover:gap-2 transition-all">
                Explore <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
