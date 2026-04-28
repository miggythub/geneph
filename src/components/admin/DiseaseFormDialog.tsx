import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import type { DbDisease } from "@/hooks/useDatabase";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  disease?: DbDisease | null;
}

const CATEGORIES = [
  "Blood / Hematologic",
  "Metabolic / Endocrine",
  "Neuromuscular / Neurologic",
  "Sensory / Ophthalmologic",
  "Hepatic / Systemic",
  "Cancer",
  "Other",
];

const INHERITANCE = [
  "Autosomal dominant",
  "Autosomal recessive",
  "X-linked dominant",
  "X-linked recessive",
  "Mitochondrial",
  "Multifactorial",
  "Unknown",
];

export function DiseaseFormDialog({ open, onOpenChange, disease }: Props) {
  const { toast } = useToast();
  const qc = useQueryClient();
  const [form, setForm] = useState({
    disease_name: "",
    disease_category: "Other",
    inheritance_pattern: "Unknown",
    omim_id: "",
    description: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (disease) {
      setForm({
        disease_name: disease.disease_name || "",
        disease_category: disease.disease_category || "Other",
        inheritance_pattern: disease.inheritance_pattern || "Unknown",
        omim_id: disease.omim_id || "",
        description: disease.description || "",
      });
    } else {
      setForm({ disease_name: "", disease_category: "Other", inheritance_pattern: "Unknown", omim_id: "", description: "" });
    }
  }, [disease, open]);

  const handleSave = async () => {
    if (!form.disease_name.trim()) {
      toast({ title: "Disease name required", variant: "destructive" });
      return;
    }
    setSaving(true);
    const payload = {
      disease_name: form.disease_name.trim(),
      disease_category: form.disease_category,
      inheritance_pattern: form.inheritance_pattern,
      omim_id: form.omim_id.trim() || null,
      description: form.description.trim() || null,
    };
    let id = disease?.disease_id;
    if (disease) {
      const { error } = await supabase.from("diseases").update(payload).eq("disease_id", disease.disease_id);
      if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); setSaving(false); return; }
    } else {
      id = `DIS-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
      const { error } = await supabase.from("diseases").insert({ disease_id: id, ...payload });
      if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); setSaving(false); return; }
    }
    toast({ title: disease ? "Disease updated" : "Disease added" });
    qc.invalidateQueries({ queryKey: ["diseases"] });
    qc.invalidateQueries({ queryKey: ["disease", id] });
    setSaving(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader><DialogTitle>{disease ? "Edit Disease" : "Add Disease"}</DialogTitle></DialogHeader>
        <div className="space-y-4 py-2">
          <div><Label>Disease Name *</Label><Input value={form.disease_name} onChange={(e) => setForm({ ...form, disease_name: e.target.value })} /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><Label>Category</Label>
              <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={form.disease_category} onChange={(e) => setForm({ ...form, disease_category: e.target.value })}>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div><Label>Inheritance Pattern</Label>
              <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={form.inheritance_pattern} onChange={(e) => setForm({ ...form, inheritance_pattern: e.target.value })}>
                {INHERITANCE.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div><Label>OMIM ID</Label><Input value={form.omim_id} onChange={(e) => setForm({ ...form, omim_id: e.target.value })} /></div>
          <div><Label>Description</Label><Textarea rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSave} disabled={saving}>{saving ? "Saving..." : "Save"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
