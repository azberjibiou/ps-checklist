import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      where: { parentId: null },
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    });
    return NextResponse.json(categories);
  } catch (e: any) {
    return NextResponse.json({ 
      error: "Failed to fetch root categories", 
      message: e?.message,
      stack: e?.stack,
      prismaError: JSON.stringify(e)
    }, { status: 500 });
  }
}
