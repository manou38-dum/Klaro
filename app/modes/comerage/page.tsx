import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { MessageCircle, ArrowLeft } from "lucide-react";

export default async function ComeragePage() {
  return (
    <div className="max-w-md mx-auto p-4">
      <Link href="/" className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 transition mb-6">
        <ArrowLeft className="w-4 h-4" />
        Retour
      </Link>

      <div className="bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl p-6 text-white mb-6">
        <div className="flex items-center gap-3 mb-3">
          <MessageCircle className="w-10 h-10" />
          <h1 className="text-3xl font-black">Comérage</h1>
        </div>
        <p className="text-sm opacity-90">
          Ton défouloir social intelligent. Décrypte les ragots, dynamiques de groupe et jeux de pouvoir.
        </p>
      </div>

      <Link
        href="/modes/comerage/new"
        className="block w-full py-4 bg-gradient-to-r from-pink-500 to-rose-600 text-white font-bold text-center rounded-xl hover:brightness-110 transition text-lg"
      >
        ☕ Raconte-moi tout →
      </Link>
    </div>
  );
}