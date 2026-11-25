(function () {
  "use strict";

  var DERSLER = window.DERSLER || {};
  var AYAR = window.AYAR || {};
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

  function sayac(ders) {
    var h = haftalar(ders), n = 0;
    h.forEach(function (x) { if (bittiMi(ders, x.no)) n++; });
    return { bitti: n, toplam: h.length };
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

  // Once yaniti okunabilen bir istek denenir; engellenirse yanit okunmadan
  // gonderilir. Ag hatasi olursa gonderim basarisiz sayilir ve kuyruga alinir.
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
        // Yanit okunamadi. Istek yine de gidebilir; yanitsiz olarak deneyelim.
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
    var ayAd = (m[2] || "").toLowerCase();
    if (!ayAd) {
      var m2 = sag.match(/([^\d\s]+)\s*$/);
      ayAd = m2 ? m2[1].toLowerCase() : "";
    }
    var ay = AYLAR[ayAd];
    if (ay === undefined) return null;
    var yil = ay >= 8 ? 2026 : 2027; // Eylul-Aralik 2026, Ocak-Haziran 2027
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
        metin: "Her haftanın kendi sayfası var. Sayfada o haftanın sorusu, derste izlediğimiz adımlar, " +
          "gelemeyenler için kısa bir telafi yolu ve doldurulacak çalışma yaprağı bulunuyor. " +
          "Bir oturumu kaçırdıysan o haftanın sayfasını açıp kendi başına yetişebilirsin."
      })
    ]));

    var kartlar = el("div", { class: "ders-kart-liste" });
    ["oyg", "puy"].forEach(function (ders) {
      if (!DERSLER[ders]) return;
      var s = sayac(ders);
      var oran = s.toplam ? Math.round((s.bitti / s.toplam) * 100) : 0;
      var cubuk = el("div", { class: "cubuk" }, [el("span")]);
      cubuk.firstChild.style.width = oran + "%";
      kartlar.appendChild(el("a", { class: "ders-kart", href: "#/" + ders }, [
        el("h2", { metin: DERSLER[ders].ad }),
        el("div", { class: "ilerleme-metin", metin: s.toplam + " hafta · " + s.bitti + " tanesini tamamladın" }),
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
      el("h3", { metin: "Derse gelemedim, nereden devam edeceğim?" }),
      el("ol", {}, [
        el("li", { metin: "Dersini seç ve kaçırdığın haftayı listeden bul." }),
        el("li", { metin: "O haftanın sayfasındaki \"Kaçırdıysan\" bölümünü sırayla uygula. Yaklaşık yirmi dakika sürer." }),
        el("li", { metin: "Çalışma yaprağını doldur, yazdır ya da PDF olarak kaydedip bana getir." }),
        el("li", { metin: "Haftayı tamamladım kutusunu işaretle; böylece listede nerede kaldığını görürsün." })
      ])
    ]));

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

    var simdiki = buHafta(ders);
    [1, 2].forEach(function (donem) {
      var kayit = veri.kayitlar.filter(function (k) { return k.donem === donem; });
      if (!kayit.length) return;
      p.appendChild(el("div", { class: "donem-bas", metin: donem === 1 ? "Birinci dönem" : "İkinci dönem" }));
      kayit.forEach(function (k) {
        if (k.tur === "tatil") {
          p.appendChild(el("div", { class: "tatil-satir", metin: k.tarih + " · " + k.baslik }));
          return;
        }
        var bitti = bittiMi(ders, k.no);
        var meta = k.tarih + (k.cikti && k.cikti !== "-" ? " · " + k.cikti : "");
        var rozetler = el("div", {});
        if (simdiki && simdiki.no === k.no) rozetler.appendChild(el("span", { class: "rozet kod", metin: "bu hafta" }));
        if (!k.hazir) rozetler.appendChild(el("span", { class: "rozet taslak", metin: "taslak" }));
        if (bitti) rozetler.appendChild(el("span", { class: "rozet tamam", metin: "bitti" }));
        p.appendChild(el("a", { class: "hafta-satir" + (bitti ? " bitti" : ""), href: "#/" + ders + "/" + k.no }, [
          el("div", { class: "no", metin: String(k.no) }),
          el("div", { class: "orta" }, [
            el("div", { class: "ad", metin: k.baslik }),
            el("div", { class: "meta", metin: meta })
          ]),
          rozetler
        ]));
      });
    });
    return p;
  }

  // ---------- hafta sayfasi ----------
  function buyut(alan) {
    alan.style.height = "auto";
    alan.style.height = Math.max(alan.scrollHeight, alan.dataset.enaz || 0) + "px";
  }

  function haftaSayfasi(ders, no) {
    var veri = DERSLER[ders];
    var k = haftaBul(ders, no);
    if (!veri || !k) return el("p", { metin: "Hafta bulunamadı." });
    var p = el("div");

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
        el("p", { metin: "Aşağıda yıllık plandaki kayıt yer alıyor. Sayfa hazırlandığında burada haftanın sorusu, telafi yolu ve çalışma yaprağı bulunacak." })
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
      var ikili = el("div", { class: "ikili" });
      if (k.kazanim && k.kazanim.length) {
        var ul = el("ul", { class: "liste" });
        k.kazanim.forEach(function (x) { ul.appendChild(el("li", { metin: x })); });
        ikili.appendChild(el("div", { class: "bolum kazanim" }, [el("h2", { metin: "Bu hafta ne kazanıyorsun" }), ul]));
      }
      if (k.adimlar && k.adimlar.length) {
        var ol = el("ol", { class: "liste" });
        k.adimlar.forEach(function (x) { ol.appendChild(el("li", { metin: x })); });
        ikili.appendChild(el("div", { class: "bolum derste" }, [el("h2", { metin: "Derste ne yapıyoruz" }), ol]));
      }
      if (ikili.childNodes.length) p.appendChild(ikili);

      if (k.telafi && k.telafi.length) {
        var tol = el("ol");
        k.telafi.forEach(function (x) { tol.appendChild(el("li", { metin: x })); });
        p.appendChild(el("div", { class: "telafi" }, [
          el("h2", { metin: "Kaçırdıysan" }),
          el("div", { class: "not", metin: "Yaklaşık yirmi dakika. Bu adımları kendi başına uygulayabilirsin." }),
          tol
        ]));
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
        var alan = el("textarea", { rows: soru.tip === "kisa" ? "2" : "4" });
        alan.dataset.enaz = soru.tip === "kisa" ? 44 : 86;
        alan.value = depoAl(anahtar, "");
        alan.addEventListener("input", function () { depoYaz(anahtar, alan.value); buyut(alan); });
        alanlar.push({ soru: soru.soru, alan: alan });
        yaprak.appendChild(el("div", { class: "soru-blok" }, [
          el("label", { metin: (i + 1) + ". " + soru.soru }), alan
        ]));
        setTimeout(function () { buyut(alan); }, 0);
      });

      yaprak.appendChild(el("p", { class: "kayit-notu", metin: "Yazdıkların bu tarayıcıda kendiliğinden saklanır. Başka bir bilgisayarda açarsan görünmez." }));

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
          cevaplar: alanlar.map(function (x) { return { soru: x.soru, cevap: x.alan.value }; })
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

    if (k.teslim) {
      p.appendChild(el("div", { class: "teslim" }, [
        el("strong", { metin: "Teslim ölçütü" }), el("div", { metin: k.teslim })
      ]));
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
  function ciz() {
    var yol = (location.hash || "#/").replace(/^#\/?/, "").split("/").filter(Boolean);
    var sayfa;
    if (!yol.length) sayfa = giris();
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
