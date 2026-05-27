import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import diagram from "@/assets/diagram.jpg";
import { GameFrame } from "@/components/GameFrame";
import { Navbar, Footer } from "@/components/Navbar";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "NEO-DINO — 3D Браузерна гра | Дипломний проект" },
      {
        name: "description",
        content:
          "NEO-DINO — переосмислення класичного Google-динозавра у форматі 3D. Грайте в браузері, ставте рекорди та змагайтеся з іншими гравцями.",
      },
      { property: "og:title", content: "NEO-DINO — 3D Браузерна гра" },
      {
        property: "og:description",
        content:
          "3D-раннер прямо в браузері. Одна клавіша, нескінченний забіг, глобальний рейтинг.",
      },
    ],
  }),
});

function Index() {
  const [, setRefreshKey] = useState(0);

  return (
    <div className="min-h-screen bg-bg text-slate-300 font-sans selection:bg-primary/30 flex flex-col">
      <Navbar />

      {/* Hero */}
      <section className="pt-20 pb-12 px-6 md:px-8 flex flex-col items-center text-center">
        <div className="inline-block px-3 py-1 rounded-full border border-secondary/30 bg-secondary/5 text-secondary text-[10px] font-bold uppercase tracking-widest mb-6">
          Дипломний проект
        </div>
        <h1 className="font-display text-5xl md:text-8xl font-bold text-white mb-6 leading-none">
          ЕВОЛЮЦІЯ АБО <span className="text-primary text-glow">ЗНИКНЕННЯ</span>
        </h1>
        <p className="max-w-xl text-base md:text-lg text-slate-400 mb-10">
          Класичний раннер у новому 3D-вимірі. Створено на Three.js для безшовного
          ігрового досвіду прямо в браузері.
        </p>
        <a
          href="#game"
          className="group relative px-10 py-4 bg-primary text-bg font-bold uppercase tracking-tighter text-xl transition-transform active:scale-95"
        >
          <span className="relative z-10">Почати забіг</span>
          <div className="absolute inset-0 bg-primary blur-xl opacity-20 group-hover:opacity-40 transition-opacity" />
        </a>
      </section>

      {/* Game embed */}
      <section id="game" className="px-4 md:px-8 py-12">
        <GameFrame onScoreSaved={() => setRefreshKey((k) => k + 1)} />
      </section>

      {/* Quick links to other pages */}
      <section className="px-6 md:px-8 py-16 bg-surface/30">
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6">
          <Link
            to="/how-to-play"
            className="group p-6 border border-primary/20 hover:border-primary/60 rounded-xl bg-bg/40 transition-all"
          >
            <p className="text-[10px] uppercase tracking-widest text-primary mb-2">
              01
            </p>
            <h3 className="font-display text-2xl text-white font-bold mb-2 group-hover:text-primary transition-colors">
              Як грати
            </h3>
            <p className="text-sm text-slate-400">
              Керування, правила та поради для високих результатів.
            </p>
          </Link>
          <Link
            to="/features"
            className="group p-6 border border-secondary/20 hover:border-secondary/60 rounded-xl bg-bg/40 transition-all"
          >
            <p className="text-[10px] uppercase tracking-widest text-secondary mb-2">
              02
            </p>
            <h3 className="font-display text-2xl text-white font-bold mb-2 group-hover:text-secondary transition-colors">
              Ключові особливості
            </h3>
            <p className="text-sm text-slate-400">
              3D у браузері, realtime-рейтинг, мінімалістичне керування.
            </p>
          </Link>
          <Link
            to="/leaderboard"
            className="group p-6 border border-accent/20 hover:border-accent/60 rounded-xl bg-bg/40 transition-all"
          >
            <p className="text-[10px] uppercase tracking-widest text-accent mb-2">
              03
            </p>
            <h3 className="font-display text-2xl text-white font-bold mb-2 group-hover:text-accent transition-colors">
              Топ гравців
            </h3>
            <p className="text-sm text-slate-400">
              Глобальний рейтинг, що оновлюється у реальному часі.
            </p>
          </Link>
        </div>
      </section>

      {/* About */}
      <section id="about" className="px-6 md:px-8 py-24 bg-surface">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-16 items-center">
          <div className="md:w-1/2">
            <img
              src={diagram}
              alt="Схема архітектури 3D ігрового рушія"
              width={896}
              height={672}
              loading="lazy"
              className="w-full aspect-4/3 object-cover bg-bg border border-white/5 rounded-2xl"
            />
          </div>
          <div className="md:w-1/2">
            <h2 className="font-display text-4xl font-bold text-white mb-6">
              ПРО ПРОЕКТ
            </h2>
            <p className="text-slate-400 mb-6 leading-relaxed">
              NEO-DINO — це дипломна робота, що демонструє можливості сучасних
              браузерів у створенні повноцінних 3D-ігор без сторонніх плагінів.
              Сайт виконано як вітрину для гри, реалізованої окремо моїм колегою.
            </p>
            <div className="space-y-4">
              <div className="flex justify-between text-xs border-b border-white/10 pb-2">
                <span className="text-slate-500">Розробник сайту</span>
                <span className="text-white">Дипломний проект</span>
              </div>
              <div className="flex justify-between text-xs border-b border-white/10 pb-2">
                <span className="text-slate-500">Розробник гри</span>
                <span className="text-white">Командний партнер</span>
              </div>
              <div className="flex justify-between text-xs border-b border-white/10 pb-2">
                <span className="text-slate-500">Технології</span>
                <span className="text-white">React · TanStack · Three.js</span>
              </div>
              <div className="flex justify-between text-xs border-b border-white/10 pb-2">
                <span className="text-slate-500">Рік</span>
                <span className="text-white">2026</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
