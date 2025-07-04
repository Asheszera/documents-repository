import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import FormularioPaciente from "./components/FormularioPaciente";
import FormularioLogin from "./components/FormularioLogin";
import Dashboard from "./pages/Dashboard";
import ListaTodosArquivos from "./pages/ListaTodosArquivos"; // Nova página
import Home from "./pages/Home"; // Opcional

export default function App() {
  return (
    <Router>
      <header
        style={{ background: "#004080", padding: "1rem", color: "white" }}
      >
        <nav style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
          <Link to="/" style={{ color: "white", textDecoration: "none" }}>
            🏠 Início
          </Link>
          <Link
            to="/cadastro"
            style={{ color: "white", textDecoration: "none" }}
          >
            📝 Cadastro
          </Link>
          <Link to="/login" style={{ color: "white", textDecoration: "none" }}>
            🔐 Login
          </Link>
          <Link
            to="/dashboard"
            style={{ color: "white", textDecoration: "none" }}
          >
            👥 Pacientes
          </Link>
          <Link
            to="/documentos"
            style={{ color: "white", textDecoration: "none" }}
          >
            📁 Documentos
          </Link>
        </nav>
      </header>

      <main style={{ padding: "2rem", fontFamily: "sans-serif" }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cadastro" element={<FormularioPaciente />} />
          <Route path="/login" element={<FormularioLogin />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/documentos" element={<ListaTodosArquivos />} />
        </Routes>
      </main>
    </Router>
  );
}
