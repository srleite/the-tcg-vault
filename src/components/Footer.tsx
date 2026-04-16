import { Link } from "@tanstack/react-router";
import { siteConfig, games } from "@/config/site";

export function Footer() {
  return (
    <footer className="border-t border-border/40 mt-20">
      <div className="container mx-auto px-4 py-12 grid gap-8 md:grid-cols-4">
        <div>
          <div className="font-display text-xl font-bold text-gradient-gold">
            {siteConfig.name}
          </div>
          <p className="text-sm text-muted-foreground mt-2 max-w-xs">
            {siteConfig.description}
          </p>
        </div>
        <div>
          <h4 className="text-sm font-semibold mb-3 text-gold">Jogos</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {games.slice(0, 4).map((g) => (
              <li key={g.slug}>
                <Link to="/games/$slug" params={{ slug: g.slug }} className="hover:text-gold">
                  {g.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold mb-3 text-gold">Plataforma</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/auctions" className="hover:text-gold">Leilões ativos</Link></li>
            <li><Link to="/about" className="hover:text-gold">Sobre nós</Link></li>
            <li><Link to="/signup" className="hover:text-gold">Vender no CardLab</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold mb-3 text-gold">Contato</h4>
          <p className="text-sm text-muted-foreground">{siteConfig.contactEmail}</p>
        </div>
      </div>
      <div className="border-t border-border/40 py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} {siteConfig.name}. Todos os direitos reservados.
      </div>
    </footer>
  );
}
