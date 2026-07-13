"use client";

import { useEffect, useState } from "react";
import ResultCard from "@/components/ResultCard";
import { Brain, Scan, Users, Sparkles } from "lucide-react";

export default function ResultPage() {
  const [result, setResult] = useState<any>(null);
  const [loadingStep, setLoadingStep] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadingMessages = [
    { text: "Analyse des dynamiques de groupe...", icon: <Users className="w-20 h-20 text-violet-400" /> },
    { text: "Décodage des non-dits et tensions...", icon: <Scan className="w-20 h-20 text-violet-400" /> },
    { text: "Génération du profil psychologique...", icon: <Brain className="w-20 h-20 text-violet-400" /> },
    { text: "Finalisation de l'analyse...", icon: <Sparkles className="w-20 h-20 text-violet-400" /> },
  ];

  useEffect(() => {
    // Cas 1 : résultat déjà en cache
    const existingResult = sessionStorage.getItem("analysisResult");
    if (existingResult) {
      setResult(JSON.parse(existingResult));
      return;
    }

    // Cas 2 : scène en attente → lancer l'animation + l'API
    const pendingScene = sessionStorage.getItem("pendingScene");
    const pendingMode = sessionStorage.getItem("pendingMode") || "comerage";

    if (pendingScene) {
      setIsAnalyzing(true);
      sessionStorage.removeItem("pendingScene");
      sessionStorage.removeItem("pendingMode");

      // Animation : faire défiler les messages
      const interval = setInterval(() => {
        setLoadingStep((prev) => (prev + 1) % loadingMessages.length);
      }, 800);

      // Lancer l'API depuis cette page
      fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scene: pendingScene, context: pendingMode, degree: 3 }),
      })
        .then((res) => res.json())
        .then((data) => {
          clearInterval(interval);
          if (data.error) {
            setError(data.error);
          } else {
            sessionStorage.setItem("analysisResult", JSON.stringify(data));
            setResult(data);
          }
          setIsAnalyzing(false);
        })
        .catch((err) => {
          clearInterval(interval);
          setError("Une erreur est survenue");
          setIsAnalyzing(false);
        });

      return () => clearInterval(interval);
    }
  }, []);

  // Erreur
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
        <div className="max-w-md w-full bg-white rounded-2xl p-6 shadow-xl border-2 border-red-200 text-center">
          <h2 className="text-2xl font-black text-red-600 mb-3">Erreur</h2>
          <p className="text-slate-700 mb-4">{error}</p>
          <a href="/" className="inline-block px-6 py-3 bg-violet-600 text-white font-bold rounded-xl hover:bg-violet-700 transition">Retour</a>
        </div>
      </div>
    );
  }

  // Animation "Scan IA"
  if (isAnalyzing || !result) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 px-4 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-violet-600 rounded-full blur-[100px] opacity-30 animate-pulse" />
        <div className="relative z-10 flex flex-col items-center space-y-8 max-w-md w-full">
          <div className="relative">
            <div className="absolute inset-0 bg-violet-500 rounded-full opacity-30 animate-ping" />
            <div className="relative bg-slate-800 p-8 rounded-full shadow-2xl ring-2 ring-violet-500/50 flex items-center justify-center">
              <div key={loadingStep} className="animate-bounce">
                {loadingMessages[loadingStep].icon}
              </div>
            </div>
          </div>
          <div className="text-center space-y-4 w-full">
            <h2 className="text-3xl font-black text-white tracking-tight uppercase">Klaro IA</h2>
            <p key={loadingStep} className="text-violet-300 font-semibold text-xl">{loadingMessages[loadingStep].text}</p>
            <div className="w-full bg-slate-800 rounded-full h-3 mt-8 overflow-hidden ring-1 ring-slate-700">
              <div
                className="bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 h-3 rounded-full transition-all duration-700 ease-out shadow-[0_0_15px_rgba(139,92,246,0.7)]"
                style={{ width: `${((loadingStep + 1) / loadingMessages.length) * 100}%` }}
              />
            </div>
            <p className="text-slate-500 text-sm mt-4">Analyse en cours...</p>
          </div>
        </div>
      </div>
    );
  }

  // Résultat
  const mode = result.mode || "comerage";
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-8 px-4">
      <ResultCard result={result} mode={mode} isVisible={true} />
    </main>
  );
}