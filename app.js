// App State
let allActivities = [];
const availableItems = [
  { id: "box", name: "Cardboard Box", icon: "📦" },
  { id: "socks", name: "Socks", icon: "🧦" },
  { id: "spoons", name: "Wooden Spoons", icon: "🥄" },
  { id: "string", name: "String / Yarn", icon: "🧶" },
  { id: "paper_plates", name: "Paper Plates", icon: "🍽️" },
  { id: "pillows", name: "Pillows", icon: "🛋️" },
  { id: "tape", name: "Tape", icon: "🩹" },
  { id: "markers", name: "Markers", icon: "🖍️" },
  { id: "blankets", name: "Blankets", icon: "🧺" },
  { id: "pots", name: "Pots & Pans", icon: "🍳" }
];

let selectedItems = new Set();
let selectedAge = "toddler";
let selectedMess = "zero";
let selectedEnergy = "quiet";
let currentActivity = null;
let recentlyShownIds = [];
let deferredPwaPrompt = null;

// DOM Elements
const itemsGrid = document.getElementById("itemsGrid");
const generateBtn = document.getElementById("generateBtn");
const surpriseBtn = document.getElementById("surpriseBtn");
const generatorView = document.getElementById("generatorView");
const resultView = document.getElementById("resultView");
const slotOverlay = document.getElementById("slotOverlay");
const slotText = document.getElementById("slotText");
const slotIcon = document.getElementById("slotIcon");

// Initialization
document.addEventListener("DOMContentLoaded", () => {
  renderItemsGrid();
  loadActivities();
  setupFilterPills();
  updateStreakDisplay();
  updateSavedDisplay();

  // Button Listeners
  generateBtn.addEventListener("click", () => generateActivity(false));
  surpriseBtn.addEventListener("click", () => generateActivity(true));
  document.getElementById("tryAnotherBtn").addEventListener("click", () => generateActivity(selectedItems.size === 0));
  document.getElementById("startOverBtn").addEventListener("click", resetToGenerator);
  document.getElementById("saveBtn").addEventListener("click", saveCurrentActivity);
  
  document.getElementById("toggleSavedBtn").addEventListener("click", () => {
    document.getElementById("savedList").classList.toggle("hidden");
  });

  // Handle PWA Installation prompt
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferredPwaPrompt = e;
    const pwaBtn = document.getElementById("installPwaBtn");
    pwaBtn.classList.remove("hidden");
    pwaBtn.addEventListener("click", () => {
      deferredPwaPrompt.prompt();
      deferredPwaPrompt.userChoice.then(() => pwaBtn.classList.add("hidden"));
    });
  });
});

// Render Interactive Item Grid
function renderItemsGrid() {
  itemsGrid.innerHTML = "";
  availableItems.forEach(item => {
    const card = document.createElement("div");
    card.className = "item-card";
    card.dataset.id = item.id;
    card.innerHTML = `
      <span class="icon">${item.icon}</span>
      <span class="label">${item.name}</span>
    `;
    card.addEventListener("click", () => toggleItem(item.id, card));
    itemsGrid.appendChild(card);
  });
}

// Item Selection Handler
function toggleItem(id, cardElement) {
  if (selectedItems.has(id)) {
    selectedItems.delete(id);
    cardElement.classList.remove("selected");
  } else {
    if (selectedItems.size >= 3) {
      const firstAdded = Array.from(selectedItems)[0];
      selectedItems.delete(firstAdded);
      document.querySelector(`[data-id="${firstAdded}"]`).classList.remove("selected");
    }
    selectedItems.add(id);
    cardElement.classList.add("selected");
  }

  if (selectedItems.size > 0) {
    generateBtn.disabled = false;
    generateBtn.textContent = `Bust Boredom! (${selectedItems.size} Selected)`;
  } else {
    generateBtn.disabled = true;
    generateBtn.textContent = "Pick Items Above";
  }
}

// Setup Interactive Pill Controls
function setupFilterPills() {
  const bindPills = (containerId, setter) => {
    const pills = document.querySelectorAll(`#${containerId} .pill`);
    pills.forEach(pill => {
      pill.addEventListener("click", () => {
        pills.forEach(p => p.classList.remove("active"));
        pill.classList.add("active");
        setter(pill.dataset.value);
      });
    });
  };

  bindPills("ageOptions", val => selectedAge = val);
  bindPills("messOptions", val => selectedMess = val);
  bindPills("energyOptions", val => selectedEnergy = val);
}

// Load JSON Seed Data
async function loadActivities() {
  try {
    const res = await fetch("activities.json");
    allActivities = await res.json();
  } catch (err) {
    console.error("Error loading activities JSON:", err);
  }
}

// Main Matching Algorithm with Deprioritization
function generateActivity(isSurpriseMode = false) {
  let matches = [];
  const chosenItems = Array.from(selectedItems);

  if (isSurpriseMode) {
    // Surprise mode ignores items, matches context
    matches = allActivities.filter(act => 
      act.ageGroups.includes(selectedAge) && 
      act.messLevel === selectedMess && 
      act.energyLevel === selectedEnergy
    );
  } else {
    // 1. Strict Match (Items + Context)
    matches = allActivities.filter(act => {
      const sharesItem = act.items.some(i => chosenItems.includes(i));
      return sharesItem && act.ageGroups.includes(selectedAge) && act.energyLevel === selectedEnergy;
    });

    // 2. Fallback: Relax Energy filter
    if (matches.length === 0) {
      matches = allActivities.filter(act => 
        act.items.some(i => chosenItems.includes(i)) && act.ageGroups.includes(selectedAge)
      );
    }

    // 3. Last Resort: Any item match
    if (matches.length === 0) {
      matches = allActivities.filter(act => act.items.some(i => chosenItems.includes(i)));
    }
  }

  if (matches.length === 0) {
    matches = allActivities; // Ultimate fallback to entire pool
  }

  // Deprioritize recently shown items
  const freshMatches = matches.filter(a => !recentlyShownIds.includes(a.id));
  const finalPool = freshMatches.length > 0 ? freshMatches : matches;

  // Pick Random
  const selected = finalPool[Math.floor(Math.random() * finalPool.length)];
  currentActivity = selected;

  // Track recently shown (keep last 4)
  recentlyShownIds.push(selected.id);
  if (recentlyShownIds.length > 4) recentlyShownIds.shift();

  // Run Shuffle Theater Animation
  runSlotAnimation(() => {
    renderResultCard(selected);
    incrementStreak();
  });
}

// Theater Slot Animation
function runSlotAnimation(callback) {
  slotOverlay.classList.remove("hidden");
  const icons = ["🎲", "🚀", "🎨", "🎰", "⚡"];
  const texts = ["Shuffling ideas...", "Checking the kitchen...", "Busting boredom...", "Almost got it!"];
  let step = 0;

  const interval = setInterval(() => {
    slotIcon.textContent = icons[step % icons.length];
    slotText.textContent = texts[step % texts.length];
    step++;
  }, 140);

  setTimeout(() => {
    clearInterval(interval);
    slotOverlay.classList.add("hidden");
    callback();
  }, 850);
}

// Display Result Card
function renderResultCard(act) {
  document.getElementById("resTitle").textContent = act.title;
  document.getElementById("resTime").textContent = `⏱️ ${act.setupTime}`;
  document.getElementById("resMess").textContent = 
    act.messLevel === 'zero' ? '🧼 Zero Mess' : 
    act.messLevel === 'minor' ? '🟡 Minor Mess' : '💥 Full Explosion';
  document.getElementById("resEnergy").textContent = 
    act.energyLevel === 'quiet' ? '😴 Quiet Time' : '⚡ Burn Energy';

  document.getElementById("resMaterials").textContent = act.materialsText;

  const stepsList = document.getElementById("resSteps");
  stepsList.innerHTML = "";
  act.steps.forEach(step => {
    const li = document.createElement("li");
    li.textContent = step;
    stepsList.appendChild(li);
  });

  document.getElementById("resTip").innerHTML = `💡 <strong>Parent Pro-Tip:</strong> ${act.tip}`;

  generatorView.classList.add("hidden");
  resultView.classList.remove("hidden");
}

function resetToGenerator() {
  resultView.classList.add("hidden");
  generatorView.classList.remove("hidden");
}

// LocalStorage Streak Tracking
function updateStreakDisplay() {
  const count = localStorage.getItem("bb_streak_count") || 0;
  document.getElementById("streakCount").textContent = count;
}

function incrementStreak() {
  let count = parseInt(localStorage.getItem("bb_streak_count") || 0);
  count++;
  localStorage.setItem("bb_streak_count", count);
  updateStreakDisplay();
}

// LocalStorage Saved Favorites
function saveCurrentActivity() {
  if (!currentActivity) return;
  let saved = JSON.parse(localStorage.getItem("bb_saved_acts") || "[]");
  
  if (!saved.some(a => a.id === currentActivity.id)) {
    saved.push(currentActivity);
    localStorage.setItem("bb_saved_acts", JSON.stringify(saved));
    updateSavedDisplay();
    alert("Saved to your favorites!");
  } else {
    alert("Already saved in your favorites!");
  }
}

function updateSavedDisplay() {
  const saved = JSON.parse(localStorage.getItem("bb_saved_acts") || "[]");
  document.getElementById("savedCount").textContent = saved.length;

  const container = document.getElementById("savedList");
  container.innerHTML = "";

  if (saved.length === 0) {
    container.innerHTML = `<p style="font-size:0.85rem; color:#888; text-align:center;">No saved favorites yet.</p>`;
    return;
  }

  saved.forEach(act => {
    const item = document.createElement("div");
    item.className = "saved-item";
    item.innerHTML = `
      <span>${act.title}</span>
      <span style="cursor:pointer; color:#ef4444;" onclick="removeSaved('${act.id}')">🗑️</span>
    `;
    container.appendChild(item);
  });
}

function removeSaved(id) {
  let saved = JSON.parse(localStorage.getItem("bb_saved_acts") || "[]");
  saved = saved.filter(a => a.id !== id);
  localStorage.setItem("bb_saved_acts", JSON.stringify(saved));
  updateSavedDisplay();
}