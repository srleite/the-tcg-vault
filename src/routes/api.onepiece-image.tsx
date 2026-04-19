import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/onepiece-image")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const src = url.searchParams.get("src");

        if (!src) {
          return new Response("Missing src", { status: 400 });
        }

        let parsed: URL;
        try {
          parsed = new URL(src);
        } catch {
          return new Response("Invalid src", { status: 400 });
        }

        if (parsed.hostname !== "en.onepiece-cardgame.com") {
          return new Response("Forbidden host", { status: 403 });
        }

        const upstream = await fetch(parsed.toString(), {
          headers: {
            Accept: "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
            Referer: "https://en.onepiece-cardgame.com/",
            "User-Agent": "Mozilla/5.0",
          },
        });

        if (!upstream.ok) {
          return new Response("Image fetch failed", { status: upstream.status });
        }

        const headers = new Headers();
        headers.set("Content-Type", upstream.headers.get("Content-Type") ?? "image/png");
        headers.set("Cache-Control", "public, max-age=86400, s-maxage=86400");

        return new Response(upstream.body, {
          status: 200,
          headers,
        });
      },
    },
  },
});
