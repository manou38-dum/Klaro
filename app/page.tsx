import Link from "next/link";
import { Briefcase, Home, Users, Globe, Lock, MessageCircle, Sparkles } from "lucide-react";
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
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-pink-50 to-amber-50 pb-20">
      {/* Header compact avec glassmorphism */}
      <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-white/20 shadow-sm">
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

      {/* Hero vibrant */}
      <section className="max-w-md mx-auto px-4 pt-8 pb-6">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm border-2 border-violet-200 rounded-full text-violet-700 text-xs font-black mb-5 shadow-lg shadow-violet-500/10">
            <Sparkles className="w-4 h-4 animate-pulse" />
            NOUVEAU : MODE COMÉRAGE
          </div>
          
          <h1 className="text-5xl font-black text-slate-900 tracking-tight leading-[0.95] mb-4">
            Décrypte
            <br />
            <span className="bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              les gens
            </span>
            <br />
            <span className="text-3xl font-bold text-slate-600">en 30 secondes</span>
          </h1>
          
          <p className="text-base text-slate-700 leading-relaxed mb-5 font-medium">
            Analyse comportementale IA pour comprendre les dynamiques pro, perso et les ragots.
          </p>
          
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 border-2 border-emerald-300 rounded-full text-emerald-800 text-xs font-bold shadow-md">
            <Lock className="w-3.5 h-3.5" />
            100% ANONYME ET PRIVÉ
          </div>
        </div>
      </section>

      {/* Grille de modes - Plus colorée */}
      <section className="max-w-md mx-auto px-4 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-black text-slate-900">Choisis ton contexte</h2>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {CONTEXTS.map((context) => (
            <Link
              key={context.id}
              href={`/modes/${context.id}`}
              className="group relative overflow-hidden rounded-2xl p-4 bg-white border-2 border-white hover:border-slate-200 shadow-lg hover:shadow-2xl transition-all duration-300 active:scale-95"
            >
              {/* Gradient de fond */}
              <div className={`absolute inset-0 bg-gradient-to-br ${context.gradient} opacity-0 group-hover:opacity-10 transition-opacity`} />
              
              <div className="relative">
                {/* Emoji icon avec effet */}
                <div className="text-5xl mb-2 transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                  {context.icon}
                </div>
                
                {/* Label avec gradient */}
                <h3 className={`text-base font-black bg-gradient-to-r ${context.gradient} bg-clip-text text-transparent mb-1`}>
                  {context.label}
                </h3>
                
                {/* Description */}
                <p className="text-xs text-slate-600 font-medium leading-tight">
                  {context.description}
                </p>
                
                {/* Badge HOT */}
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

      {/* Comment ça marche - Plus compact */}
      <section className="max-w-md mx-auto px-4 mb-6">
        <div className="bg-white/80 backdrop-blur-sm border-2 border-white rounded-3xl p-5 shadow-xl">
          <h2 className="text-xl font-black text-slate-900 mb-4">Comment ça marche</h2>
          
          <div className="space-y-3">
            {[
              { num: "1", title: "Choisis", desc: "Ton contexte" },
              { num: "2", title: "Raconte", desc: "Une scène précise" },
              { num: "3", title: "Décrypte", desc: "En 30 secondes" }
            ].map((step, i) => (
              <div key={i} className="flex gap-3 items-center">
                <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-violet-600 to-purple-600 rounded-xl flex items-center justify-center text-white font-black text-sm shadow-lg shadow-violet-500/30">
                  {step.num}
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-black text-slate-900">{step.title}</h3>
                  <p className="text-xs text-slate-600 font-medium">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Outils avancés - Cards colorées */}
      <section className="max-w-md mx-auto px-4 mb-6">
        <h2 className="text-xl font-black text-slate-900 mb-4">Outils avancés</h2>
        
        <div className="space-y-3">
          <Link
            href="/team/new"
            className="flex items-center gap-3 p-4 bg-gradient-to-r from-indigo-500 to-blue-600 rounded-2xl hover:shadow-2xl transition-all active:scale-98 shadow-lg shadow-indigo-500/30"
          >
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center text-white">
              <Users className="w-6 h-6" />
            </div>
            <div className="flex-1 text-white">
              <h3 className="text-sm font-black">Mode Équipe</h3>
              <p className="text-xs opacity-90">Analyse de groupe</p>
            </div>
            <div className="text-white/70 text-2xl">→</div>
          </Link>

          <Link
            href="/compare"
            className="flex items-center gap-3 p-4 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl hover:shadow-2xl transition-all active:scale-98 shadow-lg shadow-emerald-500/30"
          >
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center text-white">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </div>
            <div className="flex-1 text-white">
              <h3 className="text-sm font-black">Comparer</h3>
              <p className="text-xs opacity-90">2-3 profils côte à côte</p>
            </div>
            <div className="text-white/70 text-2xl">→</div>
          </Link>

          <Link
            href="/stats"
            className="flex items-center gap-3 p-4 bg-gradient-to-r from-violet-500 to-purple-600 rounded-2xl hover:shadow-2xl transition-all active:scale-98 shadow-lg shadow-violet-500/30"
          >
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center text-white">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div className="flex-1 text-white">
              <h3 className="text-sm font-black">Statistiques</h3>
              <p className="text-xs opacity-90">Ton activité</p>
            </div>
            <div className="text-white/70 text-2xl">→</div>
          </Link>
        </div>
      </section>

      {/* Témoignages - Plus vivant */}
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