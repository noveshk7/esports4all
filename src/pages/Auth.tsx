import { useState, useEffect } from "react";
import Header from "../components/Header";
import { supabase } from "../lib/supabase";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Auth = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // redirect handling
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/";

  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // auto redirect after login
  useEffect(() => {
    if (user) {
      navigate(redirectTo);
    }
  }, [user, navigate, redirectTo]);

  const loginWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth?redirect=${redirectTo}`,
      },
    });

    if (error) setError(error.message);
  };

  const handleSubmit = async () => {
    try {
      setError("");

      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <main className="bg-black text-white min-h-screen">
      <Header />

      <div className="pt-28 px-4 sm:px-6 flex justify-center">
        <div className="w-full max-w-sm bg-white/5 border border-white/10 rounded-xl p-5 sm:p-6">

          <h2 className="text-lg sm:text-xl font-semibold text-center">
            {isLogin ? "Login" : "Sign Up"}
          </h2>

          {error && (
            <p className="text-red-500 text-sm mt-3 text-center">{error}</p>
          )}

          {/* GOOGLE LOGIN */}
          <button
            onClick={loginWithGoogle}
            className="w-full mt-5 py-3 border border-white/20 rounded-md flex items-center justify-center gap-2 hover:bg-white/10 transition text-sm sm:text-base"
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google"
              className="w-5 h-5"
            />
            Continue with Google
          </button>

          <div className="flex items-center gap-2 my-5">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-xs text-gray-400">OR</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          <input
            type="email"
            placeholder="Email"
            className="w-full bg-black/60 border border-white/10 rounded px-3 py-3 text-sm sm:text-base"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="mt-3 w-full bg-black/60 border border-white/10 rounded px-3 py-3 text-sm sm:text-base"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            onClick={handleSubmit}
            className="mt-5 w-full py-3 bg-purple-600 rounded hover:bg-purple-700 transition text-sm sm:text-base"
          >
            {isLogin ? "Login" : "Sign Up"}
          </button>

          <p
            className="mt-4 text-sm text-center text-gray-400 cursor-pointer"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin
              ? "Don't have an account? Sign Up"
              : "Already have an account? Login"}
          </p>

        </div>
      </div>
    </main>
  );
};

export default Auth;
