import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import type { DbFunctionalCategory } from "@/hooks/useDatabase";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category?: DbFunctionalCategory | null;
}

export function CategoryFormDialog({ open, onOpenChange, category }: Props) {
  const { toast } = useToast();
  const qc = useQueryClient();
  const [form, setForm] = useState({ category_name: "", description: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (category) setForm({ category_name: category.category_name, description: category.description || "" });
    else setForm({ category_name: "", description: "" });
  }, [category, open]);

  const handleSave = async () => {
    if (!form.category_name.trim()) { toast({ title: "Name required", variant: "destructive" }); return; }
    setSaving(true);
    const payload = { category_name: form.category_name.trim(), description: form.description.trim() || null };
    if (category) {
      const { error } = await supabase.from("functional_categories").update(payload).eq("category_id", category.category_id);
      if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); setSaving(false); return; }
    } else {
      const id = `CAT-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
      const { error } = await supabase.from("functional_categories").insert({ category_id: id, ...payload });
      if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); setSaving(false); return; }
    }
    toast({ title: category ? "Category updated" : "Category added" });
    qc.invalidateQueries({ queryKey: ["functional_categories"] });
    setSaving(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader><DialogTitle>{category ? "Edit Category" : "Add Category"}</DialogTitle></DialogHeader>
        <div className="space-y-4 py-2">
          <div><Label>Category Name *</Label><Input value={form.category_name} onChange={(e) => setForm({ ...form, category_name: e.target.value })} /></div>
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
