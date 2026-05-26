import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/auth")({
  component: AuthPage,
  head: () => ({
    meta: [
      { title: "Вхід / Реєстрація — NEO-DINO" },
      { name: "description", content: "Увійди або створи акаунт, щоб зберігати рекорди." },
    ],
  }),
});

function AuthPage() {
  const navigate = useNavigate();
  const { session, loading: authLoading } = useAuth();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && session) navigate({ to: "/", replace: true });
  }, [session, authLoading, navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (mode === "register") {
        if (username.trim().length < 3) {
          throw new Error("Нікнейм має містити мінімум 3 символи");
        }
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
            data: { username: username.trim() },
          },
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
      navigate({ to: "/", replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Помилка");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg text-slate-300 font-sans flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <Link to="/" className="flex items-center gap-2 justify-center mb-8">
          <div className="size-8 bg-gradient-to-tr from-primary to-secondary rounded-lg" />
          <span className="font-display font-bold text-2xl tracking-tighter text-white">
            NEO-DINO
          </span>
        </Link>

        <div className="bg-surface border border-white/10 rounded-2xl p-8 neon-glow">
          <div className="flex gap-2 mb-8 p-1 bg-bg rounded-lg border border-white/5">
            {(["login", "register"] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => {
                  setMode(m);
                  setError(null);
                }}
                className={`flex-1 py-2 text-xs font-bold uppercase tracking-widest rounded-md transition-all ${
                  mode === m
                    ? "bg-primary text-bg"
                    : "text-slate-500 hover:text-white"
                }`}
              >
                {m === "login" ? "Вхід" : "Реєстрація"}
              </button>
            ))}
          </div>

          <form onSubmit={submit} className="space-y-4">
            {mode === "register" && (
              <div>
                <label className="block text-xs uppercase tracking-widest text-slate-500 mb-2">
                  Нікнейм
                </label>
                <input
                  type="text"
                  required
                  minLength={3}
                  maxLength={24}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-3 bg-bg border border-white/10 rounded-lg text-white font-mono focus:outline-none focus:border-primary"
                  placeholder="CYBER_PUNK_99"
                />
              </div>
            )}
            <div>
              <label className="block text-xs uppercase tracking-widest text-slate-500 mb-2">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-bg border border-white/10 rounded-lg text-white font-mono focus:outline-none focus:border-primary"
                placeholder="player@neo-dino.io"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-slate-500 mb-2">
                Пароль
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-bg border border-white/10 rounded-lg text-white font-mono focus:outline-none focus:border-primary"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <p className="text-xs text-accent border border-accent/30 bg-accent/5 p-3 rounded">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-primary text-bg font-bold uppercase tracking-tighter text-lg transition-transform active:scale-95 disabled:opacity-50"
            >
              {loading
                ? "Обробка..."
                : mode === "login"
                  ? "Увійти"
                  : "Створити акаунт"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
