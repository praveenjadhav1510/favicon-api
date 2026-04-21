import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import faviconRoute from "./routes/favicon.route.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors()); // Enable CORS for all routes (important for live APIs)
app.use(express.json());

app.use("/api/favicon", faviconRoute);

// Serve static homepage from /public
app.use(express.static(path.join(__dirname, "../public")));

const PORT = process.env.PORT || 3000;

// Only listen if we are not in a serverless environment
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`🔥 Favicon API running locally on port ${PORT}`);
  });
}

export default app;
