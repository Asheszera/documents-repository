import { useState } from "react";
import axios from "axios";

export default function UploadArquivos() {
  const [arquivos, setArquivos] = useState<FileList | null>(null);
  const [mensagem, setMensagem] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setArquivos(e.target.files);
  };

  const handleUpload = async () => {
    if (!arquivos || arquivos.length === 0) {
      setMensagem("Selecione pelo menos um arquivo.");
      return;
    }

    const formData = new FormData();
    Array.from(arquivos).forEach((file) => {
      formData.append("arquivos", file);
    });

    try {
      await axios.post("http://localhost:3333/api/arquivos", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMensagem("✅ Arquivos enviados com sucesso!");
    } catch (error) {
      console.error(error);
      setMensagem("❌ Erro ao enviar arquivos.");
    }
  };

  return (
    <div style={{ maxWidth: 500, margin: "1rem auto" }}>
      <h2>Upload de Arquivos</h2>

      <input type="file" multiple onChange={handleChange} />

      <button onClick={handleUpload} style={{ marginTop: "1rem" }}>
        Enviar arquivos
      </button>

      {mensagem && <p>{mensagem}</p>}
    </div>
  );
}
