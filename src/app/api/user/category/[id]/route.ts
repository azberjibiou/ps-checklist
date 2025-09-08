import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = parseInt((await params).id, 10);
    //const id = parseInt(params.id, 10);

    // id가 유효한 숫자인지 확인합니다.
    if (isNaN(id)) {
      return NextResponse.json({ error: 'ID가 정수가 아닙니다.' }, { status: 400 });
    }


    // 현재 카테고리 정보
    const category = await prisma.category.findUnique({ where: { id: id } });
    if (!category) {
      return NextResponse.json({ error: '존재하지 않는 categoryId입니다.' }, { status: 404 });
    }

    // root까지의 경로 구하기 (부모 chain)
    let path: { id: number; name: string }[] = [];
    let cur = category;
    while (cur) {
      path.unshift({ id: cur.id, name: cur.name });
      if (!cur.parentId) break;
      cur = await prisma.category.findUnique({ where: { id: cur.parentId } });
      if (!cur) break;
    }

    // 자식 카테고리 조회
    const children = await prisma.category.findMany({ where: { parentId: id } });
    if (children.length > 0) {
      return NextResponse.json({
        type: 'category',
        id: category.id,
        name: category.name,
        path,
        children
      });
    }

    // 자식이 없으면 대회와 문제 반환
    const contests = await prisma.contest.findMany({
      where: { categoryId: id },
      include: { problems: true },
    });
    return NextResponse.json({ type: 'contest', 
      id: category.id,
      name: category.name,
      path,
      contests });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}