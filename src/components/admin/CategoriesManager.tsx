import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { useFunctionalCategories, useGeneCategoryMappings, type DbFunctionalCategory } from "@/hooks/useDatabase";
import { CategoryFormDialog } from "./CategoryFormDialog";
import { ConfirmDeleteDialog } from "./ConfirmDeleteDialog";

export function CategoriesManager() {
  const { toast } = useToast();
  const qc = useQueryClient();
  const { data: categories = [] } = useFunctionalCategories();
  const { data: mappings = [] } = useGeneCategoryMappings();
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<DbFunctionalCategory | null>(null);
  const [open, setOpen] = useState(false);
  const [toDelete, setToDelete] = useState<DbFunctionalCategory | null>(null);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return categories.filter((c) => c.category_name.toLowerCase().includes(q));
  }, [categories, search]);

  const countFor = (id: string) => mappings.filter((m) => m.category_id === id).length;

  const handleDelete = async () => {
    if (!toDelete) return;
    await supabase.from("gene_category_mappings").delete().eq("category_id", toDelete.category_id);
    const { error } = await supabase.from("functional_categories").delete().eq("category_id", toDelete.category_id);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else {
      toast({ title: "Category deleted" });
      qc.invalidateQueries({ queryKey: ["functional_categories"] });
      qc.invalidateQueries({ queryKey: ["gene_category_mappings"] });
    }
    setToDelete(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search categories..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Button onClick={() => { setEditing(null); setOpen(true); }}><Plus className="h-4 w-4" /> Add Category</Button>
      </div>

      <div className="rounded-xl border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted">
              <th className="text-left p-3 font-medium text-muted-foreground">Name</th>
              <th className="text-left p-3 font-medium text-muted-foreground">Description</th>
              <th className="text-left p-3 font-medium text-muted-foreground">Genes</th>
              <th className="text-right p-3 font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => (
              <tr key={c.category_id} className="border-b border-border last:border-0 hover:bg-muted/30">
                <td className="p-3 font-medium text-foreground">{c.category_name}</td>
                <td className="p-3 text-muted-foreground truncate max-w-[300px]">{c.description || "—"}</td>
                <td className="p-3 text-muted-foreground">{countFor(c.category_id)}</td>
                <td className="p-3 text-right">
                  <Button variant="ghost" size="sm" onClick={() => { setEditing(c); setOpen(true); }}><Pencil className="h-3.5 w-3.5" /></Button>
                  <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => setToDelete(c)}><Trash2 className="h-3.5 w-3.5" /></Button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && <tr><td colSpan={4} className="p-6 text-center text-muted-foreground">No categories yet.</td></tr>}
          </tbody>
        </table>
      </div>

      <CategoryFormDialog open={open} onOpenChange={setOpen} category={editing} />
      <ConfirmDeleteDialog
        open={!!toDelete}
        onOpenChange={(o) => !o && setToDelete(null)}
        title={`Delete ${toDelete?.category_name}?`}
        description="This will also remove this category from all genes it's assigned to. This cannot be undone."
        onConfirm={handleDelete}
      />
    </div>
  );
}
