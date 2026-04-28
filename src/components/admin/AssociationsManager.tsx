import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { useGenes, useDiseases, useGeneDiseaseAssociations, type DbGeneDiseaseAssociation } from "@/hooks/useDatabase";
import { AssociationFormDialog } from "./AssociationFormDialog";
import { ConfirmDeleteDialog } from "./ConfirmDeleteDialog";

export function AssociationsManager() {
  const { toast } = useToast();
  const qc = useQueryClient();
  const { data: genes = [] } = useGenes();
  const { data: diseases = [] } = useDiseases();
  const { data: assocs = [] } = useGeneDiseaseAssociations();
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<DbGeneDiseaseAssociation | null>(null);
  const [open, setOpen] = useState(false);
  const [toDelete, setToDelete] = useState<DbGeneDiseaseAssociation | null>(null);

  const geneMap = useMemo(() => Object.fromEntries(genes.map((g) => [g.gene_id, g.gene_symbol])), [genes]);
  const diseaseMap = useMemo(() => Object.fromEntries(diseases.map((d) => [d.disease_id, d.disease_name])), [diseases]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return assocs.filter((a) => {
      const gs = (geneMap[a.gene_id] || "").toLowerCase();
      const dn = (diseaseMap[a.disease_id] || "").toLowerCase();
      return gs.includes(q) || dn.includes(q) || (a.association_type || "").toLowerCase().includes(q);
    });
  }, [assocs, geneMap, diseaseMap, search]);

  const handleDelete = async () => {
    if (!toDelete) return;
    const { error } = await supabase.from("gene_disease_associations").delete().eq("gene_disease_id", toDelete.gene_disease_id);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else {
      toast({ title: "Association deleted" });
      qc.invalidateQueries({ queryKey: ["gene_disease_associations"] });
    }
    setToDelete(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search associations..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Button onClick={() => { setEditing(null); setOpen(true); }}><Plus className="h-4 w-4" /> Add Association</Button>
      </div>

      <div className="rounded-xl border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted">
              <th className="text-left p-3 font-medium text-muted-foreground">Gene</th>
              <th className="text-left p-3 font-medium text-muted-foreground">Disease</th>
              <th className="text-left p-3 font-medium text-muted-foreground">Type</th>
              <th className="text-left p-3 font-medium text-muted-foreground">PH Prevalence</th>
              <th className="text-left p-3 font-medium text-muted-foreground">Citation</th>
              <th className="text-right p-3 font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((a) => (
              <tr key={a.gene_disease_id} className="border-b border-border last:border-0 hover:bg-muted/30">
                <td className="p-3 font-medium text-foreground">{geneMap[a.gene_id] || a.gene_id}</td>
                <td className="p-3 text-muted-foreground">{diseaseMap[a.disease_id] || a.disease_id}</td>
                <td className="p-3 text-muted-foreground capitalize">{a.association_type}</td>
                <td className="p-3 text-muted-foreground capitalize">{a.ph_prevalence || "—"}</td>
                <td className="p-3 text-muted-foreground truncate max-w-[200px]">{a.citation || "—"}</td>
                <td className="p-3 text-right">
                  <Button variant="ghost" size="sm" onClick={() => { setEditing(a); setOpen(true); }}><Pencil className="h-3.5 w-3.5" /></Button>
                  <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => setToDelete(a)}><Trash2 className="h-3.5 w-3.5" /></Button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && <tr><td colSpan={6} className="p-6 text-center text-muted-foreground">No associations found.</td></tr>}
          </tbody>
        </table>
      </div>

      <AssociationFormDialog open={open} onOpenChange={setOpen} assoc={editing} genes={genes} diseases={diseases} />
      <ConfirmDeleteDialog
        open={!!toDelete}
        onOpenChange={(o) => !o && setToDelete(null)}
        title="Delete this association?"
        description="This removes the link between the gene and disease. This cannot be undone."
        onConfirm={handleDelete}
      />
    </div>
  );
}
