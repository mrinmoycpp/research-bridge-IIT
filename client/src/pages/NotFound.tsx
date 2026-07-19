import { Link } from "react-router-dom";

export function NotFound() {
  return (
    <div className="mx-auto flex max-w-[1400px] flex-col items-center px-6 py-32 text-center">
      <span className="font-mono text-sm text-stone-light">ERR 404</span>
      <h1 className="mt-3 text-5xl font-bold tracking-tight">Not Found</h1>
      <p className="mt-3 max-w-sm text-sm text-stone">
        This page doesn't exist in ResearchBridge.
      </p>
      <Link
        to="/"
        className="btn btn-neon mt-8 px-6 py-2.5"
      >
        ← HOME
      </Link>
    </div>
  );
}
