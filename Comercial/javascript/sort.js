// ── Mapa de fotos — chaves batem com os valores dos checkboxes ──
const photos = {
    "GABRIEL MARCELINO":   "img/photos/GABRIEL_MARCELINO.jpg",
    "CURT LUEDERS":        "img/photos/CURT_LUEDERS.jpg",
    "ELIANDRA ALMEIDA":    "img/photos/ELIANDRA_ALMEIDA.jpg",
    "JOSÉ RAIMUNDO":       "img/photos/JOSE_RAIMUNDO.jpg",
    "MAGNO NASCIMENTO":    "img/photos/MAGNO_NASCIMENTO.jpg",
    "MARCELO BARROS":      "img/photos/MARCELO_BARROS.jpg",
    "MARCELO JOSÉ":        "img/photos/MARCELO_JOSE.jpg",
    "MARCELO COSTA":       "img/photos/MARCELO_COSTA.jpg",
    "RAULISON MONTENEGRO": "img/photos/RAULISON_MONTENEGRO.jpg",
    "RAYANE SUERDA":       "img/photos/RAYANE_SUERDA.jpg",
    "THIAGO MEIRELES":     "img/photos/THIAGO_MEIRELES.jpg",
    "PEDRO ALCANTARA":     "img/photos/PEDRO_ALCANTARA.jpg",
    "CLÁUDIO MARCELO":     "img/photos/CLAUDIO_MARCELO.jpg"
};

const TOTAL = 13;
const drawHistory = [];

// ── Atualiza contador ao marcar/desmarcar ──
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
    const photoSrc = photos[name] || '';
    return `
        <div class="winner-card">
            <div class="ring"></div>
            <div class="ring"></div>
            <p class="winner-badge">🎙 ${label}</p>
            <img class="winner-photo" src="${photoSrc}" alt="${name}" onerror="this.style.display='none'">
            <p class="winner-name">${name}</p>
            <p class="winner-number">Sorteio #${drawNumber}</p>
        </div>`;
}

// ── Sorteio principal — sempre sorteia 2 participantes ──
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

// ── Renderiza histórico de sorteios do dia ──
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
