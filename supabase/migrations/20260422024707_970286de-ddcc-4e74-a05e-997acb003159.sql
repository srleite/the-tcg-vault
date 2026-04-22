
-- ============================================================
-- FIX: atribuição automática de role no cadastro
-- ============================================================
-- Problema: o INSERT em user_roles era feito do client logo após
-- o signUp, mas nesse momento o usuário ainda não tem sessão
-- ativa, então a política RLS (auth.uid() = user_id) bloqueava
-- silenciosamente a inserção.
--
-- Solução: usar um trigger SECURITY DEFINER que roda no banco,
-- com privilégio elevado, lendo o role do raw_user_meta_data
-- enviado no signUp.
-- ============================================================

-- 1. Atualizar a função handle_new_user para também criar o role
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  user_role public.app_role;
BEGIN
  -- Cria o profile (comportamento existente)
  INSERT INTO public.profiles (id, display_name, shop_name)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'display_name',
    NEW.raw_user_meta_data->>'shop_name'
  );

  -- Atribui o role: lê de raw_user_meta_data->>'role',
  -- com fallback para 'user' se não vier nada válido.
  user_role := COALESCE(
    NULLIF(NEW.raw_user_meta_data->>'role', '')::public.app_role,
    'user'::public.app_role
  );

  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, user_role)
  ON CONFLICT DO NOTHING;

  RETURN NEW;
END;
$function$;

-- 2. Garantir que o trigger existe em auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- 3. Backfill: atribuir role a usuários já cadastrados que estão sem role.
--    Quem tem shop_name no profile vira 'shop'; resto vira 'user'.
INSERT INTO public.user_roles (user_id, role)
SELECT
  p.id,
  CASE WHEN p.shop_name IS NOT NULL AND p.shop_name <> ''
       THEN 'shop'::public.app_role
       ELSE 'user'::public.app_role
  END
FROM public.profiles p
LEFT JOIN public.user_roles ur ON ur.user_id = p.id
WHERE ur.user_id IS NULL
ON CONFLICT DO NOTHING;
