const form = document.getElementById("attendance-form");
const fileInput = document.getElementById("file-input");
const attendanceList = document.getElementById("attendance-list");
const totalsList = document.getElementById("totals-list");
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

// Função para exibir a lista de presença ordenada por data
function displayAttendanceList(content) {
  const entries = content
    .split("\n")
    .filter((line) => line.trim())
    .map((line) => {
      const [name, date, shift] = line.split(", ");
      return { name, date, shift };
    });

  // Ordena por data
  entries.sort((a, b) => new Date(a.date) - new Date(b.date));

  // Atualiza o conteúdo
  attendanceList.innerHTML = "";
  entries.forEach((entry, index) => {
    const li = document.createElement("li");
    li.className = "attendance-item";

    li.innerHTML = `
      ${entry.name}, ${entry.date}, ${entry.shift}
      <button onclick="editEntry(${index})">Editar</button>
      <button onclick="deleteEntry(${index})">Excluir</button>
    `;
    attendanceList.appendChild(li);
  });

  // Atualiza o conteúdo global
  fileContent = entries.map((entry) => `${entry.name}, ${entry.date}, ${entry.shift}`).join("\n");

  // Atualiza o total por nome
  displayTotals(entries);
}

// Função para exibir o total por nome
function displayTotals(entries) {
  const totals = {};

  // Conta as ocorrências por nome
  entries.forEach((entry) => {
    totals[entry.name] = (totals[entry.name] || 0) + 1;
  });

  totalsList.innerHTML = "";
  for (const [name, count] of Object.entries(totals)) {
    const li = document.createElement("li");
    li.textContent = `${name}: ${count} presença(s)`;
    totalsList.appendChild(li);
  }
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

// Função para editar uma entrada
function editEntry(index) {
  const entries = fileContent.split("\n").filter((line) => line.trim());
  const [name, date, shift] = entries[index].split(", ");

  const newName = prompt("Editar Nome:", name);
  const newDate = prompt("Editar Data:", date);
  const newShift = prompt("Editar Turno (Manhã/Tarde):", shift);

  if (newName && newDate && newShift) {
    entries[index] = `${newName}, ${newDate}, ${newShift}`;
    fileContent = entries.join("\n");
    displayAttendanceList(fileContent);
  }
}

// Função para excluir uma entrada
function deleteEntry(index) {
  const entries = fileContent.split("\n").filter((line) => line.trim());
  if (confirm("Tem certeza que deseja excluir esta entrada?")) {
    entries.splice(index, 1);
    fileContent = entries.join("\n");
    displayAttendanceList(fileContent);
  }
}

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
function displayTotals(entries) {
  const totals = {};

  // Conta as ocorrências por nome
  entries.forEach((entry) => {
    totals[entry.name] = (totals[entry.name] || 0) + 1;
  });

  // Atualiza a lista exibida no totalizador
  totalsList.innerHTML = "";
  for (const [name, count] of Object.entries(totals)) {
    const li = document.createElement("li");
    li.textContent = `${name}: ${count} presença(s)`;
    totalsList.appendChild(li);
  }
}
