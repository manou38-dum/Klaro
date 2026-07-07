"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Sparkles, AlertTriangle, Zap, Brain, Flame, Eye, Lightbulb } from "lucide-react";

interface UsageInfo {
  plan: string;
  used: number;
  limit: number;
  remaining: number;
}

const DEGREES = [
  { id: 1, label: "Intuition", icon: Zap, color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-200", desc: "3 mots-clés + ressenti" },
  { id: 2, label: "Éclairage", icon: Lightbulb, color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-200", desc: "Traits simples (Sympa, Timide...)" },
  { id: 3, label: "Analyse", icon: Eye, color: "text-violet-600", bg: "bg-violet-50", border: "border-violet-200", desc: "Big Five + Rapports (Standard)" },
  { id: 4, label: "Profondeur", icon: Brain, color: "text-indigo-600", bg: "bg-indigo-50", border: "border-indigo-200", desc: "DSM-5 + Mécanismes de défense" },
  { id: 5, label: "Hardcore", icon: Flame, color: "text-rose-600", bg: "bg-rose-50", border: "border-rose-200", desc: "Sans filtre, cynique, névroses" },
];

export default function AddSceneForm({ mode, cardId }: { mode: string; cardId: string }) {
  const router = useRouter();
  const [scene, setScene] = useState("");
  const [degree, setDegree] = useState(3);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [usage, setUsage] = useState<UsageInfo | null>(null);

  useEffect(() => {
    fetch("/api/usage")
      .then((res) => res.json())
      .then((data) => setUsage(data))
      .catch(console.error);
  }, []);

  const getUsageColor = () => {
    if (!usage) return "bg-slate-50 border-slate-200";
    if (usage.plan === "premium") return "bg-violet-50 border-violet-200";
    if (usage.remaining === 0) return "bg-rose-50 border-rose-200";
    if (usage.remaining === 1) return "bg-amber-50 border-amber-200";
    return "bg-emerald-50 border-emerald-200";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const minChars = degree <= 2 ? 20 : 80;
    if (scene.trim().length < minChars) {
      setError(`Un peu plus de détails... au moins ${minChars} caractères.`);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scene: scene.trim(), context: mode, cardId, degree }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Erreur lors de l'analyse");

      const saveResponse = await fetch("/api/scenes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cardId, sceneText: scene.trim(), result: data }),
      });

      const saveData = await saveResponse.json();
      
      if (saveData.limitReached) {
        setError(saveData.message || "Limite atteinte !");
        setIsLoading(false);
        return;
      }

      if (!saveResponse.ok) throw new Error(saveData.error || "Erreur sauvegarde");

      sessionStorage.setItem("selectedMode", mode);
      sessionStorage.setItem("analysisResult", JSON.stringify(data));
      router.push("/result");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Compteur d'usage */}
      {usage && (
        <div className={`rounded-xl p-3 border-2 ${getUsageColor()}`}>
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="font-semibold text-slate-700">
              {usage.plan === "premium" ? "💎 Premium" : "🆓 Plan Gratuit"}
            </span>
            <span className="font-bold">
              {usage.plan === "premium" ? "Illimité ✓" : `${usage.used} / ${usage.limit} analyses ce mois`}
            </span>
          </div>
          {usage.plan === "free" && (
            <div className="h-2 bg-white rounded-full overflow-hidden mb-2">
              <div 
                className={`h-full transition-all duration-500 ${
                  usage.remaining === 0 ? "bg-rose-500" : usage.remaining === 1 ? "bg-amber-500" : "bg-emerald-500"
                }`}
                style={{ width: `${Math.min(100, (usage.used / usage.limit) * 100)}%` }}
              />
            </div>
          )}
          {usage.remaining === 0 && usage.plan === "free" && (
            <div className="space-y-2">
              <p className="text-sm text-rose-700 font-semibold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" /> Limite atteinte !
              </p>
              <Link href="/pricing" className="block w-full py-2.5 px-4 bg-gradient-to-r from-violet-600 to-purple-600 text-white text-center font-bold rounded-lg hover:brightness-110 transition text-sm">
                🚀 Passer à Premium (9,99€/mois)
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Sélecteur de degré */}
      <div>
        <label className="block text-sm font-bold text-slate-900 mb-3">
          Niveau d'analyse souhaité
        </label>
        <div className="grid grid-cols-5 gap-2">
          {DEGREES.map((d) => {
            const Icon = d.icon;
            const isActive = degree === d.id;
            return (
              <button
                key={d.id}
                type="button"
                onClick={() => setDegree(d.id)}
                className={`flex flex-col items-center p-2 rounded-xl border-2 transition-all ${
                  isActive ? `${d.bg} ${d.border} scale-105 shadow-sm` : "bg-white border-slate-100 hover:border-slate-300"
                }`}
              >
                <Icon className={`w-5 h-5 mb-1 ${isActive ? d.color : "text-slate-400"}`} />
                <span className={`text-[10px] font-bold ${isActive ? d.color : "text-slate-500"}`}>
                  {d.label}
                </span>
              </button>
            );
          })}
        </div>
        <p className="text-xs text-slate-500 mt-2 text-center italic">
          {DEGREES.find(d => d.id === degree)?.desc}
        </p>
      </div>

      {/* Zone de texte */}
      <textarea
        value={scene}
        onChange={(e) => setScene(e.target.value)}
        placeholder={degree <= 2 ? "Décrivez brièvement la situation..." : "Qui ? Où ? Qu'est-ce qui s'est passé exactement ? Gestes, mots, silences..."}
        rows={degree <= 2 ? 3 : 6}
        className="w-full rounded-xl border border-slate-200 p-3 text-base focus:border-violet-500 focus:ring-2 focus:ring-violet-100 outline-none transition resize-none bg-slate-50"
      />
      
      <div className="flex justify-between items-center">
        <span className={`text-xs ${scene.length < (degree <= 2 ? 20 : 80) ? "text-amber-500" : "text-emerald-500"}`}>
          {scene.length < (degree <= 2 ? 20 : 80) ? `${(degree <= 2 ? 20 : 80) - scene.length} caractères min.` : "✅ Prêt à analyser"}
        </span>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <button
        type="submit"
        disabled={scene.trim().length < (degree <= 2 ? 20 : 80) || isLoading}
        className="w-full py-3.5 rounded-xl text-base font-semibold flex items-center justify-center gap-2 transition-all bg-violet-600 text-white hover:bg-violet-700 active:scale-[0.98] shadow-md disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
        ) : (
          <>
            <Sparkles className="w-5 h-5" />
            Analyser (Niveau {degree})
          </>
        )}
      </button>
    </form>
  );
}
