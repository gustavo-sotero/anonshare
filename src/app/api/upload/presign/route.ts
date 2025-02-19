import { s3Client } from '@/lib/s3Client';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
	try {
		const { keyFile, contentType } = await request.json();

		if (!keyFile || !contentType) {
			return NextResponse.json(
				{ error: 'Os campos "fileId" e "contentType" são obrigatórios.' },
				{ status: 400 }
			);
		}

		const command = new PutObjectCommand({
			Bucket: process.env.R2_BUCKET,
			Key: keyFile,
			ContentType: contentType
		});

		const presignedUrl = await getSignedUrl(s3Client, command, {
			expiresIn: 3600
		});

		return NextResponse.json({ presignedUrl, keyFile }, { status: 200 });
	} catch (error) {
		console.error('Erro ao gerar URL pré-assinada:', error);
		return NextResponse.json(
			{ error: 'Erro interno no servidor.' },
			{ status: 500 }
		);
	}
}
