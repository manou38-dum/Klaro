"use client";

import { useState } from "react";
import html2canvas from "html2canvas";
import { Share2, Download, X, MessageCircle, Globe, Copy, Check } from "lucide-react";

export default function ShareButton({ result }: any) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const getShareMessage = () => {
    const mode = result?.mode || sessionStorage.getItem("selectedMode") || "pro";
    const prenom = result?.personne?.prenom || "cette personne";
    const insight = result?.insight_principal || "une analyse intéressante";
    
    if (mode === "comerage") {
      return `☕ Viens voir ce décryptage de fou ! "${insight}" - Trop drôle et trop vrai !`;
    }
    return `🎯 Analyse : "${insight}" - Découvrez Klaro !`;
  };

  const shareUrl = "https://klaro-weld.vercel.app";

  const generateImage = async () => {
    const element = document.getElementById("result-card");
    
    setIsGenerating(true);
    
    // Tenter de générer l'image, mais ouvrir le menu même en cas d'échec
    try {
      if (element) {
        const canvas = await html2canvas(element, {
          backgroundColor: "#ffffff",
          scale: 2,
          useCORS: true,
          logging: false,
        });
        const url = canvas.toDataURL("image/png");
        setImageUrl(url);
      }
    } catch (error) {
      console.error("Erreur génération image:", error);
    }
    
    setIsGenerating(false);
    setShowPreview(true); // Toujours ouvrir le menu
  };

  const downloadImage = () => {
    if (!imageUrl) return;
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = `klaro-analyse.png`;
    link.click();
  };

  const shareWhatsApp = () => {
  const resultData = btoa(JSON.stringify(result));
  const shareLink = `${shareUrl}/share?data=${resultData}`;
  
  let message = "";
  
  if (result.mode === "comerage") {
    message = `🎭 *NOUVEAU COMÉRAGE DÉCRYPTÉ* ☕\n\n`;
    message += `💡 *Insight :* ${result.insight_principal}\n\n`;
    
    if (result.dynamiques && result.dynamiques.length > 0) {
      message += `👥 *Les acteurs :*\n`;
      result.dynamiques.forEach((d: any) => {
        message += `• ${d.acteur} (${d.role}) : ${d.analyse}\n`;
      });
      message += `\n`;
    }
    
    if (result.conseil) {
      message += `💬 *Conseil de pote :* ${result.conseil}\n\n`;
    }
    
    message += `👉 *Voir l'analyse complète :* ${shareLink}`;
    
  } else {
    message = `🎯 *ANALYSE KLARO*\n\n`;
    message += `👤 *${result.personne?.prenom || "Personne"}*\n\n`;
    message += `💡 ${result.insight_principal}\n\n`;
    
    if (result.conseil) {
      message += `💬 *Conseil :* ${result.conseil}\n\n`;
    }
    
    message += `👉 *Voir l'analyse complète :* ${shareLink}`;
  }

  const encodedMessage = encodeURIComponent(message);
  window.open(`https://wa.me/?text=${encodedMessage}`, "_blank");
  setShowPreview(false);
};

  const shareTwitter = () => {
    const text = encodeURIComponent(getShareMessage());
    const url = encodeURIComponent(shareUrl);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, "_blank");
    setShowPreview(false);
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
        onClick={generateImage}
        disabled={isGenerating}
        className="flex-1 py-3.5 px-4 rounded-2xl bg-gradient-to-r from-violet-600 to-purple-600 text-white font-bold text-sm transition flex items-center justify-center gap-2 hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
      >
        {isGenerating ? (
          <>
            <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
            Génération...
          </>
        ) : (
          <>
            <Share2 className="w-5 h-5" />
            Partager
          </>
        )}
      </button>

      {showPreview && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full overflow-hidden max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b flex items-center justify-between sticky top-0 bg-white z-10">
              <h3 className="font-bold text-slate-900">Partager l'analyse</h3>
              <button
                onClick={() => setShowPreview(false)}
                className="p-2 hover:bg-slate-100 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {imageUrl && (
              <div className="p-4">
                <img src={imageUrl} alt="Aperçu" className="w-full rounded-lg" />
              </div>
            )}

            <div className="p-4 space-y-3">
              <p className="text-xs text-slate-500 text-center font-semibold uppercase">Partager sur :</p>
              
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={shareWhatsApp}
                  className="py-4 px-2 rounded-xl bg-green-500 text-white font-bold text-xs flex flex-col items-center gap-1 hover:bg-green-600 transition shadow-md"
                >
                  <MessageCircle className="w-6 h-6" />
                  WhatsApp
                </button>

                <button
                  onClick={shareTwitter}
                  className="py-4 px-2 rounded-xl bg-sky-500 text-white font-bold text-xs flex flex-col items-center gap-1 hover:bg-sky-600 transition shadow-md"
                >
                  <Globe className="w-6 h-6" />
                  Twitter/X
                </button>

                <button
                  onClick={copyLink}
                  className="py-4 px-2 rounded-xl bg-slate-700 text-white font-bold text-xs flex flex-col items-center gap-1 hover:bg-slate-800 transition shadow-md"
                >
                  {copied ? <Check className="w-6 h-6" /> : <Copy className="w-6 h-6" />}
                  {copied ? "Copié !" : "Lien"}
                </button>
              </div>

              {imageUrl && (
                <button
                  onClick={downloadImage}
                  className="w-full py-3 px-4 rounded-xl bg-slate-100 text-slate-700 font-bold text-sm flex items-center justify-center gap-2 hover:bg-slate-200 transition"
                >
                  <Download className="w-5 h-5" />
                  Télécharger l'image
                </button>
              )}

              <div className="pt-3 border-t">
                <p className="text-xs text-slate-500 text-center italic">
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