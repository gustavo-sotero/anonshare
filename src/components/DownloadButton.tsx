'use client';

import { Button } from '@/components/ui/button';
import { downloadFile } from '@/services/fileService';
import { Download, Loader2 } from 'lucide-react';
import { useState } from 'react';

interface DownloadButtonProps {
	fileId: string;
	fileName: string;
	oneTimeDownload: boolean;
}

export function DownloadButton({
	fileId,
	fileName,
	oneTimeDownload
}: DownloadButtonProps) {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');
	const [downloaded, setDownloaded] = useState(false);

	const handleDownload = async () => {
		setLoading(true);
		setError('');
		try {
			const { url } = await downloadFile(fileId);
			const fileResponse = await fetch(url);
			if (!fileResponse.ok) {
				throw new Error('Erro ao baixar o arquivo.');
			}
			const blob = await fileResponse.blob();
			const objectUrl = URL.createObjectURL(blob);

			const anchor = document.createElement('a');
			anchor.href = objectUrl;
			anchor.download = fileName;
			document.body.appendChild(anchor);
			anchor.click();

			URL.revokeObjectURL(objectUrl);
			document.body.removeChild(anchor);

			if (oneTimeDownload) {
				setDownloaded(true);
			}
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : String(err);
			setError(
				errorMessage ||
					'Erro ao baixar o arquivo. Por favor, tente novamente mais tarde.'
			);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="space-y-4">
			<Button
				onClick={handleDownload}
				disabled={loading || (oneTimeDownload && downloaded)}
				className="w-full"
			>
				{loading ? (
					<>
						<Loader2 className="mr-2 h-4 w-4 animate-spin" /> Iniciando
						download...
					</>
				) : (
					<>
						<Download className="mr-2 h-4 w-4" /> Baixar Arquivo
					</>
				)}
			</Button>
			{error && <p className="text-sm text-red-500 text-center">{error}</p>}
		</div>
	);
}
