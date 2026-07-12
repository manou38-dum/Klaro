"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import ResultCard from "@/components/ResultCard";

export default function SharePage() {
  const searchParams = useSearchParams();
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    const data = searchParams.get("data");
    if (data) {
      try {
        const decoded = decodeURIComponent(escape(atob(data)));
        setResult(JSON.parse(decoded));
      } catch (e) {
        console.error("Erreur décodage:", e);
      }
    }
  }, [searchParams]);

  if (!result) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-violet-600 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-slate-600">Chargement...</p>
        </div>
      </div>
    );
  }

  const mode = result.mode || "comerage";

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-8 px-4">
      <ResultCard result={result} mode={mode} isVisible={true} />
    </div>
  );
}