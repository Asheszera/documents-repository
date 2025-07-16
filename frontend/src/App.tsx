import React, { useEffect, useState } from "react";
import TextPreview from "./TextPreview";
import DocxPreview from "./DocxPreview";
import CodePreview from "./CodePreview";

type FileData = {
  id: number;
  name: string;
  path: string;
  type: string;
  size: number;
};

const App = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [fileList, setFileList] = useState<FileData[]>([]);
  const [descriptions, setDescriptions] = useState<Record<number, string>>({});
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const filesPerPage = 10;

  const loadFiles = async () => {
    const res = await fetch("http://localhost:3001/list");
    const data = await res.json();
    setFileList(data);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setFiles(Array.from(e.target.files));
  };

  const uploadFiles = async () => {
    if (files.length === 0) {
      alert("⚠️ Nenhum arquivo selecionado.");
      return;
    }

    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));

    await fetch("http://localhost:3001/upload", {
      method: "POST",
      body: formData,
    });

    setFiles([]);
    setCurrentPage(1);
    loadFiles();
  };

  const deleteFile = async (id: number) => {
    if (!window.confirm("Apagar este arquivo?")) return;
    await fetch(`http://localhost:3001/file/${id}`, { method: "DELETE" });
    loadFiles();
  };

  const summarizeFile = async (id: number) => {
    if (isSummarizing) {
      setDescriptions((prev) => ({
        ...prev,
        [id]: "⚠️ Já estamos gerando um resumo. Aguarde...",
      }));
      return;
    }

    setIsSummarizing(true);
    setDescriptions((prev) => ({ ...prev, [id]: "__loading__" }));

    let attempts = 0;
    const maxAttempts = 3;
    let resumo = "";

    while (attempts < maxAttempts) {
      try {
        const res = await fetch(`http://localhost:3001/summarize/${id}`, {
          method: "POST",
        });

        if (!res.ok) throw new Error(`Erro ${res.status}: ${res.statusText}`);
        const { descricao } = await res.json();
        resumo = descricao;
        break;
      } catch (error) {
        attempts++;
        if (
          typeof error === "object" &&
          error !== null &&
          "message" in error &&
          typeof (error as { message: string }).message === "string" &&
          (error as { message: string }).message.includes("503") &&
          attempts < maxAttempts
        ) {
          await new Promise((r) => setTimeout(r, 10000));
        } else {
          resumo = "❌ Falha ao gerar resumo. Tente novamente mais tarde.";
          break;
        }
      }
    }

    setDescriptions((prev) => ({ ...prev, [id]: resumo }));
    setIsSummarizing(false);
  };

  useEffect(() => {
    loadFiles();
  }, []);

  const totalPages = Math.ceil(fileList.length / filesPerPage);
  const startIndex = (currentPage - 1) * filesPerPage;
  const currentFiles = fileList.slice(startIndex, startIndex + filesPerPage);

  const isTextPreview = (type: string) =>
    type.startsWith("text/") ||
    type.includes("javascript") ||
    type.includes("typescript") ||
    type.includes("json") ||
    type.includes("html") ||
    type.includes("css") ||
    type.includes("python") ||
    type.includes("markdown");

  const styles = {
    container: {
      backgroundColor: "#121212",
      color: "#ffffff",
      fontFamily: "Poppins, sans-serif",
      width: "100vw",
      height: "100vh",
      overflow: "auto",
      display: "flex",
      justifyContent: "center",
      paddingTop: "2rem",
    },
    header: {
      fontSize: "2.2rem",
      marginBottom: "2rem",
      textAlign: "center" as const,
      fontWeight: 700,
      borderBottom: "1px solid #333",
      paddingBottom: "0.5rem",
    },
    input: {
      display: "block",
      width: "100%",
      maxWidth: "300px",
      padding: "0.8rem",
      backgroundColor: "#1f1f1f",
      color: "#ccc",
      border: "1px solid #333",
      borderRadius: "8px",
      marginBottom: "1rem",
      fontSize: "0.9rem",
    },
    button: {
      backgroundColor: "#333",
      color: "#fff",
      border: "none",
      padding: "1rem",
      borderRadius: "8px",
      width: "100%",
      maxWidth: "300px",
      fontSize: "1rem",
      cursor: "pointer",
      marginBottom: "2rem",
    },
    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
      gap: "2rem",
      justifyContent: "center",
    },
    fileItem: {
      backgroundColor: "#1a1a1a",
      padding: "1rem",
      borderRadius: "8px",
      marginBottom: "1.5rem",
      width: "100%",
      minHeight: "380px",
      display: "flex",
      flexDirection: "column" as const,
      justifyContent: "space-between",
      boxSizing: "border-box" as const,
    },
    preview: {
      width: "100%",
      height: "200px",
      objectFit: "contain" as const,
      backgroundColor: "#000",
      borderRadius: "6px",
      marginBottom: "0.5rem",
    },
    textBox: {
      backgroundColor: "#1f1f1f",
      color: "#ddd",
      padding: "0.8rem",
      fontSize: "0.85rem",
      borderRadius: "6px",
      whiteSpace: "pre-wrap" as const,
      height: "200px",
      overflowY: "auto" as const,
      fontFamily: "monospace",
      marginBottom: "0.5rem",
    },
    nameText: {
      fontSize: "0.9rem",
      color: "#ccc",
      marginBottom: "0.2rem",
    },
    sizeText: {
      fontSize: "0.8rem",
      color: "#888",
    },
    deleteButton: {
      marginTop: "0.5rem",
      backgroundColor: "#ff4d4f",
      border: "none",
      padding: "0.5rem 1rem",
      borderRadius: "6px",
      color: "#fff",
      cursor: "pointer",
      fontSize: "0.85rem",
    },
    aiButton: {
      marginTop: "0.5rem",
      backgroundColor: "#266124ff",
      border: "none",
      padding: "0.5rem 1rem",
      borderRadius: "6px",
      color: "#fff",
      cursor: "pointer",
      fontSize: "0.85rem",
    },
    pagination: {
      textAlign: "center" as const,
      marginTop: "2rem",
    },
    paginationButton: {
      margin: "0 0.5rem",
      padding: "0.5rem 1rem",
      backgroundColor: "#2e2e2e",
      color: "#fff",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
    },
  };

  const renderFile = (file: FileData) => {
    const fileUrl = `http://localhost:3001/files/${file.path}`;
    const mime = file.type;

    return (
      <div key={file.id} style={styles.fileItem}>
        {mime.startsWith("image/") && (
          <img
            src={fileUrl}
            alt={file.name}
            style={styles.preview}
            onClick={() => setPreviewImage(fileUrl)}
          />
        )}

        {mime ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document" && (
          <div style={styles.textBox}>
            <strong>Preview do DOCX:</strong>
            <DocxPreview filePath={file.path} />
          </div>
        )}

        {mime === "application/pdf" && (
          <iframe
            src={fileUrl}
            style={styles.preview}
            title={`Preview-PDF-${file.id}`}
          />
        )}

        {mime.startsWith("video/") && (
          <video controls src={fileUrl} style={styles.preview} />
        )}

        {mime === "text/plain" && (
          <div style={styles.textBox}>
            <strong>Preview do TXT:</strong>
            <TextPreview filePath={file.path} />
          </div>
        )}

        {isTextPreview(mime) && mime !== "text/plain" && (
          <div style={styles.textBox}>
            <strong>Preview do código:</strong>
            <CodePreview filePath={file.path} />
          </div>
        )}

        <p style={styles.nameText}>
          <strong>Nome do arquivo:</strong>{" "}
          {file.name.length > 20 ? file.name.slice(0, 17) + "..." : file.name}
        </p>

        <p style={styles.sizeText}>
          Tamanho: {(file.size / 1024).toFixed(1)} KB
        </p>

        <button style={styles.deleteButton} onClick={() => deleteFile(file.id)}>
          🗑️ Apagar
        </button>

        <button
          onClick={() => summarizeFile(file.id)}
          disabled={isSummarizing}
          style={{
            ...styles.aiButton,
            backgroundColor: isSummarizing ? "#555" : "#4e91ff",
            cursor: isSummarizing ? "not-allowed" : "pointer",
            opacity: isSummarizing ? 0.6 : 1,
          }}
        >
          🔎 Resumir
        </button>

        {descriptions[file.id] === "__loading__" ? (
          <p
            style={{ marginTop: "0.5rem", fontSize: "0.85rem", color: "#aaa" }}
          >
            ⏳ Gerando resumo com IA...
          </p>
        ) : descriptions[file.id]?.startsWith("⚠️") ? (
          <p
            style={{
              marginTop: "0.5rem",
              fontSize: "0.85rem",
              color: "#ffcc00",
            }}
          >
            {descriptions[file.id]}
          </p>
        ) : descriptions[file.id] ? (
          <p
            style={{
              marginTop: "0.5rem",
              fontSize: "0.85rem",
              color: "#00ffcc",
            }}
          >
            <strong>Resumo Gemini:</strong> {descriptions[file.id]}
          </p>
        ) : null}
      </div>
    );
  };
  return (
    <div style={styles.container}>
      <div style={{ maxWidth: "1200px", width: "100%", padding: "2rem" }}>
        <h1 style={styles.header}>📁 Document Repository</h1>

        <input
          type="file"
          multiple
          onChange={handleFileChange}
          style={styles.input}
        />
        <button onClick={uploadFiles} style={styles.button}>
          Enviar Arquivos
        </button>

        <div style={styles.grid}>{currentFiles.map(renderFile)}</div>

        <div style={styles.pagination}>
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            style={styles.paginationButton}
          >
            ◀ Anterior
          </button>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            style={styles.paginationButton}
          >
            Próxima ▶
          </button>
          <p
            style={{ marginTop: "0.5rem", fontSize: "0.85rem", color: "#aaa" }}
          >
            Página {currentPage} de {totalPages}
          </p>
        </div>
      </div>

      {previewImage && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.8)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
          onClick={() => setPreviewImage(null)}
        >
          <img
            src={previewImage}
            alt="Preview"
            style={{
              maxWidth: "90%",
              maxHeight: "90%",
              borderRadius: "12px",
              boxShadow: "0 0 20px rgba(255,255,255,0.2)",
            }}
          />
        </div>
      )}
    </div>
  );
};

export default App;
