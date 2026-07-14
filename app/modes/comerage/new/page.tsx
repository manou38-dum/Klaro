"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { MessageCircle, ArrowLeft, Sparkles } from "lucide-react";

const INTENSITIES = [
  { 
    id: "light", 
    label: "Light", 
    emoji: "🌸", 
    desc: "Doux & bienveillant", 
    activeColor: "bg-emerald-500 text-white border-emerald-600 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" 
  },
  { 
    id: "epice", 
    label: "Épicé", 
    emoji: "🌶️", 
    desc: "Direct & mesuré", 
    activeColor: "bg-amber-500 text-white border-amber-600 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" 
  },
  { 
    id: "caliente", 
    label: "Caliente", 
    emoji: "🔥", 
    desc: "Cash & sans filtre", 
    activeColor: "bg-orange-500 text-white border-orange-600 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" 
  },
  { 
    id: "defouloir", 
    label: "Défouloir", 
    emoji: "💥", 
    desc: "Déchaîné & total", 
    activeColor: "bg-rose-600 text-white border-rose-700 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" 
  }
];

export default function NewComerageScene() {
  const router = useRouter();
  const [scene, setScene] = useState("");
  const [intensity, setIntensity] = useState("epice"); // Valeur par défaut
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (scene.trim().length < 50) {
      setError("Raconte-moi un peu plus de détails...");
      return;
    }

    // Sauvegarder la scène, le mode ET l'intensité
    sessionStorage.setItem("pendingScene", scene.trim());
    sessionStorage.setItem("pendingMode", "comerage");
    sessionStorage.setItem("pendingIntensity", intensity); // <-- NOUVEAU
    sessionStorage.removeItem("analysisResult");
    
    router.push("/result");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 via-rose-50 to-amber-50 pb-20">
      <div className="max-w-md mx-auto p-4">
        <Link href="/modes/comerage" className="flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-rose-600 transition mb-4">
          <ArrowLeft className="w-4 h-4" />
          Retour
        </Link>

        <div className="bg-gradient-to-br from-rose-500 to-orange-500 rounded-2xl p-5 text-white mb-6 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex items-center gap-3 mb-2">
            <MessageCircle className="w-8 h-8" />
            <h1 className="text-2xl font-black">Nouveau comérage</h1>
          </div>
          <p className="text-sm font-medium opacity-90">Raconte-moi la situation et choisis le ton...</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Zone de texte */}
          <div>
            <label className="block text-sm font-black text-slate-800 mb-2">La scène 🎭</label>
            <textarea
              value={scene}
              onChange={(e) => setScene(e.target.value)}
              placeholder="Ex: Hier soir, Sarah a organisé un dîner. Elle a passé la soirée à faire des sous-entendus sur la relation de Marc et Julie..."
              rows={6}
              className="w-full rounded-xl border-2 border-slate-300 p-4 text-base focus:border-rose-500 focus:ring-0 outline-none transition resize-none bg-white"
              required
            />
            <div className="flex justify-end mt-2">
              <span className={`text-xs font-bold ${scene.length < 50 ? "text-amber-600" : "text-emerald-600"}`}>
                {scene.length < 50 ? `${50 - scene.length} caractères min.` : "✅ Prêt à décrypter"}
              </span>
            </div>
          </div>

          {/* Sélecteur d'intensité */}
          <div>
            <label className="block text-sm font-black text-slate-800 mb-3">Niveau d'intensité 🌡️</label>
            <div className="grid grid-cols-2 gap-3">
              {INTENSITIES.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setIntensity(opt.id)}
                  className={`relative p-3 rounded-xl border-2 text-left transition-all active:scale-95 ${
                    intensity === opt.id
                      ? opt.activeColor
                      : "bg-white border-slate-200 text-slate-600 hover:border-slate-400 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.1)]"
                  }`}
                >
                  <div className="text-2xl mb-1">{opt.emoji}</div>
                  <div className="font-black text-sm">{opt.label}</div>
                  <div className={`text-[10px] font-medium leading-tight mt-1 ${intensity === opt.id ? "opacity-90" : "text-slate-500"}`}>
                    {opt.desc}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border-2 border-red-300 rounded-xl p-3 text-red-700 text-sm font-bold shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
              {error}
            </div>
          )}

          {/* Bouton d'action */}
          <button
            type="submit"
            disabled={scene.trim().length < 50}
            className="w-full py-4 rounded-xl bg-slate-900 text-white font-black text-lg hover:bg-slate-800 transition disabled:bg-slate-300 disabled:cursor-not-allowed flex items-center justify-center gap-2 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
          >
            <Sparkles className="w-5 h-5" />
            Décrypter les dynamiques
          </button>
        </form>
      </div>
    </div>
  );
}