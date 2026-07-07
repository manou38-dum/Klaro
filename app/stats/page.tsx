"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, TrendingUp, Users, BarChart3, Calendar } from "lucide-react";

interface Stats {
  totalScenes: number;
  totalCards: number;
  topCards: Array<{
    id: string;
    prenom: string;
    emoji: string;
    mode: string;
    sceneCount: number;
  }>;
  scenesByDay: Record<string, number>;
  cardsByMode: Array<{
    mode: string;
    count: number;
  }>;
}

const MODE_LABELS: Record<string, string> = {
  pro: "💼 Pro",
  familial: "🏠 Familial",
  ami: "🤝 Amical",
  pimente: "🌶️ Pimenté",
  hardcore: "💀 Hardcore"
};

export default function StatsPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/stats")
      .then((res) => res.json())
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-12 h-12 border-4 border-violet-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate-600">Erreur lors du chargement</p>
      </div>
    );
  }

  // Calculer le max pour le graphique
  const maxScenesPerDay = Math.max(...Object.values(stats.scenesByDay), 1);

  return (
    <div className="max-w-2xl mx-auto p-4 pb-20">
      {/* Header */}
      <div className="mb-8">
        <Link href="/" className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 transition mb-4">
          <ArrowLeft className="w-4 h-4" />
          Retour
        </Link>
        <h1 className="text-3xl font-black text-slate-900">📊 Statistiques</h1>
        <p className="text-slate-500 mt-1">Vue d'ensemble de vos analyses</p>
      </div>

      {/* Cards principales */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl p-5 text-white shadow-lg">
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider opacity-80">Scènes</span>
          </div>
          <div className="text-4xl font-black">{stats.totalScenes}</div>
          <p className="text-xs opacity-80 mt-1">analyses totales</p>
        </div>

        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-5 text-white shadow-lg">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider opacity-80">Cartes</span>
          </div>
          <div className="text-4xl font-black">{stats.totalCards}</div>
          <p className="text-xs opacity-80 mt-1">personnes analysées</p>
        </div>
      </div>

      {/* Graphique d'évolution */}
      <div className="bg-white rounded-2xl p-5 border-2 border-slate-200 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="w-5 h-5 text-violet-600" />
          <h2 className="text-lg font-black text-slate-900">Évolution (30 derniers jours)</h2>
        </div>
        
        {Object.keys(stats.scenesByDay).length > 0 ? (
          <div className="space-y-2">
            {Object.entries(stats.scenesByDay)
              .sort(([a], [b]) => a.localeCompare(b))
              .slice(-10) // Derniers 10 jours
              .map(([date, count]) => (
                <div key={date} className="flex items-center gap-3">
                  <span className="text-xs text-slate-500 w-20">
                    {new Date(date).toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit" })}
                  </span>
                  <div className="flex-1 h-6 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-violet-500 to-purple-600 rounded-full transition-all duration-500"
                      style={{ width: `${(count / maxScenesPerDay) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-bold text-slate-700 w-8 text-right">{count}</span>
                </div>
              ))}
          </div>
        ) : (
          <p className="text-sm text-slate-400 text-center py-8">Aucune donnée pour le moment</p>
        )}
      </div>

      {/* Répartition par mode */}
      <div className="bg-white rounded-2xl p-5 border-2 border-slate-200 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-emerald-600" />
          <h2 className="text-lg font-black text-slate-900">Répartition par mode</h2>
        </div>
        
        <div className="space-y-3">
          {stats.cardsByMode.map((item) => {
            const percentage = stats.totalCards > 0 ? (item.count / stats.totalCards) * 100 : 0;
            return (
              <div key={item.mode}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-semibold text-slate-700">
                    {MODE_LABELS[item.mode] || item.mode}
                  </span>
                  <span className="text-sm font-bold text-slate-900">
                    {item.count} ({percentage.toFixed(0)}%)
                  </span>
                </div>
                <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Top cartes */}
      <div className="bg-white rounded-2xl p-5 border-2 border-slate-200">
        <h2 className="text-lg font-black text-slate-900 mb-4">🏆 Cartes les plus analysées</h2>
        
        {stats.topCards.length > 0 ? (
          <div className="space-y-3">
            {stats.topCards.map((card, index) => (
              <Link
                key={card.id}
                href={`/modes/${card.mode}/${card.id}`}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition"
              >
                <div className="text-2xl font-black text-slate-300 w-8">
                  #{index + 1}
                </div>
                <div className="text-4xl">{card.emoji}</div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-slate-900 truncate">{card.prenom}</div>
                  <div className="text-xs text-slate-500">{MODE_LABELS[card.mode]}</div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-black text-violet-600">{card.sceneCount}</div>
                  <div className="text-[10px] text-slate-400 uppercase">scènes</div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-400 text-center py-8">Aucune carte pour le moment</p>
        )}
      </div>
    </div>
  );
}