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
  sceneCount: number;
}

const MODE_LABELS: Record<string, string> = {
  pro: "💼 Pro",
  familial: "🏠 Familial",
  ami: "🤝 Amical",
  pimente: "🌶️ Pimenté",
  hardcore: "💀 Hardcore"
};

export default function ComparePage() {
  const router = useRouter();
  const [cards, setCards] = useState<Card[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/cards")
      .then((res) => res.json())
      .then((data) => {
        setCards(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const toggleCard = (id: string) => {
    setSelected((prev) => {
      if (prev.includes(id)) {
        return prev.filter((x) => x !== id);
      }
      if (prev.length >= 3) {
        return prev;
      }
      return [...prev, id];
    });
  };

  const handleCompare = () => {
    if (selected.length < 2) return;
    
    // Sauvegarder les IDs sélectionnés
    sessionStorage.setItem("compareCardIds", JSON.stringify(selected));
    router.push("/compare/result");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-12 h-12 border-4 border-violet-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4 pb-20">
      {/* Header */}
      <div className="mb-8">
        <Link href="/" className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 transition mb-4">
          <ArrowLeft className="w-4 h-4" />
          Retour
        </Link>
        <h1 className="text-3xl font-black text-slate-900">🔄 Comparer des cartes</h1>
        <p className="text-slate-500 mt-1">Sélectionnez 2 à 3 personnes à comparer</p>
      </div>

      {/* Compteur */}
      <div className="bg-violet-50 border-2 border-violet-200 rounded-2xl p-4 mb-6">
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold text-violet-700">Cartes sélectionnées</span>
          <span className={`text-2xl font-black ${selected.length >= 2 ? "text-violet-600" : "text-slate-400"}`}>
            {selected.length}/3
          </span>
        </div>
        {selected.length < 2 && (
          <p className="text-xs text-violet-600 mt-2">Sélectionnez au moins 2 cartes pour comparer</p>
        )}
      </div>

      {/* Liste des cartes */}
      <div className="space-y-3 mb-6">
        {cards.map((card) => {
          const isSelected = selected.includes(card.id);
          return (
            <button
              key={card.id}
              onClick={() => toggleCard(card.id)}
              disabled={!isSelected && selected.length >= 3}
              className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all ${
                isSelected
                  ? "bg-violet-50 border-violet-500 shadow-lg scale-[1.02]"
                  : "bg-white border-slate-200 hover:border-slate-300"
              } ${!isSelected && selected.length >= 3 ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <div className="text-5xl">{card.emoji}</div>
              <div className="flex-1 text-left">
                <div className="font-bold text-lg text-slate-900">{card.prenom}</div>
                <div className="text-xs text-slate-500">
                  {MODE_LABELS[card.mode]} • {card.sceneCount} scène{card.sceneCount > 1 ? "s" : ""}
                </div>
              </div>
              <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                isSelected
                  ? "bg-violet-600 border-violet-600 text-white"
                  : "border-slate-300"
              }`}>
                {isSelected && <Check className="w-5 h-5" />}
              </div>
            </button>
          );
        })}

        {cards.length === 0 && (
          <div className="text-center py-12 text-slate-400">
            <p className="text-sm">Aucune carte disponible</p>
            <Link href="/" className="text-violet-600 hover:text-violet-700 font-medium mt-2 inline-block">
              Créer une carte
            </Link>
          </div>
        )}
      </div>

      {/* Bouton comparer */}
      <button
        onClick={handleCompare}
        disabled={selected.length < 2}
        className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-violet-500 to-purple-600 text-white font-black text-lg shadow-lg hover:brightness-110 transition-all disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed"
      >
        {selected.length < 2 ? "Sélectionnez au moins 2 cartes" : `Comparer ${selected.length} cartes →`}
      </button>
    </div>
  );
}