import { Link, useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/hooks/use-auth";

const navLinks = [
  { to: "/" as const, label: "Гра" },
  { to: "/how-to-play" as const, label: "Як грати" },
  { to: "/features" as const, label: "Особливості" },
  { to: "/leaderboard" as const, label: "Топ гравців" },
];

export function Navbar() {
  const { user, username, signOut, loading } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="border-b border-white/5 py-4 px-6 md:px-8 flex justify-between items-center sticky top-0 bg-bg/80 backdrop-blur-md z-50">
      <Link to="/" className="flex items-center gap-2">
        <div className="size-8 bg-gradient-to-tr from-primary to-secondary rounded-lg" />
        <span className="font-display font-bold text-xl tracking-tighter text-white">
          NEO-DINO
        </span>
      </Link>

      <div className="hidden md:flex gap-6 text-xs font-medium uppercase tracking-widest">
        {navLinks.map((l) => (
          <Link
            key={l.to}
            to={l.to}
            activeOptions={{ exact: true }}
            activeProps={{ className: "text-primary" }}
            inactiveProps={{ className: "text-slate-400" }}
            className="hover:text-primary transition-colors"
          >
            {l.label}
          </Link>
        ))}
      </div>

      {loading ? (
        <div className="w-20 h-8" />
      ) : user ? (
        <div className="flex items-center gap-3">
          <Link
            to="/profile"
            activeProps={{ className: "border-primary/60 text-primary" }}
            inactiveProps={{ className: "border-primary/20 text-primary" }}
            className="px-4 py-2 border text-xs font-bold uppercase tracking-widest transition-all hover:border-primary/50"
          >
            {username ?? "Профіль"}
          </Link>
          <button
            type="button"
            onClick={async () => {
              await signOut();
              navigate({ to: "/" });
            }}
            className="px-4 py-2 border border-white/10 hover:border-accent/50 text-slate-400 hover:text-accent text-xs font-bold uppercase tracking-widest transition-all"
          >
            Вийти
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => navigate({ to: "/auth" })}
          className="px-5 py-2 border border-primary/20 hover:border-primary/50 text-primary text-xs font-bold uppercase tracking-widest transition-all"
        >
          Увійти
        </button>
      )}
    </nav>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-white/5 px-6 md:px-8 py-12 mt-auto">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex items-center gap-2 opacity-60">
          <div className="size-6 bg-gradient-to-tr from-primary to-secondary rounded-sm" />
          <span className="font-display font-bold text-lg tracking-tighter text-white">
            NEO-DINO
          </span>
        </div>
        <p className="text-xs text-slate-600 uppercase tracking-widest text-center">
          © 2026 Дипломний проект · усі права збережено
        </p>
      </div>
    </footer>
  );
}
