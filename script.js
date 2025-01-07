const form = document.getElementById("attendance-form");
const fileInput = document.getElementById("file-input");
const attendanceList = document.getElementById("attendance-list");
const downloadButton = document.getElementById("download-file");

let fileContent = ""; // Conteúdo do arquivo carregado

// Função para processar o upload do arquivo
fileInput.addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (file && file.type === "text/plain") {
    const reader = new FileReader();
    reader.onload = (e) => {
      fileContent = e.target.result;
      displayAttendanceList(fileContent);
      downloadButton.disabled = false; // Ativa o botão de download
    };
    reader.readAsText(file);
  } else {
    alert("Por favor, envie um arquivo .txt válido.");
  }
});

// Função para exibir a lista de presença
function displayAttendanceList(content) {
  attendanceList.innerHTML = ""; // Limpa a lista atual
  const entries = content.split("\n").filter((line) => line.trim());
  entries.forEach((entry) => {
    const li = document.createElement("li");
    li.textContent = entry;
    attendanceList.appendChild(li);
  });
}

// Função para registrar uma nova presença
form.addEventListener("submit", (event) => {
  event.preventDefault();

  const name = document.getElementById("name").value.trim();
  const date = document.getElementById("date").value;
  const shift = document.getElementById("shift").value;

  if (!name || !date || !shift) return alert("Preencha todos os campos!");

  const newEntry = `${name}, ${date}, ${shift}`;
  fileContent += `${newEntry}\n`; // Adiciona a nova entrada ao conteúdo
  displayAttendanceList(fileContent); // Atualiza a lista exibida

  alert("Presença registrada com sucesso!");
  form.reset();
});

// Função para baixar o arquivo atualizado
downloadButton.addEventListener("click", () => {
  const blob = new Blob([fileContent], { type: "text/plain" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = "lista_de_presenca_atualizada.txt";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
});
