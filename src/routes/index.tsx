import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { games, siteConfig } from "@/config/site";
import { mockAuctions } from "@/lib/mockAuctions";
import { getOnePieceImageUrl } from "@/lib/onePieceImage";
import { Gavel, ShieldCheck, Sparkles, TrendingUp } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Index,
});

// Cartas que flutuam no hero (puxadas dos mocks para reutilizar arte)
const floatingCards = [
  { src: getOnePieceImageUrl(mockAuctions[0].card_image_url), rotate: -12, x: "5%", y: "10%", delay: 0 },
  { src: getOnePieceImageUrl(mockAuctions[1].card_image_url), rotate: 8, x: "70%", y: "5%", delay: 0.2 },
  { src: getOnePieceImageUrl(mockAuctions[2].card_image_url), rotate: -6, x: "82%", y: "55%", delay: 0.4 },
  { src: getOnePieceImageUrl(mockAuctions[3].card_image_url), rotate: 14, x: "60%", y: "70%", delay: 0.6 },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

function Index() {
  return (
    <Layout>
      {/* Hero */}
      <section className="relative overflow-hidden min-h-[90vh] flex items-center">
        <div className="absolute inset-0 geo-pattern opacity-40" />
        <motion.div
          className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-gold/20 blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-primary/20 blur-3xl"
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.4, 0.2, 0.4] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Cartas flutuantes — escondidas em telas pequenas */}
        <div className="absolute inset-0 pointer-events-none hidden lg:block">
          {floatingCards.map((card, i) => (
            <motion.div
              key={i}
              className="absolute w-40 xl:w-48 aspect-[5/7] rounded-xl overflow-hidden shadow-2xl ring-1 ring-gold/30"
              style={{ left: card.x, top: card.y }}
              initial={{ opacity: 0, y: 60, rotate: card.rotate }}
              animate={{
                opacity: 1,
                y: [0, -15, 0],
                rotate: card.rotate,
              }}
              transition={{
                opacity: { duration: 0.8, delay: card.delay },
                y: {
                  duration: 4 + i,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: card.delay,
                },
              }}
              whileHover={{ scale: 1.1, rotate: 0, zIndex: 10 }}
            >
              <img
                src={card.src}
                alt=""
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </motion.div>
          ))}
        </div>

        <div className="container mx-auto px-4 py-24 md:py-32 relative">
          <motion.div
            className="max-w-3xl"
            initial="hidden"
            animate="visible"
            transition={{ staggerChildren: 0.15 }}
          >
            <motion.div
              variants={fadeUp}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-3 py-1 text-xs uppercase tracking-widest text-gold mb-6"
            >
              <Sparkles className="h-3 w-3 animate-pulse" />
              Leilões em tempo real
            </motion.div>
            <motion.h1
              variants={fadeUp}
              transition={{ duration: 0.7 }}
              className="font-display text-5xl md:text-7xl font-bold leading-tight"
            >
              A casa de leilões de{" "}
              <span className="text-gradient-gold">cartas raras</span>.
            </motion.h1>
            <motion.p
              variants={fadeUp}
              transition={{ duration: 0.7 }}
              className="mt-6 text-lg text-muted-foreground max-w-xl"
            >
              {siteConfig.description}
            </motion.p>
            <motion.div
              variants={fadeUp}
              transition={{ duration: 0.7 }}
              className="mt-8 flex flex-wrap gap-3"
            >
              <Button
                size="lg"
                className="bg-gold text-gold-foreground hover:opacity-90 shadow-gold hover-scale"
                asChild
              >
                <Link to="/auctions">
                  <Gavel className="mr-2 h-5 w-5" /> Ver leilões
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="hover-scale" asChild>
                <Link to="/signup">Vender minhas cartas</Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Faixa de leilões em destaque */}
      <section className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="flex items-end justify-between mb-8"
        >
          <div>
            <h2 className="font-display text-3xl md:text-4xl font-bold">
              Em <span className="text-gradient-gold">destaque</span> agora
            </h2>
            <p className="text-muted-foreground mt-2">
              Cartas com lances ativos. Não perca o arremate.
            </p>
          </div>
          <Button variant="ghost" className="hidden md:inline-flex" asChild>
            <Link to="/auctions">Ver todos →</Link>
          </Button>
        </motion.div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {mockAuctions.slice(0, 4).map((a, i) => (
            <motion.div
              key={a.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -8 }}
            >
              <Link
                to="/auctions/$id"
                params={{ id: a.id }}
                className="block group"
              >
                <Card className="overflow-hidden border-border/60 group-hover:border-gold transition-all shadow-card group-hover:shadow-gold">
                  <div className="aspect-[5/7] overflow-hidden bg-muted">
                    <img
                      src={getOnePieceImageUrl(a.card_image_url)}
                      alt={a.card_name}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <div className="p-4">
                    <div className="text-xs uppercase tracking-widest text-gold/80">
                      {a.game}
                    </div>
                    <h3 className="font-display text-base font-semibold mt-1 line-clamp-1">
                      {a.card_name}
                    </h3>
                    <div className="mt-3 flex items-baseline justify-between">
                      <span className="text-xs text-muted-foreground">Lance atual</span>
                      <span className="font-display text-lg text-gold">
                        R$ {a.current_bid.toLocaleString("pt-BR")}
                      </span>
                    </div>
                  </div>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Games grid */}
      <section className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="flex items-end justify-between mb-8"
        >
          <div>
            <h2 className="font-display text-3xl md:text-4xl font-bold">
              Escolha seu <span className="text-gradient-gold">jogo</span>
            </h2>
            <p className="text-muted-foreground mt-2">
              TCGs com leilões diários.
            </p>
          </div>
        </motion.div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {games.map((g, i) => (
            <motion.div
              key={g.slug}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              whileHover={{ scale: 1.03 }}
            >
              <Link to="/games/$slug" params={{ slug: g.slug }}>
                <Card className="group relative overflow-hidden border-border/60 hover:border-gold transition-all p-6 h-40 cursor-pointer shadow-card">
                  <div
                    className="absolute inset-0 opacity-20 group-hover:opacity-50 transition-opacity duration-500"
                    style={{
                      background: `radial-gradient(circle at top right, ${g.color}, transparent 60%)`,
                    }}
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
                    <div className="text-sm text-gold opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
                      Ver leilões →
                    </div>
                  </div>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              icon: ShieldCheck,
              title: "Lojistas verificados",
              desc: "Apenas vendedores aprovados podem listar leilões.",
            },
            {
              icon: TrendingUp,
              title: "Lances transparentes",
              desc: "Histórico de lances público em cada item.",
            },
            {
              icon: Gavel,
              title: "Encerramento automático",
              desc: "Cronômetro preciso e arremate instantâneo.",
            },
          ].map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <Card className="p-6 border-border/60 h-full hover:border-gold/50 transition-colors">
                <motion.div
                  whileHover={{ rotate: 12, scale: 1.1 }}
                  className="h-10 w-10 rounded-md bg-gold/10 border border-gold/30 flex items-center justify-center mb-4"
                >
                  <f.icon className="h-5 w-5 text-gold" />
                </motion.div>
                <h3 className="font-display text-lg font-semibold">{f.title}</h3>
                <p className="text-sm text-muted-foreground mt-2">{f.desc}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>
    </Layout>
  );
}
