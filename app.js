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
  { id: "pots", name: "Pots & Pans", icon: "🍳" },
  { id: "cups", name: "Plastic Cups", icon: "🥤" },
  { id: "muffin_tin", name: "Muffin Tin", icon: "🧁" },
  { id: "colander", name: "Colander", icon: "🥣" },
  { id: "ice_cubes", name: "Ice Cubes", icon: "🧊" },
  { id: "flashlight", name: "Flashlight", icon: "🔦" },
  { id: "toilet_paper_rolls", name: "Paper Rolls", icon: "🧻" },
  { id: "aluminum_foil", name: "Aluminum Foil", icon: "✨" },
  { id: "sticky_notes", name: "Sticky Notes", icon: "📝" },
  { id: "balloons", name: "Balloons", icon: "🎈" },
  { id: "spray_bottle", name: "Spray Bottle", icon: "💦" },
  { id: "laundry_basket", name: "Laundry Basket", icon: "🧺" },
  { id: "cards", name: "Deck of Cards", icon: "🃏" },
  { id: "hair_ties", name: "Hair Ties", icon: "⭕" },
  { id: "spatula", name: "Spatula", icon: "🍳" },
  { id: "coins", name: "Coins", icon: "🪙" },
  { id: "rubber_bands", name: "Rubber Bands", icon: "〰️" },
  { id: "cotton_balls", name: "Cotton Balls", icon: "☁️" },
  { id: "straws", name: "Drinking Straws", icon: "🥤" },
  { id: "toothpicks", name: "Toothpicks", icon: "🪵" },
  { id: "books", name: "Hardcover Books", icon: "📚" }
];

let selectedItems = new Set();
let selectedAge = "toddler";
let selectedMess = "zero";
let selectedEnergy = "quiet";
let currentActivity = null;
let soundEnabled = true;
let timerInterval = null;
let timerSeconds = 120;

// Web Audio API Synthesizer
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playAudioTone(freq, type, duration) {
  if (!soundEnabled) return;
  try {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  } catch (e) {
    console.log("Audio play error", e);
  }
}

function triggerHaptic() {
  if (navigator.vibrate) {
    navigator.vibrate(35);
  }
}

// DOM Initialization
document.addEventListener("DOMContentLoaded", () => {
  renderItemsGrid();
  loadActivities();
  setupFilterPills();
  updateStreakDisplay();
  updateSavedDisplay();

  const generateBtn = document.getElementById("generateBtn");
  const surpriseBtn = document.getElementById("surpriseBtn");
  
  if (generateBtn) generateBtn.addEventListener("click", () => generateActivity(false));
  if (surpriseBtn) surpriseBtn.addEventListener("click", () => generateActivity(true));
  
  document.getElementById("tryAnotherBtn").addEventListener("click", () => generateActivity(selectedItems.size === 0));
  document.getElementById("startOverBtn").addEventListener("click", resetToGenerator);
  document.getElementById("saveBtn").addEventListener("click", saveCurrentActivity);
  document.getElementById("shareBtn").addEventListener("click", shareCurrentActivity);
  
  const soundBtn = document.getElementById("soundToggleBtn");
  if (soundBtn) {
    soundBtn.addEventListener("click", () => {
      soundEnabled = !soundEnabled;
      soundBtn.textContent = soundEnabled ? "🔊" : "🔇";
    });
  }

  document.getElementById("toggleSavedBtn").addEventListener("click", () => {
    document.getElementById("savedList").classList.toggle("hidden");
  });

  document.getElementById("timerStartBtn").addEventListener("click", toggleTimer);
  document.getElementById("timerResetBtn").addEventListener("click", resetTimer);
});

// Render Interactive Item Grid
function renderItemsGrid() {
  const grid = document.getElementById("itemsGrid");
  if (!grid) return;
  grid.innerHTML = "";
  availableItems.forEach(item => {
    const card = document.createElement("div");
    card.className = "item-card";
    card.dataset.id = item.id;
    card.innerHTML = `
      <span class="icon">${item.icon}</span>
      <span class="label">${item.name}</span>
    `;
    card.addEventListener("click", () => toggleItem(item.id, card));
    grid.appendChild(card);
  });
}

function toggleItem(id, cardElement) {
  triggerHaptic();
  playAudioTone(400, "sine", 0.08);

  if (selectedItems.has(id)) {
    selectedItems.delete(id);
    cardElement.classList.remove("selected");
  } else {
    if (selectedItems.size >= 3) {
      const firstAdded = Array.from(selectedItems)[0];
      selectedItems.delete(firstAdded);
      const prevSelected = document.querySelector(`[data-id="${firstAdded}"]`);
      if (prevSelected) prevSelected.classList.remove("selected");
    }
    selectedItems.add(id);
    cardElement.classList.add("selected");
  }

  const btn = document.getElementById("generateBtn");
  if (btn) {
    if (selectedItems.size > 0) {
      btn.disabled = false;
      btn.textContent = `Bust Boredom! (${selectedItems.size} Selected)`;
    } else {
      btn.disabled = true;
      btn.textContent = "Pick Items Above";
    }
  }
}

function setupFilterPills() {
  const bindPills = (containerId, setter) => {
    const pills = document.querySelectorAll(`#${containerId} .pill`);
    pills.forEach(pill => {
      pill.addEventListener("click", () => {
        triggerHaptic();
        playAudioTone(520, "sine", 0.06);
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

async function loadActivities() {
  try {
    const res = await fetch("activities.json");
    allActivities = await res.json();
  } catch (err) {
    console.error("Error loading JSON:", err);
  }
}

// Strict Material Matching Engine
function generateActivity(isSurpriseMode = false) {
  triggerHaptic();
  playAudioTone(300, "triangle", 0.15);

  let pool = [];
  const chosenItems = Array.from(selectedItems);

  if (isSurpriseMode) {
    pool = allActivities.filter(act => 
      act.ageGroups.includes(selectedAge) && 
      act.messLevel === selectedMess && 
      act.energyLevel === selectedEnergy
    );
  } else {
    // RULE: An activity is valid ONLY IF all of its required items are in chosenItems
    const validByMaterials = allActivities.filter(act => {
      return act.items.every(reqItem => chosenItems.includes(reqItem));
    });

    // Tier 1: Valid Materials + Exact Age + Mess + Energy
    pool = validByMaterials.filter(act => 
      act.ageGroups.includes(selectedAge) &&
      act.messLevel === selectedMess &&
      act.energyLevel === selectedEnergy
    );

    // Tier 2: Relax Mess level if no exact match
    if (pool.length === 0) {
      pool = validByMaterials.filter(act => 
        act.ageGroups.includes(selectedAge) &&
        act.energyLevel === selectedEnergy
      );
    }

    // Tier 3: Relax Energy level if still no match
    if (pool.length === 0) {
      pool = validByMaterials.filter(act => 
        act.ageGroups.includes(selectedAge)
      );
    }

    // Tier 4: Any activity that strictly uses ONLY the selected materials
    if (pool.length === 0) {
      pool = validByMaterials;
    }

    // Tier 5: Fallback if no strict 100% material match exists in JSON
    // (Pulls activities that use AT LEAST ONE selected item, but prioritizes highest match ratio)
    if (pool.length === 0) {
      const partialMatches = allActivities.filter(act => 
        act.items.some(i => chosenItems.includes(i))
      );
      pool = partialMatches;
    }
  }

  if (pool.length === 0) pool = allActivities;

  // Filter out current activity so "Try Another" never repeats the same card
  let availablePool = pool;
  if (currentActivity && pool.length > 1) {
    availablePool = pool.filter(act => act.id !== currentActivity.id);
  }

  const selected = availablePool[Math.floor(Math.random() * availablePool.length)];
  currentActivity = selected;

  runSlotAnimation(() => {
    renderResultCard(selected);
    incrementStreak();
    fireConfetti();
    playAudioTone(587.33, "sine", 0.2);
  });
}

function runSlotAnimation(callback) {
  const overlay = document.getElementById("slotOverlay");
  const icon = document.getElementById("slotIcon");
  const text = document.getElementById("slotText");

  overlay.classList.remove("hidden");
  const icons = ["🎲", "🚀", "🎨", "🎰", "⚡", "✨"];
  const texts = ["Shuffling magic...", "Checking kitchen...", "Busting boredom...", "Almost got it!"];
  let step = 0;

  const interval = setInterval(() => {
    if (icon) icon.textContent = icons[step % icons.length];
    if (text) text.textContent = texts[step % texts.length];
    playAudioTone(200 + (step * 20), "square", 0.03);
    step++;
  }, 130);

  setTimeout(() => {
    clearInterval(interval);
    overlay.classList.add("hidden");
    callback();
  }, 850);
}

function fireConfetti() {
  if (typeof confetti === "function") {
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 }
    });
  }
}

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

  resetTimer();

  document.getElementById("generatorView").classList.add("hidden");
  document.getElementById("resultView").classList.remove("hidden");
}

function resetToGenerator() {
  document.getElementById("resultView").classList.add("hidden");
  document.getElementById("generatorView").classList.remove("hidden");
}

// Stopwatch Module
function toggleTimer() {
  const startBtn = document.getElementById("timerStartBtn");
  const resetBtn = document.getElementById("timerResetBtn");

  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
    startBtn.textContent = "▶️ Resume";
  } else {
    resetBtn.classList.remove("hidden");
    startBtn.textContent = "⏸️ Pause";
    timerInterval = setInterval(() => {
      timerSeconds--;
      updateTimerDisplay();
      if (timerSeconds <= 0) {
        clearInterval(timerInterval);
        timerInterval = null;
        startBtn.textContent = "🎉 Time's Up!";
        fireConfetti();
      }
    }, 1000);
  }
}

function resetTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
  timerSeconds = 120;
  updateTimerDisplay();
  const startBtn = document.getElementById("timerStartBtn");
  const resetBtn = document.getElementById("timerResetBtn");
  if (startBtn) startBtn.textContent = "▶️ Start 2-Min Timer";
  if (resetBtn) resetBtn.classList.add("hidden");
}

function updateTimerDisplay() {
  const mins = Math.floor(timerSeconds / 60);
  const secs = timerSeconds % 60;
  const display = document.getElementById("timerDisplay");
  if (display) {
    display.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }
}

// Web Share API
async function shareCurrentActivity() {
  if (!currentActivity) return;
  const shareData = {
    title: currentActivity.title,
    text: `🚀 Boredom Buster: ${currentActivity.title}\n📦 Materials: ${currentActivity.materialsText}\n⏱️ Setup: ${currentActivity.setupTime}`,
    url: window.location.href
  };

  try {
    if (navigator.share) {
      await navigator.share(shareData);
    } else {
      await navigator.clipboard.writeText(`${shareData.text}\n${shareData.url}`);
      alert("Activity steps copied to clipboard!");
    }
  } catch (err) {
    console.log("Share cancelled", err);
  }
}

// LocalStorage Persistence
function updateStreakDisplay() {
  const count = localStorage.getItem("bb_streak_count") || 0;
  const streakEl = document.getElementById("streakCount");
  if (streakEl) streakEl.textContent = count;
}

function incrementStreak() {
  let count = parseInt(localStorage.getItem("bb_streak_count") || 0);
  count++;
  localStorage.setItem("bb_streak_count", count);
  updateStreakDisplay();
}

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
  const countEl = document.getElementById("savedCount");
  if (countEl) countEl.textContent = saved.length;

  const container = document.getElementById("savedList");
  if (!container) return;
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