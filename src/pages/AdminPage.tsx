import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { UserPlus, Check, X, Copy, Shield, MessageSquare } from "lucide-react";
import { Navigate } from "react-router-dom";
import { addSuggestionToDatabase } from "@/hooks/useSuggestionApproval";

interface WhitelistEntry {
  id: string;
  email: string;
  temp_key: string;
  used: boolean;
  created_at: string;
}

interface Suggestion {
  id: string;
  gene: string;
  disease: string;
  remarks: string | null;
  reference_links: string[] | null;
  status: string;
  admin_notes: string | null;
  created_at: string;
  user_id: string;
}

export default function AdminPage() {
  const { isAdmin, isLoading } = useAuth();
  const { toast } = useToast();
  const [newEmail, setNewEmail] = useState("");
  const [whitelist, setWhitelist] = useState<WhitelistEntry[]>([]);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [adminNotes, setAdminNotes] = useState<Record<string, string>>({});

  const fetchWhitelist = async () => {
    const { data } = await supabase.from("whitelist").select("*").order("created_at", { ascending: false });
    if (data) setWhitelist(data);
  };

  const fetchSuggestions = async () => {
    const { data } = await supabase.from("suggestions").select("*").order("created_at", { ascending: false });
    if (data) setSuggestions(data);
  };

  useEffect(() => {
    if (isAdmin) {
      fetchWhitelist();
      fetchSuggestions();
    }
  }, [isAdmin]);

  if (isLoading) return <div className="container py-20 text-center text-muted-foreground">Loading...</div>;
  if (!isAdmin) return <Navigate to="/" replace />;

  const addToWhitelist = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail.trim()) return;
    const { error } = await supabase.from("whitelist").insert({ email: newEmail.trim().toLowerCase() });
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "User added to whitelist" });
      setNewEmail("");
      fetchWhitelist();
    }
  };

  const updateSuggestion = async (id: string, status: "approved" | "rejected") => {
    const notes = adminNotes[id] || null;
    const { error } = await supabase
      .from("suggestions")
      .update({ status, admin_notes: notes })
      .eq("id", id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }

    // If approved, add gene-disease association to database
    if (status === "approved") {
      const suggestion = suggestions.find((s) => s.id === id);
      if (suggestion) {
        const result = await addSuggestionToDatabase(suggestion.gene, suggestion.disease);
        if (!result.success) {
          toast({ title: "Warning", description: result.message, variant: "destructive" });
        }
      }
    }

    toast({ title: `Suggestion ${status}` });
    fetchSuggestions();
  };

  const copyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    toast({ title: "Temp key copied!" });
  };

  return (
    <div className="container py-10 max-w-4xl">
      <div className="flex items-center gap-2 mb-8">
        <Shield className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-display font-bold text-foreground">Admin Panel</h1>
      </div>

      <Tabs defaultValue="users">
        <TabsList>
          <TabsTrigger value="users">User Management</TabsTrigger>
          <TabsTrigger value="suggestions">
            Suggestions
            {suggestions.filter((s) => s.status === "pending").length > 0 && (
              <span className="ml-1.5 rounded-full bg-primary px-1.5 py-0.5 text-[10px] font-bold text-primary-foreground">
                {suggestions.filter((s) => s.status === "pending").length}
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-6">
          <form onSubmit={addToWhitelist} className="flex gap-2">
            <Input
              placeholder="Email to whitelist..."
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              required
            />
            <Button type="submit">
              <UserPlus className="h-4 w-4" /> Add
            </Button>
          </form>

          <div className="rounded-xl border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted">
                  <th className="text-left p-3 font-medium text-muted-foreground">Email</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Temp Key</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {whitelist.map((entry) => (
                  <tr key={entry.id} className="border-b border-border last:border-0">
                    <td className="p-3 text-foreground">{entry.email}</td>
                    <td className="p-3">
                      <button
                        onClick={() => copyKey(entry.temp_key)}
                        className="inline-flex items-center gap-1 rounded bg-secondary px-2 py-0.5 text-xs font-mono text-secondary-foreground hover:bg-secondary/80"
                      >
                        {entry.temp_key} <Copy className="h-3 w-3" />
                      </button>
                    </td>
                    <td className="p-3">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${entry.used ? "bg-primary/10 text-primary" : "bg-accent/20 text-accent-foreground"}`}>
                        {entry.used ? "Registered" : "Pending"}
                      </span>
                    </td>
                  </tr>
                ))}
                {whitelist.length === 0 && (
                  <tr>
                    <td colSpan={3} className="p-6 text-center text-muted-foreground">No users whitelisted yet</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="suggestions" className="space-y-4">
          {suggestions.length === 0 && (
            <p className="text-muted-foreground text-center py-10">No suggestions yet</p>
          )}
          {suggestions.map((s) => (
            <div key={s.id} className="rounded-xl border border-border bg-card p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex gap-2 mb-1">
                    <span className="rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">Gene: {s.gene}</span>
                    <span className="rounded-md bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground">Disease: {s.disease}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{new Date(s.created_at).toLocaleDateString()}</p>
                </div>
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${
                  s.status === "pending" ? "bg-accent/20 text-accent-foreground"
                  : s.status === "approved" ? "bg-primary/10 text-primary"
                  : "bg-destructive/10 text-destructive"
                }`}>
                  {s.status}
                </span>
              </div>

              {s.remarks && <p className="text-sm text-muted-foreground mb-2">{s.remarks}</p>}
              {s.reference_links && s.reference_links.length > 0 && (
                <div className="mb-3">
                  <p className="text-xs font-medium text-foreground mb-1">References:</p>
                  {s.reference_links.map((ref, i) => (
                    <p key={i} className="text-xs text-primary break-all">{ref}</p>
                  ))}
                </div>
              )}

              {s.status === "pending" && (
                <div className="flex items-end gap-2 mt-3 pt-3 border-t border-border">
                  <div className="flex-1">
                    <label className="text-xs text-muted-foreground">Admin notes (optional)</label>
                    <Input
                      value={adminNotes[s.id] || ""}
                      onChange={(e) => setAdminNotes((prev) => ({ ...prev, [s.id]: e.target.value }))}
                      placeholder="Notes..."
                      className="h-8 text-sm"
                    />
                  </div>
                  <Button size="sm" onClick={() => updateSuggestion(s.id, "approved")} className="bg-primary">
                    <Check className="h-3 w-3" /> Approve
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => updateSuggestion(s.id, "rejected")}>
                    <X className="h-3 w-3" /> Reject
                  </Button>
                </div>
              )}

              {s.admin_notes && s.status !== "pending" && (
                <div className="mt-2 flex items-start gap-1 text-xs text-muted-foreground">
                  <MessageSquare className="h-3 w-3 mt-0.5 shrink-0" /> {s.admin_notes}
                </div>
              )}
            </div>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
