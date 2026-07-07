import { Mistral } from "@mistralai/mistralai";

const apiKey = process.env.MISTRAL_API_KEY;

if (!apiKey) {
  throw new Error("MISTRAL_API_KEY is not set");
}

const client = new Mistral({ apiKey });

export async function analyzeSituation(
  scene: string,
  mode: string,
  prenom?: string,
  emoji?: string,
  degree: number = 3
) {
  try {
    const prenomSafe = prenom || "Inconnu";
    const emojiDefault = degree === 3 ? "🎭" : degree === 4 ? "🧠" : degree === 5 ? "💀" : "👤";
    const emojiSafe = emoji || emojiDefault;

    let systemPrompt = "";
    
    if (degree === 1) {
      systemPrompt = "Tu es un expert en intuition comportementale ULTRA-CONCIS. Ta réponse doit ÊTRE UNIQUEMENT du JSON valide, sans AUCUN texte avant ou après. Commence par { et finis par }. Aucun markdown.";
    } else if (degree === 2) {
      systemPrompt = "Tu es un observateur bienveillant. Ta réponse doit ÊTRE UNIQUEMENT du JSON valide, sans AUCUN texte avant ou après. Commence par { et finis par }. Aucun markdown.";
    } else if (degree === 3) {
      systemPrompt = "Tu es un analyste comportemental certifié (Big Five OCEAN). Ta réponse doit ÊTRE UNIQUEMENT du JSON valide, sans AUCUN texte avant ou après. Commence par { et finis par }. Aucun markdown.";
    } else if (degree === 4) {
      systemPrompt = "Tu es un psychologue clinicien expert (DSM-5, Tcherkassoff). Ta réponse doit ÊTRE UNIQUEMENT du JSON valide, sans AUCUN texte avant ou après. Commence par { et finis par }. Aucun markdown.";
    } else if (degree === 5) {
      systemPrompt = "Tu es un analyste cynique sans filtre. Tu révèles névroses et non-dits honteux avec lucidité cruelle. Ta réponse doit ÊTRE UNIQUEMENT du JSON valide, sans AUCUN texte avant ou après. Commence par { et finis par }. Aucun markdown.";
    }

    let userPrompt = "";

    if (degree === 1) {
      userPrompt = `CONTEXTE: ${mode.toUpperCase()}
PERSONNE: ${prenomSafe} ${emojiSafe}

SCÈNE: ${scene}

RÉPONDS UNIQUEMENT CE JSON:
{"insight_principal":"Phrase choc max 20 mots","mots_cles":["Mot1","Mot2","Mot3"],"ressenti_global":"Ambiance en 1-2 phrases","points_cles":[{"titre":"Comportement","explication":"Explication simple en 1 phrase"},{"titre":"Attitude","explication":"Explication simple en 1 phrase"},{"titre":"Conseil","explication":"1 conseil pratique simple"}],"confiance_globale":70,"personne":{"prenom":"${prenomSafe}","emoji":"${emojiSafe}"}}`;
    } else if (degree === 2) {
      userPrompt = `CONTEXTE: ${mode.toUpperCase()}
PERSONNE: ${prenomSafe} ${emojiSafe}

SCÈNE: ${scene}

RÉPONDS UNIQUEMENT CE JSON:
{"insight_principal":"Phrase accroche","traits_surface":[{"trait":"Sympa","description":"Pourquoi en 1 phrase"},{"trait":"Timide","description":"Pourquoi en 1 phrase"}],"conseil_rapide":"1 phrase pour gérer","confiance_globale":75,"personne":{"prenom":"${prenomSafe}","emoji":"${emojiSafe}"}}`;
    } else if (degree === 3) {
      userPrompt = `CONTEXTE: ${mode.toUpperCase()}
PERSONNE: ${prenomSafe} ${emojiSafe}

SCÈNE: ${scene}

RÉPONDS UNIQUEMENT CE JSON (Big Five O/C/E/A/N, score_polarise de -2 à 2):
{"insight_principal":"Clé","confiance_globale":85,"personne":{"prenom":"${prenomSafe}","emoji":"${emojiSafe}"},"traits":[{"trait":"Nom","famille":"Famille","bigfive_dimension":"O","bigfive_facette":"Facette","score_polarise":1,"score_label":"Élevé","analyse":"Explication"}],"rapports":{"autorite":"...","pairs":"...","action":"..."},"conseil":"..."}`;
    } else if (degree === 4) {
      userPrompt = `CONTEXTE: ${mode.toUpperCase()}
PERSONNE: ${prenomSafe} ${emojiSafe}

SCÈNE: ${scene}

RÉPONDS UNIQUEMENT CE JSON:
{"insight_principal":"Insight clinique","confiance_globale":80,"personne":{"prenom":"${prenomSafe}","emoji":"${emojiSafe}"},"traits":[{"trait":"Trait clinique","famille":"Mécanisme","bigfive_dimension":"O","bigfive_facette":"Facette","score_polarise":1,"score_label":"Élevé","analyse":"Analyse technique"}],"vigilances_dsm5":{"style_associe":"...","description":"...","warning":"..."},"analyse_emotionnelle_tcherkassoff":{"expression":"...","regulation":"...","decryptage":"..."},"conseil":"..."}`;
    } else {
      userPrompt = `CONTEXTE: ${mode.toUpperCase()}
PERSONNE: ${prenomSafe} ${emojiSafe}

SCÈNE: ${scene}

RÉPONDS UNIQUEMENT CE JSON (ton cynique):
{"insight_principal":"Vérité qui fait mal","confiance_globale":99,"personne":{"prenom":"${prenomSafe}","emoji":"${emojiSafe}"},"traits":[{"trait":"Névrose dominante","famille":"Défense","bigfive_dimension":"N","bigfive_facette":"Anxiété","score_polarise":2,"score_label":"Extrême","analyse":"Description cruelle vraie"}],"rapports":{"autorite":"Flatte/soumet","pairs":"Manipule/isole","action":"Sabote"},"zone_ombre":["Secret 1","Secret 2"],"conseil":"Comment neutraliser"}`;
    }

    const response = await client.chat.complete({
      model: "mistral-large-latest",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.7,
      maxTokens: 3000
    });

    const rawContent = response.choices?.[0]?.message?.content;

    if (!rawContent) {
      return { error: "Pas de réponse de l'IA" };
    }

    // Convertir en string
    const content = typeof rawContent === 'string' 
      ? rawContent 
      : Array.isArray(rawContent) 
        ? rawContent.join('') 
        : String(rawContent);

    console.log("📩 Réponse Mistral:", content.substring(0, 300));

    // EXTRACTION ROBUSTE DU JSON
    const startIndex = content.indexOf("{");
    const endIndex = content.lastIndexOf("}");

    if (startIndex === -1 || endIndex === -1) {
      console.error("❌ Aucun JSON trouvé");
      return { error: "Pas de JSON dans la réponse", raw: content.substring(0, 200) };
    }

    const jsonContent = content.substring(startIndex, endIndex + 1);

    try {
      const result = JSON.parse(jsonContent);
      return { ...result, degree };
    } catch (parseError) {
      console.error("❌ JSON invalide:", parseError);
      return { 
        error: "JSON malformé", 
        extractedPreview: jsonContent.substring(0, 200) 
      };
    }

  } catch (error) {
    console.error("Erreur Mistral:", error);
    return { error: "Erreur API Mistral" };
  }
}
