const fs = require("fs");
const mime = require("mime-types");
const mammoth = require("mammoth");
const pdfParse = require("pdf-parse");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI("AIzaSyCNvS9npSfcsumSLyo7tZcL80OFvPVcbEM");

async function gerarResumoDoConteudo(caminho) {
  try {
    const tipoMime = mime.lookup(caminho) || "";
    const modelo = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // 🖼️ Imagem via base64
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
              {
                text: "O que há nessa imagem? Somente a resposta.",
              },
              imagem,
            ],
          },
        ],
      });

      const resposta = await resultado.response;
      return (await resposta.text()).trim();
    }

    // 📄 TXT direto
    if (tipoMime === "text/plain") {
      const texto = fs.readFileSync(caminho, "utf8").slice(0, 2000);

      const resultado = await modelo.generateContent({
        contents: [
          {
            parts: [
              {
                text: `Resuma este texto de forma clara e breve. Somente a resposta.\n\n${texto}`,
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
                text: `Resuma este conteúdo de PDF. Somente a resposta.\n\n${texto}`,
              },
            ],
          },
        ],
      });

      const resposta = await resultado.response;
      return (await resposta.text()).trim();
    }

    // 📄 DOCX
    if (
      tipoMime ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      const buffer = fs.readFileSync(caminho);
      const result = await mammoth.extractRawText({ buffer });
      const texto = result.value.slice(0, 2000);

      const resultado = await modelo.generateContent({
        contents: [
          {
            parts: [
              {
                text: `Resuma este documento Word. Somente a resposta.\n\n${texto}`,
              },
            ],
          },
        ],
      });

      const resposta = await resultado.response;
      return (await resposta.text()).trim();
    }

    // 🧠 Fallback: tentar ler qualquer arquivo como texto
    try {
      const buffer = fs.readFileSync(caminho);
      const textoBruto = buffer.toString("utf8").slice(0, 2000);

      const resultado = await modelo.generateContent({
        contents: [
          {
            parts: [
              {
                text: `Resuma este conteúdo técnico (mesmo que tenha símbolos, código ou formatação). Somente a resposta:\n\n${textoBruto}`,
              },
            ],
          },
        ],
      });

      const resposta = await resultado.response;
      return (await resposta.text()).trim();
    } catch (fallbackErr) {
      return "❌ Mesmo forçando como texto, não foi possível interpretar este arquivo.";
    }
  } catch (err) {
    console.error("Erro ao gerar resumo:", err.message);
    return "Não foi possível gerar o resumo. Tente novamente mais tarde.";
  }
}

module.exports = gerarResumoDoConteudo;
