// Food database
const foodDatabase = {
  "banana": { calories: 105, carbs: 27, protein: 1, fat: 0 },
  "apple": { calories: 95, carbs: 25, protein: 0.5, fat: 0.3 },
  "rice": { calories: 206, carbs: 45, protein: 4.2, fat: 0.4 },
  "chicken breast": { calories: 165, carbs: 0, protein: 31, fat: 3.6 },
  "salmon": { calories: 208, carbs: 0, protein: 20, fat: 13 },
  "egg": { calories: 78, carbs: 0.6, protein: 6, fat: 5 },
  "oatmeal": { calories: 150, carbs: 27, protein: 5, fat: 3 },
  "bread": { calories: 80, carbs: 14, protein: 3, fat: 1 },
  "yogurt": { calories: 100, carbs: 12, protein: 9, fat: 2 },
  "milk": { calories: 120, carbs: 12, protein: 8, fat: 5 }
};

let totalCalories = 0;
let burnedCalories = 0;
let maintenanceCalories = 2000;
let macros = { carbs: 0, protein: 0, fat: 0 };
let chart;

document.addEventListener("DOMContentLoaded", () => {
  const ctx = document.getElementById("calorieChart").getContext("2d");
  chart = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: ["Consumed", "Remaining"],
      datasets: [{
        data: [0, maintenanceCalories],
        backgroundColor: ["#27ae60", "#e5e7eb"]
      }]
    },
    options: {
      responsive: true,
      cutout: "70%",
      plugins: {
        legend: { display: false }
      }
    }
  });

  updateDisplay();
});

function logFood() {
  const input = document.getElementById("foodInput");
  const foodName = input.value.trim().toLowerCase();
  input.value = "";

  if (!foodDatabase[foodName]) {
    alert("Food not found. Try a different one.");
    return;
  }

  const food = foodDatabase[foodName];
  totalCalories += food.calories;
  macros.carbs += food.carbs;
  macros.protein += food.protein;
  macros.fat += food.fat;

  const log = document.getElementById("foodLog");
  const entry = document.createElement("p");
  entry.textContent = `${capitalize(foodName)}: ${food.calories} kcal`;
  log.appendChild(entry);

  updateDisplay();
}

function logExercise() {
  const name = document.getElementById("exerciseInput").value.trim();
  const minutes = parseInt(document.getElementById("exerciseMinutes").value);
  if (!name || isNaN(minutes)) return;

  const caloriesBurned = Math.round(minutes * 8);
  burnedCalories += caloriesBurned;

  const log = document.getElementById("exerciseLog");
  const entry = document.createElement("p");
  entry.textContent = `${name}: ${caloriesBurned} kcal burned`;
  log.appendChild(entry);

  updateDisplay();
  document.getElementById("exerciseInput").value = "";
  document.getElementById("exerciseMinutes").value = "";
}

function setMaintenanceCalories() {
  const value = parseInt(document.getElementById("maintenanceInput").value);
  if (!isNaN(value)) {
    maintenanceCalories = value;
    updateDisplay();
  }
}

function logReflection() {
  const input = document.getElementById("reflectionInput");
  const log = document.getElementById("reflectionLog");
  const text = input.value.trim();
  if (!text) return;

  const entry = document.createElement("div");
  entry.className = "reflection-entry";
  entry.innerHTML = `
    <p>${text}</p>
    <button onclick="editReflection(this)">Edit</button>
  `;
  log.prepend(entry);
  input.value = "";
}

function editReflection(button) {
  const entry = button.parentElement;
  const text = entry.querySelector("p").textContent;
  const textarea = document.createElement("textarea");
  textarea.value = text;

  const saveBtn = document.createElement("button");
  saveBtn.textContent = "Save";
  saveBtn.onclick = () => {
    entry.querySelector("p").textContent = textarea.value;
    textarea.remove();
    saveBtn.remove();
  };

  entry.appendChild(textarea);
  entry.appendChild(saveBtn);
}

function updateDisplay() {
  document.getElementById("consumedCalories").textContent = totalCalories;
  document.getElementById("burnedCalories").textContent = burnedCalories;
  document.getElementById("maintenanceCalories").textContent = maintenanceCalories;

  const remaining = Math.max(maintenanceCalories - totalCalories + burnedCalories, 0);
  document.getElementById("remainingCalories").textContent = remaining;

  document.getElementById("carbsText").textContent = `${macros.carbs} / 200g`;
  document.getElementById("proteinText").textContent = `${macros.protein} / 100g`;
  document.getElementById("fatText").textContent = `${macros.fat} / 100g`;

  document.getElementById("carbsBar").style.width = `${(macros.carbs / 200) * 100}%`;
  document.getElementById("proteinBar").style.width = `${(macros.protein / 100) * 100}%`;
  document.getElementById("fatBar").style.width = `${(macros.fat / 100) * 100}%`;

  if (chart) {
    chart.data.datasets[0].data = [totalCalories, remaining];
    chart.update();
  }
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
