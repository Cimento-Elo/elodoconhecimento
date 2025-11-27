function sortRandomly() {
    const checkboxes = document.querySelectorAll('input[name="item"]:checked');

    if (checkboxes.length < 2) {
        alert('------>>>> ESCOLHA AO MENOS 2 PARTICIPANTES <<<<------');
        return;
    }

    const selectedItems = Array.from(checkboxes).map(c => c.value);
    const shuffledItems = shuffleArray(selectedItems);

    displayResult(shuffledItems.slice(0, 2));
}

function shuffleArray(array) {
    const shuffled = array.slice();
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

function displayResult(sortedItems) {
    const resultContainer = document.getElementById('result');
    resultContainer.innerHTML = '';

    sortedItems.forEach(item => {
        const name = item;
        const photoUrl = `img/photos2/${item}.JPG`;
        const defaultPhoto = "img/default.png";  // <- precisa existir

        const itemDiv = document.createElement('div');
        itemDiv.innerHTML = `
            <div class="personBox">
                <img class="photo" src="${photoUrl}" onerror="this.src='${defaultPhoto}'">
                <div class="personName">${name}</div>
            </div>
        `;
        resultContainer.appendChild(itemDiv);
    });
}
