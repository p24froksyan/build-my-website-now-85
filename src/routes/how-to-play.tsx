import { createFileRoute, Link } from "@tanstack/react-router";
import { Navbar, Footer } from "@/components/Navbar";

export const Route = createFileRoute("/how-to-play")({
  component: HowToPlayPage,
  head: () => ({
    meta: [
      { title: "Як грати — NEO-DINO" },
      {
        name: "description",
        content:
          "Керування у NEO-DINO простіше нікуди: одна клавіша SPACE — стрибок. Дізнайся правила, поради та секрети високих результатів.",
      },
      { property: "og:title", content: "Як грати — NEO-DINO" },
      {
        property: "og:description",
        content: "Одна клавіша, нескінченний забіг. Опануй ритм NEO-DINO.",
      },
    ],
  }),
});

function HowToPlayPage() {
  return (
    <div className="min-h-screen bg-bg text-slate-300 font-sans flex flex-col">
      <Navbar />
      <section className="px-6 md:px-8 py-20 max-w-4xl mx-auto w-full flex-1">
        <div className="inline-block px-3 py-1 rounded-full border border-primary/30 bg-primary/5 text-primary text-[10px] font-bold uppercase tracking-widest mb-6">
          Інструкція
        </div>
        <h1 className="font-display text-5xl md:text-7xl font-bold text-white mb-8 leading-none">
          ЯК <span className="text-primary text-glow">ГРАТИ</span>
        </h1>
        <p className="text-slate-400 mb-10 max-w-2xl leading-relaxed">
          NEO-DINO — це нескінченний 3D-раннер. Твій герой біжить автоматично,
          перешкоди з’являються рандомно, а швидкість зростає з кожною секундою.
          Все, що від тебе потрібно — вчасно стрибати.
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="flex items-center gap-6 p-6 border border-primary/20 bg-primary/5 rounded-xl neon-glow">
            <div className="px-6 py-4 rounded bg-bg border border-primary/40 text-primary font-mono text-sm font-bold">
              SPACE
            </div>
            <div>
              <p className="text-white font-bold text-lg">Стрибок</p>
              <p className="text-sm text-slate-400 mt-1">
                Єдина клавіша керування. Натисни вчасно — і перешкода позаду.
              </p>
            </div>
          </div>

          <div className="p-6 border border-white/10 rounded-xl bg-surface/40">
            <p className="text-white font-bold mb-2">Як рахуються очки</p>
            <p className="text-sm text-slate-400">
              Очки нараховуються за час, проведений у забігу. Що довше тримаєшся
              — то вищий результат. Підсумок автоматично летить у глобальний
              рейтинг.
            </p>
          </div>

          <div className="p-6 border border-white/10 rounded-xl bg-surface/40">
            <p className="text-white font-bold mb-2">Поради новачкам</p>
            <ul className="text-sm text-slate-400 space-y-2 list-disc pl-5">
              <li>Не натискай SPACE надто рано — герой буде в повітрі довше.</li>
              <li>Слухай ритм: на високій швидкості реакція має бути миттєвою.</li>
              <li>Грай зосереджено — увімкни звук, відкинься у кріслі.</li>
            </ul>
          </div>

          <div className="p-6 border border-white/10 rounded-xl bg-surface/40">
            <p className="text-white font-bold mb-2">Збереження результату</p>
            <p className="text-sm text-slate-400">
              Щоб результат потрапив у топ — увійди у свій аккаунт. Без входу
              забіги залишаються анонімними.
            </p>
          </div>
        </div>

        <div className="mt-12 flex flex-wrap gap-4">
          <Link
            to="/play"
            className="px-8 py-3 bg-primary text-white font-bold uppercase tracking-tighter transition-transform active:scale-95 rounded-lg shadow"
          >
            ▶ Грати зараз
          </Link>
          <Link
            to="/leaderboard"
            className="px-8 py-3 border border-black/15 hover:border-primary/60 text-slate-400 font-bold uppercase tracking-tighter transition-all rounded-lg"
          >
            Дивитись рейтинг
          </Link>
        </div>
      </section>
      <Footer />
    </div>
  );
}
