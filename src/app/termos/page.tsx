import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function TermosDeUso() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <main className="flex-grow container mx-auto px-4 py-8">
        <Link href="/" className="inline-flex items-center text-zinc-400 hover:text-white mb-6">
          <ArrowLeft className="mr-2" size={20} />
          Voltar para a página inicial
        </Link>

        <h1 className="text-3xl font-bold mb-6">Termos de Uso do AnonShare</h1>

        <div className="space-y-6 text-zinc-300">
          <section>
            <h2 className="text-xl font-semibold mb-2">1. Aceitação dos Termos</h2>
            <p>
              Ao utilizar o AnonShare, você concorda em cumprir e ficar vinculado a estes Termos de Uso. Se você não
              concordar com qualquer parte destes termos, não poderá usar nosso serviço.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">2. Descrição do Serviço</h2>
            <p>
              O AnonShare é uma plataforma de compartilhamento de arquivos que permite aos usuários fazer upload e
              compartilhar arquivos de forma anônima.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">3. Uso Aceitável</h2>
            <p>Você concorda em não usar o AnonShare para:</p>
            <ul className="list-disc list-inside ml-4 mt-2">
              <li>Violar leis ou regulamentos</li>
              <li>Infringir direitos autorais ou propriedade intelectual</li>
              <li>Distribuir malware ou conteúdo malicioso</li>
              <li>Assediar, abusar ou prejudicar outros</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">4. Privacidade e Anonimato</h2>
            <p>
              Embora nos esforcemos para manter o anonimato dos usuários, não podemos garantir anonimato completo. Você
              é responsável por qualquer informação pessoal que possa estar contida nos arquivos que você compartilha.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">5. Limitação de Responsabilidade</h2>
            <p>
              O AnonShare não é responsável pelo conteúdo compartilhado pelos usuários ou por quaisquer danos
              resultantes do uso do nosso serviço.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">6. Modificações dos Termos</h2>
            <p>
              Reservamo-nos o direito de modificar estes termos a qualquer momento. As alterações entrarão em vigor
              imediatamente após a publicação dos termos atualizados.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">7. Contato</h2>
            <p>
              Se você tiver alguma dúvida sobre estes Termos de Uso, entre em contato conosco em:{" "}
              <a href="mailto:contato@anonshare.com" className="text-blue-400 hover:underline">
                contato@anonshare.com
              </a>
            </p>
          </section>
        </div>
      </main>

      <footer className="w-full py-6 bg-zinc-900 text-zinc-400 border-t border-zinc-800">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm">© {new Date().getFullYear()} AnonShare. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  )
}

