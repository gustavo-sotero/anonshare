'use client';

import { Footer } from '@/components/Footer';
import { SharePageContent } from '@/components/SharePageContent';
import { useParams } from 'next/navigation';

export default function SharePage() {
	const params = useParams();

	return (
		<div className="min-h-screen bg-black text-white flex flex-col">
			<main className="flex-grow flex flex-col items-center justify-center p-4">
				<SharePageContent keyFile={params.keyFile as string} />
			</main>
			<Footer />
		</div>
	);
}
