import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus, ArrowLeft } from "lucide-react";

const MODE_CONFIG: Record<string, { label: string; bg: string; border: string; text: string }> = {
  pro: { label: "Professionnel", bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-700" },
  familial: { label: "Familial", bg: "bg-rose-50", border: "border-rose-200", text: "text-rose-700" },
  ami: { label: "Amical", bg: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-700" },
  pimente: { label: "Pimenté", bg: "bg-orange-50", border: "border-orange-200", text: "text-orange-700" },
  hardcore: { label: "Hardcore", bg: "bg-red-50", border: "border-red-200", text: "text-red-700" }
};

export default async function ModePage({ params }: { params: { mode: string } }) {
  const { mode } = params;
  const modeConfig = MODE_CONFIG[mode] || MODE_CONFIG.pro;

  const cards = await prisma.card.findMany({
    where: { mode },
    orderBy: { updatedAt: "desc" }
  });

  return (
    <div className="max-w-xl mx-auto space-y-6 p-4">
      <Link href="/" className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 transition">
        <ArrowLeft className="w-4 h-4" />
        Changer de mode
      </Link>

      <div className={`${modeConfig.bg} ${modeConfig.border} ${modeConfig.text} rounded-xl p-4 border-2`}>
        <h1 className="text-2xl font-bold">{modeConfig.label}</h1>
        <p className="text-sm opacity-70 mt-1">
          {cards.length} carte{cards.length > 1 ? "s" : ""} analysée{cards.length > 1 ? "s" : ""}
        </p>
      </div>

      <div className="space-y-3">
        {cards.map((card) => (
          <Link
            key={card.id}
            href={`/modes/${mode}/${card.id}`}
            className="block bg-white rounded-xl p-4 border-2 border-slate-200 hover:border-slate-300 hover:shadow-md transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="text-4xl">{card.emoji}</div>
              <div className="flex-1">
                <h2 className="font-semibold text-lg text-slate-900">{card.prenom}</h2>
                <p className="text-xs text-slate-500">
                  Dernière mise à jour : {new Date(card.updatedAt).toLocaleDateString("fr-FR")}
                </p>
              </div>
            </div>
          </Link>
        ))}

        {cards.length === 0 && (
          <div className="text-center py-12 text-slate-400">
            <p className="text-sm">Aucune carte pour ce mode</p>
          </div>
        )}
      </div>

      <Link
        href={`/modes/${mode}/new`}
        className={`w-full py-4 px-6 rounded-xl text-lg font-semibold flex items-center justify-center gap-3 transition-all ${modeConfig.bg.replace('50', '600')} ${modeConfig.text.replace('700', '100')} hover:brightness-110 active:scale-[0.98] shadow-lg`}
      >
        <Plus className="w-5 h-5" />
        Nouvelle carte
      </Link>
    </div>
  );
}