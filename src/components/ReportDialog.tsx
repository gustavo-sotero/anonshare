'use client';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { reportFile } from '@/services/fileService';
import { AlertCircle, Flag } from 'lucide-react';
import { useState } from 'react';

interface ReportDialogProps {
	fileKey: string;
}

export function ReportDialog({ fileKey }: ReportDialogProps) {
	const [isOpen, setIsOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [reportReason, setReportReason] = useState('');
	const [reportDescription, setReportDescription] = useState('');
	const [error, setError] = useState<string | null>(null);
	const { toast } = useToast();

	const handleReport = async () => {
		if (!reportReason) {
			setError('Por favor, selecione um motivo para o relatório.');
			return;
		}

		if (reportReason === 'other' && !reportDescription.trim()) {
			setError("Por favor, forneça uma descrição para o motivo 'Outro'.");
			return;
		}

		if (reportDescription.length > 500) {
			setError('A descrição deve ter no máximo 500 caracteres.');
			return;
		}

		setIsLoading(true);
		setError(null);

		try {
			await reportFile(fileKey, reportReason, reportDescription);

			toast({
				title: 'Relatório enviado',
				description: 'Obrigado por nos ajudar a manter a plataforma segura.'
			});

			setIsOpen(false);
			setReportReason('');
			setReportDescription('');
		} catch (err) {
			const errorMessage =
				err instanceof Error ? err.message : 'Erro ao enviar relatório';
			setError(errorMessage);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Dialog
			open={isOpen}
			onOpenChange={(open) => {
				setIsOpen(open);
				if (!open) setError(null);
			}}
		>
			<DialogTrigger asChild>
				<Button variant="outline" className="w-full mt-4">
					<Flag className="mr-2 h-4 w-4" /> Reportar Arquivo
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px] bg-black border border-zinc-800 text-white">
				<DialogHeader>
					<DialogTitle>Reportar Arquivo</DialogTitle>
					<DialogDescription>
						Por favor, selecione o motivo do relatório e forneça detalhes
						adicionais, se necessário.
					</DialogDescription>
				</DialogHeader>
				{error && (
					<Alert
						variant="destructive"
						className="border-red-500 bg-red-950/50 text-red-400"
					>
						<AlertCircle className="h-4 w-4 text-red-400" />
						<AlertTitle className="text-red-400">Erro</AlertTitle>
						<AlertDescription className="text-red-400">
							{error}
						</AlertDescription>
					</Alert>
				)}
				<div className="grid gap-4 py-4">
					<RadioGroup
						value={reportReason}
						onValueChange={(value) => {
							setReportReason(value);
							setError(null);
						}}
					>
						<div className="flex items-center space-x-2">
							<RadioGroupItem value="copyright" id="copyright" />
							<Label htmlFor="copyright">Violação de direitos autorais</Label>
						</div>
						<div className="flex items-center space-x-2">
							<RadioGroupItem value="illegal" id="illegal" />
							<Label htmlFor="illegal">Conteúdo ilegal</Label>
						</div>
						<div className="flex items-center space-x-2">
							<RadioGroupItem value="inappropriate" id="inappropriate" />
							<Label htmlFor="inappropriate">Conteúdo inapropriado</Label>
						</div>
						<div className="flex items-center space-x-2">
							<RadioGroupItem value="other" id="other" />
							<Label htmlFor="other">Outro</Label>
						</div>
					</RadioGroup>
					<div className="grid gap-2">
						<Label htmlFor="description">
							Descrição{' '}
							{reportReason === 'other' ? '(Obrigatório)' : '(Opcional)'}
						</Label>
						<Textarea
							id="description"
							value={reportDescription}
							onChange={(e) => {
								setReportDescription(e.target.value.slice(0, 500));
								if (reportReason === 'other' && e.target.value.trim()) {
									setError(null);
								}
							}}
							placeholder={
								reportReason === 'other'
									? 'Por favor, forneça detalhes sobre o problema... (máx. 500 caracteres)'
									: 'Forneça detalhes adicionais sobre o problema (opcional, máx. 500 caracteres)...'
							}
							className="bg-zinc-900 border-zinc-800"
							maxLength={500}
						/>
						{/* Add a character count display */}
						<p className="text-sm text-gray-400 text-right">
							{reportDescription.length}/500 caracteres
						</p>
					</div>
				</div>
				<DialogFooter>
					<Button type="submit" onClick={handleReport} disabled={isLoading}>
						{isLoading ? 'Enviando...' : 'Enviar Relatório'}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
