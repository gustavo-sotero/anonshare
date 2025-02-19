# AnonShare

AnonShare é uma plataforma de compartilhamento anônimo de arquivos construída com Next.js 15, focada em privacidade e facilidade de uso.

## ✨ Funcionalidades

- Upload anônimo de arquivos
- Compartilhamento via links únicos
- Download seguro de arquivos
- Sistema de denúncia de conteúdo
- Tema claro/escuro
- Interface moderna e responsiva
- Integração com S3 para armazenamento
- Sistema de notificações via Telegram

## 🚀 Tecnologias

- [Next.js 15](https://nextjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Prisma](https://www.prisma.io/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Cloudflare R2](https://developers.cloudflare.com/r2/)
- [Telegraf](https://telegraf.js.org/)
- [Shadcn/ui](https://ui.shadcn.com/)

## 💻 Pré-requisitos

- Node.js 18+
- NPM ou PNPM
- Conta Cloudflare (para R2)
- Bot do Telegram (opcional)

## 🚀 Instalação

1. Clone o repositório

    ```bash
    git clone <seu-repositorio>
    cd anonshare
    ```

2. Instale as dependências

    ```bash
    npm install
    # ou
    pnpm install
    ```

3. Configure as variáveis de ambiente

    ```bash
    cp .env.example .env
    ```

4. Execute as migrações do banco de dados

    ```bash
    npx prisma migrate dev
    ```

5. Inicie o servidor de desenvolvimento

    ```bash
    npm run dev
    # ou
    pnpm dev
    ```

O projeto estará disponível em [http://localhost:3000](http://localhost:3000)

## 🔧 Configuração

Para configurar o projeto corretamente, você precisará definir as seguintes variáveis de ambiente no arquivo `.env`:

```env
DATABASE_URL="seu-banco-de-dados"
BOT_TOKEN="token-do-bot-telegram"
REPORT_CHAT_ID="chat-id-telegram"
BASE_URL="url-base-da-aplicacao"
NEXT_PUBLIC_BASE_URL="url-base-publica"
CLOUDFLARE_R2_ENDPOINT="seu-r2-endpoint"
R2_BUCKET="seu-bucket-r2"
AWS_ACCESS_KEY_ID="sua-chave-r2"
AWS_SECRET_ACCESS_KEY="seu-segredo-r2"
```

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🤝 Contribuindo

Contribuições são sempre bem-vindas! Por favor, leia as [diretrizes de contribuição](CONTRIBUTING.md) primeiro.
