
function sortRandomly() {
    // Get all selected checkboxes
    const checkboxes = document.querySelectorAll('input[name="item"]:checked');

    if (checkboxes.length < 2) {
        alert('------>>>> ESCOLHA AO MENOS 2 PARTICIPANTES <<<<------');
        return;
    }

    // Create an array to hold selected items
    const selectedItems = [];

    checkboxes.forEach((checkbox) => {
        selectedItems.push(checkbox.value);
    });

    // Randomly shuffle the selected items
    const shuffledItems = shuffleArray(selectedItems);

    // Display the result
    displayResult(shuffledItems.slice(0, 2)); // Display the first two sorted items
}

function shuffleArray(array) {
    // Randomly shuffle the array using the Fisher-Yates algorithm
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
        const name = item; // You can modify this to get the actual name based on the item if needed
        const photoUrl = `img/photos2/${item}.jpg`; // Assuming photos are named after the items

        const itemDiv = document.createElement('div');
        itemDiv.innerHTML = `
        <img id="photos" src="${photoUrl}" alt="${name}" height="330" width="330"><br><br><br>
        <style>
        
        @keyframes fadeOut {
            0% {
              opacity: 0;
            }
            100% {
              opacity: 1;
            }
          }

        #photos {
            border-bottom-left-radius: 50px;
            border-bottom-right-radius: 50px;
            border-top-left-radius: 50px;
            border-top-right-radius: 50px;
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
