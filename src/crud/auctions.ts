/**
 * ============================================================
 *  CRUD — LEILÕES (auctions)
 * ============================================================
 * Todas as operações de banco relacionadas a LEILÕES ficam aqui.
 * Importe estas funções nas telas em vez de chamar `supabase` direto.
 *
 *   import { listAuctions, createAuction, ... } from "@/crud/auctions";
 *
 * Tabela: public.auctions
 * Regras (RLS):
 *  - Qualquer pessoa pode LER leilões.
 *  - Apenas usuários com role "shop" podem CRIAR.
 *  - Apenas o dono (shop_id = auth.uid()) pode ATUALIZAR/DELETAR.
 * ============================================================
 */

import { supabase } from "@/integrations/supabase/client";

export type Auction = {
  id: string;
  shop_id: string;
  game: string;
  card_name: string;
  card_image_url: string | null;
  description: string | null;
  starting_price: number;
  current_bid: number | null;
  ends_at: string;
  created_at: string;
};

export type NewAuction = {
  shop_id: string;
  game: string;
  card_name: string;
  card_image_url?: string | null;
  description?: string | null;
  starting_price: number;
  ends_at: string;
};

/** READ — todos os leilões (mais recentes primeiro). */
export async function listAuctions(): Promise<Auction[]> {
  const { data, error } = await supabase
    .from("auctions")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data as Auction[]) || [];
}

/** READ — leilões de um lojista específico. */
export async function listAuctionsByShop(shopId: string): Promise<Auction[]> {
  const { data, error } = await supabase
    .from("auctions")
    .select("*")
    .eq("shop_id", shopId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data as Auction[]) || [];
}

/** READ — um leilão pelo id. */
export async function getAuction(id: string): Promise<Auction | null> {
  const { data, error } = await supabase
    .from("auctions")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data as Auction | null;
}

/** CREATE — novo leilão (apenas lojistas). */
export async function createAuction(payload: NewAuction): Promise<Auction> {
  const { data, error } = await supabase
    .from("auctions")
    .insert(payload)
    .select()
    .single();
  if (error) throw error;
  return data as Auction;
}

/** UPDATE — atualizar lance atual ou outros campos. */
export async function updateAuction(
  id: string,
  patch: Partial<Pick<Auction, "current_bid" | "description" | "ends_at" | "starting_price">>
): Promise<void> {
  const { error } = await supabase.from("auctions").update(patch).eq("id", id);
  if (error) throw error;
}

/** UPDATE — registrar um lance (atalho). */
export async function placeBid(id: string, bidValue: number): Promise<void> {
  await updateAuction(id, { current_bid: bidValue });
}

/** DELETE — remover leilão (apenas o dono). */
export async function deleteAuction(id: string): Promise<void> {
  const { error } = await supabase.from("auctions").delete().eq("id", id);
  if (error) throw error;
}
