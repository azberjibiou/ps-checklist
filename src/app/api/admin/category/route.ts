import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// 카테고리 목록 조회 (GET)
export async function GET() {
  const categories = await prisma.category.findMany({
    include: { children: true, contests: true},
  });
  return NextResponse.json(categories);
}

// 카테고리 생성 (POST)
export async function POST(request: Request) {
  const body = await request.json();
  // body: { name: string, parentId?: number }
  if(body.parentId) {
    const parentCategory = await prisma.category.findUnique({ where: { id: body.parentId } });
    if (!parentCategory) {
      return NextResponse.json({ error: '존재하지 않는 parentId입니다.' }, { status: 400 });
    }
  }
  try {
    const category = await prisma.category.create({
      data: {
        name: body.name,
        parentId: body.parentId,
      },
    });
    return NextResponse.json(category);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// 카테고리 수정 (PATCH)
export async function PATCH(request: Request) {
  const body = await request.json();
  // body: { id: number, name?: string, parentId?: number }
  const existingCategory = await prisma.category.findUnique({ where: { id: body.id } });
  if (!existingCategory) {
    return NextResponse.json({ error: '카테고리가 존재하지 않습니다.' }, { status: 400 });
  }
  const existingParentCategory = body.parentId ? await prisma.category.findUnique({ where: { id: body.parentId } }) : null;
  if (body.parentId && !existingParentCategory) {
    return NextResponse.json({ error: '존재하지 않는 parentId입니다.' }, { status: 400 });
  }
  try {
    const category = await prisma.category.update({
      where: { id: body.id },
      data: {
        name: body.name ?? existingCategory.name,
        parentId: body.parentId !== undefined ? body.parentId : existingCategory.parentId,
      },
    });
    return NextResponse.json(category);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// 카테고리 삭제 (DELETE)
export async function DELETE(request: Request) {
  const body = await request.json();
  // body: { id: number }
  const existingCategory = await prisma.category.findUnique({ where: { id: body.id } });
  if (!existingCategory) { 
    return NextResponse.json({ error: '카테고리가 존재하지 않습니다.' }, { status: 400 });
  }
  try {
    await prisma.category.delete({
      where: { id: body.id },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}