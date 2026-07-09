import { Mistral } from "@mistralai/mistralai";
import { NextResponse } from "next/server";

const apiKey = process.env.MISTRAL_API_KEY;

if (!apiKey) {
  throw new Error("MISTRAL_API_KEY is not set");
}

const client = new Mistral({ apiKey });

export async function POST(req: Request) {
  try {
    const { scene, initialAnalysis, userMessage, conversationHistory } = await req.json();

    if (!scene || !userMessage) {
      return NextResponse.json({ error: "Données manquantes" }, { status: 400 });
    }

    // Construire le contexte complet
    const systemPrompt = `Tu es une copine qui analyse les ragots. Tu continues la conversation de manière naturelle, drôle et directe. Tu te souviens de toute l'analyse précédente.`;

    // Construire l'historique complet
    const messages: any[] = [
      { role: "system", content: systemPrompt },
      { 
        role: "user", 
        content: `SCÈNE ORIGINALE: ${scene}\n\nANALYSE INITIALE: ${JSON.stringify(initialAnalysis)}\n\nC'est le contexte. Maintenant, réponds à ma question suivante en tenant compte de tout ça.`
      },
      ...conversationHistory.map((msg: any) => ({
        role: msg.sender === "user" ? "user" : "assistant",
        content: msg.text
      })),
      { role: "user", content: userMessage }
    ];

    const response = await client.chat.complete({
      model: "mistral-large-latest",
      messages: messages,
      temperature: 0.7,
      maxTokens: 1500
    });

    const aiResponse = response.choices?.[0]?.message?.content;

    if (!aiResponse) {
      return NextResponse.json({ error: "Pas de réponse" }, { status: 500 });
    }

    return NextResponse.json({ response: aiResponse });

  } catch (error) {
    console.error("Erreur chat:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}