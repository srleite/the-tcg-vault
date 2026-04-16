import { createFileRoute, Link } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";

export const Route = createFileRoute("/about")({
  component: AboutPage,
});

function AboutPage() {
  return (
    <Layout>
      <section className="container mx-auto px-4 py-16 max-w-3xl">
        <div className="text-xs uppercase tracking-widest text-gold mb-3">Sobre nós</div>
        <h1 className="font-display text-4xl md:text-5xl font-bold">
          Onde colecionadores encontram <span className="text-gradient-gold">tesouros</span>.
        </h1>
        <p className="text-lg text-muted-foreground mt-6">
          {siteConfig.name} é uma casa de leilões dedicada a card games colecionáveis. Conectamos
          lojistas verificados a uma comunidade global de jogadores e investidores apaixonados.
        </p>

        <div className="grid gap-4 sm:grid-cols-2 mt-10">
          <Card className="p-6 border-gold/30">
            <h3 className="font-display text-lg font-semibold text-gold">Nossa missão</h3>
            <p className="text-sm text-muted-foreground mt-2">
              Tornar o mercado de TCGs mais transparente, justo e acessível para todos.
            </p>
          </Card>
          <Card className="p-6 border-gold/30">
            <h3 className="font-display text-lg font-semibold text-gold">Nossos valores</h3>
            <p className="text-sm text-muted-foreground mt-2">
              Confiança, precisão e paixão por cada carta que passa por aqui.
            </p>
          </Card>
        </div>

        <div className="mt-10 flex gap-3">
          <Button className="bg-gold text-gold-foreground hover:opacity-90" asChild>
            <Link to="/auctions">Ver leilões</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/signup">Criar conta</Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
}
