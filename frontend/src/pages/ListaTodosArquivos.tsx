import { useEffect, useState } from "react";
import axios from "axios";

type Arquivo = {
  id: number;
  nome_arquivo: string;
  caminho: string;
  paciente_id: number;
};

export default function ListaTodosArquivos() {
  const [arquivos, setArquivos] = useState<Arquivo[]>([]);
  const [erro, setErro] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:3333/api/arquivos")
      .then((res) => setArquivos(res.data))
      .catch((err) => {
        console.error(err);
        setErro("Erro ao carregar arquivos.");
      });
  }, []);

  return (
    <div>
      <h2>📁 Lista Geral de Documentos</h2>
      {erro && <p style={{ color: "red" }}>{erro}</p>}

      <ul>
        {arquivos.map((a) => (
          <li key={a.id}>
            <a
              href={`http://localhost:3333/uploads/${a.caminho}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {a.nome_arquivo}
            </a>{" "}
            (Paciente #{a.paciente_id})
          </li>
        ))}
      </ul>
    </div>
  );
}
