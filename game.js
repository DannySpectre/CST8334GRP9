let deckId;
let cards;
let remainingCards;

async function createDeck() {
  try {
    const response = await fetch(
      "https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1"
    );
    const data = await response.json();
    deckId = data.deck_id;
    await drawCards(28);
    createTableau(cards);
  } catch (error) {
    console.log("Error Creating Deck", error);
  }
}

document.getElementById("shuffle").onclick = async function () {
  let response = await fetch(
    "https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1&remaining=true"
  );
  let data = await response.json();

  let drawResponse = await fetch(
    `https://deckofcardsapi.com/api/deck/${data.deck_id}/draw/?count=${remainingCards}`
  );
  let drawData = await drawResponse.json();

  console.log("Deck of Cards:", cards);
};

async function drawCards(count) {
  try {
    const response = await fetch(
      `https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=${count}`
    );
    const data = await response.json();
    cards = data.cards;
    remainingCards = data.remaining; // Update remaining cards
    console.log(remainingCards, "cards remaining in the deck");
    console.log("Deck of Cards:", cards);
  } catch (error) {
    console.log("Error drawing cards:", error);
  }
}

let selectedCard = null;

function flipLastCard(column) {
  const cardsInColumn = column.querySelectorAll(".rounded");
  const lastCard = cardsInColumn[cardsInColumn.length - 1];
  if (lastCard) {
    let cardValue = lastCard.getAttribute("data-value");
    lastCard.innerHTML = `<img src="https://deckofcardsapi.com/static/img/${cardValue}.png" alt="${cardValue}">`;
  }
}

function createTableau(cards) {
  const deck = document.getElementById("deck");
  deck.innerHTML = `<img src="src/back.png" alt="Card Back">`;
  const tableau = document.getElementById("tableau");
  tableau.innerHTML = "";

  for (let i = 0; i < 7; i++) {
    let column = document.createElement("div");
    column.className = "";

    for (let j = 0; j <= i; j++) {
      let card = document.createElement("div");

      let cardValue = cards[(i * (i + 1)) / 2 + j].code;
      card.className = "rounded w-[150px] h-[200px] pt-2";
      card.setAttribute("data-value", cardValue); // Store card value for later

      if (j === i) {
        // Card is face up
        card.innerHTML = `<img src="https://deckofcardsapi.com/static/img/${cardValue}.png" alt="${cardValue}">`;
      } else {
        // Card is face down
        card.innerHTML = `<img src="src/back.png" alt="Card Back">`;
      }

      card.onclick = function () {
        console.log(`Card clicked: ${cardValue}`);
        if (selectedCard) {
      
          // Move selected card to this column
          const oldColumn = selectedCard.parentNode;
          column.appendChild(selectedCard);
          flipLastCard(oldColumn); // Flip last card in old column
          selectedCard = null;
        } else {
          selectedCard = card;
        }
      };
      column.appendChild(card);
    }

    tableau.appendChild(column);
  }
}