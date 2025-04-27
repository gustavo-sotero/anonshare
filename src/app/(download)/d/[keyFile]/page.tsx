'use client';

import { DownloadButton } from '@/components/DownloadButton';
import { FileInfo as FileInfoComponent } from '@/components/FileInfo';
import { ReportDialog } from '@/components/ReportDialog';
import { ViewMediaButton } from '@/components/ViewMediaButton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { isMediaFile } from '@/lib/utils';
import { getFileInfo } from '@/services/fileService';
import type { FileInfo } from '@/types/file';
import { motion } from 'framer-motion';
import { AlertTriangle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function DownloadPage() {
	const params = useParams();
	const [fileInfo, setFileInfo] = useState<FileInfo | null>(null);
	const [isExpired, setIsExpired] = useState(false);
	const [isOnceDownloaded, setIsOnceDownloaded] = useState(false);
	const [isDisabled, setIsDisabled] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchFileInfo = async () => {
			try {
				const data = await getFileInfo(params.keyFile as string);
				setFileInfo(data);

				if (data.expirationDate && new Date(data.expirationDate) < new Date()) {
					setIsExpired(true);
				}

				if (data.isOnceDownloaded) {
					setIsOnceDownloaded(true);
				}

				if (data.isDisabled) {
					setIsDisabled(true);
				}
			} catch (err) {
				const errorMessage = err instanceof Error ? err.message : String(err);
				setError(
					errorMessage ||
						'Erro ao carregar informações do arquivo. Por favor, tente novamente mais tarde.'
				);
			}
		};

		fetchFileInfo();
	}, [params.keyFile]);

	if (error) {
		return (
			<div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
				<div className="w-full max-w-md">
					<Alert
						variant="destructive"
						className="border-red-500 bg-red-950/50 text-red-400"
					>
						<AlertTriangle className="h-4 w-4 text-red-400" />
						<AlertTitle className="text-red-400">Erro</AlertTitle>
						<AlertDescription className="text-red-400">
							{error}
						</AlertDescription>
					</Alert>
					<div className="mt-4 text-center">
						<Link
							href="/"
							className="text-blue-400 hover:underline inline-flex items-center"
						>
							<ArrowLeft className="mr-2 h-4 w-4" />
							Voltar para a página inicial
						</Link>
					</div>
				</div>
			</div>
		);
	}

	if (isExpired || isOnceDownloaded || isDisabled) {
		return (
			<div className="min-h-screen bg-black text-white flex items-center justify-center">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
					className="w-full max-w-md space-y-4"
				>
					<Alert
						variant="destructive"
						className="border-red-500 bg-red-950/50 text-red-400"
					>
						<AlertTriangle className="h-4 w-4 text-red-400" />
						<AlertTitle className="text-red-400">Link Indisponível</AlertTitle>
						<AlertDescription className="text-red-400">
							{isDisabled
								? fileInfo?.disabledReason || 'Este link foi desabilitado.'
								: 'Este link de download não está mais disponível.'}
						</AlertDescription>
					</Alert>
					<div className="text-center">
						<Link
							href="/"
							className="text-blue-400 hover:underline inline-flex items-center"
						>
							<ArrowLeft className="mr-2 h-4 w-4" />
							Voltar para a página inicial
						</Link>
					</div>
				</motion.div>
			</div>
		);
	}

	if (!fileInfo) {
		return (
			<div className="min-h-screen bg-black text-white flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-white mx-auto" />
					<p className="mt-4">Carregando informações do arquivo...</p>
				</div>
			</div>
		);
	}

	// Verificar se é um arquivo de mídia elegível para visualização
	const isViewableMedia =
		isMediaFile(fileInfo.fileName) &&
		!fileInfo.expirationDate &&
		!fileInfo.oneTimeDownload;

	return (
		<div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				className="w-full max-w-md space-y-6"
			>
				<div className="text-center">
					<h1 className="text-3xl font-bold mb-2">AnonShare</h1>
					<p className="text-zinc-400">Download seguro e anônimo</p>
				</div>

				<div className="bg-black border border-zinc-800 p-6 rounded-lg space-y-4">
					<FileInfoComponent
						name={fileInfo.fileName}
						size={fileInfo.size}
						expirationTime={fileInfo.expirationDate}
						oneTimeDownload={fileInfo.oneTimeDownload}
						description={fileInfo.description}
					/>
					<DownloadButton
						fileId={params.keyFile as string}
						fileName={fileInfo.fileName}
						oneTimeDownload={fileInfo.oneTimeDownload}
					/>

					{isViewableMedia && (
						<div className="mt-2">
							<ViewMediaButton
								fileId={params.keyFile as string}
								fileName={fileInfo.fileName}
							/>
						</div>
					)}

					<ReportDialog fileKey={params.keyFile as string} />
				</div>

				<div className="text-center">
					<Link
						href="/"
						className="text-blue-400 hover:underline inline-flex items-center"
					>
						<ArrowLeft className="mr-2 h-4 w-4" />
						Voltar para a página inicial
					</Link>
				</div>
			</motion.div>
		</div>
	);
}
