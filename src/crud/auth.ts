/**
 * ============================================================
 *  CRUD — AUTENTICAÇÃO (login, signup, logout, sessão)
 * ============================================================
 * Wrapper sobre supabase.auth para centralizar o fluxo.
 *
 *   import { signUp, signIn, signOut, getCurrentUser } from "@/crud/auth";
 *
 * Tabelas envolvidas:
 *  - auth.users     (gerenciado pelo Supabase)
 *  - public.profiles (criado via trigger)
 *  - public.user_roles ("user" ou "shop")
 * ============================================================
 */

import { supabase } from "@/integrations/supabase/client";

export type Role = "user" | "shop" | "admin";

export type SignUpInput = {
  email: string;
  password: string;
  displayName: string;
  /** Se "shop", também cria registro em user_roles + shop_name. */
  role: Role;
  shopName?: string;
};

/** CREATE — cadastrar novo usuário (lojista ou regular). */
export async function signUp(input: SignUpInput) {
  const { data, error } = await supabase.auth.signUp({
    email: input.email,
    password: input.password,
    options: {
      emailRedirectTo: `${window.location.origin}/`,
      data: {
        display_name: input.displayName,
        shop_name: input.role === "shop" ? input.shopName : null,
      },
    },
  });
  if (error) throw error;

  // Atribui a role escolhida (default da migração é "user")
  if (data.user) {
    await supabase.from("user_roles").insert({
      user_id: data.user.id,
      role: input.role,
    });
  }
  return data;
}

/** LOGIN — autenticar com email/senha. */
export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

/** LOGOUT — encerrar sessão. */
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

/** READ — usuário atualmente logado (ou null). */
export async function getCurrentUser() {
  const { data } = await supabase.auth.getUser();
  return data.user;
}

/** READ — verifica se o usuário tem uma role específica. */
export async function hasRole(userId: string, role: Role): Promise<boolean> {
  const { data, error } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .eq("role", role)
    .maybeSingle();
  if (error) return false;
  return !!data;
}
