import { createFileRoute, Link } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { games } from "@/config/site";

export const Route = createFileRoute("/games/$slug")({
  component: GamePage,
  notFoundComponent: () => (
    <Layout>
      <div className="container mx-auto px-4 py-16 text-center">Jogo não encontrado.</div>
    </Layout>
  ),
});

function GamePage() {
  const { slug } = Route.useParams();
  const game = games.find((g) => g.slug === slug);
  if (!game) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">Jogo não encontrado.</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <section
        className="relative overflow-hidden border-b border-border/40"
        style={{
          background: `linear-gradient(135deg, ${game.color}, oklch(0.18 0.07 295))`,
        }}
      >
        <div className="absolute inset-0 geo-pattern opacity-30" />
        <div className="container mx-auto px-4 py-20 relative">
          <div className="text-xs uppercase tracking-widest text-gold mb-2">{game.tagline}</div>
          <h1 className="font-display text-4xl md:text-6xl font-bold">{game.name}</h1>
          <p className="text-muted-foreground mt-4 max-w-xl">
            Explore leilões ativos de {game.name}, descubra raridades e acompanhe lances em tempo real.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12">
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="p-6 border-gold/30">
            <h3 className="font-display text-lg font-semibold text-gold">Em destaque</h3>
            <p className="text-sm text-muted-foreground mt-2">
              Cartas mais visualizadas das últimas 24h.
            </p>
            <Link to="/auctions" search={{ game: game.slug }} className="text-sm text-gold mt-4 inline-block hover:underline">
              Ver tudo →
            </Link>
          </Card>
          <Card className="p-6 border-gold/30">
            <h3 className="font-display text-lg font-semibold text-gold">Encerrando hoje</h3>
            <p className="text-sm text-muted-foreground mt-2">
              Últimas chances para arrematar.
            </p>
            <Link to="/auctions" search={{ game: game.slug }} className="text-sm text-gold mt-4 inline-block hover:underline">
              Ver tudo →
            </Link>
          </Card>
          <Card className="p-6 border-gold/30">
            <h3 className="font-display text-lg font-semibold text-gold">Recém-listadas</h3>
            <p className="text-sm text-muted-foreground mt-2">
              Os leilões mais novos da plataforma.
            </p>
            <Link to="/auctions" search={{ game: game.slug }} className="text-sm text-gold mt-4 inline-block hover:underline">
              Ver tudo →
            </Link>
          </Card>
        </div>

        <div className="mt-12">
          <h2 className="font-display text-2xl font-bold mb-6">Outros jogos</h2>
          <div className="flex flex-wrap gap-2">
            {games.filter((g) => g.slug !== slug).map((g) => (
              <Link
                key={g.slug}
                to="/games/$slug"
                params={{ slug: g.slug }}
                className="px-4 py-2 rounded-full border border-border hover:border-gold hover:text-gold transition-colors text-sm"
              >
                {g.name}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
