import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

type AuthContextType = {
  user: any;
  role: "admin" | "user" | null;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState<"admin" | "user" | null>(null);

  useEffect(() => {
  const fetchProfile = async (sessionUser: any) => {
    if (!sessionUser) {
      setUser(null);
      setRole(null);
      return;
    }

    setUser(sessionUser);

    const { data, error } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", sessionUser.id)
      .single();

    if (!error && data) {
      setRole(data.role);
    } else {
      setRole("user");
    }
  };

  supabase.auth.getSession().then(({ data }) => {
    fetchProfile(data.session?.user ?? null);
  });

  const { data: authListener } = supabase.auth.onAuthStateChange(
    (_event, session) => {
      fetchProfile(session?.user ?? null);
    }
  );

  return () => {
    authListener.subscription.unsubscribe();
  };
}, []);


  const logout = async () => {
  await supabase.auth.signOut();

  // 🔥 FORCE UI UPDATE
  setUser(null);
  setRole(null);
};


  return (
    <AuthContext.Provider value={{ user, role, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
