import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

type AuthContextType = {
  user: any;
  role: "admin" | "user" | null;
  username: string | null;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState<"admin" | "user" | null>(null);
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async (sessionUser: any) => {
      if (!sessionUser) {
        setUser(null);
        setRole(null);
        setUsername(null);
        return;
      }

      setUser(sessionUser);

      const { data, error } = await supabase
        .from("profiles")
        .select("role, username")
        .eq("id", sessionUser.id)
        .single();

      if (!error && data) {
        setRole(data.role ?? "user");
        setUsername(data.username ?? null);

        // 🔹 Auto-create username for Google users
        if (!data.username && sessionUser.email) {
          const autoUsername =
            sessionUser.email.split("@")[0] +
            "_" +
            Math.floor(Math.random() * 1000);

          await supabase
            .from("profiles")
            .update({ username: autoUsername })
            .eq("id", sessionUser.id);

          setUsername(autoUsername);
        }
      } else {
        setRole("user");
        setUsername(null);
      }
    };

    // Initial session check
    supabase.auth.getSession().then(({ data }) => {
      fetchProfile(data.session?.user ?? null);
    });

    // Auth state listener
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

    // 🔥 FORCE CLEAN STATE (fixes mobile issue)
    setUser(null);
    setRole(null);
    setUsername(null);
  };

  return (
    <AuthContext.Provider value={{ user, role, username, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
