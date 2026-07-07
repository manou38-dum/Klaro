import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { cardIds } = body;

    if (!cardIds || !Array.isArray(cardIds) || cardIds.length < 2) {
      return NextResponse.json(
        { error: "Il faut au moins 2 cartes pour comparer" },
        { status: 400 }
      );
    }

    // Récupérer les cartes avec leurs scènes
    const cards = await prisma.card.findMany({
      where: {
        id: { in: cardIds }
      },
      include: {
        scenes: {
          orderBy: { createdAt: "desc" }
        }
      }
    });

    if (cards.length < 2) {
      return NextResponse.json(
        { error: "Au moins une carte n'existe pas" },
        { status: 404 }
      );
    }

    // Calculer les moyennes des traits pour chaque carte
    const cardsWithStats = cards.map((card) => {
      const allTraits: any[] = [];
      
      card.scenes.forEach((scene) => {
        const result = scene.result as any;
        if (result.traits && Array.isArray(result.traits)) {
          allTraits.push(...result.traits);
        }
      });

      // Grouper par dimension Big Five et calculer moyenne
      const bigFiveAverages: Record<string, { sum: number; count: number }> = {
        O: { sum: 0, count: 0 },
        C: { sum: 0, count: 0 },
        E: { sum: 0, count: 0 },
        A: { sum: 0, count: 0 },
        N: { sum: 0, count: 0 }
      };

      allTraits.forEach((trait) => {
        const dim = trait.bigfive_dimension;
        if (bigFiveAverages[dim]) {
          bigFiveAverages[dim].sum += trait.score_polarise;
          bigFiveAverages[dim].count += 1;
        }
      });

      const averages = Object.entries(bigFiveAverages).map(([dim, data]) => ({
        dimension: dim,
        average: data.count > 0 ? data.sum / data.count : 0,
        sampleSize: data.count
      }));

      return {
        id: card.id,
        prenom: card.prenom,
        emoji: card.emoji,
        mode: card.mode,
        sceneCount: card.scenes.length,
        bigFiveAverages: averages
      };
    });

    return NextResponse.json({ cards: cardsWithStats });
  } catch (error) {
    console.error("Erreur comparaison:", error);
    return NextResponse.json(
      { error: "Erreur lors de la comparaison" },
      { status: 500 }
    );
  }
}
