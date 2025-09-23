 // Image URLs arrays for cards
  const animalImageUrls = [
    "lion.png",
    "tiger.png",
    "cat.png",
    "cow.png",
    "fox.png",
    "squirrel.png",
    "bear.png",
    "deer.png"
  ];

  const trumpImageUrls = [
    "trumpA.png",
    "trump6.png",
    "trumpK.png",
    "trump10.png",
    "trumpQ.png",
    "trumpJ.png",
    "trump5.png",
    "trump7.png"
  ];

  let icons = trumpImageUrls; // default
  let flippedCards = [];
  let matchedCards = 0;
  let moves = 0;
  let timer = 0;
  let timerInterval = null;

  // DOM elements
  const board = document.getElementById("game-board");
  const movesSpan = document.getElementById("moves");
  const timerSpan = document.getElementById("timer");
  const homePage = document.getElementById("home-page");
  const gameSection = document.getElementById("game-section");

  function getSelectedRadioValue(name) {
    const selected = document.querySelector(`input[name="${name}"]:checked`);
    return selected ? selected.value : null;
  }

  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  function stopTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
  }

  function resetStats() {
    moves = 0;
    timer = 0;
    movesSpan.textContent = moves;
    timerSpan.textContent = timer;
  }

  function startTimer() {
    if (timerInterval) return;
    timerInterval = setInterval(() => {
      timer++;
      timerSpan.textContent = timer;
    }, 1000);
  }

  window.goToGame = function () {
    const cardTypeValue = getSelectedRadioValue("card-type");
    icons = cardTypeValue === "trump" ? trumpImageUrls : animalImageUrls;

    homePage.style.display = "none";
    gameSection.style.display = "block";

    startGame();
  };

  window.goToHome = function () {
    stopTimer();
    gameSection.style.display = "none";
    homePage.style.display = "block";
  };

  function startGame() {
    board.innerHTML = "";
    stopTimer();
    resetStats();
    flippedCards = [];
    matchedCards = 0;

    const size = parseInt(getSelectedRadioValue("deck-size"));
    const pairsPerFace = parseInt(getSelectedRadioValue("pairs-per-face"));
    const totalCards = size * 4;

    if (totalCards % pairsPerFace !== 0) {
      alert("Board size must be divisible by number of pairs per face.");
      goToHome();
      return;
    }

    const numUnique = totalCards / pairsPerFace;
    let deckIcons = icons.slice(0, numUnique);
    let deck = [];

    deckIcons.forEach((imgUrl) => {
      for (let i = 0; i < pairsPerFace; i++) {
        deck.push(imgUrl);
      }
    });

    deck = shuffle(deck);
    board.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
    // board.style.width = '90vw';

    deck.forEach((imgUrl, idx) => {
      const card = document.createElement("div");
      card.className = "card";
      card.dataset.icon = imgUrl;

      card.innerHTML = `
        <div class="card-inner">
          <div class="card-front"><img src="${imgUrl}" alt="card image" /></div>
          <div class="card-back"></div>
        </div>
      `;

      card.addEventListener("click", onCardClick);
      board.appendChild(card);
    });
  }

  function onCardClick(e) {
    const pairsPerFace = parseInt(getSelectedRadioValue("pairs-per-face"));
    const card = e.currentTarget;

    if (
      card.classList.contains("flipped") ||
      card.classList.contains("matched") ||
      flippedCards.length >= pairsPerFace
    )
      return;

    card.classList.add("flipped");
    flippedCards.push(card);

    if (flippedCards.length === 1 && moves === 0) {
      startTimer();
    }

    if (flippedCards.length === pairsPerFace) {
      moves++;
      movesSpan.textContent = moves;

      const allSame = flippedCards.every(
        (c) => c.dataset.icon === flippedCards[0].dataset.icon
      );

      if (allSame) {
        flippedCards.forEach((c) => {
          c.classList.add("matched");
          c.removeEventListener("click", onCardClick);
        });
        matchedCards += flippedCards.length;

        if (matchedCards === board.children.length) {
          stopTimer();
          setTimeout(
            () =>
              alert(
                `Congratulations! 🎉\nYou finished in ${timer} seconds with ${moves} moves.`
              ),
            300
          );
        }
        flippedCards = [];
      } else {
        setTimeout(() => {
          flippedCards.forEach((c) => {
            c.classList.remove("flipped");
          });
          flippedCards = [];
        }, 1000);
      }
    }
  }

  // Initially show home page
  window.onload = () => {
    homePage.style.display = "block";
    gameSection.style.display = "none";
  };