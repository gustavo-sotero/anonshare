import { generateDownloadLink, getFileInfo } from '@/services/fileService';
import type { FileInfo } from '@/types/file';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { useEffect, useState } from 'react';
import { UploadComplete } from './UploadComplete';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';

const fadeInOut = {
	initial: { opacity: 0 },
	animate: { opacity: 1 },
	exit: { opacity: 0 },
	transition: { duration: 0.3 }
};

interface SharePageContentProps {
	keyFile: string;
}

export function SharePageContent({ keyFile }: SharePageContentProps) {
	const [fileInfo, setFileInfo] = useState<FileInfo | null>(null);
	const [generatedLink, setGeneratedLink] = useState<string>('');
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchFileInfo = async () => {
			try {
				const data = await getFileInfo(keyFile);
				setGeneratedLink(generateDownloadLink(keyFile));
				setFileInfo(data);
			} catch (err) {
				const errorMessage = err instanceof Error ? err.message : String(err);
				setError(
					errorMessage ||
						'Erro ao carregar informações do arquivo. Por favor, tente novamente mais tarde.'
				);
			}
		};
		fetchFileInfo();
	}, [keyFile]);

	function handleNewUpload() {
		redirect('/');
	}

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

	return (
		<div className="w-full max-w-xl mx-auto space-y-6">
			<div className="text-center space-y-2">
				<h1 className="text-3xl font-semibold">AnonShare</h1>
				<p className="text-gray-400">
					Compartilhamento anônimo de arquivos. Faça upload, compartilhe e
					acompanhe seus arquivos.
				</p>
			</div>

			<div className="bg-black border border-zinc-800 p-6 rounded-lg space-y-6">
				<AnimatePresence mode="wait">
					{fileInfo && (
						<motion.div key="complete" {...fadeInOut}>
							<UploadComplete
								generatedLink={generatedLink}
								onNewUpload={handleNewUpload}
								fileInfo={fileInfo}
							/>
						</motion.div>
					)}
				</AnimatePresence>
			</div>
		</div>
	);
}
