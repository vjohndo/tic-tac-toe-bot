const sizeButton = document.querySelector('#gameControls > button')
const sizeInput = document.querySelector('#gameControls > input')
const gamelog = document.querySelector('#gamelog')
const root = document.documentElement
let isOTurn = false;
let gameState = []
let gameSize = 3;
let moveLimit = 9;
let movesMade = 0;
let isWinner = false;
let whoWon = "" // takes on "X","O",""

const currentMark = (isOTurn) => (isOTurn)?"O":"X";

const initVariables = () => {
    whoWon = ""
    gameState = [];
    movesMade = 0;
    gamelog.textContent = `Player's Turn: ${currentMark(isOTurn)}`;
}

// need to run the same game check.
const gameboardWinCheck = (gameState) => {
    
    let mainDiagToCheck = [];
    let antiDiagToCheck = [];

    for (let x = 0; x < gameSize; x++) {
        mainDiagToCheck.push(gameState[x][x]);
        antiDiagToCheck.push(gameState[x][gameSize-x-1]);

        let rowToCheck = [];
        let colToCheck = [];
        for (let y = 0; y < gameSize; y++) {
            rowToCheck.push(gameState[x][y]);
            colToCheck.push(gameState[y][x]);
        }
        if (checkArraySame(rowToCheck) && rowToCheck[0] !== "") {
            return rowToCheck[0];
        }
        if (checkArraySame(colToCheck) && colToCheck[0] !== "") {
            return colToCheck[0];
        }
    }

    if (checkArraySame(mainDiagToCheck) && mainDiagToCheck[0] !== "") {
        return mainDiagToCheck[0];
    } 
    if (checkArraySame(antiDiagToCheck) && antiDiagToCheck[0] !== "") {
        return antiDiagToCheck[0];
    }

    return ""
}

const removeNodeEvents = () => {
    const nodes = document.querySelectorAll('.coord')
        for (let node of nodes) {
            node.removeEventListener('click', nodeClicked)
        }
}

const nodeClicked = (event) => {
    const rowChosen = event.target.dataset.row;
    const colChosen = event.target.dataset.col;

    // Update mark
    if (!event.target.textContent) {
        movesMade ++;
        event.target.textContent = currentMark(isOTurn);
        event.target.classList.add(event.target.textContent.toLowerCase());
        event.target.style.userSelect = 'none'
        gameState[rowChosen][colChosen] = event.target.textContent;
        // flip to next turn
        isOTurn = !isOTurn;

        // Check if win --> this uses the incorrect check.
        isWinner = Boolean(gameboardWinCheck(gameState));

        if (isWinner) {
            gamelog.textContent = `Game has been won by ${currentMark(!isOTurn)}`;
            whoWon = currentMark(!isOTurn);
            removeNodeEvents();
        } else if (movesMade === moveLimit) {
            gamelog.textContent = `It's a draw`;
            removeNodeEvents();
        } else {
            gamelog.textContent = `Player's Turn: ${currentMark(isOTurn)}`;
        }
    }
}

const addNodeEvents = () => {
    // Go through each node and direct to click mechanics
    const nodes = document.querySelectorAll('.coord')
    for (let node of nodes) {
        node.addEventListener('click', nodeClicked)
    }
}

const generateGameboard = () => {
    
    initVariables();
    
    gameSize = sizeInput.value;
    moveLimit = gameSize * gameSize;

    // Update CSS variable
    root.style.setProperty('--game-size', gameSize);

    // Clear any existing gameboard
    let gameboard = document.getElementById('display');
    while (gameboard.firstChild) {
        gameboard.removeChild(gameboard.lastChild)
    }

    // Create new nodes 
    for (row = 0; row < gameSize; row ++ ) {
        gameState.push([]);

        for (col = 0; col < gameSize; col ++ ) {
            gameState[row].push("")
            const newNode =  document.createElement('div');
            newNode.classList.add(`coord`,`r${row}c${col}`);
            newNode.dataset.row = `${row}`
            newNode.dataset.col = `${col}`
            newNode.textContent = ``;
            gameboard.append(newNode);
        }   
    }
    
    // Update grid template columns
    let array = []
    for (i = 0; i < gameSize; i++) {
        array.push("1fr")
    }
    gameboard.style.gridTemplateColumns = array.join(' ');

    addNodeEvents();
}

generateGameboard();

gamelog.textContent = `Welome to Tic-Tac-Toe`
sizeButton.addEventListener('click', generateGameboard)
sizeInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
      generateGameboard()
    }
});

