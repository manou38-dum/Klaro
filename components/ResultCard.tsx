"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Send } from "lucide-react";

// Configuration des modes
   const MODE_CONFIG: Record<string, any> = {
  pro: {
    gradient: "from-slate-700 to-slate-900",
    ring: "ring-slate-400",
    accent: "text-slate-700",
    button: "bg-slate-700 hover:bg-slate-800",
  },
  familial: {
    gradient: "from-amber-500 to-orange-600",
    ring: "ring-amber-400",
    accent: "text-amber-700",
    button: "bg-amber-500 hover:bg-amber-600",
  },
  ami: {
    gradient: "from-emerald-500 to-teal-600",
    ring: "ring-emerald-400",
    accent: "text-emerald-700",
    button: "bg-emerald-500 hover:bg-emerald-600",
  },
  social: {
    gradient: "from-pink-500 to-rose-600",
    ring: "ring-pink-400",
    accent: "text-pink-700",
    button: "bg-pink-500 hover:bg-pink-600",
  },
  comerage: {
    gradient: "from-violet-500 to-purple-600",
    ring: "ring-violet-400",
    accent: "text-violet-700",
    button: "bg-violet-500 hover:bg-violet-600",
  },
};

function cleanMarkdown(text: string): string {
  return text.replace(/\*\*/g, "").replace(/\*/g, "").replace(/_/g, "");
}

// Section chat interactif
function ChatSection({ scene, initialAnalysis }: { scene: string; initialAnalysis: any }) {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMessage = input.trim();
    setInput("");
    
    setMessages(prev => [...prev, { sender: "user", text: userMessage }]);
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scene,
          initialAnalysis,
          userMessage,
          conversationHistory: messages,
        }),
      });

      const data = await response.json();
      
      if (data.response) {
        setMessages(prev => [...prev, { sender: "ai", text: data.response }]);
      }
    } catch (error) {
      console.error("Erreur chat:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-gradient-to-r from-violet-50 to-purple-50 rounded-2xl mb-4">
      <h4 className="font-bold text-violet-700 mb-3">💬 Discuter de l'analyse</h4>
      
      <div className="space-y-2 mb-3 max-h-64 overflow-y-auto">
        {messages.length === 0 ? (
          <p className="text-sm text-slate-500 italic">Pose-moi une question sur l'analyse...</p>
        ) : (
          messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                msg.sender === "user" 
                  ? "bg-violet-500 text-white rounded-br-none" 
                  : "bg-white border border-violet-200 rounded-bl-none"
              }`}>
                {msg.text}
              </div>
            </div>
          ))
        )}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white border border-violet-200 p-3 rounded-2xl rounded-bl-none text-sm">
              <span className="animate-pulse">💭 Réflexion...</span>
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Pose ta question..."
          className="flex-1 px-4 py-2 border-2 border-violet-200 rounded-full focus:outline-none focus:border-violet-500"
        />
        <button 
          onClick={sendMessage} 
          className="p-3 bg-violet-500 text-white rounded-full hover:bg-violet-600 transition"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

// Bouton salon temps réel (uniquement pour comerage)
function InviteRoomButton({ scene, analysis }: { scene: string; analysis: any }) {
  const [roomId, setRoomId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const createRoom = async () => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    const { data, error } = await supabase
    .from("chat_rooms").insert({
      scene_id: "comerage",
      invite_code: code,
      analysis_snapshot: analysis,
    }).select().single();

    if (!error && data) setRoomId(data.invite_code);
  };

  const shareLink = roomId ? `https://klaro.manoulabs.com/chat/${roomId}` : "";

  return (
    <div className="p-4 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-2xl mb-4">
      <h4 className="font-bold flex items-center gap-2 mb-2">👥 Décrypter à plusieurs ?</h4>
      {!roomId ? (
        <button onClick={createRoom} className="w-full py-2 bg-white text-purple-700 rounded-lg font-bold hover:brightness-95 transition">
          Créer un salon temps réel
        </button>
      ) : (
        <div className="space-y-2">
          <p className="text-sm opacity-90">Salon créé ! Partage ce lien :</p>
          <div className="flex gap-2">
            <input readOnly value={shareLink} className="flex-1 px-3 py-2 rounded bg-white/20 text-sm text-white" />
            <button
              onClick={() => {
                navigator.clipboard.writeText(shareLink);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
              className="px-3 py-2 bg-white text-purple-700 rounded font-bold text-sm"
            >
              {copied ? "Copié !" : "Copier"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Bouton partage
function ShareButton({ result }: { result: any }) {
  const shareText = `Découvre l'analyse de cette scène sur Klaro ! ${result.insight_principal || ""}`;
  const shareUrl = "https://klaro.manoulabs.com";

  return (
    <div className="flex gap-2">
      <a 
        href={`https://wa.me/?text=${encodeURIComponent(shareText + " " + shareUrl)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex-1 py-2 px-4 bg-green-500 text-white rounded-xl font-bold text-sm hover:bg-green-600 transition"
      >
        WhatsApp
      </a>
      <a 
        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex-1 py-2 px-4 bg-blue-500 text-white rounded-xl font-bold text-sm hover:bg-blue-600 transition"
      >
        Twitter
      </a>
    </div>
  );
}

export default function ResultCard({ result, mode, isVisible }: { result: any; mode: string; isVisible: boolean }) {
  const scene = result.scene || "";

  if (!result) return null;

  // Mode comerage avec degré > 2
  if (mode === "comerage" && result.degree > 2) {
    return (
      <div id="result-card" className={`max-w-md mx-auto ${isVisible ? "opacity-100" : "opacity-0"} transition-opacity`}>
        <div className={`rounded-3xl shadow-2xl overflow-hidden bg-white ring-4 ${MODE_CONFIG.comerage.ring}`}>
          <div className={`bg-gradient-to-br ${MODE_CONFIG.comerage.gradient} p-6 text-white text-center`}>
            <div className="text-9xl mb-4">{result.personne?.emoji || "👥"}</div>
            <h2 className="text-4xl font-black mb-3">{result.personne?.prenom || "La bande"}</h2>
            <p className="text-lg">{cleanMarkdown(String(result.insight_principal))}</p>
          </div>
          
          <div className="p-6 space-y-4 bg-slate-50">
            {result.tensions && (
              <div>
                <h3 className="font-bold text-violet-700 mb-2">🔥 Tensions</h3>
                <p className="text-slate-700 text-sm">{cleanMarkdown(String(result.tensions))}</p>
              </div>
            )}
            
            {result.alliances && (
              <div>
                <h3 className="font-bold text-violet-700 mb-2">🤝 Alliances</h3>
                <p className="text-slate-700 text-sm">{cleanMarkdown(String(result.alliances))}</p>
              </div>
            )}
            
            {result.conseil && (
              <div>
                <h3 className="font-bold text-violet-700 mb-2">💡 Conseil</h3>
                <p className="text-slate-700 text-sm">{cleanMarkdown(String(result.conseil))}</p>
              </div>
            )}
          </div>

          <div className="p-6 space-y-4">
            {/* CHAT INTERACTIF */}
            {scene && <ChatSection scene={scene} initialAnalysis={result} />}
            
            {/* BOUTON SALON TEMPS RÉEL */}
            {scene && <InviteRoomButton scene={scene} analysis={result} />}
          </div>

          <div className="flex gap-3 p-6">
            <ShareButton result={result} />
            <a href="/" className="flex-1 py-3 px-4 rounded-2xl border-2 border-slate-300 text-slate-700 text-center font-bold">Nouvelle scène</a>
          </div>
        </div>
      </div>
    );
  }

  // Autres modes ou degré faible
  const traits = (result.traits && Array.isArray(result.traits)) ? result.traits : [];
  const zoneOmbre = (result.zone_ombre && Array.isArray(result.zone_ombre)) ? result.zone_ombre : [];
  const motsCles = (result.mots_cles && Array.isArray(result.mots_cles)) ? result.mots_cles : [];
  const rapports = result.rapports || { autorite: "", pairs: "", action: "" };
  const degree = result.degree || 3;

  const modeConfig = MODE_CONFIG[mode] || MODE_CONFIG.pro;

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