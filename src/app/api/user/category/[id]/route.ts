import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id, 10);

    // id가 유효한 숫자인지 확인합니다.
    if (isNaN(id)) {
      return NextResponse.json({ error: 'ID가 정수가 아닙니다.' }, { status: 400 });
    }

    const category = await prisma.category.findUnique({ where: { id: id } });
    if (!category) {
      return NextResponse.json({ error: '존재하지 않는 categoryId입니다.' }, { status: 404 });
    }
    // 자식 카테고리 조회
    const children = await prisma.category.findMany({ where: { parentId: id } });
    if (children.length > 0) {
      return NextResponse.json({ type: 'category', children });
    }

    // 자식이 없으면 대회와 문제 반환
    const contests = await prisma.contest.findMany({
      where: { categoryId: id },
      include: { problems: true },
    });
    return NextResponse.json({ type: 'contest', contests });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}