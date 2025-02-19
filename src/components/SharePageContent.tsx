import { generateDownloadLink, getFileInfo } from '@/services/fileService';
import type { FileInfo } from '@/types/file';
import { AnimatePresence, motion } from 'framer-motion';
import { redirect } from 'next/navigation';
import { useEffect, useState } from 'react';
import { UploadComplete } from './UploadComplete';

const fadeInOut = {
	initial: { opacity: 0 },
	animate: { opacity: 1 },
	exit: { opacity: 0 },
	transition: { duration: 0.3 },
};

interface SharePageContentProps {
	keyFile: string;
}

export function SharePageContent({ keyFile }: SharePageContentProps) {
	const [fileInfo, setFileInfo] = useState<FileInfo | null>(null);
	const [generatedLink, setGeneratedLink] = useState<string>('');

	useEffect(() => {
		const fetchFileInfo = async () => {
			try {
				const data = await getFileInfo(keyFile);
				setGeneratedLink(generateDownloadLink(keyFile));
				setFileInfo(data);
			} catch (err) {
				console.error('Erro ao buscar informações do arquivo:', err);
			}
		};
		fetchFileInfo();
	}, [keyFile]);

	function handleNewUpload() {
		redirect('/');
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
