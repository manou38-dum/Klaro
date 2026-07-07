import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  context: { params: Promise<{ teamId: string }> }
) {
  try {
    const { teamId } = await context.params;
    
    const team = await prisma.team.findUnique({
      where: { id: teamId },
      include: {
        members: {
          include: {
            card: true
          }
        },
        analyses: {
          orderBy: { createdAt: "desc" }
        }
      }
    });

    if (!team) {
      return NextResponse.json({ error: "Équipe non trouvée" }, { status: 404 });
    }

    return NextResponse.json(team);
  } catch (error) {
    console.error("Erreur récupération équipe:", error);
    return NextResponse.json(
      { error: "Erreur lors du chargement" },
      { status: 500 }
    );
  }
}