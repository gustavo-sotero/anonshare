import { Github, Linkedin } from 'lucide-react';
import Link from 'next/link';

export function Footer() {
	return (
		<footer className="w-full py-6 bg-black text-zinc-400 border-t border-zinc-800">
			<div className="container mx-auto px-4 flex flex-col items-center space-y-4">
				<div className="flex flex-col sm:flex-row justify-between items-center w-full">
					<p className="text-sm mb-4 sm:mb-0">
						© {new Date().getFullYear()} AnonShare. Todos os direitos
						reservados.
					</p>
					<div className="flex items-center space-x-4">
						<Link
							href="https://github.com/gustavo-sotero/anonshare"
							target="_blank"
							rel="noopener noreferrer"
							className="text-zinc-400 hover:text-white transition-colors"
						>
							<Github size={20} />
						</Link>
						<Link
							href="/termos-de-uso"
							className="text-sm text-zinc-400 hover:text-white transition-colors"
						>
							Termos de Uso
						</Link>
						<Link
							href="/politicas-privacidade"
							className="text-sm text-zinc-400 hover:text-white transition-colors"
						>
							Política de Privacidade
						</Link>
					</div>
				</div>
				<div className="flex items-center space-x-2 text-sm">
					<span>Made by: Gustavo Sotero</span>
					<Link
						href="https://github.com/gustavo-sotero"
						target="_blank"
						rel="noopener noreferrer"
						className="text-zinc-400 hover:text-white transition-colors"
						title="Visit my GitHub profile"
						aria-label="GitHub Profile"
					>
						<Github size={16} />
					</Link>
					<Link
						href="https://www.linkedin.com/in/gustavo-sotero"
						target="_blank"
						rel="noopener noreferrer"
						className="text-zinc-400 hover:text-white transition-colors"
						title="Visit my LinkedIn profile"
						aria-label="LinkedIn Profile"
					>
						<Linkedin size={16} />
					</Link>
				</div>
			</div>
		</footer>
	);
}
