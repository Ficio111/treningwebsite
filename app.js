// Rejestracja i logowanie
function register() {
  const user = document.getElementById("username").value;
  const pass = document.getElementById("password").value;
  if (user && pass) {
    localStorage.setItem("user_" + user, JSON.stringify({ password: pass, training: [], stats: {} }));
    document.getElementById("msg").innerText = "Zarejestrowano pomyślnie!";
  }
}

function login() {
  const user = document.getElementById("username").value;
  const pass = document.getElementById("password").value;
  const stored = JSON.parse(localStorage.getItem("user_" + user));
  if (stored && stored.password === pass) {
    localStorage.setItem("loggedIn", user);
    window.location.href = "dashboard.html";
  } else {
    document.getElementById("msg").innerText = "Niepoprawne dane logowania.";
  }
}

// Dashboard
if (window.location.pathname.includes("dashboard")) {
  const user = localStorage.getItem("loggedIn");
  if (!user) window.location.href = "index.html";

  document.getElementById("loggedUser").innerText = user;
  const userData = JSON.parse(localStorage.getItem("user_" + user));

  function renderExercises() {
    const list = document.getElementById("trainingList");
    list.innerHTML = "";
    userData.training.forEach((ex, i) => {
      list.innerHTML += `<div>
        <strong>${ex.name}</strong><br>
        Serie: ${ex.series}, Powtórzenia: ${ex.reps}, Ciężar: ${ex.weight}kg<br>
        Trudność: ${ex.difficulty}<br>
        Uwagi: ${ex.notes || "-"}
        <button onclick="deleteExercise(${i})">Usuń</button>
      </div>`;
    });
  }

  window.addExercise = function () {
    const ex = {
      name: document.getElementById("exercise").value,
      series: document.getElementById("series").value,
      reps: document.getElementById("reps").value,
      weight: document.getElementById("weight").value,
      difficulty: document.getElementById("difficulty").value,
      notes: document.getElementById("notes").value,
    };
    userData.training.push(ex);
    localStorage.setItem("user_" + user, JSON.stringify(userData));
    renderExercises();
  };

  window.deleteExercise = function (index) {
    userData.training.splice(index, 1);
    localStorage.setItem("user_" + user, JSON.stringify(userData));
    renderExercises();
  };

  window.saveStats = function () {
    const weight = document.getElementById("weightStat").value;
    const fat = document.getElementById("fatStat").value;
    userData.stats = { weight, fat };
    localStorage.setItem("user_" + user, JSON.stringify(userData));
    showStats();
  };

  function showStats() {
    const s = userData.stats;
    document.getElementById("savedStats").innerHTML = `Waga: ${s.weight || "-"} kg, Tłuszcz: ${s.fat || "-"} %`;
  }

  window.logout = function () {
    localStorage.removeItem("loggedIn");
    window.location.href = "index.html";
  };

  renderExercises();
  showStats();
}
