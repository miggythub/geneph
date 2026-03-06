const styles = {
  high: "bg-destructive/15 text-destructive border-destructive/30",
  moderate: "bg-accent/20 text-accent-foreground border-accent/40",
  low: "bg-secondary text-secondary-foreground border-border",
};

export default function PrevalenceBadge({ level }: { level: "high" | "moderate" | "low" }) {
  return (
    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium capitalize ${styles[level]}`}>
      {level === "high" ? "🇵🇭 High" : level === "moderate" ? "Moderate" : "Low"} Prevalence
    </span>
  );
}
