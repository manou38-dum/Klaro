"use client";

import { useState, useEffect } from "react";
import { AlertTriangle, Lightbulb, RotateCcw } from "lucide-react";
import ShareButton from "./ShareButton";

export default function ResultCard({ result }: any) {
  const [mode, setMode] = useState("pro");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const storedMode = sessionStorage.getItem("selectedMode") || "pro";
    setMode(storedMode);
    setTimeout(() => setIsVisible(true), 100);
  }, []);

  if (!result) {
    return <div className="text-center py-12">Chargement...</div>;
  }

  if (result.error) {
    return (
      <div className="max-w-md mx-auto text-center py-12">
        <AlertTriangle className="w-16 h-16 text-amber-500 mx-auto mb-4" />
        <h2 className="text-xl font-semibold mb-2">Analyse impossible</h2>
        <p className="text-slate-600 mb-4">{String(result.error)}</p>
        <a href="/" className="text-violet-600">Recommencer</a>
      </div>
    );
  }

  return (
    <div className={`max-w-md mx-auto ${isVisible ? "opacity-100" : "opacity-0"} transition-opacity`}>
      <div className="rounded-3xl shadow-2xl overflow-hidden bg-white ring-4 ring-blue-300">
        <div className="bg-gradient-to-br from-blue-500 to-indigo-700 p-6 text-white text-center">
          <div className="text-9xl mb-4">{result.personne?.emoji || "👤"}</div>
          <h2 className="text-4xl font-black mb-3">{result.personne?.prenom || "Inconnu"}</h2>
          <p className="text-lg">{String(result.insight_principal)}</p>
          <p className="text-sm mt-2">{result.confiance_globale}% confiance</p>
        </div>

        <div className="p-6 bg-slate-50">
          <h3 className="font-bold text-slate-700 mb-4">Analyse</h3>
          {result.conseil && (
            <div className="p-6 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl">
              <div className="flex items-start gap-3">
                <Lightbulb className="w-6 h-6" />
                <div>
                  <p className="text-xs uppercase opacity-80 mb-1">Conseil</p>
                  <p className="text-base">{String(result.conseil)}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-3 mt-6">
        <ShareButton result={result} />
        <a href="/" className="flex-1 py-3 px-4 rounded-2xl border-2 border-slate-300 text-slate-700 text-center font-bold">Nouvelle scène</a>
      </div>
    </div>
  );
}