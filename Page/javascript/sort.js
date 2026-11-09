'use strict';
const DEFAULT_PHOTO = "img/photos/DEFAULT.jpg";
const STORAGE_KEY   = "elo-sorteio-historico";
const REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const $  = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];

const photos = {};
let TOTAL = 0;
let drawHistory = [];
let isDrawing = false;
let lastFocus = null;

/* ── Segurança: escapa texto antes de inserir no HTML ── */
function esc(str) {
    return String(str).replace(/[&<>"']/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]));
}

/* ── Normaliza para busca sem acento ── */
const norm = s => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

/* ── Atualiza contador ── */
function updateCount() {
    const n = $$('input[name="item"]:checked').length;
    $('#selCount').textContent = n;
    $('#toggleAllBtn').textContent = n === TOTAL ? 'Desmarcar todos' : 'Selecionar todos';
}

/* ── Selecionar / desmarcar todos (respeita o filtro de busca) ── */
function toggleAll() {
    const boxes = $$('input[name="item"]').filter(b => !b.closest('li').hidden);
    const allOn = boxes.length && boxes.every(b => b.checked);
    boxes.forEach(b => b.checked = !allOn);
    updateCount();
}

/* ── Filtro de busca ── */
function filterList(term) {
    const q = norm(term.trim());
    let visible = 0;
    $$('input[name="item"]').forEach(cb => {
        const show = !q || norm(cb.value).includes(q);
        cb.closest('li').hidden = !show;
        if (show) visible++;
    });
    $('#noResults').hidden = visible > 0;
}

/* ── Fisher-Yates com aleatoriedade criptográfica ── */
function randInt(max) {
    if (window.crypto?.getRandomValues) {
        const buf = new Uint32Array(1);
        const limit = Math.floor(0xFFFFFFFF / max) * max;
        do { crypto.getRandomValues(buf); } while (buf[0] >= limit);
        return buf[0] % max;
    }
    return Math.floor(Math.random() * max);
}
function shuffleArray(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
        const j = randInt(i + 1);
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

/* ── Cards ── */
function cardHtml(prefix, name, label, drawNumber) {
    const n = esc(name);
    const src = esc(photos[name] || DEFAULT_PHOTO);
    const p = prefix === 'modal';
    return `
        <div class="${p ? 'modal-winner-card' : 'winner-card'}">
            <div class="${p ? 'modal-ring modal-ring-1' : 'ring'}"></div>
            <div class="${p ? 'modal-ring modal-ring-2' : 'ring'}"></div>
            <p class="${p ? 'modal-badge' : 'winner-badge'}">🎙 ${esc(label)}</p>
            <img class="${p ? 'modal-photo' : 'winner-photo'}" src="${src}" alt="Foto de ${n}" onerror="this.onerror=null;this.src='${DEFAULT_PHOTO}'">
            <p class="${p ? 'modal-name' : 'winner-name'}">${n}</p>
            <p class="${p ? 'modal-draw-num' : 'winner-number'}">Sorteio #${drawNumber}</p>
        </div>`;
}
const winnerCard      = (n, l, d) => cardHtml('panel', n, l, d);
const modalWinnerCard = (n, l, d) => cardHtml('modal', n, l, d);

/* ── Modal ── */
function abrirModal(html) {
    const ov = $('#modal-overlay');
    $('#modalWinners').innerHTML = html;
    lastFocus = document.activeElement;
    ov.classList.add('modal-active');
    ov.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    setTimeout(() => $('.modal-btn-novo').focus(), 50);
}
function fecharModal() {
    const ov = $('#modal-overlay');
    if (!ov.classList.contains('modal-active')) return;
    ov.classList.remove('modal-active');
    ov.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    lastFocus?.focus();
}
function closeModal(e) {
    if (e.target === $('#modal-overlay')) fecharModal();
}

/* ── Animação de "roleta" antes do resultado ── */
function rollAnimation(names) {
    return new Promise(resolve => {
        if (REDUCED_MOTION) return resolve();
        const resultDiv = $('#result');
        resultDiv.innerHTML = `<div class="rolling"><p class="rolling-label">Sorteando…</p><p class="rolling-name" id="rollName"></p></div>`;
        const el = $('#rollName');
        let delay = 50, elapsed = 0;
        (function tick() {
            el.textContent = names[randInt(names.length)];
            elapsed += delay;
            if (elapsed > 1800) return resolve();
            delay *= 1.08;
            setTimeout(tick, delay);
        })();
    });
}

/* ── Confete (canvas, sem bibliotecas) ── */
function launchConfetti() {
    if (REDUCED_MOTION) return;
    const canvas = $('#confetti-canvas');
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    canvas.width = innerWidth * dpr; canvas.height = innerHeight * dpr;
    ctx.scale(dpr, dpr);
    const colors = ['#2CBA80', '#4dd9a0', '#f0f4ff', '#ffd166', '#8a9bbf'];
    const parts = Array.from({ length: 180 }, () => ({
        x: innerWidth / 2 + (Math.random() - .5) * 200,
        y: innerHeight / 2.5,
        vx: (Math.random() - .5) * 16,
        vy: Math.random() * -14 - 4,
        w: 6 + Math.random() * 6, h: 4 + Math.random() * 4,
        r: Math.random() * Math.PI, vr: (Math.random() - .5) * .3,
        c: colors[randInt(colors.length)]
    }));
    const start = performance.now();
    (function frame(t) {
        ctx.clearRect(0, 0, innerWidth, innerHeight);
        const life = t - start;
        parts.forEach(p => {
            p.vy += .35; p.vx *= .99; p.x += p.vx; p.y += p.vy; p.r += p.vr;
            ctx.save();
            ctx.globalAlpha = Math.max(0, 1 - life / 3200);
            ctx.translate(p.x, p.y); ctx.rotate(p.r);
            ctx.fillStyle = p.c; ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
            ctx.restore();
        });
        if (life < 3200) requestAnimationFrame(frame);
        else ctx.clearRect(0, 0, innerWidth, innerHeight);
    })(start);
}

/* ── Sorteio principal — sorteia 2 participantes ── */
async function sortRandomly() {
    if (isDrawing) return;
    const checked = $$('input[name="item"]:checked');
    const resultDiv = $('#result');
    if (checked.length < 2) {
        resultDiv.innerHTML = '<p class="error-msg" role="alert">⚠️ Selecione ao menos 2 participantes antes de sortear.</p>';
        return;
    }
    isDrawing = true;
    const btn = $('#btnSortear');
    btn.disabled = true;

    const names = checked.map(c => c.value);
    await rollAnimation(names);

    const [name1, name2] = shuffleArray(names);
    const drawNumber = drawHistory.length + 1;
    const hora = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    drawHistory.push({ n: drawNumber, names: `${name1} & ${name2}`, hora });
    saveHistory();
    renderHistory();

    resultDiv.innerHTML = `
        <div class="winners-grid">
            ${winnerCard(name1, '1º Orador', drawNumber)}
            ${winnerCard(name2, '2º Orador', drawNumber)}
        </div>`;
    abrirModal(modalWinnerCard(name1, '1º Orador', drawNumber) + modalWinnerCard(name2, '2º Orador', drawNumber));
    launchConfetti();

    btn.disabled = false;
    isDrawing = false;
}

/* ── Histórico (persistido no dia) ── */
function todayKey() { return new Date().toISOString().slice(0, 10); }
function saveHistory() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ day: todayKey(), items: drawHistory })); } catch {}
}
function loadHistory() {
    try {
        const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
        if (data?.day === todayKey()) drawHistory = data.items || [];
    } catch {}
}
function clearHistory() {
    if (!confirm('Limpar o histórico do dia?')) return;
    drawHistory = [];
    saveHistory();
    $('#history-section').hidden = true;
}
function renderHistory() {
    const section = $('#history-section');
    if (!drawHistory.length) { section.hidden = true; return; }
    section.hidden = false;
    $('#historyList').innerHTML = [...drawHistory].reverse().map(h => `
        <div class="history-item">
            <span class="history-num">${h.n}</span>
            <strong>${esc(h.names)}</strong>
            ${h.hora ? `<time>${esc(h.hora)}</time>` : ''}
        </div>`).join('');
}

/* ── Inicialização ── */
document.addEventListener('DOMContentLoaded', () => {
    const boxes = $$('input[name="item"]');
    TOTAL = boxes.length;
    $('#totalCount').textContent = TOTAL;
    boxes.forEach(cb => {
        photos[cb.value] = cb.nextElementSibling?.querySelector('img')?.getAttribute('src') || DEFAULT_PHOTO;
        cb.addEventListener('change', updateCount);
    });
    // Fallback de foto nas miniaturas
    $$('.avatar-thumb').forEach(img => img.addEventListener('error', () => { img.src = DEFAULT_PHOTO; }, { once: true }));

    $('#search').addEventListener('input', e => filterList(e.target.value));
    updateCount();
    loadHistory();
    renderHistory();
});

/* ── Teclado: ESC fecha, Enter sorteia, Tab preso no modal ── */
document.addEventListener('keydown', e => {
    const modalOpen = $('#modal-overlay').classList.contains('modal-active');
    if (e.key === 'Escape') return fecharModal();
    if (e.key === 'Enter' && !modalOpen && !['INPUT','BUTTON','LABEL'].includes(e.target.tagName)) {
        e.preventDefault(); sortRandomly();
    }
    if (e.key === 'Tab' && modalOpen) {
        const f = $$('#modal-overlay button');
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
});
