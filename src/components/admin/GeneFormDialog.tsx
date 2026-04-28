import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import type { DbGene, DbFunctionalCategory, DbGeneCategoryMapping } from "@/hooks/useDatabase";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  gene?: DbGene | null;
  categories: DbFunctionalCategory[];
  mappings: DbGeneCategoryMapping[];
}

export function GeneFormDialog({ open, onOpenChange, gene, categories, mappings }: Props) {
  const { toast } = useToast();
  const qc = useQueryClient();
  const [form, setForm] = useState({
    gene_symbol: "",
    full_gene_name: "",
    gene_type: "Protein-coding",
    omim_id: "",
    chromosomal_location: "",
    description: "",
  });
  const [selectedCats, setSelectedCats] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (gene) {
      setForm({
        gene_symbol: gene.gene_symbol || "",
        full_gene_name: gene.full_gene_name || "",
        gene_type: gene.gene_type || "Protein-coding",
        omim_id: gene.omim_id || "",
        chromosomal_location: gene.chromosomal_location || "",
        description: gene.description || "",
      });
      setSelectedCats(mappings.filter((m) => m.gene_id === gene.gene_id).map((m) => m.category_id));
    } else {
      setForm({ gene_symbol: "", full_gene_name: "", gene_type: "Protein-coding", omim_id: "", chromosomal_location: "", description: "" });
      setSelectedCats([]);
    }
  }, [gene, mappings, open]);

  const handleSave = async () => {
    if (!form.gene_symbol.trim() || !form.full_gene_name.trim()) {
      toast({ title: "Symbol and full name required", variant: "destructive" });
      return;
    }
    setSaving(true);
    let geneId = gene?.gene_id;
    const payload = {
      gene_symbol: form.gene_symbol.trim().toUpperCase(),
      full_gene_name: form.full_gene_name.trim(),
      gene_type: form.gene_type,
      omim_id: form.omim_id.trim() || null,
      chromosomal_location: form.chromosomal_location.trim() || null,
      description: form.description.trim() || null,
    };

    if (gene) {
      const { error } = await supabase.from("genes").update(payload).eq("gene_id", gene.gene_id);
      if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); setSaving(false); return; }
    } else {
      geneId = `GENE-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
      const { error } = await supabase.from("genes").insert({ gene_id: geneId, ...payload });
      if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); setSaving(false); return; }
    }

    // Sync category mappings
    if (geneId) {
      await supabase.from("gene_category_mappings").delete().eq("gene_id", geneId);
      if (selectedCats.length > 0) {
        const rows = selectedCats.map((cid) => ({
          gene_category_id: `GCM-${crypto.randomUUID().slice(0, 8).toUpperCase()}`,
          gene_id: geneId!,
          category_id: cid,
        }));
        await supabase.from("gene_category_mappings").insert(rows);
      }
    }

    toast({ title: gene ? "Gene updated" : "Gene added" });
    qc.invalidateQueries({ queryKey: ["genes"] });
    qc.invalidateQueries({ queryKey: ["gene_category_mappings"] });
    qc.invalidateQueries({ queryKey: ["gene", geneId] });
    setSaving(false);
    onOpenChange(false);
  };

  const toggleCat = (id: string) => {
    setSelectedCats((prev) => prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader><DialogTitle>{gene ? "Edit Gene" : "Add Gene"}</DialogTitle></DialogHeader>
        <div className="space-y-4 py-2">
          <div className="grid grid-cols-2 gap-3">
            <div><Label>Gene Symbol *</Label><Input value={form.gene_symbol} onChange={(e) => setForm({ ...form, gene_symbol: e.target.value })} /></div>
            <div><Label>Gene Type</Label>
              <Select value={form.gene_type} onValueChange={(v) => setForm({ ...form, gene_type: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Protein-coding">Protein-coding</SelectItem>
                  <SelectItem value="Non-coding">Non-coding</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div><Label>Full Gene Name *</Label><Input value={form.full_gene_name} onChange={(e) => setForm({ ...form, full_gene_name: e.target.value })} /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><Label>OMIM ID</Label><Input value={form.omim_id} onChange={(e) => setForm({ ...form, omim_id: e.target.value })} /></div>
            <div><Label>Chromosomal Location</Label><Input value={form.chromosomal_location} onChange={(e) => setForm({ ...form, chromosomal_location: e.target.value })} placeholder="e.g. 7q31.2" /></div>
          </div>
          <div><Label>Description</Label><Textarea rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
          <div>
            <Label>Functional Categories</Label>
            <div className="mt-2 grid grid-cols-2 gap-2 max-h-40 overflow-y-auto border border-border rounded-md p-3">
              {categories.length === 0 && <p className="text-xs text-muted-foreground col-span-2">No categories yet. Create them in the Categories tab.</p>}
              {categories.map((c) => (
                <label key={c.category_id} className="flex items-center gap-2 text-sm cursor-pointer">
                  <Checkbox checked={selectedCats.includes(c.category_id)} onCheckedChange={() => toggleCat(c.category_id)} />
                  <span>{c.category_name}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSave} disabled={saving}>{saving ? "Saving..." : "Save"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
