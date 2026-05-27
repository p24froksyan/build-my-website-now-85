import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Navbar, Footer } from "@/components/Navbar";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/profile")({
  component: ProfilePage,
  head: () => ({
    meta: [
      { title: "Мій профіль — NEO-DINO" },
      {
        name: "description",
        content:
          "Особистий профіль гравця NEO-DINO: аватар, нікнейм і персональний рекорд.",
      },
    ],
  }),
});

function ProfilePage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const fileRef = useRef<HTMLInputElement>(null);

  const [username, setUsername] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [bestScore, setBestScore] = useState<number>(0);
  const [bestScoreId, setBestScoreId] = useState<string | null>(null);
  const [bestInput, setBestInput] = useState<string>("");

  const [status, setStatus] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  // redirect if not logged in
  useEffect(() => {
    if (!loading && !user) navigate({ to: "/auth" });
  }, [loading, user, navigate]);

  const load = async () => {
    if (!user) return;
    const { data: profile } = await supabase
      .from("profiles")
      .select("username, avatar_url")
      .eq("id", user.id)
      .maybeSingle();
    if (profile) {
      setUsername(profile.username ?? "");
      setAvatarUrl(profile.avatar_url ?? null);
    }
    const { data: top } = await supabase
      .from("scores")
      .select("id, score")
      .eq("user_id", user.id)
      .order("score", { ascending: false })
      .limit(1)
      .maybeSingle();
    setBestScore(top?.score ?? 0);
    setBestScoreId(top?.id ?? null);
    setBestInput(String(top?.score ?? 0));
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const saveUsername = async () => {
    if (!user) return;
    const trimmed = username.trim();
    if (trimmed.length < 2 || trimmed.length > 24) {
      setStatus("Нікнейм має бути від 2 до 24 символів");
      return;
    }
    setBusy(true);
    const { error } = await supabase
      .from("profiles")
      .update({ username: trimmed })
      .eq("id", user.id);
    setBusy(false);
    setStatus(error ? `Помилка: ${error.message}` : "Нікнейм оновлено");
  };

  const uploadAvatar = async (file: File) => {
    if (!user) return;
    if (file.size > 2 * 1024 * 1024) {
      setStatus("Файл завеликий (макс. 2 МБ)");
      return;
    }
    if (!file.type.startsWith("image/")) {
      setStatus("Це не зображення");
      return;
    }
    setBusy(true);
    const ext = file.name.split(".").pop()?.toLowerCase() || "png";
    const path = `${user.id}/avatar-${Date.now()}.${ext}`;
    const { error: upErr } = await supabase.storage
      .from("avatars")
      .upload(path, file, { upsert: true, contentType: file.type });
    if (upErr) {
      setBusy(false);
      setStatus(`Помилка завантаження: ${upErr.message}`);
      return;
    }
    const { data: pub } = supabase.storage.from("avatars").getPublicUrl(path);
    const url = pub.publicUrl;
    const { error: profErr } = await supabase
      .from("profiles")
      .update({ avatar_url: url })
      .eq("id", user.id);
    setBusy(false);
    if (profErr) {
      setStatus(`Помилка профілю: ${profErr.message}`);
    } else {
      setAvatarUrl(url);
      setStatus("Аватар оновлено");
    }
  };

  const saveBest = async () => {
    if (!user) return;
    const val = Math.max(0, Math.floor(Number(bestInput) || 0));
    setBusy(true);
    if (bestScoreId) {
      const { error } = await supabase
        .from("scores")
        .update({ score: val })
        .eq("id", bestScoreId);
      if (error) {
        setBusy(false);
        setStatus(`Помилка: ${error.message}`);
        return;
      }
    } else {
      const { error } = await supabase
        .from("scores")
        .insert({ user_id: user.id, score: val, duration_ms: 0 });
      if (error) {
        setBusy(false);
        setStatus(`Помилка: ${error.message}`);
        return;
      }
    }
    setBusy(false);
    setStatus("Рекорд оновлено");
    await load();
  };

  const resetBest = async () => {
    if (!user) return;
    if (!confirm("Видалити всі свої результати? Цю дію не можна скасувати.")) return;
    setBusy(true);
    const { error } = await supabase
      .from("scores")
      .delete()
      .eq("user_id", user.id);
    setBusy(false);
    if (error) {
      setStatus(`Помилка: ${error.message}`);
    } else {
      setStatus("Усі результати видалено");
      await load();
    }
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-bg text-slate-300 font-sans flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center text-slate-500 font-mono text-sm">
          Завантаження...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg text-slate-300 font-sans flex flex-col">
      <Navbar />
      <section className="px-6 md:px-8 py-20 max-w-3xl mx-auto w-full flex-1">
        <div className="inline-block px-3 py-1 rounded-full border border-primary/30 bg-primary/5 text-primary text-[10px] font-bold uppercase tracking-widest mb-6">
          Профіль
        </div>
        <h1 className="font-display text-5xl md:text-6xl font-bold text-white mb-12 leading-none">
          МІЙ <span className="text-primary text-glow">ПРОФІЛЬ</span>
        </h1>

        {status && (
          <p className="mb-6 text-sm font-mono text-primary">{status}</p>
        )}

        {/* Avatar */}
        <div className="bg-surface/40 border border-white/10 rounded-2xl p-6 mb-6 flex items-center gap-6">
          <div className="size-24 rounded-full overflow-hidden border-2 border-primary/40 bg-bg flex items-center justify-center neon-glow">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt="Аватар"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-primary font-display text-3xl font-bold">
                {(username || "?").slice(0, 1).toUpperCase()}
              </span>
            )}
          </div>
          <div className="flex-1">
            <p className="text-white font-bold mb-1">Аватар</p>
            <p className="text-xs text-slate-500 mb-3">PNG / JPG, до 2 МБ</p>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) uploadAvatar(f);
                e.target.value = "";
              }}
            />
            <button
              type="button"
              disabled={busy}
              onClick={() => fileRef.current?.click()}
              className="px-4 py-2 border border-primary/30 hover:border-primary/60 text-primary text-xs font-bold uppercase tracking-widest transition-all disabled:opacity-50"
            >
              Завантажити
            </button>
          </div>
        </div>

        {/* Username */}
        <div className="bg-surface/40 border border-white/10 rounded-2xl p-6 mb-6">
          <p className="text-white font-bold mb-3">Нікнейм</p>
          <div className="flex gap-3">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              maxLength={24}
              className="flex-1 bg-bg border border-white/10 focus:border-primary/50 rounded px-4 py-2 text-white outline-none font-mono"
            />
            <button
              type="button"
              disabled={busy}
              onClick={saveUsername}
              className="px-5 py-2 bg-primary text-bg font-bold uppercase tracking-widest text-xs transition-transform active:scale-95 disabled:opacity-50"
            >
              Зберегти
            </button>
          </div>
        </div>

        {/* Personal record */}
        <div className="bg-surface/40 border border-white/10 rounded-2xl p-6">
          <div className="flex items-baseline justify-between mb-3">
            <p className="text-white font-bold">Особистий рекорд</p>
            <p className="font-mono text-2xl text-primary text-glow">
              {bestScore.toLocaleString()}
            </p>
          </div>
          <p className="text-xs text-slate-500 mb-4">
            Зазвичай рекорд оновлюється автоматично після забігу. Тут можеш
            відкоригувати число вручну або скинути всі свої результати.
          </p>
          <div className="flex flex-wrap gap-3">
            <input
              type="number"
              min={0}
              value={bestInput}
              onChange={(e) => setBestInput(e.target.value)}
              className="w-40 bg-bg border border-white/10 focus:border-primary/50 rounded px-4 py-2 text-white outline-none font-mono"
            />
            <button
              type="button"
              disabled={busy}
              onClick={saveBest}
              className="px-5 py-2 bg-primary text-bg font-bold uppercase tracking-widest text-xs transition-transform active:scale-95 disabled:opacity-50"
            >
              Оновити рекорд
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={resetBest}
              className="px-5 py-2 border border-accent/30 hover:border-accent/60 text-accent font-bold uppercase tracking-widest text-xs transition-all disabled:opacity-50"
            >
              Скинути всі
            </button>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
