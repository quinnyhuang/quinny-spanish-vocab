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
  { letter: "C", name: "ce", tip: "西班牙本土咬舌唸「th」，拉美/南部唸「思」；接 a/o/u 唸「克」" },
  // v4.21.0(改動I): 補上原本漏掉的 CH、LL——這兩個是西文傳統字母表裡
  // 「字母(大寫)」欄位就有的獨立字母(西文共 29 個字母)，原本的
  // SPANISH_ALPHABET 只有 27 筆、跳過了這兩個。
  { letter: "CH", name: "che", tip: "類似注音「ㄑ」的半氣半音" },
  { letter: "D", name: "de", tip: "類似「德」；字尾時發輕音甚至不發音" },
  { letter: "E", name: "e", tip: "類似注音「ㄝ」" },
  { letter: "F", name: "efe", tip: "跟英文 f 一樣" },
  { letter: "G", name: "ge", tip: "接 e/i 唸喉音「喝」，接 a/o/u 唸「哥」" },
  { letter: "H", name: "hache", tip: "永遠不發音" },
  { letter: "I", name: "i", tip: "類似注音「一」" },
  { letter: "J", name: "jota", tip: "永遠唸喉音「喝」，舌根出力、有振動感" },
  { letter: "K", name: "ka", tip: "跟英文 k 一樣(外來字才用)" },
  { letter: "L", name: "ele", tip: "跟英文 l 一樣" },
  { letter: "LL", name: "elle", tip: "多數地區發音同 y，類似「耶」(受 Yeísmo 現象影響)" },
  { letter: "M", name: "eme", tip: "跟英文 m 一樣" },
  { letter: "N", name: "ene", tip: "跟英文 n 一樣" },
  { letter: "Ñ", name: "eñe", tip: "鼻音，類似「妞」，比 N 鼻音重" },
  { letter: "O", name: "o", tip: "類似注音「ㄛ」" },
  { letter: "P", name: "pe", tip: "類似「波」，比英文 p 輕" },
  { letter: "Q", name: "cu", tip: "只跟 ue/ui 連用，u 不發音，唸「克」" },
  { letter: "R", name: "erre", tip: "字中單一r輕彈舌，字首或rr要打舌顫音" },
  { letter: "S", name: "ese", tip: "跟英文 s 一樣，唇齒音" },
  { letter: "T", name: "te", tip: "類似「特」，比英文 t 輕、不送氣" },
  { letter: "U", name: "u", tip: "類似注音「ㄨ」" },
  { letter: "V", name: "uve", tip: "多數地區唸法跟 B 很接近，不咬唇齒" },
  { letter: "W", name: "uve doble", tip: "外來字才用" },
  { letter: "X", name: "equis", tip: "跟英文 x 一樣" },
  { letter: "Y", name: "ye / i griega", tip: "單獨當「和」用時唸類似「衣」；當子音時發音接近 ll" },
  { letter: "Z", name: "zeta", tip: "西班牙本土唸 th，拉美唸「思」" },
];

// v4.21.0(改動I): 「子音規則」——比 PRONUNCIATION_RULES 更詳細、逐字母的
// 子音發音規則表，取材自課本「子音」章節(共17條，B到R)。跟 PRONUNCIATION_
// RULES 的差異：PRONUNCIATION_RULES 是挑重點、給初學者的精簡版；這份是
// 逐字母查閱用的完整參考表，兩者內容有重疊但用途不同，故意分開放。
const CONSONANT_RULES = [
  { letter: "B", body: "屬於雙唇音，依其在單字中所在的位置，會有發音上的些微差異。" },
  {
    letter: "C",
    body: "依其所接續之字母，有不同的發音。ca、co、cu 以及 c+其他子音時唸 [ka]；ce、ci 唸 [ce]，但因地區不同而有差異——西班牙南部、中南美洲習慣發 yes 的 [s]。",
  },
  { letter: "CH", body: "類似注音「ㄑ」的半氣半音。" },
  {
    letter: "D",
    body: "依其在單字中的位置而有不同的發音。位於字尾時，發音與 thank you 的 [θ] 以及西文 c+e、i 時的 c 相同。舌尖微突於上下牙齒間，發音時牙齒輕咬，僅將氣送出而不發音。由於此時的 [d] 為氣音，所以在口語化的會話中，甚至不發音。",
  },
  { letter: "F", body: "發音與英文 for 的 [f] 相同。" },
  {
    letter: "G",
    body: "依其所接續之字母，有不同的發音。在 a、o、u 以及其他子音前：與英文 go [g] 相同。g+ue、g+ui 時：u 不發音，g 的發音同上；但若為 güe、güi，則 ü 要發音(這種字在西文中較為少見)。在 e、i 之前：[ge]，由舌頭後方施力發音，感覺有口水跟隨舌頭後方振動。",
  },
  { letter: "H", body: "在西文中完全不發音。" },
  { letter: "J", body: "類似英文 hi 的 [h]。由舌頭後方施力，發音時感覺有口水跟隨舌頭後方振動。" },
  {
    letter: "K",
    body: "與英文 key 的 [k] 相同但去除氣音，意即與西文「c+a、o、u、其他子音」時的 c 相同。K 屬於外來字母，因此在西文單字中並不常見，以外來字為主。",
  },
  { letter: "L", body: "類似注音 [ㄌ]。當 l 出現在字中或字尾時，把頂在上牙齦的舌尖停頓一會兒，以加強此發音。" },
  {
    letter: "LL",
    body: "代表西文獨特之處的字母之一，其發音也隨著地區的不同而有所差異。主要發音與英文的 [y] 相似。在現代西語中，ll 與 y 在絕大多數地區發音完全相同(受 Yeísmo 語言現象影響)；在南美洲的阿根廷與烏拉圭等地，ll 會發成類似英文 sh 的音。",
  },
  { letter: "M", body: "發音與英文 man 的 [m] 相同。" },
  { letter: "N", body: "發音與英文 no 的 [n] 相同。當 n 在字中時，發音類似英文 sing 的 [ŋ]。" },
  { letter: "Ñ", body: "也是特別的西文字母之一。發音類似西文 [ni]。Ñ 的鼻音比 N 還重。" },
  { letter: "P", body: "類似注音 [ㄅ]。" },
  { letter: "Q", body: "在西文中只接 ue、ui，u 不發音。q 與 c+a、o、u 以及 c+其他子音時發音相同。" },
  {
    letter: "R",
    body: "依其在單字中位置不同而有不同的發音。在字首、rr 以及在 l、n、s 之後：發打舌音，舌尖輕頂上牙齦，發音時吐氣使舌尖連續振動，初學者可含口水、將頭仰上練習。其他情況：r 發捲舌音，舌頭捲起，發音時舌尖輕碰上顎後彈回，自然發音即可，跟打舌的 r 比較起來，這時的 r 發音較短。",
  },
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

// v4.21.0(改動J): 「母音與雙三母音」——強弱母音組合、三母音結構、以及
// 「雙母音看起來像但其實要拆開(Hiato)」的例外情況，取材自課本「雙母音／
// 三母音」章節。
const DIPHTHONG_RULES = [
  {
    title: "強母音與弱母音",
    body: "a、e、o 是強母音，i、u 是弱母音。強弱之分不影響發音，只影響重音規則的應用。強母音+弱母音、或弱母音+強母音，可以組成 12 種雙母音。",
    examples: ["ai / ia", "ei / ie", "oi / io", "au / ua", "eu / ue", "ou / uo"],
  },
  {
    title: "弱母音+弱母音",
    body: "兩個弱母音(i、u)相鄰時，一樣算雙母音，共有 2 種組合。",
    examples: ["iu", "ui"],
  },
  {
    title: "三母音",
    body: "由「弱母音+強母音+弱母音」組成，發音時必須一氣呵成，重音落在中間的強母音上。三母音在西文中並不常用，多半見於動詞變化第二人稱複數(vosotros)。這幾種組合出現在字尾時，uai 一律變成 uay 的形式，uei 一律變成 uey 的形式。",
    examples: ["iai", "iei", "uai / uay", "uei / uey"],
  },
  {
    title: "雙母音、三母音同一音節，不分開",
    body: "劃分音節時，雙母音或三母音視為同一個音節，不能拆開。",
    examples: ["ai-re(空氣)", "ciu-dad(城市)", "U-ru-guay(烏拉圭)"],
  },
  {
    title: "例外：Hiato，要拆成不同音節",
    body: "當兩個母音都是強母音，或是「強母音+弱母音」但重音落在弱母音上時，這種組合不算雙母音、叫做 Hiato，劃分音節時要拆開。",
    examples: ["i-de-a(主意)", "dí-a(日子;白天)"],
  },
];

// v4.21.0(改動J): 「音節劃分」——5 種切分規則 + 例外，取材自課本「音節」
// 章節。音節是西語發音的基本單位，這份表是查閱用的完整規則，練習單字
// 直接放進 examples。
const SYLLABLE_RULES = [
  {
    title: "子音+母音(最基本規則)",
    body: "每個音節都會有一個母音或一組雙母音。ch、ll、rr 雖然是由兩個字母組成，但發音上仍是一個字音，劃分音節時不拆開。",
    examples: ["pi-so(屋;樓)", "mú-si-ca(音樂)", "co-che(車子)", "si-lla(椅子)"],
  },
  {
    title: "母音+子音+母音",
    body: "子音通常與接續之母音構成一音節：單一子音介於兩個母音之間時，跟後面的母音一起構成一個音節。",
    examples: ["u-so(使用)", "o-lla(鍋子)", "i-ló-gi-co(不合邏輯的)"],
  },
  {
    title: "母音+子音+子音+母音",
    body: "當兩個子音介於母音間，第一個子音與前接母音為一音節，後面的子音與另一個母音為一音節。",
    examples: ["cul-tu-ra(文化)", "mar-tes(星期二)", "res-pi-ro(呼吸)"],
  },
  {
    title: "例外：第二個子音是 l 或 r",
    body: "但當第二個子音為 l 或 r 時，這兩個子音要與後接母音構成一個音節，不拆開。",
    examples: ["co-bro(收款)", "pú-bli-co(公共的)", "a-tre-vi-do(大膽的)"],
  },
  {
    title: "三個子音介於母音之間",
    body: "前兩個子音與前接母音為一音節，最後一個子音則與後接母音為一音節。",
    examples: ["ins-ti-tu-to(學院)", "ins-tin-to(本能)", "ins-ta-la-ción(設施)"],
  },
  {
    title: "例外：最後一個子音是 l 或 r",
    body: "當最後一個子音為 l 或 r 時，後面兩個子音要與後接母音一起構成一個音節。",
    examples: ["som-bre-ro(帽子)", "con-flic-to(衝突)", "sor-pre-sa(驚喜)"],
  },
  {
    title: "四個子音介於母音之間",
    body: "前兩個子音與前接母音為一音節，後兩個子音與後接母音為一音節。",
    examples: ["ins-truc-ción(指導)"],
  },
];

// v4.21.0(改動J): 「語調與連音」——音節等時性、3 種連音規則、標點符號
// 語氣升降，取材自課本「語調」章節。
const INTONATION_RULES = [
  {
    title: "音節等時性",
    body: "西語是音節語言，念的不是字、是音節，會有連音。每個音節唸起來輕重差不多、時間幾乎一樣長；多於一個音節的字都有一個重音，這個重音不會拖長音，也不會改變其他音節的節拍。",
    examples: [],
  },
  {
    title: "連音①：子音+母音+子音",
    body: "字跟字中間不會停頓。前一個字字尾的子音，會跟下一個字開頭的母音連在一起唸。",
    examples: ["Mis amigos → Mi-sa-mi-gos", "López Obrador → Ló-pe-zo-ra-dor"],
  },
  {
    title: "連音②：母音+母音",
    body: "前一個字字尾的母音跟下一個字開頭的母音相鄰時：如果是「弱母音+強母音」會連成雙母音(算同一個音節)；如果是「強母音+強母音」則算 Hiato(仍是兩個音節)。",
    examples: ["Mi amigo → Mia-mi-go(ia 為雙母音，同一音節)", "Haga el favor → Ha-gael-fa-vor(ae 為 Hiato，仍是兩個音節)"],
  },
  {
    title: "連音③：兩個相同的母音",
    body: "前一個字字尾跟下一個字開頭是同一個母音時，會合併成一個音節唸。",
    examples: ["Es casi imposible → Es-ca-sim-po-si-ble"],
  },
  {
    title: "疑問句：語氣上揚",
    body: "看到問號，句子的語氣從開始唸到最後一定要往上揚。",
    examples: ["¿Te gusta la paella?(你喜歡海鮮飯嗎？)"],
  },
  {
    title: "肯定句：先升、持平、再降",
    body: "肯定句的音調變化，從一開始唸到最後一定是：開始緩緩上升，中間持平，後面下降。",
    examples: ["A ti te gusta la paella.(你喜歡海鮮飯。)"],
  },
  {
    title: "驚嘆句：起伏感特別重",
    body: "在有驚嘆號的句子裡，說話的上下起伏感會特別明顯。",
    examples: ["¡Cómo es posible que no te guste la paella!(你怎麼可能不喜歡海鮮飯！)"],
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
