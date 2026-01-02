export default function scoreIcon({ rel, sizes, href }) {
  let score = 0;

  if (rel.includes("apple")) score += 40;
  if (rel === "icon") score += 50;

  if (sizes) {
    const max = Math.max(...sizes.split("x").map(Number));
    score += max || 16;
  }

  if (href.endsWith(".svg")) score += 30;
  if (href.endsWith(".png")) score += 20;
  if (href.endsWith(".ico")) score += 10;

  return score;
}
