"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Check } from "lucide-react";

interface Card {
  id: string;
  prenom: string;
  emoji: string;
  mode: string;
}

const MODE_LABELS: Record<string, string> = {
  pro: "💼 Professionnel",
  familial: "🏠 Familial",
  ami: "🤝 Amical",
  pimente: "🌶️ Pimenté",
  hardcore: "💀 Hardcore"
};

export default function NewTeamPage() {
  const router = useRouter();
  const [cards, setCards] = useState<Card[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [teamName, setTeamName] = useState("");
  const [teamMode, setTeamMode] = useState<string>("pro");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetch("/api/cards")
      .then((res) => res.json())
      .then((data) => {
        setCards(data);
      })
      .catch(console.error);
  }, []);

  const toggleCard = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamName || selected.length < 2) return;

    setIsLoading(true);

    try {
      const response = await fetch("/api/teams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: teamName,
          mode: teamMode,
          memberIds: selected
        })
      });

      if (!response.ok) throw new Error();

      const team = await response.json();
      window.location.href = `/team/${team.id}`;
    } catch {
      alert("Erreur lors de la création de l'équipe");
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 pb-20">
      <Link href="/" className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 transition mb-4">
        <ArrowLeft className="w-4 h-4" />
        Retour
      </Link>

      <h1 className="text-3xl font-black text-slate-900 mb-2">👥 Nouvelle équipe</h1>
      <p className="text-slate-500 mb-8">Créez un groupe pour analyser la dynamique collective</p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Nom de l'équipe *</label>
          <input
            type="text"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            placeholder="Ex: Équipe Marketing, Famille Martin..."
            className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-violet-500 outline-none transition"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Mode d'analyse *</label>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(MODE_LABELS).map(([mode, label]) => (
              <button
                key={mode}
                type="button"
                onClick={() => setTeamMode(mode)}
                className={`py-3 px-4 rounded-xl border-2 font-semibold transition ${
                  teamMode === mode
                    ? "border-violet-500 bg-violet-50 text-violet-700"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">
            Membres de l'équipe * (min. 2)
          </label>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {cards.map((card) => {
              const isSelected = selected.includes(card.id);
              return (
                <button
                  key={card.id}
                  type="button"
                  onClick={() => toggleCard(card.id)}
                  className={`w-full flex items-center gap-4 p-3 rounded-xl border-2 transition ${
                    isSelected
                      ? "border-violet-500 bg-violet-50"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className="text-3xl">{card.emoji}</div>
                  <div className="flex-1 text-left">
                    <div className="font-bold text-slate-900">{card.prenom}</div>
                    <div className="text-xs text-slate-500">{MODE_LABELS[card.mode]}</div>
                  </div>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    isSelected ? "bg-violet-600 border-violet-600 text-white" : "border-slate-300"
                  }`}>
                    {isSelected && <Check className="w-4 h-4" />}
                  </div>
                </button>
              );
            })}
          </div>
          <p className="text-xs text-slate-500 mt-2">
            {selected.length} membre{selected.length > 1 ? "s" : ""} sélectionné{selected.length > 1 ? "s" : ""}
          </p>
        </div>

        <button
          type="submit"
          disabled={!teamName || selected.length < 2 || isLoading}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-violet-500 to-purple-600 text-white font-bold text-lg shadow-lg hover:brightness-110 transition disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed"
        >
          {isLoading ? "Création..." : "Créer l'équipe →"}
        </button>
      </form>
    </div>
  );
}
