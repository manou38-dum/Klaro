"use client";

import { useState } from "react";
import { Share2, MessageCircle, Twitter, Copy, Check, X } from "lucide-react";

export default function ShareButton({ result }: any) {
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copied, setCopied] = useState(false);

  const getShareMessage = () => {
    const mode = result?.mode || sessionStorage.getItem("selectedMode") || "pro";
    const prenom = result?.personne?.prenom || "cette personne";
    const insight = result?.insight_principal || "une analyse intéressante";
    
    if (mode === "comerage") {
      return `☕ Viens voir ce décryptage de fou sur ${prenom} ! "${insight}" - Trop drôle et trop vrai !`;
    }
    if (mode === "pro") {
      return `💼 Analyse pro de ${prenom} : "${insight}" - Klaro m'a aidé à comprendre les dynamiques au travail.`;
    }
    if (mode === "familial") {
      return `❤️ Analyse familiale de ${prenom} : "${insight}" - Ça m'a ouvert les yeux sur nos relations.`;
    }
    return `🎯 Analyse de ${prenom} : "${insight}" - Découvrez Klaro, l'appli qui décrypte les comportements !`;
  };

  const shareUrl = typeof window !== "undefined" ? window.location.origin : "https://klaro.vercel.app";

  const shareWhatsApp = () => {
    const message = encodeURIComponent(getShareMessage());
    const url = encodeURIComponent(shareUrl);
    window.open(`https://wa.me/?text=${message}%20${url}`, "_blank");
    setShowShareMenu(false);
  };

  const shareTwitter = () => {
    const text = encodeURIComponent(getShareMessage());
    const url = encodeURIComponent(shareUrl);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, "_blank");
    setShowShareMenu(false);
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Erreur copie:", error);
    }
  };

  return (
    <>
      <button
        onClick={() => setShowShareMenu(true)}
        className="flex-1 py-3.5 px-4 rounded-2xl bg-gradient-to-r from-violet-600 to-purple-600 text-white font-bold text-sm transition flex items-center justify-center gap-2 hover:brightness-110 shadow-lg"
      >
        <Share2 className="w-5 h-5" />
        Partager
      </button>

      {showShareMenu && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full overflow-hidden">
            <div className="p-4 border-b flex items-center justify-between">
              <h3 className="font-bold text-slate-900">Partager l'analyse</h3>
              <button
                onClick={() => setShowShareMenu(false)}
                className="p-2 hover:bg-slate-100 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <p className="text-sm text-slate-600 text-center">
                Partage cette analyse avec tes amis !
              </p>

              <div className="grid grid-cols-3 gap-3">
                {/* WhatsApp */}
                <button
                  onClick={shareWhatsApp}
                  className="py-4 px-3 rounded-xl bg-green-500 text-white font-bold text-xs flex flex-col items-center gap-2 hover:bg-green-600 transition shadow-md"
                >
                  <MessageCircle className="w-6 h-6" />
                  WhatsApp
                </button>

                {/* Twitter/X */}
                <button
                  onClick={shareTwitter}
                  className="py-4 px-3 rounded-xl bg-sky-500 text-white font-bold text-xs flex flex-col items-center gap-2 hover:bg-sky-600 transition shadow-md"
                >
                  <Twitter className="w-6 h-6" />
                  Twitter
                </button>

                {/* Copier le lien */}
                <button
                  onClick={copyLink}
                  className="py-4 px-3 rounded-xl bg-slate-700 text-white font-bold text-xs flex flex-col items-center gap-2 hover:bg-slate-800 transition shadow-md"
                >
                  {copied ? <Check className="w-6 h-6" /> : <Copy className="w-6 h-6" />}
                  {copied ? "Copié !" : "Lien"}
                </button>
              </div>

              <div className="pt-4 border-t">
                <p className="text-xs text-slate-500 text-center">
                  {getShareMessage()}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}