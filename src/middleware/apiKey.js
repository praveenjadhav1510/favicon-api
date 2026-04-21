// Support multiple keys: API_KEY=key1,key2,key3
const VALID_KEYS = new Set(
  (process.env.API_KEY || "")
    .split(",")
    .map((k) => k.trim())
    .filter(Boolean)
);

export default function apiKeyMiddleware(req, res, next) {
  const apiKey = req.headers["x-api-key"] || req.query["x-api-key"];

  if (!apiKey || !VALID_KEYS.has(apiKey)) {
    return res.status(401).json({
      success: false,
      message: "Invalid or missing API key",
    });
  }

  next();
}
