import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import gameCanvas from "@/assets/game-canvas.jpg";

// URL до гри: розмісти білд гри у /public/game/index.html
// АБО зміни константу нижче на повну URL (наприклад, на itch.io / GitHub Pages).
// Гра має надсилати postMessage у форматі:
//   { type: "neo-dino-score", score: number, duration_ms?: number }
const GAME_URL = "/game/index.html";

export function GameFrame({ onScoreSaved }: { onScoreSaved?: () => void }) {
  const { user } = useAuth();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [started, setStarted] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [gameAvailable, setGameAvailable] = useState<boolean | null>(null);

  // Перевіряємо чи завантажена гра
  useEffect(() => {
    fetch(GAME_URL, { method: "HEAD" })
      .then((r) => setGameAvailable(r.ok))
      .catch(() => setGameAvailable(false));
  }, []);

  useEffect(() => {
    const handler = async (e: MessageEvent) => {
      const data = e.data;
      if (!data || typeof data !== "object" || data.type !== "neo-dino-score")
        return;
      const score = Math.max(0, Math.floor(Number(data.score) || 0));
      const duration_ms = Math.max(0, Math.floor(Number(data.duration_ms) || 0));

      if (!user) {
        setStatus(`Забіг: ${score} очок. Увійди, щоб зберегти результат.`);
        return;
      }
      setStatus("Збереження результату...");
      const { error } = await supabase
        .from("scores")
        .insert({ user_id: user.id, score, duration_ms });
      if (error) {
        setStatus(`Помилка: ${error.message}`);
      } else {
        setStatus(`Результат збережено: ${score} очок`);
        onScoreSaved?.();
      }
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, [user, onScoreSaved]);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="relative aspect-video w-full bg-surface border border-white/10 rounded-2xl overflow-hidden neon-glow">
        {started && gameAvailable ? (
          <iframe
            ref={iframeRef}
            src={GAME_URL}
            title="NEO-DINO 3D game"
            className="w-full h-full"
            allow="autoplay; fullscreen; gamepad"
          />
        ) : (
          <>
            <img
              src={gameCanvas}
              alt="Превʼю 3D-сцени гри NEO-DINO"
              width={1920}
              height={1088}
              className="w-full h-full object-cover opacity-50"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-bg/60 backdrop-blur-sm gap-4">
              {gameAvailable === false ? (
                <div className="text-center max-w-md px-6">
                  <p className="text-accent font-bold uppercase tracking-widest text-sm mb-3">
                    Гру ще не підключено
                  </p>
                  <p className="text-xs text-slate-400 leading-relaxed font-mono">
                    Помісти білд гри у папку{" "}
                    <code className="text-primary">public/game/</code> (точка входу{" "}
                    <code className="text-primary">index.html</code>). Гра має
                    надсилати очки через{" "}
                    <code className="text-primary">
                      postMessage({"{type:'neo-dino-score', score}"})
                    </code>
                    .
                  </p>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setStarted(true)}
                  className="px-10 py-4 bg-primary text-bg font-bold uppercase tracking-tighter text-xl transition-transform active:scale-95 hover:scale-105"
                >
                  ▶ Грати
                </button>
              )}
              {!user && gameAvailable !== false && (
                <p className="text-xs text-slate-500 uppercase tracking-widest font-mono">
                  Увійди, щоб зберігати рекорди
                </p>
              )}
            </div>
          </>
        )}
        <div className="absolute top-4 left-4 px-3 py-1 bg-bg/70 backdrop-blur border border-primary/20 text-primary font-mono text-xs">
          NEO-DINO
        </div>
      </div>
      {status && (
        <p className="mt-4 text-center text-sm font-mono text-primary">{status}</p>
      )}
      <p className="mt-4 text-center text-xs uppercase tracking-widest text-slate-600 font-mono">
        Керування: SPACE — стрибок
      </p>
    </div>
  );
}
