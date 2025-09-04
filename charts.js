// Grafik verilerini ve yapılandırmalarını içeren dosya

// Global değişkenler
window.modal = null;
window.modalTitle = null;
window.chartDetailsElement = null;
window.closeModalButton = null;
window.currentChartType = null;
window.modalChartInstance = null;

// Grafik renkleri
const colors = {
    births: 'rgba(52, 152, 219, 0.7)',
    deaths: 'rgba(231, 76, 60, 0.7)',
    population: 'rgba(46, 204, 113, 0.7)',
    continents: [
        'rgba(52, 152, 219, 0.7)',   // Asya
        'rgba(155, 89, 182, 0.7)',   // Afrika
        'rgba(46, 204, 113, 0.7)',   // Avrupa
        'rgba(241, 196, 15, 0.7)',   // Kuzey Amerika
        'rgba(230, 126, 34, 0.7)',   // Güney Amerika
        'rgba(231, 76, 60, 0.7)',    // Okyanusya
        'rgba(149, 165, 166, 0.7)'   // Antarktika
    ]
};

// Kıtalara göre nüfus verileri (2023 tahmini)
const continentData = {
    labels: ['Asya', 'Afrika', 'Avrupa', 'K. Amerika', 'G. Amerika', 'Okyanusya'],
    data: [4700000000, 1400000000, 750000000, 600000000, 430000000, 43000000]
};

// Grafik detayları
const chartDetails = {
    birthDeath: {
        title: "Doğum ve Ölüm Oranları",
        description: "Bu grafik, dünya genelinde saniye başına gerçekleşen ortalama doğum ve ölüm sayılarını göstermektedir. Doğum oranı (4.3/saniye) ölüm oranından (1.8/saniye) daha yüksek olduğu için dünya nüfusu sürekli artmaktadır.",
        facts: [
            "Dünyada her saniye ortalama 4.3 bebek doğmaktadır.",
            "Dünyada her saniye ortalama 1.8 kişi hayatını kaybetmektedir.",
            "Bu, saniyede yaklaşık 2.5 kişilik net nüfus artışı anlamına gelir.",
            "Günde yaklaşık 371,520 bebek doğmaktadır.",
            "Günde yaklaşık 155,520 kişi hayatını kaybetmektedir."
        ]
    },
    populationGrowth: {
        title: "Nüfus Artışı",
        description: "Bu grafik, dünya nüfusunun son 10 dakika içindeki değişimini göstermektedir. Her 10 saniyede bir güncellenir ve dünya nüfusunun sürekli artışını gerçek zamanlı olarak izlemenizi sağlar.",
        facts: [
            "Dünya nüfusu her gün yaklaşık 216,000 kişi artmaktadır.",
            "Bu, yılda yaklaşık 78.8 milyon kişilik bir artış demektir.",
            "Mevcut artış hızıyla, 2050 yılında dünya nüfusunun 9.7 milyara ulaşması beklenmektedir.",
            "1800 yılında dünya nüfusu sadece 1 milyardı.",
            "1960'larda dünya nüfusu 3 milyar civarındaydı."
        ]
    },
    continentDistribution: {
        title: "Kıtalara Göre Nüfus Dağılımı",
        description: "Bu grafik, dünya nüfusunun kıtalara göre dağılımını göstermektedir. Asya, dünya nüfusunun yaklaşık %60'ını barındırmaktadır.",
        facts: [
            "Asya, 4.7 milyar kişi ile en kalabalık kıtadır ve dünya nüfusunun yaklaşık %60'ını barındırır.",
            "Afrika, 1.4 milyar kişi ile ikinci en kalabalık kıtadır ve en hızlı nüfus artışına sahiptir.",
            "Avrupa'nın nüfusu yaklaşık 750 milyon kişidir ve birçok ülkede nüfus azalmaktadır.",
            "Kuzey ve Güney Amerika'nın toplam nüfusu yaklaşık 1 milyar kişidir.",
            "Okyanusya, sadece 43 milyon kişi ile en az nüfusa sahip kıtadır."
        ]
    }
};

// Doğum ve ölüm oranları grafiği
let birthDeathChart;
function createBirthDeathChart() {
    const ctx = document.getElementById('birthDeathChart').getContext('2d');
    
    birthDeathChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Doğum', 'Ölüm'],
            datasets: [{
                label: 'Saniyede',
                data: [BIRTHS_PER_SECOND, DEATHS_PER_SECOND],
                backgroundColor: [colors.births, colors.deaths],
                borderColor: [
                    'rgba(52, 152, 219, 1)',
                    'rgba(231, 76, 60, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Saniyede'
                    }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Saniye Başına Doğum ve Ölüm Oranları'
                }
            },
            onClick: () => showModal('birthDeath')
        }
    });
    
    // Grafik kutusuna tıklama olayı ekle
    document.querySelector('.chart-box:nth-child(1)').addEventListener('click', () => showModal('birthDeath'));
}

// Nüfus artışı grafiği
let populationGrowthChart;
let populationData = {
    labels: [],
    datasets: [{
        label: 'Dünya Nüfusu',
        data: [],
        borderColor: colors.population,
        backgroundColor: 'rgba(46, 204, 113, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.4
    }]
};

function createPopulationGrowthChart() {
    const ctx = document.getElementById('populationGrowthChart').getContext('2d');
    
    populationGrowthChart = new Chart(ctx, {
        type: 'line',
        data: populationData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    title: {
                        display: true,
                        text: 'Nüfus'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Zaman'
                    }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Nüfus Artışı'
                }
            },
            onClick: () => showModal('populationGrowth')
        }
    });
    
    // Grafik kutusuna tıklama olayı ekle
    document.querySelector('.chart-box:nth-child(2)').addEventListener('click', () => showModal('populationGrowth'));
}

// Kıtalara göre nüfus dağılımı grafiği
let continentDistributionChart;
function createContinentDistributionChart() {
    const ctx = document.getElementById('continentDistributionChart').getContext('2d');
    
    continentDistributionChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: continentData.labels,
            datasets: [{
                data: continentData.data,
                backgroundColor: colors.continents,
                borderColor: 'rgba(255, 255, 255, 0.8)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right',
                    labels: {
                        boxWidth: 15
                    }
                },
                title: {
                    display: true,
                    text: 'Kıtalara Göre Nüfus Dağılımı'
                }
            },
            onClick: () => showModal('continentDistribution')
        }
    });
    
    // Grafik kutusuna tıklama olayı ekle
    document.querySelector('.chart-box:nth-child(3)').addEventListener('click', () => showModal('continentDistribution'));
}

// Nüfus artışı grafiğini güncelleme
function updatePopulationGrowthChart() {
    const now = new Date();
    const timeLabel = now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds();
    
    // Son 10 dakika için veri tutma (60 veri noktası, 10 saniyede bir)
    if (populationData.labels.length > 60) {
        populationData.labels.shift();
        populationData.datasets[0].data.shift();
    }
    
    populationData.labels.push(timeLabel);
    populationData.datasets[0].data.push(Math.floor(worldPopulation));
    
    if (populationGrowthChart) {
        populationGrowthChart.update();
    }
    
    // Eğer modal açıksa ve populationGrowth grafiği gösteriliyorsa, modal grafiğini de güncelle
    if (modal && modal.style.display === 'block' && currentChartType === 'populationGrowth') {
        updateModalChart();
    }
}

// Modal penceresini gösterme fonksiyonu
window.showModal = function(chartType) {
    try {
        console.log("showModal çağrıldı:", chartType);
        
        // Geçerli bir grafik türü mü kontrol et
        if (!chartType || !chartDetails[chartType]) {
            console.error("Geçersiz grafik türü:", chartType);
            return;
        }
        
        currentChartType = chartType;
        const details = chartDetails[chartType];
        
        // Modal elemanlarını kontrol et
        if (!modal || !modalTitle || !chartDetailsElement) {
            console.error("Modal elemanları bulunamadı");
            
            // Elemanları tekrar seçmeyi dene
            modal = document.getElementById('chart-modal');
            modalTitle = document.getElementById('modal-title');
            chartDetailsElement = document.getElementById('chart-details');
            closeModalButton = document.querySelector('.close-modal');
            
            if (!modal || !modalTitle || !chartDetailsElement) {
                console.error("Modal elemanları hala bulunamadı, işlem iptal ediliyor");
                return;
            }
        }
        
        modalTitle.textContent = details.title;
        
        // Detay içeriğini oluştur
        let detailsHTML = `<p class="chart-description">${details.description}</p>`;
        detailsHTML += '<div class="chart-facts"><h3>İlginç Bilgiler</h3><ul>';
        
        details.facts.forEach(fact => {
            detailsHTML += `<li>${fact}</li>`;
        });
        
        detailsHTML += '</ul></div>';
        chartDetailsElement.innerHTML = detailsHTML;
        
        // Modal'ı göster
        modal.style.display = 'block';
        console.log("Modal gösteriliyor:", modal.style.display);
        
        // Modal grafiğini güncelle - setTimeout ile biraz geciktirerek DOM'un hazır olmasını sağla
        setTimeout(() => {
            updateModalChart();
        }, 50);
    } catch (error) {
        console.error("Modal gösterme hatası:", error);
    }
}

// Modal grafiğini güncelleme
function updateModalChart() {
    try {
        const modalCanvas = document.getElementById('modal-chart');
        
        // Eğer önceden bir grafik oluşturulmuşsa, onu yok et
        if (window.modalChartInstance) {
            window.modalChartInstance.destroy();
            console.log("Önceki modal grafik yok edildi");
        }
        
        // Eski canvas'ı kaldır ve yenisini oluştur
        const modalChartContainer = document.querySelector('.modal-chart-container');
        modalChartContainer.innerHTML = '';
        
        const newCanvas = document.createElement('canvas');
        newCanvas.id = 'modal-chart';
        modalChartContainer.appendChild(newCanvas);
        
        const ctx = newCanvas.getContext('2d');
        console.log("Yeni modal canvas oluşturuldu");
        
        // Grafik türüne göre yeni grafik oluştur
        switch(currentChartType) {
            case 'birthDeath':
                window.modalChartInstance = new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: ['Doğum', 'Ölüm'],
                        datasets: [{
                            label: 'Saniyede',
                            data: [BIRTHS_PER_SECOND, DEATHS_PER_SECOND],
                            backgroundColor: [colors.births, colors.deaths],
                            borderColor: [
                                'rgba(52, 152, 219, 1)',
                                'rgba(231, 76, 60, 1)'
                            ],
                            borderWidth: 1
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                            y: {
                                beginAtZero: true,
                                title: {
                                    display: true,
                                    text: 'Saniyede'
                                }
                            }
                        },
                        plugins: {
                            title: {
                                display: true,
                                text: 'Saniye Başına Doğum ve Ölüm Oranları'
                            }
                        }
                    }
                });
                break;
            case 'populationGrowth':
                window.modalChartInstance = new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: [...populationData.labels],
                        datasets: [{
                            label: 'Dünya Nüfusu',
                            data: [...populationData.datasets[0].data],
                            borderColor: colors.population,
                            backgroundColor: 'rgba(46, 204, 113, 0.1)',
                            borderWidth: 2,
                            fill: true,
                            tension: 0.4
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                            y: {
                                title: {
                                    display: true,
                                    text: 'Nüfus'
                                }
                            },
                            x: {
                                title: {
                                    display: true,
                                    text: 'Zaman'
                                }
                            }
                        },
                        plugins: {
                            title: {
                                display: true,
                                text: 'Nüfus Artışı'
                            }
                        }
                    }
                });
                break;
            case 'continentDistribution':
                window.modalChartInstance = new Chart(ctx, {
                    type: 'pie',
                    data: {
                        labels: [...continentData.labels],
                        datasets: [{
                            data: [...continentData.data],
                            backgroundColor: colors.continents,
                            borderColor: 'rgba(255, 255, 255, 0.8)',
                            borderWidth: 1
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: {
                                position: 'bottom'
                            },
                            title: {
                                display: true,
                                text: 'Kıtalara Göre Nüfus Dağılımı'
                            }
                        }
                    }
                });
                break;
        }
        console.log("Modal grafik başarıyla oluşturuldu:", currentChartType);
    } catch (error) {
        console.error("Modal grafik oluşturma hatası:", error);
    }
}

// Modal'ı kapatma fonksiyonu
window.closeModal = function() {
    modal.style.display = 'none';
    currentChartType = null;
}

// Sayfa yüklendiğinde grafikleri oluştur
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM yüklendi");
    
    // Global değişkenleri tanımla
    window.modal = document.getElementById('chart-modal');
    window.modalTitle = document.getElementById('modal-title');
    window.chartDetailsElement = document.getElementById('chart-details');
    window.closeModalButton = document.querySelector('.close-modal');
    
    console.log("Modal elemanları:", modal, modalTitle, chartDetailsElement, closeModalButton);
    
    // Modal kapatma düğmesine tıklama olayı ekle
    if (closeModalButton) {
        closeModalButton.addEventListener('click', closeModal);
    } else {
        console.error("Kapatma düğmesi bulunamadı");
    }
    
    // Modal dışına tıklandığında kapatma
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            closeModal();
        }
    });
    
    // Grafikleri oluştur
    try {
        createBirthDeathChart();
        createPopulationGrowthChart();
        createContinentDistributionChart();
        console.log("Grafikler başarıyla oluşturuldu");
    } catch (error) {
        console.error("Grafik oluşturma hatası:", error);
    }
    
    // Nüfus artışı grafiğini periyodik olarak güncelle (10 saniyede bir)
    setInterval(updatePopulationGrowthChart, 10000);
    
    // İlk yükleme için hemen güncelle
    updatePopulationGrowthChart();
}); 