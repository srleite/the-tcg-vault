# Diagramas de Sequência — CardLab

Gerar **um único PDF** em `/mnt/documents/diagramas_sequencia.pdf` com dois diagramas de sequência UML, um para cada caso de uso enviado, mais uma breve seção-guia sobre **como/onde criar** esse tipo de diagrama.

---

## Página 1 — Sequência: Gerenciar Perfil

Atores/objetos (linhas de vida, da esquerda p/ direita):

`Usuário` → `ProfilePage (UI)` → `AuthService` → `ProfilesCRUD` → `Supabase (DB + RLS)`

Mensagens (fluxo principal + subfluxos como `alt`):

1. Usuário → UI: acessar "Meu Perfil"
2. UI → AuthService: getCurrentUser()
3. **alt** [não autenticado] → redirect `/login` (subfluxo 3.1)
4. UI → ProfilesCRUD: getProfile(userId)
5. ProfilesCRUD → DB: SELECT * FROM profiles WHERE id = uid
6. DB → UI: dados do perfil
7. Usuário → UI: edita campos + "Salvar"
8. UI → UI: valida (não vazio, tamanho máx.)  — **alt** inválido → erro (3.2)
9. UI → ProfilesCRUD: updateProfile(userId, patch)
10. ProfilesCRUD → DB: UPDATE profiles ... (RLS: auth.uid() = id)
11. **alt** [erro de rede/RLS] → toast erro, mantém form (3.3)
12. DB → UI: ok → toast "Perfil atualizado"

## Página 2 — Sequência: Gerenciar Cartas (criar leilão — fluxo principal)

Linhas de vida:

`Lojista` → `Dashboard (UI)` → `CardAPI (externa)` → `AuctionsCRUD` → `Supabase (DB + RLS)`

1. Lojista → UI: clica "Novo Leilão"
2. UI → UI: abre modal com formulário
3. Lojista → UI: escolhe jogo + digita nome + "Buscar"
4. UI → CardAPI: searchCards(game, query)
5. **alt** [API falha] → aviso + permitir nova busca (4.5); [vazio] → "Nenhuma carta encontrada" (4.4)
6. CardAPI → UI: lista de cartas (miniaturas)
7. Lojista → UI: seleciona carta + preenche descrição/preço/dias + "Publicar"
8. UI → UI: valida (preço>0, dias 1–30, carta selecionada)
9. UI → AuctionsCRUD: createAuction(payload)
10. AuctionsCRUD → DB: INSERT INTO auctions (RLS: role 'shop')
11. **alt** [sem role] → "Permissão negada" (4.6); [sessão expirada] → redirect login (4.7)
12. DB → UI: leilão criado → fecha modal, recarrega lista

Notas no rodapé do diagrama referenciando fluxos alternativos 4.2 (editar) e 4.3 (remover) como variações reutilizando `AuctionsCRUD.updateAuction` / `deleteAuction`.

## Página 3 — Guia rápido: como e onde fazer

- **O que é**: diagrama UML que mostra a troca de mensagens **no tempo** entre atores e objetos (linhas de vida verticais, setas horizontais, blocos `alt`/`opt`/`loop`).
- **Ferramentas recomendadas** (todas gratuitas):
  - **PlantUML** (texto → diagrama, ótimo p/ versionar no Git). Editor online: plantuml.com/plantuml
  - **Mermaid** (`sequenceDiagram`) — renderiza direto no GitHub/Notion
  - **draw.io / diagrams.net** — arrastar e soltar, exporta PDF/PNG
  - **Lucidchart** — colaborativo (versão free limitada)
  - **StarUML / Visual Paradigm** — desktop, mais "acadêmico"
- **Recomendação p/ o TCC**: PlantUML — você cola o texto, gera PNG/PDF, e o arquivo `.puml` fica versionado. Incluirei no PDF os dois trechos `.puml` prontos p/ copiar-colar.

## Detalhes técnicos da geração

- Renderização com **matplotlib** (mesmo estilo dos diagramas anteriores: fundo `#fdf6e3`, fontes serifadas), 3 páginas combinadas via `PdfPages`.
- Setas sólidas → chamadas síncronas; tracejadas → retornos. Caixas `alt` em retângulo pontilhado englobando alternativas.
- QA obrigatório: `pdftoppm` em cada página e inspeção visual antes de entregar.
- Entrega: `<presentation-artifact>` apontando p/ `diagramas_sequencia.pdf`.

Posso seguir e gerar?
