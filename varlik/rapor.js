// Etkilesimli TUBITAK Proje Raporu yazma, taslak kaydetme, Word/PDF disari aktarma
// ve ogretmene gonderme modulu. Tamamen cevrimdisi calisir.
window.RAPOR = (function () {
  "use strict";

  var AYLAR = ["NİSAN", "MAYIS", "HAZİRAN", "TEMMUZ", "AĞUSTOS", "EYLÜL", "EKİM", "KASIM", "ARALIK", "OCAK"];
  var VARSAYILAN_ISLER = [
    "Literatür Taraması",
    "Arazi Çalışması",
    "Verilerin Toplanması ve Analizi",
    "Proje Raporu Yazımı"
  ];
  var ANA_ALANLAR = [
    "Biyoloji", "Coğrafya", "Değerler Eğitimi", "Fizik", "Kimya", "Matematik",
    "Psikoloji", "Sosyoloji", "Tarih", "Teknolojik Tasarım", "Türk Dili ve Edebiyatı", "Yazılım"
  ];

  var BOLUMLER = [
    {
      id: "ozet", baslik: "Özet", satir: 7, minKelime: 150, maxKelime: 250,
      ipucu: "Özetin tamamı 150–250 kelime arasında olmalıdır. Çalışmanın ayrıntılarından, yorumlardan ve kaynaklardan bahsedilmez. Amaç, kullanılan yöntem, gözlemler, temel bulgular ve sonuçlardan birkaç cümle ile bahsedilir. Başlarken taslak oluşturup çalışma bitince güncelleyebilirsin."
    },
    {
      id: "amac", baslik: "Amaç", satir: 6,
      ipucu: "Doğrudan projenin amacına, somut hedeflerine ve Ar-Ge içeriğine odaklan. Çözülmesi gereken problemi, hangi eksikliği nasıl gidereceğini veya hangi soruna çözüm getireceğini açıkla. Değerlendirmeye katkı sağlamayacak genel konu ve tarihçe anlatımlarından kaçın."
    },
    {
      id: "giris", baslik: "Giriş", satir: 8,
      ipucu: "Araştırma konusu hakkında yapılmış önceki araştırmaların sonuçlarının ve bu alanda cevapsız kalmış soruların bilimsel makalelere dayandırılarak anlatıldığı (kaynak taraması) bölümdür."
    },
    {
      id: "yontem", baslik: "Yöntem", satir: 8,
      ipucu: "Araştırma yönteminin, veri toplama araçlarının, deney ve gözlem düzeneklerinin ve verilerin analiz yönteminin ayrıntılı olarak verildiği bölümdür."
    },
    {
      id: "bulgular", baslik: "Bulgular", satir: 8,
      ipucu: "Çalışmada toplanan veriler ve verilere ait analiz sonuçları nesnel biçimde bu bölümde verilir."
    },
    {
      id: "sonuc", baslik: "Sonuç ve Tartışma", satir: 8,
      ipucu: "Proje çalışması ile elde edilen bulgular araştırma sorusuna veya problemine uygun olarak yorumlanır ve önceki çalışmalarla karşılaştırılır."
    },
    {
      id: "oneriler", baslik: "Öneriler", satir: 5,
      ipucu: "Benzer çalışmalar yapacak olanlara, uygulayıcılara veya karar vericilere yol göstermesi bakımından bulgulara dayalı önerilerini yaz."
    },
    {
      id: "kaynaklar", baslik: "Kaynaklar", satir: 6,
      ipucu: "Proje sürecinde yararlanılan ve rapor içinde atıf yapılan tüm kaynakları APA yazım kurallarına göre (her satıra bir kaynak olacak biçimde) listele."
    },
    {
      id: "ekler", baslik: "Ekler", satir: 5,
      ipucu: "Uzun tablolar, formüller, anketler, yasal izinler ve yazışmalar metindeki geçiş sırasına göre 'Ek 1., Ek 2...' biçiminde ayrı sayfadan başlayarak verilir. Rapor 20 sayfa sınırını aşıyorsa ekler başvuru sisteminde EK BELGELER kısmına yüklenir ve burada liste hâlinde belirtilir."
    }
  ];

  function kelimeSay(metin) {
    var t = String(metin || "").trim();
    if (!t) return 0;
    return t.split(/\s+/).filter(Boolean).length;
  }

  function anahtarSay(metin) {
    var t = String(metin || "").trim();
    if (!t) return [];
    return t.split(/[,;]+/).map(function (x) { return x.trim(); }).filter(Boolean);
  }

  function htmlKacis(s) {
    return String(s || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function paragraflarHtml(metin) {
    var t = String(metin || "").trim();
    if (!t) return "<p>(Boş bırakılmış)</p>";
    return t.split(/\n+/).map(function (sat) {
      return "<p>" + htmlKacis(sat.trim()) + "</p>";
    }).join("");
  }

  function saatMetni(d) {
    function iki(n) { return (n < 10 ? "0" : "") + n; }
    return iki(d.getHours()) + ":" + iki(d.getMinutes()) + ":" + iki(d.getSeconds());
  }

  function varsayilanVeri() {
    return {
      takim: "",
      anaAlan: "",
      tematikAlan: "",
      baslik: "",
      uyzKullandi: false,
      uyzAraclar: "",
      uyzAmac: "",
      uyzKapsam: "",
      uyzMudahale: "",
      ozet: "",
      anahtar: "",
      amac: "",
      giris: "",
      yontem: "",
      cizelge: VARSAYILAN_ISLER.map(function (ad) {
        return { ad: ad, aylar: AYLAR.map(function () { return false; }) };
      }),
      bulgular: "",
      sonuc: "",
      oneriler: "",
      kaynaklar: "",
      ekler: "",
      ekBelgelerVar: false
    };
  }

  function veriOku(depoAl) {
    var v = varsayilanVeri();
    try {
      var ham = depoAl("prdta.rapor.veri", "");
      if (ham) {
        var o = JSON.parse(ham);
        if (o && typeof o === "object") {
          for (var k in v) {
            if (o[k] !== undefined) v[k] = o[k];
          }
          if (!Array.isArray(v.cizelge) || !v.cizelge.length) {
            v.cizelge = varsayilanVeri().cizelge;
          }
        }
      }
    } catch (e) { /* varsayilan */ }
    return v;
  }

  function taslakVarMi(depoAl) {
    var v = veriOku(depoAl);
    var alanlar = [v.baslik, v.ozet, v.amac, v.giris, v.yontem, v.bulgular, v.sonuc, v.oneriler, v.kaynaklar, v.ekler];
    return alanlar.some(function (x) { return String(x || "").trim().length > 0; });
  }

  function cizelgeMetin(cizelge) {
    var satirlar = [];
    (cizelge || []).forEach(function (sat) {
      var seciliAylar = [];
      (sat.aylar || []).forEach(function (d, i) { if (d && AYLAR[i]) seciliAylar.push(AYLAR[i]); });
      if ((sat.ad && sat.ad.trim()) || seciliAylar.length) {
        satirlar.push("- " + (sat.ad || "(İsimsiz iş)") + ": " + (seciliAylar.length ? seciliAylar.join(", ") : "(ay seçilmedi)"));
      }
    });
    return satirlar.join("\n");
  }

  function raporHtmlOlustur(v, kimlik) {
    var cizHtml = '<table class="rapor-baski-tablo"><thead><tr><th rowspan="2">İşin Adı</th><th colspan="' + AYLAR.length + '">AYLAR</th></tr><tr>' +
      AYLAR.map(function (a) { return "<th>" + a + "</th>"; }).join("") + "</tr></thead><tbody>" +
      (v.cizelge || []).map(function (sat) {
        return "<tr><td class=\"is-adi\">" + htmlKacis(sat.ad || "") + "</td>" +
          AYLAR.map(function (_, i) {
            return '<td class="ay-hucre' + (sat.aylar && sat.aylar[i] ? " dolu" : "") + '">' +
              (sat.aylar && sat.aylar[i] ? "■" : "") + "</td>";
          }).join("") + "</tr>";
      }).join("") + "</tbody></table>";

    var uyzHtml = v.uyzKullandi
      ? "<p><strong>Kullanılan araçlar:</strong> " + htmlKacis(v.uyzAraclar || "-") + "</p>" +
        "<p><strong>Kullanım amacı:</strong> " + htmlKacis(v.uyzAmac || "-") + "</p>" +
        "<p><strong>Kullanım kapsamı:</strong> " + htmlKacis(v.uyzKapsam || "-") + "</p>" +
        "<p><strong>İnsan müdahalesi:</strong> " + htmlKacis(v.uyzMudahale || "-") + "</p>"
      : "<p>Bu proje kapsamında Üretken Yapay Zekâ (ÜYZ) aracı kullanılmamıştır.</p>";

    var ekNot = v.ekBelgelerVar
      ? "<p><em>Not: 20 sayfa sınırına sığmayan belgeler başvuru sisteminde EK BELGELER bölümüne yüklenmiştir.</em></p>"
      : "";

    var ogrenciSatir = kimlik.ad
      ? "<p><strong>Öğrenci(ler):</strong> " + htmlKacis(kimlik.ad + (v.takim ? ", " + v.takim : "")) +
        (kimlik.grup ? " &nbsp;·&nbsp; <strong>Grup:</strong> " + htmlKacis(kimlik.grup) : "") + "</p>"
      : "";

    return (
      '<div class="tubitak-belge">' +
      '<div class="tubitak-kunye">' +
      "<p><strong>Proje Ana Alanı:</strong> " + htmlKacis(v.anaAlan || "-") + "</p>" +
      "<p><strong>Proje Tematik Alanı:</strong> " + htmlKacis(v.tematikAlan || "-") + "</p>" +
      "<p><strong>Proje Adı (Başlığı):</strong> " + htmlKacis(v.baslik || "-") + "</p>" +
      ogrenciSatir +
      "</div>" +
      "<h2>Yapay Zekâ Araçları Kullanım Beyanı</h2>" + uyzHtml +
      "<h2>Özet</h2>" + paragraflarHtml(v.ozet) +
      "<p><strong>Anahtar Kelimeler:</strong> " + htmlKacis(v.anahtar || "-") + "</p>" +
      "<h2>Amaç</h2>" + paragraflarHtml(v.amac) +
      "<h2>Giriş</h2>" + paragraflarHtml(v.giris) +
      "<h2>Yöntem</h2>" + paragraflarHtml(v.yontem) +
      "<h2>Proje İş-Zaman Çizelgesi</h2>" + cizHtml +
      "<h2>Bulgular</h2>" + paragraflarHtml(v.bulgular) +
      "<h2>Sonuç ve Tartışma</h2>" + paragraflarHtml(v.sonuc) +
      "<h2>Öneriler</h2>" + paragraflarHtml(v.oneriler) +
      "<h2>Kaynaklar</h2>" + paragraflarHtml(v.kaynaklar) +
      '<div class="ekler-sayfa"><h2>Ekler</h2>' + paragraflarHtml(v.ekler) + ekNot + "</div>" +
      "</div>"
    );
  }

  function wordIndir(v, kimlik) {
    var icerikHtml = raporHtmlOlustur(v, kimlik);
    var docHtml =
      '<!doctype html><html xmlns:o="urn:schemas-microsoft-com:office:office" ' +
      'xmlns:w="urn:schemas-microsoft-com:office:word" lang="tr"><head><meta charset="utf-8">' +
      "<title>" + htmlKacis(v.baslik || "Proje Raporu") + "</title>" +
      "<style>" +
      "@page Section1{size:21cm 29.7cm;margin:2.5cm 2.5cm 2.5cm 2.5cm;}" +
      "div.Section1{page:Section1;}" +
      "body{font-family:'Times New Roman',Times,serif;font-size:12pt;line-height:1.15;color:#000;}" +
      "p{text-align:justify;margin:0 0 6pt 0;}" +
      "h2{font-family:'Times New Roman',Times,serif;font-size:12pt;font-weight:bold;margin:12pt 0 6pt 0;text-align:left;}" +
      ".tubitak-kunye p{text-align:left;margin:0 0 4pt 0;}" +
      ".rapor-baski-tablo{width:100%;border-collapse:collapse;margin:8pt 0;font-size:9pt;}" +
      ".rapor-baski-tablo th,.rapor-baski-tablo td{border:1px solid #000;padding:3pt 4pt;text-align:center;}" +
      ".rapor-baski-tablo td.is-adi{text-align:left;font-size:10pt;}" +
      ".rapor-baski-tablo td.dolu{background:#d8d0c6;font-weight:bold;}" +
      ".ekler-sayfa{page-break-before:always;}" +
      "</style></head><body><div class=\"Section1\">" + icerikHtml + "</div></body></html>";

    var blob = new Blob(["\ufeff", docHtml], { type: "application/msword;charset=utf-8" });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    var dosyaAd = (v.baslik || kimlik.ad || "proje_raporu").trim().slice(0, 40).replace(/[^\wçğıöşüÇĞİÖŞÜ-]+/g, "_");
    a.href = url;
    a.download = dosyaAd + ".doc";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
  }

  function sayfa(ctx) {
    var el = ctx.el;
    var depoAl = ctx.depoAl;
    var depoYaz = ctx.depoYaz;
    var kimlikAl = ctx.kimlikAl;
    var zamanMetni = ctx.zamanMetni;
    var gonder = ctx.gonder;
    var kuyrukAl = ctx.kuyrukAl;
    var kuyrugaEkle = ctx.kuyrugaEkle;
    var kuyruktanCikar = ctx.kuyruktanCikar;
    var AYAR = ctx.AYAR || {};

    var v = veriOku(depoAl);
    var p = el("div", { class: "rapor-sayfa" });

    // Yazdirma icin temiz TUBITAK onizleme katmani (ekranda gizli, @media print'te gorunur)
    var baskiKatmani = el("div", { class: "rapor-baski-alani" });

    var kayitDurum = el("span", { class: "rozet tamam", metin: "Otomatik kaydedilir" });
    var ilerlemeRozet = el("span", { class: "rozet" });
    var bolumDurumRozetler = {};

    function buyut(alan) {
      alan.style.height = "auto";
      alan.style.height = Math.max(alan.scrollHeight, parseInt(alan.dataset.enaz || "90", 10)) + "px";
    }

    function ozetIlerlemeHesapla() {
      var doluSay = 0;
      var toplam = 11; // kunye + 9 metin bolumu + cizelge
      var kunyeOk = !!(v.anaAlan.trim() && v.baslik.trim());
      if (kunyeOk) doluSay++;
      var cizOk = (v.cizelge || []).some(function (s) { return (s.aylar || []).some(Boolean); });
      if (cizOk) doluSay++;
      BOLUMLER.forEach(function (b) {
        var ok = String(v[b.id] || "").trim().length > 0;
        if (ok) doluSay++;
        if (bolumDurumRozetler[b.id]) {
          bolumDurumRozetler[b.id].className = "rapor-icindekiler-bag" + (ok ? " dolu" : "");
        }
      });
      if (bolumDurumRozetler.kunye) bolumDurumRozetler.kunye.className = "rapor-icindekiler-bag" + (kunyeOk ? " dolu" : "");
      if (bolumDurumRozetler.cizelge) bolumDurumRozetler.cizelge.className = "rapor-icindekiler-bag" + (cizOk ? " dolu" : "");
      ilerlemeRozet.textContent = doluSay + " / " + toplam + " bölüm dolduruldu";
      ilerlemeRozet.className = doluSay >= 9 ? "rozet tamam" : "rozet";
    }

    function kaydet() {
      depoYaz("prdta.rapor.veri", JSON.stringify(v));
      depoYaz("prdta.rapor.sonKayit", zamanMetni(new Date()));
      kayitDurum.textContent = "Kaydedildi · " + saatMetni(new Date());
      ozetIlerlemeHesapla();
      baskiKatmani.innerHTML = raporHtmlOlustur(v, kimlikAl());
    }

    // Ust baslik ve hizli islemler
    var ust = el("div", { class: "rapor-ekran" });
    ust.appendChild(el("div", { class: "liste-bas" }, [
      el("div", {}, [
        el("h1", { metin: "Proje Raporu Çalışma Alanı" }),
        el("p", { class: "kucuk", metin: "TÜBİTAK rapor şablonuna uyumlu etkileşimli yazım alanı. Yazdıkların anlık kaydedilir; istediğin zaman kaldığın yerden devam edebilirsin." })
      ]),
      el("a", { class: "dugme ikincil", href: "#/", metin: "Ana sayfa" })
    ]));

    // Durum + yedek/aktarim cubugu
    var taslakDurum = el("div", { class: "kucuk rapor-islem-durum" });
    var taslakYukleInput = el("input", { type: "file", accept: ".json,application/json", style: "display:none" });
    taslakYukleInput.addEventListener("change", function () {
      var dosya = taslakYukleInput.files && taslakYukleInput.files[0];
      if (!dosya) return;
      var r = new FileReader();
      r.onload = function () {
        try {
          var paket = JSON.parse(r.result);
          var gelen = paket && paket.rapor ? paket.rapor : paket;
          if (!gelen || typeof gelen !== "object" || gelen.baslik === undefined) throw new Error("Geçersiz");
          depoYaz("prdta.rapor.veri", JSON.stringify(gelen));
          if (paket.ogrenci && paket.ogrenci.ad) depoYaz("prdta.ogrenci.ad", paket.ogrenci.ad);
          if (paket.ogrenci && paket.ogrenci.grup) depoYaz("prdta.ogrenci.grup", paket.ogrenci.grup);
          taslakDurum.textContent = "Taslak başarıyla yüklendi, sayfa yenileniyor...";
          setTimeout(function () { ctx.yenile(); }, 350);
        } catch (e) {
          taslakDurum.textContent = "Dosya okunamadı. Lütfen bu sayfadan indirdiğin proje taslağı (.json) dosyasını seç.";
        }
      };
      r.readAsText(dosya, "utf-8");
      taslakYukleInput.value = "";
    });

    var jsonIndirBtn = el("button", { type: "button", class: "dugme ikincil kucuk-dugme", metin: "Taslağı kaydet (.json)" });
    var jsonYukleBtn = el("button", { type: "button", class: "dugme ikincil kucuk-dugme", metin: "Taslak yükle" });
    var wordBtn = el("button", { type: "button", class: "dugme ikincil kucuk-dugme", metin: "Word (.doc) indir" });
    var yazdirBtn = el("button", { type: "button", class: "dugme kucuk-dugme", metin: "TÜBİTAK biçiminde Yazdır / PDF" });

    jsonIndirBtn.addEventListener("click", function () {
      var paket = {
        uygulama: "piri-reis-rapor",
        tarih: zamanMetni(new Date()),
        ogrenci: kimlikAl(),
        rapor: v
      };
      var blob = new Blob([JSON.stringify(paket, null, 2)], { type: "application/json;charset=utf-8" });
      var url = URL.createObjectURL(blob);
      var a = document.createElement("a");
      var ad = (kimlikAl().ad || "taslak").replace(/[^\wçğıöşüÇĞİÖŞÜ-]+/g, "_");
      a.href = url;
      a.download = "proje_raporu_" + ad + ".json";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
      taslakDurum.textContent = "Taslak dosyası indirildi. Başka bir bilgisayarda 'Taslak yükle' ile devam edebilirsin.";
    });
    jsonYukleBtn.addEventListener("click", function () { taslakYukleInput.click(); });
    wordBtn.addEventListener("click", function () {
      wordIndir(v, kimlikAl());
      taslakDurum.textContent = "Times New Roman 12 pt, 2,5 cm kenar boşluklu Word (.doc) dosyası indirildi.";
    });
    yazdirBtn.addEventListener("click", function () {
      baskiKatmani.innerHTML = raporHtmlOlustur(v, kimlikAl());
      window.print();
    });

    ust.appendChild(el("div", { class: "rapor-arac-cubuk" }, [
      el("div", { class: "rapor-rozetler" }, [kayitDurum, ilerlemeRozet]),
      el("div", { class: "rapor-islem-dugmeler" }, [jsonIndirBtn, jsonYukleBtn, wordBtn, yazdirBtn, taslakYukleInput]),
      taslakDurum
    ]));

    // Bicim kurallari bilgi kutusu (katlanabilir)
    ust.appendChild(el("details", { class: "yoklama-katla rapor-kurallar" }, [
      el("summary", { metin: "TÜBİTAK biçim kuralları (Times New Roman 12 pt · 2,5 cm · 20 sayfa sınırı)" }),
      el("ul", { class: "liste", style: "margin-top:8px" }, [
        el("li", { metin: "Yazı tipi Times New Roman, boyut 12 punto, sayfa kenar boşlukları her yandan 2,5 cm, tek satır aralığı ve iki yana yaslı olmalıdır." }),
        el("li", { metin: "Proje başlığı tek cümle ve en fazla 15 kelime; Özet 150–250 kelime; Anahtar Kelimeler en fazla 5 adet olmalıdır." }),
        el("li", { metin: "Kırmızı/gri kılavuz açıklamaları yalnızca bilgi amaçlıdır; 'Word indir' ve 'Yazdır / PDF' çıktısında otomatik olarak silinir ve biçim kuralları kendiliğinden uygulanır." })
      ])
    ]));

    // Hizli bolum atlama cubugu
    var icindekiler = el("div", { class: "rapor-icindekiler" });
    var hizliListe = [
      { id: "kunye", ad: "Künye & ÜYZ" },
      { id: "ozet", ad: "Özet" },
      { id: "amac", ad: "Amaç" },
      { id: "giris", ad: "Giriş" },
      { id: "yontem", ad: "Yöntem" },
      { id: "cizelge", ad: "İş-Zaman" },
      { id: "bulgular", ad: "Bulgular" },
      { id: "sonuc", ad: "Sonuç" },
      { id: "oneriler", ad: "Öneriler" },
      { id: "kaynaklar", ad: "Kaynaklar" },
      { id: "ekler", ad: "Ekler" }
    ];
    hizliListe.forEach(function (item) {
      var b = el("button", { type: "button", class: "rapor-icindekiler-bag", metin: item.ad });
      b.addEventListener("click", function () {
        var hedef = document.getElementById("rapor-b-" + item.id);
        if (hedef) hedef.scrollIntoView({ behavior: "smooth", block: "start" });
      });
      bolumDurumRozetler[item.id] = b;
      icindekiler.appendChild(b);
    });
    ust.appendChild(icindekiler);

    // 1. Ogrenci kimligi & Proje Kunyesi
    var km = kimlikAl();
    var adAlan = el("input", { type: "text", placeholder: "Ad Soyad (gönderim için zorunlu)", value: km.ad });
    var grupAlan = el("input", { type: "text", placeholder: "Grup (ör. PÜY-1)", value: km.grup });
    var takimAlan = el("input", { type: "text", placeholder: "Takım arkadaşları (varsa)", value: v.takim });
    adAlan.addEventListener("input", function () { depoYaz("prdta.ogrenci.ad", adAlan.value); kaydet(); });
    grupAlan.addEventListener("input", function () { depoYaz("prdta.ogrenci.grup", grupAlan.value); kaydet(); });
    takimAlan.addEventListener("input", function () { v.takim = takimAlan.value; kaydet(); });

    var alanListe = el("datalist", { id: "tubitak-ana-alanlar" });
    ANA_ALANLAR.forEach(function (a) { alanListe.appendChild(el("option", { value: a })); });

    var anaAlanIn = el("input", { type: "text", list: "tubitak-ana-alanlar", placeholder: "Ör. Teknolojik Tasarım, Yazılım, Fizik...", value: v.anaAlan });
    var tematikIn = el("input", { type: "text", placeholder: "Ör. Yapay Zekâ, Ekolojik Denge, Engelsiz Yaşam...", value: v.tematikAlan });
    var baslikIn = el("input", { type: "text", placeholder: "Tek cümle, kısa ve öz (en fazla 15 kelime)", value: v.baslik });
    var baslikSayac = el("span", { class: "rozet" });

    function baslikSayacGuncelle() {
      var n = kelimeSay(baslikIn.value);
      baslikSayac.textContent = n + " / 15 kelime";
      if (!n) baslikSayac.className = "rozet";
      else if (n <= 15) baslikSayac.className = "rozet tamam";
      else baslikSayac.className = "rozet kod";
    }
    baslikSayacGuncelle();

    anaAlanIn.addEventListener("input", function () { v.anaAlan = anaAlanIn.value; kaydet(); });
    tematikIn.addEventListener("input", function () { v.tematikAlan = tematikIn.value; kaydet(); });
    baslikIn.addEventListener("input", function () { v.baslik = baslikIn.value; baslikSayacGuncelle(); kaydet(); });

    var kunyeKart = el("section", { class: "rapor-kart", id: "rapor-b-kunye" }, [
      el("h2", { metin: "Proje Künyesi ve Öğrenci Bilgileri" }),
      el("div", { class: "kimlik" }, [adAlan, grupAlan, takimAlan]),
      alanListe,
      el("div", { class: "rapor-alan-grup" }, [
        el("label", { metin: "Proje Ana Alanı" }), anaAlanIn
      ]),
      el("div", { class: "rapor-alan-grup" }, [
        el("label", { metin: "Proje Tematik Alanı" }), tematikIn
      ]),
      el("div", { class: "rapor-alan-grup" }, [
        el("div", { class: "bolum-bas-satir" }, [
          el("label", { metin: "Proje Adı (Başlığı)" }),
          baslikSayac
        ]),
        baslikIn,
        el("p", { class: "rapor-ipucu", metin: "Proje başlığı tek bir cümle şeklinde, en fazla 15 kelime olmalı ve proje içeriğini doğrudan yansıtmalıdır." })
      ])
    ]);
    ust.appendChild(kunyeKart);

    // 2. Yapay Zeka Araclari Kullanim Beyani
    var uyzCb = el("input", { type: "checkbox" });
    uyzCb.checked = !!v.uyzKullandi;
    var uyzAlanlar = el("div", { class: "uyz-alanlar", style: v.uyzKullandi ? "" : "display:none" });

    var uyzAracIn = el("input", { type: "text", placeholder: "Örnek: Gemini, Flash, Eylül 2026", value: v.uyzAraclar });
    var uyzAmacIn = el("input", { type: "text", placeholder: "Örnek: İngilizce çeviri, literatür taraması, hesaplama işlemleri vb.", value: v.uyzAmac });
    var uyzKapsamIn = el("input", { type: "text", placeholder: "Örnek: Yöntem bölümünde literatür taraması amacıyla", value: v.uyzKapsam });
    var uyzMudahaleIn = el("input", { type: "text", placeholder: "Örnek: ÜYZ çıktılarının %50'si düzenlenmiş, tüm kaynaklar bağımsız doğrulanmıştır", value: v.uyzMudahale });

    uyzAracIn.addEventListener("input", function () { v.uyzAraclar = uyzAracIn.value; kaydet(); });
    uyzAmacIn.addEventListener("input", function () { v.uyzAmac = uyzAmacIn.value; kaydet(); });
    uyzKapsamIn.addEventListener("input", function () { v.uyzKapsam = uyzKapsamIn.value; kaydet(); });
    uyzMudahaleIn.addEventListener("input", function () { v.uyzMudahale = uyzMudahaleIn.value; kaydet(); });
    uyzCb.addEventListener("change", function () {
      v.uyzKullandi = uyzCb.checked;
      uyzAlanlar.style.display = v.uyzKullandi ? "" : "none";
      kaydet();
    });

    uyzAlanlar.appendChild(el("div", { class: "rapor-alan-grup" }, [el("label", { metin: "Kullanılan araçlar (ad, sürüm ve erişim tarihi)" }), uyzAracIn]));
    uyzAlanlar.appendChild(el("div", { class: "rapor-alan-grup" }, [el("label", { metin: "Kullanım amacı" }), uyzAmacIn]));
    uyzAlanlar.appendChild(el("div", { class: "rapor-alan-grup" }, [el("label", { metin: "Kullanım kapsamı" }), uyzKapsamIn]));
    uyzAlanlar.appendChild(el("div", { class: "rapor-alan-grup" }, [el("label", { metin: "İnsan müdahalesi ve doğrulama" }), uyzMudahaleIn]));

    ust.appendChild(el("section", { class: "rapor-kart" }, [
      el("h2", { metin: "Yapay Zekâ Araçları Kullanım Beyanı" }),
      el("label", { class: "adim-satir", style: "margin-bottom:10px" }, [
        uyzCb,
        el("span", { metin: "Proje kapsamında Üretken Yapay Zekâ (ÜYZ) araçları kullanıldı." })
      ]),
      el("p", { class: "rapor-ipucu", metin: "İşaretli değilse rapora \"Bu proje kapsamında ÜYZ aracı kullanılmamıştır\" ibaresi eklenir." }),
      uyzAlanlar
    ]));

    // 3. Metin bolumleri + Yontem sonrasina Is-Zaman Cizelgesi
    function isZamanKartOlustur() {
      var tabloAlan = el("div", { class: "tablo-sar" });
      var ekleBtn = el("button", { type: "button", class: "dugme ikincil kucuk-dugme", metin: "+ Yeni iş satırı ekle" });

      function cizTablo() {
        tabloAlan.innerHTML = "";
        var tbl = el("table", { class: "yaprak-tablo gantt-tablo" });
        var ust1 = el("tr", {}, [
          el("th", { rowspan: "2", metin: "İşin Adı", style: "min-width:190px" }),
          el("th", { colspan: String(AYLAR.length), metin: "AYLAR (işaretlemek için hücreye tıkla)", style: "text-align:center" }),
          el("th", { rowspan: "2", metin: "" })
        ]);
        var ust2 = el("tr");
        AYLAR.forEach(function (a) { ust2.appendChild(el("th", { class: "gantt-ay-bas", metin: a })); });
        tbl.appendChild(el("thead", {}, [ust1, ust2]));

        var tbody = el("tbody");
        v.cizelge.forEach(function (sat, rIdx) {
          var tr = el("tr");
          var adIn = el("input", { type: "text", class: "tablo-girdi", value: sat.ad || "", placeholder: "İş paketi adı..." });
          adIn.addEventListener("input", function () { sat.ad = adIn.value; kaydet(); });
          tr.appendChild(el("td", {}, [adIn]));

          AYLAR.forEach(function (ayAd, cIdx) {
            var secili = !!(sat.aylar && sat.aylar[cIdx]);
            var hucreBtn = el("button", {
              type: "button",
              class: "gantt-hucre" + (secili ? " secili" : ""),
              "aria-label": (sat.ad || "İş") + " - " + ayAd,
              "aria-pressed": secili ? "true" : "false",
              metin: secili ? "●" : ""
            });
            hucreBtn.addEventListener("click", function () {
              sat.aylar[cIdx] = !sat.aylar[cIdx];
              hucreBtn.className = "gantt-hucre" + (sat.aylar[cIdx] ? " secili" : "");
              hucreBtn.setAttribute("aria-pressed", sat.aylar[cIdx] ? "true" : "false");
              hucreBtn.textContent = sat.aylar[cIdx] ? "●" : "";
              kaydet();
            });
            tr.appendChild(el("td", { class: "gantt-td" }, [hucreBtn]));
          });

          var silBtn = el("button", { type: "button", class: "gantt-sil", title: "Satırı sil", metin: "×" });
          silBtn.addEventListener("click", function () {
            if (v.cizelge.length <= 1) return;
            v.cizelge.splice(rIdx, 1);
            cizTablo();
            kaydet();
          });
          tr.appendChild(el("td", { style: "text-align:center" }, [silBtn]));
          tbody.appendChild(tr);
        });
        tbl.appendChild(tbody);
        tabloAlan.appendChild(tbl);
      }

      ekleBtn.addEventListener("click", function () {
        v.cizelge.push({ ad: "", aylar: AYLAR.map(function () { return false; }) });
        cizTablo();
        kaydet();
      });
      cizTablo();

      return el("section", { class: "rapor-kart", id: "rapor-b-cizelge" }, [
        el("div", { class: "bolum-bas-satir" }, [
          el("h2", { metin: "Proje İş-Zaman Çizelgesi" }),
          ekleBtn
        ]),
        el("p", { class: "rapor-ipucu", metin: "Proje boyunca ulaşacağın hedeflerin hangi aylarda yürütüleceğini hücrelere tıklayarak işaretle. İstersen kendi iş paketlerini ekleyebilirsin." }),
        tabloAlan
      ]);
    }

    BOLUMLER.forEach(function (b) {
      var sayac = el("span", { class: "rozet" });
      var ta = el("textarea", { rows: String(b.satir || 6), class: "rapor-metin", placeholder: b.baslik + " bölümünü buraya yaz..." });
      ta.dataset.enaz = String((b.satir || 6) * 24);
      ta.value = v[b.id] || "";

      function sayacGuncelle() {
        var n = kelimeSay(ta.value);
        if (b.minKelime && b.maxKelime) {
          sayac.textContent = n + " kelime (hedef: " + b.minKelime + "–" + b.maxKelime + ")";
          if (!n) sayac.className = "rozet";
          else if (n >= b.minKelime && n <= b.maxKelime) sayac.className = "rozet tamam";
          else if (n < b.minKelime) sayac.className = "rozet taslak";
          else sayac.className = "rozet kod";
        } else {
          sayac.textContent = n + " kelime";
          sayac.className = n > 0 ? "rozet tamam" : "rozet";
        }
      }
      sayacGuncelle();
      ta.addEventListener("input", function () {
        v[b.id] = ta.value;
        sayacGuncelle();
        buyut(ta);
        kaydet();
      });
      setTimeout(function () { buyut(ta); }, 0);

      var ic = [
        el("div", { class: "bolum-bas-satir" }, [
          el("h2", { metin: b.baslik }),
          sayac
        ]),
        el("p", { class: "rapor-ipucu", metin: b.ipucu }),
        ta
      ];

      // Ozet altina Anahtar Kelimeler ekle
      if (b.id === "ozet") {
        var akSayac = el("span", { class: "rozet" });
        var akIn = el("input", { type: "text", placeholder: "Virgülle ayırarak en fazla 5 anahtar kelime yaz (ör. yalıtım, geri dönüşüm, ısı kaybı)", value: v.anahtar });
        function akGuncelle() {
          var liste = anahtarSay(akIn.value);
          akSayac.textContent = liste.length + " / 5 anahtar kelime";
          if (!liste.length) akSayac.className = "rozet";
          else if (liste.length <= 5) akSayac.className = "rozet tamam";
          else akSayac.className = "rozet kod";
        }
        akGuncelle();
        akIn.addEventListener("input", function () { v.anahtar = akIn.value; akGuncelle(); kaydet(); });
        ic.push(el("div", { class: "rapor-alan-grup", style: "margin-top:14px" }, [
          el("div", { class: "bolum-bas-satir" }, [el("label", { metin: "Anahtar Kelimeler" }), akSayac]),
          akIn
        ]));
      }

      // Ekler altina EK BELGELER onay kutusu
      if (b.id === "ekler") {
        var ekCb = el("input", { type: "checkbox" });
        ekCb.checked = !!v.ekBelgelerVar;
        ekCb.addEventListener("change", function () { v.ekBelgelerVar = ekCb.checked; kaydet(); });
        ic.push(el("label", { class: "adim-satir", style: "margin-top:10px" }, [
          ekCb,
          el("span", { metin: "Ekler 20 sayfa sınırına sığmadığı için başvuru sisteminde EK BELGELER bölümüne ayrıca yüklenecektir." })
        ]));
      }

      ust.appendChild(el("section", { class: "rapor-kart", id: "rapor-b-" + b.id }, ic));

      // Yontem bolumunden hemen sonra Proje Is-Zaman Cizelgesi
      if (b.id === "yontem") {
        ust.appendChild(isZamanKartOlustur());
      }
    });

    // 4. Ogretmene gonderme ve alt islem kutusu
    var gonderDurum = el("div", { class: "gonderim-durum" });
    var gonderBtn = el("button", { type: "button", class: "dugme", metin: "Projeyi öğretmene gönder" });
    var altWordBtn = el("button", { type: "button", class: "dugme ikincil", metin: "Word (.doc) indir" });
    var altPdfBtn = el("button", { type: "button", class: "dugme ikincil", metin: "TÜBİTAK biçiminde Yazdır / PDF" });
    altWordBtn.addEventListener("click", function () { wordIndir(v, kimlikAl()); });
    altPdfBtn.addEventListener("click", function () {
      baskiKatmani.innerHTML = raporHtmlOlustur(v, kimlikAl());
      window.print();
    });

    var kuyrukta = kuyrukAl().some(function (x) { return x.ders === "rapor" && x.hafta === "Rapor"; });
    var sonGonderim = depoAl("prdta.rapor.Rapor.gonderim", "");
    function gDurumYaz(tip, metin) {
      gonderDurum.className = "gonderim-durum " + tip;
      gonderDurum.textContent = metin;
    }
    if (sonGonderim) gDurumYaz("tamam", "Öğretmene gönderildi · " + sonGonderim);
    else if (kuyrukta) gDurumYaz("bekliyor", "Gönderilmeyi bekliyor. İnternete bağlandığında kendiliğinden gönderilecek.");
    else if (!AYAR.gonderimAdresi) gDurumYaz("", "Doğrudan gönderim adresi henüz tanımlanmadı. Projeyi Word (.doc) veya PDF olarak kaydedip öğretmenine ulaştırabilirsin.");

    gonderBtn.addEventListener("click", function () {
      var km2 = kimlikAl();
      if (!km2.ad.trim()) {
        gDurumYaz("hata", "Göndermeden önce en üstteki Ad Soyad alanını doldur.");
        adAlan.focus();
        return;
      }
      var uyzOzet = v.uyzKullandi
        ? "Kullanılan araçlar: " + v.uyzAraclar + "\nKullanım amacı: " + v.uyzAmac +
          "\nKullanım kapsamı: " + v.uyzKapsam + "\nİnsan müdahalesi: " + v.uyzMudahale
        : "Üretken Yapay Zekâ aracı kullanılmamıştır.";

      var yuk = {
        anahtar: AYAR.sinifAnahtari || "",
        ad: km2.ad.trim() + (v.takim.trim() ? " (" + v.takim.trim() + ")" : ""),
        grup: km2.grup.trim(),
        ders: "rapor",
        dersAd: "Proje Raporları",
        hafta: "Rapor",
        haftaBaslik: v.baslik.trim() || "Proje Raporu Taslağı",
        zaman: zamanMetni(new Date()),
        cevaplar: [
          { soru: "Proje Ana Alanı", cevap: v.anaAlan },
          { soru: "Proje Tematik Alanı", cevap: v.tematikAlan },
          { soru: "Proje Adı (Başlığı)", cevap: v.baslik },
          { soru: "Yapay Zekâ Araçları Kullanım Beyanı", cevap: uyzOzet },
          { soru: "Özet (" + kelimeSay(v.ozet) + " kelime)", cevap: v.ozet },
          { soru: "Anahtar Kelimeler", cevap: v.anahtar },
          { soru: "Amaç", cevap: v.amac },
          { soru: "Giriş", cevap: v.giris },
          { soru: "Yöntem", cevap: v.yontem },
          { soru: "Proje İş-Zaman Çizelgesi", cevap: cizelgeMetin(v.cizelge) },
          { soru: "Bulgular", cevap: v.bulgular },
          { soru: "Sonuç ve Tartışma", cevap: v.sonuc },
          { soru: "Öneriler", cevap: v.oneriler },
          { soru: "Kaynaklar", cevap: v.kaynaklar },
          { soru: "Ekler", cevap: v.ekler + (v.ekBelgelerVar ? "\n[EK BELGELER bölümüne ayrıca yükleme yapılacak]" : "") }
        ]
      };
      gonderBtn.disabled = true;
      gDurumYaz("bekliyor", "Gönderiliyor...");
      gonder(yuk, function (basarili, mesaj) {
        gonderBtn.disabled = false;
        if (basarili) {
          depoYaz("prdta.rapor.Rapor.gonderim", yuk.zaman);
          kuyruktanCikar(yuk);
          gDurumYaz("tamam", "Öğretmene gönderildi · " + yuk.zaman);
        } else {
          kuyrugaEkle(yuk);
          gDurumYaz("bekliyor", (mesaj ? mesaj + " " : "") + "Rapor kaydedildi, internete bağlandığında kendiliğinden gönderilecek.");
        }
      });
    });

    var altDugmeler = [altWordBtn, altPdfBtn];
    if (AYAR.gonderimAdresi) altDugmeler.unshift(gonderBtn);

    ust.appendChild(el("section", { class: "rapor-kart rapor-gonder-kart" }, [
      el("h2", { metin: "Teslim ve Dışa Aktarma" }),
      el("p", { class: "kucuk", metin: "Çalışmanı tamamladığında (ya da ara kontrol için) doğrudan öğretmenine gönderebilir, Word (.doc) olarak indirebilir veya TÜBİTAK kurallarına uygun PDF olarak yazdırabilirsin." }),
      el("div", { class: "yedek-dugmeler" }, altDugmeler),
      gonderDurum
    ]));

    ozetIlerlemeHesapla();
    baskiKatmani.innerHTML = raporHtmlOlustur(v, kimlikAl());
    p.appendChild(ust);
    p.appendChild(baskiKatmani);
    return p;
  }

  return {
    sayfa: sayfa,
    taslakVarMi: taslakVarMi
  };
})();
