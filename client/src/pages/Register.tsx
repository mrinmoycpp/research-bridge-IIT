import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register(email, name, password);
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
        <span className="section-label">// REGISTER</span>
        <h1 className="mt-3 text-3xl font-bold tracking-tight">Create account</h1>
        <p className="mt-2 text-sm text-stone">
          Save professors, track applications, build your shortlist.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          {error && (
            <div className="border border-danger/30 bg-rose-dim px-4 py-3 font-mono text-xs text-rose">
              ERR: {error}
            </div>
          )}
          <div>
            <label className="mb-2 block font-mono text-xs font-medium text-stone">
              FULL NAME
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              className="input w-full px-4 py-3"
            />
          </div>
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
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="input w-full px-4 py-3"
            />
            <p className="mt-1 font-mono text-[11px] text-stone-light">min 6 chars</p>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="btn btn-neon w-full py-3 disabled:opacity-50"
          >
            {loading ? "LOADING..." : "CREATE ACCOUNT →"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-stone">
          Have an account?{" "}
          <Link to="/login" className="font-medium text-neon hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
