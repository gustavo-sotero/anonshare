import { prisma } from '@/lib/prisma'; // Adjust the import as needed
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const data = await request.json();

    // Create the file record without the redundant key field
    const file = await prisma.file.create({
      data: {
        keyFile: data.keyFile,
        description: data.description || null,
        expirationDate: data.expirationDate
          ? new Date(data.expirationDate)
          : null,
        oneTimeDownload: data.oneTimeDownload || false,
        fileName: data.fileName,
        mimeType: data.mimeType,
        size: data.size
      }
    });

    return NextResponse.json(
      { link: `${process.env.BASE_URL}/download/${file.keyFile}` },
      { status: 201 }
    );
  } catch (error) {
    console.error('Erro ao processar upload:', error);
    return NextResponse.json(
      { error: 'Erro interno no servidor.' },
      { status: 500 }
    );
  }
}

// Optionally, implement GET or other endpoints here if required
