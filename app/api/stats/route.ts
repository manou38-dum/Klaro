import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Nombre total de scènes
    const totalScenes = await prisma.scene.count();

    // Nombre total de cartes
    const totalCards = await prisma.card.count();

    // Cartes les plus analysées (top 5)
    const topCards = await prisma.card.findMany({
      include: {
        _count: {
          select: { scenes: true }
        }
      },
      orderBy: {
        scenes: {
          _count: "desc"
        }
      },
      take: 5
    });

    // Évolution des scènes par jour (derniers 30 jours)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentScenes = await prisma.scene.findMany({
      where: {
        createdAt: {
          gte: thirtyDaysAgo
        }
      },
      orderBy: {
        createdAt: "asc"
      },
      select: {
        createdAt: true
      }
    });

    // Grouper par jour
    const scenesByDay: Record<string, number> = {};
    recentScenes.forEach((scene) => {
      const day = new Date(scene.createdAt).toISOString().split("T")[0];
      scenesByDay[day] = (scenesByDay[day] || 0) + 1;
    });

    // Répartition par mode
    const cardsByMode = await prisma.card.groupBy({
      by: ["mode"],
      _count: {
        mode: true
      }
    });

    return NextResponse.json({
      totalScenes,
      totalCards,
      topCards: topCards.map((card) => ({
        id: card.id,
        prenom: card.prenom,
        emoji: card.emoji,
        mode: card.mode,
        sceneCount: card._count.scenes
      })),
      scenesByDay,
      cardsByMode: cardsByMode.map((item) => ({
        mode: item.mode,
        count: item._count.mode
      }))
    });
  } catch (error) {
    console.error("Erreur stats:", error);
    return NextResponse.json(
      { error: "Erreur lors du calcul des statistiques" },
      { status: 500 }
    );
  }
}