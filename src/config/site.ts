/**
 * SITE CONFIG — modifique aqui textos, jogos e cores principais facilmente.
 * Tudo neste arquivo controla a aparência e conteúdo do site.
 */

export const siteConfig = {
  name: "CardLab",
  tagline: "Leilões de TCGs",
  description:
    "A casa de leilões definitiva para colecionadores de Magic, Pokémon, One Piece e muito mais.",
  contactEmail: "contato@cardlab.gg",
};

export type Game = {
  slug: string;
  name: string;
  tagline: string;
  /** "scryfall" | "gatcg" | "static" — define qual API usar */
  api: "scryfall" | "gatcg" | "static";
  /** carta exemplo para preview */
  sampleCard: string;
  color: string;
};

export const games: Game[] = [
  {
    slug: "magic",
    name: "Magic: The Gathering",
    tagline: "O TCG original",
    api: "scryfall",
    sampleCard: "Black Lotus",
    color: "oklch(0.55 0.18 30)",
  },
  {
    slug: "pokemon",
    name: "Pokémon TCG",
    tagline: "Gotta catch 'em all",
    api: "static",
    sampleCard: "Charizard",
    color: "oklch(0.7 0.18 50)",
  },
  {
    slug: "onepiece",
    name: "One Piece TCG",
    tagline: "Rumo ao One Piece",
    api: "static",
    sampleCard: "Monkey D. Luffy",
    color: "oklch(0.6 0.2 25)",
  },
  {
    slug: "starwars",
    name: "Star Wars Unlimited",
    tagline: "Que a Força esteja com você",
    api: "static",
    sampleCard: "Darth Vader",
    color: "oklch(0.45 0.15 295)",
  },
  {
    slug: "riftbound",
    name: "Riftbound",
    tagline: "League of Legends TCG",
    api: "static",
    sampleCard: "Jinx",
    color: "oklch(0.6 0.18 200)",
  },
];

export const getGame = (slug: string) => games.find((g) => g.slug === slug);
