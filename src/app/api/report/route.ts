import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const reportSchema = z.object({
	fileKey: z.string(),
	reason: z.enum(['copyright', 'illegal', 'inappropriate', 'other']),
	description: z.string().optional(),
});

export async function POST(request: Request) {
	try {
		const body = await request.json();
		const { fileKey, reason, description } = reportSchema.parse(body);
		const fileRecord = await prisma.file.findUnique({
			where: { keyFile: fileKey },
		});

		if (!fileRecord) {
			return NextResponse.json(
				{ error: 'Arquivo não encontrado' },
				{ status: 404 },
			);
		}

		const report = await prisma.report.create({
			data: {
				fileId: fileRecord.id,
				reason,
				description,
			},
		});

		return NextResponse.json(report);
	} catch (error) {
		if (error instanceof z.ZodError) {
			return NextResponse.json({ error: 'Dados inválidos' }, { status: 400 });
		}

		console.error('Erro ao criar relatório:', error);
		return NextResponse.json(
			{ error: 'Erro interno do servidor' },
			{ status: 500 },
		);
	}
}
