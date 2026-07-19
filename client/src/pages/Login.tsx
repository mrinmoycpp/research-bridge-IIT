import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/saved");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-md px-6 py-20">
      <div className="animate-in border border-hairline bg-card p-8">
        <span className="section-label">// AUTH</span>
        <h1 className="mt-3 text-3xl font-bold tracking-tight">Sign in</h1>
        <p className="mt-2 text-sm text-stone">
          Access your saved professors and application tracker.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          {error && (
            <div className="border border-danger/30 bg-rose-dim px-4 py-3 font-mono text-xs text-rose">
              ERR: {error}
            </div>
          )}
          <div>
            <label className="mb-2 block font-mono text-xs font-medium text-stone">
              EMAIL
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@university.edu"
              className="input w-full px-4 py-3"
            />
          </div>
          <div>
            <label className="mb-2 block font-mono text-xs font-medium text-stone">
              PASSWORD
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="input w-full px-4 py-3"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="btn btn-neon w-full py-3 disabled:opacity-50"
          >
            {loading ? "LOADING..." : "SIGN IN →"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-stone">
          No account?{" "}
          <Link to="/register" className="font-medium text-neon hover:underline">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
