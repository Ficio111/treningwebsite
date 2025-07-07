let selectedDate = new Date().toISOString().split('T')[0];
const user = localStorage.getItem("loggedIn");
const data = JSON.parse(localStorage.getItem("user_" + user)) || { training: {}, stats: {} };

function saveData() {
  localStorage.setItem("user_" + user, JSON.stringify(data));
}

function generateCalendar() {
  const cal = document.getElementById("calendar");
  cal.innerHTML = '';
  for (let i = -3; i <= 3; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    const dateStr = d.toISOString().split('T')[0];
    const btn = document.createElement("div");
    btn.className = "calendar-day" + (dateStr === selectedDate ? " active" : "");
    btn.textContent = dateStr;
    btn.onclick = () => {
      selectedDate = dateStr;
      generateCalendar();
      renderExercises();
    };
    cal.appendChild(btn);
  }
}

function addExercise() {
  const ex = {
    name: document.getElementById("exercise").value,
    series: document.getElementById("series").value,
    reps: document.getElementById("reps").value,
    weight: document.getElementById("weight").value,
    difficulty: document.getElementById("difficulty").value,
    notes: document.getElementById("notes").value,
  };
  if (!data.training[selectedDate]) data.training[selectedDate] = [];
  data.training[selectedDate].push(ex);
  saveData();
  renderExercises();
}

function renderExercises() {
  const list = document.getElementById("trainingList");
  list.innerHTML = '';
  const exercises = data.training[selectedDate] || [];
  exercises.forEach((ex, i) => {
    const el = document.createElement("div");
    el.className = "exercise-entry";
    el.innerHTML = `
      <strong>${ex.name}</strong> — ${ex.series}x${ex.reps} @ ${ex.weight}kg<br>
      Trudność: ${ex.difficulty}<br>
      Uwagi: ${ex.notes || "-"}<br>
      <button onclick="deleteExercise(${i})">Usuń</button>
    `;
    list.appendChild(el);
  });
}

function deleteExercise(i) {
  data.training[selectedDate].splice(i, 1);
  saveData();
  renderExercises();
}

function saveStats() {
  data.stats = {
    weight: document.getElementById("weightStat").value,
    fat: document.getElementById("fatStat").value,
  };
  saveData();
  renderStats();
}

function renderStats() {
  const s = data.stats || {};
  document.getElementById("savedStats").innerText =
    `Waga: ${s.weight || "-"} kg, Tłuszcz: ${s.fat || "-"}%`;
}

function logout() {
  localStorage.removeItem("loggedIn");
  window.location.href = "index.html";
}

if (window.location.pathname.includes("dashboard")) {
  generateCalendar();
  renderExercises();
  renderStats();
}
