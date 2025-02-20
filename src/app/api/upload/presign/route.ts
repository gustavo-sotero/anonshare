import { s3Client } from '@/lib/s3Client';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { NextResponse } from 'next/server';

const MB_MAX_FILE_SIZE = process.env.MB_MAX_FILE_SIZE
	? Number.parseInt(process.env.MB_MAX_FILE_SIZE)
	: 50; // 50MB
const MAX_FILE_SIZE = MB_MAX_FILE_SIZE * 1024 * 1024; // 50MB

export async function POST(request: Request) {
	try {
		const { keyFile, contentType } = await request.json();

		if (!keyFile || !contentType) {
			return NextResponse.json(
				{ error: 'Os campos "keyFile" e "contentType" são obrigatórios.' },
				{ status: 400 }
			);
		}

		const command = new PutObjectCommand({
			Bucket: process.env.R2_BUCKET,
			Key: keyFile,
			ContentType: contentType,
			ContentLength: MAX_FILE_SIZE
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
