import { Link, useLocation } from "react-router-dom";
import { Dna, Search, FlaskConical, Home, LogIn, LogOut, Shield, Lightbulb } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";

export default function AppHeader() {
  const location = useLocation();
  const { user, isAdmin, signOut } = useAuth();

  const navItems = [
    { path: "/", label: "Home", icon: Home },
    { path: "/search", label: "Search", icon: Search },
    { path: "/genes", label: "Genes", icon: Dna },
    { path: "/diseases", label: "Diseases", icon: FlaskConical },
    ...(user ? [{ path: "/suggestions", label: "Suggest", icon: Lightbulb }] : []),
    ...(isAdmin ? [{ path: "/admin", label: "Admin", icon: Shield }] : []),
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-border glass-surface">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <Dna className="h-5 w-5 text-primary-foreground" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold font-display leading-none tracking-tight text-foreground">
              PH-GDAE
            </span>
            <span className="text-[10px] text-muted-foreground leading-none mt-0.5">
              Gene–Disease Explorer
            </span>
          </div>
        </Link>

        <nav className="flex items-center gap-1">
          {navItems.map(({ path, label, icon: Icon }) => {
            const isActive = location.pathname === path;
            return (
              <Link
                key={path}
                to={path}
                className={`flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{label}</span>
              </Link>
            );
          })}

          {user ? (
            <Button variant="ghost" size="sm" onClick={signOut} className="ml-1">
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Sign Out</span>
            </Button>
          ) : (
            <Link to="/auth">
              <Button variant="ghost" size="sm" className="ml-1">
                <LogIn className="h-4 w-4" />
                <span className="hidden sm:inline">Sign In</span>
              </Button>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
