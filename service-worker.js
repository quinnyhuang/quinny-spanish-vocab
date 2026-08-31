// service-worker.js
//
// 這個檔案的工作:
// 1. 把 App 需要的核心檔案(html/js/圖示)存進手機本地快取,離線也能打開 App
// 2. 平常優先用「網路上最新版本」,抓不到網路才退回本地快取
//    → 這代表你平常更新 word_bank.js / theme_bank.js 內容,使用者下次
//      連網開啟 App 就會自動吃到新內容,不需要重新安裝、也不需要走
//      Google Play 審核
// 3. CACHE_NAME 版本號變更時，會自動清掉舊快取，避免越存越大
//
// 什麼時候要手動改這個檔案裡的 CACHE_NAME?
// → 只有當你想「強制」所有使用者的舊快取失效時（例如網站根目錄檔案結構
//   大搬家）才需要手動改一下版本字串。平常改 word_bank.js 內容本身完全
//   不用碰這個檔案。

// service-worker.js
//
// 這個檔案的工作:
// 1. 把 App 需要的核心檔案(html/js/圖示)存進手機本地快取,離線也能打開 App
// 2. 開啟時「先秒開本地快取,同時背景去網路上偷偷抓最新版本、抓到就
//    更新快取」(stale-while-revalidate)
//    → 這代表每次開啟 App 都跟看快取一樣快,不用等網路;你平常更新
//      word_bank.js / theme_bank.js 內容後,使用者「這次打開」用的還是
//      舊快取,但背景已經在換新了,「下一次打開」就會是最新內容——
//      這個一次的延遲對背單字這種內容完全不影響體驗
// 3. CACHE_NAME 版本號變更時，會自動清掉舊版本快取，避免越存越大
//
// 什麼時候要手動改這個檔案裡的 CACHE_NAME?
// → 只有當你想「強制」所有使用者的舊快取失效時（例如網站根目錄檔案結構
//   大搬家）才需要手動改一下版本字串。平常改 word_bank.js 內容本身完全
//   不用碰這個檔案。

const CACHE_NAME = "xiwen-danci-cache-v2";

// App shell：開啟 App 必須要有的核心檔案，會在安裝階段預先下載存好
const APP_SHELL = [
  "./",
  "./index.html",
  "./manifest.json",
  "./word_bank.js",
  "./theme_bank.js",
  "./audio_map.js",
  "./grammar_bank.js",
  "./changelog.js",
  "./app.js",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/apple-touch-icon-180.png",
  "./icons/favicon.ico",
];

// 安裝階段：把 App shell 全部存進快取
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // 個別檔案抓取失敗不要讓整個安裝失敗（例如日後刪掉某張圖示）
      return Promise.all(
        APP_SHELL.map((url) =>
          cache.add(url).catch((err) => {
            console.warn("[service-worker] 預先快取失敗，略過:", url, err);
          })
        )
      );
    })
  );
  self.skipWaiting();
});

// 啟用階段：清掉舊版本的快取
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// 攔截網路請求：stale-while-revalidate
// 有快取就先立刻回傳快取（App 秒開），同時背景另外發一個網路請求去
// 更新快取，供「下一次」開啟使用。完全沒快取過的東西才會等網路。
self.addEventListener("fetch", (event) => {
  // 只處理 GET 請求（例如不要快取到任何未來可能加的 POST API）
  if (event.request.method !== "GET") return;

  event.respondWith(
    caches.open(CACHE_NAME).then((cache) =>
      cache.match(event.request).then((cachedResponse) => {
        const networkFetch = fetch(event.request)
          .then((networkResponse) => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          })
          .catch(() => cachedResponse); // 網路失敗就靜靜放棄，不影響已回傳的畫面

        // 有快取：立刻回傳快取，網路更新在背景默默進行
        // 沒快取：只好等網路（例如第一次載入到快取範圍外的檔案）
        return cachedResponse || networkFetch;
      })
    )
  );
});
