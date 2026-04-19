import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Layout } from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { games } from "@/config/site";
import { mockAuctions } from "@/lib/mockAuctions";
import { getOnePieceImageUrl } from "@/lib/onePieceImage";
import { Clock, Gavel } from "lucide-react";

type SearchParams = { game?: string };

export const Route = createFileRoute("/auctions")({
  validateSearch: (search: Record<string, unknown>): SearchParams => ({
    game: typeof search.game === "string" ? search.game : undefined,
  }),
  component: AuctionsPage,
});

type Auction = {
  id: string;
  game: string;
  card_name: string;
  card_image_url: string | null;
  current_bid: number | null;
  starting_price: number;
  ends_at: string;
};

function AuctionsPage() {
  const { game: gameFilter } = Route.useSearch();
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let q = supabase.from("auctions").select("*").order("created_at", { ascending: false });
    if (gameFilter) q = q.eq("game", gameFilter);
    q.then(({ data }) => {
      const real = (data as Auction[]) || [];
      const mocks: Auction[] = mockAuctions
        .filter((m) => !gameFilter || m.game === gameFilter)
        .map((m) => ({
          id: m.id,
          game: m.game,
          card_name: m.card_name,
          card_image_url: m.card_image_url,
          current_bid: m.current_bid,
          starting_price: m.starting_price,
          ends_at: m.ends_at,
        }));
      setAuctions([...real, ...mocks]);
      setLoading(false);
    });
  }, [gameFilter]);

  return (
    <Layout>
      <section className="border-b border-border/40">
        <div className="container mx-auto px-4 py-12">
          <h1 className="font-display text-4xl font-bold">
            <span className="text-gradient-gold">Leilões</span> ativos
          </h1>
          <p className="text-muted-foreground mt-2">
            {auctions.length}{" "}
            {auctions.length === 1 ? "leilão disponível" : "leilões disponíveis"}
          </p>
          <div className="flex flex-wrap gap-2 mt-6">
            <Link
              to="/auctions"
              className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                !gameFilter ? "bg-gold text-gold-foreground border-gold" : "border-border hover:border-gold"
              }`}
            >
              Todos
            </Link>
            {games.map((g) => (
              <Link
                key={g.slug}
                to="/auctions"
                search={{ game: g.slug }}
                className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                  gameFilter === g.slug ? "bg-gold text-gold-foreground border-gold" : "border-border hover:border-gold"
                }`}
              >
                {g.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12">
        {loading ? (
          <p className="text-muted-foreground text-center">Carregando...</p>
        ) : auctions.length === 0 ? (
          <Card className="p-12 text-center border-dashed">
            <Gavel className="h-10 w-10 text-gold mx-auto mb-3" />
            <h3 className="font-display text-xl font-semibold">Nenhum leilão ainda</h3>
            <p className="text-muted-foreground text-sm mt-2">
              Seja o primeiro lojista a listar uma carta.
            </p>
            <Button asChild className="mt-4 bg-gold text-gold-foreground hover:opacity-90">
              <Link to="/dashboard">Criar leilão</Link>
            </Button>
          </Card>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {auctions.map((a) => (
              <Link key={a.id} to="/auctions/$id" params={{ id: a.id }}>
                <Card className="overflow-hidden border-border/60 hover:border-gold transition-all shadow-card cursor-pointer group">
                  <div className="aspect-[3/4] bg-muted overflow-hidden relative">
                    {a.card_image_url ? (
                      <img
                        src={getOnePieceImageUrl(a.card_image_url)}
                        alt={a.card_name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                        Sem imagem
                      </div>
                    )}
                    <Badge className="absolute top-2 left-2 bg-background/80 backdrop-blur text-foreground border-gold/40">
                      {games.find((g) => g.slug === a.game)?.name ?? a.game}
                    </Badge>
                  </div>
                  <div className="p-4">
                    <h3 className="font-display font-semibold truncate">{a.card_name}</h3>
                    <div className="flex items-center justify-between mt-3">
                      <div>
                        <div className="text-xs text-muted-foreground">Lance atual</div>
                        <div className="text-gold font-semibold">
                          R$ {(a.current_bid ?? a.starting_price).toFixed(2)}
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {timeLeft(a.ends_at)}
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </section>
    </Layout>
  );
}

function timeLeft(endsAt: string) {
  const diff = new Date(endsAt).getTime() - Date.now();
  if (diff <= 0) return "Encerrado";
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  if (days > 0) return `${days}d ${hours}h`;
  const mins = Math.floor((diff % 3600000) / 60000);
  return `${hours}h ${mins}m`;
}
