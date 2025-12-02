
const Gameboard = (function () {
  let board = ["", "", "", "", "", "", "", "", ""];

  function getBoard() {
    return board;
  }

  function placeMark(index, marker) {
    if (board[index] === "") {
      board[index] = marker;
    }
  }

  function reset() {
    board = ["", "", "", "", "", "", "", "", ""];
  }

  function checkIfSquareIsEmpty(index) {
    return board[index] === "";
  }

  return {
    getBoard,
    placeMark,
    reset,
    checkIfSquareIsEmpty
  };

})();

function createPlayer(name, marker) {
  return { name, marker };
}

const DisplayController = (function () {
  const squares = document.querySelectorAll(".square");
  const messageDisplay = document.querySelector("h2");
  const restartButton = document.getElementById("restart-btn");

  function renderBoard() {
    const boardArray = Gameboard.getBoard();

    boardArray.forEach((marker, index) => {
      squares[index].textContent = marker;
    })
  }

  function setUpEventListeners() {
    squares.forEach(square => {
      square.addEventListener("click", () => {
        const clickedSquare = Number(square.dataset.index);
        GameController.playRound(Number(clickedSquare));
      })

      square.addEventListener("mouseenter", () => {

        if (GameController.getIsGameOver()) {
          return;
        }

        const board = Gameboard.getBoard();
        const index = Number(square.dataset.index);

        if (board[index] === "") {
          const marker = GameController.getActiveMarker();
          square.style.setProperty('--hover-marker', `"${marker}"`);
          square.classList.add('hover-state');
        }
      })

      square.addEventListener("mouseleave", () => {
        square.classList.remove('hover-state');
      })
    })
  }

  function setupResetButton() {
    restartButton.addEventListener("click", () => {
      GameController.resetGame();
    });
  }

  function displayMessage(message) {
    messageDisplay.textContent = `${message}`;

  }

  return {
    renderBoard,
    setUpEventListeners,
    setupResetButton,
    displayMessage
  };
})();

const GameController = (function () {
  const player1 = createPlayer("Player X", "X");
  const player2 = createPlayer("Player O", "O");
  let activePlayer = player1;
  let isGameOver = false;
  const boardElement = document.querySelector(".board");

  function switchPlayer() {
    if (activePlayer === player1) {
      activePlayer = player2;
    } else {
      activePlayer = player1;
    }
  }

  function checkWin() {
    const board = Gameboard.getBoard();
    const winConditions = [
      { combo: [0, 1, 2], className: 'win-row-1' },
      { combo: [3, 4, 5], className: 'win-row-2' },
      { combo: [6, 7, 8], className: 'win-row-3' },
      { combo: [0, 4, 8], className: 'win-diag-1' },
      { combo: [2, 4, 6], className: 'win-diag-2' },
      { combo: [0, 3, 6], className: 'win-col-1' },
      { combo: [1, 4, 7], className: 'win-col-2' },
      { combo: [2, 5, 8], className: 'win-col-3' }
    ];

    for (const condition of winConditions) {
      const { combo, className } = condition;
      const [a, b, c] = combo;

      if (
        board[a] !== "" && board[a] === board[b] && board[a] === board[c]
      ) {
        return className;
      }
    }
    return false;
  }

  function checkTie() {
    const board = Gameboard.getBoard();

    if (board.includes("")) {
      return false;
    }

    return true;
  }

  function playRound(index) {
    if (isGameOver) {
      return;
    }

    if (!Gameboard.checkIfSquareIsEmpty(index)) {
      return;
    }

    Gameboard.placeMark(index, activePlayer.marker);
    DisplayController.renderBoard();

    const winClass = checkWin();

    if (winClass) {
      DisplayController.displayMessage(`${activePlayer.name} WINS!`);
      isGameOver = true;
      boardElement.classList.add('game-won', winClass);
      return;
    }

    if (checkTie()) {
      DisplayController.displayMessage("TIE! The game is over.");
      isGameOver = true;
      return;
    }

    switchPlayer();
    DisplayController.displayMessage(`${activePlayer.name}'s turn`);
  }

  function resetGame() {
    Gameboard.reset();
    activePlayer = player1;
    isGameOver = false;
    DisplayController.renderBoard();
    boardElement.classList.remove('game-won');
    DisplayController.displayMessage(`Player X starts!`);
  }

  return {
    playRound,
    resetGame,
    getActiveMarker: () => activePlayer.marker,
    getIsGameOver: () => isGameOver,
  }
})();

DisplayController.setUpEventListeners();
DisplayController.setupResetButton();

DisplayController.displayMessage("Player X starts!");