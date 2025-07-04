import FormularioLogin from "../components/FormularioLogin";

export default function Login() {
  return (
    <div style={{ maxWidth: 400, margin: "2rem auto", padding: "1rem" }}>
      <h1>Bem-vindo(a)</h1>
      <p>Faça login para acessar o sistema:</p>
      <FormularioLogin />
    </div>
  );
}
