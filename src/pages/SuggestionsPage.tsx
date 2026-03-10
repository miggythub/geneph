import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Lightbulb, Send, Plus, X } from "lucide-react";
import { Navigate } from "react-router-dom";

interface Suggestion {
  id: string;
  gene: string;
  disease: string;
  remarks: string | null;
  reference_links: string[] | null;
  status: string;
  admin_notes: string | null;
  created_at: string;
}

export default function SuggestionsPage() {
  const { user, isLoading } = useAuth();
  const { toast } = useToast();
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [gene, setGene] = useState("");
  const [disease, setDisease] = useState("");
  const [remarks, setRemarks] = useState("");
  const [refs, setRefs] = useState<string[]>([""]);
  const [submitting, setSubmitting] = useState(false);

  const fetchMySuggestions = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("suggestions")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    if (data) setSuggestions(data);
  };

  useEffect(() => {
    if (user) fetchMySuggestions();
  }, [user]);

  if (isLoading) return <div className="container py-20 text-center text-muted-foreground">Loading...</div>;
  if (!user) return <Navigate to="/auth" replace />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const referenceLinks = refs.filter((r) => r.trim() !== "");
    if (!remarks.trim() || referenceLinks.length === 0) {
      toast({ title: "Missing fields", description: "Remarks and at least one reference are required.", variant: "destructive" });
      return;
    }
    setSubmitting(true);

    const { error } = await supabase.from("suggestions").insert({
      user_id: user.id,
      gene: gene.trim() || "N/A",
      disease: disease.trim() || "N/A",
      remarks: remarks.trim(),
      reference_links: referenceLinks,
    });

    setSubmitting(false);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Suggestion submitted!", description: "An admin will review it." });
      setGene("");
      setDisease("");
      setRemarks("");
      setRefs([""]);
      fetchMySuggestions();
    }
  };

  return (
    <div className="container py-10 max-w-3xl">
      <div className="flex items-center gap-2 mb-8">
        <Lightbulb className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-display font-bold text-foreground">Suggest an Association</h1>
      </div>

      <div className="rounded-xl border border-border bg-card p-6 mb-8">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-foreground">Gene *</label>
              <Input value={gene} onChange={(e) => setGene(e.target.value)} placeholder="e.g. BRCA1" required />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Disease *</label>
              <Input value={disease} onChange={(e) => setDisease(e.target.value)} placeholder="e.g. Breast Cancer" required />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-foreground">Remarks</label>
            <Textarea value={remarks} onChange={(e) => setRemarks(e.target.value)} placeholder="Additional context or notes..." rows={3} />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground">References</label>
            {refs.map((ref, i) => (
              <div key={i} className="flex gap-2 mt-1">
                <Input
                  value={ref}
                  onChange={(e) => {
                    const updated = [...refs];
                    updated[i] = e.target.value;
                    setRefs(updated);
                  }}
                  placeholder="URL or citation..."
                />
                {refs.length > 1 && (
                  <Button type="button" variant="ghost" size="icon" onClick={() => setRefs(refs.filter((_, j) => j !== i))}>
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button type="button" variant="ghost" size="sm" onClick={() => setRefs([...refs, ""])} className="mt-1">
              <Plus className="h-3 w-3" /> Add reference
            </Button>
          </div>
          <Button type="submit" disabled={submitting}>
            <Send className="h-4 w-4" /> Submit Suggestion
          </Button>
        </form>
      </div>

      <h2 className="text-lg font-display font-bold text-foreground mb-4">Your Suggestions</h2>
      {suggestions.length === 0 ? (
        <p className="text-muted-foreground text-sm">No suggestions yet.</p>
      ) : (
        <div className="space-y-3">
          {suggestions.map((s) => (
            <div key={s.id} className="rounded-xl border border-border bg-card p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex gap-2">
                  <span className="rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">{s.gene}</span>
                  <span className="rounded-md bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground">{s.disease}</span>
                </div>
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${
                  s.status === "pending" ? "bg-accent/20 text-accent-foreground"
                  : s.status === "approved" ? "bg-primary/10 text-primary"
                  : "bg-destructive/10 text-destructive"
                }`}>
                  {s.status}
                </span>
              </div>
              {s.remarks && <p className="text-sm text-muted-foreground">{s.remarks}</p>}
              {s.admin_notes && (
                <p className="text-xs text-muted-foreground mt-2 pt-2 border-t border-border">
                  <span className="font-medium">Admin:</span> {s.admin_notes}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
