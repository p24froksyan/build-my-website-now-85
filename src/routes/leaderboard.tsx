import { createFileRoute, Link } from "@tanstack/react-router";
import { Navbar, Footer } from "@/components/Navbar";
import { Leaderboard } from "@/components/Leaderboard";

export const Route = createFileRoute("/leaderboard")({
  component: LeaderboardPage,
  head: () => ({
    meta: [
      { title: "Топ гравців — NEO-DINO" },
      {
        name: "description",
        content:
          "Глобальний рейтинг NEO-DINO. Найкращі результати оновлюються миттєво після кожного забігу.",
      },
      { property: "og:title", content: "Топ гравців — NEO-DINO" },
      {
        property: "og:description",
        content: "Подивись, хто тримає найвищі очки у 3D-раннері NEO-DINO.",
      },
    ],
  }),
});

function LeaderboardPage() {
  return (
    <div className="min-h-screen bg-bg text-slate-300 font-sans flex flex-col">
      <Navbar />
      <section className="px-6 md:px-8 py-20 max-w-3xl mx-auto w-full flex-1">
        <div className="text-center mb-12">
          <div className="inline-block px-3 py-1 rounded-full border border-accent/30 bg-accent/5 text-accent text-[10px] font-bold uppercase tracking-widest mb-6">
            Глобальний рейтинг
          </div>
          <h1 className="font-display text-5xl md:text-7xl font-bold text-white leading-none">
            ТОП <span className="text-accent text-glow-magenta">ГРАВЦІВ</span>
          </h1>
          <p className="text-primary text-xs uppercase tracking-widest mt-4">
            Оновлюється у реальному часі після кожного забігу
          </p>
        </div>

        <Leaderboard />

        <div className="mt-12 flex justify-center">
          <Link
            to="/"
            className="px-8 py-3 bg-primary text-bg font-bold uppercase tracking-tighter transition-transform active:scale-95"
          >
            ▶ Зробити свій забіг
          </Link>
        </div>
      </section>
      <Footer />
    </div>
  );
}
