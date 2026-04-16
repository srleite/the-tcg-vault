import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { Store, User } from "lucide-react";

export const Route = createFileRoute("/signup")({
  component: SignupPage,
});

function SignupPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<"user" | "shop">("user");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [shopName, setShopName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const meta: Record<string, string> = { display_name: name };
    if (tab === "shop") meta.shop_name = shopName;

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: meta,
        emailRedirectTo: `${window.location.origin}/`,
      },
    });

    if (error) {
      setLoading(false);
      toast.error(error.message);
      return;
    }

    if (data.user) {
      // assign role
      await supabase.from("user_roles").insert({
        user_id: data.user.id,
        role: tab === "shop" ? "shop" : "user",
      });
    }

    setLoading(false);
    toast.success("Conta criada! Você já pode entrar.");
    navigate({ to: tab === "shop" ? "/dashboard" : "/auctions" });
  };

  return (
    <Layout>
      <Toaster />
      <div className="container mx-auto px-4 py-16 flex justify-center">
        <Card className="w-full max-w-md p-8 border-gold/30 shadow-card">
          <h1 className="font-display text-2xl font-bold text-center">Criar conta</h1>
          <p className="text-sm text-muted-foreground text-center mt-1 mb-6">
            Escolha seu tipo de conta para começar.
          </p>

          <Tabs value={tab} onValueChange={(v) => setTab(v as "user" | "shop")} className="mb-6">
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="user"><User className="h-4 w-4 mr-2" />Usuário</TabsTrigger>
              <TabsTrigger value="shop"><Store className="h-4 w-4 mr-2" />Lojista</TabsTrigger>
            </TabsList>
          </Tabs>

          <form onSubmit={handleSignup} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome</Label>
              <Input id="name" required value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            {tab === "shop" && (
              <div className="space-y-2">
                <Label htmlFor="shopName">Nome da loja</Label>
                <Input id="shopName" required value={shopName} onChange={(e) => setShopName(e.target.value)} />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input id="password" type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <Button type="submit" disabled={loading} className="w-full bg-gold text-gold-foreground hover:opacity-90">
              {loading ? "Criando..." : "Criar conta"}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Já tem conta?{" "}
            <Link to="/login" className="text-gold hover:underline">Entrar</Link>
          </p>
        </Card>
      </div>
    </Layout>
  );
}
