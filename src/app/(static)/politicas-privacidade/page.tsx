import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function PoliticasDePrivacidade() {
	return (
		<div className="min-h-screen bg-black text-white flex flex-col">
			<main className="flex-grow container mx-auto px-4 py-8">
				<Link
					href="/"
					className="inline-flex items-center text-zinc-400 hover:text-white mb-6"
				>
					<ArrowLeft className="mr-2" size={20} />
					Voltar para a página inicial
				</Link>

				<h1 className="text-3xl font-bold mb-6">
					Políticas de Privacidade do AnonShare
				</h1>

				<div className="space-y-6 text-zinc-300">
					<section>
						<h2 className="text-xl font-semibold mb-2">1. Introdução</h2>
						<p>
							O AnonShare está comprometido em proteger sua privacidade. Esta
							Política de Privacidade explica como coletamos, usamos e
							protegemos suas informações pessoais ao usar nosso serviço de
							compartilhamento de arquivos.
						</p>
					</section>

					<section>
						<h2 className="text-xl font-semibold mb-2">
							2. Informações Coletadas
						</h2>
						<p>Coletamos as seguintes informações:</p>
						<ul className="list-disc list-inside ml-4 mt-2">
							<li>Endereço IP</li>
							<li>Informações do navegador e do dispositivo</li>
							<li>Data e hora de acesso</li>
							<li>
								Metadados dos arquivos compartilhados (excluindo o conteúdo do
								arquivo)
							</li>
						</ul>
					</section>

					<section>
						<h2 className="text-xl font-semibold mb-2">
							3. Uso das Informações
						</h2>
						<p>Utilizamos as informações coletadas para:</p>
						<ul className="list-disc list-inside ml-4 mt-2">
							<li>Fornecer e manter nosso serviço</li>
							<li>Melhorar e personalizar a experiência do usuário</li>
							<li>Analisar o uso do serviço</li>
							<li>Detectar e prevenir atividades fraudulentas ou abusivas</li>
						</ul>
					</section>

					<section>
						<h2 className="text-xl font-semibold mb-2">
							4. Compartilhamento de Informações
						</h2>
						<p>
							Não vendemos, trocamos ou transferimos suas informações pessoais
							para terceiros, exceto quando necessário para cumprir a lei ou
							proteger nossos direitos.
						</p>
					</section>

					<section>
						<h2 className="text-xl font-semibold mb-2">5. Segurança</h2>
						<p>
							Implementamos medidas de segurança para proteger suas informações
							contra acesso não autorizado, alteração, divulgação ou destruição.
							No entanto, nenhum método de transmissão pela Internet é 100%
							seguro.
						</p>
					</section>

					<section>
						<h2 className="text-xl font-semibold mb-2">
							6. Cookies e Tecnologias Similares
						</h2>
						<p>
							Usamos cookies e tecnologias similares para melhorar a experiência
							do usuário e analisar o uso do serviço. Você pode configurar seu
							navegador para recusar cookies, mas isso pode afetar a
							funcionalidade do serviço.
						</p>
					</section>

					<section>
						<h2 className="text-xl font-semibold mb-2">
							7. Direitos do Usuário
						</h2>
						<p>
							Você tem o direito de acessar, corrigir ou excluir suas
							informações pessoais. Para exercer esses direitos, entre em
							contato conosco através do e-mail fornecido abaixo.
						</p>
					</section>

					<section>
						<h2 className="text-xl font-semibold mb-2">
							8. Alterações na Política de Privacidade
						</h2>
						<p>
							Podemos atualizar nossa Política de Privacidade periodicamente.
							Recomendamos que você revise esta página regularmente para se
							manter informado sobre quaisquer alterações.
						</p>
					</section>

					<section>
						<h2 className="text-xl font-semibold mb-2">9. Contato</h2>
						<p>
							Se você tiver alguma dúvida sobre esta Política de Privacidade,
							entre em contato conosco em:{' '}
							<a
								href="mailto:contato@anonshare.dev"
								className="text-blue-400 hover:underline"
							>
								contato@anonshare.dev
							</a>
						</p>
					</section>
				</div>
			</main>

			<footer className="w-full py-6 bg-zinc-900 text-zinc-400 border-t border-zinc-800">
				<div className="container mx-auto px-4 text-center">
					<p className="text-sm">
						© {new Date().getFullYear()} AnonShare. Todos os direitos
						reservados.
					</p>
				</div>
			</footer>
		</div>
	);
}
