import { useEffect, useState } from "react";
import axios from "axios";
import ListaArquivosPaciente from "../components/ListaArquivosPaciente";

type Paciente = {
  id: number;
  nome: string;
  email: string;
};

export default function Dashboard() {
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [pacienteSelecionado, setPacienteSelecionado] =
    useState<Paciente | null>(null);
  const [erro, setErro] = useState("");

  useEffect(() => {
    async function fetchPacientes() {
      try {
        const response = await axios.get("http://localhost:3333/api/pacientes");
        setPacientes(response.data);
      } catch (error) {
        console.error(error);
        setErro("Erro ao buscar pacientes.");
      }
    }

    fetchPacientes();
  }, []);

  return (
    <div style={{ maxWidth: 800, margin: "2rem auto", padding: "1rem" }}>
      <h2>Dashboard de Pacientes</h2>

      {erro && <p style={{ color: "red" }}>{erro}</p>}

      <ul style={{ listStyle: "none", padding: 0 }}>
        {pacientes.map((paciente) => (
          <li
            key={paciente.id}
            style={{
              border: "1px solid #ccc",
              padding: "1rem",
              marginBottom: "1rem",
              borderRadius: "5px",
              cursor: "pointer",
              backgroundColor:
                pacienteSelecionado?.id === paciente.id ? "#f0f8ff" : "#fff",
            }}
            onClick={() => setPacienteSelecionado(paciente)}
          >
            <strong>{paciente.nome}</strong>
            <br />
            <small>{paciente.email}</small>
          </li>
        ))}
      </ul>

      {pacienteSelecionado && (
        <ListaArquivosPaciente pacienteId={pacienteSelecionado.id} />
      )}
    </div>
  );
}
