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
import { Gavel, Store, User } from "lucide-react";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<"user" | "shop">("user");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Bem-vindo de volta!");
    navigate({ to: tab === "shop" ? "/dashboard" : "/auctions" });
  };

  return (
    <Layout>
      <Toaster />
      <div className="container mx-auto px-4 py-16 flex justify-center">
        <Card className="w-full max-w-md p-8 border-gold/30 shadow-card">
          <div className="text-center mb-6">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-gold shadow-gold mb-3">
              <Gavel className="h-6 w-6 text-gold-foreground" />
            </div>
            <h1 className="font-display text-2xl font-bold">Entrar no CardLab</h1>
            <p className="text-sm text-muted-foreground mt-1">Acesse sua conta para dar lances ou criar leilões.</p>
          </div>

          <Tabs value={tab} onValueChange={(v) => setTab(v as "user" | "shop")} className="mb-6">
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="user"><User className="h-4 w-4 mr-2" />Usuário</TabsTrigger>
              <TabsTrigger value="shop"><Store className="h-4 w-4 mr-2" />Lojista</TabsTrigger>
            </TabsList>
            <TabsContent value="user" className="text-xs text-muted-foreground mt-3">
              Dê lances em leilões e acompanhe suas cartas favoritas.
            </TabsContent>
            <TabsContent value="shop" className="text-xs text-muted-foreground mt-3">
              Acesse o painel e gerencie seus leilões ativos.
            </TabsContent>
          </Tabs>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <Button type="submit" disabled={loading} className="w-full bg-gold text-gold-foreground hover:opacity-90">
              {loading ? "Entrando..." : "Entrar"}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Não tem conta?{" "}
            <Link to="/signup" className="text-gold hover:underline">Cadastre-se</Link>
          </p>
        </Card>
      </div>
    </Layout>
  );
}
