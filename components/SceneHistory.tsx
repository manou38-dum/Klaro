"use client";

import { useRouter } from "next/navigation";
import { Clock, ChevronRight } from "lucide-react";

interface Scene {
  id: string;
  sceneText: string;
  result: any;
  createdAt: Date;
}

export default function SceneHistory({ scenes }: { scenes: Scene[] }) {
  const router = useRouter();

  const viewScene = (scene: Scene) => {
    sessionStorage.setItem("analysisResult", JSON.stringify(scene.result));
    router.push("/result");
  };

  return (
    <div className="space-y-3">
      {scenes.map((scene, index) => {
        const insight = scene.result?.insight_principal || scene.result?.synthese?.diagnostic_comportemental || "Analyse disponible";
        const date = new Date(scene.createdAt).toLocaleDateString("fr-FR", {
          day: "numeric",
          month: "long",
          hour: "2-digit",
          minute: "2-digit",
        });

        return (
          <button
            key={scene.id}
            onClick={() => viewScene(scene)}
            className="w-full text-left bg-white rounded-xl p-4 border border-slate-100 shadow-sm hover:shadow-md hover:border-violet-200 transition-all group"
          >
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
                <Clock className="w-3.5 h-3.5" />
                {date}
              </div>
              <span className="text-[10px] font-bold bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">
                Scène #{scenes.length - index}
              </span>
            </div>
            
            <p className="text-sm text-slate-700 font-medium line-clamp-2 mb-2">
              {insight}
            </p>
            
            <p className="text-xs text-slate-400 line-clamp-1 italic">
              "{scene.sceneText.substring(0, 60)}..."
            </p>

            <div className="mt-3 flex justify-end">
              <span className="text-xs font-semibold text-violet-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Voir l'analyse <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
