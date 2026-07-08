"use client";

import { useState } from "react";
import html2canvas from "html2canvas";
import { Share2, Download, X, MessageCircle, Twitter, Copy, Check } from "lucide-react";

export default function ShareButton({ result }: any) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const generateImage = async () => {
    const element = document.getElementById("result-card");
    if (!element) return;

    setIsGenerating(true);
    try {
      const canvas = await html2canvas(element, {
        backgroundColor: "#f8fafc",
        scale: 2,
        useCORS: true,
      });
      const url = canvas.toDataURL("image/png");
      setImageUrl(url);
      setShowPreview(true);
    } catch (error) {
      console.error("Erreur génération image:", error);
      alert("Erreur lors de la génération de l'image");
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadImage = () => {
    if (!imageUrl) return;
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = `klaro-${result?.personne?.prenom || "analyse"}.png`;
    link.click();
  };

  const shareImage = async () => {
    if (!imageUrl) return;

    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const file = new File([blob], `klaro-${result?.personne?.prenom || "analyse"}.png`, {
        type: "image/png",
      });

      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: "Mon analyse Klaro",
          text: `Analyse de ${result?.personne?.prenom || "cette personne"}`,
        });
      } else {
        downloadImage();
        alert("Image téléchargée ! Partagez-la depuis votre galerie.");
      }
    } catch (error) {
      console.error("Erreur partage:", error);
      downloadImage();
    }
  };

  // Messages adaptés selon le mode
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
  };

  const shareTwitter = () => {
    const text = encodeURIComponent(getShareMessage());
    const url = encodeURIComponent(shareUrl);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, "_blank");
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

      {showPreview && imageUrl && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b flex items-center justify-between sticky top-0 bg-white z-10">
              <h3 className="font-bold text-slate-900">Partager l'analyse</h3>
              <button
                onClick={() => setShowPreview(false)}
                className="p-2 hover:bg-slate-100 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Aperçu image */}
            <div className="p-4">
              <img src={imageUrl} alt="Aperçu" className="w-full rounded-lg" />
            </div>

            {/* Boutons de partage social */}
            <div className="p-4 border-t space-y-3">
              <p className="text-xs text-slate-500 text-center font-semibold uppercase">Partager sur :</p>
              
              <div className="grid grid-cols-3 gap-2">
                {/* WhatsApp */}
                <button
                  onClick={shareWhatsApp}
                  className="py-3 px-2 rounded-xl bg-green-500 text-white font-bold text-xs flex flex-col items-center gap-1 hover:bg-green-600 transition"
                >
                  <MessageCircle className="w-5 h-5" />
                  WhatsApp
                </button>

                {/* Twitter/X */}
                <button
                  onClick={shareTwitter}
                  className="py-3 px-2 rounded-xl bg-sky-500 text-white font-bold text-xs flex flex-col items-center gap-1 hover:bg-sky-600 transition"
                >
                  <Twitter className="w-5 h-5" />
                  Twitter
                </button>

                {/* Copier le lien */}
                <button
                  onClick={copyLink}
                  className="py-3 px-2 rounded-xl bg-slate-700 text-white font-bold text-xs flex flex-col items-center gap-1 hover:bg-slate-800 transition"
                >
                  {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                  {copied ? "Copié !" : "Lien"}
                </button>
              </div>

              {/* Boutons classiques */}
              <div className="flex gap-3 pt-2 border-t">
                <button
                  onClick={downloadImage}
                  className="flex-1 py-3 px-4 rounded-xl bg-slate-100 text-slate-700 font-bold text-sm flex items-center justify-center gap-2 hover:bg-slate-200 transition"
                >
                  <Download className="w-5 h-5" />
                  Télécharger
                </button>
                <button
                  onClick={shareImage}
                  className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 text-white font-bold text-sm flex items-center justify-center gap-2 hover:brightness-110 transition"
                >
                  <Share2 className="w-5 h-5" />
                  Partager
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}