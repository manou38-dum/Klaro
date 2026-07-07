import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

// GET : Lister toutes les cartes
export async function GET() {
  try {
    const { userId } = await auth();
    
    const where = userId 
      ? { OR: [{ userId }, { userId: null }] }
      : {};

    const cards = await prisma.card.findMany({
      where,
      include: {
        _count: {
          select: { scenes: true }
        }
      },
      orderBy: { updatedAt: "desc" }
    });

    return NextResponse.json(
      cards.map((card) => ({
        id: card.id,
        prenom: card.prenom,
        emoji: card.emoji,
        mode: card.mode,
        relation: card.relation,
        sceneCount: card._count.scenes,
        updatedAt: card.updatedAt
      }))
    );
  } catch (error) {
    console.error("Erreur liste cartes:", error);
    return NextResponse.json(
      { error: "Erreur lors du chargement" },
      { status: 500 }
    );
  }
}

// POST : Créer une nouvelle carte
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    const body = await request.json();
    const { mode, prenom, emoji, relation } = body;

    if (!mode || !prenom || !emoji) {
      return NextResponse.json(
        { error: "Mode, prénom et emoji requis" },
        { status: 400 }
      );
    }

    const card = await prisma.card.create({
      data: {
        mode,
        prenom,
        emoji,
        relation: relation || null,
        userId: userId || null
      }
    });

    return NextResponse.json(card);
  } catch (error) {
    console.error("Erreur création carte:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création" },
      { status: 500 }
    );
  }
}
