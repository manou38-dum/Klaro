"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import ResultCard from "@/components/ResultCard";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function SharePage() {
  const searchParams = useSearchParams();
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const data = searchParams.get("data");
    if (data) {
      try {
        const decoded = atob(data);
        const parsed = JSON.parse(decoded);
        setResult(parsed);
      } catch (e) {
        console.error("Erreur décodage:", e);
        setError(true);
      }
    } else {
      setError(true);
    }
  }, [searchParams]);

  if (error) {
    return (
      <div className="max-w-md mx-auto p-4 text-center">
        <p className="text-slate-600 mb-4">Ce lien n'est pas valide ou a expiré.</p>
        <Link href="/" className="text-violet-600 font-bold">Retour à l'accueil</Link>
      </div>
    );
  }

  if (!result) {
    return <div className="text-center py-12">Chargement...</div>;
  }

  return (
    <div className="max-w-md mx-auto p-4">
      <Link href="/" className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 transition mb-4">
        <ArrowLeft className="w-4 h-4" />
        Retour à l'accueil
      </Link>
      
      <div className="mb-4 text-center">
        <p className="text-xs text-slate-500">Analyse partagée via Klaro</p>
      </div>

      <ResultCard result={result} />
    </div>
  );
}