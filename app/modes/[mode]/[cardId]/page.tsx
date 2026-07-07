import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import AddSceneForm from "@/components/AddSceneForm";
import SceneHistory from "@/components/SceneHistory";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function CardPage({ params }: { params: { mode: string; cardId: string } }) {
  const { mode, cardId } = params;

  // Récupérer la carte et ses scènes depuis la base
  const card = await prisma.card.findUnique({
    where: { id: cardId },
    include: {
      scenes: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!card) notFound();

  return (
    <div className="max-w-xl mx-auto space-y-8 p-4 pb-20">
      {/* Header Carte */}
      <div className="space-y-4">
        <Link href={`/modes/${mode}`} className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 transition">
          <ArrowLeft className="w-4 h-4" />
          Retour aux cartes
        </Link>
        
        <div className="text-center space-y-2 pt-4">
          <div className="text-6xl drop-shadow-sm">{card.emoji}</div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">{card.prenom}</h1>
          <p className="text-slate-500 text-sm font-medium">
            {card.scenes.length} scène{card.scenes.length > 1 ? "s" : ""} analysée{card.scenes.length > 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {/* Formulaire d'ajout */}
<div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
  <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
    <span className="text-violet-500"></span> Nouvelle scène
  </h2>
  <AddSceneForm mode={card.mode} cardId={card.id} />
</div>
      {/* Historique */}
      {card.scenes.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <span className="text-slate-400"></span> Historique des analyses
          </h2>
          <SceneHistory scenes={card.scenes} />
        </div>
      )}
    </div>
  );
}