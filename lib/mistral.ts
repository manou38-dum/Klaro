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

    // DÉCLARATION DES VARIABLES AVANT UTILISATION
    let systemPrompt = "";
    let userPrompt = "";

    // MODE COMÉRAGE - Traitement spécial et retour immédiat
    if (mode === "comerage") {
      systemPrompt = "Tu es la meilleure amie qui décrypte tout. Tu parles comme dans une discussion entre copines autour d'un café ou d'un verre de vin. Tu es directe, drôle, coquine, tu n'as pas ta langue dans ta poche. Tu utilises des expressions populaires comme une poissonniere , tu fais des remarques cinglantes. Tu adores les ragots et tu sais lire entre les lignes. Ta réponse doit ÊTRE UNIQUEMENT du JSON valide, sans AUCUN texte avant ou après. Commence par { et finis par }. Aucun markdown.";

      userPrompt = `RAGOT À DÉCRYPTER: ${scene}

Analyse-moi cette situation comme si on était entre copines. Sois directe, drôle, un peu coquine si besoin. Utilise un langage populaire et des expressions du quotidien.

RÉPONDS UNIQUEMENT CE JSON:
{
  "insight_principal": "La vérité qui pique en 1 phrase choc (style 'Ah bah oui, c'est clair qu'elle fait ça pour...')",
  "confiance_globale": 95,
  "personne": {"prenom": "La bande", "emoji": "☕"},
  "dynamiques": [
    {"acteur": "Prénom ou surnom", "role": "La manipulatrice / La victime / La commère / L'innocente / Le bouc émissaire", "analyse": "Ce qu'elle fait vraiment dans son coin (style 'Elle fait la gentille mais en vrai...' )"},
    {"acteur": "Prénom ou surnom", "role": "La manipulatrice / La victime / La commère / L'innocente / Le bouc émissaire", "analyse": "Ce qu'elle fait vraiment dans son coin"}
  ],
  "jeux_de_pouvoir": ["Le coup qu'elle a fait", "L'histoire qu'elle raconte", "La manipulation en cours"],
  "non_dits": ["Ce qu'elle dit pas mais qu'on sait", "Le secret de polichinelle"],
  "alliances": "Qui est avec qui et pourquoi (style 'X et Y sont de mèche parce que...')",
  "tensions": "Où ça chauffe (style 'Attention, Z va péter un câble parce que...')",
  "conseil": "Conseil de copine pour gérer ça (style 'Mon conseil : fais ci, fais ça...')"
}`;

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

      const content = typeof rawContent === 'string' 
        ? rawContent 
        : Array.isArray(rawContent) 
          ? rawContent.join('') 
          : String(rawContent);

      console.log("📩 Réponse Mistral (comérage):", content.substring(0, 300));

      const startIndex = content.indexOf("{");
      const endIndex = content.lastIndexOf("}");

      if (startIndex === -1 || endIndex === -1) {
        return { error: "Pas de JSON dans la réponse", raw: content.substring(0, 200) };
      }

      const jsonContent = content.substring(startIndex, endIndex + 1);

      try {
        const result = JSON.parse(jsonContent);
        return { ...result, degree: 3, mode: "comerage" };
      } catch (parseError) {
        return { error: "JSON malformé", extractedPreview: jsonContent.substring(0, 200) };
      }
    }

    // MODES NORMAUX (pro, familial, ami, social)
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

    const content = typeof rawContent === 'string' 
      ? rawContent 
      : Array.isArray(rawContent) 
        ? rawContent.join('') 
        : String(rawContent);

    console.log("📩 Réponse Mistral:", content.substring(0, 300));

    const startIndex = content.indexOf("{");
    const endIndex = content.lastIndexOf("}");

    if (startIndex === -1 || endIndex === -1) {
      return { error: "Pas de JSON dans la réponse", raw: content.substring(0, 200) };
    }

    const jsonContent = content.substring(startIndex, endIndex + 1);

    try {
      const result = JSON.parse(jsonContent);
      return { ...result, degree };
    } catch (parseError) {
      return { error: "JSON malformé", extractedPreview: jsonContent.substring(0, 200) };
    }

  } catch (error) {
    console.error("Erreur Mistral:", error);
    return { error: "Erreur API Mistral" };
  }
}