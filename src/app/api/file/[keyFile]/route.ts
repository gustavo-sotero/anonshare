import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(
	request: Request,
	{ params }: { params: Promise<{ keyFile: string }> }
) {
	const { keyFile } = await params;

	const fileRecord = await prisma.file.findUnique({
		where: { keyFile },
		select: {
			id: true,
			fileName: true,
			keyFile: true,
			size: true,
			mimeType: true,
			description: true,
			isDisabled: true,
			disabledReason: true,
			expirationDate: true,
			oneTimeDownload: true
		}
	});

	if (!fileRecord) {
		return NextResponse.json({ message: 'File not found' }, { status: 404 });
	}

	const downloadCount = await prisma.download.count({
		where: { fileId: fileRecord.id }
	});

	return NextResponse.json({
		fileName: fileRecord.fileName,
		keyFile: fileRecord.keyFile,
		size: fileRecord.size,
		mimeType: fileRecord.mimeType,
		description: fileRecord.description,
		isDisabled: fileRecord.isDisabled,
		disabledReason: fileRecord.disabledReason,
		expirationDate: fileRecord.expirationDate,
		oneTimeDownload: fileRecord.oneTimeDownload,
		isOnceDownloaded: downloadCount > 0
	});
}
