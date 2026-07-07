"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Send, Users } from "lucide-react";

interface TeamMember {
  card: {
    id: string;
    prenom: string;
    emoji: string;
  };
}

interface TeamAnalysis {
  id: string;
  scenario: string;
  result: any;
  createdAt: string;
}

interface Team {
  id: string;
  name: string;
  mode: string;
  members: TeamMember[];
  analyses: TeamAnalysis[];
}

export default function TeamPage({ params }: { params: { teamId: string } }) {
  const router = useRouter();
  const [team, setTeam] = useState<Team | null>(null);
  const [scenario, setScenario] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingTeam, setLoadingTeam] = useState(true);

   useEffect(() => {
    const teamId = typeof params.teamId === 'string' ? params.teamId : '';
    if (!teamId) return;
    
    fetch(`/api/teams/${teamId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Équipe non trouvée");
        return res.json();
      })
      .then((data) => {
        setTeam(data);
        setLoadingTeam(false);
      })
      .catch((err) => {
        console.error(err);
        setTeam(null);
        setLoadingTeam(false);
      });
  }, [params.teamId]);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!scenario.trim()) return;

    setIsLoading(true);

    try {
      const response = await fetch("/api/teams/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          teamId: typeof params.teamId === 'string' ? params.teamId : '',
          scenario: scenario.trim()
        })
      });

      if (!response.ok) throw new Error();

      const data = await response.json();
      
      sessionStorage.setItem("analysisResult", JSON.stringify(data.analysis));
      sessionStorage.setItem("selectedMode", team?.mode || "pro");
      router.push("/result");
    } catch {
      alert("Erreur lors de l'analyse de l'équipe");
    } finally {
      setIsLoading(false);
    }
  };

  if (loadingTeam) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-12 h-12 border-4 border-violet-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!team || !team.members) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate-600">Équipe introuvable</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4 pb-20">
      <Link href="/" className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 transition mb-4">
        <ArrowLeft className="w-4 h-4" />
        Retour
      </Link>

      <div className="bg-gradient-to-br from-indigo-500 to-blue-600 rounded-2xl p-6 text-white mb-6 shadow-lg">
        <div className="flex items-center gap-2 mb-2">
          <Users className="w-6 h-6" />
          <span className="text-xs font-bold uppercase tracking-wider opacity-80">Équipe</span>
        </div>
        <h1 className="text-3xl font-black mb-4">{team.name}</h1>
        
        <div className="flex gap-3 overflow-x-auto pb-2">
          {team.members.map((member) => (
            <div key={member.card.id} className="flex-shrink-0 bg-white/20 backdrop-blur-sm rounded-xl p-3 flex items-center gap-2">
              <div className="text-2xl">{member.card.emoji}</div>
              <div className="font-bold">{member.card.prenom}</div>
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={handleAnalyze} className="bg-white rounded-2xl p-5 border-2 border-slate-200 shadow-sm mb-6">
        <h2 className="text-lg font-black text-slate-900 mb-3 flex items-center gap-2">
          <Send className="w-5 h-5 text-indigo-600" />
          Analyser un scénario collectif
        </h2>
        <p className="text-sm text-slate-500 mb-4">
          Décrivez une situation impliquant toute l'équipe (réunion, conflit, projet commun...).
        </p>
        
        <textarea
          value={scenario}
          onChange={(e) => setScenario(e.target.value)}
          placeholder="Ex: Lors de la réunion de lundi, l'équipe devait valider le budget. Paul a imposé son point de vue..."
          rows={6}
          className="w-full rounded-xl border-2 border-slate-200 p-3 text-base focus:border-indigo-500 outline-none transition resize-none"
          required
        />

        <button
          type="submit"
          disabled={!scenario.trim() || isLoading}
          className="w-full mt-4 py-4 rounded-2xl bg-gradient-to-r from-indigo-500 to-blue-600 text-white font-bold text-lg shadow-lg hover:brightness-110 transition disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed"
        >
          {isLoading ? "Analyse en cours..." : "Lancer l'analyse d'équipe →"}
        </button>
      </form>

      {team.analyses.length > 0 && (
        <div>
          <h2 className="text-lg font-black text-slate-900 mb-3">Historique des analyses</h2>
          <div className="space-y-3">
            {team.analyses.map((analysis) => (
              <button
                key={analysis.id}
                onClick={() => {
                  sessionStorage.setItem("analysisResult", JSON.stringify(analysis.result));
                  sessionStorage.setItem("selectedMode", team.mode);
                  router.push("/result");
                }}
                className="w-full text-left bg-white rounded-xl p-4 border border-slate-200 hover:border-indigo-300 hover:shadow-md transition"
              >
                <p className="text-sm text-slate-700 line-clamp-2 font-medium">
                  {analysis.scenario}
                </p>
                <p className="text-xs text-slate-400 mt-2">
                  {new Date(analysis.createdAt).toLocaleDateString("fr-FR")}
                </p>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}