import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dna, LogIn, UserPlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AuthPage() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [tempKey, setTempKey] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      toast({ title: "Login failed", description: error.message, variant: "destructive" });
    } else {
      navigate("/");
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Check whitelist & temp key
    const { data: whitelistEntry } = await supabase
      .from("whitelist")
      .select("*")
      .eq("email", email)
      .eq("temp_key", tempKey)
      .eq("used", false)
      .maybeSingle();

    if (!whitelistEntry) {
      setLoading(false);
      toast({
        title: "Not authorized",
        description: "Your email is not whitelisted or the temporary key is invalid. Contact the admin.",
        variant: "destructive",
      });
      return;
    }

    const { error } = await supabase.auth.signUp({ email, password });
    setLoading(false);
    if (error) {
      toast({ title: "Signup failed", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Account created!", description: "You can now log in." });
      setMode("login");
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
      <div className="w-full max-w-sm rounded-xl border border-border bg-card p-8">
        <div className="flex items-center gap-2 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <Dna className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-display font-bold text-foreground text-lg">PH-GDAE</h1>
            <p className="text-xs text-muted-foreground">{mode === "login" ? "Sign in" : "Create account"}</p>
          </div>
        </div>

        <form onSubmit={mode === "login" ? handleLogin : handleSignup} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground">Email</label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground">Password</label>
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
          </div>
          {mode === "signup" && (
            <div>
              <label className="text-sm font-medium text-foreground">Temporary Key</label>
              <Input
                value={tempKey}
                onChange={(e) => setTempKey(e.target.value)}
                required
                placeholder="Provided by admin"
              />
              <p className="text-xs text-muted-foreground mt-1">Ask the admin for your whitelist key</p>
            </div>
          )}
          <Button type="submit" className="w-full" disabled={loading}>
            {mode === "login" ? <><LogIn className="h-4 w-4" /> Sign In</> : <><UserPlus className="h-4 w-4" /> Sign Up</>}
          </Button>
        </form>

        <div className="mt-4 text-center">
          {mode === "login" ? (
            <button onClick={() => setMode("signup")} className="text-sm text-primary hover:underline">
              Have a temp key? Sign up
            </button>
          ) : (
            <button onClick={() => setMode("login")} className="text-sm text-primary hover:underline">
              Already have an account? Sign in
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
