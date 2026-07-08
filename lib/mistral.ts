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
    let userPrompt = "";

    // MODE COMÉRAGE
    if (mode === "comerage") {
      systemPrompt = "Tu es un pote sarcastique qui décrypte les ragots. Tu es direct, drôle, un peu taquin. Réponds UNIQUEMENT en JSON valide. Commence par { et finis par }.";
      userPrompt = `Analyse cette scène de groupe : ${scene.substring(0, 500)}
RÈGLES : Identifie le genre de CHAQUE personne. Utilise "il" ou "elle".
Réponds UNIQUEMENT ce JSON :
{"insight_principal":"Phrase choc","confiance_globale":90,"personne":{"prenom":"La bande","emoji":"☕"},"dynamiques":[{"acteur":"Prénom","genre":"homme/femme","role":"Role","analyse":"Analyse avec le bon pronom"},{"acteur":"Prénom","genre":"homme/femme","role":"Role","analyse":"Analyse"}],"jeux_de_pouvoir":["Jeu1","Jeu2"],"non_dits":["Non-dit1","Non-dit2"],"alliances":"Alliances","tensions":"Tensions","conseil":"Conseil de pote"}`;

      try {
        const response = await client.chat.complete({
          model: "mistral-large-latest",
          messages: [{ role: "system", content: systemPrompt }, { role: "user", content: userPrompt }],
          temperature: 0.7, maxTokens: 2000
        });
        const rawContent = response.choices?.[0]?.message?.content;
        if (!rawContent) return { error: "Pas de réponse" };
        const content = typeof rawContent === 'string' ? rawContent : String(rawContent);
        const cleanContent = content.trim().replace(/```json\n?/g, '').replace(/```\n?/g, '');
        const startIndex = cleanContent.indexOf("{");
        const endIndex = cleanContent.lastIndexOf("}");
        if (startIndex === -1 || endIndex === -1) return { error: "Erreur d'analyse" };
        const result = JSON.parse(cleanContent.substring(startIndex, endIndex + 1));
        return { ...result, degree: 3, mode: "comerage" };
      } catch (error) {
        console.error("Erreur Mistral comérage:", error);
        return { error: "Erreur lors de l'analyse" };
      }
    }

    // INSTRUCTION DE CONTEXTE
    const contextInstructions: Record<string, string> = {
      pro: "PRISME PROFESSIONNEL : Analyse sous l'angle du pouvoir, de la hiérarchie, de la carrière, de l'efficacité et des enjeux financiers. Vocabulaire corporate et leadership.",
      familial: "PRISME FAMILIAL : Analyse sous l'angle des liens du sang, de l'histoire commune, de l'amour inconditionnel vs toxicité, et des rôles assignés (parent/enfant).",
      ami: "PRISME AMICAL : Analyse sous l'angle de la loyauté, de la trahison, de l'ego, de la dynamique de groupe et du besoin d'appartenance.",
      social: "PRISME SOCIAL : Analyse sous l'angle des normes sociales, du jugement d'autrui, de la politesse, des apparences et des codes de la société."
    };
    const currentContext = contextInstructions[mode] || "";

    // DEGRÉ 1 : INTUITION / POP-CULTURE
    if (degree === 1) {
      systemPrompt = "Tu es un expert pop-culture et intuition pure. Ton : fun, viral, cash. Réponds UNIQUEMENT en JSON valide. Commence par { et finis par }.";
      userPrompt = `${currentContext}
SCÈNE: ${scene}
RÉPONDS UNIQUEMENT CE JSON:
{"insight_principal":"Phrase choc max 20 mots","reference_pop":"Comparaison avec une série, un film, un people ou une réplique culte qui résume la scène","mots_cles":["Mot1","Mot2","Mot3"],"ressenti_global":"Ambiance en 1-2 phrases","confiance_globale":70,"personne":{"prenom":"${prenomSafe}","emoji":"${emojiSafe}"}}`;
    } 
    // DEGRÉ 2 : BIENVEILLANT
    else if (degree === 2) {
      systemPrompt = "Tu es un coach empathique et bienveillant. Ton : doux, compréhensif, focus sur les émotions. Réponds UNIQUEMENT en JSON valide. Commence par { et finis par }.";
      userPrompt = `${currentContext}
SCÈNE: ${scene}
RÉPONDS UNIQUEMENT CE JSON:
{"insight_principal":"Phrase bienveillante","emotions_detectees":["Emotion1","Emotion2"],"besoin_cache":"Ce dont la personne a vraiment besoin","conseil_doux":"1 phrase pour apaiser la situation","confiance_globale":75,"personne":{"prenom":"${prenomSafe}","emoji":"${emojiSafe}"}}`;
    } 
    // DEGRÉ 3 : ANALYTIQUE (BIG FIVE)
    else if (degree === 3) {
      systemPrompt = "Tu es un expert en psychométrie (Big Five OCEAN). Ton : scientifique, factuel, structuré, vocabulaire RH/Coach. Réponds UNIQUEMENT en JSON valide. Commence par { et finis par }.";
      userPrompt = `${currentContext}
SCÈNE: ${scene}
RÉPONDS UNIQUEMENT CE JSON (score_polarise de -2 à 2) - REMPLIS TOUS LES CHAMPS OBLIGATOIRES:
{"insight_principal":"Clé de lecture factuelle","confiance_globale":85,"personne":{"prenom":"${prenomSafe}","emoji":"${emojiSafe}"},"traits":[{"trait":"Nom du trait","bigfive_dimension":"O/C/E/A/N","score_polarise":1,"score_label":"Élevé/Moyen/Bas","analyse":"Explication technique liée au contexte"}],"rapports":{"autorite":"Relation au pouvoir (20-30 mots)","pairs":"Relation aux autres (20-30 mots)","action":"Face à l'adversité (20-30 mots)"},"conseil_strategique":"Conseil factuel pour optimiser la relation"}`;
    } 
    // DEGRÉ 4 : CLINIQUE
    else if (degree === 4) {
      systemPrompt = "Tu es un psychologue clinicien expert (DSM-5, mécanismes de défense). Ton : expert, précis, vocabulaire médical/psychologique. Réponds UNIQUEMENT en JSON valide. Commence par { et finis par }.";
      userPrompt = `${currentContext}
SCÈNE: ${scene}
RÉPONDS UNIQUEMENT CE JSON:
{"insight_principal":"Observation clinique","confiance_globale":80,"personne":{"prenom":"${prenomSafe}","emoji":"${emojiSafe}"},"mecanismes_defense":["Mécanisme 1","Mécanisme 2"],"analyse_emotionnelle":{"expression":"Comment l'émotion sort","regulation":"Comment elle est gérée"},"vigilance":"Point d'attention psychologique","rapports":{"autorite":"Relation au pouvoir","pairs":"Relation aux pairs","action":"Face à l'action"},"conseil_pro":"Comment gérer ce profil cliniquement"}`;
    } 
    // DEGRÉ 5 : HARDCORE / PSYCHOLOGIE SOMBRE
    else {
      systemPrompt = "Tu es un expert en psychologie sombre (Machiavel, manipulation, PNL). Ton : cynique, brutal, sans filtre, lucidité cruelle. Réponds UNIQUEMENT en JSON valide. Commence par { et finis par }.";
      userPrompt = `${currentContext}
SCÈNE: ${scene}
RÉPONDS UNIQUEMENT CE JSON:
{"insight_principal":"La vérité qui blesse","confiance_globale":99,"personne":{"prenom":"${prenomSafe}","emoji":"${emojiSafe}"},"leviers_manipulation":["Technique 1","Technique 2"],"faille_narcissique":"Son point faible exploitable","zone_ombre":["Secret inavouable 1","Secret inavouable 2"],"rapports":{"autorite":"Relation au pouvoir","pairs":"Relation aux pairs","action":"Face à l'action"},"conseil_machiavel":"Comment prendre le dessus ou se protéger brutalement"}`;
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
    if (!rawContent) return { error: "Pas de réponse de l'IA" };

    const content = typeof rawContent === 'string' ? rawContent : Array.isArray(rawContent) ? rawContent.join('') : String(rawContent);
    const startIndex = content.indexOf("{");
    const endIndex = content.lastIndexOf("}");

    if (startIndex === -1 || endIndex === -1) return { error: "Pas de JSON dans la réponse" };
    const jsonContent = content.substring(startIndex, endIndex + 1);

    try {
      const result = JSON.parse(jsonContent);
      
      // GÉNÉRER DES RAPPORTS PAR DÉFAUT SI MANQUANTS
      if (!result.rapports) {
        const contextLabel = mode === 'pro' ? 'professionnel' : mode === 'familial' ? 'familial' : mode === 'ami' ? 'amical' : 'social';
        const toneHardcore = degree === 5;
        
        result.rapports = {
          autorite: toneHardcore 
            ? `En contexte ${contextLabel}, il/elle utilise l'autorité comme une arme de domination. Son pouvoir ne vient pas de sa compétence mais de sa capacité à intimider et contrôler.`
            : `Dans un contexte ${contextLabel}, sa relation à l'autorité révèle ${degree >= 3 ? "une recherche de reconnaissance hiérarchique" : "un besoin de validation"}.`,
          pairs: toneHardcore
            ? `Avec ses pairs, c'est la loi du plus fort. Il/elle crée des alliances temporaires qu'il/elle brise dès qu'elles ne servent plus ses intérêts.`
            : `Avec ses pairs, il/elle adopte une posture ${degree >= 3 ? "compétitive mais structurante" : "plutôt collaborative"}.`,
          action: toneHardcore
            ? `Face à l'action, il/elle privilégie le contrôle absolu. Chaque initiative doit passer par son filtre, créant goulots d'étranglement et dépendance.`
            : `Face à l'action, il/elle ${degree >= 3 ? "analyse avant d'agir, parfois au détriment de la réactivité" : "agit avec spontanéité"}.`
        };
      }
      
      return { ...result, degree };
    } catch (parseError) {
      return { error: "JSON malformé" };
    }

  } catch (error) {
    console.error("Erreur Mistral:", error);
    return { error: "Erreur API Mistral" };
  }
}