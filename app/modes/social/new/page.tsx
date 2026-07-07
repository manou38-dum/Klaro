"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const EMOJIS = ["👤", "👨", "", "🧑", "👴", "👵", "🧔", "👱", "👲", "🧕", "🤵", "👰", "🤷", "🙍", "", "🙅", "🙆", "💁", "🙋", "", "🤦", "", "👮", "️", "💂", "", "🤴", "👸", "👳", "👲", "🧙", "🧚", "", "🧜", "🧝", "🧞", "🧟", "🙋", "💆", "", "🚶", "", "💃", "🕺", "🧖", "🧗", "", "🛀", "🛌", "👨‍‍👦", "‍👩‍👧", "👨‍👦", "👨‍👧", "👩‍👦", "‍👧", "👨‍👨‍👦", "👨‍👨‍", "👩‍👩👦", "👩‍‍👧", "👨‍👦‍", "👨‍👧👧", "👩‍‍👦", "👩‍👧‍👧", "👨‍👨‍‍👦", "‍👨‍👧👧", "👩‍‍👦‍👦", "👩‍👩‍👧‍👧"];

export default function NewCardPage() {
  const router = useRouter();
  const [prenom, setPrenom] = useState("");
  const [emoji, setEmoji] = useState("👤");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prenom.trim()) return;

    setIsLoading(true);

    try {
      const response = await fetch("/api/cards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: "social", prenom: prenom.trim(), emoji }),
      });

      if (!response.ok) throw new Error();

      const card = await response.json();
      router.push(`/modes/social/${card.id}`);
    } catch {
      alert("Erreur lors de la création");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <Link href="/modes/social" className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 transition mb-4">
        <ArrowLeft className="w-4 h-4" />
        Retour
      </Link>

      <h1 className="text-2xl font-bold text-slate-900 mb-6">Nouvelle personne (Social)</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Prénom ou surnom *
          </label>
          <input
            type="text"
            value={prenom}
            onChange={(e) => setPrenom(e.target.value)}
            placeholder="Ex: Le voisin, La boulangère, X..."
            className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-amber-500 outline-none transition"
            required
          />
          <p className="text-xs text-slate-500 mt-1">
            💡 Utilisez un surnom ou des initiales pour rester anonyme
          </p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Emoji
          </label>
          <div className="grid grid-cols-8 gap-2 max-h-40 overflow-y-auto p-2 bg-slate-50 rounded-xl border-2 border-slate-200">
            {EMOJIS.map((e) => (
              <button
                key={e}
                type="button"
                onClick={() => setEmoji(e)}
                className={`text-2xl p-2 rounded-lg transition ${
                  emoji === e ? "bg-amber-200 scale-110" : "hover:bg-slate-200"
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
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold hover:brightness-110 transition disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed"
        >
          {isLoading ? "Création..." : "Créer cette personne →"}
        </button>
      </form>
    </div>
  );
}