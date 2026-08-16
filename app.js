// Boredom Buster v2
// Smarter recommendation engine with structured materials, variety history,
// personalization, exact "use all" mode, and feedback-based learning.

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

const itemById = Object.fromEntries(availableItems.map(item => [item.id, item]));

let selectedItems = new Set();
let selectedAge = "toddler";
let selectedMess = "zero";
let selectedEnergy = "quiet";
let selectedIndependence = "either";
let useAllItems = false;
let currentActivity = null;
let soundEnabled = true;
let timerInterval = null;
let timerSeconds = 120;
let lastGenerationWasSurprise = false;

const RECENT_LIMIT = 12;
const STORAGE = {
  recent: "bb_recent_ids_v2",
  feedback: "bb_feedback_v2",
  saved: "bb_saved_acts",
  streak: "bb_streak_count"
};

let recentIds = readJsonStorage(STORAGE.recent, []);
let feedback = readJsonStorage(STORAGE.feedback, {});

let audioCtx = null;
function getAudioContext() {
  if (!audioCtx) {
    const AudioCtor = window.AudioContext || window.webkitAudioContext;
    if (AudioCtor) audioCtx = new AudioCtor();
  }
  return audioCtx;
}

function playAudioTone(freq, type, duration) {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    if (ctx.state === "suspended") ctx.resume().catch(() => {});
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch (e) {
    console.log("Audio play error", e);
  }
}

function triggerHaptic() {
  if (navigator.vibrate) navigator.vibrate(35);
}

function readJsonStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    console.warn(`Could not read ${key}`, e);
    return fallback;
  }
}

function writeJsonStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn(`Could not save ${key}`, e);
  }
}

function normalizeActivity(act) {
  // Supports both v2 records and legacy records if an older JSON somehow loads.
  const legacyItems = Array.isArray(act.items) ? act.items : [];
  const primaryItems = Array.isArray(act.primaryItems) && act.primaryItems.length
    ? act.primaryItems
    : legacyItems.slice(0, 1);
  const optionalItems = Array.isArray(act.optionalItems)
    ? act.optionalItems
    : legacyItems.slice(1);
  const mergedItems = [...new Set([...primaryItems, ...optionalItems])];

  return {
    ...act,
    primaryItems,
    optionalItems,
    items: mergedItems,
    independence: act.independence || "together"
  };
}

// -------------------------
// Initialization
// -------------------------
document.addEventListener("DOMContentLoaded", () => {
  renderItemsGrid();
  setupFilterPills();
  setupControls();
  updateStreakDisplay();
  updateSavedDisplay();
  loadActivities();
});

async function loadActivities() {
  try {
    const res = await fetch("activities.json", { cache: "no-store" });
    if (!res.ok) throw new Error(`activities.json returned ${res.status}`);
    const payload = await res.json();
    allActivities = payload.map(normalizeActivity);
    updateMatchPreview();
  } catch (err) {
    console.error("Error loading JSON:", err);
    showGeneratorMessage("I couldn't load the activity library. Refresh the page and try again.", "error");
  }
}

function setupControls() {
  const generateBtn = document.getElementById("generateBtn");
  const surpriseBtn = document.getElementById("surpriseBtn");
  const tryAnotherBtn = document.getElementById("tryAnotherBtn");
  const startOverBtn = document.getElementById("startOverBtn");
  const saveBtn = document.getElementById("saveBtn");
  const shareBtn = document.getElementById("shareBtn");
  const soundBtn = document.getElementById("soundToggleBtn");
  const useAllToggle = document.getElementById("useAllItemsToggle");
  const greatIdeaBtn = document.getElementById("greatIdeaBtn");
  const notForUsBtn = document.getElementById("notForUsBtn");

  if (generateBtn) generateBtn.addEventListener("click", () => generateActivity(false));
  if (surpriseBtn) surpriseBtn.addEventListener("click", () => generateActivity(true));
  if (tryAnotherBtn) tryAnotherBtn.addEventListener("click", () => generateActivity(lastGenerationWasSurprise));
  if (startOverBtn) startOverBtn.addEventListener("click", resetToGenerator);
  if (saveBtn) saveBtn.addEventListener("click", saveCurrentActivity);
  if (shareBtn) shareBtn.addEventListener("click", shareCurrentActivity);
  if (greatIdeaBtn) greatIdeaBtn.addEventListener("click", () => rateCurrentActivity(1));
  if (notForUsBtn) notForUsBtn.addEventListener("click", () => rateCurrentActivity(-1, true));

  if (useAllToggle) {
    useAllToggle.addEventListener("change", e => {
      useAllItems = e.target.checked;
      updateMatchPreview();
      hideGeneratorMessage();
    });
  }

  if (soundBtn) {
    soundBtn.addEventListener("click", () => {
      soundEnabled = !soundEnabled;
      soundBtn.textContent = soundEnabled ? "🔊" : "🔇";
      soundBtn.setAttribute("aria-pressed", String(soundEnabled));
      if (soundEnabled) playAudioTone(520, "sine", 0.08);
    });
  }

  const savedToggle = document.getElementById("toggleSavedBtn");
  if (savedToggle) {
    savedToggle.addEventListener("click", () => {
      document.getElementById("savedList")?.classList.toggle("hidden");
    });
  }

  document.getElementById("timerStartBtn")?.addEventListener("click", toggleTimer);
  document.getElementById("timerResetBtn")?.addEventListener("click", resetTimer);
}

// -------------------------
// Item Selection
// -------------------------
function renderItemsGrid() {
  const grid = document.getElementById("itemsGrid");
  if (!grid) return;
  grid.innerHTML = "";

  availableItems.forEach(item => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "item-card";
    card.dataset.id = item.id;
    card.setAttribute("aria-pressed", "false");
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
    cardElement.setAttribute("aria-pressed", "false");
  } else {
    if (selectedItems.size >= 3) {
      const firstAdded = Array.from(selectedItems)[0];
      selectedItems.delete(firstAdded);
      const prevSelected = document.querySelector(`[data-id="${firstAdded}"]`);
      if (prevSelected) {
        prevSelected.classList.remove("selected");
        prevSelected.setAttribute("aria-pressed", "false");
      }
    }
    selectedItems.add(id);
    cardElement.classList.add("selected");
    cardElement.setAttribute("aria-pressed", "true");
  }

  updateGenerateButton();
  updateMatchPreview();
  hideGeneratorMessage();
}

function updateGenerateButton() {
  const btn = document.getElementById("generateBtn");
  if (!btn) return;

  if (selectedItems.size > 0) {
    btn.disabled = false;
    btn.textContent = `Bust Boredom! (${selectedItems.size} Selected)`;
  } else {
    btn.disabled = true;
    btn.textContent = "Pick Items Above";
  }
}

// -------------------------
// Filters
// -------------------------
function setupFilterPills() {
  const bindPills = (containerId, setter) => {
    const pills = document.querySelectorAll(`#${containerId} .pill`);
    pills.forEach(pill => {
      pill.addEventListener("click", () => {
        triggerHaptic();
        playAudioTone(520, "sine", 0.06);
        pills.forEach(p => {
          p.classList.remove("active");
          p.setAttribute("aria-pressed", "false");
        });
        pill.classList.add("active");
        pill.setAttribute("aria-pressed", "true");
        setter(pill.dataset.value);
        updateMatchPreview();
        hideGeneratorMessage();
      });
    });
  };

  bindPills("ageOptions", value => selectedAge = value);
  bindPills("messOptions", value => selectedMess = value);
  bindPills("energyOptions", value => selectedEnergy = value);
  bindPills("independenceOptions", value => selectedIndependence = value);
}

function messAllowed(activityMess) {
  if (selectedMess === "zero") return activityMess === "zero";
  if (selectedMess === "minor") return activityMess === "zero" || activityMess === "minor";
  return ["zero", "minor", "full"].includes(activityMess); // Anything Goes
}

function passesContextFilters(act) {
  if (!act.ageGroups.includes(selectedAge)) return false;
  if (act.energyLevel !== selectedEnergy) return false;
  if (!messAllowed(act.messLevel)) return false;
  if (selectedIndependence !== "either" && act.independence !== selectedIndependence) return false;
  return true;
}

function activityItemSet(act) {
  return new Set([...act.primaryItems, ...act.optionalItems]);
}

function getEligibleActivities({ surprise = false } = {}) {
  const chosen = Array.from(selectedItems);

  return allActivities.filter(act => {
    if (!passesContextFilters(act)) return false;
    if (surprise || chosen.length === 0) return true;

    const activityItems = activityItemSet(act);
    const matchCount = chosen.filter(id => activityItems.has(id)).length;

    if (useAllItems) return matchCount === chosen.length;
    return matchCount > 0;
  });
}

function updateMatchPreview() {
  const el = document.getElementById("matchPreview");
  if (!el || allActivities.length === 0) return;

  const eligible = getEligibleActivities({ surprise: selectedItems.size === 0 });
  if (selectedItems.size === 0) {
    el.textContent = `${eligible.length} ideas match these filters.`;
  } else if (useAllItems) {
    el.textContent = `${eligible.length} ideas use all selected items and match these filters.`;
  } else {
    el.textContent = `${eligible.length} ideas use at least one selected item and match these filters.`;
  }
  el.classList.toggle("low-match", eligible.length > 0 && eligible.length < 5);
}

// -------------------------
// Personalization + Ranking
// -------------------------
function getSavedActivities() {
  const raw = readJsonStorage(STORAGE.saved, []);
  return Array.isArray(raw) ? raw : [];
}

function getSavedIds() {
  return new Set(getSavedActivities().map(a => typeof a === "string" ? a : a.id).filter(Boolean));
}

function buildItemAffinity() {
  const affinity = Object.fromEntries(availableItems.map(item => [item.id, 0]));
  const byId = Object.fromEntries(allActivities.map(act => [act.id, act]));

  // Favorites are a gentle positive signal.
  for (const saved of getSavedActivities()) {
    const id = typeof saved === "string" ? saved : saved.id;
    const act = byId[id] || (typeof saved === "object" ? normalizeActivity(saved) : null);
    if (!act) continue;
    act.primaryItems.forEach(item => { if (item in affinity) affinity[item] += 1.25; });
    act.optionalItems.forEach(item => { if (item in affinity) affinity[item] += 0.35; });
  }

  // Explicit feedback is stronger. A dislike of a balloon activity, for example,
  // slightly lowers other balloon-heavy activities without blocking them forever.
  for (const [id, value] of Object.entries(feedback)) {
    const act = byId[id];
    if (!act || !value) continue;
    const direction = value > 0 ? 1 : -1;
    act.primaryItems.forEach(item => { if (item in affinity) affinity[item] += direction * 2.25; });
    act.optionalItems.forEach(item => { if (item in affinity) affinity[item] += direction * 0.6; });
  }

  return affinity;
}

function scoreActivity(act, chosenItems, itemAffinity, savedIds) {
  let score = 10;
  const chosen = new Set(chosenItems);
  const primaryMatches = act.primaryItems.filter(item => chosen.has(item));
  const optionalMatches = act.optionalItems.filter(item => chosen.has(item));

  score += primaryMatches.length * 12;
  score += optionalMatches.length * 4;

  // Extra reward for combining multiple things the user actually selected.
  const totalMatches = primaryMatches.length + optionalMatches.length;
  if (totalMatches >= 2) score += 4;
  if (totalMatches >= 3) score += 3;

  // Prefer the user's exact tolerance boundary slightly, but never violate tolerance.
  if (selectedMess === "minor" && act.messLevel === "minor") score += 1.5;
  if (selectedMess === "full" && act.messLevel === "full") score += 1.5;

  // Personalization derived from favorite/disliked materials.
  act.primaryItems.forEach(item => { score += itemAffinity[item] || 0; });
  act.optionalItems.forEach(item => { score += (itemAffinity[item] || 0) * 0.35; });

  if (savedIds.has(act.id)) score += 2;
  if (feedback[act.id] > 0) score += 4;
  if (feedback[act.id] < 0) score -= 14;

  // Strong variety penalty, not a hard ban. Sparse combinations can still function.
  const recentIndex = recentIds.indexOf(act.id);
  if (recentIndex !== -1) score -= Math.max(8, 24 - recentIndex);
  else score += 2;

  if (currentActivity && act.id === currentActivity.id) score -= 40;

  return { score, primaryMatches, optionalMatches, totalMatches };
}

function weightedChoice(scored) {
  if (!scored.length) return null;

  scored.sort((a, b) => b.score - a.score);
  const best = scored[0].score;

  // Keep a broad pool of strong choices instead of only the single highest tier.
  let finalists = scored.filter(row => row.score >= best - 12).slice(0, 20);
  if (finalists.length < Math.min(8, scored.length)) finalists = scored.slice(0, Math.min(12, scored.length));

  const floor = Math.min(...finalists.map(row => row.score));
  const weighted = finalists.map(row => ({
    ...row,
    weight: Math.pow(Math.max(1, row.score - floor + 2), 1.35)
  }));

  const total = weighted.reduce((sum, row) => sum + row.weight, 0);
  let roll = Math.random() * total;
  for (const row of weighted) {
    roll -= row.weight;
    if (roll <= 0) return row;
  }
  return weighted[weighted.length - 1];
}

function generateActivity(isSurpriseMode = false) {
  triggerHaptic();
  playAudioTone(300, "triangle", 0.15);
  hideGeneratorMessage();

  if (!allActivities.length) {
    showGeneratorMessage("The activity library is still loading. Try again in a moment.", "error");
    return;
  }

  lastGenerationWasSurprise = isSurpriseMode || selectedItems.size === 0;
  const eligible = getEligibleActivities({ surprise: lastGenerationWasSurprise });

  if (eligible.length === 0) {
    if (useAllItems && selectedItems.size > 0) {
      showGeneratorMessage("No activity uses all of those items with these filters. Turn off “Use ALL my items” or change one filter.", "warning");
    } else {
      showGeneratorMessage("No activities match that exact combination yet. Try another energy, involvement, or mess setting.", "warning");
    }
    return;
  }

  const chosen = Array.from(selectedItems);
  const itemAffinity = buildItemAffinity();
  const savedIds = getSavedIds();
  const scored = eligible.map(act => ({ activity: act, ...scoreActivity(act, chosen, itemAffinity, savedIds) }));
  const picked = weightedChoice(scored);
  if (!picked) return;

  currentActivity = picked.activity;
  rememberRecent(currentActivity.id);

  runSlotAnimation(() => {
    renderResultCard(currentActivity, picked);
    incrementStreak();
    fireConfetti();
    playAudioTone(587.33, "sine", 0.2);
  });
}

function rememberRecent(id) {
  recentIds = [id, ...recentIds.filter(existing => existing !== id)].slice(0, RECENT_LIMIT);
  writeJsonStorage(STORAGE.recent, recentIds);
}

// -------------------------
// Result UI
// -------------------------
function runSlotAnimation(callback) {
  const overlay = document.getElementById("slotOverlay");
  const icon = document.getElementById("slotIcon");
  const text = document.getElementById("slotText");
  if (!overlay) return callback();

  overlay.classList.remove("hidden");
  const icons = ["🎲", "🚀", "🎨", "🎰", "⚡", "✨"];
  const texts = ["Matching your stuff...", "Checking the filters...", "Avoiding repeats...", "Found a good one!"];
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
  }, 700);
}

function fireConfetti() {
  if (typeof confetti === "function") {
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
  }
}

function itemLabel(id) {
  return itemById[id]?.name || id.replaceAll("_", " ");
}

function buildMatchReason(act, scoreInfo) {
  if (lastGenerationWasSurprise || selectedItems.size === 0) {
    const involvement = act.independence === "independent" ? "independent-friendly" : "good to do together";
    return `✨ Fits your ${energyLabel(act.energyLevel).toLowerCase()} goal and is ${involvement}.`;
  }

  const primary = scoreInfo.primaryMatches.map(itemLabel);
  const optional = scoreInfo.optionalMatches.map(itemLabel);
  const pieces = [];

  if (primary.length) pieces.push(`built around ${primary.join(" + ")}`);
  if (optional.length) pieces.push(`also uses ${optional.join(" + ")}`);

  if (!pieces.length) return "✨ Matches your current filters.";
  return `✨ Great match: ${pieces.join(" and ")}.`;
}

function messLabel(level) {
  if (level === "zero") return "🧼 Zero Mess";
  if (level === "minor") return "🟡 Minor Mess";
  return "💥 Messy Fun";
}

function energyLabel(level) {
  return level === "quiet" ? "Quiet Time" : "Burn Energy";
}

function renderResultCard(act, scoreInfo) {
  document.getElementById("resTitle").textContent = act.title;
  document.getElementById("resTime").textContent = `⏱️ ${act.setupTime}`;
  document.getElementById("resMess").textContent = messLabel(act.messLevel);
  document.getElementById("resEnergy").textContent = act.energyLevel === "quiet" ? "😴 Quiet Time" : "⚡ Burn Energy";
  document.getElementById("resInvolvement").textContent = act.independence === "independent" ? "🙌 Independent-ish" : "👨‍👩‍👧 Better Together";
  document.getElementById("resMaterials").textContent = act.materialsText;
  document.getElementById("matchReason").textContent = buildMatchReason(act, scoreInfo);

  const stepsList = document.getElementById("resSteps");
  stepsList.innerHTML = "";
  act.steps.forEach(step => {
    const li = document.createElement("li");
    li.textContent = step;
    stepsList.appendChild(li);
  });

  document.getElementById("resTip").innerHTML = `💡 <strong>Parent Pro-Tip:</strong> ${act.tip}`;
  refreshFeedbackButtons();
  resetTimer();

  document.getElementById("generatorView").classList.add("hidden");
  document.getElementById("resultView").classList.remove("hidden");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function resetToGenerator() {
  document.getElementById("resultView").classList.add("hidden");
  document.getElementById("generatorView").classList.remove("hidden");
  updateMatchPreview();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function showGeneratorMessage(message, type = "warning") {
  const box = document.getElementById("generatorMessage");
  if (!box) return;
  box.textContent = message;
  box.className = `generator-message ${type}`;
}

function hideGeneratorMessage() {
  const box = document.getElementById("generatorMessage");
  if (!box) return;
  box.textContent = "";
  box.className = "generator-message hidden";
}

// -------------------------
// Feedback + Personalization
// -------------------------
function rateCurrentActivity(value, generateAnother = false) {
  if (!currentActivity) return;
  feedback[currentActivity.id] = value;
  writeJsonStorage(STORAGE.feedback, feedback);
  refreshFeedbackButtons();
  triggerHaptic();
  playAudioTone(value > 0 ? 660 : 240, value > 0 ? "sine" : "triangle", 0.09);

  if (generateAnother) {
    setTimeout(() => generateActivity(lastGenerationWasSurprise), 120);
  }
}

function refreshFeedbackButtons() {
  if (!currentActivity) return;
  const value = feedback[currentActivity.id] || 0;
  const like = document.getElementById("greatIdeaBtn");
  const dislike = document.getElementById("notForUsBtn");
  if (like) {
    like.classList.toggle("active-feedback", value > 0);
    like.textContent = value > 0 ? "👍 Great idea ✓" : "👍 Great idea";
  }
  if (dislike) {
    dislike.classList.toggle("active-feedback", value < 0);
    dislike.textContent = value < 0 ? "👎 Not for us ✓" : "👎 Not for us";
  }
}

// -------------------------
// Timer
// -------------------------
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
  if (display) display.textContent = `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

// -------------------------
// Sharing
// -------------------------
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
    } else if (navigator.clipboard) {
      await navigator.clipboard.writeText(`${shareData.text}\n${shareData.url}`);
      alert("Activity copied to clipboard!");
    }
  } catch (err) {
    console.log("Share cancelled", err);
  }
}

// -------------------------
// Streak + Favorites
// -------------------------
function updateStreakDisplay() {
  const count = localStorage.getItem(STORAGE.streak) || 0;
  const streakEl = document.getElementById("streakCount");
  if (streakEl) streakEl.textContent = count;
}

function incrementStreak() {
  let count = parseInt(localStorage.getItem(STORAGE.streak) || "0", 10);
  count++;
  localStorage.setItem(STORAGE.streak, String(count));
  updateStreakDisplay();
}

function saveCurrentActivity() {
  if (!currentActivity) return;
  let saved = getSavedActivities();

  if (!saved.some(a => (typeof a === "string" ? a : a.id) === currentActivity.id)) {
    saved.push(currentActivity);
    writeJsonStorage(STORAGE.saved, saved);
    updateSavedDisplay();
    alert("Saved to your favorites! Future recommendations will learn from it.");
  } else {
    alert("Already saved in your favorites!");
  }
}

function updateSavedDisplay() {
  const saved = getSavedActivities();
  const countEl = document.getElementById("savedCount");
  if (countEl) countEl.textContent = saved.length;

  const container = document.getElementById("savedList");
  if (!container) return;
  container.innerHTML = "";

  if (saved.length === 0) {
    container.innerHTML = `<p class="empty-saved">No saved favorites yet.</p>`;
    return;
  }

  saved.forEach(savedAct => {
    const id = typeof savedAct === "string" ? savedAct : savedAct.id;
    const act = allActivities.find(a => a.id === id) || savedAct;
    if (!act || !id) return;

    const item = document.createElement("div");
    item.className = "saved-item";

    const title = document.createElement("span");
    title.textContent = act.title || id;

    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "saved-remove";
    remove.textContent = "🗑️";
    remove.setAttribute("aria-label", `Remove ${act.title || "favorite"}`);
    remove.addEventListener("click", () => removeSaved(id));

    item.append(title, remove);
    container.appendChild(item);
  });
}

function removeSaved(id) {
  let saved = getSavedActivities();
  saved = saved.filter(a => (typeof a === "string" ? a : a.id) !== id);
  writeJsonStorage(STORAGE.saved, saved);
  updateSavedDisplay();
}

// -------------------------
// PWA install prompt
// -------------------------
let deferredInstallPrompt = null;
window.addEventListener('beforeinstallprompt', event => {
  event.preventDefault();
  deferredInstallPrompt = event;
  document.getElementById('installPwaBtn')?.classList.remove('hidden');
});

document.getElementById('installPwaBtn')?.addEventListener('click', async () => {
  if (!deferredInstallPrompt) return;
  deferredInstallPrompt.prompt();
  try { await deferredInstallPrompt.userChoice; } catch (e) { /* user dismissed */ }
  deferredInstallPrompt = null;
  document.getElementById('installPwaBtn')?.classList.add('hidden');
});

window.addEventListener('appinstalled', () => {
  deferredInstallPrompt = null;
  document.getElementById('installPwaBtn')?.classList.add('hidden');
});
