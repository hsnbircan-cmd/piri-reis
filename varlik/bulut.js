// Ogrenci oturumu (Ad Soyad + ogrenci no son 4 hane) ve Google Drive bulut esitleme modulu.
// Tum haftalik calisma yapraklari, isaretlenen adimlar ve Proje Raporu birlikte saklanir.
window.BULUT = (function () {
  "use strict";

  var YEREL_ONEK = "prdta_yerel.";
  var OTURUM_ANAHTAR = "prdta.bulut.oturum";
  var SON_KAYIT_ANAHTAR = "prdta.bulut.sonKayit";
  var KIRLI_ANAHTAR = "prdta.bulut.kirli";

  var uygulaniyor = false;
  var bulutZamanlayici = null;
  var yerelZamanlayici = null;
  var kaydediliyor = false;
  var durumDinleyiciler = [];
  var sonMesaj = "";

  // ---------- yardimcilar ----------
  function adAnahtar(ad) {
    var s = String(ad || "").trim()
      .replace(/İ/g, "i").replace(/I/g, "i")
      .replace(/Ğ/g, "g").replace(/ğ/g, "g")
      .replace(/Ü/g, "u").replace(/ü/g, "u")
      .replace(/Ş/g, "s").replace(/ş/g, "s")
      .replace(/Ö/g, "o").replace(/ö/g, "o")
      .replace(/Ç/g, "c").replace(/ç/g, "c")
      .replace(/ı/g, "i")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_+|_+$/g, "");
    return s.slice(0, 60);
  }

  function sifreDuzelt(ham) {
    var rakam = String(ham || "").replace(/\D/g, "");
    if (!rakam) return "";
    if (rakam.length > 4) return rakam.slice(-4);
    return ("0000" + rakam).slice(-4);
  }

  function profilAnahtar(ad, sifre) {
    var a = adAnahtar(ad);
    var s = sifreDuzelt(sifre);
    return (a && s) ? (a + "__" + s) : "";
  }

  function zamanMetni(d) {
    function iki(n) { return (n < 10 ? "0" : "") + n; }
    return iki(d.getDate()) + "." + iki(d.getMonth() + 1) + "." + d.getFullYear() +
      " " + iki(d.getHours()) + ":" + iki(d.getMinutes());
  }

  function saatMetni(d) {
    function iki(n) { return (n < 10 ? "0" : "") + n; }
    return iki(d.getHours()) + ":" + iki(d.getMinutes());
  }

  function esitlenecekAnahtarMi(k) {
    if (!k || k.indexOf("prdta.") !== 0) return false;
    if (k === "prdta.kuyruk") return false;
    if (k.indexOf("prdta.bulut.") === 0) return false;
    return true;
  }

  function oturumAl() {
    try {
      var ham = window.localStorage.getItem(OTURUM_ANAHTAR);
      if (!ham) return null;
      var o = JSON.parse(ham);
      if (o && o.ad && o.sifre && o.anahtar) return o;
    } catch (e) { /* yoksay */ }
    return null;
  }

  function oturumYaz(o) {
    try {
      if (!o) window.localStorage.removeItem(OTURUM_ANAHTAR);
      else window.localStorage.setItem(OTURUM_ANAHTAR, JSON.stringify(o));
    } catch (e) { /* yoksay */ }
  }

  function durumBildir(mesaj) {
    if (typeof mesaj === "string") sonMesaj = mesaj;
    durumDinleyiciler.forEach(function (fn) {
      try { fn(); } catch (e) { /* yoksay */ }
    });
  }

  function durumDinle(fn) {
    durumDinleyiciler = [fn];
  }

  // ---------- yerel calisma okuma / yazma / yalitma ----------
  function calismaTopla() {
    var kayitlar = {};
    var adet = 0;
    try {
      for (var i = 0; i < window.localStorage.length; i++) {
        var k = window.localStorage.key(i);
        if (esitlenecekAnahtarMi(k)) {
          kayitlar[k] = window.localStorage.getItem(k);
          adet++;
        }
      }
    } catch (e) { /* yoksay */ }
    return { kayitlar: kayitlar, adet: adet };
  }

  function anlamliCalismaVarMi(kayitlar) {
    var k = kayitlar || calismaTopla().kayitlar;
    for (var anahtar in k) {
      if (!Object.prototype.hasOwnProperty.call(k, anahtar)) continue;
      var v = String(k[anahtar] || "").trim();
      if (!v) continue;
      if (/\.(bitti|[at]\d+|oz\d+)$/.test(anahtar) && v === "1") return true;
      if (/\.c\d+$/.test(anahtar)) {
        if (v.charAt(0) === "[") {
          try {
            var matris = JSON.parse(v);
            if (Array.isArray(matris) && matris.some(function (sat) {
              return Array.isArray(sat) && sat.some(function (h) { return String(h || "").trim().length > 0; });
            })) return true;
          } catch (e) { return true; }
        } else {
          return true;
        }
      }
      if (anahtar === "prdta.rapor.veri") {
        try {
          var r = JSON.parse(v);
          if (r && typeof r === "object") {
            var alanlar = [r.baslik, r.ozet, r.amac, r.giris, r.yontem, r.bulgular, r.sonuc, r.oneriler, r.kaynaklar, r.ekler];
            if (alanlar.some(function (x) { return String(x || "").trim().length > 0; })) return true;
          }
        } catch (e) { /* yoksay */ }
      }
    }
    return false;
  }

  function calismaTemizle() {
    uygulaniyor = true;
    try {
      var silinecek = [];
      for (var i = 0; i < window.localStorage.length; i++) {
        var k = window.localStorage.key(i);
        if (esitlenecekAnahtarMi(k)) silinecek.push(k);
      }
      silinecek.forEach(function (k) { window.localStorage.removeItem(k); });
    } catch (e) { /* yoksay */ }
    uygulaniyor = false;
  }

  function calismaUygula(kayitlar, oturum) {
    calismaTemizle();
    uygulaniyor = true;
    try {
      for (var k in kayitlar) {
        if (Object.prototype.hasOwnProperty.call(kayitlar, k) &&
            esitlenecekAnahtarMi(k) &&
            typeof kayitlar[k] === "string") {
          window.localStorage.setItem(k, kayitlar[k]);
        }
      }
      if (oturum) {
        window.localStorage.setItem("prdta.ogrenci.ad", oturum.ad);
        if (oturum.grup) window.localStorage.setItem("prdta.ogrenci.grup", oturum.grup);
      }
    } catch (e) { /* yoksay */ }
    uygulaniyor = false;
  }

  function yerelProfilYaz(oturum) {
    if (!oturum || !oturum.anahtar) return;
    try {
      var paket = {
        ad: oturum.ad,
        grup: window.localStorage.getItem("prdta.ogrenci.grup") || oturum.grup || "",
        sifre: oturum.sifre,
        tarih: zamanMetni(new Date()),
        kayitlar: calismaTopla().kayitlar
      };
      window.localStorage.setItem(YEREL_ONEK + oturum.anahtar, JSON.stringify(paket));
    } catch (e) { /* yoksay */ }
  }

  function yerelProfilOku(anahtar) {
    try {
      var ham = window.localStorage.getItem(YEREL_ONEK + anahtar);
      return ham ? JSON.parse(ham) : null;
    } catch (e) { return null; }
  }

  // ---------- bulut istek ----------
  function bulutIstek(yuk, cb, secenek) {
    var AYAR = window.AYAR || {};
    var adres = AYAR.gonderimAdresi;
    if (!adres) { cb({ ok: false, cevrdisi: true, mesaj: "Bulut adresi tanımlı değil." }); return; }
    if (navigator.onLine === false) { cb({ ok: false, cevrdisi: true, mesaj: "İnternet bağlantısı yok." }); return; }
    if (typeof window.fetch !== "function") { cb({ ok: false, mesaj: "Tarayıcı bulut bağlantısını desteklemiyor." }); return; }

    var govde = "veri=" + encodeURIComponent(JSON.stringify(yuk));
    var sure = AYAR.zamanAsimi || 15000;
    var bitti = false;
    function bitir(sonuc) {
      if (bitti) return;
      bitti = true;
      clearTimeout(t);
      cb(sonuc);
    }
    var t = setTimeout(function () {
      bitir({ ok: false, mesaj: "Sunucu zamanında yanıt vermedi." });
    }, sure);

    var fetchAyar = {
      method: "POST",
      mode: "cors",
      body: govde,
      headers: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" }
    };
    if (secenek && secenek.keepalive) fetchAyar.keepalive = true;

    window.fetch(adres, fetchAyar)
      .then(function (yanit) { return yanit.text(); })
      .then(function (metin) {
        var o = null;
        try { o = JSON.parse(metin); } catch (e) { /* yoksay */ }
        if (!o) {
          bitir({ ok: false, mesaj: "Sunucudan geçersiz yanıt geldi." });
          return;
        }
        if (o.durum === "hata") {
          if (o.mesaj === "eksik alan") {
            bitir({
              ok: false,
              eskiSunucu: true,
              mesaj: "Apps Script betiği henüz güncellenmemiş (Kod.gs yeni sürümle yayımlanmalı). Çalışman şimdilik bu tarayıcıda güvende."
            });
            return;
          }
          bitir({ ok: false, kod: o.kod || "", mesaj: o.mesaj || "Sunucu hatası." });
          return;
        }
        bitir({ ok: true, veri: o });
      })
      .catch(function () {
        bitir({ ok: false, cevrdisi: true, mesaj: "Buluta ulaşılamadı. Çalışman bu tarayıcıda saklanıyor." });
      });
  }

  // ---------- kaydetme ve esitleme ----------
  function bulutKaydet(secenek, cb) {
    var oturum = oturumAl();
    if (!oturum) { if (cb) cb(false); return; }
    if (kaydediliyor && !(secenek && secenek.keepalive)) { if (cb) cb(false); return; }

    var AYAR = window.AYAR || {};
    var grup = "";
    try { grup = window.localStorage.getItem("prdta.ogrenci.grup") || oturum.grup || ""; } catch (e) { /* yoksay */ }
    oturum.grup = grup;
    oturumYaz(oturum);
    yerelProfilYaz(oturum);

    if (!AYAR.gonderimAdresi || navigator.onLine === false) {
      try { window.localStorage.setItem(KIRLI_ANAHTAR, "1"); } catch (e) { /* yoksay */ }
      durumBildir("Çevrimdışı · yerelde saklandı");
      if (cb) cb(false);
      return;
    }

    var simdi = zamanMetni(new Date());
    // Bu tarayicinin buluttan aldigi en son surumun tarihi. Sunucu bunu
    // karsilastirip arada baska bir cihazin kaydedip kaydetmedigini anlar.
    var temel = "";
    try { temel = window.localStorage.getItem(SON_KAYIT_ANAHTAR) || ""; } catch (e) { /* yoksay */ }
    var yuk = {
      islem: "taslak_kaydet",
      anahtar: AYAR.sinifAnahtari || "",
      ad: oturum.ad,
      grup: grup,
      sifre: oturum.sifre,
      zorlaYeni: !!oturum.zorlaYeni,
      tarih: simdi,
      temelTarih: temel,
      kayitlar: calismaTopla().kayitlar
    };

    kaydediliyor = true;
    durumBildir("Buluta kaydediliyor...");
    bulutIstek(yuk, function (sonuc) {
      kaydediliyor = false;
      if (sonuc.ok) {
        var birlesti = !!(sonuc.veri && sonuc.veri.birlesti);
        if (birlesti && sonuc.veri.kayitlar) {
          // Arada baska bir cihaz kaydetmis. Sunucu iki kaydi birlestirdi;
          // birlesik sonucu bu tarayiciya da uyguluyoruz ki ikisi ayni olsun.
          calismaUygula(sonuc.veri.kayitlar, oturum);
        }
        try {
          window.localStorage.setItem(SON_KAYIT_ANAHTAR, sonuc.veri.tarih || simdi);
          window.localStorage.setItem(KIRLI_ANAHTAR, "0");
        } catch (e) { /* yoksay */ }
        durumBildir(birlesti
          ? "Başka cihazdaki çalışmanla birleştirildi · sayfayı yenileyince görünür"
          : "Buluta kaydedildi · " + saatMetni(new Date()));
        if (cb) cb(true, sonuc);
      } else {
        try { window.localStorage.setItem(KIRLI_ANAHTAR, "1"); } catch (e) { /* yoksay */ }
        durumBildir(sonuc.eskiSunucu ? "Sunucu güncellemesi bekliyor (yerelde kayıtlı)" : "Yerelde kayıtlı · bulut bekliyor");
        if (cb) cb(false, sonuc);
      }
    }, secenek);
  }

  function degisiklikBildir(anahtar) {
    if (uygulaniyor || !esitlenecekAnahtarMi(anahtar)) return;
    var oturum = oturumAl();
    if (!oturum) return;

    try { window.localStorage.setItem(KIRLI_ANAHTAR, "1"); } catch (e) { /* yoksay */ }

    clearTimeout(yerelZamanlayici);
    yerelZamanlayici = setTimeout(function () { yerelProfilYaz(oturumAl()); }, 600);

    clearTimeout(bulutZamanlayici);
    // 25 saniye: sunucuya her istek ~2-3 saniye surdugu icin sik kayit ayni
    // derste calisan ogrencileri kuyruga sokuyordu. Sayfa/sekme degisimi,
    // internete baglanma ve "Simdi kaydet" aninda zorla kaydettigi icin
    // bu bekleme veri kaybina yol acmaz.
    bulutZamanlayici = setTimeout(function () { bulutKaydet(); }, 25000);
    durumBildir("Kaydedilecek değişiklik var...");
  }

  function degisiklikVarsaKaydet(secenek) {
    clearTimeout(bulutZamanlayici);
    var oturum = oturumAl();
    if (!oturum) return;
    try {
      if (window.localStorage.getItem(KIRLI_ANAHTAR) === "1") {
        bulutKaydet(secenek);
      }
    } catch (e) { /* yoksay */ }
  }

  // ---------- giris ve cikis ----------
  function girisYap(hamAd, hamSifre, hamGrup, secenek, cb) {
    secenek = secenek || {};
    var ad = String(hamAd || "").trim().replace(/\s+/g, " ");
    var sifre = sifreDuzelt(hamSifre);
    var grup = String(hamGrup || "").trim();
    var anahtar = profilAnahtar(ad, sifre);

    if (ad.length < 2 || !adAnahtar(ad)) {
      cb({ ok: false, mesaj: "Lütfen adını ve soyadını yaz." });
      return;
    }
    if (!sifre) {
      cb({ ok: false, mesaj: "Lütfen öğrenci numaranın son 4 hanesini yaz (4 haneden azsa başına 0 eklenir)." });
      return;
    }

    // Baska bir ogrenci aciksa once onun yerel kaydini koru
    var eskiOturum = oturumAl();
    if (eskiOturum && eskiOturum.anahtar !== anahtar) {
      yerelProfilYaz(eskiOturum);
      degisiklikVarsaKaydet();
    }

    var yeniOturum = { ad: ad, grup: grup, sifre: sifre, anahtar: anahtar, zorlaYeni: !!secenek.zorlaYeni };
    var anonimCalismaVar = !eskiOturum && anlamliCalismaVarMi();

    // Cakisma tercihi verildiyse dogrudan uygula
    if (secenek.tercih === "bulut" && secenek.bulutVeri) {
      yeniOturum.grup = grup || secenek.bulutVeri.grup || "";
      oturumYaz(yeniOturum);
      calismaUygula(secenek.bulutVeri.kayitlar || {}, yeniOturum);
      yerelProfilYaz(yeniOturum);
      try {
        window.localStorage.setItem(SON_KAYIT_ANAHTAR, secenek.bulutVeri.tarih || "");
        window.localStorage.setItem(KIRLI_ANAHTAR, "0");
      } catch (e) { /* yoksay */ }
      durumBildir("Buluttan yüklendi" + (secenek.bulutVeri.tarih ? " · " + secenek.bulutVeri.tarih : ""));
      cb({ ok: true, kaynak: "bulut", tarih: secenek.bulutVeri.tarih || "", mesaj: "Hoş geldin " + ad + "! Kaldığın yerden devam edebilirsin." });
      return;
    }
    if (secenek.tercih === "yerel") {
      oturumYaz(yeniOturum);
      uygulaniyor = true;
      try {
        window.localStorage.setItem("prdta.ogrenci.ad", ad);
        if (grup) window.localStorage.setItem("prdta.ogrenci.grup", grup);
      } catch (e) { /* yoksay */ }
      uygulaniyor = false;
      bulutKaydet({}, function (basarili) {
        cb({
          ok: true,
          kaynak: "yerel",
          mesaj: basarili
            ? "Bu bilgisayardaki çalışman buluta kaydedildi."
            : "Oturum açıldı; internete bağlanınca buluta kaydedilecek."
        });
      });
      return;
    }

    var AYAR = window.AYAR || {};
    var yerel = yerelProfilOku(anahtar);

    bulutIstek({
      islem: "taslak_getir",
      anahtar: AYAR.sinifAnahtari || "",
      ad: ad,
      sifre: sifre
    }, function (sonuc) {
      if (!sonuc.ok) {
        // Cevrimdisi veya sunucu henuz guncellenmemis: yerel profili kullan
        oturumYaz(yeniOturum);
        if (yerel && yerel.kayitlar) {
          yeniOturum.grup = grup || yerel.grup || "";
          oturumYaz(yeniOturum);
          calismaUygula(yerel.kayitlar, yeniOturum);
          durumBildir("Yerel kayıttan açıldı");
          cb({
            ok: true,
            kaynak: "yerel",
            uyari: sonuc.mesaj,
            mesaj: "Bu bilgisayardaki kaydın açıldı (" + (yerel.tarih || "") + "). " + (sonuc.mesaj || "")
          });
        } else {
          if (eskiOturum && eskiOturum.anahtar !== anahtar) calismaTemizle();
          uygulaniyor = true;
          try {
            window.localStorage.setItem("prdta.ogrenci.ad", ad);
            if (grup) window.localStorage.setItem("prdta.ogrenci.grup", grup);
            window.localStorage.setItem(KIRLI_ANAHTAR, "1");
          } catch (e) { /* yoksay */ }
          uygulaniyor = false;
          yerelProfilYaz(yeniOturum);
          durumBildir(sonuc.eskiSunucu ? "Sunucu güncellemesi bekliyor" : "Çevrimdışı oturum");
          cb({
            ok: true,
            kaynak: "cevrimdisi",
            uyari: sonuc.mesaj,
            mesaj: "Oturum bu bilgisayarda açıldı. " + (sonuc.mesaj || "")
          });
        }
        return;
      }

      var d = sonuc.veri || {};
      if (d.bulundu) {
        if (anonimCalismaVar) {
          cb({
            ok: false,
            cakisma: true,
            bulutTarih: d.tarih || "",
            bulutVeri: d,
            mesaj: "Bulutta kayıtlı çalışman var" + (d.tarih ? " (" + d.tarih + ")" : "") +
              ", ancak bu tarayıcıda da giriş yapmadan önce yazılmış içerik bulunuyor. Hangisi korunsun?"
          });
          return;
        }
        yeniOturum.grup = grup || d.grup || "";
        oturumYaz(yeniOturum);
        calismaUygula(d.kayitlar || {}, yeniOturum);
        yerelProfilYaz(yeniOturum);
        try {
          window.localStorage.setItem(SON_KAYIT_ANAHTAR, d.tarih || "");
          window.localStorage.setItem(KIRLI_ANAHTAR, "0");
        } catch (e) { /* yoksay */ }
        durumBildir("Buluttan yüklendi" + (d.tarih ? " · " + d.tarih : ""));
        cb({
          ok: true,
          kaynak: "bulut",
          tarih: d.tarih || "",
          mesaj: "Hoş geldin " + ad + "! Kaldığın yerden devam edebilirsin."
        });
        return;
      }

      // Bulutta bu (ad, sifre) bulunamadi
      if (d.yanlisSifre && !secenek.zorlaYeni) {
        cb({
          ok: false,
          yanlisSifre: true,
          mesaj: "Bu ad ve soyadla kayıtlı bir çalışma var ancak girdiğin 4 haneli şifre uyuşmadı. Öğrenci numaranın son 4 hanesini (4 haneden azsa başına 0 yazarak) kontrol et."
        });
        return;
      }

      // Yeni ogrenci (veya adas olup zorlaYeni secen ogrenci)
      oturumYaz(yeniOturum);
      if (yerel && yerel.kayitlar && !anonimCalismaVar) {
        calismaUygula(yerel.kayitlar, yeniOturum);
      } else if (eskiOturum && eskiOturum.anahtar !== anahtar) {
        calismaTemizle();
      }
      uygulaniyor = true;
      try {
        window.localStorage.setItem("prdta.ogrenci.ad", ad);
        if (grup) window.localStorage.setItem("prdta.ogrenci.grup", grup);
      } catch (e) { /* yoksay */ }
      uygulaniyor = false;

      bulutKaydet({}, function (basarili) {
        cb({
          ok: true,
          kaynak: "yeni",
          mesaj: basarili
            ? "Yeni kaydın oluşturuldu (" + ad + "). Bundan sonra herhangi bir bilgisayardan adın ve 4 haneli şifrenle kaldığın yerden devam edebilirsin."
            : "Oturum açıldı (" + ad + "). İnternet bağlantısı sağlandığında buluta kaydedilecek."
        });
      });
    });
  }

  function cikisYap(cb) {
    clearTimeout(bulutZamanlayici);
    clearTimeout(yerelZamanlayici);
    var oturum = oturumAl();
    function temizleVeBitir() {
      oturumYaz(null);
      try {
        window.localStorage.removeItem(SON_KAYIT_ANAHTAR);
        window.localStorage.removeItem(KIRLI_ANAHTAR);
      } catch (e) { /* yoksay */ }
      calismaTemizle();
      sonMesaj = "";
      durumBildir("");
      if (cb) cb();
    }
    if (!oturum) { temizleVeBitir(); return; }

    yerelProfilYaz(oturum);
    var kirli = false;
    try { kirli = window.localStorage.getItem(KIRLI_ANAHTAR) === "1"; } catch (e) { /* yoksay */ }
    if (kirli && window.AYAR && window.AYAR.gonderimAdresi && navigator.onLine !== false) {
      bulutKaydet({}, function () { temizleVeBitir(); });
    } else {
      temizleVeBitir();
    }
  }

  // ---------- arayuz bilesenleri ----------
  function girisFormuOlustur(ctx, ozetMod) {
    var el = ctx.el;
    var adIn = el("input", {
      type: "text",
      class: "oturum-girdi",
      placeholder: "Ad Soyad (ör. Ayşe Yılmaz)",
      autocomplete: "name"
    });
    var sifreIn = el("input", {
      type: "password",
      class: "oturum-girdi oturum-sifre",
      placeholder: "Öğrenci No son 4 hane",
      inputmode: "numeric",
      maxlength: "10",
      autocomplete: "current-password"
    });
    var grupIn = el("input", {
      type: "text",
      class: "oturum-girdi oturum-grup",
      placeholder: "Grup (ör. ÖYG-1 / PÜY-1)"
    });
    try {
      adIn.value = window.localStorage.getItem("prdta.ogrenci.ad") || "";
      grupIn.value = window.localStorage.getItem("prdta.ogrenci.grup") || "";
    } catch (e) { /* yoksay */ }

    var sifreOnizleme = el("span", { class: "oturum-sifre-not kucuk" });
    function onizleGuncelle() {
      var ham = sifreIn.value.replace(/\D/g, "");
      if (!ham) { sifreOnizleme.textContent = ""; return; }
      var duz = sifreDuzelt(ham);
      if (ham.length < 4) sifreOnizleme.textContent = "Başına 0 eklenir → " + duz;
      else if (ham.length > 4) sifreOnizleme.textContent = "Son 4 hane alınır → " + duz;
      else sifreOnizleme.textContent = "4 haneli şifre hazır";
    }
    sifreIn.addEventListener("input", onizleGuncelle);

    var girisBtn = el("button", { type: "submit", class: "dugme", metin: "Kaldığım yerden devam et" });
    var durumEl = el("div", { class: "oturum-durum" });
    var ekAlan = el("div", { class: "oturum-ek" });

    function mesajYaz(tip, metin) {
      durumEl.className = "oturum-durum " + (tip || "");
      durumEl.textContent = metin || "";
    }

    function gonderIsle(secenek) {
      ekAlan.innerHTML = "";
      girisBtn.disabled = true;
      mesajYaz("bekliyor", "Kontrol ediliyor...");
      girisYap(adIn.value, sifreIn.value, grupIn.value, secenek || {}, function (sonuc) {
        girisBtn.disabled = false;
        if (sonuc.ok) {
          mesajYaz("tamam", sonuc.mesaj || "Giriş yapıldı.");
          setTimeout(function () { ctx.yenile(); }, 300);
          return;
        }
        if (sonuc.yanlisSifre) {
          mesajYaz("hata", sonuc.mesaj);
          var adasBtn = el("button", {
            type: "button",
            class: "dugme ikincil kucuk-dugme",
            metin: "Adaşım var, kendi numaramla yeni kayıt aç"
          });
          adasBtn.addEventListener("click", function () {
            gonderIsle({ zorlaYeni: true });
          });
          ekAlan.appendChild(adasBtn);
          return;
        }
        if (sonuc.cakisma) {
          mesajYaz("bekliyor", sonuc.mesaj);
          var bulutSec = el("button", { type: "button", class: "dugme kucuk-dugme", metin: "Buluttaki kaydımı yükle" });
          var yerelSec = el("button", { type: "button", class: "dugme ikincil kucuk-dugme", metin: "Bu bilgisayardakini buluta kaydet" });
          bulutSec.addEventListener("click", function () {
            gonderIsle({ tercih: "bulut", bulutVeri: sonuc.bulutVeri });
          });
          yerelSec.addEventListener("click", function () {
            gonderIsle({ tercih: "yerel" });
          });
          ekAlan.appendChild(bulutSec);
          ekAlan.appendChild(yerelSec);
          return;
        }
        mesajYaz("hata", sonuc.mesaj || "Giriş yapılamadı.");
      });
    }

    var form = el("form", { class: "oturum-form" + (ozetMod ? " kompakt" : "") }, [
      el("div", { class: "oturum-alanlar" }, [
        adIn,
        sifreIn,
        grupIn,
        girisBtn
      ]),
      el("div", { class: "oturum-ipucu-satir" }, [
        el("span", { class: "kucuk", metin: "Şifre: Öğrenci numaranın son 4 hanesi (4 haneden azsa başına 0 yazılır; ör. 42 → 0042)." }),
        sifreOnizleme
      ]),
      durumEl,
      ekAlan
    ]);

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      gonderIsle({});
    });

    return { form: form, adIn: adIn };
  }

  function girisKarti(ctx) {
    var el = ctx.el;
    var f = girisFormuOlustur(ctx, false);
    return el("section", { class: "oturum-kart", id: "oturum-giris-kart" }, [
      el("div", { class: "oturum-kart-bas" }, [
        el("h2", { metin: "Adın ve öğrenci numaranla kaldığın yerden devam et" }),
        el("p", {
          class: "kucuk",
          metin: "Haftalık çalışma yaprakların, işaretlediğin adımlar ve Proje Raporun tek yerde saklanır. Atölyede başlayıp evde ya da başka bir bilgisayarda aynı yerden devam edebilirsin."
        })
      ]),
      f.form
    ]);
  }

  function cubukCiz(hedefEl, ctx) {
    if (!hedefEl) return;
    var el = ctx.el;
    var oturum = oturumAl();
    hedefEl.innerHTML = "";

    if (oturum) {
      var son = "";
      var kirli = false;
      try {
        son = window.localStorage.getItem(SON_KAYIT_ANAHTAR) || "";
        kirli = window.localStorage.getItem(KIRLI_ANAHTAR) === "1";
      } catch (e) { /* yoksay */ }

      var durumMetin = sonMesaj || (kirli ? "Kaydedilmeyi bekliyor..." : (son ? "Bulutta güncel · " + son : "Oturum açık"));
      var durumRozet = el("span", {
        class: "rozet " + (kirli || kaydediliyor ? "taslak" : "tamam"),
        metin: durumMetin
      });

      var kaydetBtn = el("button", { type: "button", class: "dugme ikincil kucuk-dugme", metin: "Şimdi kaydet" });
      kaydetBtn.addEventListener("click", function () {
        kaydetBtn.disabled = true;
        bulutKaydet({}, function () {
          kaydetBtn.disabled = false;
        });
      });

      var cikisBtn = el("button", { type: "button", class: "dugme ikincil kucuk-dugme", metin: "Çıkış / Değiştir" });
      cikisBtn.addEventListener("click", function () {
        cikisBtn.disabled = true;
        cikisYap(function () { ctx.yenile(); });
      });

      var grupMetin = "";
      try { grupMetin = window.localStorage.getItem("prdta.ogrenci.grup") || oturum.grup || ""; } catch (e) { /* yoksay */ }

      hedefEl.appendChild(el("div", { class: "ogrenci-cubuk-ic" }, [
        el("div", { class: "ogrenci-kimlik-bilgi" }, [
          el("strong", { metin: oturum.ad }),
          grupMetin ? el("span", { class: "rozet", metin: grupMetin }) : null,
          durumRozet
        ]),
        el("div", { class: "ogrenci-cubuk-dugmeler" }, [kaydetBtn, cikisBtn])
      ]));
      return;
    }

    // Oturum acik degilse ince giris cubugu + acilir form
    var acik = false;
    var panel = el("div", { class: "ogrenci-acilir-panel", style: "display:none" });
    var acBtn = el("button", { type: "button", class: "dugme kucuk-dugme", metin: "Giriş yap / Devam et" });

    acBtn.addEventListener("click", function () {
      var anaKart = document.getElementById("oturum-giris-kart");
      if (anaKart) {
        anaKart.scrollIntoView({ behavior: "smooth", block: "center" });
        var inp = anaKart.querySelector("input");
        if (inp) inp.focus();
        return;
      }
      acik = !acik;
      panel.style.display = acik ? "" : "none";
      acBtn.textContent = acik ? "Kapat" : "Giriş yap / Devam et";
      if (acik && !panel.childNodes.length) {
        var f = girisFormuOlustur(ctx, true);
        panel.appendChild(f.form);
        f.adIn.focus();
      }
    });

    hedefEl.appendChild(el("div", { class: "ogrenci-cubuk-ic" }, [
      el("span", { class: "kucuk", metin: "Ad Soyad ve öğrenci numaranın son 4 hanesiyle giriş yaparak tüm çalışmalarını her cihazda sürdürebilirsin." }),
      acBtn
    ]));
    hedefEl.appendChild(panel);
  }

  // Sekme gizlenince veya baglanti geri gelince bekleyen degisiklikleri esitle
  if (typeof document !== "undefined") {
    document.addEventListener("visibilitychange", function () {
      if (document.visibilityState === "hidden") {
        degisiklikVarsaKaydet({ keepalive: true });
      }
    });
  }
  if (typeof window !== "undefined") {
    window.addEventListener("online", function () {
      setTimeout(function () { degisiklikVarsaKaydet(); }, 1000);
    });
  }

  return {
    adAnahtar: adAnahtar,
    sifreDuzelt: sifreDuzelt,
    profilAnahtar: profilAnahtar,
    oturumAl: oturumAl,
    degisiklikBildir: degisiklikBildir,
    degisiklikVarsaKaydet: degisiklikVarsaKaydet,
    bulutKaydet: bulutKaydet,
    girisYap: girisYap,
    cikisYap: cikisYap,
    girisKarti: girisKarti,
    cubukCiz: cubukCiz,
    durumDinle: durumDinle
  };
})();
