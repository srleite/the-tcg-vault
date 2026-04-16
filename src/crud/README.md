# 📂 CRUD — CardLab

Esta pasta concentra **TODO o código de acesso ao banco de dados** (Lovable Cloud / Supabase) usado pelo site. Foi separada para facilitar a manutenção e a entrega: você consegue revisar toda a camada de dados num só lugar, sem caçar `supabase.from(...)` espalhado pelo projeto.

## 🗂 Estrutura

| Arquivo          | Responsabilidade                                                            |
| ---------------- | --------------------------------------------------------------------------- |
| `auth.ts`        | Cadastro, login, logout, sessão, atribuição de roles (`user`/`shop`).       |
| `profiles.ts`    | Leitura e atualização do perfil público (nome do lojista/usuário).          |
| `auctions.ts`    | CRUD completo de leilões + função `placeBid` para registrar lances.         |

## 🔌 Como usar

```ts
import { listAuctions, createAuction, placeBid, deleteAuction } from "@/crud/auctions";
import { getProfile, displayName }                              from "@/crud/profiles";
import { signUp, signIn, signOut, getCurrentUser }              from "@/crud/auth";
```

## 🛡 Regras de segurança (RLS)

| Tabela        | SELECT      | INSERT                          | UPDATE/DELETE       |
| ------------- | ----------- | ------------------------------- | ------------------- |
| `auctions`    | público     | apenas role `shop`              | apenas o dono       |
| `profiles`    | público     | o próprio usuário (no signup)   | o próprio usuário   |
| `user_roles`  | apenas dono | o próprio usuário               | bloqueado           |

Tudo é validado no **banco de dados** — mesmo se alguém burlar o frontend, o Supabase recusa a operação.

## 🧪 Mapa rápido: tela ➜ funções de CRUD usadas

| Tela                     | Funções                                            |
| ------------------------ | -------------------------------------------------- |
| `/signup`                | `signUp`                                           |
| `/login`                 | `signIn`                                           |
| `/dashboard`             | `getCurrentUser`, `listAuctionsByShop`, `createAuction`, `deleteAuction` |
| `/auctions`              | `listAuctions`                                     |
| `/auctions/:id`          | `getAuction`, `placeBid`, `getProfile`             |
| `/shop/:id`              | `getProfile`, `listAuctionsByShop`                 |
