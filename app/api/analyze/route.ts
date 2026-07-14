import { NextRequest, NextResponse } from 'next/server';
import { analyzeSituation } from '@/lib/mistral';
import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    const body = await request.json();
    const { scene, context, cardId, degree = 3, intensity = "epice" } = body;

    const minLength = degree <= 2 ? 20 : 80;

    if (!scene || scene.trim().length < minLength) {
      return NextResponse.json({
        error: `La scène est trop courte (${scene?.length || 0} caractères). Minimum: ${minLength}`,
      }, { status: 400 });
    }

    const mode = context || "pro";

    let cardPrenom = body.prenom;
    let cardEmoji = body.emoji;

    if (cardId) {
      try {
        const card = await prisma.card.findUnique({ where: { id: cardId } });
        if (card) {
          cardPrenom = card.prenom || cardPrenom;
          cardEmoji = card.emoji || cardEmoji;
        }
      } catch (e) {
        console.error("Erreur lecture carte:", e);
      }
    }

    console.log("📊 Analyse reçue:", { scene: scene?.substring(0, 50) + "...", context: mode, degree, intensity });

    // On passe l'intensité à la fonction Mistral
    const result = await analyzeSituation(scene, mode, cardPrenom, cardEmoji, degree, intensity);

    if (result.error) {
      console.error("❌ Erreur Mistral:", result.error);
      return NextResponse.json({ error: result.error }, { status: 422 });
    }

    console.log("✅ Analyse réussie!");
    return NextResponse.json({ ...result, degree, mode });

  } catch (error) {
    console.error("💥 Erreur API analyze:", error);
    return NextResponse.json({
      error: "Erreur serveur: " + (error instanceof Error ? error.message : String(error)),
    }, { status: 500 });
  }
}