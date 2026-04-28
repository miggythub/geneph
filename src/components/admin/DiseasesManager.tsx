import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { useDiseases, type DbDisease } from "@/hooks/useDatabase";
import { DiseaseFormDialog } from "./DiseaseFormDialog";
import { ConfirmDeleteDialog } from "./ConfirmDeleteDialog";

export function DiseasesManager() {
  const { toast } = useToast();
  const qc = useQueryClient();
  const { data: diseases = [] } = useDiseases();
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<DbDisease | null>(null);
  const [open, setOpen] = useState(false);
  const [toDelete, setToDelete] = useState<DbDisease | null>(null);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return diseases.filter((d) =>
      d.disease_name.toLowerCase().includes(q) ||
      d.disease_category.toLowerCase().includes(q) ||
      d.disease_id.toLowerCase().includes(q),
    );
  }, [diseases, search]);

  const handleDelete = async () => {
    if (!toDelete) return;
    await supabase.from("gene_disease_associations").delete().eq("disease_id", toDelete.disease_id);
    const { error } = await supabase.from("diseases").delete().eq("disease_id", toDelete.disease_id);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else {
      toast({ title: "Disease deleted" });
      qc.invalidateQueries({ queryKey: ["diseases"] });
      qc.invalidateQueries({ queryKey: ["gene_disease_associations"] });
    }
    setToDelete(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search diseases..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Button onClick={() => { setEditing(null); setOpen(true); }}><Plus className="h-4 w-4" /> Add Disease</Button>
      </div>

      <div className="rounded-xl border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted">
              <th className="text-left p-3 font-medium text-muted-foreground">Name</th>
              <th className="text-left p-3 font-medium text-muted-foreground">Category</th>
              <th className="text-left p-3 font-medium text-muted-foreground">Inheritance</th>
              <th className="text-left p-3 font-medium text-muted-foreground">OMIM</th>
              <th className="text-right p-3 font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((d) => (
              <tr key={d.disease_id} className="border-b border-border last:border-0 hover:bg-muted/30">
                <td className="p-3 font-medium text-foreground">{d.disease_name}</td>
                <td className="p-3 text-muted-foreground">{d.disease_category}</td>
                <td className="p-3 text-muted-foreground">{d.inheritance_pattern}</td>
                <td className="p-3 text-muted-foreground">{d.omim_id || "—"}</td>
                <td className="p-3 text-right">
                  <Button variant="ghost" size="sm" onClick={() => { setEditing(d); setOpen(true); }}><Pencil className="h-3.5 w-3.5" /></Button>
                  <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => setToDelete(d)}><Trash2 className="h-3.5 w-3.5" /></Button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && <tr><td colSpan={5} className="p-6 text-center text-muted-foreground">No diseases found.</td></tr>}
          </tbody>
        </table>
      </div>

      <DiseaseFormDialog open={open} onOpenChange={setOpen} disease={editing} />
      <ConfirmDeleteDialog
        open={!!toDelete}
        onOpenChange={(o) => !o && setToDelete(null)}
        title={`Delete ${toDelete?.disease_name}?`}
        description="This will also remove all gene associations linked to this disease. This cannot be undone."
        onConfirm={handleDelete}
      />
    </div>
  );
}
