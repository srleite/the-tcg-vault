import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Layout } from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
} from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { games, getGame } from "@/config/site";
import { searchCards, type CardImage } from "@/lib/cardApi";
import { getOnePieceImageUrl } from "@/lib/onePieceImage";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { Plus, Search, Trash2 } from "lucide-react";

const SUPABASE_HOST = (import.meta.env.VITE_SUPABASE_URL || "")
  .replace(/^https?:\/\//, "")
  .replace(/\/$/, "");

export const Route = createFileRoute("/dashboard")({
  component: DashboardPage,
});

type Auction = {
  id: string;
  game: string;
  card_name: string;
  card_image_url: string | null;
  starting_price: number;
  current_bid: number | null;
  ends_at: string;
};

function DashboardPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [open, setOpen] = useState(false);

  // form state
  const [game, setGame] = useState("magic");
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<CardImage[]>([]);
  const [selected, setSelected] = useState<CardImage | null>(null);
  const [description, setDescription] = useState("");
  const [startingPrice, setStartingPrice] = useState("10");
  const [days, setDays] = useState("3");
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        navigate({ to: "/login" });
        return;
      }
      setUser(data.user);
      loadAuctions(data.user.id);
    });
  }, [navigate]);

  const loadAuctions = async (uid: string) => {
    const { data } = await supabase
      .from("auctions")
      .select("*")
      .eq("shop_id", uid)
      .order("created_at", { ascending: false });
    setAuctions((data as Auction[]) || []);
  };

  const handleSearch = async () => {
    if (!search.trim()) return;
    setSearching(true);
    const g = getGame(game);
    const cards = await searchCards(g?.api ?? "static", search);
    setResults(cards);
    setSearching(false);
  };

  const handleCreate = async () => {
    if (!selected) {
      toast.error("Selecione uma carta primeiro");
      return;
    }
    const endsAt = new Date(Date.now() + parseInt(days) * 86400000).toISOString();
    const { error } = await supabase.from("auctions").insert({
      shop_id: user.id,
      game,
      card_name: selected.name,
      card_image_url: selected.imageUrl,
      description,
      starting_price: parseFloat(startingPrice),
      ends_at: endsAt,
    });
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Leilão criado!");
    setOpen(false);
    setSelected(null);
    setSearch("");
    setResults([]);
    setDescription("");
    loadAuctions(user.id);
  };

  const handleDelete = async (id: string) => {
    await supabase.from("auctions").delete().eq("id", id);
    setAuctions(auctions.filter((a) => a.id !== id));
    toast.success("Leilão removido");
  };

  if (!user) return <Layout><div className="container mx-auto py-16 text-center">Carregando...</div></Layout>;

  return (
    <Layout>
      <Toaster />
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold">Painel da Loja</h1>
            <p className="text-muted-foreground text-sm mt-1">{user.email}</p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gold text-gold-foreground hover:opacity-90">
                <Plus className="h-4 w-4 mr-2" /> Novo leilão
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Criar novo leilão</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Jogo</Label>
                    <Select value={game} onValueChange={setGame}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {games.map((g) => (
                          <SelectItem key={g.slug} value={g.slug}>{g.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Buscar carta</Label>
                    <div className="flex gap-2">
                      <Input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Nome da carta..."
                        onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleSearch())}
                      />
                      <Button type="button" size="icon" onClick={handleSearch} disabled={searching}>
                        <Search className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {results.length > 0 && (
                  <div className="grid grid-cols-4 gap-2 max-h-60 overflow-y-auto p-2 border rounded">
                    {results.map((c, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setSelected(c)}
                        className={`rounded overflow-hidden border-2 transition-all ${
                          selected?.imageUrl === c.imageUrl ? "border-gold" : "border-transparent hover:border-gold/50"
                        }`}
                      >
                        <img src={getOnePieceImageUrl(c.imageUrl)} alt={c.name} className="w-full aspect-[3/4] object-cover" />
                        <div className="text-[10px] truncate p-1">{c.name}</div>
                      </button>
                    ))}
                  </div>
                )}

                {selected && (
                  <div className="flex gap-3 items-center p-3 border border-gold/40 rounded">
                    <img src={getOnePieceImageUrl(selected.imageUrl)} alt={selected.name} className="h-16 w-12 object-cover rounded" />
                    <div className="text-sm"><span className="text-gold">Selecionada:</span> {selected.name}</div>
                  </div>
                )}

                <div>
                  <Label>Descrição</Label>
                  <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Estado, edição, observações..." />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Preço inicial (R$)</Label>
                    <Input type="number" step="0.01" value={startingPrice} onChange={(e) => setStartingPrice(e.target.value)} />
                  </div>
                  <div>
                    <Label>Duração (dias)</Label>
                    <Input type="number" min="1" max="30" value={days} onChange={(e) => setDays(e.target.value)} />
                  </div>
                </div>
                <Button onClick={handleCreate} className="w-full bg-gold text-gold-foreground hover:opacity-90">
                  Publicar leilão
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {auctions.length === 0 ? (
          <Card className="p-12 text-center border-dashed">
            <p className="text-muted-foreground">Você ainda não tem leilões. Crie o primeiro!</p>
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {auctions.map((a) => (
              <Card key={a.id} className="overflow-hidden border-border/60">
                <div className="aspect-[3/4] bg-muted">
                  {a.card_image_url && (
                    <img src={getOnePieceImageUrl(a.card_image_url)} alt={a.card_name} className="w-full h-full object-cover" />
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-display font-semibold truncate">{a.card_name}</h3>
                  <div className="text-xs text-muted-foreground mt-1">
                    {games.find((g) => g.slug === a.game)?.name}
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <div className="text-gold font-semibold">
                      R$ {(a.current_bid ?? a.starting_price).toFixed(2)}
                    </div>
                    <div className="flex gap-1">
                      <Button size="sm" variant="ghost" asChild>
                        <Link to="/auctions/$id" params={{ id: a.id }}>Ver</Link>
                      </Button>
                      <Button size="icon" variant="ghost" onClick={() => handleDelete(a.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
