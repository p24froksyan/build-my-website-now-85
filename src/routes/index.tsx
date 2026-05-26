import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import diagram from "@/assets/diagram.jpg";
import { GameFrame } from "@/components/GameFrame";
import { Leaderboard } from "@/components/Leaderboard";
import { useAuth } from "@/hooks/use-auth";

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
    ],
  }),
});

const features = [
  {
    color: "border-primary",
    title: "Справжнє 3D",
    desc: "Низькополігональна графіка з динамічним освітленням і кастомними шейдерами.",
  },
  {
    color: "border-secondary",
    title: "Глобальна таблиця лідерів",
    desc: "Твій результат миттєво потрапляє в топ після кожного забігу.",
  },
  {
    color: "border-accent",
    title: "Одна клавіша",
    desc: "Тільки SPACE — стрибок. Реакція вирішує все.",
  },
];

function Index() {
  const { user, username, signOut, loading } = useAuth();
  const navigate = useNavigate();
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div className="min-h-screen bg-bg text-slate-300 font-sans selection:bg-primary/30">
      {/* Navigation */}
      <nav className="border-b border-white/5 py-4 px-6 md:px-8 flex justify-between items-center sticky top-0 bg-bg/80 backdrop-blur-md z-50">
        <Link to="/" className="flex items-center gap-2">
          <div className="size-8 bg-gradient-to-tr from-primary to-secondary rounded-lg" />
          <span className="font-display font-bold text-xl tracking-tighter text-white">
            NEO-DINO
          </span>
        </Link>
        <div className="hidden md:flex gap-8 text-xs font-medium uppercase tracking-widest">
          <a href="#game" className="hover:text-primary transition-colors">
            Гра
          </a>
          <a href="#how-to-play" className="hover:text-primary transition-colors">
            Керування
          </a>
          <a href="#leaderboard" className="hover:text-primary transition-colors">
            Рейтинг
          </a>
          <a href="#about" className="hover:text-primary transition-colors">
            Проект
          </a>
        </div>
        {loading ? (
          <div className="w-20 h-8" />
        ) : user ? (
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline text-primary font-mono text-xs uppercase tracking-widest">
              {username ?? "..."}
            </span>
            <button
              type="button"
              onClick={signOut}
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

      {/* Controls & Features */}
      <section id="how-to-play" className="px-6 md:px-8 py-24 bg-surface/30">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16">
          <div>
            <h2 className="font-display text-3xl font-bold text-white mb-8">
              ЯК ГРАТИ
            </h2>
            <div className="flex items-center gap-6 p-6 border border-primary/20 bg-primary/5 rounded-xl neon-glow">
              <div className="px-6 py-4 rounded bg-bg border border-primary/40 text-primary font-mono text-sm font-bold">
                SPACE
              </div>
              <div>
                <p className="text-white font-bold text-lg">Стрибок</p>
                <p className="text-sm text-slate-400 mt-1">
                  Єдина клавіша керування. Натисни, щоб перестрибнути перешкоду.
                  Розрахуй момент — і твій результат опиниться у топі.
                </p>
              </div>
            </div>
            <p className="mt-4 text-xs text-slate-500 font-mono uppercase tracking-widest">
              Авто-біг · нескінченні перешкоди · реакція вирішує все
            </p>
          </div>

          <div>
            <h2 className="font-display text-3xl font-bold text-white mb-8">
              КЛЮЧОВІ ОСОБЛИВОСТІ
            </h2>
            <div className="space-y-6">
              {features.map((f) => (
                <div key={f.title} className={`border-l-2 ${f.color} pl-6`}>
                  <h3 className="text-white font-bold">{f.title}</h3>
                  <p className="text-sm text-slate-500 mt-1">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Leaderboard */}
      <section id="leaderboard" className="px-6 md:px-8 py-24">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display text-4xl font-bold text-white">
              ТОП ГРАВЦІВ
            </h2>
            <p className="text-primary text-xs uppercase tracking-widest mt-2">
              Оновлюється після кожного забігу
            </p>
          </div>
          <Leaderboard refreshKey={refreshKey} />
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

      {/* Footer */}
      <footer className="border-t border-white/5 px-6 md:px-8 py-12">
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
    </div>
  );
}
