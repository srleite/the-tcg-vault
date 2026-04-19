import riftboundJinx from "@/assets/riftbound-jinx.png";

/**
 * LEILÕES DE EXEMPLO (MOCK)
 * Usados apenas para apresentação/prints. Não persistem no banco.
 * Aparecem misturados aos leilões reais do Supabase nas listagens.
 *
 * IDs começam com "mock-" para serem identificáveis.
 * Para editar exemplos, modifique este arquivo.
 */

export type MockAuction = {
  id: string;
  game: string;
  card_name: string;
  card_image_url: string;
  description: string;
  current_bid: number;
  starting_price: number;
  ends_at: string;
  shop_id: string;
  shop_name: string;
  bids: { user: string; amount: number; at: string }[];
};

const inDays = (d: number) => new Date(Date.now() + d * 86400000).toISOString();
const hoursAgo = (h: number) => new Date(Date.now() - h * 3600000).toISOString();

export const mockAuctions: MockAuction[] = [
  {
    id: "mock-magic-1",
    game: "magic",
    card_name: "Black Lotus",
    card_image_url:
      "https://cards.scryfall.io/normal/front/b/d/bd8fa327-dd41-4737-8f19-2cf5eb1f7cdd.jpg",
    description:
      "Carta lendária da edição Alpha (1993). Estado: Near Mint. Item de colecionador, autenticado e periciado.",
    current_bid: 185000,
    starting_price: 100000,
    ends_at: inDays(2),
    shop_id: "mock-shop-1",
    shop_name: "Vintage Vault BR",
    bids: [
      { user: "colecionador_99", amount: 185000, at: hoursAgo(1) },
      { user: "magic_fanatico", amount: 170000, at: hoursAgo(5) },
      { user: "investidor_tcg", amount: 150000, at: hoursAgo(12) },
      { user: "alpha_hunter", amount: 120000, at: hoursAgo(20) },
    ],
  },
  {
    id: "mock-pokemon-1",
    game: "pokemon",
    card_name: "Charizard Base Set 1ª Edição",
    card_image_url:
      "https://images.pokemontcg.io/base1/4_hires.png",
    description:
      "Charizard holográfico, Base Set 1ª Edição, gradação PSA 9. Uma das cartas mais cobiçadas do Pokémon TCG.",
    current_bid: 42000,
    starting_price: 25000,
    ends_at: inDays(3),
    shop_id: "mock-shop-2",
    shop_name: "Poké Auctions",
    bids: [
      { user: "ash_ketchum_br", amount: 42000, at: hoursAgo(2) },
      { user: "shiny_collector", amount: 38500, at: hoursAgo(8) },
      { user: "kanto_master", amount: 32000, at: hoursAgo(18) },
    ],
  },
  {
    id: "mock-onepiece-1",
    game: "onepiece",
    card_name: "Monkey D. Luffy - Líder",
    card_image_url:
      "https://en.onepiece-cardgame.com/images/cardlist/card/ST14-001.png?241220",
    description:
      "Carta líder ST14-001 do set -3D2Y-. Versão alternativa em foil. Excelente estado.",
    current_bid: 850,
    starting_price: 400,
    ends_at: inDays(1),
    shop_id: "mock-shop-3",
    shop_name: "Grand Line Cards",
    bids: [
      { user: "rei_dos_piratas", amount: 850, at: hoursAgo(3) },
      { user: "zoro_main", amount: 720, at: hoursAgo(10) },
      { user: "nakama_collector", amount: 600, at: hoursAgo(22) },
    ],
  },
  {
    id: "mock-starwars-1",
    game: "starwars",
    card_name: "Darth Vader - Dark Lord of the Sith",
    card_image_url:
      "https://swudb.com/images/cards/SOR/010.png",
    description:
      "Líder do set Spark of Rebellion. Versão showcase, raridade legendária. Sleeve original.",
    current_bid: 1200,
    starting_price: 500,
    ends_at: inDays(4),
    shop_id: "mock-shop-4",
    shop_name: "Galactic TCG",
    bids: [
      { user: "sith_lord", amount: 1200, at: hoursAgo(4) },
      { user: "rebel_alliance", amount: 1050, at: hoursAgo(11) },
      { user: "jedi_council", amount: 800, at: hoursAgo(19) },
    ],
  },
  {
    id: "mock-riftbound-1",
    game: "riftbound",
    card_name: "Jinx - Loose Cannon",
    card_image_url: riftboundJinx,
    description:
      "Champion card do set inaugural de Riftbound. Arte alternativa exclusiva de pré-venda.",
    current_bid: 680,
    starting_price: 300,
    ends_at: inDays(5),
    shop_id: "mock-shop-5",
    shop_name: "Rift Market",
    bids: [
      { user: "piltover_fan", amount: 680, at: hoursAgo(6) },
      { user: "zaun_runner", amount: 550, at: hoursAgo(14) },
      { user: "league_pro", amount: 420, at: hoursAgo(21) },
    ],
  },
];

export const getMockAuction = (id: string) =>
  mockAuctions.find((a) => a.id === id);

export const isMockId = (id: string) => id.startsWith("mock-");
