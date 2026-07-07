"use client";

import { useState } from "react";
import html2canvas from "html2canvas";
import { Share2, Download, X } from "lucide-react";

export default function ShareButton({ result }: any) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

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
          <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden">
            <div className="p-4 border-b flex items-center justify-between">
              <h3 className="font-bold text-slate-900">Aperçu</h3>
              <button
                onClick={() => setShowPreview(false)}
                className="p-2 hover:bg-slate-100 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4">
              <img src={imageUrl} alt="Aperçu" className="w-full rounded-lg" />
            </div>
            <div className="p-4 border-t flex gap-3">
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
      )}
    </>
  );
}