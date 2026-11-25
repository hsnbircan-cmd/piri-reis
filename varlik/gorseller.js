// Cevrimdisi calisan satir ici SVG ogrenme semalari.
// Dis kaynak gerektirmez; sitenin sicak renk paletini kullanir.
window.GORSELLER = {
  "oyg_h02_duzen": {
    baslik: "Aynı yazı tipi, üç farklı düzen: gözün ilk nereye gidiyor?",
    alt: "Solda her şey aynı boyutta ve dağınık; ortada başlık-alt bilgi hiyerarşisi net; sağda ise en büyük yazı en önemsiz kelimeye verilmiş (tuzak).",
    svg: '<svg viewBox="0 0 660 210" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Üç görsel düzen karşılaştırması">' +
      '<rect x="10" y="10" width="200" height="190" rx="10" fill="#f4f1ec" stroke="#d8d0c6"/>' +
      '<text x="26" y="34" font-size="12" font-weight="700" fill="#6f655d">1 · Hiyerarşi yok</text>' +
      '<rect x="26" y="48" width="168" height="134" rx="6" fill="#fff" stroke="#d8d0c6"/>' +
      '<text x="38" y="76" font-size="12" fill="#2b2420">14 Ekim Çarşamba</text>' +
      '<text x="38" y="96" font-size="12" fill="#2b2420">Atölye Tanıtım Günü</text>' +
      '<text x="38" y="116" font-size="12" fill="#2b2420">Saat 15.30 · Zemin Kat</text>' +
      '<text x="38" y="136" font-size="12" fill="#2b2420">Katılım ücretsizdir</text>' +
      '<text x="38" y="156" font-size="12" fill="#2b2420">Etimesgut BİLSEM</text>' +

      '<rect x="230" y="10" width="200" height="190" rx="10" fill="#e8efec" stroke="#40655c"/>' +
      '<text x="246" y="34" font-size="12" font-weight="700" fill="#40655c">2 · Net hiyerarşi ve gruplama</text>' +
      '<rect x="246" y="48" width="168" height="134" rx="6" fill="#fff" stroke="#40655c"/>' +
      '<text x="258" y="70" font-size="10" font-weight="600" fill="#6f655d">ETİMESGUT BİLSEM</text>' +
      '<text x="258" y="98" font-size="16" font-weight="700" fill="#2b2420">Atölye Tanıtım</text>' +
      '<text x="258" y="117" font-size="16" font-weight="700" fill="#2b2420">Günü</text>' +
      '<line x1="258" y1="128" x2="396" y2="128" stroke="#d8d0c6"/>' +
      '<text x="258" y="148" font-size="12" font-weight="600" fill="#b4532a">14 Ekim · 15.30</text>' +
      '<text x="258" y="166" font-size="11" fill="#6f655d">Zemin Kat · Ücretsiz</text>' +

      '<rect x="450" y="10" width="200" height="190" rx="10" fill="#f7f0da" stroke="#8a6d1f"/>' +
      '<text x="466" y="34" font-size="12" font-weight="700" fill="#8a6d1f">3 · Tuzak: yanlış vurgu</text>' +
      '<rect x="466" y="48" width="168" height="134" rx="6" fill="#fff" stroke="#d8d0c6"/>' +
      '<text x="478" y="88" font-size="24" font-weight="700" fill="#b4532a">ZEMİN KAT</text>' +
      '<text x="478" y="114" font-size="10" fill="#6f655d">Atölye Tanıtım Günü</text>' +
      '<text x="478" y="132" font-size="10" fill="#6f655d">14 Ekim Çarşamba 15.30</text>' +
      '<text x="478" y="162" font-size="11" font-weight="600" fill="#8a6d1f">Büyük yazı ≠ önemli bilgi!</text>' +
      '</svg>'
  },
  "oyg_h04_agac": {
    baslik: "Düz liste (sahte bağ) vs. Ara düğümlü bileşen ağacı (gerçek bağ)",
    alt: "Solda 6 parça birbirinden bağımsız durur; biri uzayınca diğerleri tek tek elle kaydırılır. Sağda parçalar 2 ara düğümde gruplandığı için birlikte uyum sağlar.",
    svg: '<svg viewBox="0 0 660 215" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Düz liste ve bileşen ağacı karşılaştırması">' +
      '<rect x="10" y="10" width="290" height="195" rx="10" fill="#f6ece6" stroke="#b4532a"/>' +
      '<text x="26" y="34" font-size="13" font-weight="700" fill="#b4532a">Düz liste (sahte bağ)</text>' +
      '<rect x="30" y="48" width="250" height="22" rx="4" fill="#fff" stroke="#d8d0c6"/><text x="42" y="63" font-size="12" fill="#2b2420">1. İkon (bağımsız)</text>' +
      '<rect x="30" y="75" width="250" height="22" rx="4" fill="#fff" stroke="#d8d0c6"/><text x="42" y="90" font-size="12" fill="#2b2420">2. Başlık (bağımsız)</text>' +
      '<rect x="30" y="102" width="250" height="22" rx="4" fill="#fff" stroke="#d8d0c6"/><text x="42" y="117" font-size="12" fill="#2b2420">3. Görsel (bağımsız)</text>' +
      '<rect x="30" y="129" width="250" height="22" rx="4" fill="#fff" stroke="#d8d0c6"/><text x="42" y="144" font-size="12" fill="#2b2420">4. Açıklama (bağımsız)</text>' +
      '<rect x="30" y="156" width="250" height="22" rx="4" fill="#fff" stroke="#d8d0c6"/><text x="42" y="171" font-size="12" fill="#2b2420">5. Düğme + Etiket (bağımsız)</text>' +
      '<text x="30" y="196" font-size="11" fill="#b4532a">Metin uzayınca hepsini elle kaydırmak gerekir.</text>' +

      '<rect x="320" y="10" width="330" height="195" rx="10" fill="#e8efec" stroke="#40655c"/>' +
      '<text x="336" y="34" font-size="13" font-weight="700" fill="#40655c">Bileşen ağacı (ara düğümlü yapı)</text>' +
      '<rect x="435" y="46" width="100" height="26" rx="6" fill="#40655c"/><text x="485" y="63" text-anchor="middle" font-size="12" font-weight="700" fill="#fff">KART</text>' +
      '<line x1="485" y1="72" x2="400" y2="96" stroke="#40655c" stroke-width="1.5"/>' +
      '<line x1="485" y1="72" x2="485" y2="96" stroke="#40655c" stroke-width="1.5"/>' +
      '<line x1="485" y1="72" x2="575" y2="96" stroke="#40655c" stroke-width="1.5"/>' +
      '<rect x="348" y="96" width="100" height="26" rx="6" fill="#fff" stroke="#40655c" stroke-width="1.5"/><text x="398" y="113" text-anchor="middle" font-size="11" font-weight="700" fill="#40655c">Üst Şerit</text>' +
      '<rect x="454" y="96" width="70" height="26" rx="6" fill="#fff" stroke="#40655c" stroke-width="1.5"/><text x="489" y="113" text-anchor="middle" font-size="11" font-weight="700" fill="#40655c">Gövde</text>' +
      '<rect x="530" y="96" width="104" height="26" rx="6" fill="#fff" stroke="#40655c" stroke-width="1.5"/><text x="582" y="113" text-anchor="middle" font-size="11" font-weight="700" fill="#40655c">Eylem Alanı</text>' +
      '<line x1="398" y1="122" x2="398" y2="144" stroke="#6f655d"/>' +
      '<line x1="489" y1="122" x2="489" y2="144" stroke="#6f655d"/>' +
      '<line x1="582" y1="122" x2="582" y2="144" stroke="#6f655d"/>' +
      '<text x="398" y="158" text-anchor="middle" font-size="11" fill="#2b2420">İkon + Başlık</text>' +
      '<text x="489" y="158" text-anchor="middle" font-size="11" fill="#2b2420">Görsel + Metin</text>' +
      '<text x="582" y="158" text-anchor="middle" font-size="11" fill="#2b2420">Düğme + Tarih</text>' +
      '<text x="336" y="196" font-size="11" fill="#40655c">Fusion Tarayıcı ağacı (Bileşen → Gövde → Eskiz) aynı mantıktır.</text>' +
      '</svg>'
  },
  "oyg_h06_eskiz": {
    baslik: "Açık / mavi eskiz vs. Kapalı / siyah (tam belirlenmiş) eskiz",
    alt: "Solda köşe açık olduğu için katılaşmaz ve çizgiler mavi (serbest) kalır. Sağda profil kapalı, orijine bağlı ve tüm ölçüler kilitli (siyah) olduğu için güvenle katılaşır.",
    svg: '<svg viewBox="0 0 660 200" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Mavi serbest eskiz ve siyah tam belirlenmiş eskiz karşılaştırması">' +
      '<rect x="10" y="10" width="305" height="180" rx="10" fill="#f4f1ec" stroke="#d8d0c6"/>' +
      '<text x="26" y="34" font-size="13" font-weight="700" fill="#b4532a">Açık ve belirlenmemiş (mavi)</text>' +
      '<polyline points="60,145 60,70 220,70 220,145 80,145" fill="none" stroke="#2563eb" stroke-width="3"/>' +
      '<circle cx="70" cy="145" r="14" fill="none" stroke="#b4532a" stroke-width="2" stroke-dasharray="4 3"/>' +
      '<text x="95" y="166" font-size="11" fill="#b4532a">Açık köşe → Extrude çalışmaz!</text>' +
      '<circle cx="105" cy="108" r="14" fill="none" stroke="#2563eb" stroke-width="2.5"/>' +
      '<text x="135" y="112" font-size="11" fill="#2563eb">Ölçü &amp; kısıt yok → sürüklenince kayar</text>' +

      '<rect x="335" y="10" width="315" height="180" rx="10" fill="#e8efec" stroke="#40655c"/>' +
      '<text x="351" y="34" font-size="13" font-weight="700" fill="#40655c">Kapalı ve tam belirlenmiş (siyah)</text>' +
      '<rect x="390" y="72" width="180" height="72" rx="12" fill="#dbeafe" fill-opacity="0.5" stroke="#1f2937" stroke-width="3"/>' +
      '<circle cx="390" cy="144" r="4" fill="#b4532a"/>' +
      '<text x="358" y="160" font-size="10" font-weight="700" fill="#b4532a">Orijin (0,0)</text>' +
      '<circle cx="422" cy="108" r="12" fill="#fff" stroke="#1f2937" stroke-width="2.5"/>' +
      '<text x="480" y="64" text-anchor="middle" font-size="11" font-weight="700" fill="#2b2420">60 mm</text>' +
      '<text x="585" y="112" font-size="11" font-weight="700" fill="#2b2420">24 mm</text>' +
      '<text x="442" y="112" font-size="10" fill="#2b2420">Ø6 mm · Eş merkezli</text>' +
      '<text x="351" y="178" font-size="11" fill="#40655c">İçi dolu profil + siyah çizgi → Extrude hazır</text>' +
      '</svg>'
  },
  "oyg_h08_govdeler": {
    baslik: "Dört temel katı oluşturma aracı: şekle göre hangisi?",
    alt: "Extrude düz iter, Revolve eksen etrafında döndürür, Sweep kıvrımlı yol boyunca sürükler, Loft iki farklı kesiti birleştirir.",
    svg: '<svg viewBox="0 0 660 190" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Extrude Revolve Sweep Loft şeması">' +
      '<rect x="8" y="10" width="152" height="170" rx="10" fill="#f4f1ec" stroke="#d8d0c6"/>' +
      '<text x="84" y="32" text-anchor="middle" font-size="13" font-weight="700" fill="#2b2420">Extrude</text>' +
      '<rect x="44" y="108" width="80" height="24" fill="#eae5dd" stroke="#2b2420" stroke-width="2"/>' +
      '<rect x="44" y="62" width="80" height="46" fill="#b4532a" fill-opacity="0.25" stroke="#b4532a" stroke-width="2"/>' +
      '<line x1="84" y1="104" x2="84" y2="70" stroke="#b4532a" stroke-width="2"/>' +
      '<polygon points="84,64 79,74 89,74" fill="#b4532a"/>' +
      '<text x="84" y="156" text-anchor="middle" font-size="11" fill="#6f655d">Tek profil + düz yön</text>' +

      '<rect x="172" y="10" width="152" height="170" rx="10" fill="#f4f1ec" stroke="#d8d0c6"/>' +
      '<text x="248" y="32" text-anchor="middle" font-size="13" font-weight="700" fill="#2b2420">Revolve</text>' +
      '<line x1="248" y1="48" x2="248" y2="138" stroke="#40655c" stroke-width="2" stroke-dasharray="5 3"/>' +
      '<path d="M248,60 L274,60 L264,95 L278,128 L248,128 Z" fill="#40655c" fill-opacity="0.3" stroke="#40655c" stroke-width="2"/>' +
      '<ellipse cx="248" cy="60" rx="26" ry="7" fill="none" stroke="#b4532a" stroke-width="1.5"/>' +
      '<text x="248" y="156" text-anchor="middle" font-size="11" fill="#6f655d">Yarım kesit + eksen</text>' +

      '<rect x="336" y="10" width="152" height="170" rx="10" fill="#f4f1ec" stroke="#d8d0c6"/>' +
      '<text x="412" y="32" text-anchor="middle" font-size="13" font-weight="700" fill="#2b2420">Sweep</text>' +
      '<path d="M368,128 C368,72 456,72 456,128" fill="none" stroke="#b4532a" stroke-width="14" stroke-opacity="0.25" stroke-linecap="round"/>' +
      '<path d="M368,128 C368,72 456,72 456,128" fill="none" stroke="#b4532a" stroke-width="2" stroke-dasharray="4 3"/>' +
      '<circle cx="368" cy="128" r="7" fill="#fff" stroke="#2b2420" stroke-width="2"/>' +
      '<text x="412" y="156" text-anchor="middle" font-size="11" fill="#6f655d">Kesit + kıvrımlı yol</text>' +

      '<rect x="500" y="10" width="152" height="170" rx="10" fill="#f4f1ec" stroke="#d8d0c6"/>' +
      '<text x="576" y="32" text-anchor="middle" font-size="13" font-weight="700" fill="#2b2420">Loft</text>' +
      '<polygon points="536,128 616,128 594,64 558,64" fill="#40655c" fill-opacity="0.22" stroke="#40655c" stroke-width="2"/>' +
      '<rect x="536" y="122" width="80" height="12" fill="none" stroke="#2b2420" stroke-width="2"/>' +
      '<ellipse cx="576" cy="64" rx="18" ry="6" fill="#fff" stroke="#b4532a" stroke-width="2"/>' +
      '<text x="576" y="156" text-anchor="middle" font-size="11" fill="#6f655d">2+ farklı kesit</text>' +
      '</svg>'
  },
  "oyg_h09_kabuk": {
    baslik: "İşlem sırası kesiti nasıl değiştirir? (Shell → Fillet vs. Fillet → Shell)",
    alt: "Önce Shell sonra dışa Fillet yapılırsa köşe keskin iç duvarla ince kalabilir. Önce Fillet sonra Shell yapılırsa iç köşe de otomatik yuvarlatılır ve duvar kalınlığı her yerde sabit kalır.",
    svg: '<svg viewBox="0 0 660 195" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Shell ve Fillet sırası kesit karşılaştırması">' +
      '<rect x="10" y="10" width="310" height="175" rx="10" fill="#f6ece6" stroke="#b4532a"/>' +
      '<text x="26" y="34" font-size="13" font-weight="700" fill="#b4532a">1 · Önce Shell, sonra Fillet</text>' +
      '<path d="M60,55 L60,122 Q60,150 88,150 L242,150 Q270,150 270,122 L270,55 L248,55 L248,132 L82,132 L82,55 Z" fill="#d8d0c6" stroke="#2b2420" stroke-width="2"/>' +
      '<circle cx="76" cy="136" r="14" fill="none" stroke="#b4532a" stroke-width="2" stroke-dasharray="3 2"/>' +
      '<text x="165" y="172" text-anchor="middle" font-size="11" fill="#b4532a">İç köşe dik kaldı → köşede duvar inceldi!</text>' +

      '<rect x="340" y="10" width="310" height="175" rx="10" fill="#e8efec" stroke="#40655c"/>' +
      '<text x="356" y="34" font-size="13" font-weight="700" fill="#40655c">2 · Önce Fillet, sonra Shell</text>' +
      '<path d="M390,55 L390,122 Q390,150 418,150 L572,150 Q600,150 600,122 L600,55 L578,55 L578,118 Q578,128 568,128 L422,128 Q412,128 412,118 L412,55 Z" fill="#9eb8b1" stroke="#2b2420" stroke-width="2"/>' +
      '<text x="495" y="172" text-anchor="middle" font-size="11" fill="#40655c">İç köşe de yuvarlandı → duvar her yerde eşit</text>' +
      '</svg>'
  },
  "oyg_h16_tolerans": {
    baslik: "Bilgisayarda 0 mm boşluk neden 3B yazıcıda birbirine geçmez?",
    alt: "Solda 0 mm boşluklu kapak baskı sapmasıyla duvara sıkışır. Sağda her kenarda bırakılan 0,3 mm tolerans parçanın temiz oturmasını sağlar.",
    svg: '<svg viewBox="0 0 660 185" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="0 mm boşluk ve 0.3 mm tolerans karşılaştırması">' +
      '<rect x="10" y="10" width="310" height="165" rx="10" fill="#f6ece6" stroke="#b4532a"/>' +
      '<text x="26" y="34" font-size="13" font-weight="700" fill="#b4532a">0 mm boşluk (sıkışır / geçmez)</text>' +
      '<path d="M55,80 L55,148 L275,148 L275,80 L248,80 L248,124 L82,124 L82,80 Z" fill="#d8d0c6" stroke="#2b2420" stroke-width="2"/>' +
      '<rect x="82" y="64" width="166" height="44" fill="#b4532a" fill-opacity="0.35" stroke="#b4532a" stroke-width="2"/>' +
      '<text x="165" y="90" text-anchor="middle" font-size="12" font-weight="700" fill="#2b2420">Kapak: 40,0 mm</text>' +
      '<text x="165" y="140" text-anchor="middle" font-size="11" fill="#2b2420">Yuva: 40,0 mm (çakışma riski)</text>' +

      '<rect x="340" y="10" width="310" height="165" rx="10" fill="#e8efec" stroke="#40655c"/>' +
      '<text x="356" y="34" font-size="13" font-weight="700" fill="#40655c">0,3 mm tolerans payı (temiz geçme)</text>' +
      '<path d="M385,80 L385,148 L605,148 L605,80 L578,80 L578,124 L412,124 L412,80 Z" fill="#d8d0c6" stroke="#2b2420" stroke-width="2"/>' +
      '<rect x="422" y="64" width="146" height="44" fill="#40655c" fill-opacity="0.3" stroke="#40655c" stroke-width="2"/>' +
      '<text x="495" y="90" text-anchor="middle" font-size="12" font-weight="700" fill="#2b2420">Kapak: 39,4 mm</text>' +
      '<text x="417" y="74" text-anchor="middle" font-size="10" font-weight="700" fill="#40655c">0,3</text>' +
      '<text x="573" y="74" text-anchor="middle" font-size="10" font-weight="700" fill="#40655c">0,3</text>' +
      '<text x="495" y="140" text-anchor="middle" font-size="11" fill="#2b2420">Yuva: 40,0 mm · Her yanda +0,3 mm pay</text>' +
      '</svg>'
  },
  "oyg_h19_imalat": {
    baslik: "Üç temel endüstriyel imalat ailesi",
    alt: "Kalıplama erimiş malzemeyi biçimlendirir, talaşlı imalat dolu bloktan malzeme çıkarır, eklemeli imalat ise katman ekleyerek örer.",
    svg: '<svg viewBox="0 0 660 180" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Döküm, talaşlı ve eklemeli imalat şeması">' +
      '<rect x="10" y="10" width="204" height="160" rx="10" fill="#f4f1ec" stroke="#d8d0c6"/>' +
      '<text x="112" y="34" text-anchor="middle" font-size="13" font-weight="700" fill="#2b2420">Döküm / Kalıplama</text>' +
      '<path d="M52,65 L52,125 L172,125 L172,65 L145,65 L145,105 L79,105 L79,65 Z" fill="#d8d0c6" stroke="#2b2420" stroke-width="2"/>' +
      '<rect x="81" y="76" width="62" height="27" fill="#b4532a" fill-opacity="0.5"/>' +
      '<text x="112" y="148" text-anchor="middle" font-size="11" fill="#6f655d">Biçimlendirme · Seri üretim</text>' +

      '<rect x="228" y="10" width="204" height="160" rx="10" fill="#f4f1ec" stroke="#d8d0c6"/>' +
      '<text x="330" y="34" text-anchor="middle" font-size="13" font-weight="700" fill="#2b2420">Talaşlı İmalat (CNC)</text>' +
      '<rect x="270" y="75" width="120" height="50" fill="#eae5dd" stroke="#6f655d" stroke-dasharray="4 3"/>' +
      '<path d="M270,125 L270,95 L310,95 L310,75 L350,75 L350,95 L390,95 L390,125 Z" fill="#40655c" fill-opacity="0.4" stroke="#2b2420" stroke-width="2"/>' +
      '<rect x="325" y="45" width="10" height="28" fill="#b4532a"/>' +
      '<text x="330" y="148" text-anchor="middle" font-size="11" fill="#6f655d">Çıkarma · Yüksek hassasiyet</text>' +

      '<rect x="446" y="10" width="204" height="160" rx="10" fill="#f4f1ec" stroke="#d8d0c6"/>' +
      '<text x="548" y="34" text-anchor="middle" font-size="13" font-weight="700" fill="#2b2420">Eklemeli (3B Baskı)</text>' +
      '<rect x="492" y="114" width="112" height="10" fill="#40655c" stroke="#fff"/>' +
      '<rect x="500" y="104" width="96" height="10" fill="#40655c" stroke="#fff"/>' +
      '<rect x="508" y="94" width="80" height="10" fill="#40655c" stroke="#fff"/>' +
      '<rect x="516" y="84" width="64" height="10" fill="#b4532a" stroke="#fff"/>' +
      '<polygon points="548,82 541,66 555,66" fill="#2b2420"/>' +
      '<text x="548" y="148" text-anchor="middle" font-size="11" fill="#6f655d">Katman ekleme · Prototip</text>' +
      '</svg>'
  },
  "oyg_h28_uretken": {
    baslik: "Üretken tasarımda kurulan dört temel kısıt",
    alt: "Sen gövdeyi çizmezsin; yalnızca yeşil (korunacak) halkaları, kırmızı (yasak) engelleri, sabitlenecek duvarı ve yük okunu tanımlarsın.",
    svg: '<svg viewBox="0 0 660 190" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Üretken tasarım kısıt şeması">' +
      '<rect x="10" y="10" width="640" height="170" rx="10" fill="#f4f1ec" stroke="#d8d0c6"/>' +
      '<rect x="35" y="25" width="38" height="140" fill="#b4532a" fill-opacity="0.28" stroke="#b4532a" stroke-width="2"/>' +
      '<text x="54" y="100" text-anchor="middle" font-size="11" font-weight="700" fill="#b4532a" transform="rotate(-90 54 100)">ENGEL (DUVAR)</text>' +
      '<circle cx="96" cy="58" r="16" fill="#40655c" fill-opacity="0.35" stroke="#40655c" stroke-width="2.5"/>' +
      '<circle cx="96" cy="58" r="7" fill="#fff" stroke="#40655c" stroke-width="2"/>' +
      '<circle cx="96" cy="132" r="16" fill="#40655c" fill-opacity="0.35" stroke="#40655c" stroke-width="2.5"/>' +
      '<circle cx="96" cy="132" r="7" fill="#fff" stroke="#40655c" stroke-width="2"/>' +
      '<circle cx="290" cy="95" r="18" fill="#40655c" fill-opacity="0.35" stroke="#40655c" stroke-width="2.5"/>' +
      '<circle cx="290" cy="95" r="8" fill="#fff" stroke="#40655c" stroke-width="2"/>' +
      '<path d="M112,58 C175,65 215,75 272,92" fill="none" stroke="#6f655d" stroke-width="3" stroke-dasharray="6 4"/>' +
      '<path d="M112,132 C175,125 215,115 272,98" fill="none" stroke="#6f655d" stroke-width="3" stroke-dasharray="6 4"/>' +
      '<line x1="290" y1="116" x2="290" y2="160" stroke="#b4532a" stroke-width="3"/>' +
      '<polygon points="290,166 284,154 296,154" fill="#b4532a"/>' +
      '<text x="302" y="156" font-size="12" font-weight="700" fill="#b4532a">Yük (100 N)</text>' +

      '<rect x="390" y="28" width="240" height="134" rx="8" fill="#fff" stroke="#d8d0c6"/>' +
      '<circle cx="410" cy="52" r="7" fill="#40655c"/><text x="425" y="56" font-size="12" fill="#2b2420">Yeşil = Korunacak (Preserve)</text>' +
      '<rect x="403" y="72" width="14" height="14" fill="#b4532a" fill-opacity="0.4" stroke="#b4532a"/><text x="425" y="83" font-size="12" fill="#2b2420">Kırmızı = Engel (Obstacle)</text>' +
      '<line x1="403" y1="108" x2="417" y2="108" stroke="#6f655d" stroke-width="3" stroke-dasharray="4 3"/><text x="425" y="112" font-size="12" fill="#2b2420">Kesikli = Yazılımın üreteceği gövde</text>' +
      '<text x="405" y="142" font-size="11" fill="#6f655d">Sabitleme: duvar delikleri · Hedef: az kütle</text>' +
      '</svg>'
  },
  "puy_h02_kugu": {
    baslik: "Popper'ın yanlışlanabilirlik asimetrisi",
    alt: "On altı beyaz kuğu 'bütün kuğular beyazdır' iddiasını kesin kanıtlamaz; tek bir siyah kuğu ise iddiayı anında düşürür.",
    svg: '<svg viewBox="0 0 660 175" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Beyaz kuğular ve tek siyah kuğu asimetrisi">' +
      '<rect x="10" y="10" width="380" height="155" rx="10" fill="#f4f1ec" stroke="#d8d0c6"/>' +
      '<text x="26" y="34" font-size="13" font-weight="700" fill="#2b2420">16 destekleyici gözlem ≠ kesin kanıt</text>' +
      '<g fill="#fff" stroke="#6f655d" stroke-width="1.8">' +
      '<circle cx="46" cy="68" r="14"/><circle cx="88" cy="68" r="14"/><circle cx="130" cy="68" r="14"/><circle cx="172" cy="68" r="14"/>' +
      '<circle cx="214" cy="68" r="14"/><circle cx="256" cy="68" r="14"/><circle cx="298" cy="68" r="14"/><circle cx="340" cy="68" r="14"/>' +
      '<circle cx="46" cy="108" r="14"/><circle cx="88" cy="108" r="14"/><circle cx="130" cy="108" r="14"/><circle cx="172" cy="108" r="14"/>' +
      '<circle cx="214" cy="108" r="14"/><circle cx="256" cy="108" r="14"/><circle cx="298" cy="108" r="14"/><circle cx="340" cy="108" r="14"/>' +
      '</g>' +
      '<text x="26" y="148" font-size="11.5" fill="#6f655d">Yeni bir gözlem her an tersini gösterebilir → güvenilir ama kesin değil.</text>' +

      '<rect x="410" y="10" width="240" height="155" rx="10" fill="#f6ece6" stroke="#b4532a"/>' +
      '<text x="426" y="34" font-size="13" font-weight="700" fill="#b4532a">1 karşı örnek = çürütme</text>' +
      '<circle cx="530" cy="88" r="28" fill="#2b2420"/>' +
      '<text x="530" y="93" text-anchor="middle" font-size="12" font-weight="700" fill="#fff">Siyah</text>' +
      '<text x="530" y="148" text-anchor="middle" font-size="11.5" fill="#b4532a">Genel iddia tek gözlemle düşer.</text>' +
      '</svg>'
  },
  "puy_h03_eksen": {
    baslik: "Aynı iki sayı, iki farklı grafik: eksene bakmadan okuma!",
    alt: "Her iki grafikte de A = 78 ve B = 82'dir. Solda Y ekseni 75'ten başladığı için fark dev gibi görünür; sağda 0'dan başladığı için gerçek oranı görülür.",
    svg: '<svg viewBox="0 0 660 205" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Kesik eksen ve tam eksen grafik karşılaştırması">' +
      '<rect x="10" y="10" width="305" height="185" rx="10" fill="#f6ece6" stroke="#b4532a"/>' +
      '<text x="26" y="32" font-size="13" font-weight="700" fill="#b4532a">Kesik eksen (75 → 84)</text>' +
      '<line x1="65" y1="50" x2="65" y2="155" stroke="#2b2420" stroke-width="1.5"/>' +
      '<line x1="65" y1="155" x2="275" y2="155" stroke="#2b2420" stroke-width="1.5"/>' +
      '<text x="58" y="58" text-anchor="end" font-size="10" fill="#6f655d">84</text>' +
      '<text x="58" y="106" text-anchor="end" font-size="10" fill="#6f655d">80</text>' +
      '<text x="58" y="155" text-anchor="end" font-size="10" font-weight="700" fill="#b4532a">75</text>' +
      '<rect x="105" y="120" width="52" height="35" fill="#8a6d1f" fill-opacity="0.75"/>' +
      '<rect x="188" y="73" width="52" height="82" fill="#b4532a"/>' +
      '<text x="131" y="114" text-anchor="middle" font-size="11" font-weight="700" fill="#2b2420">78</text>' +
      '<text x="214" y="67" text-anchor="middle" font-size="11" font-weight="700" fill="#2b2420">82</text>' +
      '<text x="131" y="170" text-anchor="middle" font-size="11" fill="#2b2420">Yöntem A</text>' +
      '<text x="214" y="170" text-anchor="middle" font-size="11" fill="#2b2420">Yöntem B</text>' +
      '<text x="165" y="186" text-anchor="middle" font-size="10.5" fill="#b4532a">B, A\'nın iki katından büyük gibi duruyor!</text>' +

      '<rect x="345" y="10" width="305" height="185" rx="10" fill="#e8efec" stroke="#40655c"/>' +
      '<text x="361" y="32" font-size="13" font-weight="700" fill="#40655c">Tam eksen (0 → 100)</text>' +
      '<line x1="400" y1="50" x2="400" y2="155" stroke="#2b2420" stroke-width="1.5"/>' +
      '<line x1="400" y1="155" x2="610" y2="155" stroke="#2b2420" stroke-width="1.5"/>' +
      '<text x="393" y="58" text-anchor="end" font-size="10" fill="#6f655d">100</text>' +
      '<text x="393" y="106" text-anchor="end" font-size="10" fill="#6f655d">50</text>' +
      '<text x="393" y="155" text-anchor="end" font-size="10" font-weight="700" fill="#40655c">0</text>' +
      '<rect x="440" y="73" width="52" height="82" fill="#8a6d1f" fill-opacity="0.75"/>' +
      '<rect x="523" y="69" width="52" height="86" fill="#40655c"/>' +
      '<text x="466" y="67" text-anchor="middle" font-size="11" font-weight="700" fill="#2b2420">78</text>' +
      '<text x="549" y="63" text-anchor="middle" font-size="11" font-weight="700" fill="#2b2420">82</text>' +
      '<text x="466" y="170" text-anchor="middle" font-size="11" fill="#2b2420">Yöntem A</text>' +
      '<text x="549" y="170" text-anchor="middle" font-size="11" fill="#2b2420">Yöntem B</text>' +
      '<text x="500" y="186" text-anchor="middle" font-size="10.5" fill="#40655c">Gerçek fark: yalnızca 4 puan (%5).</text>' +
      '</svg>'
  },
  "puy_h04_takvim": {
    baslik: "Proje yılının 6 Ara Teslim durağı",
    alt: "Konu 4. haftada değil 14. haftada kesinleşir. Altı ara teslim işin son haftalara yığılmasını önler.",
    svg: '<svg viewBox="0 0 660 140" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="6 ara teslim yıllık yol haritası">' +
      '<rect x="8" y="8" width="644" height="124" rx="10" fill="#f4f1ec" stroke="#d8d0c6"/>' +
      '<line x1="48" y1="62" x2="612" y2="62" stroke="#40655c" stroke-width="3"/>' +
      '<g text-anchor="middle" font-size="11">' +
      '<circle cx="62" cy="62" r="14" fill="#b4532a"/><text x="62" y="66" fill="#fff" font-weight="700">14</text><text x="62" y="38" font-weight="700" fill="#b4532a">AT-1</text><text x="62" y="94" fill="#2b2420">Konu &amp;</text><text x="62" y="109" fill="#2b2420">Özgünlük</text>' +
      '<circle cx="168" cy="62" r="14" fill="#b4532a"/><text x="168" y="66" fill="#fff" font-weight="700">16</text><text x="168" y="38" font-weight="700" fill="#b4532a">AT-2</text><text x="168" y="94" fill="#2b2420">İş Takvimi</text><text x="168" y="109" fill="#2b2420">&amp; Bütçe</text>' +
      '<circle cx="274" cy="62" r="14" fill="#b4532a"/><text x="274" y="66" fill="#fff" font-weight="700">19</text><text x="274" y="38" font-weight="700" fill="#b4532a">AT-3</text><text x="274" y="94" fill="#2b2420">Giriş</text><text x="274" y="109" fill="#2b2420">Bölümü</text>' +
      '<circle cx="380" cy="62" r="14" fill="#40655c"/><text x="380" y="66" fill="#fff" font-weight="700">24</text><text x="380" y="38" font-weight="700" fill="#40655c">AT-4</text><text x="380" y="94" fill="#2b2420">Araştırma</text><text x="380" y="109" fill="#2b2420">Deseni</text>' +
      '<circle cx="486" cy="62" r="14" fill="#40655c"/><text x="486" y="66" fill="#fff" font-weight="700">30</text><text x="486" y="38" font-weight="700" fill="#40655c">AT-5</text><text x="486" y="94" fill="#2b2420">Bulgular &amp;</text><text x="486" y="109" fill="#2b2420">Grafikler</text>' +
      '<circle cx="592" cy="62" r="14" fill="#40655c"/><text x="592" y="66" fill="#fff" font-weight="700">33</text><text x="592" y="38" font-weight="700" fill="#40655c">AT-6</text><text x="592" y="94" fill="#2b2420">Tam Proje</text><text x="592" y="109" fill="#2b2420">Raporu</text>' +
      '</g></svg>'
  },
  "puy_h17_huni": {
    baslik: "Giriş bölümünün huni akışı (genelden özele)",
    alt: "Okuyucuyu konunun bağlamından alıp literatür boşluğuna, oradan da tam senin problem cümlene ve alt problemlerine indirir.",
    svg: '<svg viewBox="0 0 660 205" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Giriş bölümü huni yapısı">' +
      '<rect x="10" y="8" width="640" height="189" rx="10" fill="#f4f1ec" stroke="#d8d0c6"/>' +
      '<polygon points="70,24 590,24 550,58 110,58" fill="#e8efec" stroke="#40655c"/>' +
      '<text x="330" y="45" text-anchor="middle" font-size="12.5" font-weight="700" fill="#2b2420">1 · Problem Durumu ve Literatür (Ne biliniyor?)</text>' +
      '<polygon points="116,64 544,64 504,98 156,98" fill="#f7f0da" stroke="#8a6d1f"/>' +
      '<text x="330" y="85" text-anchor="middle" font-size="12.5" font-weight="700" fill="#2b2420">2 · Mevcut Boşluk (Ne eksik kalmış?)</text>' +
      '<polygon points="162,104 498,104 458,138 202,138" fill="#f6ece6" stroke="#b4532a"/>' +
      '<text x="330" y="125" text-anchor="middle" font-size="12.5" font-weight="700" fill="#b4532a">3 · Amaç ve Ana Problem Cümlesi</text>' +
      '<rect x="208" y="144" width="244" height="38" rx="6" fill="#b4532a"/>' +
      '<text x="330" y="167" text-anchor="middle" font-size="12" font-weight="700" fill="#fff">4 · Alt Problemler · Hipotez · Sınırlar</text>' +
      '</svg>'
  },
  "puy_h21_deney": {
    baslik: "Kontrollü deney düzeneğinin üç değişkeni",
    alt: "Yalnızca tek bir bağımsız değişkeni değiştirirsin; kontrol değişkenleri sabit kalır ki bağımlı değişkendeki farkın nedenini güvenle bilebilesin.",
    svg: '<svg viewBox="0 0 660 175" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Deneysel yöntem değişken şeması">' +
      '<rect x="10" y="10" width="640" height="155" rx="10" fill="#f4f1ec" stroke="#d8d0c6"/>' +
      '<rect x="28" y="48" width="168" height="72" rx="8" fill="#f6ece6" stroke="#b4532a" stroke-width="2"/>' +
      '<text x="112" y="74" text-anchor="middle" font-size="12.5" font-weight="700" fill="#b4532a">Bağımsız Değişken</text>' +
      '<text x="112" y="94" text-anchor="middle" font-size="11" fill="#2b2420">Senin değiştirdiğin</text>' +
      '<text x="112" y="109" text-anchor="middle" font-size="11" fill="#2b2420">tek etken (ör. açı)</text>' +

      '<line x1="196" y1="84" x2="236" y2="84" stroke="#2b2420" stroke-width="2"/>' +
      '<polygon points="242,84 232,79 232,89" fill="#2b2420"/>' +

      '<rect x="246" y="28" width="168" height="114" rx="8" fill="#fff" stroke="#40655c" stroke-width="2"/>' +
      '<text x="330" y="54" text-anchor="middle" font-size="12.5" font-weight="700" fill="#40655c">Kontrol Değişkenleri</text>' +
      '<text x="330" y="76" text-anchor="middle" font-size="11" fill="#2b2420">Kesinlikle SABİT tutulanlar</text>' +
      '<text x="330" y="96" text-anchor="middle" font-size="11" fill="#6f655d">• Aynı ortam &amp; sıcaklık</text>' +
      '<text x="330" y="112" text-anchor="middle" font-size="11" fill="#6f655d">• Aynı cihaz &amp; süre</text>' +
      '<text x="330" y="128" text-anchor="middle" font-size="11" fill="#6f655d">• 3–5 tekrar + kontrol grubu</text>' +

      '<line x1="414" y1="84" x2="454" y2="84" stroke="#2b2420" stroke-width="2"/>' +
      '<polygon points="460,84 450,79 450,89" fill="#2b2420"/>' +

      '<rect x="464" y="48" width="168" height="72" rx="8" fill="#e8efec" stroke="#40655c" stroke-width="2"/>' +
      '<text x="548" y="74" text-anchor="middle" font-size="12.5" font-weight="700" fill="#40655c">Bağımlı Değişken</text>' +
      '<text x="548" y="94" text-anchor="middle" font-size="11" fill="#2b2420">Etkilenip ölçtüğün</text>' +
      '<text x="548" y="109" text-anchor="middle" font-size="11" fill="#2b2420">çıktı (ör. voltaj, mW)</text>' +
      '</svg>'
  },
  "puy_h23_karma": {
    baslik: "Üç temel karma araştırma deseni",
    alt: "Nicel ve nitel veriyi hangi sırayla toplayıp nerede birleştirdiğin desenin adını belirler.",
    svg: '<svg viewBox="0 0 660 195" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Karma araştırma desenleri şeması">' +
      '<rect x="10" y="10" width="640" height="52" rx="8" fill="#f4f1ec" stroke="#d8d0c6"/>' +
      '<text x="24" y="40" font-size="12" font-weight="700" fill="#2b2420">1. Açımlayıcı sıralı</text>' +
      '<rect x="180" y="21" width="110" height="30" rx="6" fill="#40655c"/><text x="235" y="40" text-anchor="middle" font-size="11.5" font-weight="700" fill="#fff">NİCEL ölçüm</text>' +
      '<text x="312" y="41" font-size="16" fill="#2b2420">→</text>' +
      '<rect x="338" y="21" width="115" height="30" rx="6" fill="#b4532a"/><text x="395" y="40" text-anchor="middle" font-size="11.5" font-weight="700" fill="#fff">nitel açıklama</text>' +
      '<text x="468" y="40" font-size="11" fill="#6f655d">Sayıyı görüşmeyle açıkla</text>' +

      '<rect x="10" y="72" width="640" height="52" rx="8" fill="#f4f1ec" stroke="#d8d0c6"/>' +
      '<text x="24" y="102" font-size="12" font-weight="700" fill="#2b2420">2. Keşfedici sıralı</text>' +
      '<rect x="180" y="83" width="110" height="30" rx="6" fill="#b4532a"/><text x="235" y="102" text-anchor="middle" font-size="11.5" font-weight="700" fill="#fff">NİTEL keşif</text>' +
      '<text x="312" y="103" font-size="16" fill="#2b2420">→</text>' +
      '<rect x="338" y="83" width="115" height="30" rx="6" fill="#40655c"/><text x="395" y="102" text-anchor="middle" font-size="11.5" font-weight="700" fill="#fff">nicel sınama</text>' +
      '<text x="468" y="102" font-size="11" fill="#6f655d">Önce keşfet, sonra ölç</text>' +

      '<rect x="10" y="134" width="640" height="52" rx="8" fill="#f4f1ec" stroke="#d8d0c6"/>' +
      '<text x="24" y="164" font-size="12" font-weight="700" fill="#2b2420">3. Yakınsayan paralel</text>' +
      '<rect x="180" y="145" width="110" height="30" rx="6" fill="#40655c"/><text x="235" y="164" text-anchor="middle" font-size="11.5" font-weight="700" fill="#fff">NİCEL veri</text>' +
      '<text x="312" y="165" font-size="16" font-weight="700" fill="#2b2420">+</text>' +
      '<rect x="338" y="145" width="115" height="30" rx="6" fill="#b4532a"/><text x="395" y="164" text-anchor="middle" font-size="11.5" font-weight="700" fill="#fff">NİTEL veri</text>' +
      '<text x="468" y="164" font-size="11" fill="#6f655d">Eşzamanlı topla, kıyasla</text>' +
      '</svg>'
  },
  "puy_h26_gecerlik": {
    baslik: "Geçerlik ve güvenirlik farkı (hedef tahtası benzetmesi)",
    alt: "Solda atışlar hep aynı yerde toplanmış (güvenilir) ama merkezden uzak (geçersiz). Ortada dağınık. Sağda hem toplu hem merkezde (geçerli ve güvenilir).",
    svg: '<svg viewBox="0 0 660 190" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Geçerlik ve güvenirlik hedef tahtası şeması">' +
      '<g>' +
      '<rect x="10" y="10" width="204" height="170" rx="10" fill="#f7f0da" stroke="#8a6d1f"/>' +
      '<circle cx="112" cy="86" r="48" fill="#fff" stroke="#d8d0c6" stroke-width="2"/>' +
      '<circle cx="112" cy="86" r="28" fill="none" stroke="#d8d0c6" stroke-width="2"/>' +
      '<circle cx="112" cy="86" r="9" fill="#eae5dd" stroke="#6f655d"/>' +
      '<circle cx="138" cy="60" r="4" fill="#b4532a"/><circle cx="145" cy="66" r="4" fill="#b4532a"/><circle cx="134" cy="68" r="4" fill="#b4532a"/><circle cx="142" cy="56" r="4" fill="#b4532a"/>' +
      '<text x="112" y="156" text-anchor="middle" font-size="11.5" font-weight="700" fill="#8a6d1f">Güvenilir ama GEÇERSİZ</text>' +
      '<text x="112" y="171" text-anchor="middle" font-size="10.5" fill="#6f655d">(Hep 2 kg fazla ölçen terazi)</text>' +

      '<rect x="228" y="10" width="204" height="170" rx="10" fill="#f6ece6" stroke="#b4532a"/>' +
      '<circle cx="330" cy="86" r="48" fill="#fff" stroke="#d8d0c6" stroke-width="2"/>' +
      '<circle cx="330" cy="86" r="28" fill="none" stroke="#d8d0c6" stroke-width="2"/>' +
      '<circle cx="330" cy="86" r="9" fill="#eae5dd" stroke="#6f655d"/>' +
      '<circle cx="296" cy="64" r="4" fill="#b4532a"/><circle cx="362" cy="70" r="4" fill="#b4532a"/><circle cx="310" cy="118" r="4" fill="#b4532a"/><circle cx="352" cy="112" r="4" fill="#b4532a"/>' +
      '<text x="330" y="156" text-anchor="middle" font-size="11.5" font-weight="700" fill="#b4532a">Ne geçerli ne güvenilir</text>' +
      '<text x="330" y="171" text-anchor="middle" font-size="10.5" fill="#6f655d">(Her seferinde rastgele sonuç)</text>' +

      '<rect x="446" y="10" width="204" height="170" rx="10" fill="#e8efec" stroke="#40655c"/>' +
      '<circle cx="548" cy="86" r="48" fill="#fff" stroke="#d8d0c6" stroke-width="2"/>' +
      '<circle cx="548" cy="86" r="28" fill="none" stroke="#d8d0c6" stroke-width="2"/>' +
      '<circle cx="548" cy="86" r="9" fill="#e8efec" stroke="#40655c"/>' +
      '<circle cx="546" cy="84" r="4" fill="#40655c"/><circle cx="551" cy="87" r="4" fill="#40655c"/><circle cx="548" cy="91" r="4" fill="#40655c"/><circle cx="544" cy="88" r="4" fill="#40655c"/>' +
      '<text x="548" y="156" text-anchor="middle" font-size="11.5" font-weight="700" fill="#40655c">Geçerli ve GÜVENİLİR</text>' +
      '<text x="548" y="171" text-anchor="middle" font-size="10.5" fill="#6f655d">(Hedeflenen özellik, tutarlı ölçüm)</text>' +
      '</g></svg>'
  }
};
