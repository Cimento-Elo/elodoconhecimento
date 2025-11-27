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

    sortedItems.forEach((item) => {
        const name = item;
        const photoUrl = `img/photos2/${item}.JPG`;

        const itemDiv = document.createElement('div');

        itemDiv.innerHTML = `
            <img id="photos" src="${photoUrl}" alt="${name}" height="400" width="300"
                 onerror="this.style.display='none'; this.parentNode.innerHTML='<h2 style=\'font-size:45px;font-weight:bold;text-align:center;margin-top:80px;\'>${name}</h2>';">
            
            <style>
                @keyframes fadeOut {
                    0% { opacity: 0; }
                    100% { opacity: 1; }
                }

                #photos {
                    border-radius: 50px;
                    justify-content: center;
                    box-shadow: 3px 3px 10px black;
                    opacity: 0;
                    animation: fadeOut 5s ease-in-out forwards; 
                }
            </style>
        `;

        resultContainer.appendChild(itemDiv);
    });
}
