import axios from "../config/axios.js";

export default async function validateIcon(url) {
  try {
    const res = await axios.head(url);
    return res.headers["content-type"]?.startsWith("image/");
  } catch {
    return false;
  }
}
