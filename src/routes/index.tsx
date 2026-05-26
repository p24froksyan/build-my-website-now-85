import { createFileRoute } from "@tanstack/react-router";
import gameCanvas from "@/assets/game-canvas.jpg";
import diagram from "@/assets/diagram.jpg";

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

const controls = [
  { key: "SPACE", title: "Стрибок / Старт", desc: "Перестрибуй кактуси та високі перешкоди" },
  { key: "SHIFT", title: "Ривок", desc: "Різке прискорення, щоб уникнути падаючих уламків" },
  { key: "↓", title: "Присідання", desc: "Пригнись під низько-літаючими птеродактилями" },
];

const features = [
  {
    color: "border-primary",
    title: "Справжнє 3D",
    desc: "Низькополігональна графіка з динамічним освітленням і кастомними шейдерами.",
  },
  {
    color: "border-secondary",
    title: "Глобальна таблиця лідерів",
    desc: "Синхронізуй свій рекорд миттєво та змагайся з гравцями з усього світу.",
  },
  {
    color: "border-accent",
    title: "Адаптивна складність",
    desc: "Щільність і швидкість перешкод залежать від твоїх попередніх результатів.",
  },
];

const leaderboard = [
  { rank: "01", name: "CYBER_PUNK_99", score: "45,201" },
  { rank: "02", name: "VOID_WALKER", score: "42,880" },
  { rank: "03", name: "GHOST_UNIT", score: "39,500" },
  { rank: "04", name: "PIXEL_REX", score: "36,142" },
  { rank: "05", name: "NEON_RUNNER", score: "33,007" },
];

function Index() {
  return (
    <div className="min-h-screen bg-bg text-slate-300 font-sans selection:bg-primary/30">
      {/* Navigation */}
      <nav className="border-b border-white/5 py-4 px-8 flex justify-between items-center sticky top-0 bg-bg/80 backdrop-blur-md z-50">
        <div className="flex items-center gap-2">
          <div className="size-8 bg-gradient-to-tr from-primary to-secondary rounded-lg" />
          <span className="font-display font-bold text-xl tracking-tighter text-white">
            NEO-DINO
          </span>
        </div>
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
        <button
          type="button"
          className="px-5 py-2 border border-primary/20 hover:border-primary/50 text-primary text-xs font-bold uppercase tracking-widest transition-all"
        >
          Увійти
        </button>
      </nav>

      {/* Hero */}
      <section className="pt-24 pb-12 px-8 flex flex-col items-center text-center">
        <div className="inline-block px-3 py-1 rounded-full border border-secondary/30 bg-secondary/5 text-secondary text-[10px] font-bold uppercase tracking-widest mb-6">
          Дипломний проект
        </div>
        <h1 className="font-display text-6xl md:text-8xl font-bold text-white mb-6 leading-none">
          ЕВОЛЮЦІЯ АБО <span className="text-primary text-glow">ЗНИКНЕННЯ</span>
        </h1>
        <p className="max-w-xl text-lg text-slate-400 mb-10">
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
        <div className="max-w-6xl mx-auto">
          <div className="relative aspect-video w-full bg-surface border border-white/10 rounded-2xl overflow-hidden neon-glow group">
            <img
              src={gameCanvas}
              alt="Превʼю 3D-сцени гри NEO-DINO"
              width={1920}
              height={1088}
              className="w-full h-full object-cover opacity-80"
            />
            <div className="absolute top-4 left-4 px-3 py-1 bg-bg/70 backdrop-blur border border-primary/20 text-primary font-mono text-xs">
              SCORE 00542
            </div>
            <div className="absolute inset-0 flex items-center justify-center bg-bg/30 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                type="button"
                className="size-20 bg-white text-bg rounded-full flex items-center justify-center font-bold uppercase text-xs tracking-widest"
              >
                Грати
              </button>
            </div>
          </div>
          <p className="mt-4 text-center text-xs uppercase tracking-widest text-slate-600 font-mono">
            Натисни SPACE щоб стрибнути · ігровий рушій підключається окремо
          </p>
        </div>
      </section>

      {/* Controls & Features */}
      <section id="how-to-play" className="px-8 py-24 bg-surface/30">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16">
          <div>
            <h2 className="font-display text-3xl font-bold text-white mb-8">
              ЯК ГРАТИ
            </h2>
            <div className="grid gap-4">
              {controls.map((c) => (
                <div
                  key={c.key}
                  className="flex items-center gap-6 p-4 border border-white/5 bg-white/5 rounded-xl"
                >
                  <div className="size-12 rounded bg-bg flex items-center justify-center border border-primary/20 text-primary font-mono text-xs">
                    {c.key}
                  </div>
                  <div>
                    <p className="text-white font-bold">{c.title}</p>
                    <p className="text-xs text-slate-500">{c.desc}</p>
                  </div>
                </div>
              ))}
            </div>
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
      <section id="leaderboard" className="px-8 py-24">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display text-4xl font-bold text-white">
              ТОП ГРАВЦІВ
            </h2>
            <p className="text-primary text-xs uppercase tracking-widest mt-2">
              Сезон 01 / Альфа-фаза
            </p>
          </div>

          <div className="bg-surface border border-white/10 rounded-2xl divide-y divide-white/5">
            {leaderboard.map((row, i) => (
              <div
                key={row.rank}
                className={`flex items-center justify-between p-6 ${
                  i === 0 ? "" : ""
                }`}
              >
                <div className="flex items-center gap-4">
                  <span
                    className={`font-mono font-bold ${
                      i === 0 ? "text-primary" : "text-slate-500"
                    }`}
                  >
                    {row.rank}
                  </span>
                  <span className="text-white font-medium">{row.name}</span>
                </div>
                <span className="text-white font-mono">{row.score}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="px-8 py-24 bg-surface">
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
      <footer className="border-t border-white/5 px-8 py-12">
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
          <div className="flex gap-6 text-xs uppercase tracking-widest text-slate-500">
            <a href="#" className="hover:text-primary">
              GitHub
            </a>
            <a href="#" className="hover:text-primary">
              Docs
            </a>
            <a href="#" className="hover:text-primary">
              Контакт
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
