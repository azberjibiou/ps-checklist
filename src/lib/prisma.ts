import { PrismaClient } from '@prisma/client';

//globalThis 타입을 확장하여 prisma 속성을 정의 (TypeScript 사용 시)
declare global {
  var prisma: PrismaClient | undefined;
}

const prisma = globalThis.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma;

export default prisma;