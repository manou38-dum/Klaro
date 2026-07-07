"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, TrendingUp, AlertTriangle, CheckCircle } from "lucide-react";

interface CardStats {
  id: string;
  prenom: string;
  emoji: string;
  mode: string;
  sceneCount: number;
  bigFiveAverages: Array<{
    dimension: string;
    average: number;
    sampleSize: number;
  }>;
}

const DIMENSION_LABELS: Record<string, { label: string; emoji: string; color: string }> = {
  O: { label: "Ouverture", emoji: "🎨", color: "from-violet-500 to-purple-600" },
  C: { label: "Conscience", emoji: "📋", color: "from-blue-500 to-indigo-600" },
  E: { label: "Extraversion", emoji: "🎉", color: "from-emerald-500 to-teal-600" },
  A: { label: "Agréabilité", emoji: "🤝", color: "from-rose-500 to-pink-600" },
  N: { label: "Névrosisme", emoji: "⚡", color: "from-orange-500 to-red-600" }
};

export default function CompareResultPage() {
  const router = useRouter();
  const [cards, setCards] = useState<CardStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedIds = sessionStorage.getItem("compareCardIds");
    if (!storedIds) {
      router.push("/compare");
      return;
    }

    const cardIds = JSON.parse(storedIds);

    fetch("/api/cards/compare", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cardIds })
    })
      .then((res) => res.json())
      .then((data) => {
        setCards(data.cards);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-12 h-12 border-4 border-violet-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (cards.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate-600">Aucune donnée à comparer</p>
      </div>
    );
  }

  // Calculer les contrastes et compatibilités
  const getContrasts = () => {
    const contrasts: Array<{ dimension: string; card1: string; card2: string; diff: number }> = [];
    
    for (let i = 0; i < cards.length; i++) {
      for (let j = i + 1; j < cards.length; j++) {
        const card1 = cards[i];
        const card2 = cards[j];
        
        card1.bigFiveAverages.forEach((avg1) => {
          const avg2 = card2.bigFiveAverages.find((a) => a.dimension === avg1.dimension);
          if (avg2) {
            const diff = Math.abs(avg1.average - avg2.average);
            if (diff > 1.5) {
              contrasts.push({
                dimension: avg1.dimension,
                card1: card1.prenom,
                card2: card2.prenom,
                diff
              });
            }
          }
        });
      }
    }
    
    return contrasts.sort((a, b) => b.diff - a.diff);
  };

  const getCompatibilities = () => {
    const compatibilities: Array<{ dimension: string; card1: string; card2: string; similarity: number }> = [];
    
    for (let i = 0; i < cards.length; i++) {
      for (let j = i + 1; j < cards.length; j++) {
        const card1 = cards[i];
        const card2 = cards[j];
        
        card1.bigFiveAverages.forEach((avg1) => {
          const avg2 = card2.bigFiveAverages.find((a) => a.dimension === avg1.dimension);
          if (avg2) {
            const diff = Math.abs(avg1.average - avg2.average);
            if (diff < 0.5) {
              compatibilities.push({
                dimension: avg1.dimension,
                card1: card1.prenom,
                card2: card2.prenom,
                similarity: 1 - diff / 4
              });
            }
          }
        });
      }
    }
    
    return compatibilities.sort((a, b) => b.similarity - a.similarity);
  };

  const contrasts = getContrasts();
  const compatibilities = getCompatibilities();

  return (
    <div className="max-w-2xl mx-auto p-4 pb-20">
      {/* Header */}
      <div className="mb-8">
        <Link href="/compare" className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 transition mb-4">
          <ArrowLeft className="w-4 h-4" />
          Nouvelle comparaison
        </Link>
        <h1 className="text-3xl font-black text-slate-900">🔄 Résultat de la comparaison</h1>
        <p className="text-slate-500 mt-1">Analyse des contrastes et compatibilités</p>
      </div>

      {/* Cartes comparées */}
      <div className="bg-white rounded-2xl p-5 border-2 border-slate-200 mb-6">
        <h2 className="text-lg font-black text-slate-900 mb-4">Cartes comparées</h2>
        <div className="flex gap-3 overflow-x-auto pb-2">
          {cards.map((card) => (
            <div key={card.id} className="flex-shrink-0 bg-slate-50 rounded-xl p-4 border border-slate-200 min-w-[120px]">
              <div className="text-4xl mb-2">{card.emoji}</div>
              <div className="font-bold text-slate-900">{card.prenom}</div>
              <div className="text-xs text-slate-500">{card.sceneCount} scènes</div>
            </div>
          ))}
        </div>
      </div>

      {/* Comparaison Big Five */}
      <div className="bg-white rounded-2xl p-5 border-2 border-slate-200 mb-6">
        <h2 className="text-lg font-black text-slate-900 mb-4">📊 Comparaison Big Five</h2>
        
        <div className="space-y-6">
          {Object.entries(DIMENSION_LABELS).map(([dim, config]) => (
            <div key={dim}>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">{config.emoji}</span>
                <span className="font-bold text-slate-900">{config.label}</span>
              </div>
              
              <div className="space-y-2">
                {cards.map((card) => {
                  const avg = card.bigFiveAverages.find((a) => a.dimension === dim);
                  const value = avg?.average || 0;
                  const width = ((value + 2) / 4) * 100; // -2 à +2 → 0% à 100%
                  
                  return (
                    <div key={card.id} className="flex items-center gap-3">
                      <span className="text-sm font-semibold text-slate-700 w-20 truncate">
                        {card.prenom}
                      </span>
                      <div className="flex-1 h-8 bg-slate-100 rounded-full overflow-hidden relative">
                        <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-slate-300 z-10" />
                        <div
                          className={`h-full bg-gradient-to-r ${config.color} rounded-full transition-all duration-500`}
                          style={{ 
                            width: `${Math.abs(value) * 25}%`,
                            marginLeft: value >= 0 ? "50%" : "auto",
                            marginRight: value < 0 ? "50%" : "auto"
                          }}
                        />
                      </div>
                      <span className="text-sm font-bold text-slate-900 w-12 text-right">
                        {value.toFixed(1)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Contrastes */}
      {contrasts.length > 0 && (
        <div className="bg-rose-50 rounded-2xl p-5 border-2 border-rose-200 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-6 h-6 text-rose-600" />
            <h2 className="text-lg font-black text-rose-900">⚠️ Contrastes majeurs</h2>
          </div>
          
          <div className="space-y-3">
            {contrasts.slice(0, 5).map((contrast, i) => (
              <div key={i} className="bg-white rounded-xl p-4 border border-rose-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-slate-900">
                    {DIMENSION_LABELS[contrast.dimension].emoji} {DIMENSION_LABELS[contrast.dimension].label}
                  </span>
                  <span className="text-xs font-bold text-rose-600 bg-rose-100 px-2 py-1 rounded-full">
                    Diff: {contrast.diff.toFixed(1)}
                  </span>
                </div>
                <p className="text-sm text-slate-600">
                  <span className="font-semibold">{contrast.card1}</span> et <span className="font-semibold">{contrast.card2}</span> ont des profils très différents sur cette dimension.
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Compatibilités */}
      {compatibilities.length > 0 && (
        <div className="bg-emerald-50 rounded-2xl p-5 border-2 border-emerald-200 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle className="w-6 h-6 text-emerald-600" />
            <h2 className="text-lg font-black text-emerald-900">✅ Points de compatibilité</h2>
          </div>
          
          <div className="space-y-3">
            {compatibilities.slice(0, 5).map((compat, i) => (
              <div key={i} className="bg-white rounded-xl p-4 border border-emerald-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-slate-900">
                    {DIMENSION_LABELS[compat.dimension].emoji} {DIMENSION_LABELS[compat.dimension].label}
                  </span>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-100 px-2 py-1 rounded-full">
                    {(compat.similarity * 100).toFixed(0)}% similaire
                  </span>
                </div>
                <p className="text-sm text-slate-600">
                  <span className="font-semibold">{compat.card1}</span> et <span className="font-semibold">{compat.card2}</span> partagent des traits similaires.
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Boutons d'action */}
      <div className="flex gap-3">
        <Link
          href="/compare"
          className="flex-1 py-3.5 px-4 rounded-2xl bg-gradient-to-r from-violet-500 to-purple-600 text-white font-bold text-center hover:brightness-110 transition-all shadow-lg"
        >
          Nouvelle comparaison
        </Link>
        <Link
          href="/"
          className="flex-1 py-3.5 px-4 rounded-2xl border-2 border-slate-300 text-slate-700 font-bold text-center hover:bg-slate-50 transition-all"
        >
          Accueil
        </Link>
      </div>
    </div>
  );
}
