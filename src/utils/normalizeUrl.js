export default function normalizeUrl(url) {
  return url.startsWith("http") ? url : "https://" + url;
}
