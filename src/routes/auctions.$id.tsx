import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Layout } from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { games } from "@/config/site";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { ArrowLeft, Clock, Gavel } from "lucide-react";

export const Route = createFileRoute("/auctions/$id")({
  component: AuctionDetailPage,
});

type Auction = {
  id: string;
  game: string;
  card_name: string;
  card_image_url: string | null;
  description: string | null;
  current_bid: number | null;
  starting_price: number;
  ends_at: string;
  shop_id: string;
};

function AuctionDetailPage() {
  const { id } = Route.useParams();
  const [auction, setAuction] = useState<Auction | null>(null);
  const [shopName, setShopName] = useState<string>("");
  const [bid, setBid] = useState("");
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    supabase.from("auctions").select("*").eq("id", id).single().then(async ({ data }) => {
      if (data) {
        setAuction(data as Auction);
        const { data: profile } = await supabase
          .from("profiles")
          .select("shop_name, display_name")
          .eq("id", data.shop_id)
          .single();
        setShopName(profile?.shop_name || profile?.display_name || "Lojista");
      }
    });
  }, [id]);

  const handleBid = async () => {
    if (!user) {
      toast.error("Faça login para dar lance");
      return;
    }
    if (!auction) return;
    const bidValue = parseFloat(bid);
    const min = (auction.current_bid ?? auction.starting_price) + 1;
    if (isNaN(bidValue) || bidValue < min) {
      toast.error(`Lance mínimo: R$ ${min.toFixed(2)}`);
      return;
    }
    const { error } = await supabase
      .from("auctions")
      .update({ current_bid: bidValue })
      .eq("id", auction.id);
    if (error) {
      toast.error("Não foi possível dar lance");
      return;
    }
    setAuction({ ...auction, current_bid: bidValue });
    setBid("");
    toast.success("Lance registrado!");
  };

  if (!auction) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center text-muted-foreground">
          Carregando...
        </div>
      </Layout>
    );
  }

  const game = games.find((g) => g.slug === auction.game);
  const minBid = (auction.current_bid ?? auction.starting_price) + 1;

  return (
    <Layout>
      <Toaster />
      <div className="container mx-auto px-4 py-8">
        <Link to="/auctions" className="inline-flex items-center text-sm text-muted-foreground hover:text-gold mb-6">
          <ArrowLeft className="h-4 w-4 mr-1" /> Voltar aos leilões
        </Link>

        <div className="grid gap-8 md:grid-cols-2">
          <Card className="overflow-hidden border-gold/30 shadow-card">
            <div className="aspect-[3/4] bg-muted">
              {auction.card_image_url ? (
                <img src={auction.card_image_url} alt={auction.card_name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                  Sem imagem
                </div>
              )}
            </div>
          </Card>

          <div>
            <Badge variant="outline" className="border-gold/40 text-gold">{game?.name ?? auction.game}</Badge>
            <h1 className="font-display text-4xl font-bold mt-3">{auction.card_name}</h1>
            <p className="text-sm text-muted-foreground mt-2">
              Vendido por{" "}
              <Link
                to="/shop/$id"
                params={{ id: auction.shop_id }}
                className="text-gold hover:underline"
              >
                {shopName}
              </Link>
            </p>

            <Card className="p-6 mt-6 border-gold/30">
              <div className="text-xs uppercase tracking-widest text-muted-foreground">Lance atual</div>
              <div className="text-4xl font-display font-bold text-gradient-gold mt-1">
                R$ {(auction.current_bid ?? auction.starting_price).toFixed(2)}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                <Clock className="h-4 w-4" /> Encerra em {timeLeft(auction.ends_at)}
              </div>

              <div className="flex gap-2 mt-6">
                <Input
                  type="number"
                  step="0.01"
                  min={minBid}
                  placeholder={`R$ ${minBid.toFixed(2)} ou mais`}
                  value={bid}
                  onChange={(e) => setBid(e.target.value)}
                />
                <Button onClick={handleBid} className="bg-gold text-gold-foreground hover:opacity-90">
                  <Gavel className="h-4 w-4 mr-2" /> Dar lance
                </Button>
              </div>
            </Card>

            {auction.description && (
              <Card className="p-6 mt-4">
                <h3 className="font-display font-semibold mb-2">Descrição</h3>
                <p className="text-sm text-muted-foreground whitespace-pre-line">{auction.description}</p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

function timeLeft(endsAt: string) {
  const diff = new Date(endsAt).getTime() - Date.now();
  if (diff <= 0) return "encerrado";
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  if (days > 0) return `${days}d ${hours}h`;
  const mins = Math.floor((diff % 3600000) / 60000);
  return `${hours}h ${mins}m`;
}
