"use client";

import { useState } from "react";
import { ArrowRight, Sparkles, AlertCircle, Flame, Home, Users, Briefcase } from "lucide-react";

const MODES = [
  {
    id: "pro",
    label: "Professionnel",
    icon: Briefcase,
    color: "blue",
    bg: "bg-blue-50",
    border: "border-blue-200",
    text: "text-blue-700",
    description: "Réunion, projet, management, négociation"
  },
  {
    id: "familial",
    label: "Familial",
    icon: Home,
    color: "rose",
    bg: "bg-rose-50",
    border: "border-rose-200",
    text: "text-rose-700",
    description: "Famille, parent/enfant, fratrie, dîner"
  },
  {
    id: "ami",
    label: "Amical",
    icon: Users,
    color: "emerald",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    text: "text-emerald-700",
    description: "Soirée, groupe d'amis, sortie, loisir"
  },
  {
    id: "pimente",
    label: "🌶️ Pimenté",
    icon: Flame,
    color: "orange",
    bg: "bg-orange-50",
    border: "border-orange-200",
    text: "text-orange-700",
    description: "Humour léger, zones de friction, vérité hard"
  },
  {
    id: "hardcore",
    label: "💀 Hardcore",
    icon: Flame,
    color: "red",
    bg: "bg-red-50",
    border: "border-red-200",
    text: "text-red-700",
    description: "Brut, cynique, sans filtre, névroses et mécanismes de défense"
  }
];

export default function SceneForm() {
    const [selectedMode, setSelectedMode] = useState<string>("");
  const [prenom, setPrenom] = useState("");
  const [emoji, setEmoji] = useState("🎭");
  const [prenomValidated, setPrenomValidated] = useState(false);
  const [scene, setScene] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    
if (!selectedMode) {
      setError("Choisissez d'abord un mode d'analyse.");
      return;
    }

    if (scene.trim().length < 80) {
      setError("Un peu plus de détails... au moins 3-4 phrases avec des actions concrètes.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prenom,
          emoji,
                   scene,
          context: selectedMode,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Erreur lors de l'analyse");
        setIsLoading(false);
        return;
      }

      sessionStorage.setItem("analysisResult", JSON.stringify(data));
      sessionStorage.setItem("selectedMode", selectedMode);
      window.location.href = "/result";

    } catch (err) {
      setError("Erreur de connexion. Vérifiez votre connexion internet.");
      setIsLoading(false);
    }
  };

    const canSubmit = selectedMode && scene.trim().length >= 80 && !isLoading;

  // ÉTAPE 0 : Demander le prénom en premier
  if (!prenomValidated) {
    return (
      <form onSubmit={(e) => { e.preventDefault(); if(prenom.trim()) setPrenomValidated(true); }} className="max-w-xl mx-auto space-y-6">
        <div className="text-center mb-8 space-y-3">
          <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Klaro</h1>
          <p className="text-slate-500">Commençons par vous présenter la personne à analyser</p>
        </div>

        <div className="space-y-3">
          <label className="block text-base font-semibold text-slate-800">
            Prénom ou Pseudo
          </label>
          <input
            type="text"
            value={prenom}
            onChange={(e) => setPrenom(e.target.value)}
            placeholder="Ex: Marie, Thomas, Alex..."
            className="w-full px-4 py-3 rounded-xl border border-slate-300 text-base focus:border-violet-500 focus:ring-2 focus:ring-violet-200 outline-none transition"
            maxLength={30}
            autoFocus
          />
        </div>

        <div className="space-y-3">
          <label className="block text-base font-semibold text-slate-800">
            Choisissez son émoji portrait
          </label>
          <div className="flex flex-wrap gap-2">
            {["🎭","🎯","🦊","🐉","🦅","🐺","🦁","🐯","🦄","🐙","🦋","🌙","⭐","🔥","💎","🎪","🎨","🚀","🌈","🍀"].map((e) => (
              <button
                key={e}
                type="button"
                onClick={() => setEmoji(e)}
                className={`text-2xl p-2 rounded-lg transition-all ${
                  emoji === e
                    ? "bg-violet-100 ring-2 ring-violet-500 scale-110"
                    : "hover:bg-gray-100"
                }`}
              >
                {e}
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={!prenom.trim()}
          className={`w-full py-4 px-6 rounded-xl text-lg font-semibold flex items-center justify-center gap-3 transition-all ${
            prenom.trim()
              ? "bg-violet-600 text-white hover:brightness-110 active:scale-[0.98] shadow-lg"
              : "bg-slate-200 text-slate-400 cursor-not-allowed"
          }`}
        >
          Continuer →
        </button>
      </form>
    );
  }

  if (!selectedMode) {
    // ÉTAPE 1 : Choix du mode
    return (
      <form onSubmit={handleSubmit} className="max-w-xl mx-auto space-y-6">
        <div className="text-center mb-8 space-y-3">
          <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Klaro</h1>
          <p className="text-slate-500">Quel type de situation voulez-vous analyser ?</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {MODES.map((mode) => (
            <button
              key={mode.id}
              type="button"
              onClick={() => setSelectedMode(mode.id)}
              className={`p-4 rounded-xl border-2 text-left transition-all hover:scale-[1.02] active:scale-[0.98] ${
                selectedMode === mode.id 
                  ? `${mode.bg} ${mode.border} ${mode.text} shadow-md` 
                  : "bg-white border-slate-200 hover:border-slate-300"
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <mode.icon className="w-6 h-6" />
                <span className="font-semibold">{mode.label}</span>
              </div>
              <p className={`text-xs ${selectedMode === mode.id ? "" : "text-slate-400"}`}>
                {mode.description}
              </p>
            </button>
          ))}
        </div>

        <div className="bg-violet-50 rounded-lg p-4 flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-violet-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-violet-800">
            <p className="font-medium">Chaque mode adopte une grille de lecture adaptée.</p>
            <p className="opacity-70 mt-1">Pro → leadership & efficacité. Familial → dynamique de rôle. Amical → personnalité sociale. Pimenté → les non-dits drôles.</p>
          </div>
        </div>

        {error && !error.includes("scene") && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-600 text-sm text-center">
            {error}
          </div>
        )}
      </form>
    );
  }

  // ÉTAPE 2 : Description de la scène
  const currentMode = MODES.find(m => m.id === selectedMode);

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto space-y-5">
      {/* Retour */}
      <button 
        type="button"
        onClick={() => { setSelectedMode(""); setScene(""); }}
        className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 transition"
      >
        ← Changer de mode
      </button>

      {/* Header compact */}
      <div className={`${currentMode?.bg} ${currentMode?.border} ${currentMode?.text} rounded-xl p-4 flex items-center justify-between`}>
        <div className="flex items-center gap-3">
          {currentMode && <currentMode.icon className="w-6 h-6" />}
          <span className="font-semibold">Mode : {currentMode?.label}</span>
        </div>
        <span className="text-xs opacity-70">1/2</span>
      </div>

      <div className="space-y-3">
        <label className="block text-base font-semibold text-slate-800">
          Décrivez la scène
        </label>
        
        <textarea
          value={scene}
          onChange={(e) => setScene(e.target.value)}
          placeholder={
            selectedMode === "pimente"
              ? "Racontez-nous LE moment gênant, la tension palpable, ce qui a rendu la chose étrange ou drôle..."
              : "Qui ? Où ? Qu'est-ce qui s'est passé exactement ? Gestes, mots, silences, regards..."
          }
          rows={10}
          className="w-full rounded-xl border border-slate-300 p-4 text-base focus:border-violet-500 focus:ring-2 focus:ring-violet-200 outline-none transition resize-y"
          required
        />

        <div className="flex justify-between text-xs">
          <span className={scene.length < 80 ? "text-amber-600" : "text-slate-500"}>
            {scene.length < 80
              ? `${80 - scene.length} caractères minimum`
              : `${scene.length} caractères ✅`}
          </span>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-600 text-sm">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={!canSubmit}
        className={`w-full py-4 px-6 rounded-xl text-lg font-semibold flex items-center justify-center gap-3 transition-all ${
          canSubmit
            ? `${currentMode?.bg.replace('50', '600')} ${currentMode?.text.replace('700', '100')} hover:brightness-110 active:scale-[0.98] shadow-lg`
            : "bg-slate-200 text-slate-400 cursor-not-allowed"
        }`}
      >
        {isLoading ? (
          <>
            <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
            Analyse en cours...
          </>
        ) : (
          <>
            <Sparkles className="w-5 h-5" />
            Analyser cette scène
            <ArrowRight className="w-5 h-5" />
          </>
        )}
      </button>
    </form>
  );
}