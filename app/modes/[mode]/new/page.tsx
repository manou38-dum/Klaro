"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Briefcase, Home, Users, Globe } from "lucide-react";

const EMOJIS = ["👤", "👨", "👩", "", "👴", "👵", "🧔", "👱", "", "🧕", "🤵", "👰", "🤷", "", "🙅", "🙆", "💁", "🙋", "", "👮", "💂", "🤴", "👸", "👳"];

// Configuration selon le contexte
const MODE_CONFIG: Record<string, { label: string; color: string; gradient: string; icon: any; suggestions: string[] }> = {
  pro: {
    label: "Professionnel",
    color: "blue",
    gradient: "from-blue-500 to-indigo-600",
    icon: Briefcase,
    suggestions: ["Mon boss", "Un collègue", "Un client", "Un fournisseur", "Un subordonné", "Un partenaire"]
  },
  familial: {
    label: "Familial",
    color: "rose",
    gradient: "from-rose-500 to-pink-600",
    icon: Home,
    suggestions: ["Mon conjoint", "Ma mère", "Mon père", "Mon frère", "Ma sœur", "Mon enfant"]
  },
  ami: {
    label: "Amical",
    color: "emerald",
    gradient: "from-emerald-500 to-teal-600",
    icon: Users,
    suggestions: ["Mon meilleur ami", "Une pote", "Le groupe", "Un voisin", "Une connaissance"]
  },
  social: {
    label: "Social",
    color: "amber",
    gradient: "from-amber-500 to-orange-600",
    icon: Globe,
    suggestions: ["Le voisin", "La boulangère", "Un serveur", "Un agent", "Un inconnu"]
  }
};

export default function NewCardPage() {
  const router = useRouter();
  const params = useParams();
  const mode = params.mode as string || "pro";
  
  const config = MODE_CONFIG[mode] || MODE_CONFIG.pro;
  const Icon = config.icon;

  const [prenom, setPrenom] = useState("");
  const [emoji, setEmoji] = useState("👤");
  const [relation, setRelation] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prenom.trim()) return;

    setIsLoading(true);

    try {
      const response = await fetch("/api/cards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          mode, 
          prenom: prenom.trim(), 
          emoji,
          relation: relation.trim() || null
        }),
      });

      if (!response.ok) throw new Error();

      const card = await response.json();
      router.push(`/modes/${mode}/${card.id}`);
    } catch {
      alert("Erreur lors de la création");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <Link href={`/modes/${mode}`} className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 transition mb-4">
        <ArrowLeft className="w-4 h-4" />
        Retour
      </Link>

      <div className={`bg-gradient-to-br ${config.gradient} rounded-2xl p-5 text-white mb-6`}>
        <div className="flex items-center gap-3 mb-2">
          <Icon className="w-8 h-8" />
          <h1 className="text-2xl font-black">Nouvelle personne</h1>
        </div>
        <p className="text-sm opacity-90">Contexte {config.label.toLowerCase()}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">
            Prénom ou surnom *
          </label>
          <input
            type="text"
            value={prenom}
            onChange={(e) => setPrenom(e.target.value)}
            placeholder="Ex: Marc, M., Le DG..."
            className={`w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-${config.color}-500 outline-none transition`}
            required
          />
          <p className="text-xs text-slate-500 mt-1">
            💡 Utilisez un surnom ou des initiales pour rester anonyme
          </p>
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">
            Relation (optionnel)
          </label>
          <input
            type="text"
            value={relation}
            onChange={(e) => setRelation(e.target.value)}
            placeholder="Ex: Mon boss, Un collègue..."
            className={`w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-${config.color}-500 outline-none transition mb-2`}
          />
          <div className="flex flex-wrap gap-2">
            {config.suggestions.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => setRelation(suggestion)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition ${
                  relation === suggestion
                    ? `bg-${config.color}-500 text-white`
                    : `bg-${config.color}-50 text-${config.color}-700 hover:bg-${config.color}-100`
                }`}
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">
            Emoji
          </label>
          <div className="grid grid-cols-8 gap-2 max-h-32 overflow-y-auto p-2 bg-slate-50 rounded-xl border-2 border-slate-200">
            {EMOJIS.map((e) => (
              <button
                key={e}
                type="button"
                onClick={() => setEmoji(e)}
                className={`text-2xl p-2 rounded-lg transition ${
                  emoji === e ? `bg-${config.color}-200 scale-110` : "hover:bg-slate-200"
                }`}
              >
                {e}
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={!prenom.trim() || isLoading}
          className={`w-full py-3.5 rounded-xl bg-gradient-to-r ${config.gradient} text-white font-bold hover:brightness-110 transition disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed`}
        >
          {isLoading ? "Création..." : "Créer cette personne →"}
        </button>
      </form>
    </div>
  );
}