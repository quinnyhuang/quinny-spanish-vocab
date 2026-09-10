const { useState, useEffect, useMemo, useCallback } = React;

// ---------------------------------------------------------------------------
// Lightweight inline-SVG icons (replaces lucide-react, which needs a bundler)
// ---------------------------------------------------------------------------
const Icon = ({ children, size = 16, ...props }) =>
  React.createElement(
    "svg",
    {
      width: size,
      height: size,
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: 2,
      strokeLinecap: "round",
      strokeLinejoin: "round",
      ...props,
    },
    children
  );

const Check = (props) =>
  React.createElement(Icon, props, React.createElement("polyline", { points: "20 6 9 17 4 12" }));

const X = (props) =>
  React.createElement(
    Icon,
    props,
    React.createElement("line", { x1: 18, y1: 6, x2: 6, y2: 18 }),
    React.createElement("line", { x1: 6, y1: 6, x2: 18, y2: 18 })
  );

const RotateCcw = (props) =>
  React.createElement(
    Icon,
    props,
    React.createElement("polyline", { points: "1 4 1 10 7 10" }),
    React.createElement("path", { d: "M3.51 15a9 9 0 1 0 2.13-9.36L1 10" })
  );

const Volume2 = (props) =>
  React.createElement(
    Icon,
    props,
    React.createElement("polygon", { points: "11 5 6 9 2 9 2 15 6 15 11 19 11 5" }),
    React.createElement("path", { d: "M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" })
  );

const BookOpenCheck = (props) =>
  React.createElement(
    Icon,
    props,
    React.createElement("path", { d: "M12 21V7" }),
    React.createElement("path", {
      d: "M16 12l2 2 4-4M22 6v13a1 1 0 0 1-1 1h-5a4 4 0 0 0-4 2 4 4 0 0 0-4-2H3a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h5a4 4 0 0 1 4 2 4 4 0 0 1 4-2h5a1 1 0 0 1 1 1z",
    })
  );

const Info = (props) =>
  React.createElement(
    Icon,
    props,
    React.createElement("circle", { cx: 12, cy: 12, r: 10 }),
    React.createElement("line", { x1: 12, y1: 16, x2: 12, y2: 12 }),
    React.createElement("line", { x1: 12, y1: 8, x2: 12.01, y2: 8 })
  );

const ArrowLeft = (props) =>
  React.createElement(
    Icon,
    props,
    React.createElement("line", { x1: 19, y1: 12, x2: 5, y2: 12 }),
    React.createElement("polyline", { points: "12 19 5 12 12 5" })
  );

const Star = ({ fill = "none", stroke = "currentColor", size = 16, ...props }) =>
  React.createElement(
    "svg",
    { width: size, height: size, viewBox: "0 0 24 24", fill, stroke, strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round", ...props },
    React.createElement("polygon", {
      points: "12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2",
    })
  );

const Play = (props) =>
  React.createElement(Icon, props, React.createElement("polygon", { points: "5 3 19 12 5 21 5 3" }));

// v4.9.0: added for the check-in calendar / streak / points feature, and to
// replace the 📘 emoji on the plural sub-stage tile (user feedback: emoji
// render inconsistently across devices/system fonts; these inline-SVG icons
// match the rest of the app's icon style exactly instead).
const Sparkles = (props) =>
  React.createElement(
    Icon,
    props,
    React.createElement("path", {
      d: "m12 3-1.9 5.8a2 2 0 0 1-1.287 1.288L3 12l5.8 1.9a2 2 0 0 1 1.288 1.287L12 21l1.9-5.8a2 2 0 0 1 1.287-1.288L21 12l-5.8-1.9a2 2 0 0 1-1.288-1.287Z",
    })
  );

const CalendarIcon = (props) =>
  React.createElement(
    Icon,
    props,
    React.createElement("path", { d: "M8 2v4" }),
    React.createElement("path", { d: "M16 2v4" }),
    React.createElement("rect", { width: 18, height: 18, x: 3, y: 4, rx: 2 }),
    React.createElement("path", { d: "M3 10h18" })
  );

const Flame = (props) =>
  React.createElement(
    Icon,
    props,
    React.createElement("path", {
      d: "M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z",
    })
  );

const Lock = (props) =>
  React.createElement(
    Icon,
    props,
    React.createElement("rect", { width: 18, height: 11, x: 3, y: 11, rx: 2, ry: 2 }),
    React.createElement("path", { d: "M7 11V7a5 5 0 0 1 10 0v4" })
  );

// v4.20.0(改動G): 「圖書館」大單元的導覽用圖示(單純開書造型，跟標題用的
// BookOpenCheck 區分開來，避免兩個按鈕視覺太像)。
const BookOpen = (props) =>
  React.createElement(
    Icon,
    props,
    React.createElement("path", { d: "M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" }),
    React.createElement("path", { d: "M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" })
  );

// v4.20.0(改動H1): 每日隨堂測驗入口用的圖示。
const Target = (props) =>
  React.createElement(
    Icon,
    props,
    React.createElement("circle", { cx: 12, cy: 12, r: 10 }),
    React.createElement("circle", { cx: 12, cy: 12, r: 6 }),
    React.createElement("circle", { cx: 12, cy: 12, r: 2 })
  );

// v4.21.0: 圖書館分類 pill 用的 6 個統一風格線條圖示，取代原本的 emoji
// (🔤🗣️👤🏠🪞❓)。跟主 App icon 同一套視覺語言：線條 + 圓角，用
// currentColor 上色，所以 pill 未選中/選中時顏色可以直接靠外層 style 控制，
// 不用另外準備兩套圖示。
const IconAlphabet = (props) =>
  React.createElement(
    Icon,
    props,
    React.createElement("path", {
      d: "M4 4 h16 M4 4 v16 M4 20 h4 M4 12 h6 M13 8 v12 M13 8 h5 a3 3 0 0 1 0 6 h-5",
    })
  );

const IconSoundwave = (props) =>
  React.createElement(
    Icon,
    props,
    React.createElement("path", { d: "M4 15 V9 a2 2 0 0 1 2 -2 h1 a2 2 0 0 1 2 2 v6" }),
    React.createElement("path", { d: "M4 12 h5" }),
    React.createElement("path", { d: "M15 15 V9 a2 2 0 0 1 2 -2 a2 2 0 0 1 2 2 v6" }),
    React.createElement("path", { d: "M15 12 h4" })
  );

const IconPeople = (props) =>
  React.createElement(
    Icon,
    props,
    React.createElement("circle", { cx: 9, cy: 8, r: 3 }),
    React.createElement("path", { d: "M4 20 c0 -3.5 2.5 -6 5 -6 s5 2.5 5 6" }),
    React.createElement("circle", { cx: 18, cy: 9, r: 2.3 }),
    React.createElement("path", { d: "M15.5 20 c0 -2.8 1.5 -5 2.5 -5 s2.5 2.2 2.5 5" })
  );

const IconShield = (props) =>
  React.createElement(
    Icon,
    props,
    React.createElement("path", { d: "M12 3 l7 4 v5 c0 5 -3 8 -7 9 c-4 -1 -7 -4 -7 -9 v-5 z" })
  );

const IconReflexive = (props) =>
  React.createElement(
    Icon,
    props,
    React.createElement("path", { d: "M4 12 a8 8 0 0 1 14 -5.3" }),
    React.createElement("path", { d: "M18 3 v4 h-4" }),
    React.createElement("path", { d: "M20 12 a8 8 0 0 1 -14 5.3" }),
    React.createElement("path", { d: "M6 21 v-4 h4" })
  );

const IconInvertedQuestion = ({ size = 16, color = "currentColor", ...props }) =>
  React.createElement(
    "svg",
    { width: size, height: size, viewBox: "0 0 24 24", ...props },
    React.createElement(
      "text",
      {
        x: 12,
        y: 18,
        fontSize: 17,
        fill: color,
        textAnchor: "middle",
        fontFamily: "Georgia, serif",
        fontWeight: 700,
      },
      "¿"
    )
  );

// v4.21.0(改動I): 「子音規則」pill 用的圖示——用一個對話框內含「abc」的
// 意象代表「逐字母查閱的發音細則」，跟「發音規則」的音波圖示做出區別。
const IconConsonant = (props) =>
  React.createElement(
    Icon,
    props,
    React.createElement("rect", { x: 3, y: 5, width: 18, height: 12, rx: 3 }),
    React.createElement("path", { d: "M7 20 l3 -3" }),
    React.createElement("path", { d: "M7 10.5 h2.2 M7 14 h1.4" }),
    React.createElement("path", { d: "M13 14 v-3.5 a1.75 1.75 0 1 1 3.5 0 v3.5" })
  );

// v4.21.0(改動J): 「母音與雙三母音」pill 用的圖示——兩個交疊的圓，代表兩個
// 母音黏在一起變成一個雙母音的意象。
const IconVowelPair = (props) =>
  React.createElement(
    Icon,
    props,
    React.createElement("circle", { cx: 9, cy: 12, r: 6 }),
    React.createElement("circle", { cx: 15, cy: 12, r: 6 })
  );

// v4.21.0(改動J): 「音節劃分」pill 用的圖示——三個分開的方塊，代表一個字被
// 切成好幾個音節的意象。
const IconSyllableSplit = (props) =>
  React.createElement(
    Icon,
    props,
    React.createElement("rect", { x: 3, y: 7, width: 4.5, height: 10, rx: 1.3 }),
    React.createElement("rect", { x: 10, y: 7, width: 4.5, height: 10, rx: 1.3 }),
    React.createElement("rect", { x: 17, y: 7, width: 4, height: 10, rx: 1.3 })
  );

// v4.21.0(改動J): 「語調與連音」pill 用的圖示——一條先升、持平、再降的曲線，
// 直接對應課本裡畫的肯定句語調曲線。
const IconIntonationCurve = (props) =>
  React.createElement(Icon, props, React.createElement("path", { d: "M3 16 C 7 6, 17 6, 21 16" }));

// ===========================================================================
// Config
// ===========================================================================
const STAGE_SIZE = 10; // words per small stage (小關)
const CHAPTERS_STAGE_COUNT = 10; // stages per chapter (大關) -> 100 words/chapter
// NOTE: architecture supports growing to 1000-word chapters (like a 7000-word
// list split into 1000/2000/3000...). Content is currently smaller, so most
// levels will only render a single chapter for now.

// ---------------------------------------------------------------------------
// Spaced-repetition config
// ---------------------------------------------------------------------------
// After a stage is first completed ("Day 1"), the app reminds the learner to
// come back and review on Day 2, Day 3, Day 7 and Day 14 (offsets below, in
// days, counted from the Day-1 completion date). This is a fixed-interval
// schedule (not a full SM-2 algorithm) intentionally kept simple so it's easy
// to reason about and to reuse for the mistake-book cycle below.
// Days-after-day1Date offsets for each review step. day1Date IS day 1, so to
// land the reminders exactly on day 2 / 3 / 7 / 14 we add 1 / 2 / 6 / 13 days
// (previously [2,3,7,14], which fired everything one day late — see CHANGELOG).
const SRS_SCHEDULE = [1, 2, 6, 13];
// Reminders are shown only inside the app (a badge on the stage tile) when it
// is opened on/after the due date — this is a static, backend-less HTML file
// so there is no way to reliably push notifications while the app is closed.
const MISTAKE_INFO = { label: "錯題本", color: "#C0392B", light: "#F5D9D4" };
const LOCAL_STORAGE_KEY = "esVocabApp.v1";

// ---------------------------------------------------------------------------
// App info / version (shown on the "說明" screen)
// ---------------------------------------------------------------------------
// v4.18.0 item①(純加單字不用碰 app.js): APP_MAKER/APP_VERSION/APP_UPDATED/
// CHANGELOG moved OUT of this file into their own changelog.js (loaded as a
// plain global-scope <script>, same pattern as word_bank.js/theme_bank.js/
// audio_map.js — no import needed, just referenced as globals below). This
// means a release that's PURELY new vocabulary/theme data now only touches
// word_bank.js/theme_bank.js/audio_map.js + changelog.js — app.js (built
// from THIS file) genuinely does not change. To bump the version, edit
// changelog.js, not here.

// ===========================================================================
// Data: CEFR-leveled Spanish vocabulary
// ===========================================================================
const LEVELS = ["A1", "A2", "B1", "B2"];

const LEVEL_INFO = {
  A1: { label: "入門", color: "#5B7F5A", light: "#E7EFE3" },
  A2: { label: "初級", color: "#8A8A3C", light: "#F1F0DE" },
  B1: { label: "中級", color: "#B98A2E", light: "#F6EAD3" },
  B2: { label: "中高級", color: "#B85C2E", light: "#F5E0D0" },
};


// ===========================================================================
// Data: themed mini-units
// ===========================================================================
const THEMES = [
  "pronombres",
  "numeros",
  "preguntas",
  "dias",
  "meses",
  "estaciones",
  "comida",
  "paises",
  "historia",
  "coloquial",
  "tecnologia",
  "festividades",
  "hogar",
  "ropa",
  "transporte",
  "compras",
  "salud",
  "relaciones",
  "emociones",
  "trabajo",
  "escuela",
  "naturaleza",
  "ciudad",
  "descripciones",
  "ocio",
];

const THEME_INFO = {
  pronombres: { label: "人稱代名詞", icon: "🙋", color: "#3E6E8E", light: "#DCE8EF" },
  numeros: { label: "數字", icon: "🔢", color: "#5B7F5A", light: "#E3EEE1" },
  preguntas: { label: "5W1H", icon: "❓", color: "#7A5A9E", light: "#EAE1F1" },
  dias: { label: "星期", icon: "📅", color: "#3E7E7E", light: "#DDEDED" },
  meses: { label: "月份", icon: "🗓️", color: "#8A6A3C", light: "#F0E7D6" },
  estaciones: { label: "季節", icon: "🍂", color: "#B06A2E", light: "#F3E2D2" },
  comida: { label: "食物", icon: "🍞", color: "#B98A2E", light: "#F6EAD3" },
  paises: { label: "國家名稱", icon: "🌍", color: "#3E6E5E", light: "#DDEDE6" },
  historia: { label: "歷史", icon: "🏛️", color: "#7A4A3A", light: "#EDE0DA" },
  coloquial: { label: "道地口語／俚語", icon: "💬", color: "#A13A5A", light: "#F2DCE4" },
  tecnologia: { label: "科技與現代生活", icon: "💻", color: "#4A5FA0", light: "#E2E5F3" },
  festividades: { label: "節慶與文化", icon: "🏮", color: "#C24E3A", light: "#F8E0D8" },
  hogar: { label: "居家生活", icon: "🏠", color: "#A6673E", light: "#F1E3D5" },
  ropa: { label: "衣著服飾", icon: "👕", color: "#B5546B", light: "#F3DEE3" },
  transporte: { label: "交通與出行", icon: "🚌", color: "#4A7FA5", light: "#DFEAF2" },
  compras: { label: "購物與金錢", icon: "🛍️", color: "#9B8B3D", light: "#EEEAD1" },
  salud: { label: "身體與健康", icon: "🩺", color: "#3D8F7A", light: "#DBEFE9" },
  relaciones: { label: "人與關係", icon: "👨‍👩‍👧", color: "#C97B5A", light: "#F5E3DA" },
  emociones: { label: "情緒、個性與感受", icon: "😊", color: "#8A5FA8", light: "#EBE1F2" },
  trabajo: { label: "工作與職場", icon: "💼", color: "#38517A", light: "#DCE3EE" },
  escuela: { label: "學校與學習", icon: "🎓", color: "#2E8288", light: "#D9EEEF" },
  naturaleza: { label: "自然與環境", icon: "🌿", color: "#4C7A3D", light: "#E0EDDA" },
  ciudad: { label: "城市與公共場所", icon: "🏙️", color: "#8A7B6B", light: "#EFEAE2" },
  descripciones: { label: "描述與形容", icon: "🎨", color: "#93567E", light: "#EEE0EA" },
  ocio: { label: "興趣、娛樂與休閒", icon: "🎮", color: "#C4832E", light: "#F5E5CC" },
};


// ===========================================================================
// Utilities
// ===========================================================================
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function chunkStages(words) {
  const stages = [];
  for (let i = 0; i < words.length; i += STAGE_SIZE) {
    stages.push({ index: stages.length, words: words.slice(i, i + STAGE_SIZE) });
  }
  return stages;
}

// v4.17.0 item⑧⑨: a couple of themes have too few words to split cleanly
// by the fixed STAGE_SIZE=10 rule — pronombres has 11 words (would become
// a 10-word stage + a lonely 1-word stage) and meses has exactly 12 (a
// 10-word stage + a 2-word stage). Both read more naturally as a single
// stage covering the whole theme. Only theme mode uses this; level banks
// (A1-B2) always use the regular fixed-size chunking.
const SINGLE_STAGE_THEMES = ["pronombres", "meses"];

function chunkStagesForTheme(themeKey, words) {
  if (SINGLE_STAGE_THEMES.includes(themeKey)) {
    return words.length ? [{ index: 0, words }] : [];
  }
  return chunkStages(words);
}

function chunkChapters(stages) {
  const chapters = [];
  for (let i = 0; i < stages.length; i += CHAPTERS_STAGE_COUNT) {
    const stageSlice = stages.slice(i, i + CHAPTERS_STAGE_COUNT);
    const firstWordNum = i * STAGE_SIZE + 1;
    const lastWordNum = i * STAGE_SIZE + stageSlice.reduce((n, s) => n + s.words.length, 0);
    chapters.push({ index: chapters.length, stages: stageSlice, range: `${firstWordNum}-${lastWordNum}` });
  }
  return chapters;
}

function normalizeEs(str) {
  return str
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ");
}

// Some entries store alternate forms in one field, e.g. "tío / tía" or
// "cabrón/a". Accept a match against the full string OR any "/"-separated
// piece, so users aren't forced to type the exact combined notation.
// Accents are already stripped by normalizeEs, so plain English-keyboard
// typing (e.g. "nino" for "niño") is accepted automatically.
function checkSpellingAnswer(input, target) {
  const normInput = normalizeEs(input);
  if (!target.includes("/")) {
    return normInput === normalizeEs(target);
  }
  const variants = target.split("/").map((piece) => normalizeEs(piece));
  const noSlash = normalizeEs(target.replace(/\//g, ""));
  return variants.includes(normInput) || normInput === normalizeEs(target) || normInput === noSlash;
}

function masteryTier(bestAccuracy) {
  if (bestAccuracy == null) return { label: "尚未挑戰", stars: 0, color: "#A99B85" };
  if (bestAccuracy >= 100) return { label: "精通", stars: 3, color: "#D4A24C" };
  if (bestAccuracy >= 80) return { label: "熟練", stars: 3, color: "#5B8C5A" };
  if (bestAccuracy >= 50) return { label: "略熟", stars: 2, color: "#B98A2E" };
  return { label: "尚未熟悉", stars: 1, color: "#A13A2F" };
}

// ---------------------------------------------------------------------------
// Pre-generated pronunciation audio.
//
// v4.4.0: instead of relying on whatever TTS voice the user's browser/OS
// happens to pick at runtime (unreliable — see CHANGELOG v4.3.1/v4.4.0),
// every word now has an actual pre-generated audio file (espeak-ng,
// offline, rule-based Spanish phonemes — guaranteed to actually be
// Spanish, even if it sounds a bit synthetic/robotic rather than a real
// native speaker). AUDIO_MAP maps each word's `es` text to its mp3
// filename under the `audio/` folder that ships next to this HTML file.
// If a word has no entry (e.g. newly added and audio not yet generated),
// speak() falls back to the browser's own SpeechSynthesis TTS below.
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Text-to-speech voice selection.
//
// The browser's SpeechSynthesis API, if you only set `utterance.lang`,
// silently falls back to whatever "closest match" voice the OS/browser
// picks — on a machine whose system language is Chinese, that's often a
// multilingual engine voice that reads Spanish with a heavy Chinese accent
// instead of a proper native Spanish voice, even though a real es-ES/es-US
// voice is usually also installed and just wasn't chosen. We fix this by
// explicitly listing available voices, filtering to Spanish ones, and
// ranking them so a genuine native-sounding voice is picked instead of
// letting the browser default silently pick a bad one.
// ---------------------------------------------------------------------------
let cachedSpanishVoice = null;
let spanishVoiceResolved = false;

function scoreSpanishVoice(voice) {
  const lang = (voice.lang || "").toLowerCase();
  const name = (voice.name || "").toLowerCase();
  if (!lang.startsWith("es")) return -1;
  let score = 0;
  // Prefer Spain Spanish since the app's example sentences use vosotros etc.,
  // but any Spanish variant is far better than a non-Spanish fallback voice.
  if (lang === "es-es") score += 5;
  else if (lang.startsWith("es-")) score += 3;
  else score += 1;
  // Voices from major cloud TTS engines tend to sound native; local/compact
  // "eSpeak"-style engines tend to sound robotic or mispronounce Spanish.
  if (/google/.test(name)) score += 6;
  if (/microsoft/.test(name)) score += 5;
  if (/natural|neural|online|enhanced|premium|wavenet/.test(name)) score += 4;
  if (/compact|espeak|robot/.test(name)) score -= 4;
  if (voice.localService === false) score += 1; // cloud-backed voices are usually higher quality
  return score;
}

function pickBestSpanishVoice() {
  try {
    const voices = window.speechSynthesis.getVoices() || [];
    if (!voices.length) return null;
    const ranked = voices
      .map((v) => ({ v, score: scoreSpanishVoice(v) }))
      .filter((x) => x.score >= 0)
      .sort((a, b) => b.score - a.score);
    return ranked.length ? ranked[0].v : null;
  } catch (e) {
    return null;
  }
}

function refreshSpanishVoice() {
  const found = pickBestSpanishVoice();
  if (found) {
    cachedSpanishVoice = found;
    spanishVoiceResolved = true;
  }
}

if (typeof window !== "undefined" && window.speechSynthesis) {
  // Voice list often loads asynchronously (esp. Chrome) — try immediately
  // and again once the browser tells us the list is ready/changed.
  refreshSpanishVoice();
  window.speechSynthesis.onvoiceschanged = refreshSpanishVoice;
}

// ---------------------------------------------------------------------------
// Spaced-repetition helpers
// ---------------------------------------------------------------------------
function todayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function addDaysStr(dateStr, days) {
  const d = new Date(`${dateStr}T00:00:00`);
  d.setDate(d.getDate() + days);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

// ---------------------------------------------------------------------------
// v4.9.0: check-in / streak / points helpers
// ---------------------------------------------------------------------------
// Monday-start day-of-week index (0 = Monday ... 6 = Sunday), used so "一整週
// 全勤" lines up with a normal calendar week rather than a rolling 7-day
// window (confirmed with the user — 日曆週一到週日).
function mondayIndex(dateStr) {
  const jsDay = new Date(`${dateStr}T00:00:00`).getDay(); // 0=Sun..6=Sat
  return (jsDay + 6) % 7;
}

// The Monday that starts dateStr's calendar week, as a "YYYY-MM-DD" string.
function weekStartStr(dateStr) {
  return addDaysStr(dateStr, -mondayIndex(dateStr));
}

// A stable key identifying a Mon–Sun week (just uses the Monday's date —
// simpler and just as unique as an ISO "YYYY-Wnn" label, no week-numbering
// edge cases to worry about at year boundaries).
function weekKeyFor(dateStr) {
  return weekStartStr(dateStr);
}

// All 7 "YYYY-MM-DD" dates (Monday..Sunday) of the week dateStr falls in.
function weekDates(dateStr) {
  const start = weekStartStr(dateStr);
  return Array.from({ length: 7 }, (_, i) => addDaysStr(start, i));
}

// Current consecutive-day streak. Counts backward from today if today is
// already checked in; otherwise counts backward from yesterday (a streak
// isn't considered "broken" just because today hasn't happened yet).
function computeStreak(checkins, today) {
  let cursor = checkins[today] ? today : addDaysStr(today, -1);
  let streak = 0;
  while (checkins[cursor]) {
    streak++;
    cursor = addDaysStr(cursor, -1);
  }
  return streak;
}

// v4.9.0 item④/⑤: point values, finalized with the user via AskUserQuestion
// on 2026-08-20 (see project doc for the derivation).
const POINTS_CHECKIN = 10;
const POINTS_STAGE_COMPLETE = 10;
const POINTS_FULL_WEEK_BONUS = 50;
// v4.20.0(改動H1): 每日隨堂測驗完成獎勵，使用者透過 AskUserQuestion 確認
// 「比小關卡略高，反映混合複習的量」——小關卡是 POINTS_STAGE_COMPLETE(10)。
const POINTS_DAILY_QUIZ = 15;

// v4.19.0(改動F): replaces the old "accumulate points, auto-unlock at a
// cumulative threshold, points never spent" model (A1 ch5/6 + whole A2/B1/B2
// levels) with a flat per-chapter SPEND economy, finalized with the user via
// AskUserQuestion on 2026-08-27:
//   - one flat price for every chapter, every level (no per-level curve)
//   - applies uniformly to ALL FOUR levels (A1/A2/B1/B2), not just A1 — so
//     there's no more whole-level lock, only per-chapter locks
//   - each level's FIRST chapter (chapterIdx 0, words 1-100) is always free
//   - switching to this system relocks everything that was previously
//     unlocked via the old threshold (nothing carries over as "already
//     bought" — see unlockedChapters below), but existing point BALANCES
//     are preserved and can be spent under the new system
// Points are genuinely spent/deducted here — this is the first mechanic
// where that's true; every other point source before this was pure
// accumulation (see handleCheckin/performCheckin, POINTS_STAGE_COMPLETE).
const CHAPTER_UNLOCK_POINTS = 30;

function isChapterUnlocked(levelKey, chapterIdx, unlockedChapters) {
  if (chapterIdx === 0) return true;
  return !!unlockedChapters[`${levelKey}:${chapterIdx}`];
}

// Given an SRS record { day1Date, stepIndex }, figure out whether a review is
// currently due. stepIndex points at the NEXT pending review in SRS_SCHEDULE
// (0 = Day 2, 1 = Day 3, 2 = Day 7, 3 = Day 14). Once stepIndex reaches
// SRS_SCHEDULE.length, the whole Day-1→Day-14 cycle for that record is done.
function stageReviewStatus(rec) {
  if (!rec) return { state: "new" };
  if (rec.stepIndex >= SRS_SCHEDULE.length) return { state: "done" };
  const dueDate = addDaysStr(rec.day1Date, SRS_SCHEDULE[rec.stepIndex]);
  return { state: todayStr() >= dueDate ? "due" : "waiting", dueDate, stepIndex: rec.stepIndex };
}

// Same key scheme as stageProgKey (inside SpanishVocab) but usable for any
// mode/key combo, so we can look up SRS status for levels/themes/chapters
// other than the one currently on screen (e.g. to badge the A2 tab while
// looking at A1).
function progKeyFor(m, k, stageWords) {
  return `${m}:${k}:${stageWords.map((w) => w.es).join(",").slice(0, 40)}`;
}

function chunkArray(arr, size) {
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

// v4.8.0: the three "pick the right option" question types. When the user
// has switched on "跳過聽力題" for this attempt, audio2zh is left out of the
// pool entirely so it's never generated in the first place (simpler and
// cheaper than generating then filtering it back out).
function optionTypesFor(skipListening) {
  return skipListening ? ["zh2es", "es2zh"] : ["zh2es", "es2zh", "audio2zh"];
}

// Picks ONE question type for a single word, honoring the same "spelling
// unlocks from the 3rd attempt onward, 40% chance" rule used for the base
// question set. Used both for the base per-word questions and for the
// same-session wrong-answer repeats (v4.8.0 item ⑨), so a repeated question
// isn't always forced into the exact same type as the one just missed.
function pickOneType(attemptNumber, skipListening) {
  if (attemptNumber >= 3 && Math.random() < 0.4) return "spelling";
  const types = optionTypesFor(skipListening);
  return shuffle(types)[0];
}

function makeOptionQuestion(w, type, key, distractorSource) {
  const distractorPool = distractorSource.filter((x) => x.es !== w.es);
  const distractors = shuffle(distractorPool).slice(0, 3);
  const options = shuffle([w, ...distractors]);
  return { type, word: w, options, key };
}

// v4.8.0: gender (el/la) question — options are just the two gender codes,
// not word objects, since there's nothing to pick a distractor word for.
function makeGenderQuestion(w, key) {
  return { type: "gender", word: w, options: shuffle(["m", "f"]), key };
}

function makeQuestionFor(w, type, key, distractorSource) {
  if (type === "spelling") return { type: "spelling", word: w, key };
  if (type === "gender") return makeGenderQuestion(w, key);
  return makeOptionQuestion(w, type, key, distractorSource);
}

function buildQuestions(words, attemptNumber, fullPool, skipListening) {
  // If this stage is too small to supply 3 wrong-answer options on its own
  // (e.g. a final stage left with only 1-2 words), pull distractors from the
  // whole level/theme word bank instead so the quiz always has real choices.
  const distractorSource = fullPool && fullPool.length > words.length ? fullPool : words;
  const allowedTypes = optionTypesFor(skipListening);
  const useSpelling = attemptNumber >= 3;

  // Each word is tested TWICE per quiz (so a 10-word stage produces 20
  // questions total). The two occurrences for the same word always get
  // different question types (never the same type twice in a row for that
  // word), then the full question list is shuffled so the two occurrences
  // of a word don't reliably land next to each other or in a fixed order.
  const questions = [];
  words.forEach((w, wi) => {
    let types;
    if (useSpelling && Math.random() < 0.4) {
      types = ["spelling", shuffle(allowedTypes)[0]];
    } else {
      types = shuffle(allowedTypes).slice(0, 2);
    }
    types.forEach((type, occurrence) => {
      const key = `${w.es}-${wi}-${occurrence}`;
      questions.push(makeQuestionFor(w, type, key, distractorSource));
    });
  });

  // v4.8.0 item ⑦: one extra gender (el/la) question per gendered word in
  // this stage, added ON TOP of the 20 base questions above (words with no
  // gender — verbs, adverbs, etc. — are simply skipped, they contribute 0).
  words.forEach((w, wi) => {
    if (!w.gender) return;
    questions.push(makeGenderQuestion(w, `gender-${w.es}-${wi}`));
  });

  return shuffle(questions);
}

// v4.20.0(改動H1): 每日隨堂測驗專用的輕量出題器——刻意跟 buildQuestions()
// 分開,不是共用同一個函式加參數。理由:buildQuestions 是「每字出兩題+陰陽性
// 額外題」的完整小關卡份量(10字約20+題),每日測驗要的是「15字→15題」的快速
// 版本,語意跟份量都不一樣,共用會讓 buildQuestions 內部邏輯多長一個特例分支,
// 不如各自獨立、各自簡單。重用 pickOneType(attemptNumber=1,...) 讓題型自然
// 落在 zh2es/es2zh/audio2zh 三種輪替(attemptNumber=1 不會出拼寫題,daily quiz
// 定位是「快速複習」不是「拼寫測驗」)。
function buildDailyQuizQuestions(words, distractorPool) {
  return shuffle(
    words.map((w, wi) => {
      const type = pickOneType(1, false);
      const key = `daily-${w.es}-${wi}`;
      return makeQuestionFor(w, type, key, distractorPool);
    })
  );
}

// v4.8.0 item ⑧: a word is worth teaching a plural form for only if it's a
// noun that actually carries a `plural` field — nouns the data already marks
// as "通常不用複數" (rigor, pragmatismo, ...) were authored WITHOUT a plural
// field for exactly this reason, so filtering on `w.plural` truthiness alone
// is enough; no need to also parse `note` text.
const PLURAL_SUBSTAGE_MIN_WORDS = 4;
function pluralEligibleWords(words) {
  return words.filter((w) => w.pos === "n." && w.plural);
}

// One multiple-choice question per plural-eligible word: shown the singular
// form, pick its correct plural among 3 distractor plurals from other
// plural-eligible words in the same stage. Plus (v4.17.0 item ②) one spelling
// question per word asking the learner to type out the plural form directly —
// this is a standalone supplementary drill (not part of the main SRS/mistake-
// book cycle), so it's intentionally simple: 2 questions per word, no repeats.
function buildPluralQuestions(words) {
  const eligible = pluralEligibleWords(words);
  const choiceQuestions = eligible.map((w, wi) => {
    const distractorPool = eligible.filter((x) => x.es !== w.es);
    const distractors = shuffle(distractorPool).slice(0, 3);
    const options = shuffle([w, ...distractors]);
    return { type: "pluralChoice", word: w, options, key: `plural-${w.es}-${wi}` };
  });
  const spellingQuestions = eligible.map((w, wi) => ({
    type: "pluralSpelling",
    word: w,
    key: `pluralspell-${w.es}-${wi}`,
  }));
  return shuffle([...choiceQuestions, ...spellingQuestions]);
}

// ===========================================================================
// Inline icon wrappers already imported from lucide-react
// ===========================================================================

function SpanishVocab() {
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,500;0,9..144,600;1,9..144,500&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@500;600&display=swap";
    document.head.appendChild(link);
    return () => document.head.removeChild(link);
  }, []);

  const [mode, setMode] = useState("level");
  const [level, setLevel] = useState("A1");
  const [theme, setTheme] = useState("pronombres");
  const [chapterIdx, setChapterIdx] = useState(0);
  const [screen, setScreen] = useState("map"); // map | lesson | quiz | result | info | library | pronounLab
  // v4.21.0: 圖書館內部的分類導覽。null = 顯示 pill 分類列表；有值時顯示該
  // 分類的內容頁(整頁切換，不是原地展開)。刻意跟 screen 分開管理，這樣
  // library 畫面本身還是走同一個 screen==="library" 分支，只是內部多一層。
  const [libraryTopic, setLibraryTopic] = useState(null);
  const [activeStage, setActiveStage] = useState(null); // { key, words, stageLabel, kind }
  const [pluralPopup, setPluralPopup] = useState(null); // word object or null
  const [quizState, setQuizState] = useState(null);
  const [resultData, setResultData] = useState(null);
  const [changelogOpen, setChangelogOpen] = useState(false);
  // v4.8.0 item ⑩: "skip listening questions" toggle. Deliberately plain
  // component state, NOT persisted to localStorage — it's scoped to
  // whatever stage-attempt the user is currently on, resets every time they
  // enter a stage fresh (see enterStage/enterMistakeReview below).
  const [skipListening, setSkipListening] = useState(false);

  // -----------------------------------------------------------------------
  // Persisted state: quiz progress, spaced-repetition schedule, mistake book.
  // Stored in this browser's localStorage only (no server/sync) so progress
  // survives closing the tab / reopening the app, but is lost if the user
  // clears browser data or switches devices/browsers.
  // -----------------------------------------------------------------------
  const [savedState] = useState(() => {
    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch (e) {
      return {};
    }
  });
  const [progress, setProgress] = useState(savedState.progress || {}); // stageKey -> { plays, bestAccuracy, lastAccuracy }
  const [srs, setSrs] = useState(savedState.srs || {}); // stageKey -> { day1Date, stepIndex }
  const [mistakes, setMistakes] = useState(savedState.mistakes || {}); // es -> { word, sourceLabel, day1Date, stepIndex, cycles }
  // v4.9.0: daily check-in calendar + points + level/chapter unlocking.
  // checkins: "YYYY-MM-DD" -> true (a day the user tapped 打卡 on).
  // points: running total — v4.19.0(改動F) onward this CAN decrease, spent on
  // unlocking chapters (see CHAPTER_UNLOCK_POINTS above).
  // bonusWeeks: isoWeekKey (e.g. "2026-W34") -> true, marks a Mon–Sun week
  // that has already paid out its +50 全勤 bonus, so it can't be re-awarded
  // if the check-in screen is revisited after the week is already complete.
  const [checkins, setCheckins] = useState(savedState.checkins || {});
  const [points, setPoints] = useState(savedState.points || 0);
  const [bonusWeeks, setBonusWeeks] = useState(savedState.bonusWeeks || {});
  // v4.19.0(改動F): "${level}:${chapterIdx}" -> true, chapters bought with
  // points. Deliberately a brand-new field with no migration from the old
  // threshold system — see CHAPTER_UNLOCK_POINTS comment above (the user
  // confirmed everything should relock, point balances carry over as-is).
  const [unlockedChapters, setUnlockedChapters] = useState(savedState.unlockedChapters || {});
  const [unlockMessage, setUnlockMessage] = useState(null);
  // v4.19.0(改動F): set to { levelKey, chapterIdx, range } when a locked
  // chapter tile is tapped, showing a confirm popup (buy now / not enough
  // points yet). Replaces the old passive-only "還差 X 點" toast for
  // chapters specifically (unlockMessage above still exists but is no
  // longer used by chapter taps — kept only in case a future lock is added
  // elsewhere that wants the simple transient-toast pattern).
  const [chapterUnlockPrompt, setChapterUnlockPrompt] = useState(null);
  // v4.20.0(改動H1): "YYYY-MM-DD" of the last completed daily quiz, or null.
  // Persisted so "once per day" survives a page reload, same pattern as
  // checkins/bonusWeeks below.
  const [dailyQuizDate, setDailyQuizDate] = useState(savedState.dailyQuizDate || null);

  // ---------------------------------------------------------------------
  // v4.20.0(改動H2): 代名詞變化練習模組專用 state。刻意完全獨立於上面的
  // quizState/activeStage/progress/srs——不寫入 localStorage、不接 SRS、
  // 不算分數點數，是純練習性質的獨立畫面，壞了也不會牽連主要測驗引擎。
  // ---------------------------------------------------------------------
  const [labStep, setLabStep] = useState("pick"); // pick | tier1 | tier2 | tier3
  const [labVerb, setLabVerb] = useState(null);
  const [labTier, setLabTier] = useState(1);
  const [labT1, setLabT1] = useState(null); // { questions, qIndex, correct, selectedIndex, showFeedback }
  const [labTableAnswers, setLabTableAnswers] = useState({});
  const [labTableChecked, setLabTableChecked] = useState(false);
  const [labQwAnswers, setLabQwAnswers] = useState({});
  const [labQwChecked, setLabQwChecked] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(
        LOCAL_STORAGE_KEY,
        JSON.stringify({ progress, srs, mistakes, checkins, points, bonusWeeks, unlockedChapters, dailyQuizDate })
      );
    } catch (e) {
      /* localStorage unavailable (private mode / storage full) — progress just won't persist */
    }
  }, [progress, srs, mistakes, checkins, points, bonusWeeks, unlockedChapters, dailyQuizDate]);

  // Transient "還差 X 點解鎖" banner shown when tapping a locked level/chapter.
  // Auto-dismisses so it doesn't require an extra tap to clear.
  useEffect(() => {
    if (!unlockMessage) return;
    const t = setTimeout(() => setUnlockMessage(null), 2600);
    return () => clearTimeout(t);
  }, [unlockMessage]);

  const activeKey = mode === "level" ? level : mode === "theme" ? theme : "mistake";
  const info = mode === "level" ? LEVEL_INFO[level] : mode === "theme" ? THEME_INFO[theme] : MISTAKE_INFO;
  const bank = mode === "level" ? WORD_BANK[level] : mode === "theme" ? THEME_BANK[theme] : [];
  const stages = useMemo(
    () => (mode === "theme" ? chunkStagesForTheme(theme, bank) : chunkStages(bank)),
    [bank, mode, theme]
  );
  const chapters = useMemo(() => chunkChapters(stages), [stages]);
  const currentChapter = chapters[Math.min(chapterIdx, chapters.length - 1)] || chapters[0];

  // -----------------------------------------------------------------------
  // "Any due review inside here?" indicators for upper-level navigation
  // (level tabs / theme tabs / chapter tabs), so the user can see there's
  // something due without having to drill into every stage tile first.
  // -----------------------------------------------------------------------
  const levelDueMap = useMemo(() => {
    const map = {};
    LEVELS.forEach((l) => {
      const lStages = chunkStages(WORD_BANK[l] || []);
      map[l] = lStages.some((s) => stageReviewStatus(srs[progKeyFor("level", l, s.words)]).state === "due");
    });
    return map;
  }, [srs]);

  const themeDueMap = useMemo(() => {
    const map = {};
    THEMES.forEach((t) => {
      const tStages = chunkStagesForTheme(t, THEME_BANK[t] || []);
      map[t] = tStages.some((s) => stageReviewStatus(srs[progKeyFor("theme", t, s.words)]).state === "due");
    });
    return map;
  }, [srs]);

  const chapterDueMap = useMemo(() => {
    const map = {};
    chapters.forEach((c) => {
      map[c.index] = c.stages.some((s) => stageReviewStatus(srs[progKeyFor(mode, activeKey, s.words)]).state === "due");
    });
    return map;
  }, [chapters, srs, mode, activeKey]);

  // -----------------------------------------------------------------------
  // Mistake-book derived data
  // -----------------------------------------------------------------------
  const mistakeList = useMemo(
    () => Object.entries(mistakes).map(([es, rec]) => ({ es, ...rec })),
    [mistakes]
  );
  const dueMistakeList = useMemo(
    () => mistakeList.filter((m) => stageReviewStatus(m).state === "due"),
    [mistakeList]
  );
  const mistakeChunks = useMemo(() => chunkArray(dueMistakeList, STAGE_SIZE), [dueMistakeList]);
  const nextMistakeDueDate = useMemo(() => {
    if (mistakeList.length === 0) return null;
    const dates = mistakeList.map((m) => stageReviewStatus(m).dueDate).filter(Boolean).sort();
    return dates.length ? dates[0] : null;
  }, [mistakeList]);

  const switchMode = (m) => {
    setMode(m);
    setChapterIdx(0);
    setScreen("map");
  };
  // v4.19.0(改動F): levels themselves are never locked anymore — only
  // individual chapters within a level are (see selectChapter below), and
  // that applies uniformly to all four levels now, not just A1. So
  // switching levels is back to a plain tab switch, same as theme tabs.
  const changeLevel = (l) => {
    setLevel(l);
    setChapterIdx(0);
    setScreen("map");
  };
  const changeTheme = (t) => {
    setTheme(t);
    setChapterIdx(0);
    setScreen("map");
  };
  // v4.19.0(改動F): every level's chapters (2nd chapter onward) are
  // individually gated behind CHAPTER_UNLOCK_POINTS now, not just A1's.
  // Tapping a locked chapter opens the confirm popup (chapterUnlockPrompt)
  // instead of switching straight in — see confirmUnlockChapter below for
  // the actual spend. Themes/mistake-book chapters are never gated.
  const selectChapter = (idx) => {
    if (mode === "level" && !isChapterUnlocked(level, idx, unlockedChapters)) {
      setChapterUnlockPrompt({ levelKey: level, chapterIdx: idx });
      return;
    }
    setChapterIdx(idx);
  };

  // v4.19.0(改動F): actually spends the points and marks the chapter
  // unlocked. Guarded on affordability so it's a no-op if somehow called
  // without enough points (the confirm popup only shows a clickable "花點數
  // 解鎖" button when affordable in the first place, so this guard should
  // never actually trigger in normal use — it's a safety net, not the
  // primary gate).
  const confirmUnlockChapter = () => {
    if (!chapterUnlockPrompt) return;
    const { levelKey, chapterIdx } = chapterUnlockPrompt;
    if (points < CHAPTER_UNLOCK_POINTS) return;
    setPoints((p) => p - CHAPTER_UNLOCK_POINTS);
    setUnlockedChapters((prev) => ({ ...prev, [`${levelKey}:${chapterIdx}`]: true }));
    setChapterUnlockPrompt(null);
    setChapterIdx(chapterIdx);
  };

  // v4.9.0 item③④ / v4.18.0 item⑤: check-in logic, shared by two triggers —
  // the manual "打卡" tap on the check-in calendar screen, AND (new in
  // v4.18.0) automatically whenever a regular stage quiz is completed, so
  // the user no longer has to separately remember to tap 打卡 on a day they
  // already studied. A no-op if today is already checked in (guards against
  // double-counting, whichever trigger fires first on a given day). Also
  // checks whether today's check-in completes a full Mon–Sun week (item④'s
  // +50 全勤 bonus) — computed against the updated checkins map (including
  // today) so the bonus can fire on the same call that completes the week,
  // not one day late.
  const performCheckin = () => {
    const today = todayStr();
    if (checkins[today]) return;
    const updatedCheckins = { ...checkins, [today]: true };
    setCheckins(updatedCheckins);

    const wKey = weekKeyFor(today);
    const weekComplete = weekDates(today).every((d) => updatedCheckins[d]);
    const alreadyPaid = !!bonusWeeks[wKey];
    const earnedThisTap = POINTS_CHECKIN + (weekComplete && !alreadyPaid ? POINTS_FULL_WEEK_BONUS : 0);
    setPoints((p) => p + earnedThisTap);
    if (weekComplete && !alreadyPaid) {
      setBonusWeeks((prev) => ({ ...prev, [wKey]: true }));
    }
  };

  const handleCheckin = () => {
    performCheckin();
  };

  const stageProgKey = (stageWords) => progKeyFor(mode, activeKey, stageWords);

  const enterStage = (stageWords, stageLabel) => {
    const key = stageProgKey(stageWords);
    setActiveStage({ key, words: stageWords, stageLabel, kind: "stage" });
    setSkipListening(false);
    setScreen("lesson");
  };

  const enterMistakeReview = (chunk, idx) => {
    const words = chunk.map((m) => m.word);
    const key = `mistake-review:${todayStr()}:${idx}`;
    setActiveStage({ key, words, stageLabel: `錯題複習 ${idx + 1}`, kind: "mistake" });
    setSkipListening(false);
    setScreen("lesson");
  };

  // v4.8.0 item ⑧: enter the supplementary "複數形式" sub-stage — a teaching
  // page (reusing the "lesson" screen, kind: "plural") followed by its own
  // quiz. This is intentionally NOT part of the main SRS/mistake-book
  // bookkeeping — no progress/srs record is written for it (see the
  // kind === "plural" branch in nextQuestion() below), so it's never subject
  // to the same-day lock above either.
  const enterPluralStage = (stageWords, stageLabel) => {
    setActiveStage({
      key: `plural:${stageProgKey(stageWords)}`,
      words: pluralEligibleWords(stageWords),
      stageLabel,
      kind: "plural",
    });
    setSkipListening(false);
    setScreen("lesson");
  };

  const startQuiz = () => {
    if (activeStage.kind === "plural") {
      setQuizState({
        questions: buildPluralQuestions(activeStage.words),
        qIndex: 0,
        correct: 0,
        selectedIndex: null,
        inputValue: "",
        showFeedback: false,
        attemptNumber: 1,
        wrongEs: [],
        repeatCounts: {},
      });
      setScreen("quiz");
      return;
    }
    const prog = progress[activeStage.key];
    const attemptNumber = (prog?.plays || 0) + 1;
    const distractorPool = activeStage.kind === "mistake" ? Object.values(mistakes).map((m) => m.word) : bank;
    const questions = buildQuestions(activeStage.words, attemptNumber, distractorPool, skipListening);
    setQuizState({
      questions,
      qIndex: 0,
      correct: 0,
      selectedIndex: null,
      inputValue: "",
      showFeedback: false,
      attemptNumber,
      wrongEs: [],
      repeatCounts: {},
    });
    setScreen("quiz");
  };

  // v4.20.0(改動H1): 「已學過的字」定義成「所在小關卡至少完成過一次測驗
  // (progress[key].plays > 0)」——橫跨所有分級 + 所有主題掃一次,用 Map
  // 依 es 去重(同一個字如果同時出現在分級跟主題兩邊,只算一份)。只依賴
  // progress 這個既有 state,不需要新的追蹤欄位。
  const learnedWordPool = useMemo(() => {
    const pool = new Map();
    LEVELS.forEach((l) => {
      chunkStages(WORD_BANK[l] || []).forEach((s) => {
        const key = progKeyFor("level", l, s.words);
        if (progress[key] && progress[key].plays > 0) {
          s.words.forEach((w) => pool.set(w.es, w));
        }
      });
    });
    THEMES.forEach((t) => {
      chunkStagesForTheme(t, THEME_BANK[t] || []).forEach((s) => {
        const key = progKeyFor("theme", t, s.words);
        if (progress[key] && progress[key].plays > 0) {
          s.words.forEach((w) => pool.set(w.es, w));
        }
      });
    });
    return Array.from(pool.values());
  }, [progress]);

  const DAILY_QUIZ_WORD_COUNT = 15;
  const dailyQuizReady = learnedWordPool.length >= DAILY_QUIZ_WORD_COUNT;
  const dailyQuizDoneToday = dailyQuizDate === todayStr();

  const startDailyQuiz = () => {
    if (!dailyQuizReady || dailyQuizDoneToday) return;
    const sample = shuffle(learnedWordPool).slice(0, DAILY_QUIZ_WORD_COUNT);
    const questions = buildDailyQuizQuestions(sample, learnedWordPool);
    setActiveStage({ key: `daily:${todayStr()}`, words: sample, stageLabel: "每日隨堂測驗", kind: "daily" });
    setSkipListening(false);
    setQuizState({
      questions,
      qIndex: 0,
      correct: 0,
      selectedIndex: null,
      inputValue: "",
      showFeedback: false,
      attemptNumber: 1,
      wrongEs: [],
      repeatCounts: {},
    });
    setScreen("quiz");
  };

  const ttsSpeak = (text) => {
    try {
      if (!spanishVoiceResolved) refreshSpanishVoice();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = cachedSpanishVoice ? cachedSpanishVoice.lang : "es-ES";
      if (cachedSpanishVoice) u.voice = cachedSpanishVoice;
      window.speechSynthesis.speak(u);
    } catch (e) {
      /* speech synthesis unavailable */
    }
  };

  // Prefer the pre-generated audio file for this word (guaranteed to
  // actually be Spanish). Only fall back to the browser's own TTS voice
  // guessing if there's no audio file yet (word not covered) or the file
  // fails to load/play for some reason.
  const speak = (text) => {
    const file = AUDIO_MAP[text];
    if (!file) {
      ttsSpeak(text);
      return;
    }
    try {
      const audio = new window.Audio(AUDIO_BASE + file);
      let fellBack = false;
      const fallback = () => {
        if (fellBack) return;
        fellBack = true;
        ttsSpeak(text);
      };
      audio.addEventListener("error", fallback);
      const playPromise = audio.play();
      if (playPromise && typeof playPromise.catch === "function") {
        playPromise.catch(fallback);
      }
    } catch (e) {
      ttsSpeak(text);
    }
  };

  // v4.8.0 item ①: audio2zh ("聽音辨義") questions auto-play their audio the
  // moment they appear, instead of requiring a click first — the click-to-
  // replay button stays available too. Depends on qIndex (not showFeedback),
  // so it fires exactly once per question, not again when the answer is
  // revealed.
  useEffect(() => {
    if (screen !== "quiz" || !quizState) return;
    const q = quizState.questions[quizState.qIndex];
    if (q && q.type === "audio2zh") speak(q.word.es);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screen, quizState && quizState.qIndex, quizState && quizState.questions]);

  // v4.8.0 item ⑨: a word answered wrong reappears later in the SAME quiz
  // session, up to 2 extra times (so at most 3 total attempts on that word
  // this session — it stops resurfacing as soon as it's answered correctly).
  // These repeats are inserted on top of the original question list, never
  // replacing anything, which is also why the accuracy denominator
  // (quizState.questions.length, used in nextQuestion()) is correct without
  // any extra bookkeeping — it just naturally grows as repeats are added.
  // Not applied to the "plural" sub-stage quiz, which is intentionally a
  // simple one-pass drill.
  const MAX_EXTRA_REPEATS = 2;
  const submitAnswer = (isCorrect) => {
    setQuizState((prev) => {
      const q = prev.questions[prev.qIndex];
      let questions = prev.questions;
      let repeatCounts = prev.repeatCounts || {};
      if (!isCorrect && activeStage.kind !== "plural") {
        const es = q.word.es;
        const usedRepeats = repeatCounts[es] || 0;
        if (usedRepeats < MAX_EXTRA_REPEATS) {
          const distractorPool = activeStage.kind === "mistake" ? Object.values(mistakes).map((m) => m.word) : bank;
          const distractorSource = distractorPool && distractorPool.length > activeStage.words.length ? distractorPool : activeStage.words;
          const repeatType = q.type === "gender" ? "gender" : pickOneType(prev.attemptNumber, skipListening);
          const newQ = makeQuestionFor(q.word, repeatType, `${es}-repeat-${usedRepeats + 1}`, distractorSource);
          // Insert a few questions further along (not immediately next), so
          // the repeat isn't trivially answered right after seeing the
          // correct answer just now.
          const insertAt = Math.min(questions.length, prev.qIndex + 2 + Math.floor(Math.random() * 3));
          questions = [...questions.slice(0, insertAt), newQ, ...questions.slice(insertAt)];
          repeatCounts = { ...repeatCounts, [es]: usedRepeats + 1 };
        }
      }
      return {
        ...prev,
        questions,
        repeatCounts,
        showFeedback: true,
        correct: prev.correct + (isCorrect ? 1 : 0),
        _wasCorrect: isCorrect,
        wrongEs: isCorrect ? prev.wrongEs : [...(prev.wrongEs || []), q.word.es],
      };
    });
  };

  const chooseOption = (idx) => {
    if (quizState.showFeedback) return;
    const q = quizState.questions[quizState.qIndex];
    const chosen = q.options[idx];
    // v4.8.0 item ⑦: gender questions' options are plain "m"/"f" codes, not
    // word objects, so they need their own correctness check.
    const isCorrect = q.type === "gender" ? chosen === q.word.gender : chosen.es === q.word.es;
    setQuizState((prev) => ({ ...prev, selectedIndex: idx }));
    submitAnswer(isCorrect);
  };

  const submitSpelling = () => {
    if (quizState.showFeedback) return;
    const q = quizState.questions[quizState.qIndex];
    // v4.17.0 item ②: pluralSpelling questions ask for the PLURAL form, so
    // check against q.word.plural instead of the singular q.word.es.
    const target = q.type === "pluralSpelling" ? q.word.plural : q.word.es;
    const isCorrect = checkSpellingAnswer(quizState.inputValue, target);
    submitAnswer(isCorrect);
  };

  const spellingInputRef = React.useRef(null);
  const SPECIAL_CHARS = ["ñ", "Ñ", "¿", "¡", "ü", "Ü", "á", "é", "í", "ó", "ú"];
  const insertSpecialChar = (char) => {
    const el = spellingInputRef.current;
    const current = quizState?.inputValue ?? "";
    const start = el && el.selectionStart != null ? el.selectionStart : current.length;
    const end = el && el.selectionEnd != null ? el.selectionEnd : current.length;
    const newValue = current.slice(0, start) + char + current.slice(end);
    setQuizState((prev) => ({ ...prev, inputValue: newValue }));
    requestAnimationFrame(() => {
      if (!el) return;
      el.focus();
      const pos = start + char.length;
      el.setSelectionRange(pos, pos);
    });
  };

  const nextQuestion = () => {
    const isLast = quizState.qIndex + 1 >= quizState.questions.length;
    if (isLast) {
      const total = quizState.questions.length;
      const accuracy = Math.round((quizState.correct / total) * 100);
      const wrongEs = quizState.wrongEs || [];

      if (activeStage.kind === "plural") {
        // v4.8.0 item ⑧: the plural sub-stage is a standalone supplementary
        // drill — intentionally outside the SRS/progress/mistake-book
        // system entirely, so there's nothing to persist here.
      } else if (activeStage.kind === "daily") {
        // v4.20.0(改動H1): also outside SRS/progress/mistake-book — daily
        // quiz doesn't advance any stage's review schedule, it's a pure
        // recall check across already-learned words. Only effect: award
        // points once, and mark today as done so it can't replay for points.
        setPoints((p) => p + POINTS_DAILY_QUIZ);
        setDailyQuizDate(todayStr());
      } else if (activeStage.kind === "mistake") {
        // This session is a scheduled review of words already in the mistake
        // book. Advance each reviewed word's own 2/3/7/14-day cycle. Only the
        // FINAL check-in of that cycle (equivalent to "Day 14") decides the
        // outcome: still wrong → stays in the mistake book and the cycle
        // restarts from today; correct → the word graduates and is removed.
        const updatedMistakes = { ...mistakes };
        activeStage.words.forEach((w) => {
          const rec = updatedMistakes[w.es];
          if (!rec) return;
          const wasWrong = wrongEs.includes(w.es);
          const newStepIndex = rec.stepIndex + 1;
          if (newStepIndex >= SRS_SCHEDULE.length) {
            if (wasWrong) {
              updatedMistakes[w.es] = { ...rec, day1Date: todayStr(), stepIndex: 0, cycles: (rec.cycles || 0) + 1 };
            } else {
              delete updatedMistakes[w.es];
            }
          } else {
            updatedMistakes[w.es] = { ...rec, stepIndex: newStepIndex };
          }
        });
        setMistakes(updatedMistakes);
      } else {
        setProgress((prev) => {
          const p = prev[activeStage.key] || { plays: 0, bestAccuracy: null };
          return {
            ...prev,
            [activeStage.key]: {
              plays: p.plays + 1,
              bestAccuracy: p.bestAccuracy == null ? accuracy : Math.max(p.bestAccuracy, accuracy),
              lastAccuracy: accuracy,
            },
          };
        });

        // v4.9.0 item④: completing a regular stage quiz earns points, every
        // time (no daily cap, no "first time only" restriction — matches the
        // confirmed design: "完成一個小關卡:+10點"). Mistake reviews and the
        // plural sub-stage deliberately do NOT earn points here, since only
        // this branch (kind === "stage") runs this code.
        setPoints((p) => p + POINTS_STAGE_COMPLETE);

        // v4.18.0 item⑤: completing a regular stage quiz also auto-counts
        // today as checked in — the user no longer needs to separately tap
        // 打卡 on a day they've already studied. performCheckin() is a no-op
        // if today's already checked in (e.g. they tapped 打卡 manually
        // earlier, or already completed another stage today), so this never
        // double-pays the +10 打卡 points or the weekly bonus.
        performCheckin();

        // Spaced-repetition bookkeeping for this stage.
        const rec = srs[activeStage.key];
        if (!rec) {
          // First-ever completion of this stage = "Day 1". Kick off the
          // 2/3/7/14-day review schedule from today.
          setSrs((prev) => ({ ...prev, [activeStage.key]: { day1Date: todayStr(), stepIndex: 0 } }));
        } else {
          const status = stageReviewStatus(rec);
          // Only a completion made ON/AFTER the scheduled due date consumes
          // the review slot — replaying early is just extra practice and
          // doesn't fast-forward the schedule.
          if (status.state === "due") {
            const newStepIndex = rec.stepIndex + 1;
            setSrs((prev) => ({ ...prev, [activeStage.key]: { ...rec, stepIndex: newStepIndex } }));
            // Day-14 review just happened — anything still wrong today goes
            // into the mistake book and starts its own 2/3/7/14 cycle.
            if (newStepIndex >= SRS_SCHEDULE.length && wrongEs.length > 0) {
              setMistakes((prev) => {
                const next = { ...prev };
                wrongEs.forEach((es) => {
                  const wordObj = activeStage.words.find((w) => w.es === es);
                  if (!wordObj) return;
                  if (!next[es]) {
                    next[es] = {
                      word: wordObj,
                      sourceLabel: `${info.label} · ${activeStage.stageLabel}`,
                      day1Date: todayStr(),
                      stepIndex: 0,
                      cycles: 0,
                    };
                  }
                });
                return next;
              });
            }
          }
        }
      }

      setResultData({
        correct: quizState.correct,
        total,
        accuracy,
        attemptNumber: quizState.attemptNumber,
        pointsEarned:
          activeStage.kind === "stage"
            ? POINTS_STAGE_COMPLETE
            : activeStage.kind === "daily"
            ? POINTS_DAILY_QUIZ
            : 0,
      });
      setScreen("result");
    } else {
      setQuizState((prev) => ({
        ...prev,
        qIndex: prev.qIndex + 1,
        selectedIndex: null,
        inputValue: "",
        showFeedback: false,
      }));
    }
  };

  const backToMap = () => {
    setScreen("map");
    setActiveStage(null);
    setQuizState(null);
    setResultData(null);
    setLibraryTopic(null);
  };

  const replayStage = () => {
    setScreen("lesson");
    setQuizState(null);
    setResultData(null);
  };

  // ---------------------------------------------------------------------
  // Shared style helpers
  // ---------------------------------------------------------------------
  const TopBar = ({ title, onBack }) => (
    <div style={{ display: "flex", alignItems: "center", gap: "0.7rem", padding: "1.5rem 1.25rem 1rem" }}>
      <button
        onClick={onBack}
        style={{
          background: "#E07A5F",
          border: "none",
          borderRadius: "9999px",
          width: "2.2rem",
          height: "2.2rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#FDF6EC",
          cursor: "pointer",
          flexShrink: 0,
        }}
      >
        <ArrowLeft size={17} />
      </button>
      <h2
        style={{
          fontFamily: "'Fraunces', serif",
          fontWeight: 600,
          fontSize: "1.15rem",
          color: "#3A2E1F",
          margin: 0,
        }}
      >
        {title}
      </h2>
    </div>
  );

  const GenderBadge = ({ word }) => {
    if (!word.gender) return null;
    const isM = word.gender === "m";
    return (
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: "0.68rem",
          fontWeight: 600,
          padding: "0.1rem 0.4rem",
          borderRadius: "0.3rem",
          background: isM ? "#DCE8EF" : "#F2DCE4",
          color: isM ? "#3E6E8E" : "#A13A5A",
          marginLeft: "0.4rem",
        }}
      >
        {isM ? "陽性 el" : "陰性 la"}
      </span>
    );
  };

  // Small hint shown only when the Spanish word has a genuinely
  // close-looking English cognate (word.en) — a quick memory hook for
  // learners who already know English, e.g. "hospital" → "≈ hospital".
  // Not shown for every word on purpose: most words don't have a
  // recognizable English lookalike, and showing an unrelated translation
  // wouldn't help memorization the way a spelling match does.
  const CognateHint = ({ word }) => {
    if (!word.en) return null;
    return (
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          fontSize: "0.68rem",
          color: "#8A7A5E",
          fontStyle: "italic",
          marginLeft: "0.4rem",
        }}
      >
        ≈ {word.en}
      </span>
    );
  };

  // ---------------------------------------------------------------------
  // Screen: MAP
  // ---------------------------------------------------------------------
  if (screen === "map") {
    return (
      <div style={{ minHeight: "100vh", background: "#FDF6EC", fontFamily: "'Inter', sans-serif", paddingBottom: "3rem" }}>
        <div style={{ padding: "2.25rem 1.5rem 1.25rem" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: "0.6rem" }}>
              <BookOpenCheck size={22} color="#E07A5F" strokeWidth={2} />
              <h1
                style={{
                  fontFamily: "'Fraunces', serif",
                  fontWeight: 600,
                  fontSize: "1.6rem",
                  color: "#3A2E1F",
                  letterSpacing: "-0.01em",
                  margin: 0,
                }}
              >
                西文單字學習
              </h1>
            </div>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              {/* v4.20.0(改動G): 圖書館入口——刻意放在跟「關於本App」同一
                  排的獨立圖示按鈕,不是塞進分級/主題/錯題本那排 mode 分頁,
                  因為圖書館內容(字母/發音規則/代名詞參考)不是單字關卡,不
                  需要走 mode/bank/stages 那套邏輯,單純是另一個獨立畫面。 */}
              <button
                onClick={() => setScreen("library")}
                aria-label="圖書館"
                style={{
                  background: "#F9F1E6",
                  border: "1px solid #ECDFCA",
                  borderRadius: "9999px",
                  width: "2.1rem",
                  height: "2.1rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#8A7A5E",
                  cursor: "pointer",
                  flexShrink: 0,
                }}
              >
                <BookOpen size={16} />
              </button>
              <button
                onClick={() => setScreen("info")}
                aria-label="關於本 App"
                style={{
                  background: "#F9F1E6",
                  border: "1px solid #ECDFCA",
                  borderRadius: "9999px",
                  width: "2.1rem",
                  height: "2.1rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#8A7A5E",
                  cursor: "pointer",
                  flexShrink: 0,
                }}
              >
                <Info size={16} />
              </button>
            </div>
          </div>
          <p style={{ color: "#A99B85", fontSize: "0.85rem", marginTop: "0.35rem" }}>
            選一個分級或主題,進入關卡地圖開始複習。
          </p>
        </div>

        {/* v4.9.0 item③④: always-visible streak/points summary, tap to open
            the check-in calendar. Placed here (top of map, above the mode
            tabs) per the user's preference so progress is visible without an
            extra tap to find it. */}
        <div style={{ padding: "0 1.5rem 1.1rem" }}>
          <button
            onClick={() => setScreen("checkin")}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "1.1rem",
              background: "#F9F1E6",
              border: "1px solid #ECDFCA",
              borderRadius: "0.8rem",
              padding: "0.6rem",
              cursor: "pointer",
            }}
          >
            <span style={{ display: "flex", alignItems: "center", gap: "0.35rem", color: "#B85C2E" }}>
              <Flame size={15} />
              <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontWeight: 700, fontSize: "0.85rem" }}>
                連續 {computeStreak(checkins, todayStr())} 天
              </span>
            </span>
            <span style={{ width: "1px", height: "1rem", background: "#ECDFCA" }} />
            <span style={{ display: "flex", alignItems: "center", gap: "0.35rem", color: "#B98A2E" }}>
              <Sparkles size={15} />
              <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontWeight: 700, fontSize: "0.85rem" }}>
                {points} 點
              </span>
            </span>
            <span style={{ width: "1px", height: "1rem", background: "#ECDFCA" }} />
            <span style={{ display: "flex", alignItems: "center", color: "#A99B85" }}>
              <CalendarIcon size={15} />
            </span>
          </button>
        </div>

        {/* v4.20.0(改動H1): 每日隨堂測驗入口卡片。三種狀態:字數不足(灰
            色不可點)、今天已完成(灰色不可點,顯示已完成)、可以挑戰(橘色
            可點)。刻意放在打卡卡片正下方,同一層級的「每日任務」概念。 */}
        <div style={{ padding: "0 1.5rem 1.1rem" }}>
          <button
            onClick={startDailyQuiz}
            disabled={!dailyQuizReady || dailyQuizDoneToday}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
              background: dailyQuizReady && !dailyQuizDoneToday ? "#FBEDE3" : "#F9F1E6",
              border: `1px solid ${dailyQuizReady && !dailyQuizDoneToday ? "#F0C4A8" : "#ECDFCA"}`,
              borderRadius: "0.8rem",
              padding: "0.6rem",
              cursor: dailyQuizReady && !dailyQuizDoneToday ? "pointer" : "default",
              color: dailyQuizReady && !dailyQuizDoneToday ? "#B85C2E" : "#A99B85",
            }}
          >
            <Target size={15} />
            <span style={{ fontWeight: 600, fontSize: "0.82rem" }}>
              {dailyQuizDoneToday
                ? "✅ 今日隨堂測驗已完成"
                : dailyQuizReady
                ? `每日隨堂測驗(${DAILY_QUIZ_WORD_COUNT} 題 · 完成 +${POINTS_DAILY_QUIZ} 點)`
                : `再學過 ${Math.max(0, DAILY_QUIZ_WORD_COUNT - learnedWordPool.length)} 個字才能挑戰每日測驗`}
            </span>
          </button>
        </div>

        {unlockMessage && (
          <div
            style={{
              position: "fixed",
              left: "50%",
              bottom: "1.4rem",
              transform: "translateX(-50%)",
              background: "#3A2E1F",
              color: "#F5EFE0",
              padding: "0.65rem 1.1rem",
              borderRadius: "0.7rem",
              fontSize: "0.8rem",
              fontWeight: 600,
              boxShadow: "0 4px 14px rgba(0,0,0,0.18)",
              zIndex: 50,
              whiteSpace: "nowrap",
            }}
          >
            {unlockMessage}
          </div>
        )}

        <div style={{ display: "flex", gap: "0.5rem", padding: "0 1.5rem 1rem" }}>
          {[
            { key: "level", label: "分級" },
            { key: "theme", label: "主題" },
            { key: "mistake", label: "錯題本" },
          ].map((m) => {
            const active = mode === m.key;
            const showDueDot = m.key === "mistake" && dueMistakeList.length > 0;
            return (
              <button
                key={m.key}
                onClick={() => switchMode(m.key)}
                style={{
                  position: "relative",
                  flex: 1,
                  padding: "0.6rem",
                  borderRadius: "0.7rem",
                  border: active ? "none" : "1px solid #ECDFCA",
                  background: active ? "#E07A5F" : "transparent",
                  color: active ? "#FDF6EC" : "#A99B85",
                  fontWeight: 600,
                  fontSize: "0.85rem",
                  cursor: "pointer",
                }}
              >
                {m.label}
                {showDueDot && (
                  <span
                    style={{
                      position: "absolute",
                      top: "0.3rem",
                      right: "0.5rem",
                      width: "0.4rem",
                      height: "0.4rem",
                      borderRadius: "9999px",
                      background: active ? "#FDF6EC" : "#C0392B",
                    }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {mode === "level" && (
          // v4.19.0(改動F): levels are never locked anymore — the old
          // whole-level point threshold (A2/B1/B2) is gone, replaced by
          // per-chapter unlocking uniformly across all levels (see the
          // chapter tabs below). Back to a plain always-active tab row.
          <div style={{ display: "flex", gap: "0.6rem", padding: "0 1.5rem 1.5rem", overflowX: "auto" }}>
            {LEVELS.map((l) => {
              const active = l === level;
              const li = LEVEL_INFO[l];
              return (
                <button
                  key={l}
                  onClick={() => changeLevel(l)}
                  style={{
                    flexShrink: 0,
                    width: "3.6rem",
                    height: "3.6rem",
                    borderRadius: "9999px",
                    border: `2px dashed ${levelDueMap[l] ? "#C0392B" : active ? li.color : "#ECDFCA"}`,
                    background: active ? li.light : "transparent",
                    color: active ? li.color : "#A99B85",
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontWeight: 600,
                    fontSize: "0.95rem",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.05rem",
                    transform: active ? "rotate(-6deg)" : "rotate(0deg)",
                    transition: "all 0.2s ease",
                    cursor: "pointer",
                  }}
                >
                  {l}
                </button>
              );
            })}
          </div>
        )}

        {mode === "theme" && (
          // v4.18.0 item⑥ (revised after user testing): a single long
          // horizontal row of all 25 themes turned out to be too long to
          // swipe through comfortably. Split into rows of 10 themes each
          // (row 1 = themes 1-10, row 2 = 11-20, row 3 = 21-25...), stacked
          // vertically, each row independently horizontally-scrollable —
          // same building block as before (chunkArray, already used
          // elsewhere for stage/chapter splitting), just grouped smaller.
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", padding: "0 1.5rem 1.5rem" }}>
            {chunkArray(THEMES, 10).map((row, rowIdx) => (
              <div key={rowIdx} style={{ display: "flex", gap: "0.55rem", overflowX: "auto" }}>
                {row.map((t) => {
                  const active = t === theme;
                  const ti = THEME_INFO[t];
                  return (
                    <button
                      key={t}
                      onClick={() => changeTheme(t)}
                      style={{
                        flexShrink: 0,
                        display: "flex",
                        alignItems: "center",
                        gap: "0.35rem",
                        padding: "0.5rem 0.8rem",
                        borderRadius: "9999px",
                        border: `1.5px solid ${themeDueMap[t] ? "#C0392B" : active ? ti.color : "#ECDFCA"}`,
                        background: active ? ti.light : "transparent",
                        color: active ? ti.color : "#A99B85",
                        fontWeight: 600,
                        fontSize: "0.78rem",
                        cursor: "pointer",
                        whiteSpace: "nowrap",
                      }}
                    >
                      <span style={{ fontSize: "0.95rem" }}>{ti.icon}</span>
                      {ti.label}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        )}

        {/* Chapter tabs (only shown if more than 1 chapter exists) */}
        {mode !== "mistake" && chapters.length > 1 && (
          <div style={{ display: "flex", gap: "0.5rem", padding: "0 1.5rem 1rem", overflowX: "auto" }}>
            {chapters.map((c) => {
              const active = c.index === chapterIdx;
              // v4.19.0(改動F): every level's chapters (not just A1's) are
              // now gated behind the same flat CHAPTER_UNLOCK_POINTS price.
              const locked = mode === "level" && !isChapterUnlocked(level, c.index, unlockedChapters);
              return (
                <button
                  key={c.index}
                  onClick={() => selectChapter(c.index)}
                  title={locked ? `花 ${CHAPTER_UNLOCK_POINTS} 點解鎖(目前 ${points} 點)` : undefined}
                  style={{
                    flexShrink: 0,
                    display: "flex",
                    alignItems: "center",
                    gap: "0.3rem",
                    padding: "0.45rem 0.8rem",
                    borderRadius: "0.6rem",
                    border: `1px solid ${locked ? "#ECDFCA" : chapterDueMap[c.index] ? "#C0392B" : active ? info.color : "#ECDFCA"}`,
                    background: active && !locked ? info.light : "transparent",
                    color: locked ? "#C9B89E" : active ? info.color : "#A99B85",
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                  }}
                >
                  {locked ? (
                    <React.Fragment>
                      <Lock size={11} />
                      {CHAPTER_UNLOCK_POINTS} 點解鎖
                    </React.Fragment>
                  ) : (
                    `單字 ${c.range}`
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* Stage grid ("田" concept: each tile = a stage) */}
        {mode !== "mistake" && (
          <div style={{ padding: "0.5rem 1.5rem 0" }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "0.7rem",
              }}
            >
              {(currentChapter?.stages || []).flatMap((stage, localIdx) => {
                const key = stageProgKey(stage.words);
                const prog = progress[key];
                const rec = srs[key];
                const reviewStatus = stageReviewStatus(rec);
                const isDue = reviewStatus.state === "due";
                // Use localIdx (position within THIS chapter) rather than
                // stage.index (position across the whole word bank) — using
                // the global index here double-counted the chapter offset
                // once chapters beyond the first one exist (100+ words).
                // Stage number is continuous across the whole level/theme
                // (chapter 2's first stage is 11, not 1 again), since chapters
                // are just a pagination grouping, not a separate counting unit.
                const stageNumber = currentChapter.index * CHAPTERS_STAGE_COUNT + localIdx + 1;
                // v4.8.0 item ⑧ / v4.8.3 redesign: the "複數形式" sub-stage
                // unlocks once the Day-3 review (SRS_SCHEDULE index 1) has
                // been consumed — i.e. rec.stepIndex has moved past it — and
                // only if this stage actually has enough plural-eligible
                // nouns to be worth a sub-stage at all. It now renders as its
                // own grid tile immediately after the parent stage's tile
                // (instead of a small overlay icon), so it's a first-class,
                // independently clickable item in the grid.
                const pluralWords = pluralEligibleWords(stage.words);
                const pluralReady = !!rec && rec.stepIndex >= 2 && pluralWords.length >= PLURAL_SUBSTAGE_MIN_WORDS;

                const tiles = [
                  <button
                    key={stage.index}
                    onClick={() => enterStage(stage.words, `第 ${stageNumber} 關`)}
                    style={{
                      width: "100%",
                      position: "relative",
                      background: prog ? info.light : "#F9F1E6",
                      border: `1.5px solid ${isDue ? "#C0392B" : prog ? info.color : "#ECDFCA"}`,
                      borderRadius: "0.85rem",
                      padding: "0.75rem 0.5rem",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "0.3rem",
                      cursor: "pointer",
                      boxSizing: "border-box",
                    }}
                  >
                    {isDue && (
                      <span
                        title="該複習了"
                        style={{
                          position: "absolute",
                          top: "0.4rem",
                          right: "0.4rem",
                          width: "0.5rem",
                          height: "0.5rem",
                          borderRadius: "9999px",
                          background: "#C0392B",
                        }}
                      />
                    )}
                    <span
                      style={{
                        fontFamily: "'IBM Plex Mono', monospace",
                        fontWeight: 700,
                        fontSize: "0.95rem",
                        color: prog ? info.color : "#C9B89E",
                      }}
                    >
                      {stageNumber}
                    </span>
                    <span style={{ fontSize: "0.62rem", color: isDue ? "#C0392B" : "#A99B85", fontWeight: isDue ? 700 : 400 }}>
                      {isDue ? "🔔 該複習了" : prog ? `玩過 ${prog.plays} 次` : "未挑戰"}
                    </span>
                  </button>,
                ];

                if (pluralReady) {
                  tiles.push(
                    <button
                      key={`${stage.index}-plural`}
                      title="複數形式練習"
                      onClick={() => enterPluralStage(stage.words, `第 ${stageNumber} 關 · 複數形式`)}
                      style={{
                        width: "100%",
                        background: "#EFE6D0",
                        border: "1.5px dashed #B7A688",
                        borderRadius: "0.85rem",
                        padding: "0.75rem 0.5rem",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "0.3rem",
                        cursor: "pointer",
                        boxSizing: "border-box",
                      }}
                    >
                      <Sparkles size={17} color="#B98A2E" />
                      <span
                        style={{
                          fontFamily: "'IBM Plex Mono', monospace",
                          fontWeight: 700,
                          fontSize: "0.78rem",
                          color: "#8A7A5E",
                        }}
                      >
                        {stageNumber}-los/las
                      </span>
                    </button>
                  );
                }

                return tiles;
              })}
            </div>
          </div>
        )}

        {/* Mistake book ("錯題本") */}
        {mode === "mistake" && (
          <div style={{ padding: "0.5rem 1.5rem 0" }}>
            <div style={{ display: "flex", gap: "0.6rem", marginBottom: "1.1rem" }}>
              <div style={{ flex: 1, background: "#F9F1E6", borderRadius: "0.8rem", padding: "0.7rem 0.6rem", textAlign: "center" }}>
                <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontWeight: 700, fontSize: "1.1rem", color: "#3A2E1F" }}>
                  {mistakeList.length}
                </div>
                <div style={{ fontSize: "0.65rem", color: "#8A7A5E", marginTop: "0.1rem" }}>錯題本總數</div>
              </div>
              <div style={{ flex: 1, background: dueMistakeList.length > 0 ? MISTAKE_INFO.light : "#F9F1E6", borderRadius: "0.8rem", padding: "0.7rem 0.6rem", textAlign: "center" }}>
                <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontWeight: 700, fontSize: "1.1rem", color: dueMistakeList.length > 0 ? MISTAKE_INFO.color : "#3A2E1F" }}>
                  {dueMistakeList.length}
                </div>
                <div style={{ fontSize: "0.65rem", color: "#8A7A5E", marginTop: "0.1rem" }}>今日待複習</div>
              </div>
            </div>

            {dueMistakeList.length === 0 ? (
              <div style={{ background: "#F9F1E6", borderRadius: "0.9rem", padding: "1.3rem 1.1rem", fontSize: "0.82rem", color: "#8A7A5E", lineHeight: 1.6 }}>
                {mistakeList.length === 0
                  ? "太棒了,目前沒有任何錯題!當你在「分級」或「主題」關卡完成第 14 天複習時,答錯的單字才會自動收錄進這裡。"
                  : `目前沒有錯題需要複習。錯題本裡共有 ${mistakeList.length} 個字在排程中,下一次複習日期是 ${nextMistakeDueDate}。`}
              </div>
            ) : (
              <React.Fragment>
                <p style={{ fontSize: "0.78rem", color: "#8A7A5E", marginTop: 0, marginBottom: "0.7rem" }}>
                  以下是今天到期的錯題複習關卡,每關最多 10 個字:
                </p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.7rem" }}>
                  {mistakeChunks.map((chunk, idx) => (
                    <button
                      key={idx}
                      onClick={() => enterMistakeReview(chunk, idx)}
                      style={{
                        background: MISTAKE_INFO.light,
                        border: `1.5px solid ${MISTAKE_INFO.color}`,
                        borderRadius: "0.85rem",
                        padding: "0.75rem 0.5rem",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "0.3rem",
                        cursor: "pointer",
                      }}
                    >
                      <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontWeight: 700, fontSize: "0.85rem", color: MISTAKE_INFO.color }}>
                        錯題 {idx + 1}
                      </span>
                      <span style={{ fontSize: "0.62rem", color: "#8A7A5E" }}>{chunk.length} 個字</span>
                    </button>
                  ))}
                </div>
              </React.Fragment>
            )}

            {mistakeList.length > 0 && (
              <div style={{ marginTop: "1.4rem" }}>
                <div style={{ fontSize: "0.78rem", color: "#8A7A5E", fontWeight: 600, marginBottom: "0.5rem" }}>
                  錯題清單({mistakeList.length})
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                  {mistakeList
                    .slice()
                    .sort((a, b) => (stageReviewStatus(a).dueDate || "").localeCompare(stageReviewStatus(b).dueDate || ""))
                    .map((m) => {
                      const status = stageReviewStatus(m);
                      const due = status.state === "due";
                      return (
                        <div
                          key={m.es}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            background: "#F9F1E6",
                            borderRadius: "0.6rem",
                            padding: "0.5rem 0.75rem",
                            fontSize: "0.78rem",
                          }}
                        >
                          <div>
                            <span style={{ fontFamily: "'Fraunces', serif", fontStyle: "italic", fontWeight: 600, color: "#3A2E1F" }}>
                              {m.word.es}
                            </span>
                            <span style={{ color: "#8A7A5E", marginLeft: "0.4rem" }}>{m.word.zh}</span>
                          </div>
                          <span style={{ color: due ? "#C0392B" : "#A99B85", fontWeight: due ? 700 : 400 }}>
                            {due ? "🔔 待複習" : `下次 ${status.dueDate}`}
                          </span>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* v4.19.0(改動F): chapter-unlock confirm popup, same modal pattern
            as pluralPopup on the lesson screen (dark overlay + centered
            card). Shows a clickable "花點數解鎖" button when affordable,
            otherwise just the "還差 X 點" message with no purchase button. */}
        {chapterUnlockPrompt && (
          <div
            onClick={() => setChapterUnlockPrompt(null)}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.55)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "2rem",
              zIndex: 50,
            }}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                background: "#F9F1E6",
                borderRadius: "1rem",
                padding: "1.5rem",
                width: "100%",
                maxWidth: "20rem",
                textAlign: "center",
              }}
            >
              <Lock size={22} color="#B98A2E" />
              <div style={{ fontSize: "1rem", fontWeight: 700, color: "#3A2E1F", marginTop: "0.6rem" }}>
                單字 {chapters.find((c) => c.index === chapterUnlockPrompt.chapterIdx)?.range} 尚未解鎖
              </div>
              <div style={{ fontSize: "0.82rem", color: "#8A7A5E", marginTop: "0.5rem", lineHeight: 1.6 }}>
                花 <strong style={{ color: "#B98A2E" }}>{CHAPTER_UNLOCK_POINTS} 點</strong> 就能解鎖這個大關(目前 {points} 點)。
              </div>
              {points >= CHAPTER_UNLOCK_POINTS ? (
                <button
                  onClick={confirmUnlockChapter}
                  style={{
                    marginTop: "1.1rem",
                    width: "100%",
                    padding: "0.65rem",
                    borderRadius: "0.6rem",
                    border: "none",
                    background: "#B98A2E",
                    color: "#FDF6EC",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  花 {CHAPTER_UNLOCK_POINTS} 點解鎖
                </button>
              ) : (
                <div style={{ fontSize: "0.78rem", color: "#C0392B", marginTop: "1rem" }}>
                  還差 {CHAPTER_UNLOCK_POINTS - points} 點,再多完成幾個小關卡就有了。
                </div>
              )}
              <button
                onClick={() => setChapterUnlockPrompt(null)}
                style={{
                  marginTop: "0.6rem",
                  width: "100%",
                  padding: "0.55rem",
                  borderRadius: "0.6rem",
                  border: "1px solid #D8CBA8",
                  background: "transparent",
                  color: "#8A7A5E",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                關閉
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ---------------------------------------------------------------------
  // Screen: CHECKIN (v4.9.0 item③④: daily check-in calendar + streak + points)
  // ---------------------------------------------------------------------
  if (screen === "checkin") {
    const today = todayStr();
    const checkedInToday = !!checkins[today];
    const streak = computeStreak(checkins, today);
    const now = new Date();
    const year = now.getFullYear();
    const monthIdx0 = now.getMonth(); // 0-based
    const monthLabel = `${year}年${monthIdx0 + 1}月`;
    const daysInMonth = new Date(year, monthIdx0 + 1, 0).getDate();
    const firstWeekdayMon = (new Date(year, monthIdx0, 1).getDay() + 6) % 7; // 0=Mon..6=Sun
    const pad2 = (n) => String(n).padStart(2, "0");
    const cells = [];
    for (let i = 0; i < firstWeekdayMon; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(d);

    // v4.19.0(改動F): flat price now (CHAPTER_UNLOCK_POINTS for every
    // chapter, every level), so there's no more "which threshold is
    // closest" question — just how many chapters are still locked overall,
    // and whether the current balance already covers one.
    const totalLockedChapters = LEVELS.reduce((sum, lvl) => {
      const chapterCount = Math.ceil(Math.ceil((WORD_BANK[lvl] || []).length / STAGE_SIZE) / CHAPTERS_STAGE_COUNT);
      let locked = 0;
      for (let i = 1; i < chapterCount; i++) {
        if (!isChapterUnlocked(lvl, i, unlockedChapters)) locked++;
      }
      return sum + locked;
    }, 0);

    return (
      <div style={{ minHeight: "100vh", background: "#FDF6EC", fontFamily: "'Inter', sans-serif", paddingBottom: "3rem" }}>
        <TopBar title="打卡日曆" onBack={() => setScreen("map")} />

        <div style={{ padding: "0 1.25rem" }}>
          <div style={{ display: "flex", gap: "0.6rem", marginBottom: "1.1rem" }}>
            <div style={{ flex: 1, background: "#FBEFE4", borderRadius: "0.9rem", padding: "0.9rem 0.7rem", textAlign: "center" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.3rem", color: "#B85C2E" }}>
                <Flame size={16} />
                <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontWeight: 700, fontSize: "1.15rem" }}>{streak}</span>
              </div>
              <div style={{ fontSize: "0.65rem", color: "#8A7A5E", marginTop: "0.2rem" }}>連續打卡天數</div>
            </div>
            <div style={{ flex: 1, background: "#F6EAD3", borderRadius: "0.9rem", padding: "0.9rem 0.7rem", textAlign: "center" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.3rem", color: "#B98A2E" }}>
                <Sparkles size={16} />
                <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontWeight: 700, fontSize: "1.15rem" }}>{points}</span>
              </div>
              <div style={{ fontSize: "0.65rem", color: "#8A7A5E", marginTop: "0.2rem" }}>目前點數</div>
            </div>
          </div>

          <button
            onClick={handleCheckin}
            disabled={checkedInToday}
            style={{
              width: "100%",
              padding: "0.9rem",
              borderRadius: "0.8rem",
              border: "none",
              background: checkedInToday ? "#EFE6D0" : "#E07A5F",
              color: checkedInToday ? "#8A7A5E" : "#FDF6EC",
              fontWeight: 700,
              fontSize: "0.9rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.4rem",
              cursor: checkedInToday ? "default" : "pointer",
              boxSizing: "border-box",
              marginBottom: "1.3rem",
            }}
          >
            {checkedInToday ? (
              <React.Fragment>
                <Check size={16} /> 今天已經打卡囉!
              </React.Fragment>
            ) : (
              <React.Fragment>
                <Flame size={16} /> 打卡(+{POINTS_CHECKIN} 點)
              </React.Fragment>
            )}
          </button>

          <div style={{ fontFamily: "'Fraunces', serif", fontWeight: 600, fontSize: "0.95rem", color: "#3A2E1F", marginBottom: "0.6rem" }}>
            {monthLabel}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "0.35rem", marginBottom: "0.3rem" }}>
            {["一", "二", "三", "四", "五", "六", "日"].map((w) => (
              <div key={w} style={{ textAlign: "center", fontSize: "0.65rem", color: "#A99B85", fontWeight: 600 }}>
                {w}
              </div>
            ))}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "0.35rem", marginBottom: "1.4rem" }}>
            {cells.map((d, i) => {
              if (d === null) return <div key={`blank-${i}`} />;
              const dateStr = `${year}-${pad2(monthIdx0 + 1)}-${pad2(d)}`;
              const isToday = dateStr === today;
              const checked = !!checkins[dateStr];
              return (
                <div
                  key={dateStr}
                  style={{
                    aspectRatio: "1",
                    borderRadius: "0.5rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.72rem",
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontWeight: checked || isToday ? 700 : 400,
                    background: checked ? "#B98A2E" : "#F9F1E6",
                    color: checked ? "#FDF6EC" : isToday ? "#E07A5F" : "#A99B85",
                    border: isToday && !checked ? "1.5px solid #E07A5F" : "1.5px solid transparent",
                    boxSizing: "border-box",
                  }}
                >
                  {d}
                </div>
              );
            })}
          </div>

          {totalLockedChapters > 0 && (
            <div style={{ background: "#F9F1E6", borderRadius: "0.9rem", padding: "0.9rem 1rem", fontSize: "0.78rem", color: "#5C4E3A", lineHeight: 1.6 }}>
              {points >= CHAPTER_UNLOCK_POINTS ? (
                <React.Fragment>
                  目前點數已經夠解鎖新章節了!到「分級」地圖挑一個上鎖的大關,花{" "}
                  <strong style={{ color: "#B98A2E" }}>{CHAPTER_UNLOCK_POINTS} 點</strong> 就能解鎖。
                </React.Fragment>
              ) : (
                <React.Fragment>
                  還差 <strong style={{ color: "#B98A2E" }}>{CHAPTER_UNLOCK_POINTS - points} 點</strong> 就能解鎖下一個大關(每個大關固定 {CHAPTER_UNLOCK_POINTS} 點,目前還有 {totalLockedChapters} 個大關待解鎖)。
                </React.Fragment>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------
  // Screen: LESSON (teach the 10 words before quiz)
  // ---------------------------------------------------------------------
  if (screen === "lesson" && activeStage) {
    const lessonTitle =
      activeStage.kind === "mistake" || activeStage.kind === "plural" || activeStage.kind === "daily"
        ? activeStage.stageLabel
        : `${info.label} · ${activeStage.stageLabel}`;
    return (
      <div style={{ minHeight: "100vh", background: "#FDF6EC", fontFamily: "'Inter', sans-serif", paddingBottom: "9.5rem" }}>
        <TopBar title={lessonTitle} onBack={backToMap} />
        {activeStage.kind === "plural" && (
          <div style={{ padding: "0 1.25rem 0.7rem" }}>
            <div style={{ background: "#F3E7D6", borderRadius: "0.9rem", padding: "1rem 1.1rem", fontSize: "0.8rem", color: "#6B5B3E", lineHeight: 1.6 }}>
              <strong>複數規則小提醒:</strong> 字尾是母音(a/e/i/o/u)→ 加 -s;字尾是子音 → 加 -es;字尾是
              -z → 改成 -ces(例如 lápiz → lápices)。以下是這一關可以練習複數的單字:
            </div>
          </div>
        )}
        <div style={{ padding: "0 1.25rem", display: "flex", flexDirection: "column", gap: "0.7rem" }}>
          {activeStage.words.map((w, i) => (
            <div
              key={i}
              style={{
                background: "#F9F1E6",
                borderRadius: "0.9rem",
                padding: "1rem 1.1rem",
                position: "relative",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: "0.3rem", flexWrap: "wrap" }}>
                  <span
                    style={{
                      fontFamily: "'Fraunces', serif",
                      fontStyle: "italic",
                      fontWeight: 500,
                      fontSize: "1.3rem",
                      color: "#3A2E1F",
                    }}
                  >
                    {w.es}
                  </span>
                  <GenderBadge word={w} />
                  <CognateHint word={w} />
                </div>
                <div style={{ display: "flex", gap: "0.4rem" }}>
                  <button
                    onClick={() => setPluralPopup(w)}
                    style={{
                      background: "none",
                      border: "1px solid #D8CBA8",
                      borderRadius: "9999px",
                      width: "1.7rem",
                      height: "1.7rem",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#8A7A5E",
                      cursor: "pointer",
                    }}
                  >
                    <Info size={12} />
                  </button>
                  <button
                    onClick={() => speak(w.es)}
                    style={{
                      background: "none",
                      border: "1px solid #D8CBA8",
                      borderRadius: "9999px",
                      width: "1.7rem",
                      height: "1.7rem",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#8A7A5E",
                      cursor: "pointer",
                    }}
                  >
                    <Volume2 size={12} />
                  </button>
                </div>
              </div>
              <div style={{ color: "#8A7A5E", fontSize: "0.75rem", marginTop: "0.15rem" }}>{w.pos}</div>
              <div style={{ fontSize: "1rem", fontWeight: 600, color: "#3A2E1F", marginTop: "0.5rem" }}>{w.zh}</div>
              {activeStage.kind === "plural" && w.plural && (
                <div style={{ fontSize: "0.8rem", color: "#B98A2E", marginTop: "0.35rem" }}>
                  複數:{w.gender === "f" ? "las " : "los "}
                  {w.plural}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* v4.8.1 fix: the skip-listening toggle used to sit in normal page
            flow AFTER all 10 word cards, so on most screens it was pushed
            below the fold — invisible unless the user scrolled all the way
            down past the whole word list, even though the fixed "開始測驗"
            button right next to it was always on-screen. Moved it into the
            same fixed footer as the button so it's always visible together,
            no scrolling required. */}
        <div
          style={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            padding: "0.9rem 1.25rem 1.4rem",
            background: "linear-gradient(to top, #FDF6EC 75%, transparent)",
          }}
        >
          <React.Fragment>
              {activeStage.kind !== "plural" && (
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.5rem",
                    fontSize: "0.8rem",
                    color: "#8A7A5E",
                    cursor: "pointer",
                    marginBottom: "0.6rem",
                    background: "#F9F1E6",
                    border: "1px solid #ECDFCA",
                    borderRadius: "0.6rem",
                    padding: "0.5rem",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={skipListening}
                    onChange={(e) => setSkipListening(e.target.checked)}
                  />
                  跳過聽力題
                </label>
              )}
              <button
                onClick={startQuiz}
                style={{
                  width: "100%",
                  padding: "0.9rem",
                  borderRadius: "0.8rem",
                  border: "none",
                  background: "#E07A5F",
                  color: "#FDF6EC",
                  fontWeight: 700,
                  fontSize: "0.95rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.4rem",
                  cursor: "pointer",
                  boxSizing: "border-box",
                }}
              >
                <Play size={16} /> {activeStage.kind === "plural" ? "開始複數測驗" : "開始測驗"}
              </button>
            </React.Fragment>
        </div>

        {pluralPopup && (
          <div
            onClick={() => setPluralPopup(null)}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.55)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "2rem",
              zIndex: 50,
            }}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                background: "#F9F1E6",
                borderRadius: "1rem",
                padding: "1.5rem",
                width: "100%",
                maxWidth: "20rem",
                textAlign: "center",
              }}
            >
              {pluralPopup.plural && (
                <React.Fragment>
                  <div style={{ fontSize: "0.8rem", color: "#8A7A5E" }}>複數形式</div>
                  <div
                    style={{
                      fontFamily: "'Fraunces', serif",
                      fontStyle: "italic",
                      fontWeight: 600,
                      fontSize: "1.6rem",
                      color: "#3A2E1F",
                      marginTop: "0.4rem",
                    }}
                  >
                    {pluralPopup.gender === "f" ? "las " : "los "}
                    {pluralPopup.plural}
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "#A99B85", marginTop: "0.5rem" }}>
                    單數:{pluralPopup.gender === "f" ? "la " : "el "}
                    {pluralPopup.es}
                  </div>
                </React.Fragment>
              )}
              {pluralPopup.note && (
                <div style={{ fontSize: "0.72rem", color: "#B98A2E", marginTop: pluralPopup.plural ? "0.6rem" : 0 }}>
                  ※ {pluralPopup.note}
                </div>
              )}
              {pluralPopup.ex && (
                <div
                  style={{
                    marginTop: pluralPopup.plural || pluralPopup.note ? "1rem" : 0,
                    paddingTop: pluralPopup.plural || pluralPopup.note ? "1rem" : 0,
                    borderTop: pluralPopup.plural || pluralPopup.note ? "1px solid #E9DFC4" : "none",
                  }}
                >
                  <div style={{ fontSize: "0.8rem", color: "#8A7A5E" }}>例句</div>
                  <div
                    style={{
                      fontFamily: "'Fraunces', serif",
                      fontStyle: "italic",
                      fontSize: "1rem",
                      color: "#3A2E1F",
                      marginTop: "0.45rem",
                      lineHeight: 1.5,
                    }}
                  >
                    {pluralPopup.ex}
                  </div>
                  <div style={{ fontSize: "0.78rem", color: "#8A7A5E", marginTop: "0.35rem" }}>{pluralPopup.exZh}</div>
                </div>
              )}
              <button
                onClick={() => setPluralPopup(null)}
                style={{
                  marginTop: "1rem",
                  width: "100%",
                  padding: "0.55rem",
                  borderRadius: "0.6rem",
                  border: "none",
                  background: "#3A2E1F",
                  color: "#F5EFE0",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                關閉
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ---------------------------------------------------------------------
  // Screen: QUIZ
  // ---------------------------------------------------------------------
  if (screen === "quiz" && quizState) {
    const q = quizState.questions[quizState.qIndex];
    const progressPct = Math.round((quizState.qIndex / quizState.questions.length) * 100);
    const quizTitle =
      activeStage.kind === "mistake" || activeStage.kind === "plural" || activeStage.kind === "daily"
        ? `${activeStage.stageLabel} · 測驗`
        : `${info.label} · 測驗`;

    let promptNode = null;
    let optionsNode = null;

    if (q.type === "zh2es") {
      promptNode = (
        <div style={{ fontSize: "1.5rem", fontWeight: 600, color: "#3A2E1F" }}>{q.word.zh}</div>
      );
      // v4.8.0 item ①: every option here IS a Spanish word the user might
      // want to hear, so each gets its own small speaker button alongside
      // the main choice button (kept as a separate sibling button, not
      // nested inside it — a <button> can't contain another <button>).
      optionsNode = q.options.map((opt, i) => {
        const isCorrect = opt.es === q.word.es;
        const isSelected = quizState.selectedIndex === i;
        const showState = quizState.showFeedback && (isSelected || isCorrect);
        return (
          <div key={i} style={{ display: "flex", gap: "0.5rem", alignItems: "stretch" }}>
            <div style={{ flex: 1 }}>
              <OptionButton onClick={() => chooseOption(i)} showState={showState} isCorrect={isCorrect} isSelected={isSelected}>
                {opt.es}
              </OptionButton>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                speak(opt.es);
              }}
              aria-label="播放發音"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "2.6rem",
                borderRadius: "0.75rem",
                border: "none",
                background: "#E9DFC4",
                color: "#8A7A5E",
                cursor: "pointer",
                flexShrink: 0,
              }}
            >
              <Volume2 size={14} />
            </button>
          </div>
        );
      });
    } else if (q.type === "es2zh") {
      promptNode = (
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <div style={{ fontFamily: "'Fraunces', serif", fontStyle: "italic", fontWeight: 500, fontSize: "1.7rem", color: "#3A2E1F" }}>
              {q.word.es}
            </div>
            <button
              onClick={() => speak(q.word.es)}
              aria-label="播放發音"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "2.1rem",
                height: "2.1rem",
                borderRadius: "9999px",
                border: "none",
                background: "#E9DFC4",
                color: "#8A7A5E",
                cursor: "pointer",
                flexShrink: 0,
              }}
            >
              <Volume2 size={16} />
            </button>
          </div>
          <div style={{ fontSize: "0.8rem", color: "#8A7A5E", marginTop: "0.2rem" }}>
            {q.word.pos}
            <GenderBadge word={q.word} />
          </div>
        </div>
      );
      optionsNode = q.options.map((opt, i) => {
        const isCorrect = opt.es === q.word.es;
        const isSelected = quizState.selectedIndex === i;
        const showState = quizState.showFeedback && (isSelected || isCorrect);
        return (
          <OptionButton key={i} onClick={() => chooseOption(i)} showState={showState} isCorrect={isCorrect} isSelected={isSelected}>
            {opt.zh}
          </OptionButton>
        );
      });
    } else if (q.type === "audio2zh") {
      promptNode = (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.6rem" }}>
          <button
            onClick={() => speak(q.word.es)}
            aria-label="播放發音"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "0.5rem",
              background: "#E9DFC4",
              border: "none",
              borderRadius: "9999px",
              width: "5rem",
              height: "5rem",
              justifyContent: "center",
              margin: "0 auto",
              cursor: "pointer",
              color: "#8A7A5E",
            }}
          >
            <Volume2 size={26} />
          </button>
          {quizState.showFeedback && (
            <div
              style={{
                fontFamily: "'Fraunces', serif",
                fontStyle: "italic",
                fontWeight: 500,
                fontSize: "1.3rem",
                color: "#3A2E1F",
              }}
            >
              {q.word.es}
            </div>
          )}
        </div>
      );
      optionsNode = q.options.map((opt, i) => {
        const isCorrect = opt.es === q.word.es;
        const isSelected = quizState.selectedIndex === i;
        const showState = quizState.showFeedback && (isSelected || isCorrect);
        return (
          <OptionButton key={i} onClick={() => chooseOption(i)} showState={showState} isCorrect={isCorrect} isSelected={isSelected}>
            {opt.zh}
          </OptionButton>
        );
      });
    } else if (q.type === "spelling") {
      // v4.18.0 item①: spelling questions used to show only the Chinese
      // meaning with no audio hint at all, which made them noticeably harder
      // than every other question type (nothing to listen to before typing).
      // Add a speaker button that plays the target word's pronunciation —
      // available before AND after answering, same as the other types.
      promptNode = (
        <div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}>
            <div style={{ fontSize: "1.3rem", fontWeight: 600, color: "#3A2E1F" }}>{q.word.zh}</div>
            <button
              onClick={() => speak(q.word.es)}
              aria-label="播放發音"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "2.1rem",
                height: "2.1rem",
                borderRadius: "9999px",
                border: "none",
                background: "#E9DFC4",
                color: "#8A7A5E",
                cursor: "pointer",
                flexShrink: 0,
              }}
            >
              <Volume2 size={16} />
            </button>
          </div>
          <div style={{ fontSize: "0.75rem", color: "#8A7A5E", marginTop: "0.2rem" }}>拼出西班牙文(可先聽發音)</div>
        </div>
      );
      const isCorrect = quizState.showFeedback && checkSpellingAnswer(quizState.inputValue, q.word.es);
      optionsNode = (
        <div>
          <input
            ref={spellingInputRef}
            type="text"
            value={quizState.inputValue}
            disabled={quizState.showFeedback}
            onChange={(e) => setQuizState((prev) => ({ ...prev, inputValue: e.target.value }))}
            placeholder="輸入西班牙文…(英文鍵盤打法也可以)"
            style={{
              width: "100%",
              padding: "0.8rem 1rem",
              borderRadius: "0.7rem",
              border: `1.5px solid ${quizState.showFeedback ? (isCorrect ? "#7D9471" : "#C0392B") : "#ECDFCA"}`,
              background: "#F9F1E6",
              color: "#3A2E1F",
              fontSize: "1rem",
              outline: "none",
              boxSizing: "border-box",
            }}
          />
          {!quizState.showFeedback && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem", marginTop: "0.6rem" }}>
              {SPECIAL_CHARS.map((char) => (
                <button
                  key={char}
                  type="button"
                  onClick={() => insertSpecialChar(char)}
                  style={{
                    width: "2.1rem",
                    height: "2.1rem",
                    borderRadius: "0.5rem",
                    border: "1px solid #E0CFB4",
                    background: "#F4E9DC",
                    color: "#B5674F",
                    fontFamily: "'Fraunces', serif",
                    fontSize: "1rem",
                    cursor: "pointer",
                  }}
                >
                  {char}
                </button>
              ))}
            </div>
          )}
          {quizState.showFeedback && (
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "0.6rem" }}>
              <button
                onClick={() => speak(q.word.es)}
                aria-label="播放發音"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "2.1rem",
                  height: "2.1rem",
                  borderRadius: "9999px",
                  border: "none",
                  background: "#E9DFC4",
                  color: "#8A7A5E",
                  cursor: "pointer",
                  flexShrink: 0,
                }}
              >
                <Volume2 size={14} />
              </button>
              {!isCorrect && (
                <div style={{ fontSize: "0.85rem", color: "#C0392B" }}>
                  正確答案:<strong>{q.word.es}</strong>
                </div>
              )}
            </div>
          )}
          {!quizState.showFeedback && (
            <button
              onClick={submitSpelling}
              style={{
                marginTop: "0.8rem",
                width: "100%",
                padding: "0.75rem",
                borderRadius: "0.7rem",
                border: "none",
                background: "#E07A5F",
                color: "#FDF6EC",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              送出答案
            </button>
          )}
        </div>
      );
    } else if (q.type === "gender") {
      // v4.8.0 item ⑦: gender (el/la) question, added on top of the base 20
      // questions once per gendered word in the stage.
      promptNode = (
        <div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}>
            <div style={{ fontFamily: "'Fraunces', serif", fontStyle: "italic", fontWeight: 500, fontSize: "1.7rem", color: "#3A2E1F" }}>
              {q.word.es}
            </div>
            <button
              onClick={() => speak(q.word.es)}
              aria-label="播放發音"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "2.1rem",
                height: "2.1rem",
                borderRadius: "9999px",
                border: "none",
                background: "#E9DFC4",
                color: "#8A7A5E",
                cursor: "pointer",
                flexShrink: 0,
              }}
            >
              <Volume2 size={16} />
            </button>
          </div>
          <div style={{ fontSize: "0.8rem", color: "#8A7A5E", marginTop: "0.2rem" }}>
            {q.word.zh} · 這個字是陽性還是陰性?
          </div>
        </div>
      );
      optionsNode = q.options.map((g, i) => {
        const isCorrect = g === q.word.gender;
        const isSelected = quizState.selectedIndex === i;
        const showState = quizState.showFeedback && (isSelected || isCorrect);
        return (
          <OptionButton key={i} onClick={() => chooseOption(i)} showState={showState} isCorrect={isCorrect} isSelected={isSelected}>
            {g === "m" ? "el(陽性)" : "la(陰性)"}
          </OptionButton>
        );
      });
    } else if (q.type === "pluralChoice") {
      // v4.8.0 item ⑧: plural sub-stage question — shown the singular form,
      // pick its correct plural among distractors from other plural-eligible
      // words in this same stage.
      promptNode = (
        <div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}>
            <div style={{ fontFamily: "'Fraunces', serif", fontStyle: "italic", fontWeight: 500, fontSize: "1.7rem", color: "#3A2E1F" }}>
              {q.word.es}
            </div>
            <button
              onClick={() => speak(q.word.es)}
              aria-label="播放發音"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "2.1rem",
                height: "2.1rem",
                borderRadius: "9999px",
                border: "none",
                background: "#E9DFC4",
                color: "#8A7A5E",
                cursor: "pointer",
                flexShrink: 0,
              }}
            >
              <Volume2 size={16} />
            </button>
          </div>
          <div style={{ fontSize: "0.8rem", color: "#8A7A5E", marginTop: "0.2rem" }}>{q.word.zh} · 它的複數形式是?</div>
        </div>
      );
      optionsNode = q.options.map((opt, i) => {
        const isCorrect = opt.es === q.word.es;
        const isSelected = quizState.selectedIndex === i;
        const showState = quizState.showFeedback && (isSelected || isCorrect);
        return (
          <OptionButton key={i} onClick={() => chooseOption(i)} showState={showState} isCorrect={isCorrect} isSelected={isSelected}>
            {opt.plural}
          </OptionButton>
        );
      });
    } else if (q.type === "pluralSpelling") {
      // v4.17.0 item ②: plural sub-stage spelling question — shown the
      // singular form, type out its plural form directly (no article, no
      // options). Reuses the same spelling-input UI/logic as the main
      // "spelling" question type, just checked against q.word.plural instead
      // of q.word.es (see submitSpelling above).
      promptNode = (
        <div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}>
            <div style={{ fontFamily: "'Fraunces', serif", fontStyle: "italic", fontWeight: 500, fontSize: "1.7rem", color: "#3A2E1F" }}>
              {q.word.es}
            </div>
            <button
              onClick={() => speak(q.word.es)}
              aria-label="播放發音"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "2.1rem",
                height: "2.1rem",
                borderRadius: "9999px",
                border: "none",
                background: "#E9DFC4",
                color: "#8A7A5E",
                cursor: "pointer",
                flexShrink: 0,
              }}
            >
              <Volume2 size={16} />
            </button>
          </div>
          <div style={{ fontSize: "0.8rem", color: "#8A7A5E", marginTop: "0.2rem" }}>{q.word.zh} · 拼出它的複數形式</div>
        </div>
      );
      const isCorrect = quizState.showFeedback && checkSpellingAnswer(quizState.inputValue, q.word.plural);
      optionsNode = (
        <div>
          <input
            ref={spellingInputRef}
            type="text"
            value={quizState.inputValue}
            disabled={quizState.showFeedback}
            onChange={(e) => setQuizState((prev) => ({ ...prev, inputValue: e.target.value }))}
            placeholder="輸入西班牙文複數形式…(英文鍵盤打法也可以)"
            style={{
              width: "100%",
              padding: "0.8rem 1rem",
              borderRadius: "0.7rem",
              border: `1.5px solid ${quizState.showFeedback ? (isCorrect ? "#7D9471" : "#C0392B") : "#ECDFCA"}`,
              background: "#F9F1E6",
              color: "#3A2E1F",
              fontSize: "1rem",
              outline: "none",
              boxSizing: "border-box",
            }}
          />
          {!quizState.showFeedback && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem", marginTop: "0.6rem" }}>
              {SPECIAL_CHARS.map((char) => (
                <button
                  key={char}
                  type="button"
                  onClick={() => insertSpecialChar(char)}
                  style={{
                    width: "2.1rem",
                    height: "2.1rem",
                    borderRadius: "0.5rem",
                    border: "1px solid #E0CFB4",
                    background: "#F4E9DC",
                    color: "#B5674F",
                    fontFamily: "'Fraunces', serif",
                    fontSize: "1rem",
                    cursor: "pointer",
                  }}
                >
                  {char}
                </button>
              ))}
            </div>
          )}
          {quizState.showFeedback && (
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "0.6rem" }}>
              <button
                onClick={() => speak(q.word.es)}
                aria-label="播放發音"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "2.1rem",
                  height: "2.1rem",
                  borderRadius: "9999px",
                  border: "none",
                  background: "#E9DFC4",
                  color: "#8A7A5E",
                  cursor: "pointer",
                  flexShrink: 0,
                }}
              >
                <Volume2 size={14} />
              </button>
              {!isCorrect && (
                <div style={{ fontSize: "0.85rem", color: "#C0392B" }}>
                  正確答案:<strong>{q.word.plural}</strong>
                </div>
              )}
            </div>
          )}
          {!quizState.showFeedback && (
            <button
              onClick={submitSpelling}
              style={{
                marginTop: "0.8rem",
                width: "100%",
                padding: "0.75rem",
                borderRadius: "0.7rem",
                border: "none",
                background: "#E07A5F",
                color: "#FDF6EC",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              送出答案
            </button>
          )}
        </div>
      );
    }

    return (
      <div style={{ minHeight: "100vh", background: "#FDF6EC", fontFamily: "'Inter', sans-serif" }}>
        <TopBar title={quizTitle} onBack={backToMap} />
        <div style={{ padding: "0 1.25rem" }}>
          <div style={{ height: "0.4rem", background: "#F9F1E6", borderRadius: "9999px", overflow: "hidden" }}>
            <div
              style={{
                height: "100%",
                width: `${progressPct}%`,
                background: info.color,
                transition: "width 0.3s ease",
              }}
            />
          </div>
          <div style={{ fontSize: "0.72rem", color: "#A99B85", marginTop: "0.4rem" }}>
            第 {quizState.qIndex + 1} / {quizState.questions.length} 題 · 第 {quizState.attemptNumber} 次挑戰
            {quizState.attemptNumber >= 3 ? "(含拼寫題)" : ""}
          </div>
        </div>

        <div style={{ padding: "1.5rem 1.25rem" }}>
          <div
            style={{
              background: "#F9F1E6",
              borderRadius: "1.1rem",
              padding: "2rem 1.4rem",
              minHeight: "9rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              marginBottom: "1.2rem",
            }}
          >
            {promptNode}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>{optionsNode}</div>

          {quizState.showFeedback && (
            <button
              onClick={nextQuestion}
              style={{
                marginTop: "1rem",
                width: "100%",
                padding: "0.8rem",
                borderRadius: "0.75rem",
                border: "none",
                background: quizState._wasCorrect ? "#7D9471" : "#C0392B",
                color: "#FDF6EC",
                fontWeight: 700,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.4rem",
              }}
            >
              {quizState._wasCorrect ? <Check size={16} /> : <X size={16} />}
              {quizState._wasCorrect ? "答對了!" : "答錯了"} · 下一題 →
            </button>
          )}
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------
  // Screen: RESULT
  // ---------------------------------------------------------------------
  if (screen === "result" && resultData) {
    const tier = masteryTier(resultData.accuracy);
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#FDF6EC",
          fontFamily: "'Inter', sans-serif",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem",
        }}
      >
        <div
          style={{
            background: "#F9F1E6",
            borderRadius: "1.2rem",
            padding: "2.2rem 1.6rem",
            width: "100%",
            maxWidth: "22rem",
            textAlign: "center",
          }}
        >
          <div style={{ fontFamily: "'Fraunces', serif", fontWeight: 600, fontSize: "1.3rem", color: "#3A2E1F" }}>
            本關結算
          </div>
          <div style={{ marginTop: "1rem", display: "flex", justifyContent: "center", gap: "0.2rem" }}>
            {[0, 1, 2].map((i) => (
              <Star key={i} size={26} fill={i < tier.stars ? tier.color : "none"} stroke={i < tier.stars ? tier.color : "#D8CBA8"} />
            ))}
          </div>
          <div style={{ fontSize: "0.9rem", color: tier.color, fontWeight: 700, marginTop: "0.4rem" }}>{tier.label}</div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.6rem", marginTop: "1.4rem" }}>
            {[
              { label: "答對", value: `${resultData.correct}/${resultData.total}` },
              { label: "正確率", value: `${resultData.accuracy}%` },
              { label: "第幾次挑戰", value: resultData.attemptNumber },
            ].map((s) => (
              <div key={s.label} style={{ background: "#EFE6D0", borderRadius: "0.7rem", padding: "0.7rem 0.4rem" }}>
                <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontWeight: 700, fontSize: "1.05rem", color: "#3A2E1F" }}>
                  {s.value}
                </div>
                <div style={{ fontSize: "0.62rem", color: "#8A7A5E", marginTop: "0.1rem" }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* v4.20.0(改動H1): 每日隨堂測驗只能玩一次(當天),沒有「再玩
              一次」的意義(不會再拿到點數,也沒有對應的教學卡畫面可以重
              新進入),所以這個按鈕只在非 daily 的情況才顯示。 */}
          {activeStage?.kind !== "daily" && (
            <button
              onClick={replayStage}
              style={{
                marginTop: "1.6rem",
                width: "100%",
                padding: "0.8rem",
                borderRadius: "0.75rem",
                border: "none",
                background: "#3A2E1F",
                color: "#F5EFE0",
                fontWeight: 700,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.4rem",
              }}
            >
              <RotateCcw size={15} /> 再玩一次
            </button>
          )}
          <button
            onClick={backToMap}
            style={{
              marginTop: activeStage?.kind === "daily" ? "1.6rem" : "0.6rem",
              width: "100%",
              padding: "0.8rem",
              borderRadius: "0.75rem",
              border: "1px solid #D8CBA8",
              background: "transparent",
              color: "#8A7A5E",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            返回關卡地圖
          </button>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------
  // Screen: INFO (App 說明 / 關於)
  // ---------------------------------------------------------------------
  if (screen === "info") {
    const Section = ({ title, children }) => (
      <div style={{ background: "#F9F1E6", borderRadius: "0.9rem", padding: "1.1rem 1.15rem", marginBottom: "0.9rem" }}>
        <div style={{ fontFamily: "'Fraunces', serif", fontWeight: 600, fontSize: "0.95rem", color: "#3A2E1F", marginBottom: "0.5rem" }}>
          {title}
        </div>
        <div style={{ fontSize: "0.8rem", color: "#5C4E3A", lineHeight: 1.75 }}>{children}</div>
      </div>
    );
    return (
      <div style={{ minHeight: "100vh", background: "#FDF6EC", fontFamily: "'Inter', sans-serif", paddingBottom: "3rem" }}>
        <TopBar title="關於本 App" onBack={backToMap} />
        <div style={{ padding: "0 1.25rem" }}>
          <Section title="📖 這是什麼">
            西文單字學習是一款單頁、純前端的西班牙文單字練習 App。透過「分級(CEFR
            A1–B2)」與「主題」兩種角度收錄單字,每 10 個字一個小關卡,搭配學習卡片與多種測驗題型(中譯西、西譯中、聽音辨義、拼寫、陰陽性判斷),
            幫助你循序漸進地記憶單字。
          </Section>

          <Section title="🔁 間隔重複複習">
            每個小關卡第一次學習並完成測驗後(視為「第 1 天」),App
            會在關卡地圖上用紅點與文字標記提醒你:第 2 天、第 3 天、第 7 天、第 14 天各回來複習一次(在到期日「當天或之後」重新測驗該關卡才算完成一次複習,提前重玩不會影響排程)。
            <br />
            <br />
            這個提醒只會顯示在 App 畫面裡(關卡會標示「🔔
            該複習了」),因為這是純前端的靜態網頁、沒有伺服器,無法在你關掉分頁後主動推播通知——請養成定期打開 App 看看有沒有關卡該複習的習慣。關卡沒有鎖定機制,任何時候都可以自由重玩、複習。
          </Section>

          <Section title="✏️ 測驗小技巧">
            答錯的字會在同一次測驗中稍後重新出現一次(最多重考 2
            次、總共最多考 3 次,答對就不會再出現),讓當次測驗多一點加強練習,不會計入或取代原本的題目。
            <br />
            <br />
            聽力題(聽音辨義)出現時會自動播放一次發音;如果不方便開音效,也可以在關卡開始前勾選「跳過聽力題」——這個設定只在當次測驗有效,不會被記住。
            <br />
            <br />
            有些關卡完成第 3 天複習後,關卡地圖上會直接多出一個「✨ N-los/las」的複數練習關卡,可以額外練習這批單字的複數形式(教學 + 測驗),這是獨立的加強練習,不影響主要的複習排程。
          </Section>

          <Section title="📕 錯題本與錯題關卡">
            當某個關卡「第 14 天」的複習測驗中答錯某些字,那些字會自動被收錄進「錯題本」,並出現在「錯題本」分頁裡,以每
            10 個字一組形成獨立的錯題複習關卡。
            <br />
            <br />
            錯題關卡本身也依照同樣的第 2 / 3 / 7 / 14 天規律提醒複習;如果一個錯題在它自己的第 14
            天複習時終於答對了,就會從錯題本「畢業」移除,不再出現;如果仍然答錯,則會重新從今天開始計算下一輪 2 / 3 / 7 /
            14 天循環,直到真正記熟為止。
          </Section>

          <Section title="🔥 打卡與點數">
            點擊地圖上方的「連續 N 天 · 點數」小卡片可以打開打卡日曆,每天手動打卡一次可以拿 {POINTS_CHECKIN}{" "}
            點;完成一次小關卡測驗(不含錯題複習跟複數形子關卡)也會拿 {POINTS_STAGE_COMPLETE} 點,每次都算、沒有每日上限。
            <br />
            當天只要完成過一次小關卡測驗,就會自動算作已打卡(連 {POINTS_CHECKIN} 點打卡點數一起自動拿到),不用再另外手動點一次「打卡」——手動打卡只是留給沒有完成關卡、但還是想標記今天有來的日子用。
            <br />
            <br />
            連續打卡天數(streak)只要中斷一天就會歸零重新算;如果一整週(週一到週日)七天都有打卡,當週會額外拿到{" "}
            {POINTS_FULL_WEEK_BONUS} 點全勤獎勵。
            <br />
            <br />
            點數用來解鎖章節:每個分級(A1/A2/B1/B2)的第一個大關(前100字)永遠免費,第二個大關開始,每個大關都要花{" "}
            {CHAPTER_UNLOCK_POINTS} 點手動解鎖——點選上鎖的大關標籤會跳出確認畫面,點數夠的話按一下就解鎖,不會不小心手滑花掉。「主題」分頁的內容不受點數限制,任何時候都能自由練習。
            <br />
            <br />
            地圖上方打卡卡片下面的「每日隨堂測驗」,每天可以挑戰一次,從已經學過的字裡隨機抽 {DAILY_QUIZ_WORD_COUNT}{" "}
            題(至少要學過 {DAILY_QUIZ_WORD_COUNT} 個字才會開放),完成可以拿 {POINTS_DAILY_QUIZ} 點,不影響任何關卡的複習排程。
          </Section>

          <Section title="📚 圖書館與代名詞變化練習">
            點頂部書本圖示可以打開「圖書館」,裡面是字母表、發音規則、人稱代名詞/所有格/反身代名詞/疑問詞的參考表,以及「代名詞變化練習」——選一個動詞,分三層練習現在式變化、所有格填空、疑問詞與間接受語填空。
            <br />
            <br />
            這個練習模組是獨立的教學小工具,不計分、不影響點數或複習排程,單純讓你多練習文法規則。
          </Section>

          <Section title="💾 資料儲存">
            所有學習進度、複習排程、錯題本,以及打卡紀錄跟點數,都只儲存在你目前使用的這個瀏覽器裡(localStorage),不會上傳到任何伺服器。
            <br />
            <br />
            換一台裝置、換一個瀏覽器,或清除瀏覽器資料/隱私瀏覽模式,都會讓紀錄消失,請留意;目前版本沒有雲端同步或備份機制。
          </Section>

          <Section title="🛠️ 版本資訊">
            目前版本:<strong>{APP_VERSION}</strong>
            <br />
            更新日期:{APP_UPDATED}
            <br />
            製作者:{APP_MAKER}
          </Section>

          <Section title="📝 更新紀錄">
            {(changelogOpen ? CHANGELOG : CHANGELOG.slice(0, 1)).map((c, i) => (
              <div key={i} style={{ marginBottom: "0.7rem" }}>
                <div style={{ fontWeight: 700, color: "#3A2E1F" }}>
                  {c.version} <span style={{ fontWeight: 400, color: "#A99B85" }}>· {c.date}</span>
                </div>
                <div>{c.notes}</div>
              </div>
            ))}
            <button
              onClick={() => setChangelogOpen((v) => !v)}
              style={{
                marginTop: "0.2rem",
                padding: "0.4rem 0.8rem",
                borderRadius: "0.6rem",
                border: "1px solid #D8CBA8",
                background: "transparent",
                color: "#8A7A5E",
                fontWeight: 600,
                fontSize: "0.75rem",
                cursor: "pointer",
              }}
            >
              {changelogOpen ? "收合" : `展開查看全部 ${CHANGELOG.length} 筆更新紀錄`}
            </button>
          </Section>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------
  // Screen: LIBRARY (v4.20.0 改動G:圖書館大單元——字母表/發音規則/人稱
  // 代名詞/所有格/反身代名詞/疑問詞參考,純靜態內容,不涉及 SRS/計分。
  // 獨立於 mode(level/theme/mistake)之外的第四個畫面,不吃 bank/stages。
  // ---------------------------------------------------------------------
  // Screen: LIBRARY (v4.20.0 改動G,v4.21.0 改版H:圖書館大單元——字母表/
  // 發音規則/人稱代名詞/所有格/反身代名詞/疑問詞參考,純靜態內容,不涉及
  // SRS/計分。獨立於 mode(level/theme/mistake)之外的第四個畫面,不吃
  // bank/stages。
  //
  // v4.21.0 改版:原本 6 個 Section 一次全部往下捲，改成「兩排 pill 分類
  // 列表 → 點了切換成獨立內容頁」，比照主題頁籤的瀏覽邏輯。LIBRARY_TOPICS
  // 是這次改版新增的設定陣列，把「分類要顯示什麼」跟「怎麼渲染」分開，
  // 之後要調整分類順序/新增分類，改這個陣列就好，不用動下面的渲染邏輯。
  // ---------------------------------------------------------------------
  if (screen === "library") {
    const Section = ({ title, children }) => (
      <div style={{ background: "#F9F1E6", borderRadius: "0.9rem", padding: "1.1rem 1.15rem", marginBottom: "0.9rem" }}>
        {title && (
          <div style={{ fontFamily: "'Fraunces', serif", fontWeight: 600, fontSize: "0.95rem", color: "#3A2E1F", marginBottom: "0.5rem" }}>
            {title}
          </div>
        )}
        <div style={{ fontSize: "0.8rem", color: "#5C4E3A", lineHeight: 1.75 }}>{children}</div>
      </div>
    );
    const ParadigmTable = ({ rows, cols }) => (
      <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
        {rows.map((r) => (
          <div
            key={r.key}
            style={{
              display: "flex",
              alignItems: "center",
              background: "#EFE6D0",
              borderRadius: "0.6rem",
              padding: "0.45rem 0.7rem",
              gap: "0.5rem",
            }}
          >
            <div style={{ flex: "1.4", fontSize: "0.75rem", color: "#3A2E1F" }}>{r.label}</div>
            {cols.map((c) => (
              <div
                key={c.key}
                style={{
                  flex: "1",
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontWeight: 700,
                  fontSize: "0.8rem",
                  color: "#B85C2E",
                  textAlign: "right",
                }}
              >
                {c.value(r)}
              </div>
            ))}
          </div>
        ))}
      </div>
    );

    // 分類設定：icon 用上面新增的線條圖示元件（取代 emoji），row 決定分成
    // 哪一排 pill（1 = 發音基礎，2 = 文法參考）。content 是一個 render
    // function，回傳該分類的內容（沿用原本各 Section 裡的內容，只是拆開）。
    const LIBRARY_TOPICS = [
      {
        key: "alphabet",
        label: "字母表",
        row: 1,
        Icon: IconAlphabet,
        content: () => (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.5rem" }}>
            {SPANISH_ALPHABET.map((l) => (
              <div key={l.letter} style={{ background: "#EFE6D0", borderRadius: "0.6rem", padding: "0.5rem 0.6rem" }}>
                <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontWeight: 700, fontSize: "0.9rem", color: "#3A2E1F" }}>
                  {l.letter} <span style={{ fontWeight: 400, color: "#8A7A5E", fontSize: "0.7rem" }}>{l.name}</span>
                </div>
                <div style={{ fontSize: "0.68rem", color: "#8A7A5E", marginTop: "0.15rem" }}>{l.tip}</div>
              </div>
            ))}
          </div>
        ),
      },
      {
        key: "pronunciation",
        label: "發音規則",
        row: 1,
        Icon: IconSoundwave,
        content: () =>
          PRONUNCIATION_RULES.map((r, i) => (
            <div key={i} style={{ marginBottom: i < PRONUNCIATION_RULES.length - 1 ? "0.85rem" : 0 }}>
              <div style={{ fontWeight: 700, color: "#3A2E1F" }}>{r.title}</div>
              <div>{r.body}</div>
              <div style={{ color: "#8A7A5E", fontSize: "0.72rem", marginTop: "0.15rem" }}>例:{r.examples.join("、")}</div>
            </div>
          )),
      },
      {
        // v4.21.0(改動I): 「子音規則」——逐字母(B~R)查閱用的完整參考表，跟
        // 上面「發音規則」是精簡重點版不同，這裡是查表用的，所以每個字母
        // 獨立一張小卡，不需要像 PRONUNCIATION_RULES 那樣配範例單字。
        key: "consonants",
        label: "子音規則",
        row: 1,
        Icon: IconConsonant,
        content: () => (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
            {CONSONANT_RULES.map((r) => (
              <div key={r.letter} style={{ background: "#EFE6D0", borderRadius: "0.6rem", padding: "0.6rem 0.75rem" }}>
                <div
                  style={{
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontWeight: 700,
                    fontSize: "0.85rem",
                    color: "#B85C2E",
                    marginBottom: "0.2rem",
                  }}
                >
                  {r.letter}
                </div>
                <div style={{ fontSize: "0.76rem", color: "#5C4E3A", lineHeight: 1.7 }}>{r.body}</div>
              </div>
            ))}
          </div>
        ),
      },
      {
        // v4.21.0(改動J): 「母音與雙三母音」——強弱母音組合、三母音、以及
        // Hiato 例外，沿用跟 PRONUNCIATION_RULES 一樣的 title/body/examples
        // 卡片渲染方式(examples 為空陣列時就不顯示「例:」那一行)。
        key: "vowels",
        label: "母音與雙三母音",
        row: 1,
        Icon: IconVowelPair,
        content: () =>
          DIPHTHONG_RULES.map((r, i) => (
            <div key={i} style={{ marginBottom: i < DIPHTHONG_RULES.length - 1 ? "0.85rem" : 0 }}>
              <div style={{ fontWeight: 700, color: "#3A2E1F" }}>{r.title}</div>
              <div>{r.body}</div>
              {r.examples.length > 0 && (
                <div style={{ color: "#8A7A5E", fontSize: "0.72rem", marginTop: "0.15rem" }}>例:{r.examples.join("、")}</div>
              )}
            </div>
          )),
      },
      {
        key: "syllables",
        label: "音節劃分",
        row: 1,
        Icon: IconSyllableSplit,
        content: () =>
          SYLLABLE_RULES.map((r, i) => (
            <div key={i} style={{ marginBottom: i < SYLLABLE_RULES.length - 1 ? "0.85rem" : 0 }}>
              <div style={{ fontWeight: 700, color: "#3A2E1F" }}>{r.title}</div>
              <div>{r.body}</div>
              {r.examples.length > 0 && (
                <div style={{ color: "#8A7A5E", fontSize: "0.72rem", marginTop: "0.15rem" }}>例:{r.examples.join("、")}</div>
              )}
            </div>
          )),
      },
      {
        key: "intonation",
        label: "語調與連音",
        row: 1,
        Icon: IconIntonationCurve,
        content: () =>
          INTONATION_RULES.map((r, i) => (
            <div key={i} style={{ marginBottom: i < INTONATION_RULES.length - 1 ? "0.85rem" : 0 }}>
              <div style={{ fontWeight: 700, color: "#3A2E1F" }}>{r.title}</div>
              <div>{r.body}</div>
              {r.examples.length > 0 && (
                <div style={{ color: "#8A7A5E", fontSize: "0.72rem", marginTop: "0.15rem" }}>例:{r.examples.join("、")}</div>
              )}
            </div>
          )),
      },
      {
        key: "pronouns",
        label: "人稱代名詞",
        row: 2,
        Icon: IconPeople,
        content: () => (
          <ParadigmTable
            rows={SUBJECT_PRONOUNS.map((p) => ({ key: p.key, label: p.es, zh: p.zh }))}
            cols={[{ key: "zh", value: (r) => r.zh }]}
          />
        ),
      },
      {
        key: "possessive",
        label: "所有格",
        row: 2,
        Icon: IconShield,
        content: () => (
          <React.Fragment>
            <ParadigmTable
              rows={POSSESSIVE_ADJECTIVES.map((p) => ({ key: p.key, label: p.pronoun, note: p.note }))}
              cols={[{ key: "note", value: (r) => r.note }]}
            />
            <div style={{ color: "#8A7A5E", fontSize: "0.72rem", marginTop: "0.5rem" }}>
              只列基本形式;完整陰陽性/單複數變化(如 nuestro/nuestra/nuestros/nuestras)之後有需要再擴充。
            </div>
          </React.Fragment>
        ),
      },
      {
        key: "reflexive",
        label: "反身代名詞",
        row: 2,
        Icon: IconReflexive,
        content: () => (
          <React.Fragment>
            <ParadigmTable
              rows={REFLEXIVE_PRONOUNS.map((p) => ({ key: p.key, label: p.pronoun, reflexive: p.reflexive }))}
              cols={[{ key: "reflexive", value: (r) => r.reflexive }]}
            />
            <div style={{ color: "#8A7A5E", fontSize: "0.72rem", marginTop: "0.5rem" }}>
              常見反身動詞範例:llamarse(名叫)→ me llamo, te llamas, se llama...
            </div>
          </React.Fragment>
        ),
      },
      {
        key: "questions",
        label: "疑問詞",
        row: 2,
        Icon: IconInvertedQuestion,
        content: () => (
          <ParadigmTable
            rows={QUESTION_WORDS.map((q, i) => ({ key: i, label: q.es, zh: q.zh }))}
            cols={[{ key: "zh", value: (r) => r.zh }]}
          />
        ),
      },
    ];

    // -----------------------------------------------------------------
    // 有選分類 → 切換成該分類的獨立內容頁（返回鍵回到分類列表，不是回主畫面）
    // -----------------------------------------------------------------
    if (libraryTopic) {
      const topic = LIBRARY_TOPICS.find((t) => t.key === libraryTopic);
      if (topic) {
        return (
          <div style={{ minHeight: "100vh", background: "#FDF6EC", fontFamily: "'Inter', sans-serif", paddingBottom: "3rem" }}>
            <TopBar title={topic.label} onBack={() => setLibraryTopic(null)} />
            <div style={{ padding: "0 1.25rem" }}>
              <Section>{topic.content()}</Section>
            </div>
          </div>
        );
      }
    }

    // -----------------------------------------------------------------
    // 沒選分類 → 顯示兩排 pill 分類列表（比照主題頁籤大小/樣式）
    // -----------------------------------------------------------------
    const PillRow = ({ rowNum, rowLabel }) => (
      <React.Fragment>
        <div style={{ fontSize: "0.72rem", color: "#B5674F", fontWeight: 700, margin: "0 0 0.5rem" }}>{rowLabel}</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "1.2rem" }}>
          {LIBRARY_TOPICS.filter((t) => t.row === rowNum).map((t) => (
            <button
              key={t.key}
              onClick={() => setLibraryTopic(t.key)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.4rem",
                padding: "0.55rem 0.9rem",
                borderRadius: "9999px",
                background: "#F9F1E6",
                border: "1.5px solid #E07A5F",
                color: "#B5674F",
                fontWeight: 600,
                fontSize: "0.82rem",
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >
              <t.Icon size={16} color="#E07A5F" stroke="#E07A5F" />
              {t.label}
            </button>
          ))}
        </div>
      </React.Fragment>
    );

    return (
      <div style={{ minHeight: "100vh", background: "#FDF6EC", fontFamily: "'Inter', sans-serif", paddingBottom: "3rem" }}>
        <TopBar title="圖書館" onBack={backToMap} />
        <div style={{ padding: "0 1.25rem" }}>
          <PillRow rowNum={1} rowLabel="發音基礎" />
          <PillRow rowNum={2} rowLabel="文法參考" />

          <Section title="✍️ 代名詞變化練習">
            分三層,由淺入深:①選一個動詞,測驗六個人稱的現在式變化。②動詞變化
            +所有格,填空表格。③再加上疑問詞跟間接受語代名詞,更完整的填空表格。
            <button
              onClick={() => {
                setLabStep("pick");
                setLabVerb(null);
                setLabT1(null);
                setLabTableAnswers({});
                setLabTableChecked(false);
                setLabQwAnswers({});
                setLabQwChecked(false);
                setScreen("pronounLab");
              }}
              style={{
                display: "block",
                marginTop: "0.7rem",
                width: "100%",
                padding: "0.7rem",
                borderRadius: "0.7rem",
                border: "none",
                background: "#E07A5F",
                color: "#FDF6EC",
                fontWeight: 700,
                fontSize: "0.85rem",
                cursor: "pointer",
              }}
            >
              開始練習
            </button>
          </Section>
        </div>
      </div>
    );
  }


  // ---------------------------------------------------------------------
  // Screen: PRONOUN LAB (v4.20.0 改動H2:三層代名詞變化練習模組)
  //
  // 刻意完全獨立於 quizState/activeStage/SRS/points 之外——見上面 labStep 等
  // state 宣告處的說明。壞了只會壞這個畫面,不影響主要單字測驗引擎;也不
  // 寫入 localStorage(練習結果不需要跨裝置/跨次保存)。
  // ---------------------------------------------------------------------
  if (screen === "pronounLab") {
    const backToLabPick = () => {
      setLabStep("pick");
      setLabVerb(null);
      setLabT1(null);
    };

    const startTier1 = (verb) => {
      const questions = SUBJECT_PRONOUNS.map((p) => {
        const correct = verb.forms[p.key];
        const pool = shuffle(
          Array.from(
            new Set(
              CONJUGATION_VERBS.filter((v) => v.es !== verb.es).map((v) => v.forms[p.key])
            )
          ).filter((f) => f !== correct)
        );
        const options = shuffle([correct, ...pool.slice(0, 3)]);
        return { pronounKey: p.key, pronoun: p.es, correct, options };
      });
      setLabVerb(verb);
      setLabT1({ questions, qIndex: 0, correct: 0, selectedIndex: null, showFeedback: false });
      setLabStep("tier1");
    };
    const startTier2 = (verb) => {
      setLabVerb(verb);
      setLabTableAnswers({});
      setLabTableChecked(false);
      setLabStep("tier2");
    };
    const startTier3 = (verb) => {
      setLabVerb(verb);
      setLabTableAnswers({});
      setLabTableChecked(false);
      setLabQwAnswers({});
      setLabQwChecked(false);
      setLabStep("tier3");
    };
    const pickVerb = (verb) => {
      if (labTier === 1) startTier1(verb);
      else if (labTier === 2) startTier2(verb);
      else startTier3(verb);
    };

    // -----------------------------------------------------------------
    // labStep: pick — choose tier + verb
    // -----------------------------------------------------------------
    if (labStep === "pick") {
      return (
        <div style={{ minHeight: "100vh", background: "#FDF6EC", fontFamily: "'Inter', sans-serif", paddingBottom: "3rem" }}>
          <TopBar title="代名詞變化練習" onBack={() => setScreen("library")} />
          <div style={{ padding: "0 1.25rem" }}>
            <p style={{ fontSize: "0.8rem", color: "#8A7A5E", marginBottom: "0.8rem" }}>
              先選一層,再選一個動詞開始練習。
            </p>
            <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.1rem" }}>
              {[
                { n: 1, label: "① 動詞變化" },
                { n: 2, label: "② +所有格" },
                { n: 3, label: "③ +疑問詞/受語" },
              ].map((t) => {
                const active = labTier === t.n;
                return (
                  <button
                    key={t.n}
                    onClick={() => setLabTier(t.n)}
                    style={{
                      flex: 1,
                      padding: "0.55rem 0.3rem",
                      borderRadius: "0.7rem",
                      border: active ? "none" : "1px solid #ECDFCA",
                      background: active ? "#E07A5F" : "transparent",
                      color: active ? "#FDF6EC" : "#A99B85",
                      fontWeight: 600,
                      fontSize: "0.72rem",
                      cursor: "pointer",
                    }}
                  >
                    {t.label}
                  </button>
                );
              })}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "0.6rem" }}>
              {CONJUGATION_VERBS.map((v) => (
                <button
                  key={v.es}
                  onClick={() => pickVerb(v)}
                  style={{
                    textAlign: "left",
                    padding: "0.7rem 0.8rem",
                    borderRadius: "0.7rem",
                    border: "1px solid #ECDFCA",
                    background: "#F9F1E6",
                    cursor: "pointer",
                  }}
                >
                  <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontWeight: 700, fontSize: "0.9rem", color: "#3A2E1F" }}>
                    {v.es}
                  </div>
                  <div style={{ fontSize: "0.68rem", color: "#8A7A5E", marginTop: "0.1rem" }}>
                    {v.zh} · {v.type}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      );
    }

    // -----------------------------------------------------------------
    // labStep: tier1 — pick-prototype quiz (6 questions, one per pronoun)
    // -----------------------------------------------------------------
    if (labStep === "tier1" && labT1 && labVerb) {
      const q = labT1.questions[labT1.qIndex];
      const isLast = labT1.qIndex + 1 >= labT1.questions.length;
      const choose = (opt) => {
        if (labT1.showFeedback) return;
        const isCorrect = opt === q.correct;
        setLabT1((prev) => ({
          ...prev,
          selectedIndex: opt,
          showFeedback: true,
          correct: prev.correct + (isCorrect ? 1 : 0),
        }));
      };
      const next = () => {
        if (isLast) {
          setLabStep("tier1result");
          return;
        }
        setLabT1((prev) => ({ ...prev, qIndex: prev.qIndex + 1, selectedIndex: null, showFeedback: false }));
      };
      return (
        <div style={{ minHeight: "100vh", background: "#FDF6EC", fontFamily: "'Inter', sans-serif", paddingBottom: "6rem" }}>
          <TopBar title={`${labVerb.es} · 變化練習`} onBack={backToLabPick} />
          <div style={{ padding: "0 1.25rem" }}>
            <div style={{ fontSize: "0.75rem", color: "#A99B85", marginBottom: "0.6rem" }}>
              第 {labT1.qIndex + 1} / {labT1.questions.length} 題
            </div>
            <div
              style={{
                fontFamily: "'Fraunces', serif",
                fontWeight: 600,
                fontSize: "1.3rem",
                color: "#3A2E1F",
                marginBottom: "1.1rem",
              }}
            >
              {q.pronoun}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.55rem" }}>
              {q.options.map((opt, i) => (
                <OptionButton
                  key={i}
                  onClick={() => choose(opt)}
                  showState={labT1.showFeedback}
                  isCorrect={opt === q.correct}
                  isSelected={opt === labT1.selectedIndex}
                >
                  {opt}
                </OptionButton>
              ))}
            </div>
            {labT1.showFeedback && (
              <button
                onClick={next}
                style={{
                  marginTop: "1.2rem",
                  width: "100%",
                  padding: "0.75rem",
                  borderRadius: "0.7rem",
                  border: "none",
                  background: "#3A2E1F",
                  color: "#F5EFE0",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                {isLast ? "查看結果" : "下一題"}
              </button>
            )}
          </div>
        </div>
      );
    }

    // -----------------------------------------------------------------
    // labStep: tier1result
    // -----------------------------------------------------------------
    if (labStep === "tier1result" && labT1 && labVerb) {
      return (
        <div
          style={{
            minHeight: "100vh",
            background: "#FDF6EC",
            fontFamily: "'Inter', sans-serif",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "2rem",
          }}
        >
          <div style={{ background: "#F9F1E6", borderRadius: "1.2rem", padding: "2.2rem 1.6rem", width: "100%", maxWidth: "22rem", textAlign: "center" }}>
            <div style={{ fontFamily: "'Fraunces', serif", fontWeight: 600, fontSize: "1.3rem", color: "#3A2E1F" }}>
              {labVerb.es} 練習結果
            </div>
            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontWeight: 700, fontSize: "1.6rem", color: "#B85C2E", marginTop: "1rem" }}>
              {labT1.correct} / {labT1.questions.length}
            </div>
            <button
              onClick={() => startTier1(labVerb)}
              style={{ marginTop: "1.6rem", width: "100%", padding: "0.8rem", borderRadius: "0.75rem", border: "none", background: "#3A2E1F", color: "#F5EFE0", fontWeight: 700, cursor: "pointer" }}
            >
              重新測驗
            </button>
            <button
              onClick={backToLabPick}
              style={{ marginTop: "0.6rem", width: "100%", padding: "0.8rem", borderRadius: "0.75rem", border: "1px solid #D8CBA8", background: "transparent", color: "#8A7A5E", fontWeight: 600, cursor: "pointer" }}
            >
              換一個動詞 / 換一層
            </button>
          </div>
        </div>
      );
    }

    // -----------------------------------------------------------------
    // labStep: tier2 / tier3 — fill-in-the-blank tables
    // -----------------------------------------------------------------
    if ((labStep === "tier2" || labStep === "tier3") && labVerb) {
      const cellKey = (rowKey, col) => `${rowKey}:${col}`;
      const setCell = (rowKey, col, value) =>
        setLabTableAnswers((prev) => ({ ...prev, [cellKey(rowKey, col)]: value }));
      const cellValue = (rowKey, col) => labTableAnswers[cellKey(rowKey, col)] || "";
      const cellOk = (rowKey, col, target) => checkSpellingAnswer(cellValue(rowKey, col), target);

      const columns = [
        { key: "verb", label: "動詞變化", target: (rowKey) => labVerb.forms[rowKey] },
        { key: "poss", label: "所有格", target: (rowKey) => POSSESSIVE_ADJECTIVES.find((p) => p.key === rowKey).base },
      ];
      if (labStep === "tier3") {
        columns.push({ key: "io", label: "間接受語", target: (rowKey) => INDIRECT_OBJECT_PRONOUNS.find((p) => p.key === rowKey).io });
      }

      const tableTotal = SUBJECT_PRONOUNS.length * columns.length;
      const tableCorrectCount = labTableChecked
        ? SUBJECT_PRONOUNS.reduce(
            (sum, p) => sum + columns.reduce((s2, c) => s2 + (cellOk(p.key, c.key, c.target(p.key)) ? 1 : 0), 0),
            0
          )
        : 0;

      const qwTotal = QUESTION_WORD_PRACTICE.length;
      const qwCorrectCount = labQwChecked
        ? QUESTION_WORD_PRACTICE.reduce((sum, item, i) => sum + (checkSpellingAnswer(labQwAnswers[i] || "", item.answer) ? 1 : 0), 0)
        : 0;

      return (
        <div style={{ minHeight: "100vh", background: "#FDF6EC", fontFamily: "'Inter', sans-serif", paddingBottom: "6rem" }}>
          <TopBar
            title={`${labVerb.es} · ${labStep === "tier2" ? "所有格填空" : "所有格+疑問詞+間接受語"}`}
            onBack={backToLabPick}
          />
          <div style={{ padding: "0 1.25rem" }}>
            <div style={{ overflowX: "auto" }}>
              <div style={{ minWidth: labStep === "tier3" ? "26rem" : "20rem" }}>
                <div style={{ display: "flex", gap: "0.4rem", padding: "0 0.7rem 0.4rem", fontSize: "0.68rem", color: "#8A7A5E", fontWeight: 600 }}>
                  <div style={{ flex: "1.4" }}>人稱</div>
                  {columns.map((c) => (
                    <div key={c.key} style={{ flex: 1, textAlign: "center" }}>
                      {c.label}
                    </div>
                  ))}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                  {SUBJECT_PRONOUNS.map((p) => (
                    <div
                      key={p.key}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.4rem",
                        background: "#F9F1E6",
                        borderRadius: "0.6rem",
                        padding: "0.4rem 0.7rem",
                      }}
                    >
                      <div style={{ flex: "1.4", fontSize: "0.73rem", color: "#3A2E1F" }}>{p.es}</div>
                      {columns.map((c) => {
                        const target = c.target(p.key);
                        const ok = labTableChecked && cellOk(p.key, c.key, target);
                        const bad = labTableChecked && !cellOk(p.key, c.key, target);
                        return (
                          <div key={c.key} style={{ flex: 1 }}>
                            <input
                              value={cellValue(p.key, c.key)}
                              disabled={labTableChecked}
                              onChange={(e) => setCell(p.key, c.key, e.target.value)}
                              placeholder="?"
                              style={{
                                width: "100%",
                                boxSizing: "border-box",
                                padding: "0.35rem 0.4rem",
                                borderRadius: "0.4rem",
                                border: `1.5px solid ${ok ? "#5FA777" : bad ? "#C0392B" : "#ECDFCA"}`,
                                background: ok ? "#E3F0E6" : bad ? "#F5D9D4" : "#FDF6EC",
                                fontSize: "0.75rem",
                                textAlign: "center",
                              }}
                            />
                            {bad && (
                              <div style={{ fontSize: "0.62rem", color: "#C0392B", textAlign: "center", marginTop: "0.1rem" }}>
                                {target}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {labTableChecked ? (
              <div style={{ marginTop: "0.9rem", fontWeight: 700, color: "#B85C2E", fontSize: "0.85rem" }}>
                填空表格:{tableCorrectCount} / {tableTotal} 格正確
              </div>
            ) : (
              <button
                onClick={() => setLabTableChecked(true)}
                style={{ marginTop: "1rem", width: "100%", padding: "0.7rem", borderRadius: "0.7rem", border: "none", background: "#E07A5F", color: "#FDF6EC", fontWeight: 700, fontSize: "0.85rem", cursor: "pointer" }}
              >
                檢查答案
              </button>
            )}

            {labStep === "tier3" && (
              <div style={{ marginTop: "1.4rem" }}>
                <div style={{ fontFamily: "'Fraunces', serif", fontWeight: 600, fontSize: "0.95rem", color: "#3A2E1F", marginBottom: "0.6rem" }}>
                  ❓ 疑問詞練習
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  {QUESTION_WORD_PRACTICE.map((item, i) => {
                    const ok = labQwChecked && checkSpellingAnswer(labQwAnswers[i] || "", item.answer);
                    const bad = labQwChecked && !ok;
                    return (
                      <div key={i} style={{ background: "#F9F1E6", borderRadius: "0.6rem", padding: "0.5rem 0.7rem" }}>
                        <div style={{ fontSize: "0.75rem", color: "#3A2E1F", marginBottom: "0.3rem" }}>{item.zh}</div>
                        <input
                          value={labQwAnswers[i] || ""}
                          disabled={labQwChecked}
                          onChange={(e) => setLabQwAnswers((prev) => ({ ...prev, [i]: e.target.value }))}
                          placeholder="輸入疑問詞"
                          style={{
                            width: "100%",
                            boxSizing: "border-box",
                            padding: "0.4rem 0.5rem",
                            borderRadius: "0.4rem",
                            border: `1.5px solid ${ok ? "#5FA777" : bad ? "#C0392B" : "#ECDFCA"}`,
                            background: ok ? "#E3F0E6" : bad ? "#F5D9D4" : "#FDF6EC",
                            fontSize: "0.78rem",
                          }}
                        />
                        {bad && <div style={{ fontSize: "0.65rem", color: "#C0392B", marginTop: "0.2rem" }}>正確答案:{item.answer}</div>}
                      </div>
                    );
                  })}
                </div>
                {labQwChecked ? (
                  <div style={{ marginTop: "0.7rem", fontWeight: 700, color: "#B85C2E", fontSize: "0.85rem" }}>
                    疑問詞:{qwCorrectCount} / {qwTotal} 題正確
                  </div>
                ) : (
                  <button
                    onClick={() => setLabQwChecked(true)}
                    style={{ marginTop: "0.8rem", width: "100%", padding: "0.7rem", borderRadius: "0.7rem", border: "none", background: "#E07A5F", color: "#FDF6EC", fontWeight: 700, fontSize: "0.85rem", cursor: "pointer" }}
                  >
                    檢查疑問詞答案
                  </button>
                )}
              </div>
            )}

            <button
              onClick={() => (labStep === "tier2" ? startTier2(labVerb) : startTier3(labVerb))}
              style={{ marginTop: "1.2rem", width: "100%", padding: "0.75rem", borderRadius: "0.7rem", border: "1px solid #D8CBA8", background: "transparent", color: "#8A7A5E", fontWeight: 600, cursor: "pointer" }}
            >
              清空重填
            </button>
            <button
              onClick={backToLabPick}
              style={{ marginTop: "0.6rem", width: "100%", padding: "0.75rem", borderRadius: "0.7rem", border: "1px solid #D8CBA8", background: "transparent", color: "#8A7A5E", fontWeight: 600, cursor: "pointer" }}
            >
              換一個動詞 / 換一層
            </button>
          </div>
        </div>
      );
    }

    return null;
  }

  return null;
}

function OptionButton({ children, onClick, showState, isCorrect, isSelected }) {
  let bg = "#F9F1E6";
  let border = "#ECDFCA";
  let color = "#3A2E1F";
  if (showState) {
    if (isCorrect) {
      bg = "#7D9471";
      border = "#5B7F5A";
      color = "#FDF6EC";
    } else if (isSelected) {
      bg = "#C0392B";
      border = "#96291D";
      color = "#FDF6EC";
    }
  }
  return (
    <button
      onClick={onClick}
      style={{
        textAlign: "left",
        padding: "0.85rem 1rem",
        borderRadius: "0.75rem",
        border: `1.5px solid ${border}`,
        background: bg,
        color,
        fontSize: "0.95rem",
        fontWeight: 500,
        cursor: "pointer",
      }}
    >
      {children}
    </button>
  );
}

const rootEl = document.getElementById("root");
ReactDOM.createRoot(rootEl).render(React.createElement(SpanishVocab));

