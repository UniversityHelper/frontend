const mockData = [
    //  УРФУ 
    { name: "Фундаментальная информатика и информационные технологии", uni: "УрФУ", city: "Екатеринбург", score: 273, budget: 120, contract: 40, profile: "IT" },
    { name: "Программная инженерия", uni: "УрФУ", city: "Екатеринбург", score: 264, budget: 100, contract: 50, profile: "IT" },
    { name: "Информатика и вычислительная техника (AI)", uni: "УрФУ", city: "Екатеринбург", score: 246, budget: 110, contract: 45, profile: "IT" },
    { name: "Прикладная математика", uni: "УрФУ", city: "Екатеринбург", score: 218, budget: 90, contract: 35, profile: "Математика" },
    { name: "Строительство", uni: "УрФУ", city: "Екатеринбург", score: 213, budget: 150, contract: 80, profile: "Строительство" },
    
    //  ИТМО
    { name: "Прикладная математика и информатика", uni: "ИТМО", city: "Санкт-Петербург", score: 305, budget: 80, contract: 120, profile: "IT" },
    { name: "Программная инженерия", uni: "ИТМО", city: "Санкт-Петербург", score: 284, budget: 90, contract: 110, profile: "IT" },
    { name: "Информационные системы и технологии", uni: "ИТМО", city: "Санкт-Петербург", score: 282, budget: 85, contract: 100, profile: "IT" },
    { name: "Информационная безопасность", uni: "ИТМО", city: "Санкт-Петербург", score: 275, budget: 60, contract: 50, profile: "IT" },
    { name: "Физика", uni: "ИТМО", city: "Санкт-Петербург", score: 282, budget: 70, contract: 40, profile: "Физика" },
    
    //  МГСУ 
    { name: "Строительство (Промышленное и гражданское)", uni: "МГСУ", city: "Москва", score: 259, budget: 200, contract: 150, profile: "Строительство" },
    { name: "Архитектура", uni: "МГСУ", city: "Москва", score: 169, budget: 50, contract: 80, profile: "Архитектура" },
    { name: "Градостроительство", uni: "МГСУ", city: "Москва", score: 169, budget: 60, contract: 70, profile: "Архитектура" },
    { name: "Прикладная математика (Цифровое проектирование)", uni: "МГСУ", city: "Москва", score: 226, budget: 70, contract: 50, profile: "Математика" },
    { name: "Реконструкция и реставрация", uni: "МГСУ", city: "Москва", score: 162, budget: 40, contract: 40, profile: "Архитектура" },
    
    //  МГТУ БАУМАНА 
    { name: "Прикладная математика и информатика", uni: "МГТУ Баумана", city: "Москва", score: 295, budget: 100, contract: 60, profile: "IT" },
    { name: "Прикладная математика (ИИ)", uni: "МГТУ Баумана", city: "Москва", score: 287, budget: 90, contract: 55, profile: "Математика" },
    { name: "Информатика и вычислительная техника", uni: "МГТУ Баумана", city: "Москва", score: 262, budget: 110, contract: 70, profile: "IT" },
    { name: "Механика и математическое моделирование", uni: "МГТУ Баумана", city: "Москва", score: 271, budget: 80, contract: 45, profile: "Математика" },
    { name: "Математика и компьютерные науки", uni: "МГТУ Баумана", city: "Москва", score: 277, budget: 85, contract: 50, profile: "IT" },
    
    //  СПБГУ 
    { name: "Прикладная математика и информатика (Современное программирование)", uni: "СПбГУ", city: "Санкт-Петербург", score: 293, budget: 75, contract: 65, profile: "IT" },
    { name: "Математика и компьютерные науки (AI360)", uni: "СПбГУ", city: "Санкт-Петербург", score: 297, budget: 70, contract: 60, profile: "IT" },
    { name: "Математика", uni: "СПбГУ", city: "Санкт-Петербург", score: 279, budget: 80, contract: 50, profile: "Математика" },
    { name: "Фундаментальная информатика", uni: "СПбГУ", city: "Санкт-Петербург", score: 258, budget: 85, contract: 55, profile: "IT" },
    { name: "Прикладная математика и информатика (Процессы управления)", uni: "СПбГУ", city: "Санкт-Петербург", score: 228, budget: 90, contract: 60, profile: "Математика" },
    
    { name: "Разработка программно-информационных систем (очень длинное название для проверки обрезки текста)", uni: "ИТМО", city: "Санкт-Петербург", score: 295, budget: 80, contract: 150, profile: "IT" },
    { name: "Строительство высотных зданий", uni: "МГСУ", city: "Москва", score: 235, budget: 250, contract: 100, profile: "Строительство" },
    { name: "Биоинженерия", uni: "СПбГУ", city: "Санкт-Петербург", score: 280, budget: 30, contract: 20, profile: "Биология" },
    { name: "Информационная безопасность", uni: "МГТУ Баумана", city: "Москва", score: 290, budget: 100, contract: 50, profile: "IT" }
];

const list = document.getElementById('list-container');
const count = document.getElementById('results-count');
const fCity = document.getElementById('filter-city');
const fUni = document.getElementById('filter-uni');
const fProfile = document.getElementById('filter-profile');
const fScore = document.getElementById('filter-score');
const sScore = document.getElementById('sort-score');

function init() {
    // Авто-заполнение фильтров
    fillFilter(fCity, 'city');
    fillFilter(fUni, 'uni');
    fillFilter(fProfile, 'profile');

    [fCity, fUni, fProfile, sScore].forEach(el => el.addEventListener('change', render));
    fScore.addEventListener('input', render);

    render();
}

function fillFilter(el, key) {
    const values = [...new Set(mockData.map(d => d[key]))].sort();
    values.forEach(v => {
        const opt = document.createElement('option');
        opt.value = v;
        opt.textContent = v;
        el.appendChild(opt);
    });
}

function render() {
    const maxScore = parseInt(fScore.value);

    let filtered = mockData.filter(d => {
        return (fCity.value === "" || d.city === fCity.value) &&
            (fUni.value === "" || d.uni === fUni.value) &&
            (fProfile.value === "" || d.profile === fProfile.value) &&
            (isNaN(maxScore) || d.score <= maxScore);
    });

    filtered.sort((a, b) => sScore.value === 'desc' ? b.score - a.score : a.score - b.score);

    list.innerHTML = '';
    count.textContent = `Найдено: ${filtered.length}`;

    if (!filtered.length) {
        list.innerHTML = `<p style="text-align:center; padding:50px;">Ничего не нашлось :(</p>`;
        return;
    }

    filtered.forEach(d => {
        list.innerHTML += `
            <div class="card">
                <div>
                    <div class="spec-title" title="${d.name}">${d.name}</div>
                    <div class="uni-sub"><b>${d.uni}</b> — ${d.city}</div>
                </div>
                <div class="score-val">${d.score}</div>
                <div class="places-box">
                    <span class="budget-val">Бюджет: ${d.budget}</span>
                    <span>Платно: ${d.contract}</span>
                </div>
            </div>
        `;
    });
}

document.addEventListener('DOMContentLoaded', init);