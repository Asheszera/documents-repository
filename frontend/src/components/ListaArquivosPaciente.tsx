import { useEffect, useState } from "react";
import { listarArquivosPorPaciente } from "../services/storage";

type Arquivo = {
  id: number;
  nome_arquivo: string;
  caminho: string;
};

type Props = {
  pacienteId: number;
};

export default function ListaArquivosPaciente({ pacienteId }: Props) {
  const [arquivos, setArquivos] = useState<Arquivo[]>([]);
  const [erro, setErro] = useState("");

  useEffect(() => {
    async function carregarArquivos() {
      try {
        const data = await listarArquivosPorPaciente(pacienteId);
        setArquivos(data);
      } catch (err) {
        console.error(err);
        setErro("Erro ao carregar arquivos.");
      }
    }

    carregarArquivos();
  }, [pacienteId]);

  if (erro) return <p style={{ color: "red" }}>{erro}</p>;

  return (
    <div style={{ marginTop: "1rem" }}>
      <h3>Arquivos do Paciente</h3>

      {arquivos.length === 0 ? (
        <p>Nenhum arquivo encontrado.</p>
      ) : (
        <ul>
          {arquivos.map((arquivo) => (
            <li key={arquivo.id}>
              📄{" "}
              <a
                href={`http://localhost:3333/uploads/${arquivo.caminho}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {arquivo.nome_arquivo}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
