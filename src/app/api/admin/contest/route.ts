import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// 대회 목록 조회 (GET)
export async function GET() {
  const contests = await prisma.contest.findMany({
    include: { category: true, problems: true },
  });
  return NextResponse.json(contests);
}

// 대회 생성 (POST)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    // body: { name: string, date: string, categoryId: number }
    const contest = await prisma.contest.create({
      data: {
        name: body.name,
        date: new Date(body.date),
        categoryId: body.categoryId,
      },
    });
    return NextResponse.json(contest);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// 대회 수정 (PATCH)
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    // body: { id: number, name?: string, date?: string, categoryId?: number }
    const existingContest = await prisma.contest.findUnique({ where: { id: body.id } });
    if (!existingContest) {
      return NextResponse.json({ error: '대회가 존재하지 않습니다.' }, { status: 400 });
    }
    const contest = await prisma.contest.update({
      where: { id: body.id },
      data: {
        name: body.name ?? existingContest.name,
        date: body.date ? new Date(body.date) : existingContest.date,
        categoryId: body.categoryId ?? existingContest.categoryId,
      },
    });
    return NextResponse.json(contest);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// 대회 삭제 (DELETE)
export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    // body: { id: number }
    const existingContest = await prisma.contest.findUnique({ where: { id: body.id } });
    if (!existingContest) {
      return NextResponse.json({ error: '대회가 존재하지 않습니다.' }, { status: 400 });
    }
    await prisma.contest.delete({
      where: { id: body.id },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}