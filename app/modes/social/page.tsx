import Link from "next/link";
import { Globe } from "lucide-react";
import { prisma } from "@/lib/prisma";

export default function SocialModePage() {
  return (
    <div className="max-w-2xl mx-auto p-4">
      <Link href="/" className="text-sm text-slate-500 hover:text-slate-800 transition mb-4 inline-block">
        ← Retour
      </Link>

      <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-6 text-white mb-6 shadow-lg">
        <div className="flex items-center gap-3 mb-2">
          <Globe className="w-8 h-8" />
          <h1 className="text-3xl font-black">Social</h1>
        </div>
        <p className="text-lg opacity-90">
          Voisins, inconnus, administration, vacances, services...
        </p>
      </div>

      <div className="space-y-4">
        <Link
          href="/modes/social/new"
          className="block w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold text-center hover:brightness-110 transition-all shadow-lg"
        >
          ➕ Créer une nouvelle personne
        </Link>

        <ExistingCards mode="social" />
      </div>
    </div>
  );
}

async function ExistingCards({ mode }: { mode: string }) {
  const cards = await prisma.card.findMany({
    where: { mode },
    include: {
      _count: { select: { scenes: true } }
    },
    orderBy: { updatedAt: "desc" }
  });

  if (cards.length === 0) {
    return (
      <div className="text-center py-12 text-slate-400">
        <p className="text-sm">Aucune personne créée pour le moment</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h2 className="text-lg font-bold text-slate-900">Vos personnes</h2>
      {cards.map((card) => (
        <Link
          key={card.id}
          href={`/modes/${mode}/${card.id}`}
          className="block bg-white rounded-xl p-4 border-2 border-slate-200 hover:border-amber-300 hover:shadow-md transition"
        >
          <div className="flex items-center gap-3">
            <div className="text-4xl">{card.emoji}</div>
            <div className="flex-1">
              <div className="font-bold text-slate-900">{card.prenom}</div>
              <div className="text-xs text-slate-500">
                {card._count.scenes} scène{card._count.scenes > 1 ? "s" : ""}
              </div>
            </div>
            <div className="text-amber-500">→</div>
          </div>
        </Link>
      ))}
    </div>
  );
}
