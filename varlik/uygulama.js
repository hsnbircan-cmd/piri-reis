(function () {
  "use strict";

  var DERSLER = window.DERSLER || {};
  var AYAR = window.AYAR || {};
  var SOZLUK = window.SOZLUK || [];
  var GORSELLER = window.GORSELLER || {};
  var ARACLAR = window.ARACLAR || {};
  var icerik = document.getElementById("icerik");

  // ---------- kucuk yardimcilar ----------
  function el(etiket, ozellik, cocuk) {
    var d = document.createElement(etiket);
    if (ozellik) {
      for (var k in ozellik) {
        if (k === "class") d.className = ozellik[k];
        else if (k === "html") d.innerHTML = ozellik[k];
        else if (k === "metin") d.textContent = ozellik[k];
        else d.setAttribute(k, ozellik[k]);
      }
    }
    (cocuk || []).forEach(function (c) {
      if (c) d.appendChild(typeof c === "string" ? document.createTextNode(c) : c);
    });
    return d;
  }

  function depoAl(anahtar, varsayilan) {
    try {
      var d = window.localStorage.getItem(anahtar);
      return d === null ? varsayilan : d;
    } catch (e) { return varsayilan; }
  }

  function depoYaz(anahtar, deger) {
    try { window.localStorage.setItem(anahtar, deger); } catch (e) { /* yoksay */ }
  }

  function trKucuk(s) {
    return String(s || "")
      .replace(/İ/g, "i").replace(/I/g, "ı")
      .toLowerCase();
  }

  function haftalar(ders) {
    return (DERSLER[ders] ? DERSLER[ders].kayitlar : []).filter(function (k) {
      return k.tur === "hafta";
    });
  }

  function haftaBul(ders, no) {
    var h = haftalar(ders);
    for (var i = 0; i < h.length; i++) if (h[i].no === no) return h[i];
    return null;
  }

  function bittiMi(ders, no) { return depoAl("prdta." + ders + "." + no + ".bitti", "0") === "1"; }
  function bittiYaz(ders, no, d) { depoYaz("prdta." + ders + "." + no + ".bitti", d ? "1" : "0"); }

  function teslimHaftasiMi(k) {
    if (!k) return false;
    if (k.ozdenetim && k.ozdenetim.length) return true;
    var b = trKucuk(k.baslik + " " + k.olcme);
    return b.indexOf("teslim") !== -1 || b.indexOf("modül ") !== -1;
  }

  function sayac(ders) {
    var h = haftalar(ders), n = 0;
    h.forEach(function (x) { if (bittiMi(ders, x.no)) n++; });
    return { bitti: n, toplam: h.length };
  }

  function calismaKipiAl() { return depoAl("prdta.kip", "derste"); }
  function calismaKipiYaz(v) { depoYaz("prdta.kip", v); }

  // ---------- yedekleme / geri yukleme (atolye <-> ev) ----------
  function yedekIndir(durumEl) {
    var veri = {};
    var adet = 0;
    try {
      for (var i = 0; i < window.localStorage.length; i++) {
        var k = window.localStorage.key(i);
        if (k && k.indexOf("prdta.") === 0) {
          veri[k] = window.localStorage.getItem(k);
          adet++;
        }
      }
    } catch (e) {
      if (durumEl) durumEl.textContent = "Tarayıcı depolamasına erişilemedi.";
      return;
    }
    if (!adet) {
      if (durumEl) durumEl.textContent = "Henüz kaydedilmiş bir çalışma veya işaretleme yok.";
      return;
    }
    var paket = {
      uygulama: "piri-reis-atolye",
      surum: 1,
      tarih: zamanMetni(new Date()),
      kayitlar: veri
    };
    var blob = new Blob([JSON.stringify(paket, null, 2)], { type: "application/json;charset=utf-8" });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    var ad = (depoAl("prdta.ogrenci.ad", "") || "calismam").replace(/[^\wçğıöşüÇĞİÖŞÜ-]+/g, "_");
    a.href = url;
    a.download = "bilsem_" + ad + "_yedek.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
    if (durumEl) durumEl.textContent = adet + " kayıt yedek dosyası olarak indirildi.";
  }

  function yedekYukle(dosya, durumEl) {
    if (!dosya) return;
    var r = new FileReader();
    r.onload = function () {
      try {
        var paket = JSON.parse(r.result);
        var kayitlar = paket && paket.kayitlar;
        if (!kayitlar || typeof kayitlar !== "object") throw new Error("Geçersiz biçim");
        var n = 0;
        for (var k in kayitlar) {
          if (k.indexOf("prdta.") === 0 && typeof kayitlar[k] === "string") {
            depoYaz(k, kayitlar[k]);
            n++;
          }
        }
        if (durumEl) durumEl.textContent = n + " kayıt başarıyla geri yüklendi.";
        setTimeout(ciz, 400);
      } catch (e) {
        if (durumEl) durumEl.textContent = "Dosya okunamadı. Lütfen bu siteden indirdiğin .json yedeğini seç.";
      }
    };
    r.readAsText(dosya, "utf-8");
  }

  // ---------- gonderim ----------
  function kimlikAl() {
    return { ad: depoAl("prdta.ogrenci.ad", ""), grup: depoAl("prdta.ogrenci.grup", "") };
  }

  function zamanMetni(d) {
    function iki(n) { return (n < 10 ? "0" : "") + n; }
    return iki(d.getDate()) + "." + iki(d.getMonth() + 1) + "." + d.getFullYear() +
      " " + iki(d.getHours()) + ":" + iki(d.getMinutes());
  }

  function kuyrukAl() {
    try { return JSON.parse(depoAl("prdta.kuyruk", "[]")) || []; } catch (e) { return []; }
  }

  function kuyrukYaz(k) { depoYaz("prdta.kuyruk", JSON.stringify(k)); }

  function kuyrugaEkle(yuk) {
    var k = kuyrukAl();
    k = k.filter(function (x) { return !(x.ders === yuk.ders && x.hafta === yuk.hafta); });
    k.push(yuk);
    kuyrukYaz(k);
  }

  function kuyruktanCikar(yuk) {
    kuyrukYaz(kuyrukAl().filter(function (x) {
      return !(x.ders === yuk.ders && x.hafta === yuk.hafta && x.zaman === yuk.zaman);
    }));
  }

  function gonder(yuk, bitince) {
    var adres = AYAR.gonderimAdresi;
    if (!adres) { bitince(false, "Gönderim adresi tanımlı değil."); return; }
    if (navigator.onLine === false) { bitince(false, "İnternet bağlantısı yok."); return; }
    if (typeof window.fetch !== "function") { bitince(false, "Tarayıcı gönderimi desteklemiyor."); return; }

    var govde = "veri=" + encodeURIComponent(JSON.stringify(yuk));
    var baslik = { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" };
    var sure = AYAR.zamanAsimi || 15000;
    var bitti = false;

    function tamamla(basarili, mesaj) {
      if (bitti) return;
      bitti = true;
      bitince(basarili, mesaj);
    }
    var zamanlayici = setTimeout(function () {
      tamamla(false, "Sunucu yanıt vermedi.");
    }, sure);

    function sonlandir(basarili, mesaj) {
      clearTimeout(zamanlayici);
      tamamla(basarili, mesaj);
    }

    window.fetch(adres, { method: "POST", mode: "cors", body: govde, headers: baslik })
      .then(function (yanit) {
        return yanit.text().then(function (metin) {
          var o = null;
          try { o = JSON.parse(metin); } catch (e) { /* yoksay */ }
          if (o && o.durum === "hata") { sonlandir(false, "Sunucu kabul etmedi: " + (o.mesaj || "")); return; }
          sonlandir(true, "");
        });
      })
      .catch(function () {
        window.fetch(adres, { method: "POST", mode: "no-cors", body: govde, headers: baslik })
          .then(function () { sonlandir(true, ""); })
          .catch(function () { sonlandir(false, "Sunucuya ulaşılamadı."); });
      });
  }

  function kuyrukDene() {
    var k = kuyrukAl();
    if (!k.length || !AYAR.gonderimAdresi || navigator.onLine === false) return;
    var yuk = k[0];
    gonder(yuk, function (basarili) {
      if (basarili) {
        kuyruktanCikar(yuk);
        depoYaz("prdta." + yuk.ders + "." + yuk.hafta + ".gonderim", yuk.zaman);
        if (kuyrukAl().length) setTimeout(kuyrukDene, 1500);
        ciz();
      }
    });
  }

  // ---------- tarih ----------
  var AYLAR = {
    "ocak": 0, "şubat": 1, "subat": 1, "mart": 2, "nisan": 3, "mayıs": 4, "mayis": 4,
    "haziran": 5, "temmuz": 6, "ağustos": 7, "agustos": 7, "eylül": 8, "eylul": 8,
    "ekim": 9, "kasım": 10, "kasim": 10, "aralık": 11, "aralik": 11
  };

  function baslangicTarihi(tarihMetni) {
    if (!tarihMetni) return null;
    var parcalar = tarihMetni.split("-");
    var sol = parcalar[0].trim();
    var sag = (parcalar[1] || "").trim();
    var m = sol.match(/^(\d+)\s*([^\d\s]*)$/);
    if (!m) return null;
    var gun = parseInt(m[1], 10);
    var ayAd = trKucuk(m[2] || "");
    if (!ayAd) {
      var m2 = sag.match(/([^\d\s]+)\s*$/);
      ayAd = m2 ? trKucuk(m2[1]) : "";
    }
    var ay = AYLAR[ayAd];
    if (ay === undefined) return null;
    var yil = ay >= 8 ? 2026 : 2027;
    return new Date(yil, ay, gun);
  }

  function buHafta(ders) {
    var h = haftalar(ders), bugun = new Date(), secili = null;
    h.forEach(function (x) {
      var t = baslangicTarihi(x.tarih);
      if (t && t <= bugun) secili = x;
    });
    return secili || h[0] || null;
  }

  // ---------- giris sayfasi ----------
  function giris() {
    var p = el("div");

    p.appendChild(el("div", { class: "giris-bas" }, [
      el("h1", { metin: "Derste nerede kaldın?" }),
      el("p", {
        metin: "Her haftanın kendi sayfası var. Sayfada o haftanın sorusu, görsel şemalar, " +
          "gelemeyenler için adım adım işaretlenebilir telafi yolu, anında geri bildirimli kendini sına soruları " +
          "ve doldurulacak çalışma yaprağı bulunuyor."
      })
    ]));

    // Kaldigin yerden devam et
    var sonYol = depoAl("prdta.son.yol", "");
    if (sonYol) {
      var parca = sonYol.split("/");
      var sonHafta = parca.length === 2 ? haftaBul(parca[0], parseInt(parca[1], 10)) : null;
      if (sonHafta && DERSLER[parca[0]]) {
        var dersEtiket = DERSLER[parca[0]].ad.split("·")[1] ? DERSLER[parca[0]].ad.split("·")[1].trim() : parca[0];
        p.appendChild(el("div", { class: "devam-kutu" }, [
          el("div", {}, [
            el("span", { class: "kucuk", metin: "Kaldığın yerden devam et" }),
            el("div", { class: "devam-baslik", metin: dersEtiket + " · " + sonHafta.no + ". hafta — " + sonHafta.baslik })
          ]),
          el("a", { class: "dugme", href: "#/" + sonYol, metin: "Sayfayı aç →" })
        ]));
      }
    }

    var kartlar = el("div", { class: "ders-kart-liste" });
    ["oyg", "puy"].forEach(function (ders) {
      if (!DERSLER[ders]) return;
      var s = sayac(ders);
      var oran = s.toplam ? Math.round((s.bitti / s.toplam) * 100) : 0;
      var cubuk = el("div", { class: "cubuk" }, [el("span")]);
      cubuk.firstChild.style.width = oran + "%";
      kartlar.appendChild(el("a", { class: "ders-kart", href: "#/" + ders }, [
        el("h2", { metin: DERSLER[ders].ad }),
        el("div", { class: "ilerleme-metin", metin: s.toplam + " hafta · " + s.bitti + " tanesini tamamladın (%" + oran + ")" }),
        cubuk
      ]));
    });
    p.appendChild(kartlar);

    var bu = el("div", { class: "bu-hafta" }, [el("h3", { metin: "Plandaki tarihlere göre bu hafta" })]);
    ["oyg", "puy"].forEach(function (ders) {
      var h = buHafta(ders);
      if (!h) return;
      bu.appendChild(el("div", { class: "satir" }, [
        el("span", { class: "rozet", metin: DERSLER[ders].ad.split("·")[1] ? DERSLER[ders].ad.split("·")[1].trim() : ders }),
        el("a", { href: "#/" + ders + "/" + h.no, metin: h.no + ". hafta · " + h.baslik })
      ]));
    });
    p.appendChild(bu);

    p.appendChild(el("div", { class: "gelemedim" }, [
      el("h3", { metin: "Derse gelemedim, kendi başıma nasıl yetişeceğim?" }),
      el("ol", {}, [
        el("li", { metin: "Dersini seç ve kaçırdığın haftayı listeden (veya arama kutusundan) bul." }),
        el("li", { metin: "Sayfanın üstünden \"Evde tek başıma\" kipini aç; telafi adımlarını sırayla uygulayıp işaretle." }),
        el("li", { metin: "Örnekleri ve şemaları inceledikten sonra \"Kendini sına\" sorularıyla temel ayrımı yakalayıp yakalamadığını gör." }),
        el("li", { metin: "Çalışma yaprağını doldur, yazdır / PDF kaydet ya da öğretmene gönder; sonra \"Bu haftayı tamamladım\" kutusunu işaretle." })
      ])
    ]));

    // Atolye <-> Ev yedekleme kutusu
    var yedekDurum = el("div", { class: "kucuk yedek-durum" });
    var dosyaGirdi = el("input", { type: "file", accept: ".json,application/json", style: "display:none" });
    dosyaGirdi.addEventListener("change", function () {
      if (dosyaGirdi.files && dosyaGirdi.files[0]) yedekYukle(dosyaGirdi.files[0], yedekDurum);
      dosyaGirdi.value = "";
    });
    var indirDugme = el("button", { type: "button", class: "dugme ikincil", metin: "Çalışmamı yedekle (.json)" });
    var yukleDugme = el("button", { type: "button", class: "dugme ikincil", metin: "Yedekten yükle" });
    indirDugme.addEventListener("click", function () { yedekIndir(yedekDurum); });
    yukleDugme.addEventListener("click", function () { dosyaGirdi.click(); });

    p.appendChild(el("div", { class: "yedek-kutu" }, [
      el("h3", { metin: "Başka bir bilgisayarda devam etmek ister misin?" }),
      el("p", { class: "kucuk", metin: "Cevapların yalnızca bu tarayıcıda saklanır. Atölyede başlayıp evde devam etmek için dosyanı indirip diğer bilgisayarda geri yükleyebilirsin." }),
      el("div", { class: "yedek-dugmeler" }, [indirDugme, yukleDugme, dosyaGirdi, el("a", { class: "dugme ikincil", href: "#/sozluk", metin: "Kavram Sözlüğü (" + SOZLUK.length + ")" })]),
      yedekDurum
    ]));

    return p;
  }

  // ---------- sozluk sayfasi ----------
  function sozlukSayfasi(baslangicArama) {
    var p = el("div");
    p.appendChild(el("div", { class: "liste-bas" }, [
      el("div", {}, [
        el("h1", { metin: "Kavram Sözlüğü" }),
        el("p", { class: "kucuk", metin: SOZLUK.length + " temel kavram · Her kavramın tanımı, örneği ve işlendiği hafta" })
      ]),
      el("a", { class: "dugme ikincil", href: "#/", metin: "Ana sayfa" })
    ]));

    var arama = el("input", { type: "search", class: "arama-girdi", placeholder: "Kavram, tanım veya örnek ara (ör. tolerans, hipotez, G-code)..." });
    if (baslangicArama) arama.value = baslangicArama;

    var seciliDers = "tumu";
    var suzgecler = el("div", { class: "suzgec-satir" });
    var secenekler = [
      { kod: "tumu", ad: "Tümü" },
      { kod: "oyg", ad: "ÖYG" },
      { kod: "puy", ad: "Proje" },
      { kod: "ortak", ad: "Ortak" }
    ];
    var listeAlan = el("div", { class: "sozluk-liste" });
    var sayacMetin = el("p", { class: "kucuk", style: "margin-bottom:12px" });

    function cizListe() {
      var q = trKucuk(arama.value.trim());
      var sonuclar = SOZLUK.filter(function (s) {
        if (seciliDers !== "tumu" && s.ders !== seciliDers) return false;
        if (!q) return true;
        return trKucuk(s.terim + " " + s.tanim + " " + s.ornek).indexOf(q) !== -1;
      });
      sayacMetin.textContent = sonuclar.length + " kavram gösteriliyor.";
      listeAlan.innerHTML = "";
      if (!sonuclar.length) {
        listeAlan.appendChild(el("p", { class: "kucuk", metin: "Aramana uyan bir kavram bulunamadı." }));
        return;
      }
      sonuclar.forEach(function (s) {
        var dersAd = s.ders === "oyg" ? "ÖYG" : (s.ders === "puy" ? "Proje" : "Ortak");
        var hedefDers = s.ders === "ortak" ? "oyg" : s.ders;
        listeAlan.appendChild(el("div", { class: "sozluk-kart" }, [
          el("div", { class: "sozluk-ust" }, [
            el("h3", { metin: s.terim }),
            el("div", {}, [
              el("span", { class: "rozet" + (s.ders === "puy" ? " kod" : ""), metin: dersAd }),
              s.hafta ? el("a", { class: "rozet bag-rozet", href: "#/" + hedefDers + "/" + s.hafta, metin: s.hafta + ". hafta →" }) : null
            ])
          ]),
          el("p", { metin: s.tanim }),
          s.ornek ? el("p", { class: "sozluk-ornek", metin: "Örnek: " + s.ornek }) : null
        ]));
      });
    }

    secenekler.forEach(function (sec) {
      var b = el("button", { type: "button", class: "suzgec-dugme" + (sec.kod === seciliDers ? " aktif" : ""), metin: sec.ad });
      b.addEventListener("click", function () {
        seciliDers = sec.kod;
        Array.prototype.forEach.call(suzgecler.children, function (c) { c.classList.remove("aktif"); });
        b.classList.add("aktif");
        cizListe();
      });
      suzgecler.appendChild(b);
    });
    arama.addEventListener("input", cizListe);

    p.appendChild(el("div", { class: "arama-cubuk" }, [arama, suzgecler]));
    p.appendChild(sayacMetin);
    p.appendChild(listeAlan);
    cizListe();
    return p;
  }

  // ---------- ders sayfasi ----------
  function dersSayfasi(ders) {
    var veri = DERSLER[ders];
    if (!veri) return el("p", { metin: "Ders bulunamadı." });
    var s = sayac(ders);
    var p = el("div");

    p.appendChild(el("div", { class: "liste-bas" }, [
      el("div", {}, [
        el("h1", { metin: veri.ad }),
        el("p", { class: "kucuk", metin: s.toplam + " hafta · " + s.bitti + " tamamlandı" })
      ]),
      el("a", { class: "dugme ikincil", href: "#/", metin: "Ana sayfa" })
    ]));

    // Arama ve suzgec
    var arama = el("input", { type: "search", class: "arama-girdi", placeholder: "Hafta, konu, tema veya soru ara (ör. tolerans, hipotez, render)..." });
    var seciliSuzgec = "tumu";
    var suzgecler = el("div", { class: "suzgec-satir" });
    var suzgecListesi = [
      { kod: "tumu", ad: "Tümü" },
      { kod: "kalan", ad: "Tamamlanmayanlar" },
      { kod: "teslim", ad: ders === "oyg" ? "Modül teslimleri" : "Ara teslimler" },
      { kod: "d1", ad: "1. dönem" },
      { kod: "d2", ad: "2. dönem" }
    ];
    var listeAlan = el("div");
    var simdiki = buHafta(ders);

    function cizListe() {
      var q = trKucuk(arama.value.trim());
      listeAlan.innerHTML = "";
      var gosterilen = 0;

      [1, 2].forEach(function (donem) {
        if (seciliSuzgec === "d1" && donem !== 1) return;
        if (seciliSuzgec === "d2" && donem !== 2) return;
        var kayit = veri.kayitlar.filter(function (k) {
          if (k.donem !== donem) return false;
          if (k.tur === "tatil") return !q && seciliSuzgec === "tumu";
          if (seciliSuzgec === "kalan" && bittiMi(ders, k.no)) return false;
          if (seciliSuzgec === "teslim" && !teslimHaftasiMi(k)) return false;
          if (q) {
            var alan = trKucuk(k.no + " " + k.baslik + " " + k.ozet + " " + (k.soru || "") + " " + k.tema + " " + k.cikti + " " + k.tarih);
            return alan.indexOf(q) !== -1;
          }
          return true;
        });
        if (!kayit.length) return;
        listeAlan.appendChild(el("div", { class: "donem-bas", metin: donem === 1 ? "Birinci dönem" : "İkinci dönem" }));
        kayit.forEach(function (k) {
          if (k.tur === "tatil") {
            listeAlan.appendChild(el("div", { class: "tatil-satir", metin: k.tarih + " · " + k.baslik }));
            return;
          }
          gosterilen++;
          var bitti = bittiMi(ders, k.no);
          var meta = k.tarih + (k.cikti && k.cikti !== "-" ? " · " + k.cikti : "");
          var rozetler = el("div", { class: "satir-rozetler" });
          if (simdiki && simdiki.no === k.no) rozetler.appendChild(el("span", { class: "rozet kod", metin: "bu hafta" }));
          if (teslimHaftasiMi(k)) rozetler.appendChild(el("span", { class: "rozet teslim-rozet", metin: "teslim" }));
          if (!k.hazir) rozetler.appendChild(el("span", { class: "rozet taslak", metin: "taslak" }));
          if (bitti) rozetler.appendChild(el("span", { class: "rozet tamam", metin: "bitti" }));
          listeAlan.appendChild(el("a", { class: "hafta-satir" + (bitti ? " bitti" : ""), href: "#/" + ders + "/" + k.no }, [
            el("div", { class: "no", metin: String(k.no) }),
            el("div", { class: "orta" }, [
              el("div", { class: "ad", metin: k.baslik }),
              el("div", { class: "meta", metin: meta })
            ]),
            rozetler
          ]));
        });
      });

      if (!gosterilen) {
        listeAlan.appendChild(el("p", { class: "kucuk", style: "margin-top:16px", metin: "Bu süzgece uyan hafta bulunamadı." }));
      }
    }

    suzgecListesi.forEach(function (sec) {
      var b = el("button", { type: "button", class: "suzgec-dugme" + (sec.kod === seciliSuzgec ? " aktif" : ""), metin: sec.ad });
      b.addEventListener("click", function () {
        seciliSuzgec = sec.kod;
        Array.prototype.forEach.call(suzgecler.children, function (c) { c.classList.remove("aktif"); });
        b.classList.add("aktif");
        cizListe();
      });
      suzgecler.appendChild(b);
    });
    arama.addEventListener("input", cizListe);

    p.appendChild(el("div", { class: "arama-cubuk" }, [arama, suzgecler]));
    p.appendChild(listeAlan);
    cizListe();
    return p;
  }

  // ---------- hafta sayfasi bilesenleri ----------
  function buyut(alan) {
    alan.style.height = "auto";
    alan.style.height = Math.max(alan.scrollHeight, alan.dataset.enaz || 0) + "px";
  }

  function isaretliListe(maddeler, anahtarOnEk, sayacEl) {
    var ul = el("ol", { class: "isaretli-liste" });
    var kutular = [];
    function guncelle() {
      var b = 0;
      kutular.forEach(function (k) { if (k.checked) b++; });
      if (sayacEl) sayacEl.textContent = b + " / " + kutular.length + " adım";
    }
    maddeler.forEach(function (metin, i) {
      var anahtar = anahtarOnEk + i;
      var cb = el("input", { type: "checkbox" });
      cb.checked = depoAl(anahtar, "0") === "1";
      var li = el("li", { class: cb.checked ? "yapildi" : "" });
      cb.addEventListener("change", function () {
        depoYaz(anahtar, cb.checked ? "1" : "0");
        li.className = cb.checked ? "yapildi" : "";
        guncelle();
      });
      kutular.push(cb);
      li.appendChild(el("label", { class: "adim-satir" }, [cb, el("span", { metin: metin })]));
      ul.appendChild(li);
    });
    guncelle();
    return ul;
  }

  // Secenekleri her cizimde karistirir. Veri dosyasinda dogru secenek
  // cogunlukla ilk sirada oldugu icin, karistirmadan soru okunmadan
  // dogru cevap secilebiliyordu.
  function karistir(dizi) {
    var k = dizi.slice();
    for (var i = k.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = k[i]; k[i] = k[j]; k[j] = t;
    }
    return k;
  }

  function kendiniSinaKutusu(sorular) {
    var kutu = el("div", { class: "bolum sina-kutu" });
    var sifirlaDugme = el("button", { type: "button", class: "dugme ikincil kucuk-dugme", metin: "Seçimleri temizle" });
    kutu.appendChild(el("div", { class: "yaprak-bas" }, [
      el("div", {}, [
        el("h2", { metin: "Kendini sına" }),
        el("p", { class: "kucuk", metin: "Not verilmez, öğretmene gitmez. Yaprağa geçmeden önce temel ayrımı yakalayıp yakalamadığını anında gör." })
      ]),
      sifirlaDugme
    ]));

    var kartlar = [];
    sorular.forEach(function (s, qi) {
      var kart = el("div", { class: "sina-soru" });
      kart.appendChild(el("div", { class: "sina-soru-metin", metin: (qi + 1) + ". " + s.soru }));
      var secListe = el("div", { class: "sina-secenekler" });
      var geri = el("div", { class: "sina-geri" });
      var dugmeler = [];

      karistir(s.secenekler).forEach(function (sec) {
        var b = el("button", { type: "button", class: "sina-secenek", metin: sec.metin });
        b.addEventListener("click", function () {
          dugmeler.forEach(function (x) { x.classList.remove("secili-dogru", "secili-yanlis"); });
          b.classList.add(sec.dogru ? "secili-dogru" : "secili-yanlis");
          geri.className = "sina-geri " + (sec.dogru ? "dogru" : "yanlis");
          geri.textContent = sec.aciklama;
        });
        dugmeler.push(b);
        secListe.appendChild(b);
      });

      kart.appendChild(secListe);
      kart.appendChild(geri);
      kartlar.push({ dugmeler: dugmeler, geri: geri });
      kutu.appendChild(kart);
    });

    sifirlaDugme.addEventListener("click", function () {
      kartlar.forEach(function (k) {
        k.dugmeler.forEach(function (x) { x.classList.remove("secili-dogru", "secili-yanlis"); });
        k.geri.className = "sina-geri";
        k.geri.textContent = "";
      });
    });

    return kutu;
  }

  function tabloSoruAlani(soru, anahtar) {
    var sutunlar = soru.sutunlar || ["Madde", "Açıklama"];
    var satirSayisi = soru.satirlar || 4;
    var kayitli = [];
    try { kayitli = JSON.parse(depoAl(anahtar, "[]")) || []; } catch (e) { kayitli = []; }

    var tablo = el("table", { class: "yaprak-tablo" });
    var bas = el("tr");
    sutunlar.forEach(function (s) { bas.appendChild(el("th", { metin: s })); });
    tablo.appendChild(el("thead", {}, [bas]));

    var govde = el("tbody");
    var matris = [];

    function kaydet() {
      var veri = matris.map(function (satir) {
        return satir.map(function (inp) { return inp.value; });
      });
      depoYaz(anahtar, JSON.stringify(veri));
    }

    for (var r = 0; r < satirSayisi; r++) {
      var tr = el("tr");
      var satirGirdiler = [];
      for (var c = 0; c < sutunlar.length; c++) {
        var inp = el("input", { type: "text", class: "tablo-girdi", "aria-label": sutunlar[c] + " (satır " + (r + 1) + ")" });
        if (kayitli[r] && typeof kayitli[r][c] === "string") inp.value = kayitli[r][c];
        inp.addEventListener("input", kaydet);
        satirGirdiler.push(inp);
        tr.appendChild(el("td", {}, [inp]));
      }
      matris.push(satirGirdiler);
      govde.appendChild(tr);
    }
    tablo.appendChild(govde);

    return {
      eleman: el("div", { class: "tablo-sar" }, [tablo]),
      degerAl: function () {
        var satirlarMetin = [];
        matris.forEach(function (satir) {
          var hucreler = satir.map(function (inp) { return inp.value.trim(); });
          if (hucreler.some(Boolean)) satirlarMetin.push(hucreler.join(" | "));
        });
        if (!satirlarMetin.length) return "";
        return sutunlar.join(" | ") + "\n" + satirlarMetin.join("\n");
      }
    };
  }

  // ---------- hafta sayfasi ----------
  function haftaSayfasi(ders, no) {
    var veri = DERSLER[ders];
    var k = haftaBul(ders, no);
    if (!veri || !k) return el("p", { metin: "Hafta bulunamadı." });
    depoYaz("prdta.son.yol", ders + "/" + no);

    var p = el("div");
    var kip = calismaKipiAl();

    p.appendChild(el("div", { class: "yol" }, [
      el("a", { href: "#/", metin: "Ana sayfa" }),
      document.createTextNode(" · "),
      el("a", { href: "#/" + ders, metin: veri.ad })
    ]));

    var rozetler = el("div", {});
    rozetler.appendChild(el("span", { class: "rozet", metin: k.no + ". hafta · " + k.tarih }));
    if (k.tema && k.tema !== "-") rozetler.appendChild(el("span", { class: "rozet", metin: k.tema }));
    if (k.cikti && k.cikti !== "-") rozetler.appendChild(el("span", { class: "rozet kod", metin: k.cikti }));

    p.appendChild(el("div", { class: "hafta-bas" }, [rozetler, el("h1", { metin: k.baslik })]));
    var adSatir = el("div", { class: "ad-satir" });
    function adSatiriYaz() {
      var km = kimlikAl();
      adSatir.textContent =
        "Ad Soyad: " + (km.ad || "...........................................................") +
        "     Grup: " + (km.grup || "......................") +
        "     Tarih: ......................";
    }
    adSatiriYaz();
    p.appendChild(adSatir);

    // Calisma kipi secici (Dersteyim / Evde tek basima)
    if (k.hazir) {
      var kipCubuk = el("div", { class: "kip-cubuk" }, [
        el("span", { class: "kucuk", metin: "Çalışma kipi:" })
      ]);
      var kipSecenek = [
        { kod: "derste", ad: "Dersteyim" },
        { kod: "evde", ad: "Evde tek başıma" }
      ];
      kipSecenek.forEach(function (sec) {
        var b = el("button", { type: "button", class: "kip-dugme" + (kip === sec.kod ? " aktif" : ""), metin: sec.ad });
        b.addEventListener("click", function () {
          calismaKipiYaz(sec.kod);
          ciz();
        });
        kipCubuk.appendChild(b);
      });
      p.appendChild(kipCubuk);
    }

    if (k.soru) p.appendChild(el("div", { class: "soru", metin: k.soru }));

    if (k.onkosul) {
      p.appendChild(el("p", { class: "onkosul" }, [
        document.createTextNode("Bunu yapabilmek için bilmen gereken tek şey: "),
        el("a", { href: "#/" + ders + "/" + k.onkosul.hafta, metin: k.onkosul.hafta + ". hafta, " + k.onkosul.metin })
      ]));
    }

    if (!k.hazir) {
      p.appendChild(el("div", { class: "taslak-uyari" }, [
        el("strong", { metin: "Bu haftanın sayfası henüz hazırlanmadı." }),
        el("p", { metin: "Aşağıda yıllık plandaki kayıt yer alıyor." })
      ]));
      var t = el("table", { class: "plan-tablo" });
      [["Konu ve etkinlik", k.ozet], ["Yöntem ve teknikler", k.yontem],
       ["Araç ve gereçler", k.arac], ["Ölçme ve değerlendirme", k.olcme],
       ["Açıklamalar", k.aciklama]].forEach(function (satir) {
        if (!satir[1]) return;
        t.appendChild(el("tr", {}, [el("th", { metin: satir[0] }), el("td", { metin: satir[1] })]));
      });
      p.appendChild(t);
    } else {
      // Telafi bolumu yardimcisi
      function telafiKutusu() {
        if (!k.telafi || !k.telafi.length) return null;
        var tSayac = el("span", { class: "rozet tamam" });
        var tol = isaretliListe(k.telafi, "prdta." + ders + "." + no + ".t", tSayac);
        return el("div", { class: "telafi" }, [
          el("div", { class: "bolum-bas-satir" }, [el("h2", { metin: kip === "evde" ? "Evde tek başına adım adım" : "Kaçırdıysan" }), tSayac]),
          el("div", { class: "not", metin: "Yaklaşık yirmi dakika. Her adımı bitirdikçe kutusunu işaretleyebilirsin." }),
          tol
        ]);
      }

      // Ders bolumu yardimcisi
      function dersIkiliKutusu() {
        var ikili = el("div", { class: "ikili" });
        if (k.kazanim && k.kazanim.length) {
          var ul = el("ul", { class: "liste" });
          k.kazanim.forEach(function (x) { ul.appendChild(el("li", { metin: x })); });
          ikili.appendChild(el("div", { class: "bolum kazanim" }, [el("h2", { metin: "Bu hafta ne kazanıyorsun" }), ul]));
        }
        if (k.adimlar && k.adimlar.length) {
          var aSayac = el("span", { class: "rozet" });
          var ol = isaretliListe(k.adimlar, "prdta." + ders + "." + no + ".a", aSayac);
          ikili.appendChild(el("div", { class: "bolum derste" }, [
            el("div", { class: "bolum-bas-satir" }, [el("h2", { metin: "Derste ne yapıyoruz" }), aSayac]),
            ol
          ]));
        }
        return ikili.childNodes.length ? ikili : null;
      }

      // Gorsel sema + Inceleme materyali + Ornek-Karsi ornek
      function ogrenmeDestekleri() {
        var kap = el("div", { class: "ogrenme-destek" });
        if (k.gorsel && GORSELLER[k.gorsel]) {
          var g = GORSELLER[k.gorsel];
          kap.appendChild(el("figure", { class: "sema-kutu" }, [
            el("figcaption", { class: "sema-baslik", metin: g.baslik }),
            el("div", { class: "sema-svg", html: g.svg }),
            g.alt ? el("p", { class: "kucuk sema-not", metin: g.alt }) : null
          ]));
        }
        if (k.inceleme && k.inceleme.maddeler && k.inceleme.maddeler.length) {
          var iul = el("ul", { class: "liste" });
          k.inceleme.maddeler.forEach(function (m) { iul.appendChild(el("li", { metin: m })); });
          kap.appendChild(el("div", { class: "inceleme-kutu" }, [
            el("h3", { metin: k.inceleme.baslik || "İnceleme materyali" }),
            iul
          ]));
        }
        if (k.karsilastir) {
          var ks = k.karsilastir;
          kap.appendChild(el("div", { class: "karsilastir-kutu" }, [
            el("h3", { metin: ks.baslik || "Örnek karşılaştırması" }),
            el("div", { class: "karsilastir-ikili" }, [
              el("div", { class: "karsilastir-sol" }, [
                el("strong", { metin: ks.solBaslik || "Böyle değil" }),
                el("p", { metin: ks.sol })
              ]),
              el("div", { class: "karsilastir-sag" }, [
                el("strong", { metin: ks.sagBaslik || "Böyle" }),
                el("p", { metin: ks.sag })
              ])
            ])
          ]));
        }
        return kap.childNodes.length ? kap : null;
      }

      if (kip === "evde") {
        var tk = telafiKutusu();
        if (tk) p.appendChild(tk);
        var od = ogrenmeDestekleri();
        if (od) p.appendChild(od);
        var dk = dersIkiliKutusu();
        if (dk) {
          p.appendChild(el("details", { class: "ipucu ders-katla" }, [
            el("summary", { metin: "Kazanımları ve sınıf içi ders akışını göster" }),
            dk
          ]));
        }
      } else {
        var dk2 = dersIkiliKutusu();
        if (dk2) p.appendChild(dk2);
        var od2 = ogrenmeDestekleri();
        if (od2) p.appendChild(od2);
        var tk2 = telafiKutusu();
        if (tk2) p.appendChild(tk2);
      }

      // Etkilesimli yardimci arac
      if (k.yardimci && typeof ARACLAR[k.yardimci] === "function") {
        p.appendChild(ARACLAR[k.yardimci]());
      }

      // Kendini sina (not verilmeyen aninda geri bildirim)
      if (k.sina && k.sina.length) {
        p.appendChild(kendiniSinaKutusu(k.sina));
      }
    }

    // calisma yapragi
    if (k.yaprak && k.yaprak.length) {
      var yaprak = el("div", { class: "bolum yaprak" });
      yaprak.appendChild(el("div", { class: "yaprak-bas" }, [
        el("h2", { metin: "Çalışma yaprağı" }),
        el("button", { class: "dugme ikincil yazdir-dugme", type: "button", metin: "Yazdır veya PDF olarak kaydet" })
      ]));

      var km = kimlikAl();
      var adAlan = el("input", { type: "text", placeholder: "Ad Soyad" });
      var grupAlan = el("input", { type: "text", placeholder: "Grup" });
      adAlan.value = km.ad; grupAlan.value = km.grup;
      adAlan.addEventListener("input", function () { depoYaz("prdta.ogrenci.ad", adAlan.value); adSatiriYaz(); });
      grupAlan.addEventListener("input", function () { depoYaz("prdta.ogrenci.grup", grupAlan.value); adSatiriYaz(); });
      yaprak.appendChild(el("div", { class: "kimlik" }, [adAlan, grupAlan]));

      var alanlar = [];
      k.yaprak.forEach(function (soru, i) {
        var anahtar = "prdta." + ders + "." + no + ".c" + i;
        if (soru.tip === "tablo") {
          var tb = tabloSoruAlani(soru, anahtar);
          alanlar.push({ soru: soru.soru, degerAl: tb.degerAl });
          yaprak.appendChild(el("div", { class: "soru-blok" }, [
            el("label", { metin: (i + 1) + ". " + soru.soru }),
            tb.eleman
          ]));
        } else {
          var alan = el("textarea", { rows: soru.tip === "kisa" ? "2" : "4" });
          alan.dataset.enaz = soru.tip === "kisa" ? 44 : 86;
          alan.value = depoAl(anahtar, "");
          alan.addEventListener("input", function () { depoYaz(anahtar, alan.value); buyut(alan); });
          alanlar.push({ soru: soru.soru, degerAl: function () { return alan.value; } });
          yaprak.appendChild(el("div", { class: "soru-blok" }, [
            el("label", { metin: (i + 1) + ". " + soru.soru }), alan
          ]));
          setTimeout(function () { buyut(alan); }, 0);
        }
      });

      yaprak.appendChild(el("p", { class: "kayit-notu", metin: "Yazdıkların bu tarayıcıda kendiliğinden saklanır. Başka bilgisayara taşımak için ana sayfadan yedek alabilirsin." }));

      // gonderim
      var durum = el("div", { class: "gonderim-durum" });
      var gonderDugme = el("button", { class: "dugme gonder-dugme", type: "button", metin: "Öğretmene gönder" });
      var kuyrukta = kuyrukAl().some(function (x) { return x.ders === ders && x.hafta === no; });
      var gonderilmis = depoAl("prdta." + ders + "." + no + ".gonderim", "");

      function durumYaz(tip, metin) {
        durum.className = "gonderim-durum " + tip;
        durum.textContent = metin;
      }
      if (gonderilmis) durumYaz("tamam", "Gönderildi · " + gonderilmis);
      else if (kuyrukta) durumYaz("bekliyor", "Gönderilmeyi bekliyor. İnternete bağlandığında kendiliğinden gönderilecek.");
      else if (!AYAR.gonderimAdresi) durumYaz("", "Gönderim henüz kurulmadı. Yaprağı yazdırabilir ya da PDF olarak kaydedebilirsin.");

      gonderDugme.addEventListener("click", function () {
        if (!adAlan.value.trim()) { durumYaz("hata", "Önce adını yaz."); adAlan.focus(); return; }
        var yuk = {
          anahtar: AYAR.sinifAnahtari || "",
          ad: adAlan.value.trim(),
          grup: grupAlan.value.trim(),
          ders: ders,
          dersAd: veri.ad,
          hafta: no,
          haftaBaslik: k.baslik,
          zaman: zamanMetni(new Date()),
          cevaplar: alanlar.map(function (x) { return { soru: x.soru, cevap: x.degerAl() }; })
        };
        gonderDugme.disabled = true;
        durumYaz("bekliyor", "Gönderiliyor...");
        gonder(yuk, function (basarili, mesaj) {
          gonderDugme.disabled = false;
          if (basarili) {
            depoYaz("prdta." + ders + "." + no + ".gonderim", yuk.zaman);
            kuyruktanCikar(yuk);
            durumYaz("tamam", "Gönderildi · " + yuk.zaman);
          } else {
            kuyrugaEkle(yuk);
            durumYaz("bekliyor", (mesaj ? mesaj + " " : "") + "Cevapların kaydedildi, internete bağlandığında kendiliğinden gönderilecek.");
          }
        });
      });

      if (AYAR.gonderimAdresi) {
        yaprak.appendChild(el("div", { class: "gonder-satir" }, [gonderDugme]));
      }
      yaprak.appendChild(durum);
      yaprak.querySelector(".yazdir-dugme").addEventListener("click", function () { window.print(); });
      p.appendChild(yaprak);
    }

    // Teslim oncesi oz-denetim (rubrik kontrol listesi)
    if (k.ozdenetim && k.ozdenetim.length) {
      var ozSayac = el("span", { class: "rozet tamam" });
      var ozListe = isaretliListe(k.ozdenetim, "prdta." + ders + "." + no + ".oz", ozSayac);
      p.appendChild(el("div", { class: "ozdenetim-kutu" }, [
        el("div", { class: "bolum-bas-satir" }, [
          el("h3", { metin: "Teslim öncesi öz-denetim" }),
          ozSayac
        ]),
        el("p", { class: "kucuk", metin: "Çalışmanı teslim etmeden önce her ölçütü kendi işin üzerinde kontrol edip işaretle." }),
        ozListe
      ]));
    }

    if (k.teslim) {
      p.appendChild(el("div", { class: "teslim" }, [
        el("strong", { metin: "Teslim ölçütü" }), el("div", { metin: k.teslim })
      ]));
    }

    // Bu haftanin sozluk kavramlari
    var ilgiliTerimler = SOZLUK.filter(function (s) {
      return s.hafta === no && (s.ders === ders || s.ders === "ortak");
    });
    if (ilgiliTerimler.length) {
      var terimSatir = el("div", { class: "ilgili-kavramlar" }, [
        el("span", { class: "kucuk", metin: "Bu haftanın kavramları:" })
      ]);
      ilgiliTerimler.forEach(function (s) {
        terimSatir.appendChild(el("a", {
          class: "rozet bag-rozet",
          href: "#/sozluk/" + encodeURIComponent(s.terim),
          title: s.tanim,
          metin: s.terim
        }));
      });
      p.appendChild(terimSatir);
    }

    if (k.tikanma && k.tikanma.length) {
      var iul = el("ul");
      k.tikanma.forEach(function (x) { iul.appendChild(el("li", { metin: x })); });
      var d = el("details", { class: "ipucu" }, [el("summary", { metin: "Tıkandıysan" }), iul]);
      p.appendChild(d);
    }

    // ayak
    var hs = haftalar(ders);
    var sira = hs.map(function (x) { return x.no; }).indexOf(no);
    var onceki = sira > 0 ? hs[sira - 1] : null;
    var sonraki = sira >= 0 && sira < hs.length - 1 ? hs[sira + 1] : null;

    var kutu = el("input", { type: "checkbox", id: "tamam" });
    kutu.checked = bittiMi(ders, no);
    kutu.addEventListener("change", function () { bittiYaz(ders, no, kutu.checked); });

    p.appendChild(el("div", { class: "ayak" }, [
      el("label", { class: "tamam-kutu", for: "tamam" }, [kutu, document.createTextNode("Bu haftayı tamamladım")]),
      el("div", {}, [
        onceki ? el("a", { class: "dugme ikincil", href: "#/" + ders + "/" + onceki.no, metin: "← " + onceki.no + ". hafta" }) : null,
        document.createTextNode(" "),
        sonraki ? el("a", { class: "dugme", href: "#/" + ders + "/" + sonraki.no, metin: sonraki.no + ". hafta →" }) : null
      ])
    ]));

    return p;
  }

  // ---------- yonlendirme ----------
  function ustNavGuncelle(yol) {
    var aktif = yol[0] || "";
    var baglar = document.querySelectorAll(".ust-bag a");
    Array.prototype.forEach.call(baglar, function (a) {
      if (a.getAttribute("data-yol") === aktif) a.classList.add("aktif");
      else a.classList.remove("aktif");
    });
  }

  function ciz() {
    var yol = (location.hash || "#/").replace(/^#\/?/, "").split("/").filter(Boolean);
    ustNavGuncelle(yol);
    var sayfa;
    if (!yol.length) sayfa = giris();
    else if (yol[0] === "sozluk") sayfa = sozlukSayfasi(yol[1] ? decodeURIComponent(yol[1]) : "");
    else if (yol.length === 1) sayfa = dersSayfasi(yol[0]);
    else sayfa = haftaSayfasi(yol[0], parseInt(yol[1], 10));
    icerik.innerHTML = "";
    icerik.appendChild(sayfa);
    window.scrollTo(0, 0);
  }

  window.addEventListener("hashchange", ciz);
  window.addEventListener("online", function () { setTimeout(kuyrukDene, 800); });
  ciz();
  setTimeout(kuyrukDene, 1200);
})();
