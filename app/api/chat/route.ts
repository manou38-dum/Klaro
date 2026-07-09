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

    if (!userMessage) {
      return NextResponse.json({ error: "Message manquant" }, { status: 400 });
    }

    // Prompt pour des réponses courtes et cash
    const systemPrompt = `Tu es une copine cash et directe. Tes réponses doivent être TRÈS COURTES (2 phrases max). Pas de blabla, va droit au but.`;

    const contextText = scene ? `SCÈNE ORIGINALE: ${scene}\n\nANALYSE INITIALE: ${JSON.stringify(initialAnalysis)}\n\n` : "";

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
      { role: "user", content: userMessage }
    ];

    const response = await client.chat.complete({
      model: "mistral-small-latest", // Modèle beaucoup plus rapide
      messages: messages,
      temperature: 0.7,
      maxTokens: 200 // Réduit drastiquement le temps de génération
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