//* Variables
let deckID;
let houseCard;
let playerCard;
let gameMessage;
let playerPoints = 0;
let housePoints = 0;
const cardArea = document.getElementById("card-container");
const newDeck = document.getElementById("new-deck");
const drawCard = document.getElementById("draw-card");
const messageArea = document.getElementById("game-message");
const cardsLeft = document.getElementById("cards-remaining");
const playerScore = document.getElementById("playerPoints");
const houseScore = document.getElementById("housePoints");
const openModal = document.getElementById("openModal");
const modal = document.querySelector(".modal");
const closeModal = document.getElementById("modal-exit");

//* API Calls
const handleNewDeckClick = () => {
	fetch("https://www.deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1")
		.then((response) => response.json())
		.then((data) => {
			console.log(data);
			deckID = data.deck_id;
			disableDrawCardBtn(data);
		});

	newDeck.textContent = "Reset Your Deck";
	newDeck.classList.remove("breathe");
	drawCard.classList.add("breathe");

	playerPoints = 0;
	housePoints = 0;
};

const handleDrawCardClick = () => {
	fetch(`https://www.deckofcardsapi.com/api/deck/${deckID}/draw/?count=2`)
		.then((response) => response.json())
		.then((data) => {
			houseCard = data.cards[0].value;
			playerCard = data.cards[1].value;
			console.log(data.cards);
			cardArea.children[0].innerHTML = `
			<img src=${data.cards[0].image} class="card" />
		`;
			cardArea.children[1].innerHTML = `
		<img src=${data.cards[1].image} class="card" />
		`;
			cardCompare(houseCard, playerCard, data);

			messageArea.textContent = gameMessage;
			cardsLeft.textContent = `Cards Left: ${data.remaining}`;

			disableDrawCardBtn(data);
		});

	setTimeout(() => {
		scoreKeeper();
	}, 500);
};

//* Compare Drawn Cards
const cardCompare = (cardOne, cardTwo, cardsLeft) => {
	const cardValueOptions = [
		"2",
		"3",
		"4",
		"5",
		"6",
		"7",
		"8",
		"9",
		"10",
		"JACK",
		"QUEEN",
		"KING",
		"ACE",
	];

	const cardOneValueIndex = cardValueOptions.indexOf(cardOne);
	const cardTwoValueIndex = cardValueOptions.indexOf(cardTwo);

	if (cardOneValueIndex > cardTwoValueIndex) {
		gameMessage = "House Card Wins";
		housePoints += 1;
	} else if (cardOneValueIndex < cardTwoValueIndex) {
		gameMessage = "Player Card Wins";
		playerPoints += 1;
	} else {
		gameMessage = "It's a tie!";
	}

	if (cardsLeft.remaining === 0) {
		if (housePoints > playerPoints) {
			gameMessage = "The House Won The War!";
		} else if (housePoints < playerPoints) {
			gameMessage = "You Beat The House!";
		} else if (housePoints === playerPoints) {
			gameMessage = "You Tied With The House!";
		}
	}
};

//* Displays Score
const scoreKeeper = () => {
	houseScore.textContent = `House Score: ${housePoints}`;
	playerScore.textContent = `Player Score: ${playerPoints}`;
};

//* Disables Draw Card Button
const disableDrawCardBtn = (cards) => {
	if (cards.remaining === 0) {
		drawCard.disabled = true;
		drawCard.classList.add("disabled");
		drawCard.classList.remove("breathe");
		newDeck.classList.add("breathe");
	} else if (cards.remaining === 52) {
		drawCard.disabled = false;
		drawCard.classList.remove("disabled");
		drawCard.classList.add("breathe");
		newDeck.classList.remove("breathe");
	}
};

//* Event Listeners
newDeck.addEventListener("click", handleNewDeckClick);
drawCard.addEventListener("click", handleDrawCardClick);

//* Modal - Event Listeners
openModal.addEventListener("click", () => {
	modal.style.display = "block";
});

closeModal.addEventListener("click", () => {
	modal.style.display = "none";
});
