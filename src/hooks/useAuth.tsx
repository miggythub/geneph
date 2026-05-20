import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { User, Session } from "@supabase/supabase-js";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isAdmin: boolean;
  isManager: boolean;
  isLoading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  isAdmin: false,
  isManager: false,
  isLoading: true,
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isManager, setIsManager] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // 1. CREATE A MOCK USER OBJECT TO FOOL THE ROUTE GUARDS
  const mockUser = {
    id: "demo-user-12345",
    email: "demo-user@company.com",
    user_metadata: { full_name: "Demo Presenter" },
    role: "authenticated",
  } as unknown as User;

  const mockSession = {
    access_token: "fake-jwt-token-for-demo",
    user: mockUser,
  } as unknown as Session;

  useEffect(() => {
    // 2. CHOOSE WHICH USER TYPE TO SHOWCASE RIGHT HERE 🚨
    // Change this string to "admin", "manager", or "user" to test different dashboards!
    const currentDemoRole: "admin" | "manager" | "user" = "manager"; 

    // 3. FORCE THE APP STATES INSTANTLY
    setUser(mockUser);
    setSession(mockSession);

    if (currentDemoRole === "admin") {
      setIsAdmin(true);
      setIsManager(false);
    } else if (currentDemoRole === "manager") {
      setIsAdmin(false);
      setIsManager(true);
    } else {
      setIsAdmin(false);
      setIsManager(false);
    }

    setIsLoading(false);
  }, []);

  // 4. PREVENT SIGN OUT FROM CRASHING THE APP
  const signOut = async () => {
    setUser(null);
    setSession(null);
    setIsAdmin(false);
    setIsManager(false);
  };

  return (
    <AuthContext.Provider value={{ user, session, isAdmin, isManager, isLoading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
  
export const useAuth = () => useContext(AuthContext);
