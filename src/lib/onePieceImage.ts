export function getOnePieceImageUrl(src: string | null | undefined) {
  if (!src) return src ?? "";
  if (!src.includes("onepiece-cardgame.com")) return src;
  return `/api/onepiece-image?src=${encodeURIComponent(src)}`;
}
