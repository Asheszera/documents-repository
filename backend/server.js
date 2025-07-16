const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const sqlite3 = require("sqlite3").verbose();
const gerarResumoDoConteudo = require("./gerarResumoDoConteudo");

const app = express();
app.use(cors());
app.use("/files", express.static(path.join(__dirname, "upload")));

// Garante que a pasta upload existe
const uploadDir = path.join(__dirname, "upload");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

// Configura armazenamento dos arquivos
const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, uploadDir),
  filename: (_, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({ storage });

// Conecta ao SQLite
const db = new sqlite3.Database(path.join(__dirname, "db.sqlite"));
db.run(`CREATE TABLE IF NOT EXISTS files (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  path TEXT,
  type TEXT,
  size INTEGER
)`);

// 📤 Upload de arquivos
app.post("/upload", upload.array("files"), (req, res) => {
  const files = req.files;
  files.forEach((file) => {
    db.run(`INSERT INTO files (name, path, type, size) VALUES (?, ?, ?, ?)`, [
      file.originalname,
      file.filename,
      file.mimetype,
      file.size,
    ]);
  });
  res.json({ message: "Arquivos enviados com sucesso!", files });
});

// 📄 Listar arquivos
app.get("/list", (_, res) => {
  db.all(`SELECT * FROM files ORDER BY id DESC`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err });
    res.json(rows);
  });
});

const gerarDescricaoDaImagem = require("./gerarDescricaoDaImagem"); // importa

app.post("/summarize/:id", async (req, res) => {
  const fileId = req.params.id;

  db.get(`SELECT * FROM files WHERE id = ?`, [fileId], async (err, file) => {
    if (err || !file)
      return res.status(404).json({ error: "Arquivo não encontrado" });

    const caminhoCompleto = path.join(uploadDir, file.path);
    const resumo = await gerarResumoDoConteudo(caminhoCompleto);
    res.json({ descricao: resumo });
  });
});

// 🗑️ Remover arquivo
app.delete("/file/:id", (req, res) => {
  const id = req.params.id;
  db.get(`SELECT * FROM files WHERE id = ?`, [id], (err, file) => {
    if (err || !file)
      return res.status(404).json({ error: "Arquivo não encontrado." });

    const filePath = path.join(uploadDir, file.path);
    fs.unlink(filePath, (fsErr) => {
      if (fsErr)
        return res
          .status(500)
          .json({ error: "Erro ao deletar o arquivo físico." });

      db.run(`DELETE FROM files WHERE id = ?`, [id], (dbErr) => {
        if (dbErr)
          return res.status(500).json({ error: "Erro ao apagar do banco." });
        res.json({ message: "Arquivo apagado com sucesso." });
      });
    });
  });
});

app.listen(3001, () => {
  console.log("🚀 Backend rodando em http://localhost:3001");
});
