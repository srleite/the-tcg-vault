

# Provar persistência em banco de dados real (não local)

Para sua apresentação, vou te dar **5 provas visuais** que demonstram, sem deixar dúvida, que os dados do CardLab estão num banco PostgreSQL remoto na nuvem — não em localStorage, não em arquivo local, não em memória.

---

## Prova 1 — Dois navegadores, mesma conta, mesmos dados (a mais visual)

**O que fazer:**
1. Abrir o site em **Chrome** → fazer login como lojista → criar um leilão "Carta XYZ"
2. Abrir o site em **Firefox** (ou aba anônima) → fazer login com a **mesma conta** → o leilão criado no Chrome aparece imediatamente
3. Editar/dar lance no Firefox → atualizar a página no Chrome → mudança aparece

**Por que prova:** Chrome e Firefox têm storages totalmente isolados. Se o dado aparece nos dois, **só pode estar vindo de um servidor remoto**.

---

## Prova 2 — Dois dispositivos diferentes (impacto máximo)

**O que fazer:**
1. No notebook: criar um leilão
2. No celular (mesma rede ou 4G): abrir o site, fazer login, mostrar o leilão lá

**Por que prova:** Dispositivos físicos diferentes não compartilham storage local. Bônus: usar 4G no celular prova que está saindo pra internet.

---

## Prova 3 — Mostrar o painel do banco ao vivo (a mais técnica)

**O que fazer durante a apresentação:**
1. Abrir o Lovable em outra aba → **Connectors → Lovable Cloud → Tables → `auctions`**
2. Mostrar a tabela com as linhas existentes
3. Voltar pro app → criar um leilão novo ao vivo
4. Voltar pro painel → **F5** → a nova linha aparece com o `id` (UUID), `created_at`, `shop_id` etc.
5. Mostrar também a tabela `profiles` e `user_roles` com o usuário cadastrado

**Por que prova:** Você está literalmente mostrando o registro SQL no banco PostgreSQL.

---

## Prova 4 — Aba Network do DevTools (prova de rede)

**O que fazer:**
1. Abrir DevTools (F12) → aba **Network** → filtrar por "supabase"
2. Recarregar a página de leilões
3. Mostrar a requisição saindo para `https://fxfzclcokhqfuagqkozo.supabase.co/rest/v1/auctions`
4. Clicar na requisição → mostrar o JSON de resposta vindo do servidor remoto

**Por que prova:** Mostra o tráfego HTTP saindo da máquina local indo pra nuvem e voltando com os dados.

---

## Prova 5 — Inserir dado direto no banco e ver aparecer no app

**O que fazer:**
1. No painel do Lovable Cloud → SQL Editor → rodar manualmente:
   ```sql
   INSERT INTO auctions (shop_id, game, card_name, starting_price, ends_at)
   VALUES ('<seu-user-id>', 'magic', 'Carta inserida via SQL', 100, now() + interval '7 days');
   ```
2. Voltar pro app local → recarregar `/auctions` → a carta aparece

**Por que prova:** O dado nasceu no banco (não no app) e o app local foi buscar lá. Inverte o fluxo e fecha qualquer dúvida.

---

## Roteiro narrativo sugerido (3 min de apresentação)

```text
1. "Vou criar um leilão aqui no Chrome..."        [Prova 1, parte A]
2. "Agora abro o Firefox, mesma conta..."         [Prova 1, parte B]
3. "Vejam: o leilão está aqui também."
4. "Pra provar que não é mágica, abro o painel
    do banco de dados na nuvem..."                [Prova 3]
5. "Esta é a tabela 'auctions' no PostgreSQL.
    O leilão que criei está aqui, com UUID,
    timestamp, e o ID do meu usuário."
6. "E pra fechar: vou inserir uma carta direto
    no banco via SQL..."                          [Prova 5]
7. "Volto pro app, recarrego... apareceu.
    Os dados vivem no servidor, não na minha máquina."
```

---

## Reforço opcional no app (pequena melhoria de código)

Se quiser deixar **ainda mais claro visualmente durante a demo**, posso adicionar no Dashboard um pequeno indicador discreto tipo:

> 🟢 Conectado ao banco · `fxfzclcokhqfuagqkozo.supabase.co` · 12 leilões carregados

Isso mostra ao vivo que o app está falando com um servidor remoto identificável. É uma alteração pequena (uns 15 minutos), só no `src/routes/dashboard.tsx`.

**Me diz se quer essa adição** ou se as 5 provas acima já bastam — nesse caso é só seguir o roteiro, nenhuma mudança de código é necessária.

