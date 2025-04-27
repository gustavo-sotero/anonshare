import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

/**
 * Verifica se o arquivo é uma imagem ou vídeo baseado na extensão do nome
 */
export function isMediaFile(fileName: string): boolean {
	const extension = fileName.split('.').pop()?.toLowerCase() || '';

	const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg'];
	const videoExtensions = ['mp4', 'webm', 'ogg', 'mov', 'avi', 'mkv'];

	return [...imageExtensions, ...videoExtensions].includes(extension);
}
