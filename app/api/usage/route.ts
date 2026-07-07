import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function GET() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({
        plan: "free",
        used: 0,
        limit: 100,
        remaining: 100
      });
    }

    // Récupérer le profil utilisateur
    let profile = await prisma.userProfile.findUnique({
      where: { id: userId }
    });

    // Si pas de profil, le créer
    if (!profile) {
      profile = await prisma.userProfile.create({
        data: {
          id: userId,
          plan: "free"
        }
      });
    }

    // Compter les analyses du mois en cours
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const sceneCount = await prisma.scene.count({
      where: {
        userId,
        createdAt: {
          gte: startOfMonth
        }
      }
    });

    const limit = profile.plan === "premium" ? 999999 : 100;
    const remaining = Math.max(0, limit - sceneCount);

    return NextResponse.json({
      plan: profile.plan,
      used: sceneCount,
      limit,
      remaining
    });
  } catch (error) {
    console.error("Erreur comptage usage:", error);
    return NextResponse.json(
      { error: "Erreur lors du comptage" },
      { status: 500 }
    );
  }
}