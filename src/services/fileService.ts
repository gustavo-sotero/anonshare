import type { FileInfo, PresignedData } from '@/types/file';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export async function getFileInfo(keyFile: string): Promise<FileInfo> {
	const response = await fetch(`/api/file/${keyFile}`);
	if (!response.ok) {
		const message = await response.json();
		throw new Error(message.error);
	}
	return response.json();
}

export async function getPresignedUrl(
	keyFile: string,
	contentType: string,
): Promise<PresignedData> {
	const response = await fetch('/api/upload/presign', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ keyFile, contentType }),
	});
	if (!response.ok) throw new Error('Failed to get presigned data');
	return response.json();
}

export async function uploadFile(
	file: File,
	presignedUrl: string,
): Promise<void> {
	return new Promise((resolve, reject) => {
		const xhr = new XMLHttpRequest();
		xhr.onload = () =>
			xhr.status === 200 ? resolve() : reject(new Error('File upload failed'));
		xhr.onerror = () => reject(new Error('File upload error'));
		xhr.open('PUT', presignedUrl);
		xhr.send(file);
		return xhr;
	});
}

export async function notifyUploadComplete(data: {
	fileName: string;
	keyFile: string;
	description: string | null;
	expirationDate: string | null;
	oneTimeDownload: boolean;
	mimeType: string;
	size: number;
}): Promise<{ link: string }> {
	const response = await fetch('/api/upload', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(data),
	});
	if (!response.ok) throw new Error('Failed to notify upload');
	return response.json();
}

export async function downloadFile(fileId: string): Promise<{ url: string }> {
	const response = await fetch(`/api/download/${fileId}`);
	if (!response.ok) {
		const message = await response.json();
		throw new Error(message.error);
	}
	return response.json();
}

export function generateDownloadLink(keyFile: string): string {
	return `${BASE_URL}/d/${keyFile}`;
}

export async function reportFile(
	fileKey: string,
	reason: string,
	description?: string,
) {
	const response = await fetch('/api/report', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			fileKey,
			reason,
			description,
		}),
	});

	if (!response.ok) {
		const error = await response.json();
		throw new Error(error.error || 'Erro ao enviar relatório');
	}

	return response.json();
}
