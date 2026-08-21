// ── Mapa de fotos — todos os 34 participantes ──
const DEFAULT_PHOTO = "img/photos/DEFAULT.jpg";

const photos = {
    "Andre Lima":           DEFAULT_PHOTO,
    "Anderson Pereira":     "img/photos/ANDERSON_PEREIRA.jpg",
    "Assis Cosme":          "img/photos/ASSIS_COSME.jpg",
    "Adriano Santos":       DEFAULT_PHOTO,
    "Bruno Medeiros":       "img/photos/BRUNO_MEDEIROS.jpg",
    "Cristina Farache":     "img/photos/CRISTINA_FARACHE.jpg",
    "Darc Lays":            DEFAULT_PHOTO,
    "Cleber Dias":          "img/photos/CLEBER_DIAS.jpg",
    "Curt Lueders":         "img/photos/CURT_LUEDERS.jpg",
    "Eliandra Almeida":     "img/photos/ELIANDRA_ALMEIDA.jpg",
    "Edivânio Erasmo":      DEFAULT_PHOTO,
    "Edson Mendes":         "img/photos/EDSON_MENDES.jpg",
    "Erika Araujo":         DEFAULT_PHOTO,
    "Fernanda Bezerra":     DEFAULT_PHOTO,
    "Fernando Arthur":      "img/photos/FERNANDO_ARTHUR.jpg",
    "Fernando Veloso":      DEFAULT_PHOTO,
    "Flávio Campelo":       "img/photos/FLAVIO_CAMPELO.jpg",
    "Gilliano Nascimento":  DEFAULT_PHOTO,
    "Isabelle Raniele":     DEFAULT_PHOTO,
    "Janymara Rosane":      DEFAULT_PHOTO,
    "José Lucas":           "img/photos/JOSE_LUCAS.jpg",
    "Jeferson":             DEFAULT_PHOTO,
    "Leonardo Barreto":     DEFAULT_PHOTO,
    "Luis Manoel":          DEFAULT_PHOTO,
    "Luthyere":             DEFAULT_PHOTO,
    "Luandson Dantas":      DEFAULT_PHOTO,
    "Marcelo José":         "img/photos/MARCELO_JOSE.jpg",
    "Marcelo Barros":       "img/photos/MARCELO_BARROS.jpg",
    "Mayane Sousa":         DEFAULT_PHOTO,
    "Nadja Lopes":          DEFAULT_PHOTO,
    "Nayara Gomes":         DEFAULT_PHOTO,
    "Nixon Aquino":         "img/photos/NIXON_AQUINO.jpg",
    "Patricia Araujo":      DEFAULT_PHOTO,
    "Paulo Eduardo":        "img/photos/PAULO_EDUARDO.jpg",
    "Renata Oliveira":      "img/photos/RENATA_OLIVEIRA.jpg",
    "Renato Abner":         "img/photos/RENATO_ABNER.jpg",
    "Rodrigo Goncalves":    DEFAULT_PHOTO,
    "Rurien":               DEFAULT_PHOTO,
    "Rudy Santos":          "img/photos/RUDY_SANTOS.jpg",
    "Tâmara Castro":        "img/photos/TAMARA_CASTRO.jpg",
    "Virginia Torres":      DEFAULT_PHOTO
};

const TOTAL = 41;
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

// ── Gera HTML de um card de vencedor para o MODAL ──
function modalWinnerCard(name, label, drawNumber) {
    const photoSrc = photos[name] || DEFAULT_PHOTO;
    return `
        <div class="modal-winner-card">
            <div class="modal-ring modal-ring-1"></div>
            <div class="modal-ring modal-ring-2"></div>
            <p class="modal-badge">🎙 ${label}</p>
            <img class="modal-photo" src="${photoSrc}" alt="${name}" onerror="this.src='${DEFAULT_PHOTO}'">
            <p class="modal-name">${name}</p>
            <p class="modal-draw-num">Sorteio #${drawNumber}</p>
        </div>`;
}

// ── Abre o modal ──
function abrirModal(html) {
    document.getElementById('modalWinners').innerHTML = html;
    document.getElementById('modal-overlay').classList.add('modal-active');
    document.body.style.overflow = 'hidden';
}

// ── Fecha o modal ──
function fecharModal() {
    document.getElementById('modal-overlay').classList.remove('modal-active');
    document.body.style.overflow = '';
}

// ── Fecha ao clicar fora do box ──
function closeModal(e) {
    if (e.target === document.getElementById('modal-overlay')) fecharModal();
}

// ── Fecha com ESC ──
document.addEventListener('keydown', e => { if (e.key === 'Escape') fecharModal(); });

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

    // Atualiza painel lateral (mantém estrutura original)
    resultDiv.innerHTML = `
        <div class="winners-grid">
            ${winnerCard(name1, '1º Orador', drawNumber)}
            ${winnerCard(name2, '2º Orador', drawNumber)}
        </div>`;

    // Abre modal com destaque em tela cheia
    const modalHtml =
        modalWinnerCard(name1, '1º Orador', drawNumber) +
        modalWinnerCard(name2, '2º Orador', drawNumber);
    abrirModal(modalHtml);
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
