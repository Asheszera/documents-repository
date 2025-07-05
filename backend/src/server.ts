import express from "express";
import cors from "cors";
import usuarioRoutes from "./routes/usuario";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api", usuarioRoutes);

app.listen(3333, () => {
  console.log("✅ Backend rodando em http://localhost:3333");
});