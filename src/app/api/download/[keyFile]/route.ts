import { prisma } from '@/lib/prisma';
import { s3Client } from '@/lib/s3Client';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { NextResponse } from 'next/server';

export async function GET(
	request: Request,
	{ params }: { params: Promise<{ keyFile: string }> },
) {
	const { keyFile } = await params;

	// Validate file metadata from the database
	const fileRecord = await prisma.file.findUnique({ where: { keyFile } });
	if (!fileRecord)
		return NextResponse.json(
			{ error: 'Arquivo não encontrado' },
			{ status: 404 },
		);
	if (fileRecord.isDisabled)
		return NextResponse.json(
			{
				error:
					fileRecord.disabledReason ||
					'O download desse arquivo foi desabilitado.',
			},
			{ status: 403 },
		);

	if (
		fileRecord.expirationDate &&
		new Date(fileRecord.expirationDate) < new Date()
	) {
		return NextResponse.json({ error: 'Arquivo expirado.' }, { status: 410 });
	}
	if (fileRecord.oneTimeDownload) {
		const downloadCount = await prisma.download.count({
			where: { fileId: fileRecord.id },
		});
		if (downloadCount > 0)
			return NextResponse.json(
				{ error: 'Arquivo só pode ser baixado uma vez' },
				{ status: 403 },
			);
	}

	// Setup command with bucket and key
	const command = new GetObjectCommand({
		Bucket: process.env.R2_BUCKET,
		Key: fileRecord.keyFile,
	});

	try {
		// Generate a presigned URL for the client to download directly
		const signedUrl = await getSignedUrl(s3Client, command, {
			expiresIn: 3600,
		});

		// Log the download asynchronously, without blocking response
		const ip = request.headers.get('x-forwarded-for') || '';
		const userAgent = request.headers.get('user-agent') || '';

		await prisma.download.create({
			data: { fileId: fileRecord.id, ip, userAgent },
		});

		return new NextResponse(JSON.stringify({ url: signedUrl }), {
			status: 200,
			headers: {
				'Content-Type': 'application/json',
			},
		});
	} catch (err) {
		console.log(err);
		return NextResponse.json(
			{ error: 'Arquivo não encontrado' },
			{ status: 404 },
		);
	}
}
