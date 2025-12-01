
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

  return {
    getBoard,
    placeMark,
    reset
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
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 4, 8],
      [2, 4, 6],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8]
    ];

    for (const condition of winConditions) {
      const [a, b, c] = condition;

      if (
        board[a] !== "" && board[a] === board[b] && board[a] === board[c]
      ) {
        return true;
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
    const board = Gameboard.getBoard();

    if (isGameOver) {
      return;
    }

    if (board[index] !== "") {
      return;
    }

    Gameboard.placeMark(index, activePlayer.marker);
    DisplayController.renderBoard();

    if (checkWin()) {
      DisplayController.displayMessage(`${activePlayer.name} WINS!`);
      isGameOver = true;
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
    DisplayController.displayMessage(`Player X starts!`);
  }
  
  return {
    playRound,
    resetGame
  }
})();

DisplayController.setUpEventListeners();
DisplayController.setupResetButton();

DisplayController.displayMessage("Player X starts!");