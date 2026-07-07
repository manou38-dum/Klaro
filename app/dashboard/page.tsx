"use client";

import { useUser } from "@clerk/nextjs";
import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Sparkles, Users, GitCompareArrows, BarChart3, ArrowRight } from "lucide-react";

export default function DashboardPage() {
  const { user } = useUser();
  const { isLoaded } = useAuth();
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    fetch("/api/stats")
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch(console.error);
  }, []);

  if (!isLoaded) {
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
        <Link href="/" className="text-sm text-slate-500 hover:text-slate-800 transition mb-4 inline-block">
          ← Retour à l'accueil
        </Link>
        
        <div className="bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
          <p className="text-sm opacity-80 mb-1">Bonjour</p>
          <h1 className="text-3xl font-black mb-2">
            {user?.firstName || "Utilisateur"} 
          </h1>
          <p className="text-sm opacity-90">
            Prêt à analyser une nouvelle scène ?
          </p>
        </div>
      </div>

      {/* Actions rapides */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
        <Link
          href="/"
          className="group bg-gradient-to-br from-violet-50 to-purple-50 border-2 border-violet-200 rounded-2xl p-5 hover:border-violet-400 hover:shadow-lg transition-all"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-violet-500 text-white p-2 rounded-lg">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900">Nouvelle analyse</h3>
          </div>
          <p className="text-sm text-slate-600">
            Décrivez une scène et obtenez une analyse comportementale
          </p>
          <div className="mt-3 text-violet-600 font-semibold text-sm flex items-center gap-1 group-hover:translate-x-1 transition">
            Commencer <ArrowRight className="w-4 h-4" />
          </div>
        </Link>

        <Link
          href="/team/new"
          className="group bg-gradient-to-br from-indigo-50 to-blue-50 border-2 border-indigo-200 rounded-2xl p-5 hover:border-indigo-400 hover:shadow-lg transition-all"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-indigo-500 text-white p-2 rounded-lg">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900">Mode Équipe</h3>
          </div>
          <p className="text-sm text-slate-600">
            Analysez la dynamique d'un groupe
          </p>
          <div className="mt-3 text-indigo-600 font-semibold text-sm flex items-center gap-1 group-hover:translate-x-1 transition">
            Créer une équipe <ArrowRight className="w-4 h-4" />
          </div>
        </Link>

        <Link
          href="/compare"
          className="group bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-200 rounded-2xl p-5 hover:border-emerald-400 hover:shadow-lg transition-all"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-emerald-500 text-white p-2 rounded-lg">
              <GitCompareArrows className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900">Comparer</h3>
          </div>
          <p className="text-sm text-slate-600">
            Comparez 2-3 profils côte à côte
          </p>
          <div className="mt-3 text-emerald-600 font-semibold text-sm flex items-center gap-1 group-hover:translate-x-1 transition">
            Comparer <ArrowRight className="w-4 h-4" />
          </div>
        </Link>

        <Link
          href="/stats"
          className="group bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl p-5 hover:border-amber-400 hover:shadow-lg transition-all"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-amber-500 text-white p-2 rounded-lg">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900">Statistiques</h3>
          </div>
          <p className="text-sm text-slate-600">
            Visualisez votre activité et évolutions
          </p>
          <div className="mt-3 text-amber-600 font-semibold text-sm flex items-center gap-1 group-hover:translate-x-1 transition">
            Voir les stats <ArrowRight className="w-4 h-4" />
          </div>
        </Link>
      </div>

      {/* Stats rapides */}
      {stats && (
        <div className="bg-white rounded-2xl p-5 border-2 border-slate-200">
          <h2 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-violet-600" />
            Votre activité
          </h2>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-violet-50 rounded-xl p-4 text-center">
              <div className="text-3xl font-black text-violet-600">
                {stats.totalScenes || 0}
              </div>
              <div className="text-xs text-slate-600 mt-1">Analyses totales</div>
            </div>
            
            <div className="bg-emerald-50 rounded-xl p-4 text-center">
              <div className="text-3xl font-black text-emerald-600">
                {stats.totalCards || 0}
              </div>
              <div className="text-xs text-slate-600 mt-1">Personnes suivies</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
