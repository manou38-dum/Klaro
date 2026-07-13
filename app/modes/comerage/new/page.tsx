"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { MessageCircle, ArrowLeft, Sparkles } from "lucide-react";

export default function NewComerageScene() {
  const router = useRouter();
  const [scene, setScene] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (scene.trim().length < 50) {
      setError("Raconte-moi un peu plus de détails...");
      return;
    }

    setError(null);

    // Sauvegarder la scène et le mode immédiatement
    sessionStorage.setItem("selectedMode", "comerage");
    sessionStorage.setItem("lastScene", scene);
    sessionStorage.setItem("isAnalyzing", "true"); // Flag pour déclencher l'animation
    
    // Rediriger IMMÉDIATEMENT vers la page de résultat (l'animation va démarrer)
    router.push("/result");

    // Lancer l'analyse en arrière-plan (pendant que l'animation se déroule)
    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          scene: scene.trim(), 
          context: "comerage",
          degree: 3
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Erreur lors de l'analyse");

      // Sauvegarder le résultat (la page /result va le détecter et l'afficher)
      sessionStorage.setItem("analysisResult", JSON.stringify(data));
      sessionStorage.setItem("isAnalyzing", "false");
      
      // Forcer un re-render de la page /result pour afficher le résultat
      window.dispatchEvent(new Event("analysisComplete"));
    } catch (err) {
      sessionStorage.setItem("isAnalyzing", "false");
      sessionStorage.setItem("analysisError", err instanceof Error ? err.message : "Une erreur est survenue");
      window.dispatchEvent(new Event("analysisComplete"));
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <Link href="/modes/comerage" className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 transition mb-4">
        <ArrowLeft className="w-4 h-4" />
        Retour
      </Link>

      <div className="bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl p-5 text-white mb-6">
        <div className="flex items-center gap-3 mb-2">
          <MessageCircle className="w-8 h-8" />
          <h1 className="text-2xl font-black">Nouveau comérage</h1>
        </div>
        <p className="text-sm opacity-90">Raconte-moi la situation...</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">
            La scène 🎭
          </label>
          <textarea
            value={scene}
            onChange={(e) => setScene(e.target.value)}
            placeholder="Ex: Hier soir, Sarah a organisé un dîner. Elle a passé la soirée à faire des sous-entendus sur la relation de Marc et Julie. Thomas a essayé de calmer le jeu mais on sentait qu'il était mal à l'aise..."
            rows={8}
            className="w-full rounded-xl border-2 border-slate-200 p-4 text-base focus:border-pink-500 outline-none transition resize-none"
            required
          />
        </div>

        <div className="flex justify-between items-center text-sm">
          <span className={scene.length < 50 ? "text-amber-500" : "text-emerald-500"}>
            {scene.length < 50 ? `${50 - scene.length} caractères min.` : "✅ Prêt à décrypter"}
          </span>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={scene.trim().length < 50}
          className="w-full py-4 rounded-xl bg-gradient-to-r from-pink-500 to-rose-600 text-white font-bold text-lg hover:brightness-110 transition disabled:bg-slate-200 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <Sparkles className="w-5 h-5" />
          Décrypter les dynamiques
        </button>
      </form>
    </div>
  );
}