import Link from "next/link";
import { Briefcase, Home, Users, Globe, Lock, MessageCircle, ArrowRight } from "lucide-react";
import { SignedIn, UserButton } from "@clerk/nextjs";

const CONTEXTS = [
  {
    id: "comerage",
    label: "Comérage",
    icon: MessageCircle,
    description: "Décrypte les ragots et dynamiques de groupe",
    featured: true
  },
  {
    id: "pro",
    label: "Professionnel",
    icon: Briefcase,
    description: "Réunion, management, client, négociation"
  },
  {
    id: "familial",
    label: "Familial",
    icon: Home,
    description: "Couple, parents, enfants, fratrie"
  },
  {
    id: "ami",
    label: "Amical",
    icon: Users,
    description: "Soirée, groupe d'amis, sortie, loisir"
  },
  {
    id: "social",
    label: "Social",
    icon: Globe,
    description: "Voisins, inconnus, administration, vacances"
  }
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-slate-100">
        <div className="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-slate-900 tracking-tight">
            Klaro
          </Link>
          
          <div className="flex items-center gap-4">
            <SignedIn>
              <Link
                href="/dashboard"
                className="text-sm text-slate-600 hover:text-slate-900 transition-colors"
              >
                Mon espace
              </Link>
            </SignedIn>
            
            <SignedIn>
              <Link
                href="/pricing"
                className="text-sm font-medium text-violet-600 hover:text-violet-700 transition-colors"
              >
                Premium
              </Link>
            </SignedIn>
            
            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 pt-20 pb-16">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-violet-50 border border-violet-100 rounded-full text-violet-700 text-xs font-medium mb-6">
            <span className="w-1.5 h-1.5 bg-violet-500 rounded-full animate-pulse" />
            Nouveau : Mode Comérage
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 tracking-tight leading-[1.1] mb-6">
            Comprendre les gens,
            <br />
            <span className="text-slate-400">une scène à la fois.</span>
          </h1>
          
          <p className="text-lg text-slate-600 leading-relaxed mb-8 max-w-2xl">
            Analyse comportementale intelligente pour décrypter les dynamiques professionnelles, personnelles et les jeux de pouvoir sociaux.
          </p>
          
          <div className="flex items-center gap-3 text-sm text-slate-500">
            <Lock className="w-4 h-4" />
            <span>100% anonyme et privé</span>
          </div>
        </div>
      </section>

      {/* Comment ça marche */}
      <section className="max-w-5xl mx-auto px-6 py-16 border-t border-slate-100">
        <div className="mb-12">
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">Processus</p>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Comment ça marche</h2>
        </div>

        <div className="grid md:grid-cols-4 gap-8">
          {[
            { num: "01", title: "Choisis un contexte", desc: "Comérage, Pro, Familial, Amical ou Social" },
            { num: "02", title: "Décris une scène", desc: "Qui, quoi, où, quand — sois précis" },
            { num: "03", title: "Niveau d'analyse", desc: "De l'intuition rapide au décryptage profond" },
            { num: "04", title: "Reçois l'analyse", desc: "Profil comportemental détaillé en quelques secondes" }
          ].map((step, i) => (
            <div key={i} className="group">
              <div className="text-4xl font-bold text-slate-200 mb-3 group-hover:text-violet-300 transition-colors">
                {step.num}
              </div>
              <h3 className="text-base font-semibold text-slate-900 mb-2">{step.title}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Modes */}
      <section className="max-w-5xl mx-auto px-6 py-16 border-t border-slate-100">
        <div className="mb-12">
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">Contextes</p>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Choisis ton analyse</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {CONTEXTS.map((context) => (
            <Link
              key={context.id}
              href={`/modes/${context.id}`}
              className="group relative p-6 bg-slate-50 border border-slate-100 rounded-2xl hover:border-slate-200 hover:bg-white transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-2.5 bg-white border border-slate-200 rounded-xl group-hover:border-violet-200 group-hover:bg-violet-50 transition-all">
                  <context.icon className="w-5 h-5 text-slate-700 group-hover:text-violet-600 transition-colors" />
                </div>
                <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-violet-600 group-hover:translate-x-1 transition-all" />
              </div>
              
              <h3 className="text-lg font-semibold text-slate-900 mb-2">{context.label}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{context.description}</p>
              
              {context.featured && (
                <div className="absolute top-4 right-4 px-2 py-0.5 bg-violet-100 text-violet-700 text-xs font-medium rounded-full">
                  Populaire
                </div>
              )}
            </Link>
          ))}
        </div>
      </section>

      {/* Outils avancés */}
      <section className="max-w-5xl mx-auto px-6 py-16 border-t border-slate-100">
        <div className="mb-12">
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">Fonctionnalités</p>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Outils avancés</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <Link
            href="/team/new"
            className="group p-6 bg-white border border-slate-100 rounded-2xl hover:border-slate-200 hover:shadow-sm transition-all duration-300"
          >
            <Users className="w-6 h-6 text-slate-400 group-hover:text-violet-600 mb-4 transition-colors" />
            <h3 className="text-base font-semibold text-slate-900 mb-2">Mode Équipe</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Analysez la dynamique d'un groupe. Comprenez les interactions collectives.
            </p>
          </Link>

          <Link
            href="/compare"
            className="group p-6 bg-white border border-slate-100 rounded-2xl hover:border-slate-200 hover:shadow-sm transition-all duration-300"
          >
            <svg className="w-6 h-6 text-slate-400 group-hover:text-violet-600 mb-4 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
            <h3 className="text-base font-semibold text-slate-900 mb-2">Comparer des profils</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Comparez 2-3 personnes côte à côte. Identifiez compatibilités et contrastes.
            </p>
          </Link>

          <Link
            href="/stats"
            className="group p-6 bg-white border border-slate-100 rounded-2xl hover:border-slate-200 hover:shadow-sm transition-all duration-300"
          >
            <svg className="w-6 h-6 text-slate-400 group-hover:text-violet-600 mb-4 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <h3 className="text-base font-semibold text-slate-900 mb-2">Vos statistiques</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Visualisez votre activité : analyses, évolutions, personnes les plus analysées.
            </p>
          </Link>
        </div>
      </section>

      {/* Témoignages */}
      <section className="max-w-5xl mx-auto px-6 py-16 border-t border-slate-100">
        <div className="mb-12">
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">Retours</p>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Ce qu'ils en disent</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              name: "Léa",
              age: "28 ans",
              mode: "Comérage",
              text: "J'ai analysé une soirée entre amis et l'IA a vraiment capté les dynamiques. C'est drôle, direct et ça m'a ouvert les yeux sur certains jeux de pouvoir."
            },
            {
              name: "Marc",
              age: "35 ans",
              mode: "Pro",
              text: "J'utilise Klaro en mode Pro pour comprendre mon nouveau boss. Les analyses sont pertinentes et m'ont aidé à adapter ma façon de travailler avec lui."
            },
            {
              name: "Sophie",
              age: "42 ans",
              mode: "Familial",
              text: "Super pour décrypter les tensions familiales. J'ai analysé une dispute avec ma sœur et l'analyse m'a aidée à comprendre son point de vue."
            }
          ].map((testimonial, i) => (
            <div key={i} className="p-6 bg-slate-50 border border-slate-100 rounded-2xl">
              <p className="text-sm text-slate-700 leading-relaxed mb-4 italic">
                "{testimonial.text}"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-violet-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                  {testimonial.name[0]}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">{testimonial.name}, {testimonial.age}</p>
                  <p className="text-xs text-slate-500">Mode {testimonial.mode}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-100">
        <div className="max-w-5xl mx-auto px-6 py-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm text-slate-500">
            Klaro — Analyse comportementale non clinique
          </div>
          <div className="text-sm text-slate-500">
            3 analyses gratuites • Premium à 9,99€/mois
          </div>
        </div>
      </footer>
    </div>
  );
}