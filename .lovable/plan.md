# Plano: Diagramas DER e de Classes (PDF único)

Gerar **um arquivo `.pdf`** em `/mnt/documents/` contendo duas páginas:

1. **Diagrama Entidade-Relacionamento (DER)** — notação Crow's Foot
2. **Diagrama de Classes (UML)** — classes com atributos, tipos e métodos

Escopo inclui o estado atual do banco **+ entidades futuras** (Lances e ator Comprador).

---

## Página 1 — DER

Entidades e relacionamentos:

- **auth_users** (id, email) — gerenciada pelo Supabase
- **profiles** (id PK/FK→auth_users, display_name, shop_name, created_at)
- **user_roles** (id PK, user_id FK→auth_users, role: enum {admin, shop, user})
- **auctions** (id PK, shop_id FK→auth_users, game, card_name, card_image_url, description, starting_price, current_bid, ends_at, created_at)
- **bids** *(futuro)* (id PK, auction_id FK→auctions, buyer_id FK→auth_users, amount, created_at)

Cardinalidades:
- auth_users (1) ──── (1) profiles
- auth_users (1) ──── (N) user_roles
- auth_users (1) ──── (N) auctions  *(como lojista)*
- auctions   (1) ──── (N) bids
- auth_users (1) ──── (N) bids       *(como comprador)*

Atributo derivado destacado: `auctions.current_bid` = MAX(bids.amount).

## Página 2 — Diagrama de Classes (UML)

Classes correspondentes às entidades + serviços do código (`src/crud/*`):

- **Profile** { id, displayName, shopName, createdAt; +update() }
- **UserRole** «enum» { admin, shop, user } e classe **RoleAssignment** { userId, role }
- **Auction** { id, shopId, game, cardName, cardImageUrl, description, startingPrice, currentBid, endsAt; +placeBid(), +update(), +delete() }
- **Bid** *(futuro)* { id, auctionId, buyerId, amount, createdAt }
- **AuthService** { signUp(), signIn(), signOut(), getCurrentUser(), hasRole() }
- Atores externos: **Lojista**, **Comprador**

Relações:
- Profile 1—1 AuthUser
- AuthUser 1—* RoleAssignment
- AuthUser (Lojista) 1—* Auction
- Auction 1—* Bid
- AuthUser (Comprador) 1—* Bid
- AuthService ..> AuthUser «usa»

## Detalhes técnicos

- Renderização com **matplotlib** (mesmo estilo dos casos de uso anteriores: fundo `#fdf6e3`, retângulos, linhas Crow's Foot manuais, fontes serifadas).
- Salvar duas figuras como páginas e combinar via `matplotlib.backends.backend_pdf.PdfPages`.
- QA: converter PDF em imagens com `pdftoppm` e inspecionar cada página antes de entregar.
- Saída final: `/mnt/documents/diagramas_der_classes.pdf` + tag `<presentation-artifact>`.
