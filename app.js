let boardSquares = () => {

    let fillSquare = (e) => {
        let square = e.target;
        // how does this self reference actually work ? 
        square.removeEventListener('click', gameBoard.fillSquare);

        gameBoard.player.choice(gameBoard.player, square);
        gameBoard.turn += 1;
        gameBoard.checkBoard(gameBoard.player);

        gameBoard.computer.choice(gameBoard.computer, gameAI());
        gameBoard.turn += 1;
        gameBoard.checkBoard(gameBoard.computer);
    }

    let activateSquares = () => {
        if (gameBoard.turn === 0){
            gameBoard.squares.forEach((square) => {
                square.style.color = '#000';
                square.addEventListener('click', gameBoard.fillSquare);
            })
        }
    }
    return {fillSquare, activateSquares};
}

let gameFlow = () => {
    
    // introduce a check which passes each palyer to checkboard
    let positions = [[0,1,2], [3,4,5], [6,7,8],
                     [0,3,6], [1,4,7], [2,5,8],
                     [0,4,8], [2,4,6]];
    
    let checkBoard = (side) => {
        let values = side.board;
        positions.forEach((triplet) => {
            if (values[triplet[0]] === values[triplet[1]] && 
                values[triplet[0]] === values[triplet[2]] && 
                values[triplet[0]] !== ''){
                    console.log(values);
                    gameBoard.gameOver = true;
                    side.declareWinner();
            }
            else if (gameBoard.turn === 9){
                gameBoard.gameOver = true;
                side.declareWinner();
            }
        });
    }

    return {checkBoard};
}

// selects an index then
function gameAI() {
    let squares = document.querySelectorAll('.square');
    let rng = Math.floor(Math.random() * gameBoard.freeSpots.length);
    let result = squares[gameBoard.freeSpots[rng]];
    result.removeEventListener('click', gameBoard.fillSquare);
    return result;
}

function rng(options) {

}

let Player = (name, letter, color) => {
    let board = new Array(9);
    let declareWinner = () =>{
        container.appendChild(display);
        textbox.innerHTML = `${name} has won the game!`

    }
    let choice = (self, square) => {
        square.innerHTML = letter;
        square.style.color = color;
        self.board[square.id] = letter;
        gameBoard.freeSpots.splice(square.id, 1);
        console.log(gameBoard.freeSpots)

    }
    board.fill('');
    return {name, letter, color, board, choice, declareWinner};
}

let gameBoard = (() => {

    let gameOver = false;
    let freeSpots = [0,1,2,3,4,5,6,7,8];
    let player = Player("Player", "X", "#ff494d");
    let computer = Player("Computer", "O", "#2acaea");
    let turn = 0;

    let squares = document.querySelectorAll('.square');
    let {fillSquare} = boardSquares();
    let {activateSquares} = boardSquares();    
    let {checkBoard} = gameFlow();
    // let {gameAI} = gameAI();
    let {reset} = gameFlow();

    return {gameOver, 
            freeSpots,
            player, 
            computer, 
            turn, 
            squares, 
            reset, 
            checkBoard, 
            activateSquares,
            fillSquare};
})();


gameBoard.activateSquares();

// HTML for new game
let container = document.querySelector('.container');
let display = document.createElement('div');
let textbox = document.createElement('div');
let again = document.createElement('div');
display.id = 'display';
textbox.id = 'textbox';
again.id = 'again';
again.innerHTML = 'Play again?';
again.addEventListener('click', () => {
    if (gameBoard.gameOver){
        gameBoard.squares.forEach((square) => {
            square.innerHTML = "";
        })
        gameBoard.player = Player("Player", "X", "#ff494d");
        gameBoard.computer = Player("Computer", "O", "#2acaea");
        gameBoard.freeSpots = [0,1,2,3,4,5,6,7,8]
        gameBoard.gameOver = false;
        gameBoard.turn = 0;
        textbox.innerHTML = "";
        container.removeChild(display);
        gameBoard.activateSquares();
    }
})

display.appendChild(textbox);
display.appendChild(again);