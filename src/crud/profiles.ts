/**
 * ============================================================
 *  CRUD — PERFIS (profiles)
 * ============================================================
 * Operações sobre o perfil público do usuário/lojista.
 *
 *   import { getProfile, updateProfile } from "@/crud/profiles";
 *
 * Tabela: public.profiles
 * Regras (RLS):
 *  - Qualquer pessoa pode LER perfis (são públicos).
 *  - Apenas o próprio usuário pode CRIAR/ATUALIZAR seu perfil.
 *  - O perfil é criado AUTOMATICAMENTE no signup via trigger.
 * ============================================================
 */

import { supabase } from "@/integrations/supabase/client";

export type Profile = {
  id: string;
  display_name: string | null;
  shop_name: string | null;
  created_at: string;
};

/** READ — buscar perfil pelo id do usuário. */
export async function getProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();
  if (error) throw error;
  return data as Profile | null;
}

/** UPDATE — atualizar nome de exibição ou nome da loja. */
export async function updateProfile(
  userId: string,
  patch: Partial<Pick<Profile, "display_name" | "shop_name">>
): Promise<void> {
  const { error } = await supabase.from("profiles").update(patch).eq("id", userId);
  if (error) throw error;
}

/** Helper — nome amigável de um perfil. */
export function displayName(p: Profile | null | undefined): string {
  return p?.shop_name || p?.display_name || "Lojista";
}
