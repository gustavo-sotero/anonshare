'use client';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import type { UploadFormData } from '@/types/file';
import { zodResolver } from '@hookform/resolvers/zod';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, ChevronDown, ChevronUp, Upload } from 'lucide-react';
import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB

const schema = z.object({
	file: z
		.instanceof(File)
		.refine((file) => file, 'Arquivo é obrigatório')
		.refine(
			(file) => file && file.size <= MAX_FILE_SIZE,
			'O tamanho do arquivo deve ser menor que 100MB.',
		),
	expirationTime: z
		.string()
		.min(1, 'Por favor, selecione um tempo de expiração')
		.optional(),
	oneTimeDownload: z.boolean().default(false).optional(),
	description: z.string().optional(),
});

interface FileUploadFormProps {
	onSubmit: (data: UploadFormData) => void;
}

const expirationOptions = [
	{ value: 'never', label: 'Nunca' },
	{ value: '1', label: '1 Hora' },
	{ value: '24', label: '24 Horas' },
	{ value: '72', label: '3 Dias' },
	{ value: '168', label: '7 Dias' },
	{ value: '720', label: '30 Dias' },
] as const;

export function FileUploadForm({ onSubmit }: FileUploadFormProps) {
	const [fileSizeError, setFileSizeError] = useState<string | null>(null);
	const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);

	const {
		register,
		handleSubmit,
		setValue,
		watch,
		formState: { errors },
	} = useForm<z.infer<typeof schema>>({
		resolver: zodResolver(schema),
		defaultValues: {
			oneTimeDownload: false,
			expirationTime: 'never',
		},
	});

	const watchFile = watch('file');

	const onDrop = (acceptedFiles: File[]) => {
		const file = acceptedFiles[0];
		if (file && file.size <= MAX_FILE_SIZE) {
			setValue('file', file, { shouldValidate: true });
			setFileSizeError(null);
		} else {
			setFileSizeError(
				'O arquivo selecionado é muito grande. O tamanho máximo permitido é 100MB.',
			);
		}
	};

	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		onDrop,
		multiple: false,
		maxSize: MAX_FILE_SIZE,
	});

	return (
		<motion.form
			onSubmit={handleSubmit(onSubmit)}
			className="space-y-6"
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
		>
			<div
				{...getRootProps()}
				className={`border-2 border-dashed border-zinc-800 rounded-lg p-8 text-center transition-colors bg-black
          hover:border-zinc-700 cursor-pointer
          ${isDragActive ? 'border-zinc-700 bg-zinc-900/50' : ''}
          ${errors.file ? 'border-red-500' : ''}`}
			>
				<input {...getInputProps()} />
				<div className="space-y-4">
					<Upload className="w-12 h-12 mx-auto text-gray-400" />
					<div>
						{watchFile ? (
							<p>Arquivo selecionado: {watchFile.name}</p>
						) : (
							<p>Solte seu arquivo aqui ou clique para procurar</p>
						)}
					</div>
					<p className="text-xs text-gray-500">
						Tamanho máximo do arquivo: 100MB
					</p>
				</div>
			</div>

			{(errors.file || fileSizeError) && (
				<Alert
					variant="destructive"
					className="border-red-500 bg-red-950/50 text-red-400"
				>
					<AlertCircle className="h-4 w-4 text-red-400" />
					<AlertTitle>Erro</AlertTitle>
					<AlertDescription>
						{errors.file?.message?.toString() || fileSizeError}
					</AlertDescription>
				</Alert>
			)}

			<div className="space-y-4">
				<Button
					type="button"
					variant="outline"
					className="w-full justify-between bg-black hover:bg-zinc-900 text-zinc-300 border-zinc-800"
					onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
				>
					Opções Avançadas
					{isAdvancedOpen ? (
						<ChevronUp className="h-4 w-4" />
					) : (
						<ChevronDown className="h-4 w-4" />
					)}
				</Button>

				<AnimatePresence initial={false}>
					{isAdvancedOpen && (
						<motion.div
							key="content"
							initial="collapsed"
							animate="open"
							exit="collapsed"
							variants={{
								open: { opacity: 1, height: 'auto' },
								collapsed: { opacity: 0, height: 0 },
							}}
							transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
						>
							<div className="space-y-4 pt-4">
								<div className="space-y-2">
									<Label htmlFor="expirationTime">Tempo de Expiração</Label>
									<Select
										onValueChange={(value) => setValue('expirationTime', value)}
										defaultValue="never"
									>
										<SelectTrigger className="w-full bg-black border-zinc-800">
											<SelectValue placeholder="Selecione o tempo de expiração" />
										</SelectTrigger>
										<SelectContent>
											{expirationOptions.map((option) => (
												<SelectItem key={option.value} value={option.value}>
													{option.label}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									<p className="text-sm text-gray-400">
										Escolha quando o link do arquivo irá expirar
									</p>
								</div>

								<div className="flex items-center justify-between p-4 rounded-lg border border-zinc-800 bg-black">
									<div className="space-y-1">
										<Label htmlFor="oneTimeDownload">Download Único</Label>
										<p className="text-sm text-gray-400">
											O link expirará após o primeiro download
										</p>
									</div>
									<Switch
										id="oneTimeDownload"
										checked={watch('oneTimeDownload')}
										onCheckedChange={(checked) =>
											setValue('oneTimeDownload', checked)
										}
									/>
								</div>
							</div>
						</motion.div>
					)}
				</AnimatePresence>
			</div>

			<div className="space-y-2">
				<Label htmlFor="description">Descrição (Opcional)</Label>
				<Textarea
					{...register('description')}
					placeholder="Adicione uma descrição para este arquivo..."
					className="bg-zinc-900 border-zinc-800 min-h-[100px] resize-none"
				/>
			</div>

			<Button
				type="submit"
				className="w-full bg-white text-black hover:bg-gray-200"
				disabled={!watchFile || !!errors.file}
			>
				Fazer Upload
			</Button>
		</motion.form>
	);
}
