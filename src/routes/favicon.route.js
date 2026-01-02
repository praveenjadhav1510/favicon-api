import express from "express";
import { getFavicon } from "../services/favicon.service.js";
import apiKeyMiddleware from "../middleware/apiKey.js";

const router = express.Router();

router.post("/", apiKeyMiddleware, getFavicon);

export default router;
