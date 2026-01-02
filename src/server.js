import express from "express";
import faviconRoute from "./routes/favicon.route.js";

const app = express();
app.use(express.json());

app.use("/api/favicon", faviconRoute);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🔥 Favicon API running on port ${PORT}`);
});
