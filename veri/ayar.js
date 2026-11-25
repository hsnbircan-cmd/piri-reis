// Gönderim ayarları.
// Apps Script uygulamasını yayımladıktan sonra aldığınız adresi buraya yapıştırın.
// Adres boş bırakılırsa site çalışmaya devam eder, yalnızca Gönder düğmesi pasif olur.
window.AYAR = {
  // Apps Script projesi: "Atolye Teslimleri" (dagitim: Ders sitesi teslim alicisi)
  gonderimAdresi: "https://script.google.com/macros/s/AKfycbz6fjNI2r-WwYcB0c6IJiFOc0BfRHXh_e_SnrNkigjciirYtThknQV1AStGn6ECN0HV/exec",

  // Betikteki SINIF_ANAHTARI ile birebir aynı olmalı.
  // Bu anahtar sayfa kaynağından görülebilir; güvenlik değil, kazara gönderimi önler.
  sinifAnahtari: "piri-reis-2026",

  // Gönderim denemesi için beklenecek süre (milisaniye).
  zamanAsimi: 15000
};
