# Instruções para o GitHub Copilot - Projeto AnonShare

Estas são diretrizes para o GitHub Copilot ao trabalhar neste projeto.

## Tecnologias Principais

-   **Framework:** Next.js 15 (App Router)
-   **Linguagem:** TypeScript
-   **Estilização:** Tailwind CSS com Shadcn/ui
-   **Banco de Dados:** PostgreSQL com Prisma ORM
-   **Armazenamento:** Cloudflare R2 (via AWS SDK v3)
-   **Validação:** Zod
-   **Formulários:** React Hook Form
-   **Notificações:** Telegraf (Telegram Bot)
-   **Linting/Formatação:** Biome

## Diretrizes Gerais

1.  **Linguagem e Framework:**
    *   Siga as convenções do TypeScript e do Next.js 15 (App Router).
    *   Prefira React Server Components (RSC) sempre que possível.
    *   Use API Routes (`src/app/api/.../route.ts`) para endpoints de backend. Utilize `NextResponse` para as respostas.
2.  **Estilização:**
    *   Utilize classes utilitárias do Tailwind CSS.
    *   Use componentes pré-construídos da biblioteca `shadcn/ui` (`@/components/ui`).
    *   Siga o tema e as variáveis CSS definidas em `tailwind.config.ts` e `src/app/globals.css`.
3.  **Componentes React:**
    *   Crie componentes funcionais.
    *   Mantenha os componentes o mais simples e reutilizáveis possível.
    *   Use hooks do React (useState, useEffect, useContext, etc.) para gerenciamento de estado e ciclo de vida no lado do cliente.
4.  **Banco de Dados (Prisma):**
    *   Use o Prisma Client (`@/lib/prisma`) para todas as interações com o banco de dados.
    *   Siga o schema definido em `prisma/schema.prisma`.
    *   Ao fazer alterações no schema, lembre-se de gerar e aplicar migrações (`npx prisma migrate dev`, `npx prisma generate`).
5.  **Armazenamento (Cloudflare R2):**
    *   Utilize o `s3Client` configurado em `src/lib/s3Client.ts` para interagir com o R2.
    *   Use URLs pré-assinadas (`getSignedUrl` do `@aws-sdk/s3-request-presigner`) para uploads e downloads seguros.
6.  **Validação (Zod):**
    *   Use Zod para validar dados de entrada em API Routes e formulários.
7.  **Formulários (React Hook Form):**
    *   Utilize `react-hook-form` para gerenciar o estado e a validação de formulários.
    *   Integre com Zod usando `@hookform/resolvers`.
8.  **Código e Estilo:**
    *   Siga as regras de linting e formatação definidas pelo Biome (`biome.json`). Use `npm run check` ou a integração do VSCode para formatar e verificar.
    *   Use indentação com tabs, aspas simples para strings e ponto e vírgula no final das declarações.
    *   Escreva código claro, conciso e bem comentado, especialmente para lógica complexa.
9.  **Gerenciamento de Dependências:**
    *   Use `npm` para gerenciar dependências. Consulte `package.json` para as dependências existentes.
10. **Segurança:**
    *   Esteja atento à segurança, especialmente ao lidar com uploads de arquivos, dados do usuário e acesso a recursos.
    *   Valide e sanitize todas as entradas do usuário.
11. **Variáveis de Ambiente:**
    *   Acesse variáveis de ambiente usando `process.env`. Consulte `.env.example` para as variáveis necessárias.
12. **Estrutura de Arquivos:**
    *   Mantenha a estrutura de diretórios existente. Coloque componentes reutilizáveis em `src/components`, hooks em `src/hooks`, utilitários em `src/lib`, serviços em `src/services`, tipos em `src/types`, etc.
13. **Tratamento de Erros:**
    *   Implemente tratamento de erros robusto, especialmente em operações assíncronas, chamadas de API e interações com banco de dados/armazenamento. Use blocos `try...catch` e retorne respostas de erro apropriadas nas API Routes.