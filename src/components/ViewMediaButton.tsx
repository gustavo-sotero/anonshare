'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { downloadFile } from '@/services/fileService';
import { Eye, Loader2 } from 'lucide-react';
import { useState } from 'react';

interface ViewMediaButtonProps {
	fileId: string;
	fileName: string;
}

export function ViewMediaButton({ fileId, fileName }: ViewMediaButtonProps) {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');
	const [mediaUrl, setMediaUrl] = useState<string | null>(null);
	const [isOpen, setIsOpen] = useState(false);

	const handleView = async () => {
		if (mediaUrl) {
			setIsOpen(true);
			return;
		}

		setLoading(true);
		setError('');
		try {
			const { url } = await downloadFile(fileId);
			setMediaUrl(url);
			setIsOpen(true);
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : String(err);
			setError(
				errorMessage ||
					'Erro ao carregar mídia. Por favor, tente novamente mais tarde.'
			);
		} finally {
			setLoading(false);
		}
	};

	const isVideo = fileName.match(/\.(mp4|webm|ogg|mov|avi|mkv)$/i);
	const isImage = fileName.match(/\.(jpg|jpeg|png|gif|webp|svg|avif)$/i);

	return (
		<>
			<Button
				onClick={handleView}
				disabled={loading}
				variant="outline"
				className="w-full"
			>
				{loading ? (
					<>
						<Loader2 className="mr-2 h-4 w-4 animate-spin" /> Carregando...
					</>
				) : (
					<>
						<Eye className="mr-2 h-4 w-4" /> Visualizar Arquivo
					</>
				)}
			</Button>
			{error && <p className="text-sm text-red-500 text-center">{error}</p>}

			<Dialog open={isOpen} onOpenChange={setIsOpen}>
				<DialogContent className="sm:max-w-3xl max-h-screen overflow-auto">
					<DialogTitle className="text-center pb-2 border-b border-zinc-800">
						{fileName}
					</DialogTitle>
					<div className="flex items-center justify-center">
						{mediaUrl && isVideo ? (
							<video
								controls
								className="max-w-full max-h-[70vh]"
								src={mediaUrl}
							>
								<track kind="captions" label="Português" default />
								Seu navegador não suporta a exibição deste vídeo.
							</video>
						) : mediaUrl && isImage ? (
							<div className="max-w-full max-h-[70vh] flex items-center justify-center">
								<img
									src={mediaUrl}
									alt={fileName}
									className="object-contain max-w-full max-h-[70vh]"
								/>
							</div>
						) : mediaUrl ? (
							<p>Este tipo de arquivo não pode ser visualizado diretamente.</p>
						) : (
							<p>Carregando mídia...</p>
						)}
					</div>
				</DialogContent>
			</Dialog>
		</>
	);
}
