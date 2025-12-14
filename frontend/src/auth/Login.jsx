import { useState, useEffect } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // already logged in → redirect
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/");
    }
  }, [navigate]);

  const submitHandler = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.user.role);

      navigate("/");
    } catch {
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50 relative flex items-center justify-center px-4">
      {/* background gradients */}
      <div className="pointer-events-none fixed inset-0 opacity-50">
        <div className="absolute -top-32 -left-32 h-80 w-80 rounded-full bg-gradient-to-br from-sky-500/40 via-cyan-400/20 to-purple-500/30 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-gradient-to-tr from-fuchsia-500/30 via-emerald-400/20 to-blue-500/30 blur-3xl" />
      </div>

      {/* card */}
      <div className="relative z-10 w-full max-w-md rounded-3xl border border-white/10 bg-slate-900/80 px-6 py-7 shadow-[0_24px_60px_rgba(15,23,42,0.95)] backdrop-blur-2xl sm:px-8">
        {/* logo + title */}
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 via-emerald-400 to-fuchsia-500 shadow-[0_0_30px_rgba(56,189,248,0.7)]">
            <span className="text-xl">🍬</span>
          </div>
          <div>
            <p className="text-sm font-semibold tracking-tight text-slate-50">
              Sweet Shop Control Center
            </p>
            <p className="text-[11px] text-slate-400">
              Sign in to manage your inventory
            </p>
          </div>
        </div>

        <h2 className="text-xl font-semibold text-slate-50">Sign in</h2>
        <p className="mt-1 text-sm text-slate-400">
          Enter your credentials to access the dashboard.
        </p>

        {/* error */}
        {error && (
          <div className="mt-4 rounded-2xl border border-rose-500/60 bg-rose-500/10 px-3.5 py-2.5 text-xs text-rose-100">
            {error}
          </div>
        )}

        <form onSubmit={submitHandler} className="mt-5 space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-300">
              Email address
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-2xl border border-white/10 bg-slate-900/70 px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:border-sky-500/70 focus:ring-1 focus:ring-sky-500/60 focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-300">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-2xl border border-white/10 bg-slate-900/70 px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:border-emerald-500/70 focus:ring-1 focus:ring-emerald-500/60 focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>Use your admin or staff account credentials.</span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-emerald-500 to-sky-500 px-4 py-2.5 text-sm font-semibold text-slate-950 shadow-lg shadow-emerald-500/40 transition hover:-translate-y-0.5 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-900/40 border-t-slate-950" />
                Signing in…
              </>
            ) : (
              "Sign in"
            )}
          </button>
        </form>

        <p className="mt-4 text-center text-[11px] text-slate-500">
          New here?{" "}
          <button
            type="button"
            onClick={() => navigate("/register")}
            className="font-semibold text-sky-300 hover:text-sky-200 underline-offset-2 hover:underline"
          >
            Create an account
          </button>
        </p>

        <p className="mt-2 text-center text-[11px] text-slate-500">
          Protected area · Unauthorized access is not allowed.
        </p>
      </div>
    </main>
  );
};

export default Login;
