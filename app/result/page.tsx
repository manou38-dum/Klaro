"use client";

import { useEffect, useState } from "react";
import ResultCard from "@/components/ResultCard";

export default function ResultPage() {
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    const storedResult = sessionStorage.getItem("analysisResult");
    if (storedResult) {
      setResult(JSON.parse(storedResult));
    }
  }, []);

  if (!result) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-violet-600 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-slate-600">Chargement de l'analyse...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-8 px-4">
      <ResultCard result={result} />
    </main>
  );
}