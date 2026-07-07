"use client";

import { useEffect, useState } from "react";
import { AnalysisResult } from "@/lib/mistral";
import ResultCard from "@/components/ResultCard";

export default function ResultPage() {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem("analysisResult");
      if (stored) {
        setResult(JSON.parse(stored));
      } else {
        setError("Aucun résultat trouvé. Veuillez analyser une scène d'abord.");
      }
    } catch {
      setError("Erreur lors du chargement du résultat.");
    }
  }, []);

  if (error) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-violet-50 to-white">
        <div className="max-w-2xl mx-auto px-4 py-24 text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">Oups !</h1>
          <p className="text-slate-600 mb-8">{error}</p>
          <a
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-violet-600 text-white rounded-xl font-medium hover:bg-violet-700 transition"
          >
            ← Analyser une scène
          </a>
        </div>
      </main>
    );
  }

  if (!result) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-violet-50 to-white">
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin w-8 h-8 border-4 border-violet-600 border-t-transparent rounded-full" />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-violet-50 to-white">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <ResultCard result={result} />
      </div>
    </main>
  );
}