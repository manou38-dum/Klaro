import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { analyzeSituation } from "@/lib/mistral";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { teamId, scenario } = body;

    if (!teamId || !scenario) {
      return NextResponse.json(
        { error: "Équipe et scénario requis" },
        { status: 400 }
      );
    }

    // Récupérer l'équipe avec ses membres
    const team = await prisma.team.findUnique({
      where: { id: teamId },
      include: {
        members: {
          include: {
            card: {
              include: {
                scenes: {
                  take: 3,
                  orderBy: { createdAt: "desc" }
                }
              }
            }
          }
        }
      }
    });

    if (!team) {
      return NextResponse.json(
        { error: "Équipe non trouvée" },
        { status: 404 }
      );
    }

    // Construire le contexte de l'équipe
    const teamContext = team.members.map((member, index) => {
      const recentScenes = member.card.scenes.map((s) => s.sceneText).join("\n");
      return `
Membre ${index + 1}: ${member.card.prenom} (${member.card.emoji})
Scènes récentes:
${recentScenes}
      `.trim();
    }).join("\n\n");

    const fullPrompt = `
ÉQUIPE: ${team.name}
MODE: ${team.mode.toUpperCase()}

MEMBRES:
${teamContext}

SCÉNARIO À ANALYSER:
${scenario}

Analyse la dynamique collective de cette équipe dans ce scénario.
Focus sur: interactions, leadership, conflits potentiels, synergie.
    `.trim();

    // Analyser avec Mistral
    const analysis = await analyzeSituation(
      fullPrompt,
      team.mode,
      team.name,
      "👥"
    );

    // Sauvegarder l'analyse
    const teamAnalysis = await prisma.teamAnalysis.create({
      data: {
        teamId,
        scenario,
        result: analysis
      }
    });

    return NextResponse.json({
      analysis,
      teamAnalysis
    });
  } catch (error) {
    console.error("Erreur analyse équipe:", error);
    return NextResponse.json(
      { error: "Erreur lors de l'analyse" },
      { status: 500 }
    );
  }
}
