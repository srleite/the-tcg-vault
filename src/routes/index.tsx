import { createFileRoute, Link } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { games, siteConfig } from "@/config/site";
import { Gavel, ShieldCheck, Sparkles, TrendingUp } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <Layout>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 geo-pattern opacity-40" />
        <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-gold/20 blur-3xl" />
        <div className="container mx-auto px-4 py-24 md:py-32 relative">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-3 py-1 text-xs uppercase tracking-widest text-gold mb-6">
              <Sparkles className="h-3 w-3" />
              Leilões em tempo real
            </div>
            <h1 className="font-display text-5xl md:text-7xl font-bold leading-tight">
              A casa de leilões de{" "}
              <span className="text-gradient-gold">cartas raras</span>.
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-xl">
              {siteConfig.description}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button size="lg" className="bg-gold text-gold-foreground hover:opacity-90 shadow-gold" asChild>
                <Link to="/auctions">
                  <Gavel className="mr-2 h-5 w-5" /> Ver leilões
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/signup">Vender minhas cartas</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Games grid */}
      <section className="container mx-auto px-4 py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="font-display text-3xl md:text-4xl font-bold">
              Escolha seu <span className="text-gradient-gold">jogo</span>
            </h2>
            <p className="text-muted-foreground mt-2">
              Mais de 6 TCGs com leilões diários.
            </p>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {games.map((g) => (
            <Link key={g.slug} to="/games/$slug" params={{ slug: g.slug }}>
              <Card className="group relative overflow-hidden border-border/60 hover:border-gold transition-all p-6 h-40 cursor-pointer shadow-card">
                <div
                  className="absolute inset-0 opacity-20 group-hover:opacity-40 transition-opacity"
                  style={{ background: `radial-gradient(circle at top right, ${g.color}, transparent 60%)` }}
                />
                <div className="relative h-full flex flex-col justify-between">
                  <div>
                    <div className="text-xs uppercase tracking-widest text-gold/80">
                      {g.tagline}
                    </div>
                    <h3 className="font-display text-xl font-semibold mt-1">
                      {g.name}
                    </h3>
                  </div>
                  <div className="text-sm text-gold opacity-0 group-hover:opacity-100 transition-opacity">
                    Ver leilões →
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { icon: ShieldCheck, title: "Lojistas verificados", desc: "Apenas vendedores aprovados podem listar leilões." },
            { icon: TrendingUp, title: "Lances transparentes", desc: "Histórico de lances público em cada item." },
            { icon: Gavel, title: "Encerramento automático", desc: "Cronômetro preciso e arremate instantâneo." },
          ].map((f) => (
            <Card key={f.title} className="p-6 border-border/60">
              <div className="h-10 w-10 rounded-md bg-gold/10 border border-gold/30 flex items-center justify-center mb-4">
                <f.icon className="h-5 w-5 text-gold" />
              </div>
              <h3 className="font-display text-lg font-semibold">{f.title}</h3>
              <p className="text-sm text-muted-foreground mt-2">{f.desc}</p>
            </Card>
          ))}
        </div>
      </section>
    </Layout>
  );
}
