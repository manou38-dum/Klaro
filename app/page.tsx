import Link from "next/link";
import { Briefcase, Home, Users, Globe, Lock, MessageCircle, Sparkles } from "lucide-react";
import { SignedIn, UserButton } from "@clerk/nextjs";

const CONTEXTS = [
  {
    id: "comerage",
    label: "Comérage",
    icon: "☕",
    color: "from-pink-500 to-rose-500",
    description: "Ragots & dynamiques de groupe",
    featured: true
  },
  {
    id: "pro",
    label: "Pro",
    icon: "💼",
    color: "from-blue-500 to-indigo-500",
    description: "Réunions, management, clients"
  },
  {
    id: "familial",
    label: "Famille",
    icon: "🏠",
    color: "from-amber-500 to-orange-500",
    description: "Couple, parents, fratrie"
  },
  {
    id: "ami",
    label: "Amis",
    icon: "🎉",
    color: "from-emerald-500 to-teal-500",
    description: "Soirées, groupes, sorties"
  },
  {
    id: "social",
    label: "Social",
    icon: "🌍",
    color: "from-violet-500 to-purple-500",
    description: "Voisins, inconnus, admin"
  }
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white pb-20">
      {/* Header compact */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-100">
        <div className="max-w-md mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
              K
            </div>
            <span className="text-lg font-bold text-slate-900">Klaro</span>
          </div>
          
          <div className="flex items-center gap-3">
            <SignedIn>
              <Link href="/dashboard" className="text-xs font-medium text-slate-600 hover:text-slate-900">
                Espace
              </Link>
            </SignedIn>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>
        </div>
      </header>

      {/* Hero avec CTA fort */}
      <section className="max-w-md mx-auto px-4 pt-8 pb-6">
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-violet-100 to-purple-100 rounded-full text-violet-700 text-xs font-semibold mb-4">
            <Sparkles className="w-3 h-3" />
            Nouveau : Mode Comérage
          </div>
          
          <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-tight mb-3">
            Décrypte les gens
            <br />
            <span className="bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
              en 30 secondes
            </span>
          </h1>
          
          <p className="text-base text-slate-600 leading-relaxed mb-4">
            Analyse comportementale IA pour comprendre les dynamiques pro, perso et les ragots.
          </p>
          
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-full text-emerald-700 text-xs font-medium">
            <Lock className="w-3 h-3" />
            100% anonyme et privé
          </div>
        </div>
      </section>

      {/* Grille de modes - Style app mobile */}
      <section className="max-w-md mx-auto px-4 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-900">Choisis ton contexte</h2>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {CONTEXTS.map((context) => (
            <Link
              key={context.id}
              href={`/modes/${context.id}`}
              className="group relative overflow-hidden rounded-2xl p-4 bg-white border border-slate-200 hover:border-slate-300 hover:shadow-lg transition-all duration-300 active:scale-95"
            >
              {/* Gradient de fond subtil au hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${context.color} opacity-0 group-hover:opacity-5 transition-opacity`} />
              
              <div className="relative">
                {/* Emoji icon */}
                <div className="text-4xl mb-3 transform group-hover:scale-110 transition-transform">
                  {context.icon}
                </div>
                
                {/* Label */}
                <h3 className="text-base font-bold text-slate-900 mb-1">
                  {context.label}
                </h3>
                
                {/* Description */}
                <p className="text-xs text-slate-600 leading-relaxed">
                  {context.description}
                </p>
                
                {/* Badge populaire */}
                {context.featured && (
                  <div className="absolute top-0 right-0 px-2 py-0.5 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-[10px] font-bold rounded-bl-lg rounded-tr-lg">
                    HOT
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Comment ça marche - Style story */}
      <section className="max-w-md mx-auto px-4 mb-8">
        <h2 className="text-lg font-bold text-slate-900 mb-4">Comment ça marche</h2>
        
        <div className="space-y-3">
          {[
            { num: "1", title: "Choisis un contexte", desc: "Comérage, Pro, Famille, Amis ou Social" },
            { num: "2", title: "Raconte une scène", desc: "Qui, quoi, où, quand — sois précis" },
            { num: "3", title: "Reçois l'analyse", desc: "Profil comportemental en quelques secondes" }
          ].map((step, i) => (
            <div key={i} className="flex gap-3 p-4 bg-white border border-slate-100 rounded-xl">
              <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-violet-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                {step.num}
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-slate-900 mb-0.5">{step.title}</h3>
                <p className="text-xs text-slate-600">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Outils avancés - Cards compactes */}
      <section className="max-w-md mx-auto px-4 mb-8">
        <h2 className="text-lg font-bold text-slate-900 mb-4">Outils avancés</h2>
        
        <div className="space-y-3">
          <Link
            href="/team/new"
            className="flex items-center gap-3 p-4 bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-100 rounded-xl hover:shadow-md transition-all active:scale-98"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-xl flex items-center justify-center text-white">
              <Users className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-slate-900">Mode Équipe</h3>
              <p className="text-xs text-slate-600">Analyse de groupe</p>
            </div>
            <div className="text-indigo-400">→</div>
          </Link>

          <Link
            href="/compare"
            className="flex items-center gap-3 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100 rounded-xl hover:shadow-md transition-all active:scale-98"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center text-white">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-slate-900">Comparer</h3>
              <p className="text-xs text-slate-600">2-3 profils côte à côte</p>
            </div>
            <div className="text-emerald-400">→</div>
          </Link>

          <Link
            href="/stats"
            className="flex items-center gap-3 p-4 bg-gradient-to-r from-violet-50 to-purple-50 border border-violet-100 rounded-xl hover:shadow-md transition-all active:scale-98"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center text-white">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-slate-900">Statistiques</h3>
              <p className="text-xs text-slate-600">Ton activité</p>
            </div>
            <div className="text-violet-400">→</div>
          </Link>
        </div>
      </section>

      {/* Témoignages - Style social */}
      <section className="max-w-md mx-auto px-4 mb-8">
        <h2 className="text-lg font-bold text-slate-900 mb-4">Ils adorent Klaro</h2>
        
        <div className="space-y-3">
          {[
            { name: "Léa", mode: "Comérage", text: "L'IA a vraiment capté les dynamiques de ma soirée. C'est drôle et direct !" },
            { name: "Marc", mode: "Pro", text: "Super pour comprendre mon boss. Les analyses sont pertinentes." },
            { name: "Sophie", mode: "Famille", text: "M'a aidée à comprendre le point de vue de ma sœur. Je recommande !" }
          ].map((t, i) => (
            <div key={i} className="p-4 bg-white border border-slate-100 rounded-xl">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-gradient-to-br from-violet-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-xs">
                  {t.name[0]}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-900">{t.name}</p>
                  <p className="text-xs text-slate-500">Mode {t.mode}</p>
                </div>
                <div className="flex text-amber-400 text-xs">★★★★★</div>
              </div>
              <p className="text-sm text-slate-700 leading-relaxed">"{t.text}"</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer compact */}
      <footer className="max-w-md mx-auto px-4 pt-6 pb-8 text-center">
        <p className="text-xs text-slate-500 mb-1">
          Klaro — Analyse comportementale non clinique
        </p>
        <p className="text-xs text-slate-400">
          3 analyses gratuites • Premium 9,99€/mois
        </p>
      </footer>
    </div>
  );
}