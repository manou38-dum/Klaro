import Link from "next/link";
import { Lock, Sparkles } from "lucide-react";
import { SignedIn, UserButton } from "@clerk/nextjs";

const CONTEXTS = [
  {
    id: "comerage",
    label: "Comérage",
    icon: "☕",
    gradient: "from-pink-500 via-rose-500 to-red-500",
    description: "Ragots & dynamiques",
    featured: true
  },
  {
    id: "pro",
    label: "Pro",
    icon: "💼",
    gradient: "from-blue-500 via-indigo-500 to-purple-500",
    description: "Réunions & management"
  },
  {
    id: "familial",
    label: "Famille",
    icon: "🏠",
    gradient: "from-amber-500 via-orange-500 to-red-500",
    description: "Couple & fratrie"
  },
  {
    id: "ami",
    label: "Amis",
    icon: "🎉",
    gradient: "from-emerald-500 via-teal-500 to-cyan-500",
    description: "Soirées & sorties"
  },
  {
    id: "social",
    label: "Social",
    icon: "🌍",
    gradient: "from-violet-500 via-purple-500 to-fuchsia-500",
    description: "Voisins & inconnus"
  }
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-100 via-pink-100 to-amber-100 pb-20">
      {/* Header compact */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-white/30 shadow-sm">
        <div className="max-w-md mx-auto px-4 py-3 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-gradient-to-br from-violet-600 via-purple-600 to-pink-600 rounded-xl flex items-center justify-center text-white font-black text-lg shadow-lg shadow-violet-500/30">
              K
            </div>
            <span className="text-xl font-black bg-gradient-to-r from-violet-600 to-pink-600 bg-clip-text text-transparent">
              Klaro
            </span>
          </Link>
          
          <div className="flex items-center gap-3">
            <SignedIn>
              <Link href="/dashboard" className="text-xs font-bold text-slate-700 hover:text-violet-600 transition-colors">
                Espace
              </Link>
            </SignedIn>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>
        </div>
      </header>

      {/* Hero compact */}
      <section className="max-w-md mx-auto px-4 pt-6 pb-4">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/90 backdrop-blur-sm border-2 border-violet-300 rounded-full text-violet-700 text-xs font-black mb-3 shadow-lg shadow-violet-500/20">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            NOUVEAU : MODE COMÉRAGE
          </div>
          
          <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-tight mb-2">
            Décrypte{" "}
            <span className="bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              les gens
            </span>
            <br />
            <span className="text-xl font-bold text-slate-600">en 30 secondes</span>
          </h1>
          
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 border border-emerald-300 rounded-full text-emerald-800 text-[10px] font-bold">
            <Lock className="w-3 h-3" />
            100% ANONYME
          </div>
        </div>
      </section>

      {/* Comment ça marche - AVANT les contextes */}
      <section className="max-w-md mx-auto px-4 mb-4">
        <div className="bg-gradient-to-br from-violet-500 via-purple-500 to-pink-500 rounded-3xl p-5 shadow-2xl shadow-violet-500/30">
          <h2 className="text-lg font-black text-white mb-4">Comment ça marche</h2>
          
          <div className="space-y-2.5">
            {[
              { num: "1", title: "Choisis", desc: "Ton contexte" },
              { num: "2", title: "Raconte", desc: "Une scène précise" },
              { num: "3", title: "Décrypte", desc: "En 30 secondes" }
            ].map((step, i) => (
              <div key={i} className="flex gap-3 items-center bg-white/10 backdrop-blur-sm rounded-2xl p-3">
                <div className="flex-shrink-0 w-9 h-9 bg-white rounded-xl flex items-center justify-center text-violet-600 font-black text-sm shadow-lg">
                  {step.num}
                </div>
                <div className="flex-1 text-white">
                  <h3 className="text-sm font-black">{step.title}</h3>
                  <p className="text-xs opacity-90">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Grille de modes */}
      <section className="max-w-md mx-auto px-4 mb-6">
        <h2 className="text-xl font-black text-slate-900 mb-3">Choisis ton contexte</h2>

        <div className="grid grid-cols-2 gap-3">
          {CONTEXTS.map((context) => (
            <Link
              key={context.id}
              href={`/modes/${context.id}`}
              className="group relative overflow-hidden rounded-2xl p-4 bg-white border-2 border-white hover:border-slate-200 shadow-lg hover:shadow-2xl transition-all duration-300 active:scale-95"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${context.gradient} opacity-0 group-hover:opacity-10 transition-opacity`} />
              
              <div className="relative">
                <div className="text-5xl mb-2 transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                  {context.icon}
                </div>
                
                <h3 className={`text-base font-black bg-gradient-to-r ${context.gradient} bg-clip-text text-transparent mb-1`}>
                  {context.label}
                </h3>
                
                <p className="text-xs text-slate-600 font-medium leading-tight">
                  {context.description}
                </p>
                
                {context.featured && (
                  <div className={`absolute top-0 right-0 px-2.5 py-1 bg-gradient-to-r ${context.gradient} text-white text-[10px] font-black rounded-bl-xl rounded-tr-xl shadow-lg`}>
                    🔥 HOT
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Témoignages */}
      <section className="max-w-md mx-auto px-4 mb-8">
        <h2 className="text-xl font-black text-slate-900 mb-4">Ils adorent Klaro</h2>
        
        <div className="space-y-3">
          {[
            { name: "Léa", mode: "Comérage", text: "L'IA a vraiment capté les dynamiques. C'est drôle et direct !", color: "from-pink-400 to-rose-500" },
            { name: "Marc", mode: "Pro", text: "Super pour comprendre mon boss. Analyses pertinentes.", color: "from-blue-400 to-indigo-500" },
            { name: "Sophie", mode: "Famille", text: "M'a aidée à comprendre ma sœur. Je recommande !", color: "from-amber-400 to-orange-500" }
          ].map((t, i) => (
            <div key={i} className="p-4 bg-white/90 backdrop-blur-sm border-2 border-white rounded-2xl shadow-lg">
              <div className="flex items-center gap-3 mb-2">
                <div className={`w-10 h-10 bg-gradient-to-br ${t.color} rounded-full flex items-center justify-center text-white font-black text-sm shadow-lg`}>
                  {t.name[0]}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-black text-slate-900">{t.name}</p>
                  <p className="text-xs text-slate-500 font-medium">Mode {t.mode}</p>
                </div>
                <div className="flex text-amber-400 text-sm">★★★★★</div>
              </div>
              <p className="text-sm text-slate-700 leading-relaxed font-medium">"{t.text}"</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="max-w-md mx-auto px-4 pt-6 pb-8 text-center">
        <div className="inline-flex items-center gap-2 mb-3">
          <div className="w-6 h-6 bg-gradient-to-br from-violet-600 to-pink-600 rounded-lg flex items-center justify-center text-white font-black text-xs">
            K
          </div>
          <span className="text-sm font-black bg-gradient-to-r from-violet-600 to-pink-600 bg-clip-text text-transparent">
            Klaro
          </span>
        </div>
        <p className="text-xs text-slate-600 font-medium mb-1">
          Analyse comportementale non clinique
        </p>
        <p className="text-xs text-slate-500">
          3 analyses gratuites • Premium 9,99€/mois
        </p>
      </footer>
    </div>
  );
}