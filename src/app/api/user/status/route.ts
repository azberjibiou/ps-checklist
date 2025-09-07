import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// 특정 카테고리 내 문제와 사용자의 풀이 현황 조회 (GET)
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const categoryId = Number(searchParams.get('categoryId'));
  const userId = searchParams.get('userId');

  if(!categoryId || !userId) {
    return NextResponse.json({ error: 'categoryId와 userId가 필요합니다.' }, { status: 400 });
  }

  const category = await prisma.category.findUnique({ where: { id: categoryId } });
  if (!category) {
    return NextResponse.json({ error: '존재하지 않는 categoryId입니다.' }, { status: 404 });
  }
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    return NextResponse.json({ error: '존재하지 않는 userId입니다.' }, { status: 404 });
  }

  // 문제 목록
  const problems = await prisma.problem.findMany({
    where: { categoryId },
    include: {
      statuses: {
        where: { userId },
        select: { status: true }
      }
    }
  }) as Array<{
    id: number;
    title: string;
    link?: string;
    editorialLink?: string;
    categoryId: number;
    contestId: number;
    statuses: Array<{ status: string }>;
  }>;

  // 각 문제에 대해 status가 있으면 포함
  const result = problems.map(p => ({
    id: p.id,
    userStatus: p.statuses[0]?.status ?? null
  }));

  return NextResponse.json(result);
}

// 특정 카테고리에 대한 사용자의 풀이 현황 생성/수정 (POST)
export async function POST(request: Request) {
  const body = await request.json() as {
    categoryId: number;
    userId: string;
    statuses: Array<{ problemId: number; status: string }>;
  };
  // body: { categoryId: number, userId: string, statuses: Array<{ problemId: number, status: string }> }
  if (!body.categoryId || !body.userId || !Array.isArray(body.statuses)) {
    return NextResponse.json({ error: 'categoryId, userId, statuses가 필요합니다.' }, { status: 400 });
  }

  // 실제 DB에 존재하는지 확인
  const category = await prisma.category.findUnique({ where: { id: body.categoryId } });
  if (!category) {
    return NextResponse.json({ error: '존재하지 않는 categoryId입니다.' }, { status: 404 });
  }
  const user = await prisma.user.findUnique({ where: { id: body.userId } });
  if (!user) {
    return NextResponse.json({ error: '존재하지 않는 userId입니다.' }, { status: 404 });
  }
  // 1. 기존 기록 삭제
  await prisma.userProblemStatus.deleteMany({
    where: {
      userId: body.userId,
      problem: { categoryId: body.categoryId }
    }
  });

  // 2. 새로운 기록 업로드
  const created = await prisma.userProblemStatus.createMany({
    data: body.statuses.map(s => ({
      userId: body.userId,
      problemId: s.problemId,
      status: s.status
    }))
  });

  return NextResponse.json({ success: true, count: created.count });
}