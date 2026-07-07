import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET: Lister toutes les équipes
export async function GET() {
  try {
    const teams = await prisma.team.findMany({
      include: {
        members: {
          include: {
            card: true
          }
        },
        _count: {
          select: { analyses: true }
        }
      },
      orderBy: { updatedAt: "desc" }
    });

    return NextResponse.json(teams);
  } catch (error) {
    console.error("Erreur liste équipes:", error);
    return NextResponse.json(
      { error: "Erreur lors du chargement" },
      { status: 500 }
    );
  }
}

// POST: Créer une nouvelle équipe
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, mode, memberIds } = body;

    if (!name || !mode || !memberIds || memberIds.length < 2) {
      return NextResponse.json(
        { error: "Nom, mode et au moins 2 membres requis" },
        { status: 400 }
      );
    }

    const team = await prisma.team.create({
      data: {
        name,
        description,
        mode,
        members: {
          create: memberIds.map((cardId: string) => ({
            cardId,
            role: "Membre"
          }))
        }
      },
      include: {
        members: {
          include: {
            card: true
          }
        }
      }
    });

    return NextResponse.json(team);
  } catch (error) {
    console.error("Erreur création équipe:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création" },
      { status: 500 }
    );
  }
}
