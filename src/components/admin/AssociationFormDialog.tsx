import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import type { DbGene, DbDisease, DbGeneDiseaseAssociation } from "@/hooks/useDatabase";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  assoc?: DbGeneDiseaseAssociation | null;
  genes: DbGene[];
  diseases: DbDisease[];
}

const ASSOC_TYPES = ["Germline", "Somatic", "Predisposition", "Driver"];
const PREVALENCE = ["", "high", "moderate", "low", "unknown"];

export function AssociationFormDialog({ open, onOpenChange, assoc, genes, diseases }: Props) {
  const { toast } = useToast();
  const qc = useQueryClient();
  const [form, setForm] = useState({
    gene_id: "",
    disease_id: "",
    association_type: "Germline",
    ph_prevalence: "",
    study_type: "",
    citation: "",
    study_link: "",
    description: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (assoc) {
      setForm({
        gene_id: assoc.gene_id,
        disease_id: assoc.disease_id,
        association_type: assoc.association_type || "Germline",
        ph_prevalence: assoc.ph_prevalence || "",
        study_type: assoc.study_type || "",
        citation: assoc.citation || "",
        study_link: assoc.study_link || "",
        description: assoc.description || "",
      });
    } else {
      setForm({ gene_id: "", disease_id: "", association_type: "Germline", ph_prevalence: "", study_type: "", citation: "", study_link: "", description: "" });
    }
  }, [assoc, open]);

  const handleSave = async () => {
    if (!form.gene_id || !form.disease_id) {
      toast({ title: "Gene and disease required", variant: "destructive" });
      return;
    }
    setSaving(true);
    const payload = {
      gene_id: form.gene_id,
      disease_id: form.disease_id,
      association_type: form.association_type,
      ph_prevalence: form.ph_prevalence || null,
      study_type: form.study_type.trim() || null,
      citation: form.citation.trim() || null,
      study_link: form.study_link.trim() || null,
      description: form.description.trim() || null,
    };
    if (assoc) {
      const { error } = await supabase.from("gene_disease_associations").update(payload).eq("gene_disease_id", assoc.gene_disease_id);
      if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); setSaving(false); return; }
    } else {
      const id = `GDA-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
      const { error } = await supabase.from("gene_disease_associations").insert({ gene_disease_id: id, ...payload });
      if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); setSaving(false); return; }
    }
    toast({ title: assoc ? "Association updated" : "Association added" });
    qc.invalidateQueries({ queryKey: ["gene_disease_associations"] });
    setSaving(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader><DialogTitle>{assoc ? "Edit Association" : "Add Association"}</DialogTitle></DialogHeader>
        <div className="space-y-4 py-2">
          <div className="grid grid-cols-2 gap-3">
            <div><Label>Gene *</Label>
              <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={form.gene_id} onChange={(e) => setForm({ ...form, gene_id: e.target.value })}>
                <option value="">— Select gene —</option>
                {genes.map((g) => <option key={g.gene_id} value={g.gene_id}>{g.gene_symbol} — {g.full_gene_name}</option>)}
              </select>
            </div>
            <div><Label>Disease *</Label>
              <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={form.disease_id} onChange={(e) => setForm({ ...form, disease_id: e.target.value })}>
                <option value="">— Select disease —</option>
                {diseases.map((d) => <option key={d.disease_id} value={d.disease_id}>{d.disease_name}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><Label>Association Type</Label>
              <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={form.association_type} onChange={(e) => setForm({ ...form, association_type: e.target.value })}>
                {ASSOC_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div><Label>PH Prevalence</Label>
              <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={form.ph_prevalence} onChange={(e) => setForm({ ...form, ph_prevalence: e.target.value })}>
                {PREVALENCE.map((p) => <option key={p} value={p}>{p || "— none —"}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><Label>Study Type</Label><Input value={form.study_type} onChange={(e) => setForm({ ...form, study_type: e.target.value })} placeholder="e.g. case study" /></div>
            <div><Label>Citation</Label><Input value={form.citation} onChange={(e) => setForm({ ...form, citation: e.target.value })} /></div>
          </div>
          <div><Label>Study Link</Label><Input value={form.study_link} onChange={(e) => setForm({ ...form, study_link: e.target.value })} placeholder="https://..." /></div>
          <div><Label>Description</Label><Textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSave} disabled={saving}>{saving ? "Saving..." : "Save"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
