import { Mistral } from "@mistralai/mistralai";
import { NextResponse } from "next/server";

const apiKey = process.env.MISTRAL_API_KEY;

if (!apiKey) {
  throw new Error("MISTRAL_API_KEY is not set");
}

const client = new Mistral({ apiKey });

export async function POST(req: Request) {
  try {
    const { scene, analysis, question, mode, initialAnalysis, userMessage, conversationHistory } = await req.json();

    // Accepter soit "question" soit "userMessage"
    const message = question || userMessage;

    if (!message) {
      return NextResponse.json({ error: "Message manquant" }, { status: 400 });
    }

    // Prompt équilibré : conversation naturelle mais concise
    // Adapter le prompt selon le mode
    const getSystemPrompt = (mode: string) => {
      switch (mode) {
        case "pro":
          return `Tu es un consultant en dynamique de groupe professionnelle. Tu analyses les interactions avec un ton posé et analytique. Réponds en 1-2 phrases maximum, de manière concise et professionnelle. Tu donnes des insights utiles sur les dynamiques de pouvoir, les non-dits, et les stratégies relationnelles en entreprise.`;
        case "familial":
          return `Tu es un membre de la famille qui observe les dynamiques familiales avec bienveillance et humour. Tu réponds en 1-2 phrases maximum, avec un ton chaleureux mais perspicace. Tu commentes les tensions familiales, les non-dits, et les alliances avec empathie et un peu d'ironie affectueuse.`;
        case "ami":
          return `Tu es un(e) ami(e) proche qui analyse les ragots entre potes. Tu réponds en 1-2 phrases maximum, comme un SMS entre amis : décontracté, direct, avec de l'humour et des emojis. Tu donnes ton avis cash sur les situations sociales, les tensions, et les alliances.`;
        case "social":
        default:
          return `Tu es une copine qui analyse les ragots en mode commérage. Tu réponds comme un SMS entre potes : COURT et PUNCHY. Maximum 1-2 phrases. Tu dois être directe, cash, avec du piquant. Pas de blabla. Tu ajoutes du sel dans la conversation, tu commentes les échanges, tu donnes ton avis tranché.`;
      }
    };

    const systemPrompt = getSystemPrompt(mode || "social");

    // Accepter soit "analysis" soit "initialAnalysis"
    const analysisData = analysis || initialAnalysis;
    const contextText = scene ? `SCÈNE ORIGINALE: ${scene}\n\nANALYSE INITIALE: ${JSON.stringify(analysisData)}\n\n` : "";

    const messages: any[] = [
      { role: "system", content: systemPrompt },
      { 
        role: "user", 
        content: `${contextText}C'est le contexte. Maintenant, réponds à ma question suivante.`
      },
      ...(conversationHistory || []).map((msg: any) => ({
        role: msg.sender === "user" ? "user" : "assistant",
        content: msg.text
      })),
      { role: "user", content: message }
    ];

    const response = await client.chat.complete({
      model: "mistral-small-latest",
      messages: messages,
      temperature: 0.7,
      maxTokens: 400
    });

    const aiResponse = response.choices?.[0]?.message?.content;

    if (!aiResponse) {
      return NextResponse.json({ error: "Pas de réponse" }, { status: 500 });
    }

    // Retourner les deux formats pour compatibilité
    return NextResponse.json({ 
      response: aiResponse,
      answer: aiResponse 
    });

  } catch (error) {
    console.error("Erreur chat:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}