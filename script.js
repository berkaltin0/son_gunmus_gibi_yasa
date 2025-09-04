// Dünya nüfusu ve demografik değişim hızları için tahmini değerler
// Veriler Worldometers ve benzeri kaynaklardan alınmış tahminlere dayanmaktadır
let REFERENCE_POPULATION = 8005176000; // 2024 yılı referans nüfusu
let REFERENCE_DATE = new Date('2024-06-06T00:00:00Z'); // Referans tarih
const BIRTHS_PER_SECOND = 4.3;   // Saniyede ortalama 4.3 doğum
const DEATHS_PER_SECOND = 1.8;   // Saniyede ortalama 1.8 ölüm
const NET_GROWTH_PER_SECOND = BIRTHS_PER_SECOND - DEATHS_PER_SECOND; // Saniyede net nüfus artışı

// Türkiye için demografik veriler
const TURKEY_POPULATION = 84680273; // 2023 sonu tahmini
const TURKEY_BIRTH_RATE = 15.3; // Binde (1000 kişi başına)
const TURKEY_DEATH_RATE = 5.4;  // Binde (1000 kişi başına)
const TURKEY_BIRTHS_PER_DAY = (TURKEY_POPULATION * TURKEY_BIRTH_RATE / 1000) / 365;
const TURKEY_DEATHS_PER_DAY = (TURKEY_POPULATION * TURKEY_DEATH_RATE / 1000) / 365;

// Günlük ve aylık değerleri hesapla
const BIRTHS_PER_DAY = BIRTHS_PER_SECOND * 60 * 60 * 24;
const DEATHS_PER_DAY = DEATHS_PER_SECOND * 60 * 60 * 24;
const BIRTHS_PER_MONTH = BIRTHS_PER_DAY * 30.44; // Ortalama ay uzunluğu
const DEATHS_PER_MONTH = DEATHS_PER_DAY * 30.44;

// Sayaçları güncelleyecek değişkenler - worldPopulation'ı global olarak tanımlıyoruz
var worldPopulation = 0; // var kullanarak global erişim sağlıyoruz
let totalBirths = 0;
let totalDeaths = 0;
let startTime = new Date();
let turkeyTodayBirths = 0;
let turkeyTodayDeaths = 0;

// DOM elementlerini seçme
const birthsCounterElement = document.getElementById('births-counter');
const deathsCounterElement = document.getElementById('deaths-counter');
const populationCounterElement = document.getElementById('population-counter');
const birthsRateElement = document.getElementById('births-rate');
const deathsRateElement = document.getElementById('deaths-rate');
const netGrowthElement = document.getElementById('net-growth');
const birthsDailyElement = document.getElementById('births-daily');
const birthsMonthlyElement = document.getElementById('births-monthly');
const deathsDailyElement = document.getElementById('deaths-daily');
const deathsMonthlyElement = document.getElementById('deaths-monthly');

// Türkiye istatistikleri için DOM elementleri
const turkeyPopulationElement = document.getElementById('turkey-population');
const turkeyBirthsElement = document.getElementById('turkey-births');
const turkeyDeathsElement = document.getElementById('turkey-deaths');

// Kenar çubuğu için DOM elementleri
const sidebar = document.querySelector('.sidebar');
const toggleButton = document.getElementById('toggle-sidebar');
const tabButtons = document.querySelectorAll('.tab-button');
const tabPanes = document.querySelectorAll('.tab-pane');

// Sayıları formatlamak için yardımcı fonksiyon
function formatNumber(number) {
    return number.toLocaleString('tr-TR');
}

// Güncel dünya nüfusunu hesaplama fonksiyonu
function calculateCurrentWorldPopulation() {
    const now = new Date();
    const secondsElapsed = (now - REFERENCE_DATE) / 1000;
    return REFERENCE_POPULATION + (secondsElapsed * NET_GROWTH_PER_SECOND);
}

// Referans verilerini güncelleme fonksiyonu
function updateReferenceData() {
    const now = new Date();
    REFERENCE_POPULATION = calculateCurrentWorldPopulation();
    REFERENCE_DATE = now;
    
    // Verileri localStorage'a kaydet
    localStorage.setItem('referencePopulation', REFERENCE_POPULATION.toString());
    localStorage.setItem('referenceDate', REFERENCE_DATE.toISOString());
    localStorage.setItem('lastUpdateMonth', now.getMonth().toString());
    localStorage.setItem('lastUpdateYear', now.getFullYear().toString());
}

// Kaydedilmiş referans verilerini yükleme fonksiyonu
function loadReferenceData() {
    const savedPopulation = localStorage.getItem('referencePopulation');
    const savedDate = localStorage.getItem('referenceDate');
    
    if (savedPopulation && savedDate) {
        REFERENCE_POPULATION = parseFloat(savedPopulation);
        REFERENCE_DATE = new Date(savedDate);
    }
}

// Güncelleme zamanını kontrol etme fonksiyonu
function checkUpdateTime() {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    const lastUpdateMonth = localStorage.getItem('lastUpdateMonth');
    const lastUpdateYear = localStorage.getItem('lastUpdateYear');
    
    // Eğer hiç güncelleme yapılmadıysa veya ay değiştiyse güncelle
    if (!lastUpdateMonth || !lastUpdateYear || 
        parseInt(lastUpdateMonth) !== currentMonth || 
        parseInt(lastUpdateYear) !== currentYear) {
        updateReferenceData();
    }
}

// Sayfa yüklendiğinde referans verilerini yükle ve kontrol et
loadReferenceData();
checkUpdateTime();

// Başlangıç değerlerini ayarla
worldPopulation = calculateCurrentWorldPopulation();
startTime = new Date();

// Sayaçları güncelleme fonksiyonu
function updateCounters() {
    const now = new Date();
    const elapsedSeconds = (now - startTime) / 1000;
    
    // Dünya istatistikleri
    totalBirths = elapsedSeconds * BIRTHS_PER_SECOND;
    totalDeaths = elapsedSeconds * DEATHS_PER_SECOND;
    worldPopulation = calculateCurrentWorldPopulation();
    
    birthsCounterElement.textContent = formatNumber(Math.floor(totalBirths));
    deathsCounterElement.textContent = formatNumber(Math.floor(totalDeaths));
    populationCounterElement.textContent = formatNumber(Math.floor(worldPopulation));
    netGrowthElement.textContent = formatNumber(Math.floor(totalBirths - totalDeaths));
    
    // Saniye başına oranları güncelle
    birthsRateElement.textContent = `Saniyede: ${BIRTHS_PER_SECOND.toFixed(1)}`;
    deathsRateElement.textContent = `Saniyede: ${DEATHS_PER_SECOND.toFixed(1)}`;
    
    // Günlük ve aylık istatistikleri güncelle
    birthsDailyElement.textContent = `Günlük: ${formatNumber(Math.round(BIRTHS_PER_DAY))}`;
    birthsMonthlyElement.textContent = `Aylık: ${formatNumber(Math.round(BIRTHS_PER_MONTH))}`;
    deathsDailyElement.textContent = `Günlük: ${formatNumber(Math.round(DEATHS_PER_DAY))}`;
    deathsMonthlyElement.textContent = `Aylık: ${formatNumber(Math.round(DEATHS_PER_MONTH))}`;
    
    // Türkiye istatistikleri
    updateTurkeyStats();
}

// Türkiye istatistiklerini güncelleme fonksiyonu
function updateTurkeyStats() {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const secondsPassedToday = (now - startOfDay) / 1000;
    
    // Bugün gerçekleşen doğum ve ölümler
    turkeyTodayBirths = (TURKEY_BIRTHS_PER_DAY / 86400) * secondsPassedToday;
    turkeyTodayDeaths = (TURKEY_DEATHS_PER_DAY / 86400) * secondsPassedToday;
    
    // İstatistikleri güncelle
    turkeyPopulationElement.textContent = formatNumber(TURKEY_POPULATION);
    turkeyBirthsElement.textContent = formatNumber(Math.floor(turkeyTodayBirths));
    turkeyDeathsElement.textContent = formatNumber(Math.floor(turkeyTodayDeaths));
}

// Günlük değerleri kontrol etme ve gerekirse sıfırlama
let lastCheckedDay = new Date().getDate();

function checkDayChange() {
    const now = new Date();
    const currentDay = now.getDate();
    
    // Gün değiştiyse sayaçları sıfırla
    if (currentDay !== lastCheckedDay) {
        turkeyTodayBirths = 0;
        turkeyTodayDeaths = 0;
        lastCheckedDay = currentDay;
        console.log("Yeni gün başladı, günlük sayaçlar sıfırlandı.");
    }
}

// Sayaçları periyodik olarak güncelleme
setInterval(() => {
    updateCounters();
    checkDayChange(); // Her güncelleme sırasında gün değişimini kontrol et
}, 1000);

// Kenar çubuğu geçiş işlevi
toggleButton.addEventListener('click', () => {
    sidebar.classList.toggle('collapsed');
});

// Sekme geçişleri
tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Aktif sekme butonunu değiştir
        tabButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        // İlgili içeriği göster
        const tabId = button.getAttribute('data-tab');
        tabPanes.forEach(pane => {
            pane.classList.remove('active');
            if (pane.id === `${tabId}-tab`) {
                pane.classList.add('active');
            }
        });
    });
});

// Kullanıcı tercihlerini kaydet
function saveUserPreferences() {
    localStorage.setItem('sidebarCollapsed', sidebar.classList.contains('collapsed'));
    localStorage.setItem('activeTab', document.querySelector('.tab-button.active').getAttribute('data-tab'));
}

// Kullanıcı tercihlerini yükle
function loadUserPreferences() {
    const sidebarCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';
    const activeTab = localStorage.getItem('activeTab');
    
    if (sidebarCollapsed) {
        sidebar.classList.add('collapsed');
    }
    
    if (activeTab) {
        tabButtons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-tab') === activeTab) {
                btn.classList.add('active');
                
                // İlgili içeriği göster
                tabPanes.forEach(pane => {
                    pane.classList.remove('active');
                    if (pane.id === `${activeTab}-tab`) {
                        pane.classList.add('active');
                    }
                });
            }
        });
    }
}

// Sayfa yüklendiğinde kullanıcı tercihlerini yükle
document.addEventListener('DOMContentLoaded', function() {
    // Başlangıç değerlerini ayarla
    worldPopulation = calculateCurrentWorldPopulation();
    startTime = new Date();
    
    // İlk yükleme için hemen sayaçları güncelle
    updateCounters();
    
    // Kullanıcı tercihlerini yükle
    loadUserPreferences();
});

// Kullanıcı tercihleri değiştiğinde kaydet
toggleButton.addEventListener('click', saveUserPreferences);
tabButtons.forEach(button => {
    button.addEventListener('click', saveUserPreferences);
}); 