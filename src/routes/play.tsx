import { createFileRoute } from "@tanstack/react-router";
import { Navbar, Footer } from "@/components/Navbar";
import { GameFrame } from "@/components/GameFrame";

export const Route = createFileRoute("/play")({
  component: PlayPage,
  head: () => ({
    meta: [
      { title: "Грати — DINO 3D" },
      {
        name: "description",
        content:
          "Запусти 3D-версію класичного динозаврика прямо в браузері. Одна клавіша — нескінченний забіг.",
      },
      { property: "og:title", content: "Грати — DINO 3D" },
      {
        property: "og:description",
        content: "3D-раннер у браузері. Стрибай, виживай, ставай у топ.",
      },
    ],
  }),
});

function PlayPage() {
  return (
    <div className="min-h-screen text-slate-300 font-sans flex flex-col">
      <Navbar />
      <section className="px-4 md:px-8 pt-16 pb-8 max-w-6xl mx-auto w-full text-center">
        <div className="inline-block px-3 py-1 rounded-full border border-primary/40 bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest mb-6">
          Гра
        </div>
        <h1 className="font-display text-5xl md:text-7xl font-bold text-white mb-4 leading-none">
          DINO <span className="text-primary text-glow">3D</span>
        </h1>
        <p className="text-slate-500 max-w-xl mx-auto mb-8">
          Натисни «Грати», вчасно тисни SPACE — і твій результат автоматично
          потрапить у профіль та глобальний рейтинг.
        </p>
      </section>
      <section className="px-4 md:px-8 pb-16 flex-1">
        <GameFrame />
      </section>
      <Footer />
    </div>
  );
}
