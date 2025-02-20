'use client';

import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ArrowLeft, FileQuestion } from 'lucide-react';
import Link from 'next/link';

export default function NotFound() {
	return (
		<div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
			<motion.div
				className="text-center space-y-6"
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
			>
				<motion.div
					initial={{ scale: 0 }}
					animate={{ scale: 1 }}
					transition={{
						delay: 0.2,
						type: 'spring',
						stiffness: 260,
						damping: 20
					}}
				>
					<FileQuestion className="w-24 h-24 mx-auto text-zinc-400" />
				</motion.div>

				<h1 className="text-4xl font-bold">404</h1>
				<h2 className="text-2xl font-semibold">Página não encontrada</h2>

				<p className="text-zinc-400 max-w-md mx-auto">
					Ops! Parece que o arquivo que você está procurando foi movido ou não
					existe.
				</p>

				<div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
					<Link href="/">
						<Button variant="default" className="w-full sm:w-auto">
							<ArrowLeft className="mr-2 h-4 w-4" />
							Voltar para a página inicial
						</Button>
					</Link>
					<Link href="/">
						<Button variant="outline" className="w-full sm:w-auto">
							Fazer um novo upload
						</Button>
					</Link>
				</div>
			</motion.div>
		</div>
	);
}
