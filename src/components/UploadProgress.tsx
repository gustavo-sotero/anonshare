'use client';

import { Progress } from '@/components/ui/progress';
import { motion } from 'framer-motion';

interface UploadProgressProps {
	progress: number;
}

export function UploadProgress({ progress }: UploadProgressProps) {
	return (
		<motion.div
			className="space-y-4"
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
		>
			<Progress value={progress} className="w-full" />
			<p className="text-center">Fazendo upload do arquivo... {progress}%</p>
		</motion.div>
	);
}
