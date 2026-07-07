import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    const body = await request.json();
    const { cardId, sceneText, result } = body;

    if (!cardId || !sceneText || !result) {
      return NextResponse.json(
        { error: "Données incomplètes" },
        { status: 400 }
      );
    }

    // Vérifier la limite si utilisateur connecté
    if (userId) {
      let profile = await prisma.userProfile.findUnique({
        where: { id: userId }
      });

      if (!profile) {
        profile = await prisma.userProfile.create({
          data: { id: userId, plan: "free" }
        });
      }

      if (profile.plan === "free") {
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        const sceneCount = await prisma.scene.count({
          where: {
            userId,
            createdAt: { gte: startOfMonth }
          }
        });

        if (sceneCount >= 3) {
          return NextResponse.json(
            { 
              error: "Limite atteinte",
              message: "Vous avez atteint la limite de 3 analyses gratuites ce mois-ci. Passez à Premium pour des analyses illimitées !",
              limitReached: true
            },
            { status: 429 }
          );
        }
      }
    }

    const scene = await prisma.scene.create({
      data: {
        cardId,
        sceneText,
        result,
        userId: userId || null
      }
    });

    await prisma.card.update({
      where: { id: cardId },
      data: { updatedAt: new Date() }
    });

    return NextResponse.json(scene);
  } catch (error) {
    console.error("Erreur création scène:", error);
    return NextResponse.json(
      { error: "Erreur lors de la sauvegarde" },
      { status: 500 }
    );
  }
}
