import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Search, Menu, X, LogIn, LogOut, LayoutDashboard, Sun, Moon } from "lucide-react";
import { CommandPalette } from "./CommandPalette";
import { useAuth } from "../../hooks/useAuth";
import { useTheme } from "../../hooks/useTheme";

const links = [
  { to: "/discover", label: "Discover" },
  { to: "/iits", label: "IITs" },
  { to: "/research-areas", label: "Research" },
];

export function Navbar() {
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuth();
  const { theme, toggle } = useTheme();

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen(true);
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-hairline bg-paper/95 backdrop-blur-sm">
        <div className="mx-auto flex h-14 max-w-[1400px] items-center justify-between px-6 lg:px-10">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2">
              <span className="font-mono text-lg font-bold tracking-tight text-ink">
                RB<span className="text-neon">_</span>
              </span>
              <span className="hidden text-[10px] font-mono uppercase tracking-widest text-stone sm:inline">
                researchbridge
              </span>
            </Link>

            <nav className="hidden items-center gap-px lg:flex">
              {links.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  className={({ isActive }) =>
                    `px-3 py-1.5 font-mono text-xs font-medium transition-all ${
                      isActive
                        ? "bg-neon-dim text-neon"
                        : "text-stone hover:text-ink"
                    }`
                  }
                >
                  {l.label}
                </NavLink>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPaletteOpen(true)}
              className="hidden items-center gap-2 border border-hairline bg-paper-dim px-3 py-1.5 font-mono text-xs text-stone transition-all hover:border-neon hover:text-neon sm:flex"
            >
              <Search size={13} />
              <span>Ctrl+K</span>
            </button>
            <button
              onClick={() => setPaletteOpen(true)}
              className="p-2 text-ink-soft hover:text-neon sm:hidden"
              aria-label="Search"
            >
              <Search size={16} />
            </button>

            <button
              onClick={toggle}
              className="p-2 text-stone transition-colors hover:text-neon"
              title={theme === "dark" ? "Light mode" : "Dark mode"}
            >
              {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
            </button>

            {user ? (
              <>
                <Link
                  to="/saved"
                  className="flex items-center gap-1.5 px-3 py-1.5 font-mono text-xs text-stone transition-colors hover:text-neon"
                  title="Tracker"
                >
                  <LayoutDashboard size={14} />
                  <span className="hidden sm:inline">Tracker</span>
                </Link>
                <div className="hidden items-center gap-2 border-l border-hairline pl-2 sm:flex">
                  <span className="font-mono text-xs text-ink-soft">{user.name}</span>
                  <button
                    onClick={logout}
                    className="p-1.5 text-stone transition-colors hover:text-neon"
                    title="Sign out"
                  >
                    <LogOut size={14} />
                  </button>
                </div>
              </>
            ) : (
              <Link
                to="/login"
                className="btn btn-neon flex items-center gap-1.5 px-3 py-1.5"
              >
                <LogIn size={13} />
                <span className="hidden sm:inline">SIGN IN</span>
              </Link>
            )}

            <button
              className="p-2 text-ink-soft lg:hidden"
              onClick={() => setMobileOpen((o) => !o)}
              aria-label="Menu"
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <nav className="border-t border-hairline bg-paper px-6 py-4 lg:hidden">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                onClick={() => setMobileOpen(false)}
                className="block border-b border-hairline py-3 font-mono text-sm text-ink-soft last:border-none hover:text-neon"
              >
                {l.label}
              </NavLink>
            ))}
            {user ? (
              <>
                <Link
                  to="/saved"
                  onClick={() => setMobileOpen(false)}
                  className="block border-b border-hairline py-3 font-mono text-sm text-ink-soft hover:text-neon"
                >
                  Tracker
                </Link>
                <button
                  onClick={() => { logout(); setMobileOpen(false); }}
                  className="py-3 text-left font-mono text-sm text-ink-soft hover:text-neon"
                >
                  Sign out ({user.name})
                </button>
              </>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileOpen(false)}
                className="py-3 font-mono text-sm font-semibold text-neon"
              >
                SIGN IN →
              </Link>
            )}
          </nav>
        )}
      </header>

      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
    </>
  );
}
