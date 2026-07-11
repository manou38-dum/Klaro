import { Mistral } from "@mistralai/mistralai";
import { NextResponse } from "next/server";

const apiKey = process.env.MISTRAL_API_KEY;

if (!apiKey) {
  throw new Error("MISTRAL_API_KEY is not set");
}

const client = new Mistral({ apiKey });

export async function POST(req: Request) {
  try {
    const { scene, analysis, question, initialAnalysis, userMessage, conversationHistory } = await req.json();

    // Accepter soit "question" soit "userMessage"
    const message = question || userMessage;

    if (!message) {
      return NextResponse.json({ error: "Message manquant" }, { status: 400 });
    }

    // Prompt équilibré : conversation naturelle mais concise
    const systemPrompt = `Tu es une copine qui analyse les ragots en mode commérage. Tu réponds comme un SMS entre potes : COURT et PUNCHY. Maximum 1-2 phrases. Tu dois être directe, cash, avec du piquant. Pas de blabla. Tu ajoutes du sel dans la conversation, tu commentes les échanges, tu donnes ton avis tranché.`;

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