import React, { useEffect, useState } from "react";
import mammoth from "mammoth";

const DocxPreview: React.FC<{ filePath: string }> = ({ filePath }) => {
  const [html, setHtml] = useState<string>("Carregando...");

  useEffect(() => {
    const loadDocx = async () => {
      try {
        const res = await fetch(`http://localhost:3001/files/${filePath}`);
        const blob = await res.blob();

        const arrayBuffer = await blob.arrayBuffer();
        const result = await mammoth.convertToHtml({ arrayBuffer });

        setHtml(result.value.slice(0, 500)); // limita preview
      } catch {
        setHtml("[Erro ao carregar .docx]");
      }
    };

    loadDocx();
  }, [filePath]);

  return (
    <div
      dangerouslySetInnerHTML={{ __html: html }}
      style={{
        backgroundColor: "#1f1f1f",
        color: "#ddd",
        padding: "0.8rem",
        fontSize: "0.85rem",
        borderRadius: "6px",
        maxHeight: "200px",
        overflowY: "auto",
      }}
    />
  );
};

export default DocxPreview;
