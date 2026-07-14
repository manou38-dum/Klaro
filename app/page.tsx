import Link from "next/link";
import { Lock, Sparkles, ArrowRight } from "lucide-react";
import { SignedIn, UserButton } from "@clerk/nextjs";

const CONTEXTS = [
  {
    id: "comerage",
    label: "Comérage",
    icon: "☕",
    gradient: "from-pink-500 to-rose-500",
    description: "Ragots & dynamiques",
    featured: true
  },
  {
    id: "pro",
    label: "Pro",
    icon: "💼",
    gradient: "from-sky-500 to-indigo-500",
    description: "Réunions & management"
  },
  {
    id: "familial",
    label: "Famille",
    icon: "🏠",
    gradient: "from-amber-500 to-orange-500",
    description: "Couple & fratrie"
  },
  {
    id: "ami",
    label: "Amis",
    icon: "🎉",
    gradient: "from-emerald-500 to-teal-500",
    description: "Soirées & sorties"
  },
  {
    id: "social",
    label: "Social",
    icon: "🌍",
    gradient: "from-fuchsia-500 to-purple-500",
    description: "Voisins & inconnus"
  }
];

const STEPS = [
  { num: "01", title: "Choisis", desc: "Ton contexte", bg: "bg-amber-300" },
  { num: "02", title: "Raconte", desc: "Une scène précise", bg: "bg-sky-300" },
  { num: "03", title: "Décrypte", desc: "En 30 secondes", bg: "bg-rose-300" }
];

const TESTIMONIALS = [
  { name: "Léa", mode: "Comérage", text: "L'IA a vraiment capté les dynamiques. C'est drôle et direct !", bg: "bg-rose-200" },
  { name: "Marc", mode: "Pro", text: "Super pour comprendre mon boss. Analyses pertinentes.", bg: "bg-sky-200" },
  { name: "Sophie", mode: "Famille", text: "M'a aidée à comprendre ma sœur. Je recommande !", bg: "bg-amber-200" }
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] text-neutral-900 pb-20 font-sans">
      {/* Header compact */}
      <header className="sticky top-0 z-50 bg-[#FAFAFA]/90 backdrop-blur-md border-b-2 border-neutral-900">
        <div className="max-w-md mx-auto px-4 py-3 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-neutral-900 rounded-lg flex items-center justify-center text-[#FAFAFA] font-black text-lg shadow-[3px_3px_0_0_theme(colors.rose.400)]">
              K
            </div>
            <span className="text-xl font-black tracking-tight">Klaro</span>
          </Link>

          <div className="flex items-center gap-3">
            <SignedIn>
              <Link
                href="/dashboard"
                className="text-xs font-black uppercase tracking-wide px-3 py-1.5 border-2 border-neutral-900 rounded-lg bg-amber-300 shadow-[2px_2px_0_0_theme(colors.neutral.900)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0_0_theme(colors.neutral.900)] transition-all"
              >
                Espace
              </Link>
            </SignedIn>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-md mx-auto px-4 pt-8 pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-rose-300 border-2 border-neutral-900 rounded-full text-neutral-900 text-xs font-black uppercase tracking-wide mb-5 shadow-[3px_3px_0_0_theme(colors.neutral.900)]">
          <Sparkles className="w-3.5 h-3.5" />
          Nouveau : Mode Comérage
        </div>

        <h1 className="text-[2.75rem] leading-[0.95] font-black tracking-tight text-balance mb-4">
          Décrypte{" "}
          <span className="italic underline decoration-4 decoration-rose-400 underline-offset-4">
            les gens
          </span>{" "}
          en 30 secondes
        </h1>

        <p className="text-base text-neutral-600 font-medium leading-relaxed mb-5 text-pretty">
          Raconte une scène, laisse l&apos;IA lire entre les lignes. Analyse
          comportementale, honnête et un brin cash.
        </p>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/modes/comerage"
            className="inline-flex items-center gap-2 px-5 py-3 bg-neutral-900 text-[#FAFAFA] font-black uppercase text-sm tracking-wide rounded-xl border-2 border-neutral-900 shadow-[4px_4px_0_0_theme(colors.rose.400)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_theme(colors.rose.400)] transition-all active:scale-95"
          >
            Commencer
            <ArrowRight className="w-4 h-4" />
          </Link>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-200 border-2 border-neutral-900 rounded-full text-emerald-900 text-[11px] font-black uppercase tracking-wide">
            <Lock className="w-3 h-3" />
            100% Anonyme
          </span>
        </div>
      </section>

      {/* Comment ça marche */}
      <section className="max-w-md mx-auto px-4 mb-8">
        <h2 className="text-2xl font-black tracking-tight mb-4">Comment ça marche</h2>

        <div className="space-y-3">
          {STEPS.map((step) => (
            <div
              key={step.num}
              className={`flex items-center gap-4 ${step.bg} border-2 border-neutral-900 rounded-2xl p-4 shadow-[4px_4px_0_0_theme(colors.neutral.900)]`}
            >
              <div className="flex-shrink-0 text-3xl font-black tabular-nums tracking-tighter">
                {step.num}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-black leading-tight">{step.title}</h3>
                <p className="text-sm text-neutral-700 font-medium">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Grille de modes */}
      <section className="max-w-md mx-auto px-4 mb-8">
        <h2 className="text-2xl font-black tracking-tight mb-4">Choisis ton contexte</h2>

        <div className="grid grid-cols-2 gap-3">
          {CONTEXTS.map((context) => (
            <Link
              key={context.id}
              href={`/modes/${context.id}`}
              className="group relative overflow-hidden rounded-2xl p-4 bg-white border-2 border-neutral-900 shadow-[4px_4px_0_0_theme(colors.neutral.900)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_theme(colors.neutral.900)] transition-all active:scale-95"
            >
              {context.featured && (
                <div className="absolute top-0 right-0 px-2.5 py-1 bg-rose-400 border-l-2 border-b-2 border-neutral-900 text-neutral-900 text-[10px] font-black uppercase rounded-bl-xl">
                  🔥 Hot
                </div>
              )}

              <div className="text-5xl mb-2 transform group-hover:rotate-6 group-hover:scale-110 transition-transform duration-300">
                {context.icon}
              </div>

              <h3
                className={`text-lg font-black bg-gradient-to-r ${context.gradient} bg-clip-text text-transparent mb-0.5`}
              >
                {context.label}
              </h3>

              <p className="text-xs text-neutral-600 font-medium leading-tight">
                {context.description}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Témoignages */}
      <section className="max-w-md mx-auto px-4 mb-10">
        <h2 className="text-2xl font-black tracking-tight mb-4">Ils adorent Klaro</h2>

        <div className="space-y-3">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.name}
              className={`${t.bg} border-2 border-neutral-900 rounded-2xl p-4 shadow-[4px_4px_0_0_theme(colors.neutral.900)]`}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-neutral-900 rounded-full flex items-center justify-center text-[#FAFAFA] font-black text-sm">
                  {t.name[0]}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-black">{t.name}</p>
                  <p className="text-xs text-neutral-700 font-bold uppercase tracking-wide">
                    Mode {t.mode}
                  </p>
                </div>
                <div className="text-neutral-900 text-sm tracking-tighter">★★★★★</div>
              </div>
              <p className="text-sm text-neutral-800 leading-relaxed font-medium">
                &laquo;&nbsp;{t.text}&nbsp;&raquo;
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="max-w-md mx-auto px-4 pt-8 border-t-2 border-neutral-900 text-center">
        <div className="inline-flex items-center gap-2 mb-3">
          <div className="w-7 h-7 bg-neutral-900 rounded-lg flex items-center justify-center text-[#FAFAFA] font-black text-xs">
            K
          </div>
          <span className="text-base font-black tracking-tight">Klaro</span>
        </div>
        <p className="text-xs text-neutral-600 font-medium mb-1">
          Analyse comportementale non clinique
        </p>
        <p className="text-xs text-neutral-500 font-bold">
          3 analyses gratuites • Premium 9,99€/mois
        </p>
      </footer>
    </div>
  );
}
