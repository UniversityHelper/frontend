const mockData = [
    { name: "Прикладная математика и информатика", uni: "МГУ", city: "Москва", score: 305, budget: 120, contract: 40, profile: "IT и Математика" },
    { name: "Фундаментальная информатика и информационные технологии", uni: "УрФУ", city: "Екатеринбург", score: 279, budget: 120, contract: 20, profile: "IT" },
    { name: "Разработка программно-информационных систем (очень длинное название для проверки обрезки текста)", uni: "ИТМО", city: "Санкт-Петербург", score: 295, budget: 80, contract: 150, profile: "IT и Математика" },
    { name: "Строительство высотных зданий", uni: "МГСУ", city: "Москва", score: 235, budget: 250, contract: 100, profile: "Строительство" },
    { name: "Биоинженерия", uni: "СПбГУ", city: "Санкт-Петербург", score: 280, budget: 30, contract: 20, profile: "Биология" },
    { name: "Информационная безопасность", uni: "МГТУ Баумана", city: "Москва", score: 290, budget: 100, contract: 50, profile: "IT и Математика" }
];//TODO тут потом подвяжем бэк

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