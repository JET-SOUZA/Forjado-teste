import fs from "fs";
import path from "path";

export default async function handler(req, res) {
  const { file } = req.query;
  if (!file) {
    return res.status(400).send("Parâmetro 'file' é obrigatório");
  }

  try {
    const filePath = path.join(process.cwd(), "fotos", file);
    if (!fs.existsSync(filePath)) {
      return res.status(404).send("Arquivo não encontrado");
    }

    const imageBuffer = fs.readFileSync(filePath);
    const ext = path.extname(filePath).toLowerCase();
    const contentType =
      ext === ".jpg" || ext === ".jpeg"
        ? "image/jpeg"
        : ext === ".png"
        ? "image/png"
        : "application/octet-stream";

    res.setHeader("Content-Type", contentType);
    res.send(imageBuffer);
  } catch (error) {
    console.error("Erro ao servir imagem:", error);
    res.status(500).send("Erro interno do servidor");
  }
}
