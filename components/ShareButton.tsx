"use client";

import { useState } from "react";
import html2canvas from "html2canvas";
import { AnalysisResult } from "@/lib/mistral";
import { Share2, Download, X } from "lucide-react";

interface ShareButtonProps {
  result: AnalysisResult;
}

export default function ShareButton({ result }: ShareButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const generateImage = async () => {
    setIsGenerating(true);
    
    try {
      // Créer un conteneur temporaire pour l'image
      const container = document.createElement("div");
      container.style.position = "absolute";
      container.style.left = "-9999px";
      container.style.width = "600px";
      container.style.background = "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";
      container.style.padding = "40px";
      container.style.borderRadius = "24px";
      container.style.color = "white";
      document.body.appendChild(container);

      // Contenu de l'image
      container.innerHTML = `
        <div style="text-align: center;">
          <div style="font-size: 80px; margin-bottom: 20px;">${result.personne?.emoji || "🎭"}</div>
          <h2 style="font-size: 32px; font-weight: 900; margin-bottom: 10px;">${result.personne?.prenom || "Inconnu"}</h2>
          <p style="font-size: 18px; margin-bottom: 30px; opacity: 0.9;">${result.insight_principal}</p>
          
          <div style="background: rgba(255,255,255,0.1); padding: 20px; border-radius: 16px; margin-bottom: 20px;">
            <p style="font-size: 14px; margin-bottom: 10px; opacity: 0.8;">Confiance</p>
            <p style="font-size: 36px; font-weight: 900;">${result.confiance_globale}%</p>
          </div>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.2);">
            <p style="font-size: 12px; opacity: 0.7;">Généré par Klaro • klaro.app</p>
          </div>
        </div>
      `;

      // Générer l'image
      const canvas = await html2canvas(container, {
        backgroundColor: null,
        scale: 2,
        useCORS: true,
      });

      // Nettoyer
      document.body.removeChild(container);

      // Convertir en image
      const dataUrl = canvas.toDataURL("image/png");
      setImageUrl(dataUrl);
      setShowModal(true);
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
    link.download = `klaro-${result.personne?.prenom || "analyse"}.png`;
    link.href = imageUrl;
    link.click();
  };

  return (
    <>
      <button
        onClick={generateImage}
        disabled={isGenerating}
        className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 text-white font-bold text-sm hover:brightness-110 transition flex items-center justify-center gap-2 disabled:opacity-50"
      >
        {isGenerating ? (
          <>
            <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
            Génération...
          </>
        ) : (
          <>
            <Share2 className="w-4 h-4" />
            Partager
          </>
        )}
      </button>

      {/* Modal de prévisualisation */}
      {showModal && imageUrl && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <h3 className="font-bold text-slate-900">Partager l'analyse</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-4">
              <img
                src={imageUrl}
                alt="Aperçu"
                className="w-full rounded-xl mb-4"
              />
              
              <button
                onClick={downloadImage}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold hover:brightness-110 transition flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                Télécharger l'image
              </button>
              
              <p className="text-xs text-slate-500 text-center mt-3">
                Partage sur WhatsApp, LinkedIn ou Instagram
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}