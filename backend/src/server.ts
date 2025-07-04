import express from "express";
import cors from "cors";
import pacienteRoutes from "./routes/paciente";

const app = express();
const PORT = 3333;

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads")); // Para servir os arquivos estáticos
app.use("/api", pacienteRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});