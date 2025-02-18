import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { keyFile: string } }
) {
  const { keyFile } = await params;

  const fileRecord = await prisma.file.findUnique({
    where: { keyFile },
    select: {
      fileName: true,
      keyFile: true,
      size: true,
      mimeType: true,
      description: true,
      expirationDate: true,
      oneTimeDownload: true
    }
  });

  if (!fileRecord) {
    return NextResponse.json({ error: 'File not found' }, { status: 404 });
  }

  return NextResponse.json(fileRecord);
}
