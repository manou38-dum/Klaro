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
  Coffee,
  Eye,
  MessageCircle,
  Heart,
  Flame as Fire,
  Send,
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

const cleanMarkdown = (text: string) => {
  if (!text) return "";
  return text
    .replace(/\*\*/g, "")
    .replace(/\*/g, "")
    .replace(/__/g, "")
    .replace(/_/g, "");
};

// Composant Chat pour le mode Comérage
function ChatSection({ scene, initialAnalysis }: { scene: string; initialAnalysis: any }) {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = { sender: "user", text: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scene,
          initialAnalysis,
          userMessage: input,
          conversationHistory: messages
        })
      });

      const data = await response.json();
      
      if (data.response) {
        setMessages([...newMessages, { sender: "ai", text: data.response }]);
      }
    } catch (error) {
      console.error("Erreur chat:", error);
      setMessages([...newMessages, { sender: "ai", text: "Oups, y'a eu un bug. Réessaie !" }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="border-t-2 border-pink-200 bg-gradient-to-br from-pink-50 to-rose-50">
      <div className="p-5">
        <h3 className="font-black text-rose-800 flex items-center gap-2 mb-2 text-base">
          <MessageCircle className="w-5 h-5" />
          Pose tes questions ! 💬
        </h3>
        <p className="text-xs text-rose-700 mb-4">
          Tu veux en savoir plus ? Demande des précisions ou ajoute des détails...
        </p>

        {/* Zone de messages */}
        <div className="bg-white rounded-xl p-4 mb-3 max-h-80 overflow-y-auto space-y-3 border border-pink-200">
          {messages.length === 0 ? (
            <div className="text-center py-6">
              <div className="text-4xl mb-2">🤔</div>
              <p className="text-sm text-slate-500 italic">
                Aucune question pour le moment...<br/>
                Lance-toi, ta copine est là !
              </p>
            </div>
          ) : (
            messages.map((msg, i) => (
              <div
                key={i}
                className={`p-3 rounded-lg text-sm ${
                  msg.sender === "user"
                    ? "bg-pink-100 text-pink-900 ml-8 border border-pink-300"
                    : "bg-rose-100 text-rose-900 mr-8 border border-rose-300"
                }`}
              >
                <div className="font-bold text-xs mb-1 opacity-70">
                  {msg.sender === "user" ? "👤 Toi" : "☕ Ta copine"}
                </div>
                {cleanMarkdown(msg.text)}
              </div>
            ))
          )}
          {isLoading && (
            <div className="bg-rose-100 p-3 rounded-lg text-sm text-rose-900 mr-8 border border-rose-300">
              <div className="flex items-center gap-2">
                <div className="animate-spin w-4 h-4 border-2 border-rose-500 border-t-transparent rounded-full" />
                <span className="font-bold text-xs">☕ Ta copine réfléchit...</span>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            placeholder="Pose ta question..."
            disabled={isLoading}
            className="flex-1 px-3 py-2 border-2 border-pink-300 rounded-lg text-sm focus:outline-none focus:border-pink-500 disabled:opacity-50"
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="px-4 py-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-lg text-sm font-bold hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-1"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

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

  if (result.mode === "comerage" || result.dynamiques) {
    const dynamiques = Array.isArray(result.dynamiques) ? result.dynamiques : [];
    const jeuxPouvoir = Array.isArray(result.jeux_de_pouvoir) ? result.jeux_de_pouvoir : [];
    const nonDits = Array.isArray(result.non_dits) ? result.non_dits : [];
    
    // Récupérer la scène depuis sessionStorage
    const scene = sessionStorage.getItem("lastScene") || "";

    return (
      <div id="result-card" className={`max-w-md mx-auto ${isVisible ? "opacity-100" : "opacity-0"} transition-opacity`}>
        <div className="rounded-3xl shadow-2xl overflow-hidden bg-white ring-4 ring-pink-300">
          <div className="bg-gradient-to-br from-rose-500 to-pink-600 p-6 text-white text-center">
            <div className="text-6xl mb-3">☕</div>
            <h2 className="text-2xl font-black mb-2">Décryptage entre copines</h2>
            <p className="text-lg opacity-90">{cleanMarkdown(String(result.insight_principal))}</p>
          </div>

          <div className="p-5 space-y-3 bg-gradient-to-b from-pink-50 to-white">
            <h3 className="font-bold text-rose-700 flex items-center gap-2">
              <Eye className="w-5 h-5" /> Qui fait quoi ?
            </h3>
            {dynamiques.map((d: any, i: number) => (
              <div key={i} className="bg-white p-4 rounded-xl border-2 border-pink-200 shadow-sm">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-black text-slate-900">{String(d.acteur) || "Inconnu"}</span>
                  <span className="text-xs px-2 py-0.5 bg-pink-100 text-pink-700 rounded-full font-bold">
                    {String(d.role) || "Rôle"}
                  </span>
                </div>
                <p className="text-sm text-slate-600 italic">💬 {cleanMarkdown(String(d.analyse))}</p>
              </div>
            ))}
          </div>

          <div className="px-5 py-4 grid grid-cols-2 gap-3">
            <div className="bg-amber-50 p-3 rounded-xl border border-amber-200">
              <h4 className="font-bold text-amber-800 text-xs mb-2 flex items-center gap-1">🎭 Jeux de pouvoir</h4>
              <ul className="space-y-1">
                {jeuxPouvoir.map((j: any, i: number) => (
                  <li key={i} className="text-xs text-amber-700">• {String(j)}</li>
                ))}
              </ul>
            </div>
            <div className="bg-violet-50 p-3 rounded-xl border border-violet-200">
              <h4 className="font-bold text-violet-800 text-xs mb-2 flex items-center gap-1">🤫 Non-dits</h4>
              <ul className="space-y-1">
                {nonDits.map((n: any, i: number) => (
                  <li key={i} className="text-xs text-violet-700">• {String(n)}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="px-5 py-3 space-y-3 bg-white">
            <div className="flex items-start gap-2">
              <Heart className="w-5 h-5 text-pink-500 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-bold text-sm text-slate-800">Alliances</h4>
                <p className="text-sm text-slate-600">{cleanMarkdown(String(result.alliances))}</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Fire className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-bold text-sm text-slate-800">Tensions</h4>
                <p className="text-sm text-slate-600">{cleanMarkdown(String(result.tensions))}</p>
              </div>
            </div>
          </div>

          {result.conseil && (
            <div className="p-5 bg-gradient-to-r from-pink-500 to-rose-500 text-white">
              <div className="flex items-start gap-3">
                <MessageCircle className="w-6 h-6 mt-0.5" />
                <div>
                  <p className="text-xs uppercase opacity-80 mb-1 font-bold">Conseil de copine</p>
                  <p className="text-base">{cleanMarkdown(String(result.conseil))}</p>
                </div>
              </div>
            </div>
          )}

          {/* CHAT INTERACTIF */}
          {scene && <ChatSection scene={scene} initialAnalysis={result} />}
        </div>

        <div className="flex gap-3 mt-6">
          <ShareButton result={result} />
          <a href="/" className="flex-1 py-3 px-4 rounded-2xl border-2 border-slate-300 text-slate-700 text-center font-bold">Nouvelle scène</a>
        </div>
      </div>
    );
  }

  const traits = (result.traits && Array.isArray(result.traits)) ? result.traits : [];
  const zoneOmbre = (result.zone_ombre && Array.isArray(result.zone_ombre)) ? result.zone_ombre : [];
  const motsCles = (result.mots_cles && Array.isArray(result.mots_cles)) ? result.mots_cles : [];
  const rapports = result.rapports || { autorite: "", pairs: "", action: "" };
  const degree = result.degree || 3;

  const modeConfig = MODE_CONFIG[mode] || MODE_CONFIG.pro;

  if (degree <= 2 && traits.length === 0) {
    return (
      <div id="result-card" className={`max-w-md mx-auto ${isVisible ? "opacity-100" : "opacity-0"} transition-opacity`}>
        <div className={`rounded-3xl shadow-2xl overflow-hidden bg-white ring-4 ${modeConfig.ring}`}>
          <div className={`bg-gradient-to-br ${modeConfig.gradient} p-6 text-white text-center`}>
            <div className="text-9xl mb-4">{result.personne?.emoji || "👤"}</div>
            <h2 className="text-4xl font-black mb-3">{result.personne?.prenom || "Inconnu"}</h2>
            <p className="text-lg">{cleanMarkdown(String(result.insight_principal))}</p>
          </div>
          
          <div className="p-6 space-y-4 bg-slate-50">
            {motsCles.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {motsCles.map((mot: any, i: number) => (
                  <span key={i} className="px-3 py-1 bg-violet-100 text-violet-700 rounded-full text-sm">#{String(mot)}</span>
                ))}
              </div>
            )}
            {result.ressenti_global && <p className="italic text-slate-600">{cleanMarkdown(String(result.ressenti_global))}</p>}
            {result.conseil_rapide && <p className="text-slate-700"><strong>Conseil:</strong> {cleanMarkdown(String(result.conseil_rapide))}</p>}
          </div>

          <div className="flex gap-3 p-6">
            <ShareButton result={result} />
            <a href="/" className="flex-1 py-3 px-4 rounded-2xl border-2 border-slate-300 text-center">Nouvelle scène</a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id="result-card" className={`max-w-md mx-auto ${isVisible ? "opacity-100" : "opacity-0"} transition-opacity`}>
      <div className={`rounded-3xl shadow-2xl overflow-hidden bg-white ring-4 ${modeConfig.ring}`}>
        <div className={`bg-gradient-to-br ${modeConfig.gradient} p-6 text-white text-center`}>
          <div className="text-9xl mb-4">{result.personne?.emoji || "👤"}</div>
          <h2 className="text-4xl font-black mb-3">{result.personne?.prenom || "Inconnu"}</h2>
          <p className="text-lg">{cleanMarkdown(String(result.insight_principal))}</p>
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
              <p className="text-sm text-slate-600 mt-2 italic">{cleanMarkdown(String(trait.analyse))}</p>
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
              {activeTab === "autorite" ? cleanMarkdown(String(rapports.autorite)) : activeTab === "pairs" ? cleanMarkdown(String(rapports.pairs)) : cleanMarkdown(String(rapports.action))}
            </p>
          </div>
        </div>

        {result.conseil && (
          <div className="p-6 bg-gradient-to-r from-emerald-500 to-teal-600 text-white">
            <div className="flex items-start gap-3">
              <Lightbulb className="w-6 h-6" />
              <div>
                <p className="text-xs uppercase opacity-80 mb-1">Conseil</p>
                <p className="text-base">{cleanMarkdown(String(result.conseil))}</p>
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
                  <li key={i} className="text-sm text-slate-600">• {cleanMarkdown(String(item))}</li>
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