import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.static(path.join(__dirname, "../public")));

app.get("/health", (_, res) => {
  res.json({ status: "ok" });
});

app.listen(PORT, () => {
  console.log(`WhoLiked style game listening on port ${PORT}`);
});
