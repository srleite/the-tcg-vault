import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Layout } from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { games } from "@/config/site";
import { Store, Package, Clock } from "lucide-react";

export const Route = createFileRoute("/shop/$id")({
  component: ShopProfilePage,
});

type Profile = {
  id: string;
  display_name: string | null;
  shop_name: string | null;
  created_at: string;
};

type Auction = {
  id: string;
  game: string;
  card_name: string;
  card_image_url: string | null;
  current_bid: number | null;
  starting_price: number;
  ends_at: string;
};

function ShopProfilePage() {
  const { id } = Route.useParams();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data: p } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", id)
        .maybeSingle();
      setProfile(p as Profile | null);

      const { data: a } = await supabase
        .from("auctions")
        .select("*")
        .eq("shop_id", id)
        .order("created_at", { ascending: false });
      setAuctions((a as Auction[]) || []);
      setLoading(false);
    })();
  }, [id]);

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto py-16 text-center text-muted-foreground">
          Carregando...
        </div>
      </Layout>
    );
  }

  if (!profile) {
    return (
      <Layout>
        <div className="container mx-auto py-16 text-center">
          <h1 className="font-display text-2xl">Perfil não encontrado</h1>
          <Link to="/auctions" className="text-gold underline mt-4 inline-block">
            Ver todos os leilões
          </Link>
        </div>
      </Layout>
    );
  }

  const shopName = profile.shop_name || profile.display_name || "Lojista";
  const activeAuctions = auctions.filter(
    (a) => new Date(a.ends_at).getTime() > Date.now()
  );
  const memberSince = new Date(profile.created_at).toLocaleDateString("pt-BR", {
    month: "long",
    year: "numeric",
  });

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <Card className="p-8 border-gold/30 shadow-card mb-8 relative overflow-hidden">
          <div className="absolute inset-0 geo-pattern opacity-30 pointer-events-none" />
          <div className="relative flex flex-col sm:flex-row gap-6 items-start sm:items-center">
            <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-gold to-gold/60 flex items-center justify-center text-gold-foreground">
              <Store className="h-10 w-10" />
            </div>
            <div className="flex-1">
              <Badge variant="outline" className="border-gold/40 text-gold mb-2">
                Lojista verificado
              </Badge>
              <h1 className="font-display text-3xl sm:text-4xl font-bold text-gradient-gold">
                {shopName}
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Membro desde {memberSince}
              </p>
              <div className="flex gap-4 mt-3 text-sm">
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <Package className="h-4 w-4 text-gold" />
                  <strong className="text-foreground">{auctions.length}</strong> leilões totais
                </span>
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <Clock className="h-4 w-4 text-gold" />
                  <strong className="text-foreground">{activeAuctions.length}</strong> ativos
                </span>
              </div>
            </div>
          </div>
        </Card>

        {/* Active auctions */}
        <h2 className="font-display text-2xl font-bold mb-4">Leilões ativos</h2>
        {activeAuctions.length === 0 ? (
          <Card className="p-12 text-center border-dashed">
            <p className="text-muted-foreground">
              Este lojista não possui leilões ativos no momento.
            </p>
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {activeAuctions.map((a) => (
              <Link
                key={a.id}
                to="/auctions/$id"
                params={{ id: a.id }}
                className="group"
              >
                <Card className="overflow-hidden border-border/60 hover:border-gold/60 transition-all hover:shadow-card">
                  <div className="aspect-[3/4] bg-muted overflow-hidden">
                    {a.card_image_url && (
                      <img
                        src={a.card_image_url}
                        alt={a.card_name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    )}
                  </div>
                  <div className="p-4">
                    <div className="text-xs text-muted-foreground">
                      {games.find((g) => g.slug === a.game)?.name}
                    </div>
                    <h3 className="font-display font-semibold truncate mt-1">
                      {a.card_name}
                    </h3>
                    <div className="text-gold font-semibold mt-2">
                      R$ {(a.current_bid ?? a.starting_price).toFixed(2)}
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
