import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { useGenes, useFunctionalCategories, useGeneCategoryMappings, type DbGene } from "@/hooks/useDatabase";
import { GeneFormDialog } from "./GeneFormDialog";
import { ConfirmDeleteDialog } from "./ConfirmDeleteDialog";

export function GenesManager() {
  const { toast } = useToast();
  const qc = useQueryClient();
  const { data: genes = [] } = useGenes();
  const { data: categories = [] } = useFunctionalCategories();
  const { data: mappings = [] } = useGeneCategoryMappings();
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<DbGene | null>(null);
  const [open, setOpen] = useState(false);
  const [toDelete, setToDelete] = useState<DbGene | null>(null);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return genes.filter((g) =>
      g.gene_symbol.toLowerCase().includes(q) ||
      g.full_gene_name.toLowerCase().includes(q) ||
      g.gene_id.toLowerCase().includes(q),
    );
  }, [genes, search]);

  const handleDelete = async () => {
    if (!toDelete) return;
    await supabase.from("gene_category_mappings").delete().eq("gene_id", toDelete.gene_id);
    await supabase.from("gene_disease_associations").delete().eq("gene_id", toDelete.gene_id);
    const { error } = await supabase.from("genes").delete().eq("gene_id", toDelete.gene_id);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else {
      toast({ title: "Gene deleted" });
      qc.invalidateQueries({ queryKey: ["genes"] });
      qc.invalidateQueries({ queryKey: ["gene_disease_associations"] });
      qc.invalidateQueries({ queryKey: ["gene_category_mappings"] });
    }
    setToDelete(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search genes..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Button onClick={() => { setEditing(null); setOpen(true); }}><Plus className="h-4 w-4" /> Add Gene</Button>
      </div>

      <div className="rounded-xl border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted">
              <th className="text-left p-3 font-medium text-muted-foreground">Symbol</th>
              <th className="text-left p-3 font-medium text-muted-foreground">Full Name</th>
              <th className="text-left p-3 font-medium text-muted-foreground">Type</th>
              <th className="text-left p-3 font-medium text-muted-foreground">OMIM</th>
              <th className="text-right p-3 font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((g) => (
              <tr key={g.gene_id} className="border-b border-border last:border-0 hover:bg-muted/30">
                <td className="p-3 font-medium text-foreground">{g.gene_symbol}</td>
                <td className="p-3 text-muted-foreground">{g.full_gene_name}</td>
                <td className="p-3 text-muted-foreground">{g.gene_type}</td>
                <td className="p-3 text-muted-foreground">{g.omim_id || "—"}</td>
                <td className="p-3 text-right">
                  <Button variant="ghost" size="sm" onClick={() => { setEditing(g); setOpen(true); }}><Pencil className="h-3.5 w-3.5" /></Button>
                  <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => setToDelete(g)}><Trash2 className="h-3.5 w-3.5" /></Button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && <tr><td colSpan={5} className="p-6 text-center text-muted-foreground">No genes found.</td></tr>}
          </tbody>
        </table>
      </div>

      <GeneFormDialog open={open} onOpenChange={setOpen} gene={editing} categories={categories} mappings={mappings} />
      <ConfirmDeleteDialog
        open={!!toDelete}
        onOpenChange={(o) => !o && setToDelete(null)}
        title={`Delete ${toDelete?.gene_symbol}?`}
        description="This will also remove all associations and category mappings for this gene. This cannot be undone."
        onConfirm={handleDelete}
      />
    </div>
  );
}
