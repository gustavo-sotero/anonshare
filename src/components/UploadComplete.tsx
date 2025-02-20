'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import type { FileInfo } from '@/types/file';
import { motion } from 'framer-motion';
import { AlertTriangle, Clock, Copy, Share, Upload } from 'lucide-react';

interface UploadCompleteProps {
	generatedLink: string;
	onNewUpload: () => void;
	fileInfo: FileInfo;
}

export function UploadComplete({
	generatedLink,
	onNewUpload,
	fileInfo
}: UploadCompleteProps) {
	const handleShare = async () => {
		if (navigator.share) {
			try {
				await navigator.share({
					title: 'Arquivo compartilhado via AnonShare',
					text: 'Confira este arquivo que compartilhei com você',
					url: generatedLink
				});
			} catch (error) {
				console.error('Error sharing:', error);
				handleCopy();
				toast({
					title: 'Compartilhamento não suportado',
					description: 'O link foi copiado para a área de transferência.'
				});
			}
		} else {
			handleCopy();
		}
	};

	const handleCopy = () => {
		navigator.clipboard.writeText(generatedLink);
		toast({
			title: 'Link copiado!',
			description: 'O link foi copiado para a área de transferência.'
		});
	};

	return (
		<motion.div
			className="space-y-6"
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
		>
			<div className="space-y-2">
				<h2 className="text-xl">Upload Concluído</h2>
				<p className="text-sm text-gray-400">
					Seu arquivo foi enviado com sucesso!
				</p>
			</div>

			<div className="space-y-4 bg-zinc-900 p-4 rounded-lg">
				<h3 className="text-l font-semibold break-words whitespace-pre-wrap">
					{fileInfo.fileName}
				</h3>
				<p className="text-sm text-zinc-400">
					Tamanho: {(fileInfo.size / (1024 * 1024)).toFixed(2)} MB
				</p>

				{fileInfo.description && (
					<div className="text-base text-zinc-400">
						<p className="break-words whitespace-pre-wrap">
							Descrição: {fileInfo.description}
						</p>
					</div>
				)}

				{fileInfo.expirationDate && (
					<div className="flex items-center text-sm text-zinc-400">
						<Clock className="w-4 h-4 mr-2" />
						<span>
							Expira em: {new Date(fileInfo.expirationDate).toLocaleString()}
						</span>
					</div>
				)}

				{fileInfo.oneTimeDownload && (
					<div className="flex items-center text-sm text-yellow-500">
						<AlertTriangle className="w-4 h-4 mr-2" />
						<span>Este link permite apenas um download</span>
					</div>
				)}
			</div>

			<div className="space-y-2">
				<Label htmlFor="generatedLink">Link de Compartilhamento</Label>
				<div className="flex space-x-2">
					<Input
						id="generatedLink"
						value={generatedLink}
						readOnly
						className="bg-transparent border-zinc-800"
					/>
					<Button onClick={handleCopy} variant="outline" size="icon">
						<Copy className="h-4 w-4" />
					</Button>
				</div>
			</div>

			<div className="space-y-4">
				<Button onClick={handleShare} className="w-full">
					<Share className="mr-2 h-4 w-4" />
					Compartilhar
				</Button>
				<Button onClick={onNewUpload} variant="outline" className="w-full">
					<Upload className="mr-2 h-4 w-4" />
					Novo Upload
				</Button>
			</div>
		</motion.div>
	);
}
