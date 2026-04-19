import { createServerFn } from "@tanstack/react-start";

export type OnePieceCard = {
  name: string;
  imageUrl: string;
  setName?: string;
};

/**
 * Server function que busca cartas de One Piece na apitcg.com
 * Usa a APITCG_API_KEY como secret no servidor — nunca exposta ao client.
 */
export const searchOnePieceCards = createServerFn({ method: "POST" })
  .inputValidator((input: { query: string }) => {
    if (!input || typeof input.query !== "string") {
      throw new Error("Invalid query");
    }
    return { query: input.query.slice(0, 100) };
  })
  .handler(async ({ data }): Promise<{ cards: OnePieceCard[]; error: string | null }> => {
    const apiKey = process.env.APITCG_API_KEY;
    if (!apiKey) {
      console.error("APITCG_API_KEY not configured");
      return { cards: [], error: "API key not configured" };
    }

    try {
      const url = `https://www.apitcg.com/api/one-piece/cards?name=${encodeURIComponent(data.query)}`;
      const res = await fetch(url, {
        headers: {
          "x-api-key": apiKey,
          Accept: "application/json",
        },
      });

      if (!res.ok) {
        console.error(`apitcg.com error: ${res.status} ${res.statusText}`);
        return { cards: [], error: `API responded with ${res.status}` };
      }

      const json = await res.json();
      const items = Array.isArray(json?.data) ? json.data : Array.isArray(json) ? json : [];

      const cards: OnePieceCard[] = items.slice(0, 12).map((c: any) => ({
        name: c.name ?? "Unknown",
        imageUrl: c.images?.large || c.images?.small || c.image || "",
        setName: c.set?.name,
      }));

      return { cards, error: null };
    } catch (err) {
      console.error("One Piece API request failed:", err);
      return { cards: [], error: "Failed to reach One Piece API" };
    }
  });
