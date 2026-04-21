

# Rodar o CardLab localmente com banco de dados

Para sua apresentação demonstrando persistência de dados, você tem duas opções viáveis. Vou detalhar a recomendada (mais rápida e idêntica ao que está rodando aqui) e a alternativa (100% local).

---

## Opção A — Recomendada: Rodar o frontend local + Lovable Cloud (banco na nuvem)

Você roda o código React/TanStack na sua máquina, mas continua usando o mesmo banco PostgreSQL que já está configurado no Lovable Cloud. **Toda a persistência (cadastro, login, leilões, lances) já funciona, sem precisar instalar PostgreSQL.**

### Passo a passo

1. **Baixar o código do projeto**
   - No topo do editor Lovable, clique no botão do GitHub e exporte o repositório, OU use "Download ZIP".
   - Extraia em uma pasta na sua máquina.

2. **Instalar pré-requisitos**
   - Node.js 20+ (https://nodejs.org)
   - Bun (recomendado, o projeto usa `bunfig.toml` e `bun.lockb`): `npm install -g bun`
     - Alternativa: usar `npm install` mesmo (funciona).

3. **Criar o arquivo `.env` na raiz**
   Esse arquivo NÃO vem no download por segurança. Crie manualmente com este conteúdo (são as mesmas chaves públicas que já estão no projeto):

   ```
   VITE_SUPABASE_URL="https://fxfzclcokhqfuagqkozo.supabase.co"
   VITE_SUPABASE_PUBLISHABLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ4ZnpjbGNva2hxZnVhZ3Frb3pvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYzNTA4OTYsImV4cCI6MjA5MTkyNjg5Nn0.wdVQhPq0y8fgNcBVIDyNx19ZSJE74AqRgjbMzEtAM30"
   VITE_SUPABASE_PROJECT_ID="fxfzclcokhqfuagqkozo"
   SUPABASE_URL="https://fxfzclcokhqfuagqkozo.supabase.co"
   SUPABASE_PUBLISHABLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ4ZnpjbGNva2hxZnVhZ3Frb3pvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYzNTA4OTYsImV4cCI6MjA5MTkyNjg5Nn0.wdVQhPq0y8fgNcBVIDyNx19ZSJE74AqRgjbMzEtAM30"
   ```

4. **Instalar dependências e rodar**
   ```
   bun install
   bun run dev
   ```
   (ou `npm install` + `npm run dev`)

5. **Abrir** http://localhost:3000

### O que você vai conseguir mostrar
- Cadastrar lojista pela tela `/signup` na sua máquina
- Fazer login em `/login`
- Criar um leilão pelo dashboard
- Ver o leilão aparecer na home/lista de leilões
- **Provar persistência:** fechar o navegador, reabrir, dados continuam lá
- **Bônus visual:** abrir uma segunda aba/navegador (Chrome + Firefox) e mostrar que o leilão criado no primeiro aparece também no segundo — prova que está num banco real, não em memória local

---

## Opção B — 100% local com PostgreSQL na sua máquina (mais complexo)

Só recomendo se você precisar mostrar literalmente "tudo offline". Exige rodar Supabase via Docker, refazer migrações e gerar novas chaves. Não é trivial e adiciona riscos no dia da apresentação.

Se quiser seguir esse caminho mesmo assim, me avise que eu monto um guia separado com Docker Compose + Supabase CLI.

---

## Roteiro sugerido para a apresentação (Opção A)

1. Abrir terminal e mostrar `bun run dev` subindo o servidor local
2. Abrir `localhost:3000` → home com leilões
3. Ir em `/signup`, criar conta de lojista ao vivo
4. Login em `/login`
5. Dashboard → criar um leilão novo (carta de Magic, por exemplo)
6. Voltar para `/auctions` → o leilão recém-criado aparece
7. **Prova de persistência:** F5 na página, fechar aba, reabrir → continua lá
8. Abrir o painel do Lovable Cloud (Connectors → Lovable Cloud → Tables → `auctions`) e mostrar a linha inserida no banco em tempo real

---

## Detalhes técnicos

- O projeto usa **TanStack Start v1 + Vite 7**, então `bun run dev` (definido no `package.json`) sobe o servidor SSR na porta 3000 por padrão.
- O cliente Supabase em `src/integrations/supabase/client.ts` lê as variáveis `VITE_SUPABASE_*` em build-time (Vite) e `SUPABASE_*` em runtime (SSR).
- A chave `VITE_SUPABASE_PUBLISHABLE_KEY` é pública por design (RLS protege o banco), então é seguro versionar/compartilhar.
- O `SUPABASE_SERVICE_ROLE_KEY` (admin) **não é necessário** para rodar localmente — nenhum fluxo do app o usa hoje.
- Migrações do banco já estão aplicadas no Lovable Cloud, então não há `supabase db push` a executar.

---

## Possíveis problemas e soluções

| Problema | Causa | Solução |
|---|---|---|
| `bun: command not found` | Bun não instalado | Use `npm install` + `npm run dev` |
| Erro "Missing Supabase environment variables" | `.env` ausente ou mal formado | Conferir o passo 3, sem espaços ao redor do `=` |
| Página em branco / erro CORS | Domínio local não autorizado | Já funciona — `localhost` está permitido por padrão no Supabase |
| Porta 3000 ocupada | Outro app rodando | Mate o processo ou rode `PORT=3001 bun run dev` |

