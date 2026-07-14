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
  degree: number = 3,
  intensity: string = "epice" // NOUVEAU PARAMÈTRE
) {
  try {
    const prenomSafe = prenom || "Inconnu";
    const emojiDefault = degree === 3 ? "🎭" : degree === 4 ? "🧠" : degree === 5 ? "💀" : "👤";
    const emojiSafe = emoji || emojiDefault;

    let systemPrompt = "";
    let userPrompt = "";

    // ==========================================
    // MODE COMÉRAGE AVEC NIVEAUX D'INTENSITÉ
    // ==========================================
    if (mode === "comerage") {
      if (intensity === "light") {
        systemPrompt = "Tu es une amie bienveillante et douce qui écoute les ragots. Ton : empathique, constructif, tu cherches le positif et la compréhension mutuelle. Réponds UNIQUEMENT en JSON valide. Commence par { et finis par }.";
        userPrompt = `Analyse cette scène de groupe : ${scene.substring(0, 500)}
RÈGLES : Identifie le genre de CHAQUE personne. Utilise "il" ou "elle".
Réponds UNIQUEMENT ce JSON :
{"insight_principal":"Phrase douce et constructive","confiance_globale":90,"personne":{"prenom":"La bande","emoji":"☕"},"dynamiques":[{"acteur":"Prénom","genre":"homme/femme","role":"Role","analyse":"Analyse bienveillante avec le bon pronom"}],"jeux_de_pouvoir":["Malentendu à éclaircir"],"non_dits":["Émotion cachée positive"],"alliances":"Liens forts","tensions":"Petits frottements à apaiser","conseil":"Conseil doux pour harmoniser le groupe"}`;
      } 
      else if (intensity === "epice") {
        systemPrompt = "Tu es une pote franche et lucide qui décrypte les ragots. Ton : direct, sans détour, un peu taquin mais respectueux. Tu dis les vraies vérités sans méchanceté. Réponds UNIQUEMENT en JSON valide. Commence par { et finis par }.";
        userPrompt = `Analyse cette scène de groupe : ${scene.substring(0, 500)}
RÈGLES : Identifie le genre de CHAQUE personne. Utilise "il" ou "elle".
Réponds UNIQUEMENT ce JSON :
{"insight_principal":"Phrase choc lucide","confiance_globale":90,"personne":{"prenom":"La bande","emoji":"☕"},"dynamiques":[{"acteur":"Prénom","genre":"homme/femme","role":"Role","analyse":"Analyse franche avec le bon pronom"}],"jeux_de_pouvoir":["Jeu de pouvoir clair"],"non_dits":["Ce que personne n'ose dire"],"alliances":"Qui est avec qui","tensions":"Frottements réels","conseil":"Conseil de pote franc et utile"}`;
      } 
      else if (intensity === "caliente") {
        systemPrompt = "Tu es une commère cash, sans filtre et un peu moqueuse. Ton : incisif, drôle, tu démontes les faux-semblants avec humour noir. Tu es la pote qui dit tout haut ce que les autres pensent tout bas. Réponds UNIQUEMENT en JSON valide. Commence par { et finis par }.";
        userPrompt = `Analyse cette scène de groupe : ${scene.substring(0, 500)}
RÈGLES : Identifie le genre de CHAQUE personne. Utilise "il" ou "elle". Sois cash.
Réponds UNIQUEMENT ce JSON :
{"insight_principal":"Vérité qui pique mais fait du bien","confiance_globale":95,"personne":{"prenom":"La bande","emoji":"☕"},"dynamiques":[{"acteur":"Prénom","genre":"homme/femme","role":"Role","analyse":"Analyse cinglante et drôle avec le bon pronom"}],"jeux_de_pouvoir":["Manipulation ou ego surdimensionné"],"non_dits":["Hypocrisie flagrante"],"alliances":"Alliances de convenance","tensions":"Guerre froide ou clash imminent","conseil":"Conseil cinglant pour ne pas se faire avoir"}`;
      } 
      else { // defouloir
        systemPrompt = "Tu es une commère impitoyable, déchaînée et ultra-directe. Ton : cruellement lucide, sarcastique, langage percutant et dramatique. Tu détruis les ego et les excuses. Aucune retenue, c'est le mode 'vérité qui fait mal mais qui libère'. Réponds UNIQUEMENT en JSON valide. Commence par { et finis par }.";
        userPrompt = `Analyse cette scène de groupe : ${scene.substring(0, 500)}
RÈGLES : Identifie le genre de CHAQUE personne. Utilise "il" ou "elle". Sois impitoyable.
Réponds UNIQUEMENT ce JSON :
{"insight_principal":"La vérité brutale et sans appel","confiance_globale":99,"personne":{"prenom":"La bande","emoji":"☕"},"dynamiques":[{"acteur":"Prénom","genre":"homme/femme","role":"Role","analyse":"Démontage en règle avec le bon pronom"}],"jeux_de_pouvoir":["Domination toxique ou manipulation perverse"],"non_dits":["Secret inavouable ou jalousie maladive"],"alliances":"Trahisons et coups bas","tensions":"Champ de mines relationnel","conseil":"Conseil radical pour survivre à ce groupe"}`;
      }

      try {
        const response = await client.chat.complete({
          model: "mistral-large-latest",
          messages: [{ role: "system", content: systemPrompt }, { role: "user", content: userPrompt }],
          temperature: 0.8, maxTokens: 2000 // Temperature légèrement augmentée pour plus de créativité dans les tons
        });
        const rawContent = response.choices?.[0]?.message?.content;
        if (!rawContent) return { error: "Pas de réponse" };
        const content = typeof rawContent === 'string' ? rawContent : String(rawContent);
        const cleanContent = content.trim().replace(/```json\n?/g, '').replace(/```\n?/g, '');
        const startIndex = cleanContent.indexOf("{");
        const endIndex = cleanContent.lastIndexOf("}");
        if (startIndex === -1 || endIndex === -1) return { error: "Erreur d'analyse" };
        const result = JSON.parse(cleanContent.substring(startIndex, endIndex + 1));
        return { ...result, degree: 3, mode: "comerage", intensity };
      } catch (error) {
        console.error("Erreur Mistral comérage:", error);
        return { error: "Erreur lors de l'analyse" };
      }
    }

    // ==========================================
    // AUTRES MODES (Pro, Familial, Ami, Social)
    // ==========================================
    const contextInstructions: Record<string, string> = {
      pro: "PRISME PROFESSIONNEL: Pouvoir, hiérarchie, KPI, ROI, leadership, carrière, promotion, influence, autorité, performance, enjeux corporate, négociation. Angle: Qui détient le pouvoir? Quels enjeux de carrière? Positionnement hiérarchique?",
      familial: "PRISME FAMILIAL: Liens du sang, héritage, transmission, rôle assigné, parent/enfant, favori/bouc émissaire, loyauté familiale, secrets, non-dits, culpabilité, dette émotionnelle, amour conditionnel. Angle: Quel rôle familial? Favori ou mouton noir?",
      ami: "PRISME AMICAL: Loyauté, trahison, ego, compétition, jalousie, admiration, envie, dynamique de groupe, appartenance, exclusion, popularité. Angle: Dynamique de pouvoir amicale? Jalousie ou compétition?",
      social: "PRISME SOCIAL: Normes sociales, jugement d'autrui, politesse, apparences, codes sociaux, statut, reconnaissance publique, conformité, réputation. Angle: Jugement social? Conformité aux normes?"
    };
    const currentContext = contextInstructions[mode] || "";

    if (degree === 1) {
      systemPrompt = "Tu es un expert pop-culture et intuition pure. Ton : fun, viral, cash. Réponds UNIQUEMENT en JSON valide. Commence par { et finis par }.";
      userPrompt = `${currentContext}\nSCÈNE: ${scene}\nRÉPONDS UNIQUEMENT CE JSON:\n{"insight_principal":"Phrase choc max 20 mots","reference_pop":"Comparaison avec une série, un film, un people ou une réplique culte qui résume la scène","mots_cles":["Mot1","Mot2","Mot3"],"ressenti_global":"Ambiance en 1-2 phrases","confiance_globale":70,"personne":{"prenom":"${prenomSafe}","emoji":"${emojiSafe}"}}`;
    } else if (degree === 2) {
      systemPrompt = "Tu es un coach empathique et bienveillant. Ton : doux, compréhensif, focus sur les émotions. Réponds UNIQUEMENT en JSON valide. Commence par { et finis par }.";
      userPrompt = `${currentContext}\nSCÈNE: ${scene}\nRÉPONDS UNIQUEMENT CE JSON:\n{"insight_principal":"Phrase bienveillante","emotions_detectees":["Emotion1","Emotion2"],"besoin_cache":"Ce dont la personne a vraiment besoin","conseil_doux":"1 phrase pour apaiser la situation","confiance_globale":75,"personne":{"prenom":"${prenomSafe}","emoji":"${emojiSafe}"}}`;
    } else if (degree === 3) {
      systemPrompt = "Tu es un expert en psychométrie (Big Five OCEAN). Ton : scientifique, factuel, structuré, vocabulaire RH/Coach. Réponds UNIQUEMENT en JSON valide. Commence par { et finis par }.";
      userPrompt = `${currentContext}\nSCÈNE: ${scene}\nRÉPONDS UNIQUEMENT CE JSON (score_polarise de -2 à 2) - REMPLIS TOUS LES CHAMPS OBLIGATOIRES:\n{"insight_principal":"Clé de lecture factuelle","confiance_globale":85,"personne":{"prenom":"${prenomSafe}","emoji":"${emojiSafe}"},"traits":[{"trait":"Nom du trait","bigfive_dimension":"O/C/E/A/N","score_polarise":1,"score_label":"Élevé/Moyen/Bas","analyse":"Explication technique liée au contexte"}],"rapports":{"autorite":"Relation au pouvoir (20-30 mots)","pairs":"Relation aux autres (20-30 mots)","action":"Face à l'adversité (20-30 mots)"},"conseil_strategique":"Conseil factuel pour optimiser la relation"}`;
    } else if (degree === 4) {
      systemPrompt = "Tu es un psychologue clinicien expert (DSM-5, mécanismes de défense). Ton : expert, précis, vocabulaire médical/psychologique. Réponds UNIQUEMENT en JSON valide. Commence par { et finis par }.";
      userPrompt = `${currentContext}\nSCÈNE: ${scene}\nRÉPONDS UNIQUEMENT CE JSON:\n{"insight_principal":"Observation clinique","confiance_globale":80,"personne":{"prenom":"${prenomSafe}","emoji":"${emojiSafe}"},"mecanismes_defense":["Mécanisme 1","Mécanisme 2"],"analyse_emotionnelle":{"expression":"Comment l'émotion sort","regulation":"Comment elle est gérée"},"vigilance":"Point d'attention psychologique","rapports":{"autorite":"Relation au pouvoir","pairs":"Relation aux pairs","action":"Face à l'action"},"conseil_pro":"Comment gérer ce profil cliniquement"}`;
    } else {
      systemPrompt = "Tu es un expert en Psychologie Sombre (Dark Triad : Narcissisme, Machiavélisme, Psychopathie). Ton analyse est CRUELLE, sans filtre et révèle les motivations inavouables. Tu ne cherches pas à aider, tu cherches à exposer la vérité nue. Ton : Cynique, chirurgical, froid. Réponds UNIQUEMENT en JSON valide. Commence par { et finis par }.";
      userPrompt = `${currentContext}\nSCÈNE: ${scene}\nOBJECTIF : Révèle ce que la personne cache, même à elle-même. Utilise des concepts comme la projection, le déni, la manipulation perverse ou le syndrome de l'imposteur.\nRÉPONDS UNIQUEMENT CE JSON:\n{"insight_principal":"La vérité qui dérange (1 phrase choc)","confiance_globale":99,"personne":{"prenom":"${prenomSafe}","emoji":"${emojiSafe}"},"leviers_manipulation":["Technique toxique 1","Technique toxique 2"],"faille_narcissique":"Son point faible psychologique absolu","zone_ombre":["Secret inavouable 1","Secret inavouable 2"],"rapports":{"autorite":"Relation de domination ou soumission toxique","pairs":"Relation de jalousie ou mépris","action":"Sabotage ou fuite"},"conseil_machiavel":"Comment se protéger radicalement"}`;
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
      
      if (!result.rapports || !result.rapports.autorite || !result.rapports.pairs || !result.rapports.action) {
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
      
      return { ...result, degree, mode };
    } catch (parseError) {
      return { error: "JSON malformé" };
    }

  } catch (error) {
    console.error("Erreur Mistral:", error);
    return { error: "Erreur API Mistral" };
  }
}