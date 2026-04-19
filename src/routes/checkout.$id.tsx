import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Layout } from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { games } from "@/config/site";
import { getMockAuction, isMockId } from "@/lib/mockAuctions";
import { getOnePieceImageUrl } from "@/lib/onePieceImage";
import {
  ArrowLeft,
  ShieldCheck,
  Truck,
  Lock,
  CreditCard,
  QrCode,
  Trophy,
  TrendingUp,
  CheckCircle2,
  Package,
} from "lucide-react";

export const Route = createFileRoute("/checkout/$id")({
  component: CheckoutPage,
  head: () => ({
    meta: [
      { title: "Finalizar compra — CardLab" },
      {
        name: "description",
        content: "Finalize a compra da sua carta arrematada com segurança.",
      },
    ],
  }),
});

function CheckoutPage() {
  const { id } = Route.useParams();
  const auction = useMemo(() => (isMockId(id) ? getMockAuction(id) : null), [id]);
  const [payment, setPayment] = useState<"pix" | "card">("pix");
  const [shipping, setShipping] = useState<"sedex" | "pac" | "retirada">("sedex");
  const [step, setStep] = useState<"form" | "success">("form");

  if (!auction) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <p className="text-muted-foreground">Leilão não encontrado.</p>
          <Link to="/auctions" className="text-gold hover:underline mt-4 inline-block">
            Voltar aos leilões
          </Link>
        </div>
      </Layout>
    );
  }

  const game = games.find((g) => g.slug === auction.game);
  const finalBid = auction.current_bid ?? auction.starting_price;
  const buyerFee = finalBid * 0.05;
  const shippingCost = shipping === "retirada" ? 0 : shipping === "sedex" ? 49.9 : 28.5;
  const total = finalBid + buyerFee + shippingCost;

  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    setStep("success");
    toast.success("Pedido confirmado!");
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (step === "success") {
    return (
      <Layout>
        <Toaster />
        <div className="container mx-auto px-4 py-16 max-w-2xl text-center">
          <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-gold/10 border border-gold/30 mb-6">
            <CheckCircle2 className="h-10 w-10 text-gold" />
          </div>
          <h1 className="font-display text-4xl font-bold">Pedido confirmado!</h1>
          <p className="text-muted-foreground mt-3">
            Você arrematou <span className="text-gold font-semibold">{auction.card_name}</span>.
            Em instantes você receberá os dados de pagamento por email.
          </p>
          <Card className="p-6 mt-8 text-left border-gold/30">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Package className="h-4 w-4" /> Número do pedido
            </div>
            <div className="font-mono text-lg mt-1">#CL-2025-{auction.id.slice(-6).toUpperCase()}</div>
            <Separator className="my-4" />
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Total pago</span>
              <span className="font-semibold text-gold">
                R$ {total.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </span>
            </div>
          </Card>
          <div className="flex gap-3 justify-center mt-8">
            <Link to="/auctions">
              <Button variant="outline" className="border-gold/40">Ver mais leilões</Button>
            </Link>
            <Link to="/dashboard">
              <Button className="bg-gold text-gold-foreground hover:opacity-90">
                Meus pedidos
              </Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Toaster />
      <div className="container mx-auto px-4 py-8">
        <Link
          to="/auctions/$id"
          params={{ id: auction.id }}
          className="inline-flex items-center text-sm text-muted-foreground hover:text-gold mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-1" /> Voltar ao leilão
        </Link>

        <div className="flex items-center gap-3 mb-8">
          <Trophy className="h-7 w-7 text-gold" />
          <div>
            <h1 className="font-display text-3xl md:text-4xl font-bold">Finalizar arremate</h1>
            <p className="text-sm text-muted-foreground">
              Você venceu este leilão. Conclua o pagamento para receber sua carta.
            </p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
          {/* COLUNA ESQUERDA — formulário */}
          <form onSubmit={handleConfirm} className="space-y-6">
            {/* Card resumo do item */}
            <Card className="p-5 border-gold/30 bg-gradient-to-br from-card to-card/50">
              <div className="flex gap-4">
                <div className="h-32 w-24 shrink-0 overflow-hidden rounded-md border border-gold/20 bg-muted">
                  {auction.card_image_url ? (
                    <img
                      src={getOnePieceImageUrl(auction.card_image_url)}
                      alt={auction.card_name}
                      className="h-full w-full object-cover"
                    />
                  ) : null}
                </div>
                <div className="flex-1 min-w-0">
                  <Badge variant="outline" className="border-gold/40 text-gold text-xs">
                    {game?.name ?? auction.game}
                  </Badge>
                  <h2 className="font-display text-xl font-bold mt-2 truncate">
                    {auction.card_name}
                  </h2>
                  <p className="text-xs text-muted-foreground mt-1">
                    Vendido por <span className="text-gold">{auction.shop_name}</span>
                  </p>
                  <div className="mt-3 inline-flex items-center gap-2 rounded-md bg-gold/10 border border-gold/30 px-2.5 py-1">
                    <Trophy className="h-3.5 w-3.5 text-gold" />
                    <span className="text-xs font-semibold text-gold">Lance vencedor</span>
                    <span className="text-xs font-bold text-foreground">
                      R$ {finalBid.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Endereço */}
            <Card className="p-6">
              <h3 className="font-display text-lg font-semibold mb-4 flex items-center gap-2">
                <Truck className="h-5 w-5 text-gold" /> Endereço de entrega
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <Label htmlFor="name">Nome completo</Label>
                  <Input id="name" defaultValue="João da Silva" required className="mt-1.5" />
                </div>
                <div>
                  <Label htmlFor="cep">CEP</Label>
                  <Input id="cep" defaultValue="01310-100" required className="mt-1.5" />
                </div>
                <div>
                  <Label htmlFor="city">Cidade / UF</Label>
                  <Input id="city" defaultValue="São Paulo, SP" required className="mt-1.5" />
                </div>
                <div className="sm:col-span-2">
                  <Label htmlFor="address">Endereço</Label>
                  <Input
                    id="address"
                    defaultValue="Av. Paulista, 1578, Apto 92"
                    required
                    className="mt-1.5"
                  />
                </div>
              </div>
            </Card>

            {/* Frete */}
            <Card className="p-6">
              <h3 className="font-display text-lg font-semibold mb-4">Forma de envio</h3>
              <RadioGroup
                value={shipping}
                onValueChange={(v) => setShipping(v as typeof shipping)}
                className="space-y-2"
              >
                <ShippingOption
                  value="sedex"
                  title="Sedex (2 a 4 dias úteis)"
                  desc="Com seguro e rastreio"
                  price={49.9}
                />
                <ShippingOption
                  value="pac"
                  title="PAC (5 a 9 dias úteis)"
                  desc="Com seguro e rastreio"
                  price={28.5}
                />
                <ShippingOption
                  value="retirada"
                  title="Retirada na loja"
                  desc="Disponível em 24h em São Paulo"
                  price={0}
                />
              </RadioGroup>
            </Card>

            {/* Pagamento */}
            <Card className="p-6">
              <h3 className="font-display text-lg font-semibold mb-4 flex items-center gap-2">
                <Lock className="h-5 w-5 text-gold" /> Pagamento
              </h3>
              <RadioGroup
                value={payment}
                onValueChange={(v) => setPayment(v as typeof payment)}
                className="grid gap-3 sm:grid-cols-2 mb-5"
              >
                <PaymentOption value="pix" icon={QrCode} title="PIX" badge="5% OFF" />
                <PaymentOption value="card" icon={CreditCard} title="Cartão de crédito" badge="até 12x" />
              </RadioGroup>

              {payment === "card" && (
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <Label htmlFor="card-number">Número do cartão</Label>
                    <Input
                      id="card-number"
                      placeholder="0000 0000 0000 0000"
                      defaultValue="4532 1234 5678 9012"
                      className="mt-1.5 font-mono"
                    />
                  </div>
                  <div>
                    <Label htmlFor="card-exp">Validade</Label>
                    <Input id="card-exp" placeholder="MM/AA" defaultValue="12/28" className="mt-1.5" />
                  </div>
                  <div>
                    <Label htmlFor="card-cvv">CVV</Label>
                    <Input id="card-cvv" placeholder="123" defaultValue="847" className="mt-1.5" />
                  </div>
                </div>
              )}

              {payment === "pix" && (
                <div className="rounded-lg border border-gold/30 bg-gold/5 p-4 text-sm">
                  <div className="flex items-start gap-3">
                    <QrCode className="h-5 w-5 text-gold mt-0.5" />
                    <div>
                      <p className="font-semibold">Pague com PIX e ganhe 5% de desconto</p>
                      <p className="text-muted-foreground text-xs mt-1">
                        Após confirmar, você receberá o QR Code. O pagamento é instantâneo.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </Card>
          </form>

          {/* COLUNA DIREITA — sticky resumo + lances */}
          <aside className="space-y-4 lg:sticky lg:top-6 lg:self-start">
            {/* Resumo do pedido */}
            <Card className="p-6 border-gold/30 shadow-card">
              <h3 className="font-display text-lg font-semibold mb-4">Resumo do pedido</h3>
              <div className="space-y-2.5 text-sm">
                <Row label="Lance vencedor" value={finalBid} />
                <Row label="Taxa do marketplace (5%)" value={buyerFee} muted />
                <Row
                  label={shipping === "retirada" ? "Frete (retirada)" : "Frete"}
                  value={shippingCost}
                  muted
                  highlight={shippingCost === 0 ? "Grátis" : undefined}
                />
              </div>
              <Separator className="my-4" />
              <div className="flex items-baseline justify-between">
                <span className="text-sm text-muted-foreground">Total</span>
                <span className="font-display text-3xl font-bold text-gradient-gold">
                  R$ {total.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </span>
              </div>
              {payment === "card" && (
                <p className="text-xs text-muted-foreground text-right mt-1">
                  ou 12x de R$ {(total / 12).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </p>
              )}

              <Button
                onClick={handleConfirm}
                className="w-full mt-5 bg-gold text-gold-foreground hover:opacity-90 h-11 text-base font-semibold"
              >
                <Lock className="h-4 w-4 mr-2" /> Confirmar e pagar
              </Button>

              <div className="flex items-center justify-center gap-1.5 mt-3 text-xs text-muted-foreground">
                <ShieldCheck className="h-3.5 w-3.5 text-gold" />
                Pagamento protegido pelo CardLab
              </div>
            </Card>

            {/* Histórico de lances */}
            <Card className="p-5 border-border/60">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="h-4 w-4 text-gold" />
                <h3 className="font-display font-semibold text-sm">Disputa do leilão</h3>
                <Badge variant="outline" className="ml-auto text-xs">
                  {auction.bids.length} lances
                </Badge>
              </div>
              <ul className="space-y-2">
                {auction.bids.map((b, i) => (
                  <li
                    key={i}
                    className={`flex items-center justify-between text-sm rounded-md px-2.5 py-2 ${
                      i === 0 ? "bg-gold/10 border border-gold/30" : "bg-muted/40"
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span
                        className={`h-2 w-2 rounded-full shrink-0 ${
                          i === 0 ? "bg-gold" : "bg-muted-foreground/40"
                        }`}
                      />
                      <span className="font-medium truncate">@{b.user}</span>
                      {i === 0 && (
                        <Badge className="bg-gold/20 text-gold border-0 text-[10px] px-1.5 py-0">
                          Você
                        </Badge>
                      )}
                    </div>
                    <span
                      className={`shrink-0 ml-2 ${
                        i === 0 ? "text-gold font-semibold" : "text-foreground"
                      }`}
                    >
                      R$ {b.amount.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </span>
                  </li>
                ))}
              </ul>
            </Card>

            {/* Garantias */}
            <Card className="p-4">
              <ul className="space-y-2.5 text-xs text-muted-foreground">
                <li className="flex items-center gap-2">
                  <ShieldCheck className="h-3.5 w-3.5 text-gold shrink-0" />
                  Autenticidade verificada pelo lojista
                </li>
                <li className="flex items-center gap-2">
                  <Truck className="h-3.5 w-3.5 text-gold shrink-0" />
                  Embalagem reforçada com seguro
                </li>
                <li className="flex items-center gap-2">
                  <Lock className="h-3.5 w-3.5 text-gold shrink-0" />
                  Reembolso garantido em até 7 dias
                </li>
              </ul>
            </Card>
          </aside>
        </div>
      </div>
    </Layout>
  );
}

function Row({
  label,
  value,
  muted,
  highlight,
}: {
  label: string;
  value: number;
  muted?: boolean;
  highlight?: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className={muted ? "text-muted-foreground" : ""}>{label}</span>
      {highlight ? (
        <span className="text-gold font-semibold">{highlight}</span>
      ) : (
        <span className={muted ? "text-muted-foreground" : "font-medium"}>
          R$ {value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
        </span>
      )}
    </div>
  );
}

function ShippingOption({
  value,
  title,
  desc,
  price,
}: {
  value: string;
  title: string;
  desc: string;
  price: number;
}) {
  return (
    <label
      htmlFor={`ship-${value}`}
      className="flex items-center gap-3 rounded-lg border border-border/60 p-3 cursor-pointer hover:border-gold/40 has-[[data-state=checked]]:border-gold has-[[data-state=checked]]:bg-gold/5 transition"
    >
      <RadioGroupItem value={value} id={`ship-${value}`} />
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium">{title}</div>
        <div className="text-xs text-muted-foreground">{desc}</div>
      </div>
      <div className="text-sm font-semibold shrink-0">
        {price === 0 ? (
          <span className="text-gold">Grátis</span>
        ) : (
          <>R$ {price.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</>
        )}
      </div>
    </label>
  );
}

function PaymentOption({
  value,
  icon: Icon,
  title,
  badge,
}: {
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  badge: string;
}) {
  return (
    <label
      htmlFor={`pay-${value}`}
      className="flex items-center gap-3 rounded-lg border border-border/60 p-3 cursor-pointer hover:border-gold/40 has-[[data-state=checked]]:border-gold has-[[data-state=checked]]:bg-gold/5 transition"
    >
      <RadioGroupItem value={value} id={`pay-${value}`} />
      <Icon className="h-5 w-5 text-gold" />
      <div className="flex-1">
        <div className="text-sm font-medium">{title}</div>
      </div>
      <Badge variant="outline" className="border-gold/40 text-gold text-[10px]">
        {badge}
      </Badge>
    </label>
  );
}
