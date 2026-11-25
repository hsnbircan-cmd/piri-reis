// Piri Reis Dijital Tasarim Atolyesi · cevrimdisi onbellek (Service Worker)
// Site internetle bir kez acildiginda tum dosyalari onbellege alir;
// sonraki acilislarda internet olmasa bile GitHub Pages adresinden calisir.
// Internet varken once agdan guncel surumu ceker ve onbellegi tazeler.

var ONBELLEK = "prdta-v4";
var DOSYALAR = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./varlik/stil.css",
  "./varlik/uygulama.js",
  "./varlik/gorseller.js",
  "./varlik/araclar.js",
  "./varlik/bulut.js",
  "./varlik/rapor.js",
  "./varlik/simge.svg",
  "./veri/ayar.js",
  "./veri/oyg.js",
  "./veri/puy.js",
  "./veri/sozluk.js"
];

self.addEventListener("install", function (olay) {
  olay.waitUntil(
    caches.open(ONBELLEK).then(function (depo) {
      return depo.addAll(DOSYALAR);
    }).then(function () {
      return self.skipWaiting();
    })
  );
});

self.addEventListener("activate", function (olay) {
  olay.waitUntil(
    caches.keys().then(function (adlar) {
      return Promise.all(adlar.map(function (ad) {
        if (ad.indexOf("prdta-") === 0 && ad !== ONBELLEK) {
          return caches.delete(ad);
        }
      }));
    }).then(function () {
      return self.clients.claim();
    })
  );
});

self.addEventListener("fetch", function (olay) {
  var istek = olay.request;
  // Yalnizca ayni kaynaktan gelen GET isteklerini ele al (Apps Script POST'a dokunma)
  if (istek.method !== "GET") return;
  var url = new URL(istek.url);
  if (url.origin !== self.location.origin) return;

  olay.respondWith(
    fetch(istek, { cache: "no-cache" }).then(function (yanit) {
      if (yanit && yanit.status === 200 && yanit.type === "basic") {
        var kopya = yanit.clone();
        caches.open(ONBELLEK).then(function (depo) {
          depo.put(istek, kopya);
        });
      }
      return yanit;
    }).catch(function () {
      return caches.match(istek).then(function (bulunan) {
        if (bulunan) return bulunan;
        if (istek.mode === "navigate") return caches.match("./index.html");
        return new Response("Çevrimdışı", { status: 503, statusText: "Offline" });
      });
    })
  );
});
