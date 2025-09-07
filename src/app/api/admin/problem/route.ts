import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// 문제 목록 조회 (GET)
export async function GET() {
  const problems = await prisma.problem.findMany({
    include: { contest: true },
  });
  return NextResponse.json(problems);
}

// 문제 생성 (POST)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    // body: { title: string, link?: string, editorialLink?: string, contestId: number, order?: number }
    const contest = await prisma.contest.findUnique({ where: { id: body.contestId } });
    if (!contest) {
      return NextResponse.json({ error: 'contestId가 유효하지 않습니다.' }, { status: 400 });
    }

    let order = body.order;
    if (order === undefined) {
      const lastProblem = await prisma.problem.findFirst({
        where: { contestId: body.contestId },
        orderBy: { order: 'desc' },
      });
      order = lastProblem ? (lastProblem.order ?? 0) + 1 : 1;
    }
    const problem = await prisma.problem.create({
      data: {
        title: body.title,
        link: body.link,
        editorialLink: body.editorialLink,
        contestId: body.contestId,
        order: order,
      },
    });
    return NextResponse.json(problem);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// 문제 수정 (PATCH)
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    // body: { id: number, title?: string, link?: string, editorialLink?: string, contestId?: number, order?: number }
    const existingProblem = await prisma.problem.findUnique({ where: { id: body.id } });
    if (!existingProblem) {
      return NextResponse.json({ error: '문제가 존재하지 않습니다.' }, { status: 404 });
    }
    const contest = (body.contestId !== undefined) ? 
      await prisma.contest.findUnique({ where: { id: body.contestId } }) : 
      await prisma.contest.findUnique({ where: { id: existingProblem.contestId } });
    if(!contest) {
      return NextResponse.json({ error: 'contestId가 유효하지 않습니다.' }, { status: 400 });
    }
    
    if (body.order !== undefined) {
      const duplicate = await prisma.problem.findFirst({
        where: {
          contestId: body.contestId ?? existingProblem.contestId,
          order: body.order,
          NOT: { id: body.id }
        }
      });
      if (duplicate) {
        return NextResponse.json({ error: '해당 contest에 이미 같은 order가 존재합니다.' }, { status: 409 });
      }
    }
    const problem = await prisma.problem.update({
      where: { id: body.id },
      data: {
        title: body.title ?? existingProblem.title,
        link: body.link !== undefined ? body.link : existingProblem.link,
        editorialLink: body.editorialLink !== undefined ? body.editorialLink : existingProblem.editorialLink,
        contestId: body.contestId ?? existingProblem.contestId,
        order: body.order ?? existingProblem.order,
      },
    });
    return NextResponse.json(problem);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// 문제 삭제 (DELETE)
export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    // body: { id: number }
    await prisma.problem.delete({
      where: { id: body.id },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}