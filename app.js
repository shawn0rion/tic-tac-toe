let boardSquares = () => {

    let fillSquare = (e) => {
        let square = e.target;
        // how does this self reference actually work ? 
        square.removeEventListener('click', fillSquare);

        if (gameBoard.turn % 2 === 0){
            square.innerHTML = 'X';
            square.style.color = '#ff494d';
            gameBoard.player.board[square.id] = 'X';
        }
        if (gameBoard.turn % 2 !== 0){
            square.innerHTML = 'O';
            square.style.color = '#2acaea';
            gameBoard.computer.board[square.id] = 'O';
        }

        gameBoard.turn += 1;

        gameBoard.checkBoard(gameBoard.computer);
        gameBoard.checkBoard(gameBoard.player);
    }

    let activateSquares = () => {
        if (gameBoard.turn === 0){
            gameBoard.squares.forEach((square) => {
                square.style.color = '#000';
                square.addEventListener('click', fillSquare);
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
                values[triplet[0]] !== ""){
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

let Player = (name) => {
    let board = new Array(9);
    let declareWinner = () =>{
        container.appendChild(display);
        textbox.innerHTML = `${name} has won the game!`

    }
    board.fill('');
    return {name, board, declareWinner};
}

let gameBoard = (() => {

    let gameOver = false;
    let player = Player("Player");
    let computer = Player("Computer");
    let turn = 0;

    let squares = document.querySelectorAll('.square');
    let {activateSquares} = boardSquares();    
    let {checkBoard} = gameFlow();
    let {reset} = gameFlow();

    return {gameOver, player, computer, turn, squares, reset, checkBoard, activateSquares};
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
            gameBoard.player = Player("Player");
            gameBoard.computer = Player("Computer");
        })
        
        gameBoard.gameOver = false;
        gameBoard.turn = 0;
        textbox.innerHTML = "";
        container.removeChild(display);
        gameBoard.activateSquares();
    }
})

display.appendChild(textbox);
display.appendChild(again);