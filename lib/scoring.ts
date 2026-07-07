export function getScoreLabel(score: number): string {
  switch (score) {
    case 1: return "Faible";
    case 2: return "Modéré";
    case 3: return "Marqué";
    case 4: return "Fort";
    default: return "Inconnu";
  }
}

export function getScoreColor(score: number): string {
  switch (score) {
    case 1: return "bg-slate-200";
    case 2: return "bg-blue-400";
    case 3: return "bg-amber-500";
    case 4: return "bg-rose-600";
    default: return "bg-gray-200";
  }
}

export function getScoreWidth(score: number): string {
  return `${(score / 4) * 100}%`;
}

export function getConfidenceColor(confidence: number): string {
  if (confidence >= 70) return "bg-emerald-500";
  if (confidence >= 50) return "bg-amber-500";
  if (confidence >= 30) return "bg-orange-500";
  return "bg-red-400";
}

export function getConfidenceWidth(confidence: number): string {
  return `${confidence}%`;
}

export function getConfidenceLabel(confidence: number): string {
  if (confidence >= 80) return "Élevée";
  if (confidence >= 60) return "Bonne";
  if (confidence >= 40) return "Modérée";
  if (confidence >= 20) return "Faible";
  return "Très faible";
}

export function getMaturiteColor(scenes: number): string {
  if (scenes >= 10) return "bg-amber-500";
  if (scenes >= 7) return "bg-purple-500";
  if (scenes >= 4) return "bg-emerald-500";
  if (scenes >= 2) return "bg-blue-400";
  return "bg-gray-300";
}

export function getMaturiteLabel(scenes: number): string {
  if (scenes >= 10) return "Or — Profil robuste";
  if (scenes >= 7) return "Violet — Profil solide";
  if (scenes >= 4) return "Vert — Profil qui se dessine";
  if (scenes >= 2) return "Bleu — Tendances émergentes";
  return "Gris — Première impression";
}
