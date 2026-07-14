import Link from "next/link";
import { Lock, Sparkles } from "lucide-react";
import { SignedIn, UserButton } from "@clerk/nextjs";

const CONTEXTS = [
  { id: "comerage", label: "Comérage", icon: "☕", color: "bg-rose-100", border: "border-rose-400", text: "text-rose-700", featured: true },
  { id: "pro", label: "Pro", icon: "💼", color: "bg-sky-100", border: "border-sky-400", text: "text-sky-700" },
  { id: "familial", label: "Famille", icon: "🏠", color: "bg-amber-100", border: "border-amber-400", text: "text-amber-700" },
  { id: "ami", label: "Amis", icon: "🎉", color: "bg-emerald-100", border: "border-emerald-400", text: "text-emerald-700" },
  { id: "social", label: "Social", icon: "🌍", color: "bg-violet-100", border: "border-violet-400", text: "text-violet-700" }
];

export default function HomePage() {
  return (
    // FOND CHAUD ET DOUX (Pastel crème/orange/rose)
    <div className="min-h-screen bg-gradient-to-b from-orange-50 via-rose-50 to-amber-50 pb-20 font-sans">
      
      {/* Header Compact */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b-2 border-black/10">
        <div className="max-w-md mx-auto px-4 py-3 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-gradient-to-br from-rose-500 to-orange-500 text-white rounded-lg flex items-center justify-center font-black text-lg border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
              K
            </div>
            <span className="text-xl font-black text-slate-900 tracking-tight">Klaro</span>
          </Link>
          
          <div className="flex items-center gap-3">
            <SignedIn>
              <Link href="/dashboard" className="text-xs font-bold text-slate-700 hover:text-rose-600 transition-colors">
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
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-rose-100 border-2 border-rose-400 rounded-lg text-rose-800 text-xs font-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
            <Sparkles className="w-3.5 h-3.5" />
            NOUVEAU : MODE COMÉRAGE
          </div>
          
          <h1 className="text-4xl font-black text-slate-900 leading-[1.1] tracking-tight">
            Décrypte les gens
            <br />
            <span className="text-2xl font-bold text-slate-600 mt-2 block">en 30 secondes.</span>
          </h1>
          
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-100 border-2 border-emerald-400 rounded-lg text-emerald-800 text-xs font-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
            <Lock className="w-3.5 h-3.5" />
            100% ANONYME ET PRIVÉ
          </div>
        </div>
      </section>

      {/* Comment ça marche : VERSION ULTRA COMPACTE (1 seul pavé) */}
      <section className="max-w-md mx-auto px-4 mb-6">
        <div className="p-4 bg-white border-2 border-amber-300 rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-center">
          <p className="text-sm font-bold text-slate-800 leading-relaxed">
            ✍️ <span className="text-amber-700">Raconte</span> une scène en quelques lignes, 
            et notre IA <span className="text-rose-600">décrypte</span> les dynamiques instantanément.
          </p>
        </div>
      </section>

      {/* Grille des modes */}
      <section className="max-w-md mx-auto px-4 mb-8">
        <h2 className="text-lg font-black text-slate-900 mb-4 uppercase tracking-wide">Choisis ton contexte</h2>
        <div className="grid grid-cols-2 gap-4">
          {CONTEXTS.map((context) => (
            <Link
              key={context.id}
              href={`/modes/${context.id}`}
              className={`group relative flex flex-col p-4 bg-white border-2 ${context.border} rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all active:scale-95`}
            >
              {context.featured && (
                <div className="absolute -top-2 -right-2 px-2 py-0.5 bg-slate-900 text-white text-[10px] font-black rounded-md border-2 border-black rotate-3">
                  HOT
                </div>
              )}
              <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">{context.icon}</div>
              <h3 className={`text-base font-black ${context.text} mb-1`}>{context.label}</h3>
              <p className="text-xs font-medium text-slate-600 leading-tight">Analyse rapide</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Témoignages */}
      <section className="max-w-md mx-auto px-4 mb-8">
        <h2 className="text-lg font-black text-slate-900 mb-4 uppercase tracking-wide">Ils adorent Klaro</h2>
        <div className="space-y-4">
          {[
            { name: "Léa", mode: "Comérage", text: "L'IA a vraiment capté les dynamiques. C'est drôle et direct !", color: "bg-rose-400" },
            { name: "Marc", mode: "Pro", text: "Super pour comprendre mon boss. Analyses pertinentes.", color: "bg-sky-400" },
            { name: "Sophie", mode: "Famille", text: "M'a aidée à comprendre ma sœur. Je recommande !", color: "bg-amber-400" }
          ].map((t, i) => (
            <div key={i} className="p-4 bg-white border-2 border-black/10 rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]">
              <div className="flex items-center gap-3 mb-2">
                <div className={`w-10 h-10 ${t.color} border-2 border-black rounded-full flex items-center justify-center text-white font-black text-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]`}>
                  {t.name[0]}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-black text-slate-900">{t.name}</p>
                  <p className="text-xs font-medium text-slate-500">Mode {t.mode}</p>
                </div>
                <div className="text-amber-400 text-sm">★★★★★</div>
              </div>
              <p className="text-sm font-medium text-slate-700 italic">"{t.text}"</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="max-w-md mx-auto px-4 pt-6 pb-8 text-center border-t-2 border-black/10">
        <div className="inline-flex items-center gap-2 mb-3">
          <div className="w-6 h-6 bg-slate-900 text-white rounded flex items-center justify-center font-black text-xs">K</div>
          <span className="text-sm font-black text-slate-900">Klaro</span>
        </div>
        <p className="text-xs font-medium text-slate-600 mb-1">Analyse comportementale non clinique</p>
        <p className="text-xs font-medium text-slate-500">3 analyses gratuites • Premium 9,99€/mois</p>
      </footer>
    </div>
  );
}