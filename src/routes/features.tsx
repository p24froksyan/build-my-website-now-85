import { createFileRoute, Link } from "@tanstack/react-router";
import { Navbar, Footer } from "@/components/Navbar";

export const Route = createFileRoute("/features")({
  component: FeaturesPage,
  head: () => ({
    meta: [
      { title: "Ключові особливості — NEO-DINO" },
      {
        name: "description",
        content:
          "Справжнє 3D у браузері, глобальний рейтинг, миттєвий старт без завантажень. Дізнайся, чим NEO-DINO відрізняється від класики.",
      },
      { property: "og:title", content: "Ключові особливості — NEO-DINO" },
      {
        property: "og:description",
        content: "3D-раннер у браузері з глобальним рейтингом і одним керуванням.",
      },
    ],
  }),
});

const features = [
  {
    color: "border-primary",
    glow: "shadow-[0_0_40px_-10px_var(--color-primary)]",
    title: "Справжнє 3D",
    desc: "Низькополігональна графіка з динамічним освітленням і кастомними GLSL-шейдерами. Працює на Three.js без плагінів.",
  },
  {
    color: "border-secondary",
    glow: "",
    title: "Глобальна таблиця лідерів",
    desc: "Кожен забіг моментально потрапляє в загальний рейтинг через realtime-канал. Топ оновлюється у тебе на екрані без перезавантажень.",
  },
  {
    color: "border-accent",
    glow: "",
    title: "Одна клавіша",
    desc: "Тільки SPACE — стрибок. Жодних інструкцій на 10 хвилин: відкрив, побіг, поставив рекорд.",
  },
  {
    color: "border-primary",
    glow: "",
    title: "Миттєвий старт",
    desc: "Гра завантажується прямо в браузері. Жодних інсталяцій, акаунтів сторонніх сервісів чи лаунчерів.",
  },
  {
    color: "border-secondary",
    glow: "",
    title: "Зростаюча складність",
    desc: "Швидкість, ритм перешкод і навіть освітлення сцени змінюються з часом. Чим довше ти граєш — тим важче триматись у грі.",
  },
  {
    color: "border-accent",
    glow: "",
    title: "Особистий профіль",
    desc: "Свій нікнейм, аватарка та персональний рекорд. Все зберігається у твоєму обліковому записі та видно у топі.",
  },
];

function FeaturesPage() {
  return (
    <div className="min-h-screen bg-bg text-slate-300 font-sans flex flex-col">
      <Navbar />
      <section className="px-6 md:px-8 py-20 max-w-6xl mx-auto w-full flex-1">
        <div className="inline-block px-3 py-1 rounded-full border border-secondary/30 bg-secondary/5 text-secondary text-[10px] font-bold uppercase tracking-widest mb-6">
          Можливості
        </div>
        <h1 className="font-display text-5xl md:text-7xl font-bold text-white mb-12 leading-none">
          КЛЮЧОВІ <span className="text-secondary text-glow-magenta">ОСОБЛИВОСТІ</span>
        </h1>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => (
            <div
              key={f.title}
              className={`border-l-2 ${f.color} ${f.glow} p-6 bg-surface/40 rounded-r-xl`}
            >
              <h3 className="text-white font-bold text-lg">{f.title}</h3>
              <p className="text-sm text-slate-400 mt-2 leading-relaxed">
                {f.desc}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-wrap gap-4">
          <Link
            to="/"
            className="px-8 py-3 bg-primary text-bg font-bold uppercase tracking-tighter transition-transform active:scale-95"
          >
            ▶ Спробувати
          </Link>
          <Link
            to="/how-to-play"
            className="px-8 py-3 border border-white/10 hover:border-primary/40 text-slate-300 font-bold uppercase tracking-tighter transition-all"
          >
            Як грати
          </Link>
        </div>
      </section>
      <Footer />
    </div>
  );
}
