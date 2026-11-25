// Konuya ozgu cevrimdisi etkilesimli ogrenme araclari.
window.ARACLAR = (function () {
  "use strict";

  function el(tag, attrs, kids) {
    var d = document.createElement(tag);
    if (attrs) {
      for (var k in attrs) {
        if (k === "class") d.className = attrs[k];
        else if (k === "metin") d.textContent = attrs[k];
        else d.setAttribute(k, attrs[k]);
      }
    }
    (kids || []).forEach(function (c) {
      if (c) d.appendChild(typeof c === "string" ? document.createTextNode(c) : c);
    });
    return d;
  }

  function sayi(v) {
    var n = parseFloat(String(v || "").replace(",", "."));
    return isFinite(n) ? n : NaN;
  }

  // 1. OYG H12: Yogunluk ve kutle karsilastirici
  function yogunluk() {
    var malzemeler = [
      { ad: "Meşe ağacı", d: 0.72 },
      { ad: "ABS plastik", d: 1.05 },
      { ad: "PLA filament", d: 1.24 },
      { ad: "Cam", d: 2.50 },
      { ad: "Alüminyum 6061", d: 2.70 },
      { ad: "Paslanmaz çelik", d: 7.85 }
    ];
    var hacimIn = el("input", { type: "text", value: "25", placeholder: "cm³", class: "arac-girdi" });
    var tablo = el("table", { class: "arac-tablo" });

    function guncelle() {
      var v = sayi(hacimIn.value);
      tablo.innerHTML = "";
      tablo.appendChild(el("tr", {}, [
        el("th", { metin: "Malzeme" }),
        el("th", { metin: "Yoğunluk (g/cm³)" }),
        el("th", { metin: "Tahmini kütle (g)" })
      ]));
      if (!(v > 0)) {
        tablo.appendChild(el("tr", {}, [el("td", { colspan: "3", metin: "Geçerli bir pozitif hacim (cm³) yaz." })]));
        return;
      }
      malzemeler.forEach(function (m) {
        tablo.appendChild(el("tr", {}, [
          el("td", { metin: m.ad }),
          el("td", { metin: m.d.toFixed(2) }),
          el("td", { metin: (m.d * v).toFixed(1) + " g" })
        ]));
      });
    }
    hacimIn.addEventListener("input", guncelle);
    guncelle();

    return el("div", { class: "arac-kutu" }, [
      el("h3", { metin: "Etkileşimli deneme: Hacim sabitken kütle nasıl değişir?" }),
      el("p", { class: "kucuk", metin: "Modelinin hacmini (cm³) gir ve beş farklı malzemede kütlenin kaç katına çıktığını gör. Fusion 360 Özellikler penceresindeki değerlerinle karşılaştır." }),
      el("div", { class: "arac-satir" }, [el("label", { metin: "Model hacmi (cm³):" }), hacimIn]),
      tablo
    ]);
  }

  // 2. OYG H23: Kumpas sapma hesaplayici
  function sapma() {
    var hedefIn = el("input", { type: "text", value: "20.0", placeholder: "Ör. 20.0", class: "arac-girdi" });
    var olculenIn = el("input", { type: "text", value: "19.8", placeholder: "Ör. 19.8", class: "arac-girdi" });
    var sonuc = el("div", { class: "arac-sonuc" });

    function hesapla() {
      var h = sayi(hedefIn.value), o = sayi(olculenIn.value);
      if (!(h > 0) || !(o >= 0)) {
        sonuc.textContent = "Hedef ve ölçülen değerleri mm cinsinden yaz.";
        return;
      }
      var fark = o - h;
      var yuzde = (fark / h) * 100;
      var isaret = fark > 0 ? "+" : "";
      var yorum = Math.abs(fark) <= 0.15
        ? "Çok düşük sapma: standart 3B yazıcı hassasiyeti içinde."
        : (fark < 0
          ? "Parça hedeften dar/küçük çıkmış (iç delik ise toleransı büyütmeyi düşün)."
          : "Parça hedeften geniş/büyük çıkmış (geçme parçasıysa boşluk payını artır).");
      sonuc.textContent =
        "Mutlak sapma: " + isaret + fark.toFixed(2) + " mm  ·  Bağıl sapma: " +
        isaret + yuzde.toFixed(2) + "%  —  " + yorum;
    }
    hedefIn.addEventListener("input", hesapla);
    olculenIn.addEventListener("input", hesapla);
    hesapla();

    return el("div", { class: "arac-kutu" }, [
      el("h3", { metin: "Etkileşimli yardımcı: Ölçü sapması hesaplayıcı" }),
      el("p", { class: "kucuk", metin: "Tasarımındaki hedef ölçüyü ve kumpasla okuduğun değeri yaz; işaretli sapmayı (+ / −) kontrol et." }),
      el("div", { class: "arac-satir" }, [
        el("label", { metin: "Hedef (mm):" }), hedefIn,
        el("label", { metin: "Ölçülen (mm):" }), olculenIn
      ]),
      sonuc
    ]);
  }

  // 3. OYG H24: 3B baski atik yuzdesi hesaplayici
  function atik() {
    var netIn = el("input", { type: "text", value: "18", placeholder: "g", class: "arac-girdi" });
    var atikIn = el("input", { type: "text", value: "4", placeholder: "g", class: "arac-girdi" });
    var sonuc = el("div", { class: "arac-sonuc" });

    function hesapla() {
      var n = sayi(netIn.value), a = sayi(atikIn.value);
      if (!(n >= 0) || !(a >= 0) || (n + a) <= 0) {
        sonuc.textContent = "Net parça ve destek/atık kütlelerini gram (g) olarak yaz.";
        return;
      }
      var toplam = n + a;
      var oran = (a / toplam) * 100;
      var not = oran < 10 ? "Düşük atık oranı: iyi yönelim tercihi."
        : oran < 25 ? "Orta düzey atık: parçayı çevirerek desteği azaltabilir misin?"
        : "Yüksek atık oranı: baskı yönelimi veya tasarım açıları gözden geçirilmeli.";
      sonuc.textContent = "Toplam filament: " + toplam.toFixed(1) + " g  ·  Atık oranı: %" + oran.toFixed(1) + "  —  " + not;
    }
    netIn.addEventListener("input", hesapla);
    atikIn.addEventListener("input", hesapla);
    hesapla();

    return el("div", { class: "arac-kutu" }, [
      el("h3", { metin: "Etkileşimli yardımcı: Baskı atık oranı hesaplayıcı" }),
      el("p", { class: "kucuk", metin: "Parçanın net kütlesi ile destek/brim/hatalı deneme kütlesini girip sürdürülebilirlik verini çıkar." }),
      el("div", { class: "arac-satir" }, [
        el("label", { metin: "Net parça (g):" }), netIn,
        el("label", { metin: "Destek / atık (g):" }), atikIn
      ]),
      sonuc
    ]);
  }

  // 4. PUY H02 & H14: Arastirma sorusu 4-test denetleyicisi
  function soruTest() {
    var maddeler = [
      { ad: "İçinde ölçülebilir veya sayılabilir bir değişken var (\"daha iyi\", \"faydalı\" gibi bulanık değil).", uyari: "Sorundaki bulanık kelimenin altını çiz ve \"bunu cetvelle, saatle ya da sayarak nasıl ölçerim?\" sorusunu sor." },
      { ad: "Hangi gözlem veya veri çıkarsa iddiamın/hipotezimin yanlışlanacağını şimdiden söyleyebiliyorum.", uyari: "Yanlışlanma koşulu belli değilse soru bilimsel olarak sınanamaz; hangi sonucun fikrini çürüteceğini yaz." },
      { ad: "Cevabı internetten tek bir aramayla hazır bulunmuyor; benim veri toplamamı veya denememi gerektiriyor.", uyari: "Cevabı ansiklopedide hazır varsa bu derleme ödevidir; yerel ortam, yeni değişken veya karşılaştırma ekle." },
      { ad: "Bu eğitim yılı içinde gerekli izin, araç ve sürede gerçekten veri toplayabileceğim kadar dar kapsamlı.", uyari: "Kapsam fazla genişse yıl bitmeden yetişmez; tek bir ortam, tek yaş grubu veya tek değişkenle daralt." }
    ];
    var soruIn = el("input", { type: "text", placeholder: "Aklındaki araştırma sorusunu buraya yazıp aşağıdan sına...", class: "arac-tam-girdi" });
    var sonuc = el("div", { class: "arac-sonuc" });
    var kutular = [];

    function denetle() {
      var eksikler = [];
      kutular.forEach(function (k, i) { if (!k.checked) eksikler.push(maddeler[i].uyari); });
      var t = kutular.length - eksikler.length;
      if (t === kutular.length) {
        sonuc.className = "arac-sonuc arac-tamam";
        sonuc.textContent = "4/4 ölçüt tamam: Sorun araştırılabilir ve sınanabilir görünüyor. Şimdi bunu çalışma yaprağına aktarabilirsin.";
      } else {
        sonuc.className = "arac-sonuc";
        sonuc.textContent = t + "/4 ölçüt sağlandı. Öncelikli öneri: " + eksikler[0];
      }
    }

    var liste = el("div", { class: "arac-kontrol-liste" });
    maddeler.forEach(function (m) {
      var cb = el("input", { type: "checkbox" });
      cb.addEventListener("change", denetle);
      kutular.push(cb);
      liste.appendChild(el("label", { class: "arac-kontrol" }, [cb, el("span", { metin: m.ad })]));
    });
    denetle();

    return el("div", { class: "arac-kutu" }, [
      el("h3", { metin: "Etkileşimli denetim: Araştırma sorun 4 sınamadan geçiyor mu?" }),
      el("p", { class: "kucuk", metin: "Sorunu yaz ve gerçekten sağladığın her ölçütü dürüstçe işaretle." }),
      soruIn,
      liste,
      sonuc
    ]);
  }

  // 5. PUY H06 & H36: Fikri / sinai koruma turu karar rehberi
  function korumaRehber() {
    var secenekler = [
      { ad: "Yeni, buluş basamağı yüksek ve sanayiye uygulanabilir teknik çözüm", sonuc: "Patent (6769 sayılı Sınai Mülkiyet Kanunu) · Başvurudan itibaren 20 yıl, uzatılamaz. Başvurudan önce kamuya açık paylaşım yeniliği bozabilir." },
      { ad: "Teknik yenilik taşıyan ama büyük buluş basamağı gerektirmeyen pratik geliştirme", sonuc: "Faydalı Model (6769 sayılı Kanun) · Başvurudan itibaren 10 yıl. Küçük ama işlevsel mekanik/teknik çözümlerde daha hızlı ve düşük maliyetlidir." },
      { ad: "Ürünün teknik işlevi değil, özgün dış görünümü (biçim, çizgi, doku, süsleme)", sonuc: "Tasarım Tescili (6769 sayılı Kanun) · Tescilli 5 yıl (yenilemeyle en çok 25 yıl); tescilsiz tasarım kamuya sunumdan itibaren 3 yıl korunur." },
      { ad: "Ürünün veya girişimin kendisi değil; adı, logosu ya da ayırt edici işareti", sonuc: "Marka Tescili (6769 sayılı Kanun) · 10 yıl süreyle korunur ve yenilendikçe süresiz devam eder. Ürünün tekniğini değil adını korur." },
      { ad: "Yazılım kodu, proje raporu, eğitim materyali, müzik, film veya sanat eseri", sonuc: "Telif / Eser Hakkı (5846 sayılı FSEK) · Eser oluştuğu anda tescilsiz doğar; mali haklar yaşam boyu + 70 yıl, manevi haklar süresizdir. İstenirse açık kaynak / Creative Commons lisansı seçilebilir." }
    ];
    var secim = el("select", { class: "arac-secim" });
    secenekler.forEach(function (s, i) { secim.appendChild(el("option", { value: String(i), metin: s.ad })); });
    var sonuc = el("div", { class: "arac-sonuc" });
    function guncelle() { sonuc.textContent = secenekler[parseInt(secim.value, 10)].sonuc; }
    secim.addEventListener("change", guncelle);
    guncelle();

    return el("div", { class: "arac-kutu" }, [
      el("h3", { metin: "Etkileşimli rehber: Çıktım hangi koruma türüne girer?" }),
      el("p", { class: "kucuk", metin: "Proje fikrine en yakın tanımı seç; ilgili kanunu, süreyi ve dikkat edeceğin koşulu gör." }),
      secim,
      sonuc
    ]);
  }

  // 6. PUY H24: Arastirma deseni secici
  function desenSecici() {
    var secenekler = [
      { ad: "Bir etkeni kasıtlı değiştirip sonucunu kontrollü koşullarda ölçmek istiyorum", sonuc: "Önerilen desen: Nicel — Deneysel Desen. Dikkat: Yalnızca tek bağımsız değişkeni değiştir, diğer koşulları sabit tut, kontrol/referans ölçümü ve en az 3–5 tekrar al." },
      { ad: "Mevcut durumu sayılarla betimlemek ya da iki değişken arasındaki ilişkiye bakmak istiyorum", sonuc: "Önerilen desen: Nicel — Tarama (Betimsel) veya İlişkisel Desen. Dikkat: İlişki bulmak doğrudan neden-sonuç kanıtı değildir; örneklem yanlılığını sınırlarında belirt." },
      { ad: "Kullanıcıların deneyimini, neden zorlandıklarını veya bir kurum/olay bağlamını derinlemesine anlamak istiyorum", sonuc: "Önerilen desen: Nitel — Durum Çalışması, Olgubilim veya Eylem Araştırması. Dikkat: Yönlendirici soru sorma; görüşme/gözlem verilerini doğrudan alıntılarla ve veri çeşitlemesiyle destekle." },
      { ad: "Önce sayıyla ölçüp sonra çıkan sonucu görüşmeyle açıklamak (veya önce keşfedip sonra ölçmek) istiyorum", sonuc: "Önerilen desen: Karma Yöntem (Açımlayıcı Sıralı, Keşfedici Sıralı veya Yakınsayan Paralel). Dikkat: İki veriyi ayrı ayrı raporlayıp bırakma; sonuçta birbirini nasıl açıkladığını bütünleştir." }
    ];
    var secim = el("select", { class: "arac-secim" });
    secenekler.forEach(function (s, i) { secim.appendChild(el("option", { value: String(i), metin: s.ad })); });
    var sonuc = el("div", { class: "arac-sonuc" });
    function guncelle() { sonuc.textContent = secenekler[parseInt(secim.value, 10)].sonuc; }
    secim.addEventListener("change", guncelle);
    guncelle();

    return el("div", { class: "arac-kutu" }, [
      el("h3", { metin: "Etkileşimli rehber: Hangi araştırma deseni soruma uyar?" }),
      el("p", { class: "kucuk", metin: "Desen kararı öğrencinindir; bu rehber yalnızca alternatiflerini hızlıca tartmana yardım eder." }),
      secim,
      sonuc
    ]);
  }

  return {
    yogunluk: yogunluk,
    sapma: sapma,
    atik: atik,
    soru_test: soruTest,
    koruma_rehber: korumaRehber,
    desen_secici: desenSecici
  };
})();
