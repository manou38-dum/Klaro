"use client";

import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { Check, X, ArrowLeft } from "lucide-react";

export default function PricingPage() {
  const { user } = useUser();

  return (
    <div className="max-w-2xl mx-auto p-4 pb-20">
      <Link href="/" className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 transition mb-4">
        <ArrowLeft className="w-4 h-4" />
        Retour
      </Link>

      <div className="text-center mb-8">
        <h1 className="text-3xl font-black text-slate-900 mb-2">
          Choisissez votre formule
        </h1>
        <p className="text-slate-500">
          Commencez gratuitement, passez à Premium quand vous voulez
        </p>
      </div>

      {/* Plan Gratuit */}
      <div className="bg-white rounded-2xl p-6 border-2 border-slate-200 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-black text-slate-900">🆓 Gratuit</h2>
          <div className="text-3xl font-black text-slate-900">0€</div>
        </div>
        <p className="text-sm text-slate-600 mb-4">Pour découvrir Klaro</p>
        
        <ul className="space-y-3 mb-6">
          <li className="flex items-start gap-3 text-sm">
            <Check className="w-5 h-5 text-emerald-500 flex-shrink-0" />
            <span>3 analyses par mois</span>
          </li>
          <li className="flex items-start gap-3 text-sm">
            <Check className="w-5 h-5 text-emerald-500 flex-shrink-0" />
            <span>1 personne suivie</span>
          </li>
          <li className="flex items-start gap-3 text-sm">
            <Check className="w-5 h-5 text-emerald-500 flex-shrink-0" />
            <span>Analyse basique (Big Five)</span>
          </li>
          <li className="flex items-start gap-3 text-sm">
            <X className="w-5 h-5 text-slate-300 flex-shrink-0" />
            <span className="text-slate-400">Mode Équipe</span>
          </li>
          <li className="flex items-start gap-3 text-sm">
            <X className="w-5 h-5 text-slate-300 flex-shrink-0" />
            <span className="text-slate-400">Comparaison de profils</span>
          </li>
        </ul>

        <button
          disabled
          className="w-full py-3 rounded-xl bg-slate-100 text-slate-400 font-bold cursor-not-allowed"
        >
          Formule actuelle
        </button>
      </div>

      {/* Plan Premium */}
      <div className="bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl p-6 text-white shadow-xl mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-black">💎 Premium</h2>
          <div className="text-3xl font-black">9,99€<span className="text-lg font-semibold opacity-80">/mois</span></div>
        </div>
        <p className="text-sm opacity-90 mb-4">Pour les utilisateurs intensifs</p>
        
        <ul className="space-y-3 mb-6">
          <li className="flex items-start gap-3 text-sm">
            <Check className="w-5 h-5 text-emerald-300 flex-shrink-0" />
            <span>Analyses <strong>illimitées</strong></span>
          </li>
          <li className="flex items-start gap-3 text-sm">
            <Check className="w-5 h-5 text-emerald-300 flex-shrink-0" />
            <span>Personnes illimitées</span>
          </li>
          <li className="flex items-start gap-3 text-sm">
            <Check className="w-5 h-5 text-emerald-300 flex-shrink-0" />
            <span>Tous les degrés d'analyse (jusqu'à 💀 Hardcore)</span>
          </li>
          <li className="flex items-start gap-3 text-sm">
            <Check className="w-5 h-5 text-emerald-300 flex-shrink-0" />
            <span>Mode Équipe 👥</span>
          </li>
          <li className="flex items-start gap-3 text-sm">
            <Check className="w-5 h-5 text-emerald-300 flex-shrink-0" />
            <span>Comparaison de profils 🔄</span>
          </li>
          <li className="flex items-start gap-3 text-sm">
            <Check className="w-5 h-5 text-emerald-300 flex-shrink-0" />
            <span>Export image HD sans watermark</span>
          </li>
          <li className="flex items-start gap-3 text-sm">
            <Check className="w-5 h-5 text-emerald-300 flex-shrink-0" />
            <span>Statistiques avancées 📊</span>
          </li>
          <li className="flex items-start gap-3 text-sm">
            <Check className="w-5 h-5 text-emerald-300 flex-shrink-0" />
            <span>Support prioritaire</span>
          </li>
        </ul>

        <button
          className="w-full py-3 rounded-xl bg-white text-violet-600 font-bold hover:bg-slate-100 transition shadow-lg"
          onClick={() => alert("Intégration Stripe à venir ! Pour l'instant, contactez-nous à contact@klaro.app")}
        >
          Souscrire à Premium
        </button>
        
        <p className="text-xs text-center mt-3 opacity-80">
          Annulable à tout moment • Paiement sécurisé
        </p>
      </div>

      {/* FAQ */}
      <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
        <h3 className="font-bold text-slate-900 mb-4">Questions fréquentes</h3>
        
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-slate-900 text-sm mb-1">
              Puis-je changer de formule à tout moment ?
            </h4>
            <p className="text-sm text-slate-600">
              Oui ! Vous pouvez passer de Gratuit à Premium (et inversement) quand vous voulez.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold text-slate-900 text-sm mb-1">
              Comment sont comptées les analyses ?
            </h4>
            <p className="text-sm text-slate-600">
              Le compteur se remet à zéro chaque mois. Une analyse = une scène décrite et analysée.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold text-slate-900 text-sm mb-1">
              Mes données sont-elles sécurisées ?
            </h4>
            <p className="text-sm text-slate-600">
              Absolument. Vos analyses sont chiffrées et ne sont jamais partagées. Utilisez des surnoms pour rester anonyme.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}