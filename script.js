// Configurações do GitHub
const GITHUB_REPO = "usuario/repo"; // Substitua pelo seu repositório
const FILE_PATH = "presencas.txt";
const TOKEN = "seu_token_pessoal"; // Substitua pelo seu token do GitHub

// Elementos da interface
const form = document.getElementById("attendance-form");
const attendanceList = document.getElementById("attendance-list");

// Função para registrar presença
form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const name = document.getElementById("name").value.trim();
  const date = document.getElementById("date").value;
  const shift = document.getElementById("shift").value;

  if (!name || !date || !shift) return alert("Preencha todos os campos!");

  const entry = `${name}, ${date}, ${shift}\n`;

  // Adiciona no arquivo TXT no GitHub
  try {
    const fileContent = await getFileContent();
    const updatedContent = fileContent + entry;
    await updateFileContent(updatedContent);
    alert("Presença registrada com sucesso!");
    form.reset();
    loadAttendanceList();
  } catch (error) {
    console.error(error);
    alert("Erro ao registrar presença.");
  }
});

// Função para carregar o conteúdo do arquivo
async function getFileContent() {
  const response = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/contents/${FILE_PATH}`, {
    headers: {
      Authorization: `Bearer ${TOKEN}`,
    },
  });
  if (!response.ok) throw new Error("Erro ao obter arquivo.");
  const data = await response.json();
  return atob(data.content); // Decodifica o conteúdo Base64
}

// Função para atualizar o conteúdo do arquivo
async function updateFileContent(newContent) {
  const response = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/contents/${FILE_PATH}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message: "Atualizando lista de presença",
      content: btoa(newContent), // Codifica o conteúdo para Base64
      sha: await getFileSha(),
    }),
  });
  if (!response.ok) throw new Error("Erro ao atualizar arquivo.");
}

// Função para obter o SHA do arquivo
async function getFileSha() {
  const response = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/contents/${FILE_PATH}`, {
    headers: {
      Authorization: `Bearer ${TOKEN}`,
    },
  });
  if (!response.ok) throw new Error("Erro ao obter SHA do arquivo.");
  const data = await response.json();
  return data.sha;
}

// Função para carregar a lista de presença
async function loadAttendanceList() {
  try {
    const fileContent = await getFileContent();
    attendanceList.innerHTML = "";
    const entries = fileContent.split("\n").filter((line) => line.trim());
    entries.forEach((entry) => {
      const li = document.createElement("li");
      li.textContent = entry;
      attendanceList.appendChild(li);
    });
  } catch (error) {
    console.error(error);
    attendanceList.innerHTML = "<li>Erro ao carregar lista.</li>";
  }
}

// Inicializa a lista ao carregar a página
loadAttendanceList();
