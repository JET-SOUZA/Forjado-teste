import fs from "fs";
import path from "path";

export default function handler(req, res) {
  try {
    // Exemplo de uso: /api/fotos?file=thumbs/IMG_0637.jpg
    const { file } = req.query;

    if (!file) {
      return res.status(400).json({ error: "Parâmetro 'file' é obrigatório." });
    }

    // Caminho absoluto até o arquivo dentro de /fotos
    const filePath = path.join(process.cwd(), "fotos", file);

    // Verifica se o arquivo existe
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: "Imagem não encontrada." });
    }

    // Detecta tipo de imagem (jpg, png etc.)
    const ext = path.extname(filePath).toLowerCase();
    const mime =
      ext === ".png"
        ? "image/png"
        : ext === ".webp"
        ? "image/webp"
        : "image/jpeg";

    // Lê e envia o arquivo
    const imageBuffer = fs.readFileSync(filePath);
    res.setHeader("Content-Type", mime);
    res.send(imageBuffer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro interno ao carregar imagem." });
  }
}
