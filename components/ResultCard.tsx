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
  Shield,
  Brain,
} from "lucide-react";
import ShareButton from "./ShareButton";
import BigFiveGauge from "./BigFiveGauge";

const MODE_CONFIG: any = {
  pro: { icon: Briefcase, label: "Professionnel", gradient: "from-blue-500 to-indigo-700", emoji: "💼", ring: "ring-blue-300", accent: "text-blue-600" },
  familial: { icon: Home, label: "Familial", gradient: "from-rose-500 to-fuchsia-700", emoji: "", ring: "ring-rose-300", accent: "text-rose-600" },
  ami: { icon: Users, label: "Amical", gradient: "from-emerald-500 to-cyan-700", emoji: "🤝", ring: "ring-emerald-300", accent: "text-emerald-600" },
  social: { icon: Briefcase, label: "Social", gradient: "from-amber-500 to-yellow-700", emoji: "🌍", ring: "ring-amber-300", accent: "text-amber-600" },
  hardcore: { icon: Flame, label: "Hardcore", gradient: "from-gray-900 to-black", emoji: "💀", ring: "ring-red-900", accent: "text-red-500" }
};

const toString = (value: any): string => {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
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
        <p className="text-slate-600 mb-4">{toString(result.error)}</p>
        <a href="/" className="text-violet-600">Recommencer</a>
      </div>
    );
  }

  const traits = Array.isArray(result.traits) ? result.traits : [];
  const zoneOmbre = Array.isArray(result.zone_ombre) ? result.zone_ombre : [];
  const motsCles = Array.isArray(result.mots_cles) ? result.mots_cles : [];
  const traitsSurface = Array.isArray(result.traits_surface) ? result.traits_surface : [];
  const pointsCles = Array.isArray(result.points_cles) ? result.points_cles : [];
  const rapports = result.rapports || { autorite: "", pairs: "", action: "" };
  const vigilances = result.vigilances_dsm5 || null;
  const emotions = result.analyse_emotionnelle_tcherkassoff || null;
  const degree = result.degree || 3;

  const modeConfig = MODE_CONFIG[mode] || MODE_CONFIG.pro;
  const isHardcore = mode === "hardcore";

  // Affichage simplifié pour niveaux 1-2
  if (degree <= 2 && traits.length === 0) {
    return (
      <div className={`max-w-md mx-auto ${isVisible ? "opacity-100" : "opacity-0"} transition-opacity`}>
        <div className={`rounded-3xl shadow-2xl overflow-hidden bg-white ring-4 ${modeConfig.ring}`}>
          <div className={`bg-gradient-to-br ${modeConfig.gradient} p-6 text-white`}>
            <div className="text-center">
              <div className="text-9xl mb-4">{result.personne?.emoji || modeConfig.emoji}</div>
              <h2 className="text-4xl font-black mb-3">{result.personne?.prenom || "Inconnu"}</h2>
              <p className="text-lg font-semibold">{toString(result.insight_principal)}</p>
            </div>
          </div>

          <div className="p-6 space-y-4 bg-slate-50">
            {motsCles.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {motsCles.map((mot: string, i: number) => (
                  <span key={i} className="px-3 py-1 bg-violet-100 text-violet-700 rounded-full text-sm font-bold">
                    #{toString(mot)}
                  </span>
                ))}
              </div>
            )}

            {pointsCles.length > 0 && pointsCles.map((point: any, i: number) => (
              <div key={i} className="rounded-xl p-4 bg-white border-2 border-slate-200">
                <h4 className="text-sm font-black text-violet-700 mb-2">{toString(point.titre)}</h4>
                <p className="text-sm text-slate-700">{toString(point.explication)}</p>
              </div>
            ))}

            {result.ressenti_global && (
              <div className="rounded-2xl p-5 bg-white border-2 border-slate-200">
                <p className="text-sm font-black text-slate-600 mb-2">Ressenti global</p>
                <p className="text-base italic text-slate-700">{toString(result.ressenti_global)}</p>
              </div>
            )}

            {traitsSurface.length > 0 && traitsSurface.map((t: any, i: number) => (
              <div key={i} className="rounded-2xl p-5 bg-white border-2 border-slate-200">
                <h3 className="font-black text-slate-900">{toString(t.trait)}</h3>
                <p className="text-sm mt-2 text-slate-600">{toString(t.description)}</p>
              </div>
            ))}

            {result.conseil_rapide && (
              <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white">
                <div className="flex items-start gap-3">
                  <Lightbulb className="w-7 h-7" />
                  <div>
                    <p className="text-xs font-black uppercase opacity-80 mb-2">Conseil rapide</p>
                    <p className="text-base">{toString(result.conseil_rapide)}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-3 p-6">
            <ShareButton result={result} />
            <a href="/" className="flex-1 py-3.5 px-4 rounded-2xl border-2 border-slate-300 text-slate-700 font-bold text-sm flex items-center justify-center gap-2">
              <RotateCcw className="w-5 h-5" />
              Nouvelle scène
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Affichage standard pour niveaux 3-5
  const tabContent: any = {
    autorite: { icon: Crown, label: "Autorité", text: toString(rapports.autorite) || "Non analysé" },
    pairs: { icon: Users, label: "Pairs", text: toString(rapports.pairs) || "Non analysé" },
    action: { icon: Zap, label: "Action", text: toString(rapports.action) || "Non analysé" }
  };

  return (
    <div className={`max-w-md mx-auto ${isVisible ? "opacity-100" : "opacity-0"} transition-opacity`}>
      <div className={`rounded-3xl shadow-2xl overflow-hidden bg-white ring-4 ${modeConfig.ring}`}>
        <div className={`bg-gradient-to-br ${modeConfig.gradient} p-6 text-white`}>
          <div className="text-center">
            <div className="text-9xl mb-4">{result.personne?.emoji || modeConfig.emoji}</div>
            <h2 className="text-4xl font-black mb-3">{result.personne?.prenom || "Inconnu"}</h2>
            <p className="text-lg font-semibold">{toString(result.insight_principal)}</p>
            <div className="mt-4 text-sm font-bold">{result.confiance_globale || 0}% confiance</div>
          </div>
        </div>

        <div className="p-6 space-y-5 bg-slate-50">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className={`w-6 h-6 ${modeConfig.accent}`} />
            <span className="text-sm font-black uppercase text-slate-700">Traits révélés</span>
          </div>

          {traits.length > 0 && traits.map((trait: any, i: number) => (
            <div key={i} className="rounded-2xl p-5 bg-white border-2 border-slate-200">
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex-1">
                  <h3 className="font-black text-slate-900">{toString(trait.trait) || "Trait"}</h3>
                  <p className="text-xs uppercase text-slate-500 mt-1">
                    {toString(trait.famille)} • {toString(trait.bigfive_facette)}
                  </p>
                </div>
                <span className="text-xs font-black px-3 py-1 rounded-full bg-slate-100 text-slate-600 border-2 border-slate-300">
                  {toString(trait.score_label || "Moyen").toUpperCase()}
                </span>
              </div>

              {trait.score_polarise !== undefined && (
                <BigFiveGauge score={trait.score_polarise} dimension={trait.bigfive_dimension || "N"} />
              )}

              <p className="text-sm italic text-slate-600 mt-4">{toString(trait.analyse)}</p>
            </div>
          ))}
        </div>

        <div className="bg-white">
          <div className="px-6 pt-6 pb-4">
            <p className="text-sm font-black uppercase text-slate-600 flex items-center gap-2">
              <span>👁️</span>
              Son rapport à...
            </p>
          </div>
          <div className="grid grid-cols-3 gap-3 px-5 pb-4">
            {Object.keys(tabContent).map((key) => {
              const tab = tabContent[key];
              const isActive = activeTab === key;
              return (
                <button key={key} onClick={() => setActiveTab(key)} className={`py-4 px-3 rounded-2xl flex flex-col items-center gap-2 border-2 ${isActive ? "bg-amber-50 text-amber-600 border-amber-600" : "bg-slate-50 border-slate-200 text-slate-400"}`}>
                  <tab.icon className="w-6 h-6" />
                  <span className="text-sm font-black">{tab.label}</span>
                </button>
              );
            })}
          </div>
          <div className="p-6 mx-5 mb-5 rounded-2xl bg-amber-50">
            <p className="text-sm text-slate-700">{tabContent[activeTab].text}</p>
          </div>
        </div>

        {vigilances && vigilances.style_associe && (
          <div className="bg-amber-50 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-6 h-6 text-amber-600" />
              <p className="text-sm font-black uppercase text-amber-700">Vigilance DSM-5</p>
            </div>
            <div className="rounded-2xl p-5 bg-white border-2 border-amber-300">
              <p className="font-black text-amber-900">{toString(vigilances.style_associe)}</p>
              <p className="text-sm mt-3 text-slate-600">{toString(vigilances.description)}</p>
              <p className="text-sm mt-4 text-amber-700">⚠️ {toString(vigilances.warning)}</p>
            </div>
          </div>
        )}

        {emotions && emotions.regulation && (
          <div className="bg-violet-50 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Brain className="w-6 h-6 text-violet-600" />
              <p className="text-sm font-black uppercase text-violet-700">Régulation émotionnelle</p>
            </div>
            <div className="rounded-2xl p-5 bg-white border-2 border-violet-300">
              <p className="font-black text-violet-900">{toString(emotions.expression)}</p>
              <p className="text-sm mt-3 text-slate-600">Régulation : <span className="font-black">{toString(emotions.regulation)}</span></p>
              <p className="text-sm mt-4 italic text-slate-600">{toString(emotions.decryptage)}</p>
            </div>
          </div>
        )}

        <div className="p-6 bg-gradient-to-r from-emerald-500 to-teal-600 text-white">
          <div className="flex items-start gap-3">
            <Lightbulb className="w-7 h-7" />
            <div>
              <p className="text-xs font-black uppercase opacity-80 mb-2">Conseil actionnable</p>
              <p className="text-base">{toString(result.conseil) || "Pas de conseil disponible."}</p>
            </div>
          </div>
        </div>

        {zoneOmbre.length > 0 && (
          <details className="bg-slate-100 border-t-2 border-slate-200">
            <summary className="p-5 text-sm font-bold cursor-pointer text-slate-600 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Zone d'ombre
              </span>
              <span>▼</span>
            </summary>
            <div className="px-6 pb-5">
              <ul className="space-y-3">
                {zoneOmbre.map((item: string, i: number) => (
                  <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                    <span className="text-lg">•</span>
                    <span>{toString(item)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </details>
        )}
      </div>

      <div className="flex gap-3 mt-6">
        <ShareButton result={result} />
        <a href="/" className="flex-1 py-3.5 px-4 rounded-2xl border-2 border-slate-300 text-slate-700 font-bold text-sm flex items-center justify-center gap-2">
          <RotateCcw className="w-5 h-5" />
          Nouvelle scène
        </a>
      </div>
    </div>
  );
}

