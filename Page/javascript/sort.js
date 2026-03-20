// ── Mapa de fotos — todos os 34 participantes ──
const DEFAULT_PHOTO = "img/photos/DEFAULT.jpg";

const photos = {
    "Andre Lima":           DEFAULT_PHOTO,
    "Anderson Pereira":     "img/photos/ANDERSON_PEREIRA.jpg",
    "Assis Cosme":          "img/photos/ASSIS_COSME.jpg",
    "Adriano Santos":       DEFAULT_PHOTO,
    "Bruno Medeiros":       "img/photos/BRUNO_MEDEIROS.jpg",
    "Cristina Farache":     "img/photos/CRISTINA_FARACHE.jpg",
    "Cleber Dias":          "img/photos/CLEBER_DIAS.jpg",
    "Curt Lueders":         "img/photos/CURT_LUEDERS.jpg",
    "Eliandra Almeida":     "img/photos/ELIANDRA_ALMEIDA.jpg",
    "Edson Mendes":         "img/photos/EDSON_MENDES.jpg",
    "Erika Araujo":         DEFAULT_PHOTO,
    "Fernanda Bezerra":     DEFAULT_PHOTO,
    "Fernando Arthur":      "img/photos/FERNANDO_ARTHUR.jpg",
    "Flávio Campelo":       "img/photos/FLAVIO_CAMPELO.jpg",
    "Gilliano Nascimento":  DEFAULT_PHOTO,
    "Isabelle Raniele":     DEFAULT_PHOTO,
    "Janymara Rosane":      DEFAULT_PHOTO,
    "João Paulo":           "img/photos/JOAO_PAULO.jpg",
    "José Lucas":           "img/photos/JOSE_LUCAS.jpg",
    "Leonardo Barreto":     DEFAULT_PHOTO,
    "Luis Manoel":          DEFAULT_PHOTO,
    "Luandson Dantas":      DEFAULT_PHOTO,
    "Marcelo José":         "img/photos/MARCELO_JOSE.jpg",
    "Marcelo Barros":       "img/photos/MARCELO_BARROS.jpg",
    "Mayane Sousa":         DEFAULT_PHOTO,
    "Nadja Lopes":          DEFAULT_PHOTO,
    "Nixon Aquino":         "img/photos/NIXON_AQUINO.jpg",
    "Patricia Araujo":      DEFAULT_PHOTO,
    "Paulo Eduardo":        "img/photos/PAULO_EDUARDO.jpg",
    "Renata Oliveira":      "img/photos/RENATA_OLIVEIRA.jpg",
    "Renato Abner":         "img/photos/RENATO_ABNER.jpg",
    "Rudy Santos":          "img/photos/RUDY_SANTOS.jpg",
    "Tâmara Castro":        "img/photos/TAMARA_CASTRO.jpg",
    "Virginia Torres":      DEFAULT_PHOTO
};

const TOTAL = 34;
const drawHistory = [];

// ── Atualiza contador ──
function updateCount() {
    const n = document.querySelectorAll('input[name="item"]:checked').length;
    document.getElementById('selCount').textContent = n;
    document.getElementById('toggleAllBtn').textContent =
        n === TOTAL ? 'Desmarcar todos' : 'Selecionar todos';
}

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('input[name="item"]').forEach(cb => {
        cb.addEventListener('change', updateCount);
    });
});

// ── Selecionar / desmarcar todos ──
function toggleAll() {
    const boxes = document.querySelectorAll('input[name="item"]');
    const allOn = [...boxes].every(b => b.checked);
    boxes.forEach(b => b.checked = !allOn);
    updateCount();
}

// ── Fisher-Yates shuffle ──
function shuffleArray(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

// ── Gera HTML de um card de vencedor ──
function winnerCard(name, label, drawNumber) {
    const photoSrc = photos[name] || DEFAULT_PHOTO;
    return `
        <div class="winner-card">
            <div class="ring"></div>
            <div class="ring"></div>
            <p class="winner-badge">🎙 ${label}</p>
            <img class="winner-photo" src="${photoSrc}" alt="${name}" onerror="this.src='${DEFAULT_PHOTO}'">
            <p class="winner-name">${name}</p>
            <p class="winner-number">Sorteio #${drawNumber}</p>
        </div>`;
}

// ── Sorteio principal — sorteia 2 participantes ──
function sortRandomly() {
    const checked = [...document.querySelectorAll('input[name="item"]:checked')];
    const resultDiv = document.getElementById('result');

    if (checked.length < 2) {
        resultDiv.innerHTML = '<p class="error-msg">⚠️ Selecione ao menos 2 participantes antes de sortear.</p>';
        return;
    }

    const shuffled = shuffleArray(checked);
    const name1 = shuffled[0].value;
    const name2 = shuffled[1].value;
    const drawNumber = drawHistory.length + 1;

    drawHistory.push({ n: drawNumber, names: `${name1} & ${name2}` });
    renderHistory();

    resultDiv.innerHTML = `
        <div class="winners-grid">
            ${winnerCard(name1, '1º Orador', drawNumber)}
            ${winnerCard(name2, '2º Orador', drawNumber)}
        </div>`;
}

// ── Histórico ──
function renderHistory() {
    const section = document.getElementById('history-section');
    const list = document.getElementById('historyList');
    section.style.display = 'block';
    list.innerHTML = [...drawHistory].reverse().map(h => `
        <div class="history-item">
            <span class="history-num">${h.n}</span>
            <strong>${h.names}</strong>
        </div>`).join('');
}
