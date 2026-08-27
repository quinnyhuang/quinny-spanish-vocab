// ===========================================================================
// grammar_bank.js — 「圖書館」大單元的參考內容 + 代名詞變化練習模組的題庫
// v4.20.0(改動G+H)新增。刻意獨立成自己的檔案(跟 word_bank.js/theme_bank.js
// 同一種模式):純資料、沒有邏輯,之後要調整文法說明文字、增減動詞,不需要碰
// app.js,也不需要重新 esbuild。
//
// 這份資料同時餵給兩個功能:
//   1. 圖書館畫面裡的靜態參考表(字母表/發音規則/代名詞/所有格/反身代名詞)
//   2. 「代名詞變化練習」三層練習模組的題目來源(CONJUGATION_VERBS 等)
// 兩邊共用同一份 paradigm 資料,是刻意的設計——避免同樣的「yo/tú/él...」
// 這組資料在兩個地方各存一份,以後改動需要兩邊同步、容易漏改。
// ===========================================================================

const SPANISH_ALPHABET = [
  { letter: "A", name: "a", tip: "類似注音「Y」" },
  { letter: "B", name: "be", tip: "類似中文「backslash 波」，比英文 b 輕" },
  { letter: "C", name: "ce", tip: "接 e/i 唸「思」，接 a/o/u 唸「克」" },
  { letter: "D", name: "de", tip: "類似「德」" },
  { letter: "E", name: "e", tip: "類似注音「ㄝ」" },
  { letter: "F", name: "efe", tip: "跟英文 f 一樣" },
  { letter: "G", name: "ge", tip: "接 e/i 唸喉音「喝」，接 a/o/u 唸「哥」" },
  { letter: "H", name: "hache", tip: "永遠不發音" },
  { letter: "I", name: "i", tip: "類似注音「一」" },
  { letter: "J", name: "jota", tip: "永遠唸喉音「喝」" },
  { letter: "K", name: "ka", tip: "跟英文 k 一樣(外來字才用)" },
  { letter: "L", name: "ele", tip: "跟英文 l 一樣" },
  { letter: "M", name: "eme", tip: "跟英文 m 一樣" },
  { letter: "N", name: "ene", tip: "跟英文 n 一樣" },
  { letter: "Ñ", name: "eñe", tip: "鼻音，類似「妞」" },
  { letter: "O", name: "o", tip: "類似注音「ㄛ」" },
  { letter: "P", name: "pe", tip: "類似「波」，比英文 p 輕" },
  { letter: "Q", name: "cu", tip: "只跟 ue/ui 連用，u 不發音，唸「克」" },
  { letter: "R", name: "erre", tip: "字中單一r輕彈舌，字首或rr要打舌顫音" },
  { letter: "S", name: "ese", tip: "跟英文 s 一樣" },
  { letter: "T", name: "te", tip: "類似「特」，比英文 t 輕" },
  { letter: "U", name: "u", tip: "類似注音「ㄨ」" },
  { letter: "V", name: "uve", tip: "多數地區唸法跟 B 很接近" },
  { letter: "W", name: "uve doble", tip: "外來字才用" },
  { letter: "X", name: "equis", tip: "跟英文 x 一樣" },
  { letter: "Y", name: "ye / i griega", tip: "單獨當「和」用時唸類似「衣」" },
  { letter: "Z", name: "zeta", tip: "西班牙本土唸 th，拉美唸「思」" },
];

const PRONUNCIATION_RULES = [
  {
    title: "母音只有一個唸法",
    body: "a / e / i / o / u 每個母音永遠固定唸同一個音，不會像英文一樣隨單字改變，是西文相對好上手的地方。",
    examples: ["casa", "mesa", "libro"],
  },
  {
    title: "h 永遠不發音",
    body: "看到 h 直接跳過就好，完全不發音。",
    examples: ["hola", "hermano", "hasta"],
  },
  {
    title: "ll 的發音",
    body: "唸法接近中文「壓/呀」，不同地區口音會有差異，但都不是英文的 L 音。",
    examples: ["llamar", "llover", "pollo"],
  },
  {
    title: "ñ 是獨立的一個字母",
    body: "上面的波浪符號不能省略，唸鼻音，類似「妞」，跟 n 是完全不同的音。",
    examples: ["niño", "español", "mañana"],
  },
  {
    title: "c 的兩種唸法",
    body: "後面接 e 或 i 時唸類似「思」；接 a、o、u 時唸「克」。",
    examples: ["cielo(思)", "cinco(思)", "casa(克)"],
  },
  {
    title: "g 的兩種唸法",
    body: "後面接 e 或 i 時唸喉音「喝」；接 a、o、u 時唸「哥」。",
    examples: ["general(喝)", "gimnasio(喝)", "gato(哥)"],
  },
  {
    title: "j 永遠是喉音",
    body: "不管接什麼母音都唸喉音「喝」，比英文的 h 更用力。",
    examples: ["jugar", "trabajo", "jamón"],
  },
  {
    title: "qu 的 u 不發音",
    body: "qu 只跟 e、i 連用，整組唸「克」，u 是啞音。",
    examples: ["qué", "quién", "aquí"],
  },
  {
    title: "r 的單顫音 vs 雙顫音",
    body: "字中間單一個 r 是輕輕彈舌一次；字首的 r，或連續兩個 rr，要打舌顫音（連續彈舌）。",
    examples: ["pero(輕彈)", "perro(顫音)", "rojo(顫音)"],
  },
  {
    title: "重音規則",
    body: "以母音、n 或 s 結尾的字，重音在倒數第二音節；以其他子音結尾的字，重音在最後一個音節；只要單字上面有標重音符號(´)，一律以標示的位置為準，例外優先。",
    examples: ["casa(倒數第二)", "hotel(最後)", "café(依標示)"],
  },
];

// 人稱代名詞——與 SINGLE_STAGE_THEMES 的 "pronombres" 主題單字不同，這裡是文法
// 角色的參考表(主格/所有格/反身/間接受語一次對照)，不是單字卡。
const SUBJECT_PRONOUNS = [
  { key: "yo", es: "yo", zh: "我" },
  { key: "tu", es: "tú", zh: "你 / 妳" },
  { key: "el", es: "él / ella / usted", zh: "他 / 她 / 您" },
  { key: "nosotros", es: "nosotros / nosotras", zh: "我們" },
  { key: "vosotros", es: "vosotros / vosotras", zh: "你們（西班牙用法，拉美多半改用 ustedes）" },
  { key: "ellos", es: "ellos / ellas / ustedes", zh: "他們 / 她們 / 您們" },
];

// 所有格(前位、非重讀短形式)——每個人稱只列基本(陽性單數)形式，方便對照與
// 練習；完整陰陽性/單複數變化(nuestro/nuestra/nuestros/nuestras...)先不在
// 這個參考表跟練習題庫裡展開，避免一次塞太多組合，之後有需要可以再擴充。
const POSSESSIVE_ADJECTIVES = [
  { key: "yo", pronoun: "yo", base: "mi", note: "mi / mis" },
  { key: "tu", pronoun: "tú", base: "tu", note: "tu / tus" },
  { key: "el", pronoun: "él/ella/usted", base: "su", note: "su / sus" },
  { key: "nosotros", pronoun: "nosotros", base: "nuestro", note: "nuestro/a/os/as" },
  { key: "vosotros", pronoun: "vosotros", base: "vuestro", note: "vuestro/a/os/as" },
  { key: "ellos", pronoun: "ellos/ellas/ustedes", base: "su", note: "su / sus" },
];

const REFLEXIVE_PRONOUNS = [
  { key: "yo", pronoun: "yo", reflexive: "me" },
  { key: "tu", pronoun: "tú", reflexive: "te" },
  { key: "el", pronoun: "él/ella/usted", reflexive: "se" },
  { key: "nosotros", pronoun: "nosotros", reflexive: "nos" },
  { key: "vosotros", pronoun: "vosotros", reflexive: "os" },
  { key: "ellos", pronoun: "ellos/ellas/ustedes", reflexive: "se" },
];

const INDIRECT_OBJECT_PRONOUNS = [
  { key: "yo", pronoun: "yo", io: "me" },
  { key: "tu", pronoun: "tú", io: "te" },
  { key: "el", pronoun: "él/ella/usted", io: "le" },
  { key: "nosotros", pronoun: "nosotros", io: "nos" },
  { key: "vosotros", pronoun: "vosotros", io: "os" },
  { key: "ellos", pronoun: "ellos/ellas/ustedes", io: "les" },
];

const QUESTION_WORDS = [
  { es: "qué", zh: "什麼" },
  { es: "quién / quiénes", zh: "誰" },
  { es: "dónde", zh: "哪裡" },
  { es: "cuándo", zh: "何時" },
  { es: "cómo", zh: "如何" },
  { es: "cuál / cuáles", zh: "哪一個" },
  { es: "cuánto/a/os/as", zh: "多少" },
  { es: "por qué", zh: "為什麼" },
];

// 疑問詞情境練習(H2 第三層用)：中文情境句 + 正確疑問詞(對應 QUESTION_WORDS
// 的 es 值,判分時取空白前唯一單字比對,例如 "por qué" 直接整串比對)。
const QUESTION_WORD_PRACTICE = [
  { zh: "___你叫什麼名字？", answer: "qué" },
  { zh: "___是那個戴眼鏡的人？（問身分）", answer: "quién" },
  { zh: "你家在___？", answer: "dónde" },
  { zh: "___要出發？（問時間）", answer: "cuándo" },
  { zh: "你___稱呼你的老師？（問方式）", answer: "cómo" },
  { zh: "這兩件裡你要___一件？", answer: "cuál" },
  { zh: "這個___錢？", answer: "cuánto" },
  { zh: "你___要學西班牙文？（問原因）", answer: "por qué" },
];

// H2 練習模組用的動詞資料庫——現在式(presente de indicativo)。刻意只收錄
// 現在式，不含過去式/未來式等其他時態，把第一版練習模組的範圍收在「主詞代
// 名詞 + 現在式變化」這個最基礎、最常用的組合上。常規 -ar/-er/-ir 各挑一個
// 當範例，其餘是最高頻的不規則動詞，加一個反身動詞(llamarse)搭配反身代名詞
// 一起練。forms 的 key 對應 SUBJECT_PRONOUNS 的 key。
const CONJUGATION_VERBS = [
  {
    es: "hablar", zh: "說、講", type: "規則 -ar 動詞",
    forms: { yo: "hablo", tu: "hablas", el: "habla", nosotros: "hablamos", vosotros: "habláis", ellos: "hablan" },
  },
  {
    es: "comer", zh: "吃", type: "規則 -er 動詞",
    forms: { yo: "como", tu: "comes", el: "come", nosotros: "comemos", vosotros: "coméis", ellos: "comen" },
  },
  {
    es: "vivir", zh: "住、生活", type: "規則 -ir 動詞",
    forms: { yo: "vivo", tu: "vives", el: "vive", nosotros: "vivimos", vosotros: "vivís", ellos: "viven" },
  },
  {
    es: "ser", zh: "是（本質、身分）", type: "不規則動詞",
    forms: { yo: "soy", tu: "eres", el: "es", nosotros: "somos", vosotros: "sois", ellos: "son" },
  },
  {
    es: "estar", zh: "是（狀態、位置）", type: "不規則動詞",
    forms: { yo: "estoy", tu: "estás", el: "está", nosotros: "estamos", vosotros: "estáis", ellos: "están" },
  },
  {
    es: "tener", zh: "擁有", type: "不規則動詞",
    forms: { yo: "tengo", tu: "tienes", el: "tiene", nosotros: "tenemos", vosotros: "tenéis", ellos: "tienen" },
  },
  {
    es: "ir", zh: "去", type: "不規則動詞",
    forms: { yo: "voy", tu: "vas", el: "va", nosotros: "vamos", vosotros: "vais", ellos: "van" },
  },
  {
    es: "hacer", zh: "做、製作", type: "不規則動詞",
    forms: { yo: "hago", tu: "haces", el: "hace", nosotros: "hacemos", vosotros: "hacéis", ellos: "hacen" },
  },
  {
    es: "poder", zh: "能夠", type: "不規則動詞",
    forms: { yo: "puedo", tu: "puedes", el: "puede", nosotros: "podemos", vosotros: "podéis", ellos: "pueden" },
  },
  {
    es: "querer", zh: "想要", type: "不規則動詞",
    forms: { yo: "quiero", tu: "quieres", el: "quiere", nosotros: "queremos", vosotros: "queréis", ellos: "quieren" },
  },
  {
    es: "decir", zh: "說（陳述）", type: "不規則動詞",
    forms: { yo: "digo", tu: "dices", el: "dice", nosotros: "decimos", vosotros: "decís", ellos: "dicen" },
  },
  {
    es: "llamarse", zh: "名叫（反身動詞）", type: "反身動詞",
    forms: { yo: "me llamo", tu: "te llamas", el: "se llama", nosotros: "nos llamamos", vosotros: "os llamáis", ellos: "se llaman" },
  },
];
