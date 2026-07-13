"use client";

import { useEffect, useState } from "react";
import ResultCard from "@/components/ResultCard";
import { Brain, Scan, Users, MessageSquare } from "lucide-react";

export default function ResultPage() {
  const [result, setResult] = useState<any>(null);
  const [loadingStep, setLoadingStep] = useState(0);

  // Séquence d'animation de l'IA
  const loadingMessages = [
    { text: "Analyse des dynamiques de groupe...", icon: <Users className="w-16 h-16 text-violet-500" /> },
    { text: "Décodage des non-dits et tensions...", icon: <Scan className="w-16 h-16 text-violet-500" /> },
    { text: "Génération du profil psychologique...", icon: <Brain className="w-16 h-16 text-violet-500" /> },
    { text: "Finalisation de l'analyse...", icon: <MessageSquare className="w-16 h-16 text-violet-500" /> },
  ];

  useEffect(() => {
    const storedResult = sessionStorage.getItem("analysisResult");
    if (storedResult) {
      // On fait défiler les messages toutes les 600ms
      const interval = setInterval(() => {
        setLoadingStep((prev) => (prev + 1) % loadingMessages.length);
      }, 600);

      // On affiche le résultat après 2.4 secondes (4 étapes x 600ms) pour l'effet "IA qui travaille"
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

  // Écran d'animation "Scan IA"
  if (!result) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-slate-50 to-white px-4">
        <div className="relative mb-8">
          {/* Effet de radar / ping */}
          <div className="absolute inset-0 bg-violet-500 rounded-full opacity-20 animate-ping" />
          <div className="absolute inset-0 bg-violet-500 rounded-full opacity-40 animate-pulse" />
          
          {/* Icône centrale */}
          <div className="relative bg-white p-6 rounded-full shadow-2xl ring-4 ring-violet-100">
            <div className="animate-pulse">
              {loadingMessages[loadingStep].icon}
            </div>
          </div>
        </div>
        
        <div className="text-center space-y-4 max-w-md w-full">
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">
            Klaro IA analyse la scène
          </h2>
          
          {/* Texte qui change avec transition douce */}
          <p key={loadingStep} className="text-violet-600 font-semibold text-lg animate-fade-in-up">
            {loadingMessages[loadingStep].text}
          </p>
          
          {/* Barre de progression stylisée */}
          <div className="w-full bg-slate-200 rounded-full h-2.5 mt-8 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-violet-500 to-purple-600 h-2.5 rounded-full transition-all duration-500 ease-out shadow-lg"
              style={{ width: `${((loadingStep + 1) / loadingMessages.length) * 100}%` }}
            />
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