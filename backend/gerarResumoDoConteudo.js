const fs = require("fs");
const path = require("path");
const mime = require("mime-types");
const mammoth = require("mammoth");
const pdfParse = require("pdf-parse");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI("sua-api-key-aqui");

async function gerarResumoDoConteudo(caminho) {
  try {
    const tipoMime = mime.lookup(caminho) || "";
    const ext = path.extname(caminho).toLowerCase();
    const modelo = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // 📸 Imagem
    if (tipoMime.startsWith("image/")) {
      const data = fs.readFileSync(caminho);
      const imagem = {
        inlineData: {
          data: data.toString("base64"),
          mimeType: tipoMime,
        },
      };

      const resultado = await modelo.generateContent({
        contents: [
          {
            parts: [
              { text: "O que há nessa imagem? Somente a resposta." },
              imagem,
            ],
          },
        ],
      });

      const resposta = await resultado.response;
      return (await resposta.text()).trim();
    }

    // 📄 TXT
    if (tipoMime === "text/plain") {
      const texto = fs.readFileSync(caminho, "utf8").slice(0, 2000);

      const resultado = await modelo.generateContent({
        contents: [
          {
            parts: [
              {
                text: `Resuma este texto de forma clara e breve. Somente a resposta:\n\n${texto}`,
              },
            ],
          },
        ],
      });

      const resposta = await resultado.response;
      return (await resposta.text()).trim();
    }

    // 📄 PDF
    if (tipoMime === "application/pdf") {
      const buffer = fs.readFileSync(caminho);
      const data = await pdfParse(buffer);
      const texto = data.text.slice(0, 2000);

      const resultado = await modelo.generateContent({
        contents: [
          {
            parts: [
              {
                text: `Resuma este conteúdo de PDF. Somente a resposta:\n\n${texto}`,
              },
            ],
          },
        ],
      });

      const resposta = await resultado.response;
      return (await resposta.text()).trim();
    }

    // 📄 DOCX
    if (tipoMime.includes("wordprocessingml.document")) {
      const buffer = fs.readFileSync(caminho);
      const result = await mammoth.extractRawText({ buffer });
      const texto = result.value.slice(0, 2000);

      const resultado = await modelo.generateContent({
        contents: [
          {
            parts: [
              {
                text: `Resuma este documento Word. Somente a resposta:\n\n${texto}`,
              },
            ],
          },
        ],
      });

      const resposta = await resultado.response;
      return (await resposta.text()).trim();
    }

    // 🧠 Fallback inteligente por extensão
    const extensaoPrompt = {
      ".js": "Resuma este código JavaScript.",
      ".ts": "Resuma este código TypeScript.",
      ".tsx": "Resuma este componente React.",
      ".py": "Resuma este script Python.",
      ".json": "Explique o conteúdo JSON.",
      ".html": "Resuma este documento HTML.",
      ".css": "Resuma esta folha de estilo CSS.",
      ".md": "Resuma este conteúdo Markdown.",
    };

    const promptBase = extensaoPrompt[ext] || "Resuma este conteúdo técnico.";

    try {
      const buffer = fs.readFileSync(caminho);
      const textoBruto = buffer
        .toString("utf8")
        .replace(/\0/g, "")
        .slice(0, 2000);

      if (!textoBruto || textoBruto.trim().length < 10) {
        return "❌ O conteúdo está vazio ou ilegível.";
      }

      const resultado = await modelo.generateContent({
        contents: [
          {
            parts: [
              {
                text: `${promptBase} Somente a resposta:\n\n${textoBruto}`,
              },
            ],
          },
        ],
      });

      const resposta = await resultado.response;
      const textoResposta = await resposta.text();

      if (!textoResposta || textoResposta.trim().length < 5) {
        return "❌ O Gemini não conseguiu gerar um resumo para este conteúdo.";
      }

      return textoResposta.trim();
    } catch (fallbackErr) {
      console.warn("⚠️ Erro no fallback final:", fallbackErr.message);
      return "❌ Mesmo forçando como texto, não foi possível interpretar este arquivo.";
    }
  } catch (err) {
    console.error("💥 Erro geral ao gerar resumo:", err.message);
    return "Não foi possível gerar o resumo. Tente novamente mais tarde.";
  }
}

module.exports = gerarResumoDoConteudo;
