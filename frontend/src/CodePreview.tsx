import { useEffect, useState } from "react";

interface Props {
  filePath: string;
}

const CodePreview = ({ filePath }: Props) => {
  const [content, setContent] = useState<string>("Carregando preview...");

  useEffect(() => {
    fetch(`http://localhost:3001/files/${filePath}`)
      .then((res) => res.text())
      .then((text) => setContent(text))
      .catch(() => setContent("❌ Erro ao carregar conteúdo."));
  }, [filePath]);

  return (
    <pre
      style={{
        backgroundColor: "#1f1f1f",
        color: "#00ffcc",
        padding: "0.8rem",
        fontSize: "0.8rem",
        borderRadius: "6px",
        height: "200px",
        overflowY: "auto",
        whiteSpace: "pre-wrap",
        fontFamily: "monospace",
        marginBottom: "0.5rem",
      }}
    >
      {content}
    </pre>
  );
};

export default CodePreview;
