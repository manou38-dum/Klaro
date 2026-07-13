"use client";

import { useEffect, useState } from "react";
import ResultCard from "@/components/ResultCard";
import { Brain, Scan, Users, MessageSquare, Sparkles } from "lucide-react";

export default function ResultPage() {
  const [result, setResult] = useState<any>(null);
  const [loadingStep, setLoadingStep] = useState(0);

  // Séquence d'animation de l'IA (plus visible et dynamique)
  const loadingMessages = [
    { text: "Analyse des dynamiques de groupe...", icon: <Users className="w-20 h-20 text-violet-400" /> },
    { text: "Décodage des non-dits et tensions...", icon: <Scan className="w-20 h-20 text-violet-400" /> },
    { text: "Génération du profil psychologique...", icon: <Brain className="w-20 h-20 text-violet-400" /> },
    { text: "Finalisation de l'analyse...", icon: <Sparkles className="w-20 h-20 text-violet-400" /> },
  ];

  useEffect(() => {
    const storedResult = sessionStorage.getItem("analysisResult");
    if (storedResult) {
      // On fait défiler les messages toutes les 600ms
      const interval = setInterval(() => {
        setLoadingStep((prev) => (prev + 1) % loadingMessages.length);
      }, 600);

      // On affiche le résultat après 2.4 secondes pour l'effet "IA qui travaille"
      const timeout = setTimeout(() => {
        clearInterval(interval);
        setResult(JSON.parse(storedResult));
      }, 2400);

      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
      };
    }
  }, []);

  // Écran d'animation "Scan IA" (Mode sombre pour effet dramatique)
  if (!result) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 px-4 relative overflow-hidden">
        {/* Effet de fond lumineux (Glow) */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-violet-600 rounded-full blur-[100px] opacity-30 animate-pulse" />
        
        <div className="relative z-10 flex flex-col items-center space-y-8 max-w-md w-full">
          {/* Cercle pulsant avec icône */}
          <div className="relative">
            <div className="absolute inset-0 bg-violet-500 rounded-full opacity-30 animate-ping" />
            <div className="absolute inset-0 bg-violet-500 rounded-full opacity-20 animate-pulse scale-110" />
            <div className="relative bg-slate-800 p-8 rounded-full shadow-2xl ring-2 ring-violet-500/50 flex items-center justify-center">
              <div key={loadingStep} className="animate-bounce">
                {loadingMessages[loadingStep].icon}
              </div>
            </div>
          </div>
          
          <div className="text-center space-y-4 w-full">
            <h2 className="text-3xl font-black text-white tracking-tight uppercase">
              Klaro IA
            </h2>
            
            {/* Texte qui change avec une clé pour forcer le re-rendu et l'animation */}
            <p key={loadingStep} className="text-violet-300 font-semibold text-xl transition-all duration-300 ease-in-out transform translate-y-0 opacity-100">
              {loadingMessages[loadingStep].text}
            </p>
            
            {/* Barre de progression stylisée et lumineuse */}
            <div className="w-full bg-slate-800 rounded-full h-3 mt-8 overflow-hidden ring-1 ring-slate-700">
              <div 
                className="bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 h-3 rounded-full transition-all duration-500 ease-out shadow-[0_0_15px_rgba(139,92,246,0.7)]"
                style={{ width: `${((loadingStep + 1) / loadingMessages.length) * 100}%` }}
              />
            </div>
            
            <p className="text-slate-500 text-sm mt-4">
              Analyse en cours... {Math.round(((loadingStep + 1) / loadingMessages.length) * 100)}%
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Affichage du résultat (inchangé)
  const mode = result.mode || "comerage";

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-8 px-4">
      <ResultCard result={result} mode={mode} isVisible={true} />
    </main>
      );
}