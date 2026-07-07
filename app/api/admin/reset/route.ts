import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function POST() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Non connecté" }, { status: 401 });
    }

    await prisma.scene.deleteMany({
      where: { userId }
    });

    return NextResponse.json({ 
      message: "Compteur réinitialisé !",
      success: true 
    });
  } catch (error) {
    console.error("Erreur reset:", error);
    return NextResponse.json({ error: "Erreur" }, { status: 500 });
  }
}