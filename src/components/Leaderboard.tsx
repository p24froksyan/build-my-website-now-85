import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Row {
  id: string;
  score: number;
  user_id: string;
  created_at: string;
  username: string;
}

export function Leaderboard({ refreshKey = 0 }: { refreshKey?: number }) {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    // топ-результат на кожного гравця (беремо багато й дедуплікуємо клієнтом)
    const { data: scores } = await supabase
      .from("scores")
      .select("id, score, user_id, created_at")
      .order("score", { ascending: false })
      .limit(100);

    if (!scores) {
      setRows([]);
      setLoading(false);
      return;
    }

    const seen = new Set<string>();
    const top: Omit<Row, "username">[] = [];
    for (const s of scores) {
      if (seen.has(s.user_id)) continue;
      seen.add(s.user_id);
      top.push(s);
      if (top.length >= 10) break;
    }

    const ids = top.map((t) => t.user_id);
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, username")
      .in("id", ids);
    const nameMap = new Map(profiles?.map((p) => [p.id, p.username]) ?? []);

    setRows(
      top.map((t) => ({
        ...t,
        username: nameMap.get(t.user_id) ?? "ANON",
      })),
    );
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, [refreshKey]);

  // realtime: оновлюємось при кожному новому забігу
  useEffect(() => {
    const ch = supabase
      .channel("scores-feed")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "scores" },
        () => load(),
      )
      .subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
  }, []);

  return (
    <div className="bg-surface border border-white/10 rounded-2xl divide-y divide-white/5">
      {loading && rows.length === 0 ? (
        <div className="p-8 text-center text-slate-500 text-sm font-mono">
          Завантаження...
        </div>
      ) : rows.length === 0 ? (
        <div className="p-8 text-center text-slate-500 text-sm font-mono">
          Поки жодного забігу. Стань першим!
        </div>
      ) : (
        rows.map((row, i) => (
          <div key={row.id} className="flex items-center justify-between p-6">
            <div className="flex items-center gap-4">
              <span
                className={`font-mono font-bold w-8 ${
                  i === 0
                    ? "text-primary text-glow"
                    : i < 3
                      ? "text-secondary"
                      : "text-slate-500"
                }`}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="text-white font-medium">{row.username}</span>
            </div>
            <span className="text-white font-mono">
              {row.score.toLocaleString()}
            </span>
          </div>
        ))
      )}
    </div>
  );
}
