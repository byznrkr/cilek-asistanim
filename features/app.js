const $ = (id) => document.getElementById(id);

const headerLocation = $("headerLocation");
const settingsButton = $("settingsButton");
const settingsCloseButton = $("settingsCloseButton");
const resetInsideSettings = $("resetInsideSettings");
const onboardingSection = $("onboardingSection");
const onboardingForm = $("onboardingForm");
const cityInput = $("cityInput");
const potDiameterInput = $("potDiameterInput");
const fieldAreaInput = $("fieldAreaInput");
const potSizeGroup = $("potSizeGroup");
const fieldSizeGroup = $("fieldSizeGroup");
const calendarSection = $("calendarSection");
const calendarIntro = $("calendarIntro");
const calendarGrid = $("calendarGrid");
const dayDetail = $("dayDetail");
const weatherPill = $("weatherPill");
const dailySecretText = $("dailySecretText");
const loadingOverlay = $("loadingOverlay");
const loadingText = $("loadingText");
const settingsPanel = $("settingsPanel");
const viewSwitch = $("viewSwitch");
const chatFab = $("chatFab");
const chatPanel = $("chatPanel");
const chatCloseBtn = $("chatCloseBtn");
const chatMessages = $("chatMessages");
const chatForm = $("chatForm");
const chatInput = $("chatInput");
const chatPhotoInput = $("chatPhotoInput");

let appState = {
  profile: null,
  calendarDays: [],
  view: "month",
  currentTempC: null,
};

/**
 * @param {number} diameter - Saksı çapı (cm)
 * @param {number} temp - Ortam sıcaklığı (°C)
 * @param {string} stage - Bitki evresi ('fide', 'cicek', 'meyve')
 * @returns {number} - Verilecek su miktarı (ml)
 */
function calculateWaterAmount(diameter, temp, stage) {
  let baseAmount = diameter * 10;
  let tempMultiplier = temp > 25 ? 1 + (temp - 25) * 0.05 : 1;
  let stageMultiplier = stage === "cicek" || stage === "meyve" ? 1.3 : 1;
  let totalWater = baseAmount * tempMultiplier * stageMultiplier;
  return Math.round(totalWater);
}

/** Takvim gününe göre basit evre (30 günlük plan için) */
function getPlantStageForDay(dayNumber) {
  if (dayNumber <= 10) return "fide";
  if (dayNumber <= 20) return "cicek";
  return "meyve";
}

function truncateText(text, maxLen) {
  const t = String(text || "").trim();
  if (t.length <= maxLen) return t;
  return `${t.slice(0, maxLen - 1)}…`;
}

function parseTempFromWeatherString(summary) {
  if (!summary || typeof summary !== "string") return null;
  const m = summary.match(/:\s*(-?\d+)\s*C/i);
  return m ? Number(m[1]) : null;
}

function buildWaterAmountLine(day) {
  const p = appState.profile;
  if (!p || p.growType !== "Saksi" || day.emoji !== "💧") {
    return (
      day.amount ||
      (p?.growType === "Saksi" ? "Orn: 300ml su" : "Hava durumuna gore ayarla")
    );
  }
  const diameter = p.potDiameterCm > 0 ? p.potDiameterCm : 20;
  const temp = appState.currentTempC ?? 22;
  const stage = getPlantStageForDay(Number(day.day) || 1);
  const ml = calculateWaterAmount(diameter, temp, stage);
  return `${ml}ml su (cap ${diameter}cm, ~${temp}°C, evre: ${stage})`;
}

function setLoading(isLoading, message = "Yukleniyor...") {
  if (isLoading) {
    loadingText.textContent = message;
    loadingOverlay.classList.remove("hidden");
  } else {
    loadingOverlay.classList.add("hidden");
    loadingText.textContent = "Yukleniyor...";
  }
}

function saveProfile(profile) {
  localStorage.setItem("strawberryProfile", JSON.stringify(profile));
  appState.profile = profile;
}

function mapEmojiToName(emoji) {
  const map = {
    "💧": "Su",
    "🌱": "Ekim",
    "🧪": "Besin",
    "⛏️": "Capa",
    "✂️": "Budama",
    "🌞": "Isik",
    "🧤": "Hasat",
    "❄️": "Koruma",
  };
  return map[emoji] || "Gorev";
}

function renderProfile(profile) {
  const icon = profile.growType === "Saksi" ? "🌿" : "🚜";
  headerLocation.textContent = `📍 ${profile.city} | ${icon} ${profile.growType} | ${profile.userLevel}`;
  calendarIntro.textContent =
    profile.growType === "Saksi"
      ? `${profile.city} icin saksi odakli plan hazirlandi. Don yerine ic mekan, toprak nemi ve ml sulama odakta.`
      : `${profile.city} icin tarla odakli plan hazirlandi. Don, yagis, UV ve ruzgar riskleri odakta.`;
}

function renderSecret(tip) {
  dailySecretText.textContent = tip || "Bugun cilek koklerini asiri sulamadan koru.";
}

function showCalendar() {
  onboardingSection.classList.add("hidden");
  calendarSection.classList.remove("hidden");
}

function showOnboarding() {
  onboardingSection.classList.remove("hidden");
  calendarSection.classList.add("hidden");
  settingsPanel.classList.add("hidden");
}

function buildDayCell(day) {
  const btn = document.createElement("button");
  btn.type = "button";
  const isWeek = appState.view === "week";
  btn.className = isWeek ? "day-cell day-cell--week" : "day-cell";
  const name = day.taskName || mapEmojiToName(day.emoji);
  const shortTask = truncateText(day.task || "", isWeek ? 48 : 0);
  if (isWeek) {
    btn.innerHTML = `
      <span class="date-no">${day.day}. gun</span>
      <span class="emoji-row"><span class="emoji">${day.emoji}</span> <span class="task-name">${name}</span></span>
      <span class="task-preview">${shortTask}</span>
    `;
  } else {
    btn.innerHTML = `<span class="date-no">${day.day}</span><span class="emoji">${day.emoji}</span>`;
  }
  btn.addEventListener("click", () => renderDayDetail(day));
  return btn;
}

function renderDayDetail(day) {
  dayDetail.classList.remove("hidden");
  const miktarLine = buildWaterAmountLine(day);
  dayDetail.textContent = [
    `Gorev: ${day.emoji} ${day.taskName || mapEmojiToName(day.emoji)}`,
    `Detay: ${day.detail || day.task || "Bitkiyi gozlemle ve gerekirse mudahale et."}`,
    `Miktar: ${miktarLine}`,
  ].join("\n");
}

function renderCalendarView() {
  const all = appState.calendarDays;
  const days = appState.view === "week" ? all.slice(0, 7) : all;
  calendarGrid.classList.toggle("calendar-grid--week", appState.view === "week");
  calendarGrid.innerHTML = "";
  days.forEach((day) => calendarGrid.appendChild(buildDayCell(day)));
  dayDetail.classList.add("hidden");
}

function setView(view) {
  appState.view = view;
  [...viewSwitch.querySelectorAll(".switch-btn")].forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.view === view);
  });
  renderCalendarView();
}

async function fetchAiCalendar(profile) {
  const response = await fetch("/api/calendar", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(profile),
  });
  if (!response.ok) throw new Error("Takvim olusturulamadi.");
  return response.json();
}

async function sendChatMessage(message, imageBase64, mimeType) {
  const response = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message,
      imageBase64,
      mimeType,
      profile: appState.profile,
    }),
  });
  if (!response.ok) throw new Error("Sohbet servisi hatasi");
  return response.json();
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = String(reader.result || "");
      const base64 = dataUrl.split(",")[1];
      if (!base64) return reject(new Error("Gecersiz fotograf"));
      resolve(base64);
    };
    reader.onerror = () => reject(new Error("Dosya okunamadi"));
    reader.readAsDataURL(file);
  });
}

function pushChat(role, text) {
  const box = document.createElement("div");
  box.className = `chat-message ${role}`;
  box.textContent = text;
  chatMessages.appendChild(box);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function resetApp() {
  localStorage.removeItem("strawberryProfile");
  headerLocation.textContent = "📍 Sehir Secilmedi | 🌿 Tip Secilmedi";
  onboardingForm.reset();
  appState = { profile: null, calendarDays: [], view: "month", currentTempC: null };
  calendarGrid.innerHTML = "";
  dayDetail.classList.add("hidden");
  renderSecret("");
  weatherPill.textContent = "Hava durumu yok";
  settingsPanel.classList.add("hidden");
  chatPanel.classList.add("hidden");
  chatMessages.innerHTML = '<div class="chat-message bot">Merhaba! Cilek bakimi ile ilgili sorunu yazabilirsin.</div>';
  potSizeGroup.classList.add("hidden");
  fieldSizeGroup.classList.add("hidden");
  setLoading(false);
  showOnboarding();
}

function applyTheme(theme) {
  if (theme === "system") {
    const dark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    document.body.classList.toggle("dark-theme", dark);
    localStorage.setItem("appTheme", "system");
    highlightThemeButton("system");
    return;
  }
  document.body.classList.toggle("dark-theme", theme === "dark");
  localStorage.setItem("appTheme", theme);
  highlightThemeButton(theme);
}

function applySavedTheme() {
  const saved = localStorage.getItem("appTheme") || "light";
  applyTheme(saved);
  highlightThemeButton(saved);
}

function highlightThemeButton(theme) {
  [...document.querySelectorAll(".theme-btn")].forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.theme === theme);
  });
}

settingsButton.addEventListener("click", () => {
  settingsPanel.classList.toggle("hidden");
});
settingsCloseButton.addEventListener("click", () => settingsPanel.classList.add("hidden"));
resetInsideSettings.addEventListener("click", resetApp);

[...document.querySelectorAll(".theme-btn")].forEach((btn) => {
  btn.addEventListener("click", () => applyTheme(btn.dataset.theme));
});

viewSwitch.addEventListener("click", (event) => {
  const btn = event.target.closest(".switch-btn");
  if (!btn) return;
  setView(btn.dataset.view);
});

chatFab.addEventListener("click", () => chatPanel.classList.toggle("hidden"));
chatCloseBtn.addEventListener("click", () => chatPanel.classList.add("hidden"));

chatForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const text = chatInput.value.trim();
  const file = chatPhotoInput.files?.[0];
  if (!text && !file) return;

  pushChat("user", text || "📷 Fotograf gonderildi");
  chatInput.value = "";
  setLoading(true, "Cilek Ustasi dusunuyor...");
  try {
    let imageBase64 = "";
    let mimeType = "";
    if (file) {
      imageBase64 = await fileToBase64(file);
      mimeType = file.type || "image/jpeg";
      chatPhotoInput.value = "";
    }
    const data = await sendChatMessage(text, imageBase64, mimeType);
    pushChat("bot", data.reply || "Yanit alinamadi.");
  } catch (error) {
    pushChat("bot", "Sohbet servisine su an ulasilamiyor.");
  } finally {
    setLoading(false);
  }
});

onboardingForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const city = cityInput.value.trim();
  const formData = new FormData(onboardingForm);
  const growType = formData.get("growType");
  const userLevel = formData.get("userLevel");
  const potDiameterCm = Number(potDiameterInput.value || 0);
  const fieldAreaHa = Number(fieldAreaInput.value || 0);

  if (!city || !growType || !userLevel) return;

  const profile = {
    city,
    growType: String(growType),
    userLevel: String(userLevel),
    potDiameterCm,
    fieldAreaHa,
  };

  saveProfile(profile);
  renderProfile(profile);
  showCalendar();
  setLoading(true, "Takvim hazirlaniyor...");

  try {
    const result = await fetchAiCalendar(profile);
    appState.calendarDays = Array.isArray(result.days) ? result.days : [];
    appState.currentTempC = typeof result.currentTempC === "number" 
      ? result.currentTempC 
      : parseTempFromWeatherString(result.weatherSummary);
    weatherPill.textContent = result.weatherSummary || "Hava verisi alindi";
    renderSecret(result.dailyTip);

  } catch (error) {
    console.warn("Sunucuya ulasilamadi, yedek takvim yukleniyor...");
   appState.calendarDays = [
  // 🌱 FİDE DÖNEMİ (1–10)
  { day: 1, emoji: "🌱", taskName: "Dikim", task: "Fideyi saksıya dik", detail: "Dikim sonrası can suyu ver." },
  { day: 2, emoji: "💧", taskName: "Su", task: "Toprak nemini kontrol et", detail: "Nemliyse sulama yapma." },
  { day: 3, emoji: "☀️", taskName: "Işık", task: "Aydınlık yere koy", detail: "Direkt yakıcı güneşten koru." },
  { day: 4, emoji: "💧", taskName: "Su", task: "Az miktarda sulama", detail: "Saksı altı su dolmasın." },
  { day: 5, emoji: "🧪", taskName: "Besin", task: "Hafif besin ver", detail: "Fideyi desteklemek için sıvı gübre kullan." },
  { day: 6, emoji: "💧", taskName: "Su", task: "Nem kontrolü", detail: "Toprak kuruduysa sulama yap." },
  { day: 7, emoji: "🌞", taskName: "Işık", task: "Güneş süresini artır", detail: "Yavaş yavaş güneşe alıştır." },
  { day: 8, emoji: "💧", taskName: "Su", task: "Dengeli sulama", detail: "Aşırıya kaçma." },
  { day: 9, emoji: "🧪", taskName: "Besin", task: "İkinci besin", detail: "Kök gelişimi için destek ver." },
  { day: 10, emoji: "🔍", taskName: "Kontrol", task: "Yaprakları incele", detail: "Hastalık belirtisi var mı bak." },

  // 🌸 ÇİÇEKLENME (11–20)
  { day: 11, emoji: "🌸", taskName: "Çiçek", task: "Çiçeklenme başladı", detail: "Bitkiyi stresten koru." },
  { day: 12, emoji: "💧", taskName: "Su", task: "Düzenli sulama", detail: "Toprak sürekli hafif nemli olsun." },
  { day: 13, emoji: "🐝", taskName: "Tozlaşma", task: "Hafif sallama", detail: "Tozlaşmayı destekle." },
  { day: 14, emoji: "🧪", taskName: "Besin", task: "Çiçek gübresi", detail: "Potasyum ağırlıklı gübre kullan." },
  { day: 15, emoji: "💧", taskName: "Su", task: "Kontrollü sulama", detail: "Çiçeklere su değdirmemeye çalış." },
  { day: 16, emoji: "☀️", taskName: "Işık", task: "Güneş kontrolü", detail: "Günde 6 saat ışık ideal." },
  { day: 17, emoji: "🔍", taskName: "Kontrol", task: "Zararlı kontrolü", detail: "Yaprak altlarını incele." },
  { day: 18, emoji: "💧", taskName: "Su", task: "Toprak kontrolü", detail: "Kurudukça sulama yap." },
  { day: 19, emoji: "🧪", taskName: "Besin", task: "Takviye gübre", detail: "Meyve oluşumunu destekler." },
  { day: 20, emoji: "🌸", taskName: "Çiçek", task: "Yeni çiçekler", detail: "Sağlıklı gelişimi gözlemle." },

  // 🍓 MEYVE DÖNEMİ (21–30)
  { day: 21, emoji: "🍓", taskName: "Meyve", task: "Meyve oluşumu", detail: "Sulamayı düzenli yap." },
  { day: 22, emoji: "💧", taskName: "Su", task: "Dengeli sulama", detail: "Aşırı sulama çürütür." },
  { day: 23, emoji: "☀️", taskName: "Işık", task: "Güneş desteği", detail: "Tat için güneş önemli." },
  { day: 24, emoji: "🧪", taskName: "Besin", task: "Meyve besini", detail: "Şeker oranını artırır." },
  { day: 25, emoji: "💧", taskName: "Su", task: "Nem kontrolü", detail: "Toprak hafif nemli kalmalı." },
  { day: 26, emoji: "🔍", taskName: "Kontrol", task: "Meyveleri incele", detail: "Çürük var mı bak." },
  { day: 27, emoji: "🍓", taskName: "Olgunlaşma", task: "Renk kontrolü", detail: "Kırmızılaşanları takip et." },
  { day: 28, emoji: "💧", taskName: "Su", task: "Az sulama", detail: "Hasada yakın suyu azalt." },
  { day: 29, emoji: "🧤", taskName: "Hasat", task: "İlk hasat", detail: "Olgun meyveleri topla." },
  { day: 30, emoji: "🧤", taskName: "Hasat", task: "Devam eden hasat", detail: "Yeni meyveleri toplamaya devam et." }
];
    weatherPill.textContent = "Çevrimdışı Mod: Örnek Takvim";
    appState.currentTempC = null;
    renderSecret("İnternet bağlantısı kısıtlı, yerel rehber aktif.");
  } finally {
    setView(appState.view);
    setLoading(false);
  }
});
  

onboardingForm.addEventListener("change", () => {
  const growType = new FormData(onboardingForm).get("growType");
  if (growType === "Saksi") {
    potSizeGroup.classList.remove("hidden");
    fieldSizeGroup.classList.add("hidden");
  } else if (growType === "Tarla") {
    fieldSizeGroup.classList.remove("hidden");
    potSizeGroup.classList.add("hidden");
  }
});

applySavedTheme();
