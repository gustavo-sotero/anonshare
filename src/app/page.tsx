'use client';

import { FileUploadForm } from '@/components/FileUploadForm';
import { Footer } from '@/components/Footer';
import { UploadComplete } from '@/components/UploadComplete';
import { UploadProgress } from '@/components/UploadProgress';
import { useFileUpload } from '@/hooks/useFileUpload';
import type { UploadFormData } from '@/types/file';
import { AnimatePresence, motion } from 'framer-motion';

const fadeInOut = {
	initial: { opacity: 0 },
	animate: { opacity: 1 },
	exit: { opacity: 0 },
	transition: { duration: 0.3 }
};

export default function Home() {
	const { state, progress, generatedLink, fileInfo, handleUpload, reset } =
		useFileUpload();

	const onSubmitUpload = async (formData: UploadFormData) => {
		const keyFile = await handleUpload(formData);
		if (keyFile) {
			window.history.pushState(null, '', `/s/${keyFile}`);
		}
	};

	return (
		<div className="min-h-screen bg-black text-white flex flex-col">
			<main className="flex-grow flex flex-col items-center justify-center p-4">
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
							{state === 'initial' && (
								<motion.div key="initial" {...fadeInOut}>
									<div className="space-y-2">
										<h2 className="text-xl">Upload de Arquivo</h2>
										<p className="text-sm text-gray-400">
											Arraste e solte seu arquivo ou clique para procurar
										</p>
									</div>
									<FileUploadForm onSubmit={onSubmitUpload} />
								</motion.div>
							)}

							{state === 'uploading' && (
								<motion.div key="uploading" {...fadeInOut}>
									<UploadProgress progress={progress} />
								</motion.div>
							)}

							{state === 'complete' && fileInfo && (
								<motion.div key="complete" {...fadeInOut}>
									<UploadComplete
										generatedLink={generatedLink}
										onNewUpload={reset}
										fileInfo={fileInfo}
									/>
								</motion.div>
							)}
						</AnimatePresence>
					</div>
				</div>
			</main>
			<Footer />
		</div>
	);
}
