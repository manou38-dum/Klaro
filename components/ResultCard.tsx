"use client";

import { useState, useEffect } from "react";
import {
  AlertTriangle,
  Crown,
  Users,
  Zap,
  Lightbulb,
  RotateCcw,
  Sparkles,
  Home,
  Briefcase,
  Flame,
} from "lucide-react";
import ShareButton from "./ShareButton";
import BigFiveGauge from "./BigFiveGauge";

const MODE_CONFIG: any = {
  pro: { icon: Briefcase, label: "Professionnel", gradient: "from-blue-500 to-indigo-700", ring: "ring-blue-300", accent: "text-blue-600" },
  familial: { icon: Home, label: "Familial", gradient: "from-rose-500 to-pink-700", ring: "ring-rose-300", accent: "text-rose-600" },
  ami: { icon: Users, label: "Amical", gradient: "from-emerald-500 to-teal-700", ring: "ring-emerald-300", accent: "text-emerald-600" },
  social: { icon: Briefcase, label: "Social", gradient: "from-amber-500 to-orange-700", ring: "ring-amber-300", accent: "text-amber-600" },
  hardcore: { icon: Flame, label: "Hardcore", gradient: "from-gray-900 to-black", ring: "ring-red-900", accent: "text-red-500" }
};

export default function ResultCard({ result }: any) {
  const [activeTab, setActiveTab] = useState("autorite");
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

  // SÉCURISATION TOTALE - TOUS les tableaux sont sécurisés
  const traits = (result.traits && Array.isArray(result.traits)) ? result.traits : [];
  const zoneOmbre = (result.zone_ombre && Array.isArray(result.zone_ombre)) ? result.zone_ombre : [];
  const motsCles = (result.mots_cles && Array.isArray(result.mots_cles)) ? result.mots_cles : [];
  const rapports = result.rapports || { autorite: "", pairs: "", action: "" };
  const degree = result.degree || 3;

  const modeConfig = MODE_CONFIG[mode] || MODE_CONFIG.pro;
  const isHardcore = mode === "hardcore";

  // Affichage simplifié niveaux 1-2
  if (degree <= 2 && traits.length === 0) {
    return (
      <div className={`max-w-md mx-auto ${isVisible ? "opacity-100" : "opacity-0"} transition-opacity`}>
        <div className={`rounded-3xl shadow-2xl overflow-hidden bg-white ring-4 ${modeConfig.ring}`}>
          <div className={`bg-gradient-to-br ${modeConfig.gradient} p-6 text-white text-center`}>
            <div className="text-9xl mb-4">{result.personne?.emoji || "👤"}</div>
            <h2 className="text-4xl font-black mb-3">{result.personne?.prenom || "Inconnu"}</h2>
            <p className="text-lg">{String(result.insight_principal)}</p>
          </div>
          
          <div className="p-6 space-y-4 bg-slate-50">
            {motsCles.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {motsCles.map((mot: any, i: number) => (
                  <span key={i} className="px-3 py-1 bg-violet-100 text-violet-700 rounded-full text-sm">#{String(mot)}</span>
                ))}
              </div>
            )}
            {result.ressenti_global && <p className="italic text-slate-600">{String(result.ressenti_global)}</p>}
            {result.conseil_rapide && <p className="text-slate-700"><strong>Conseil:</strong> {String(result.conseil_rapide)}</p>}
          </div>

          <div className="flex gap-3 p-6">
            <ShareButton result={result} />
            <a href="/" className="flex-1 py-3 px-4 rounded-2xl border-2 border-slate-300 text-center">Nouvelle scène</a>
          </div>
        </div>
      </div>
    );
  }

  // Affichage standard niveaux 3-5
  return (
    <div className={`max-w-md mx-auto ${isVisible ? "opacity-100" : "opacity-0"} transition-opacity`}>
      <div className={`rounded-3xl shadow-2xl overflow-hidden bg-white ring-4 ${modeConfig.ring}`}>
        <div className={`bg-gradient-to-br ${modeConfig.gradient} p-6 text-white text-center`}>
          <div className="text-9xl mb-4">{result.personne?.emoji || "👤"}</div>
          <h2 className="text-4xl font-black mb-3">{result.personne?.prenom || "Inconnu"}</h2>
          <p className="text-lg">{String(result.insight_principal)}</p>
          <p className="text-sm mt-2">{result.confiance_globale}% confiance</p>
        </div>

        <div className="p-6 space-y-4 bg-slate-50">
          <h3 className="font-bold text-slate-700">Traits révélés</h3>
          {traits.length > 0 && traits.map((trait: any, i: number) => (
            <div key={i} className="rounded-xl p-4 bg-white border-2 border-slate-200">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-bold text-slate-900">{String(trait.trait) || "Trait"}</h4>
                <span className="text-xs px-2 py-1 bg-slate-100 rounded">{String(trait.score_label) || "Moyen"}</span>
              </div>
              {trait.score_polarise !== undefined && <BigFiveGauge score={trait.score_polarise} dimension={trait.bigfive_dimension || "N"} />}
              <p className="text-sm text-slate-600 mt-2 italic">{String(trait.analyse)}</p>
            </div>
          ))}
        </div>

        <div className="bg-white p-6">
          <h3 className="font-bold text-slate-700 mb-4">Son rapport à...</h3>
          <div className="grid grid-cols-3 gap-2 mb-4">
            <button onClick={() => setActiveTab("autorite")} className={`py-2 px-3 rounded-lg text-sm ${activeTab === "autorite" ? "bg-amber-100 text-amber-700" : "bg-slate-100"}`}>👑 Autorité</button>
            <button onClick={() => setActiveTab("pairs")} className={`py-2 px-3 rounded-lg text-sm ${activeTab === "pairs" ? "bg-blue-100 text-blue-700" : "bg-slate-100"}`}>👥 Pairs</button>
            <button onClick={() => setActiveTab("action")} className={`py-2 px-3 rounded-lg text-sm ${activeTab === "action" ? "bg-emerald-100 text-emerald-700" : "bg-slate-100"}`}>⚡ Action</button>
          </div>
          <div className="p-4 bg-slate-50 rounded-lg">
            <p className="text-sm text-slate-700">
              {activeTab === "autorite" ? String(rapports.autorite) : activeTab === "pairs" ? String(rapports.pairs) : String(rapports.action)}
            </p>
          </div>
        </div>

        {result.conseil && (
          <div className="p-6 bg-gradient-to-r from-emerald-500 to-teal-600 text-white">
            <div className="flex items-start gap-3">
              <Lightbulb className="w-6 h-6" />
              <div>
                <p className="text-xs uppercase opacity-80 mb-1">Conseil</p>
                <p className="text-base">{String(result.conseil)}</p>
              </div>
            </div>
          </div>
        )}

        {zoneOmbre.length > 0 && (
          <details className="bg-slate-100">
            <summary className="p-4 text-sm font-bold cursor-pointer text-slate-600">⚠️ Zone d'ombre</summary>
            <div className="px-4 pb-4">
              <ul className="space-y-2">
                {zoneOmbre.map((item: any, i: number) => (
                  <li key={i} className="text-sm text-slate-600">• {String(item)}</li>
                ))}
              </ul>
            </div>
          </details>
        )}
      </div>

      <div className="flex gap-3 mt-6">
        <ShareButton result={result} />
        <a href="/" className="flex-1 py-3 px-4 rounded-2xl border-2 border-slate-300 text-slate-700 text-center font-bold">Nouvelle scène</a>
      </div>
    </div>
  );
}