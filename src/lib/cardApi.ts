/**
 * Wrapper para APIs públicas de imagens de cartas.
 * - Scryfall: Magic
 * - GATCG: Grand Archive
 * - Fallback: imagem genérica (pokemontcg.io para Pokémon poderia ser adicionada)
 */

export type CardImage = {
  name: string;
  imageUrl: string;
  setName?: string;
};

const FALLBACK_IMG =
  "https://images.unsplash.com/photo-1606503153255-59d8b8b25d56?w=400&q=80";

export async function searchScryfall(query: string): Promise<CardImage[]> {
  try {
    const res = await fetch(
      `https://api.scryfall.com/cards/search?q=${encodeURIComponent(query)}&order=edhrec`
    );
    if (!res.ok) return [];
    const data = await res.json();
    return (data.data || []).slice(0, 12).map((c: any) => ({
      name: c.name,
      imageUrl:
        c.image_uris?.normal ||
        c.card_faces?.[0]?.image_uris?.normal ||
        FALLBACK_IMG,
      setName: c.set_name,
    }));
  } catch {
    return [];
  }
}

export async function searchGatcg(query: string): Promise<CardImage[]> {
  try {
    const res = await fetch(
      `https://api.gatcg.com/cards/search?name=${encodeURIComponent(query)}`
    );
    if (!res.ok) return [];
    const data = await res.json();
    const items = Array.isArray(data) ? data : data.data || [];
    return items.slice(0, 12).map((c: any) => ({
      name: c.name,
      imageUrl: c.image
        ? `https://api.gatcg.com/cards/images/${c.image}`
        : FALLBACK_IMG,
      setName: c.edition?.name,
    }));
  } catch {
    return [];
  }
}

export async function searchCards(
  api: "scryfall" | "gatcg" | "static",
  query: string
): Promise<CardImage[]> {
  if (api === "scryfall") return searchScryfall(query);
  if (api === "gatcg") return searchGatcg(query);
  // static fallback — single placeholder
  return [
    { name: query, imageUrl: FALLBACK_IMG },
  ];
}
