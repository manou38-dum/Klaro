import Link from "next/link";
import { Briefcase, Home, Users, Globe, Lock, Shield, MessageCircle, Sparkles, Zap } from "lucide-react";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

const CONTEXTS = [
  {
    id: "comerage",
    label: "Comérage",
    icon: MessageCircle,
    bg: "bg-gradient-to-br from-pink-50 to-rose-50",
    border: "border-pink-300",
    text: "text-pink-700",
    description: "Décrypte les ragots et dynamiques de groupe",
    examples: "Ex: une soirée, un dîner, une réunion de famille...",
    badge: "🔥 Nouveau",
    featured: true
  },
  {
    id: "pro",
    label: "Professionnel",
    icon: Briefcase,
    bg: "bg-blue-50",
    border: "border-blue-200",
    text: "text-blue-700",
    description: "Réunion, management, client, négociation",
    examples: "Ex: mon boss, un collègue, un client..."
  },
  {
    id: "familial",
    label: "Familial",
    icon: Home,
    bg: "bg-rose-50",
    border: "border-rose-200",
    text: "text-rose-700",
    description: "Couple, parents, enfants, fratrie",
    examples: "Ex: mon conjoint, ma mère, mon frère..."
  },
  {
    id: "ami",
    label: "Amical",
    icon: Users,
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    text: "text-emerald-700",
    description: "Soirée, groupe d'amis, sortie, loisir",
    examples: "Ex: mon meilleur ami, une pote, le groupe..."
  },
  {
    id: "social",
    label: "Social",
    icon: Globe,
    bg: "bg-amber-50",
    border: "border-amber-200",
    text: "text-amber-700",
    description: "Voisins, inconnus, administration, vacances",
    examples: "Ex: un voisin, un serveur, un agent..."
  }
];

export default function HomePage() {
  return (
    <div className="max-w-xl mx-auto space-y-6 p-4">
      {/* Header avec authentification */}
      <div className="flex justify-between items-center mb-4">
        <SignedIn>
          <Link
            href="/dashboard"
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-violet-100 text-violet-700 font-semibold text-sm hover:bg-violet-200 transition"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Mon espace
          </Link>
        </SignedIn>
        
        <div className="flex gap-2">
          <SignedIn>
            <Link
              href="/pricing"
              className="px-3 py-2 rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 text-white font-semibold text-sm hover:brightness-110 transition"
            >
              💎 Premium
            </Link>
          </SignedIn>
          
          <SignedIn>
            <UserButton showName />
          </SignedIn>
        </div>
      </div>
      
      {/* Titre accrocheur */}
      <div className="text-center mb-6 space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-100 to-rose-100 rounded-full text-pink-700 text-sm font-bold mb-3">
          <Sparkles className="w-4 h-4" />
          Nouveau : Mode Comérage disponible !
        </div>
        <h1 className="text-5xl font-black text-slate-900 tracking-tight">Klaro</h1>
        <p className="text-lg text-slate-600 font-medium">
          Comprendre les gens, <span className="text-violet-600">une scène à la fois</span>.
        </p>
        <p className="text-sm text-slate-500 max-w-md mx-auto">
          Analyse comportementale intelligente pour décrypter les dynamiques pro, perso... et les ragots ! ☕
        </p>
      </div>

      {/* Message de confidentialité */}
      <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-200 rounded-2xl p-5 flex items-start gap-3 shadow-sm">
        <div className="bg-emerald-500 text-white p-2 rounded-lg flex-shrink-0">
          <Lock className="w-5 h-5" />
        </div>
        <div className="text-sm text-slate-800">
          <p className="font-black text-emerald-900 mb-1 flex items-center gap-2">
            <Shield className="w-4 h-4" />
            100% anonyme et privé
          </p>
          <p className="text-slate-700 leading-relaxed">
            Utilisez des <strong>surnoms, initiales ou prénoms fictifs</strong> (ex: "M.", "Le Boss", "X").
            Vos analyses restent strictement personnelles.
          </p>
        </div>
      </div>

      {/* Section Comérage mise en avant */}
      <div className="bg-gradient-to-br from-pink-500 to-rose-600 rounded-3xl p-6 text-white shadow-xl">
        <div className="flex items-center gap-2 mb-3">
          <MessageCircle className="w-8 h-8" />
          <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-bold">POPULAIRE</span>
        </div>
        <h2 className="text-2xl font-black mb-2">☕ Mode Comérage</h2>
        <p className="text-sm opacity-95 mb-4">
          Décrypte les dynamiques de groupe, les ragots et les jeux de pouvoir comme si tu parlais avec ta meilleure pote. 
          Direct, drôle et sans filtre !
        </p>
        <Link
          href="/modes/comerage"
          className="inline-flex items-center gap-2 px-6 py-3 bg-white text-pink-600 font-bold rounded-xl hover:bg-pink-50 transition shadow-lg"
        >
          <Zap className="w-5 h-5" />
          Tester maintenant
        </Link>
      </div>

      {/* Question principale */}
      <div className="text-center">
        <h2 className="text-xl font-bold text-slate-900">
          Ou choisis un autre contexte :
        </h2>
      </div>

      {/* Grille des contextes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {CONTEXTS.filter(c => !c.featured).map((context) => (
          <Link
            key={context.id}
            href={`/modes/${context.id}`}
            className={`p-5 rounded-2xl border-2 text-left transition-all hover:scale-[1.02] active:scale-[0.98] ${context.bg} ${context.border} ${context.text} shadow-md hover:shadow-lg`}
          >
            <div className="flex items-center gap-3 mb-2">
              <context.icon className="w-6 h-6" />
              <span className="font-black text-lg">{context.label}</span>
            </div>
            <p className={`text-sm ${context.text} opacity-80 mb-2`}>
              {context.description}
            </p>
            <p className={`text-xs ${context.text} opacity-60 italic`}>
              {context.examples}
            </p>
          </Link>
        ))}
      </div>

      {/* Comment ça marche */}
      <div className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-2xl p-5 border-2 border-violet-200">
        <h3 className="font-black text-slate-900 mb-4 text-base flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-violet-600" />
          Comment ça marche ?
        </h3>
        <ol className="space-y-3 text-sm text-slate-700">
          <li className="flex gap-3 items-start">
            <span className="flex-shrink-0 w-6 h-6 bg-violet-600 text-white rounded-full flex items-center justify-center font-black text-xs">1</span>
            <span>Choisis un contexte (Comérage, Pro, Perso...)</span>
          </li>
          <li className="flex gap-3 items-start">
            <span className="flex-shrink-0 w-6 h-6 bg-violet-600 text-white rounded-full flex items-center justify-center font-black text-xs">2</span>
            <span>Décris une scène précise (qui, quoi, où, quand)</span>
          </li>
          <li className="flex gap-3 items-start">
            <span className="flex-shrink-0 w-6 h-6 bg-violet-600 text-white rounded-full flex items-center justify-center font-black text-xs">3</span>
            <span>Choisis le niveau d'analyse (de l'intuition au hardcore)</span>
          </li>
          <li className="flex gap-3 items-start">
            <span className="flex-shrink-0 w-6 h-6 bg-violet-600 text-white rounded-full flex items-center justify-center font-black text-xs">4</span>
            <span>Obtiens une analyse comportementale détaillée en quelques secondes</span>
          </li>
        </ol>
      </div>

      {/* Outils avancés */}
      <div className="pt-4">
        <div className="flex items-center gap-2 mb-4">
          <div className="h-px bg-slate-200 flex-1" />
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Outils avancés
          </span>
          <div className="h-px bg-slate-200 flex-1" />
        </div>

        <div className="grid grid-cols-1 gap-3">
          {/* Mode Team */}
          <Link
            href="/team/new"
            className="group bg-gradient-to-r from-indigo-50 to-blue-50 border-2 border-indigo-200 rounded-2xl p-4 hover:border-indigo-400 hover:shadow-md transition-all"
          >
            <div className="flex items-start gap-3">
              <div className="bg-indigo-500 text-white p-2.5 rounded-xl">
                <Users className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-slate-900 mb-1">
                  Mode Équipe
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Analysez la dynamique d'un groupe (équipe pro, famille, amis). Comprenez les interactions collectives.
                </p>
              </div>
              <div className="text-indigo-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all">
                →
              </div>
            </div>
          </Link>

          {/* Comparer */}
          <Link
            href="/compare"
            className="group bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-200 rounded-2xl p-4 hover:border-emerald-400 hover:shadow-md transition-all"
          >
            <div className="flex items-start gap-3">
              <div className="bg-emerald-500 text-white p-2.5 rounded-xl">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-slate-900 mb-1">
                  Comparer des profils
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Comparez 2-3 personnes côte à côte. Identifiez compatibilités et contrastes majeurs.
                </p>
              </div>
              <div className="text-emerald-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all">
                →
              </div>
            </div>
          </Link>

          {/* Stats */}
          <Link
            href="/stats"
            className="group bg-gradient-to-r from-violet-50 to-purple-50 border-2 border-violet-200 rounded-2xl p-4 hover:border-violet-400 hover:shadow-md transition-all"
          >
            <div className="flex items-start gap-3">
              <div className="bg-violet-500 text-white p-2.5 rounded-xl">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-slate-900 mb-1">
                  Vos statistiques
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Visualisez votre activité : nombre d'analyses, évolutions, personnes les plus analysées.
                </p>
              </div>
              <div className="text-violet-400 group-hover:text-violet-600 group-hover:translate-x-1 transition-all">
                →
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center pt-6 pb-4 border-t border-slate-200">
        <p className="text-xs text-slate-400 mb-1">
          Klaro — Analyse comportementale non clinique
        </p>
        <p className="text-xs text-slate-400">
          3 analyses gratuites • Premium à 9,99€/mois
        </p>
      </div>
    </div>
  );
}