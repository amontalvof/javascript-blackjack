const myModule = (() => {
    /*
     * 2C = Two of Clubs
     * 2D = Two of Diamonds
     * 2H = Two of Hearts
     * 2S = Two of Spades
     */

    'use strict';

    let deck = [],
        arrayPlayerPoints = [];
    const types = ['C', 'D', 'H', 'S'],
        specials = ['A', 'J', 'Q', 'K'];

    // HTML references
    const btnHit = document.querySelector('#btnHit'),
        btnStand = document.querySelector('#btnStand'),
        btnNew = document.querySelector('#btnNew'),
        divPlayersCards = document.querySelectorAll('.divCards'),
        htmlPoints = document.querySelectorAll('small');

    // this function initialize the game
    const initializeGame = (playersNumber = 2) => {
        deck = createDeck();
        arrayPlayerPoints = [];
        for (let i = 0; i < playersNumber; i++) {
            arrayPlayerPoints.push(0);
        }
        htmlPoints.forEach((elem) => (elem.innerText = 0));
        divPlayersCards.forEach((elem) => (elem.innerHTML = ''));
        btnHit.disabled = false;
        btnStand.disabled = false;
        console.clear();
    };

    // this function creates a new deck
    const createDeck = () => {
        deck = [];
        for (let i = 2; i <= 10; i++) {
            for (const type of types) {
                deck.push(i + type);
            }
        }
        for (const type of types) {
            for (const special of specials) {
                deck.push(special + type);
            }
        }
        return _.shuffle(deck);
    };

    // this function allows me to take a card
    const askCard = () => {
        if (deck.length === 0) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'There are no cards in the deck!',
            });
            throw 'There are no cards in the deck!';
        }
        return deck.pop();
    };

    // this function returns the amount of points of a card
    const cardValue = (card) => {
        const value = card.substring(0, card.length - 1);
        let points = 0;
        if (isNaN(value)) {
            points = value === 'A' ? 11 : 10;
        } else {
            points = Number(value);
        }
        return points;
    };

    // Turn: 0 = first player and the last is the computer
    const accumulatePoints = (card, turn) => {
        arrayPlayerPoints[turn] = arrayPlayerPoints[turn] + cardValue(card);
        htmlPoints[turn].innerText = arrayPlayerPoints[turn];
        return arrayPlayerPoints[turn];
    };

    // this function show the card in the html
    const createCard = (card, turn) => {
        const imgCard = document.createElement('img');
        imgCard.src = `assets/cartas/${card}.png`;
        imgCard.classList.add('blackjack-card');
        imgCard.classList.add('animate__animated');
        imgCard.classList.add('animate__bounceInRight');
        divPlayersCards[turn].append(imgCard);
    };

    const determineWinner = () => {
        const [minimumPoints, computerPoints] = arrayPlayerPoints;
        if (computerPoints === minimumPoints) {
            Swal.fire({
                icon: 'info',
                title: 'Oops...',
                text: 'Nobody won the game!',
            });
        } else if (minimumPoints > 21) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: "I'm sorry, you lost!",
            });
        } else if (computerPoints > 21) {
            Swal.fire({
                icon: 'success',
                title: 'Great...',
                text: 'You won the game!',
            });
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: "I'm sorry, you lost!",
            });
        }
    };

    // computer turn to play
    const computerTurn = (minimumPoints) => {
        let computerPoints = 0;
        do {
            const card = askCard();
            computerPoints = accumulatePoints(
                card,
                arrayPlayerPoints.length - 1
            );
            createCard(card, arrayPlayerPoints.length - 1);
        } while (computerPoints < minimumPoints && minimumPoints <= 21);
        determineWinner();
    };

    // Events
    btnHit.addEventListener('click', () => {
        const card = askCard();
        const playerPoints = accumulatePoints(card, 0);
        createCard(card, 0);

        if (playerPoints > 21) {
            btnHit.disabled = true;
            btnStand.disabled = true;
            computerTurn(playerPoints);
            console.error("I'm sorry, you lost!");
        } else if (playerPoints === 21) {
            btnHit.disabled = true;
            btnStand.disabled = true;
            console.info('21, great!');
            computerTurn(playerPoints);
        }
    });

    btnStand.addEventListener('click', () => {
        btnHit.disabled = true;
        btnStand.disabled = true;
        computerTurn(arrayPlayerPoints[0]);
    });

    btnNew.addEventListener('click', () => {
        initializeGame();
    });

    return { newGame: initializeGame };
})();
