export default function reduceDomain(url) {
  const hostname = new URL(url).hostname;
  const parts = hostname.split(".");

  // If there are multiple subdomains, remove only the first one
  // console.firebase.google.com → firebase.google.com
  // mail.google.com → google.com
  if (parts.length > 2) {
    return parts.slice(1).join(".");
  }

  return hostname;
}
