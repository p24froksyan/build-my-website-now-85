import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Navbar, Footer } from "@/components/Navbar";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/profile")({
  component: ProfilePage,
  head: () => ({
    meta: [
      { title: "Мій профіль — DINO 3D" },
      {
        name: "description",
        content:
          "Особистий профіль гравця DINO 3D: аватар, нікнейм і персональний рекорд.",
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

  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [status, setStatus] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

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
      .select("score")
      .eq("user_id", user.id)
      .order("score", { ascending: false })
      .limit(1)
      .maybeSingle();
    setBestScore(top?.score ?? 0);
    setNewEmail(user.email ?? "");
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  // realtime: рекорд оновлюється сам після забігу
  useEffect(() => {
    if (!user) return;
    const ch = supabase
      .channel(`profile-scores-${user.id}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "scores", filter: `user_id=eq.${user.id}` },
        (payload) => {
          const s = (payload.new as { score?: number })?.score ?? 0;
          if (s > bestScore) setBestScore(s);
        },
      )
      .subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
  }, [user, bestScore]);

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

  const deleteAvatar = async () => {
    if (!user || !avatarUrl) return;
    if (!confirm("Видалити аватарку?")) return;
    setBusy(true);
    // Витягуємо шлях з URL виду .../avatars/<user_id>/<file>
    try {
      const marker = "/avatars/";
      const i = avatarUrl.indexOf(marker);
      if (i !== -1) {
        const path = avatarUrl.slice(i + marker.length);
        await supabase.storage.from("avatars").remove([path]);
      }
    } catch {
      // ignore — навіть якщо не видалили файл, профіль очистимо
    }
    const { error } = await supabase
      .from("profiles")
      .update({ avatar_url: null })
      .eq("id", user.id);
    setBusy(false);
    if (error) {
      setStatus(`Помилка: ${error.message}`);
    } else {
      setAvatarUrl(null);
      setStatus("Аватар видалено");
    }
  };

  const changeEmail = async () => {
    const email = newEmail.trim();
    if (!email || email === user?.email) {
      setStatus("Введи нову адресу email");
      return;
    }
    setBusy(true);
    const { error } = await supabase.auth.updateUser({ email });
    setBusy(false);
    setStatus(
      error
        ? `Помилка: ${error.message}`
        : "На нову адресу надіслано лист для підтвердження",
    );
  };

  const changePassword = async () => {
    if (newPassword.length < 6) {
      setStatus("Пароль має містити мінімум 6 символів");
      return;
    }
    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setBusy(false);
    if (error) {
      setStatus(`Помилка: ${error.message}`);
    } else {
      setNewPassword("");
      setStatus("Пароль оновлено");
    }
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen text-slate-300 font-sans flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center text-slate-500 font-mono text-sm">
          Завантаження...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-slate-300 font-sans flex flex-col">
      <Navbar />
      <section className="px-6 md:px-8 py-20 max-w-3xl mx-auto w-full flex-1">
        <div className="inline-block px-3 py-1 rounded-full border border-primary/40 bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest mb-6">
          Профіль
        </div>
        <h1 className="font-display text-5xl md:text-6xl font-bold text-white mb-12 leading-none">
          МІЙ <span className="text-primary text-glow">ПРОФІЛЬ</span>
        </h1>

        {status && (
          <p className="mb-6 text-sm font-mono text-primary">{status}</p>
        )}

        {/* Avatar */}
        <div className="bg-surface/60 border border-black/15 rounded-2xl p-6 mb-6 flex items-center gap-6">
          <div className="size-24 rounded-full overflow-hidden border-2 border-primary/50 bg-bg flex items-center justify-center neon-glow">
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
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                disabled={busy}
                onClick={() => fileRef.current?.click()}
                className="px-4 py-2 border border-primary/40 hover:border-primary/70 text-primary text-xs font-bold uppercase tracking-widest transition-all disabled:opacity-50 rounded"
              >
                Завантажити
              </button>
              {avatarUrl && (
                <button
                  type="button"
                  disabled={busy}
                  onClick={deleteAvatar}
                  className="px-4 py-2 border border-accent/40 hover:border-accent/70 text-accent text-xs font-bold uppercase tracking-widest transition-all disabled:opacity-50 rounded"
                >
                  Видалити
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Username */}
        <div className="bg-surface/60 border border-black/15 rounded-2xl p-6 mb-6">
          <p className="text-white font-bold mb-3">Нікнейм</p>
          <div className="flex gap-3">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              maxLength={24}
              className="flex-1 bg-[color:var(--color-bg)]/40 border border-black/15 focus:border-primary/60 rounded px-4 py-2 text-white outline-none font-mono"
            />
            <button
              type="button"
              disabled={busy}
              onClick={saveUsername}
              className="px-5 py-2 bg-primary text-white font-bold uppercase tracking-widest text-xs transition-transform active:scale-95 disabled:opacity-50 rounded"
            >
              Зберегти
            </button>
          </div>
        </div>

        {/* Personal record (auto) */}
        <div className="bg-surface/60 border border-black/15 rounded-2xl p-6 mb-6">
          <div className="flex items-baseline justify-between mb-3">
            <p className="text-white font-bold">Особистий рекорд</p>
            <p className="font-mono text-3xl text-primary text-glow">
              {bestScore.toLocaleString()}
            </p>
          </div>
          <p className="text-xs text-slate-500">
            Оновлюється автоматично після кожного забігу.
          </p>
        </div>

        {/* Email */}
        <div className="bg-surface/60 border border-black/15 rounded-2xl p-6 mb-6">
          <p className="text-white font-bold mb-1">Email</p>
          <p className="text-xs text-slate-500 mb-3">
            Поточний: <span className="font-mono">{user.email}</span>
          </p>
          <div className="flex flex-wrap gap-3">
            <input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              className="flex-1 min-w-[200px] bg-[color:var(--color-bg)]/40 border border-black/15 focus:border-primary/60 rounded px-4 py-2 text-white outline-none font-mono"
            />
            <button
              type="button"
              disabled={busy}
              onClick={changeEmail}
              className="px-5 py-2 bg-primary text-white font-bold uppercase tracking-widest text-xs transition-transform active:scale-95 disabled:opacity-50 rounded"
            >
              Змінити email
            </button>
          </div>
        </div>

        {/* Password */}
        <div className="bg-surface/60 border border-black/15 rounded-2xl p-6">
          <p className="text-white font-bold mb-3">Новий пароль</p>
          <div className="flex flex-wrap gap-3">
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              minLength={6}
              placeholder="••••••••"
              className="flex-1 min-w-[200px] bg-[color:var(--color-bg)]/40 border border-black/15 focus:border-primary/60 rounded px-4 py-2 text-white outline-none font-mono"
            />
            <button
              type="button"
              disabled={busy}
              onClick={changePassword}
              className="px-5 py-2 bg-primary text-white font-bold uppercase tracking-widest text-xs transition-transform active:scale-95 disabled:opacity-50 rounded"
            >
              Змінити пароль
            </button>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
