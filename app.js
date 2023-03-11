let boardSquares = () => {

    let fillSquare = (e) => {
        let square = e.target;
        // how does this self reference actually work ? 
        square.removeEventListener('click', gameBoard.fillSquare);

        gameBoard.player.choice(gameBoard.player, square);
        gameBoard.turn += 1;
        gameBoard.checkBoard(gameBoard.player)

        gameBoard.computer.choice(gameBoard.computer, gameBoard.selectSquare());
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

// selects an index then
let gameAI = () => {
    let squares = document.querySelectorAll('.square');
    let empty = false;
    let rng = (options) => {
        let idx = Math.floor(Math.random() * options.length);
        return squares[options[idx]];
    }

    let twoXrow = () => {
        let result = -1;
        let board = gameBoard.board;

        gameBoard.triplets.forEach((triplet) => {
            let a = triplet[0];
            let b = triplet[1];
            let c = triplet[2];
            let row = [board[a], board[b], board[c]];

            if ( (board[a] === 'X' && board[b] === 'X' ||
                  board[a] === 'X' && board[c] === 'X' ||
                  board[b] === 'X' && board[c] === 'X' ) &&
                  (board[a] === '' || board[b] === '' || board[c] === '')){
                    let idx = row.indexOf('');
                    result = triplet[idx]; // becomes square.id   
                }
            }
        )
        return result;
    }

    let emptyCorner = () =>{
        for (let i = 0; i < gameBoard.corners.length; i++){
            if (gameBoard.board[gameBoard.corners[i]] === '') {
                return true;
            }
        }
        return false;
    }

    let selectSquare = () => {

        let block = twoXrow();
        if (squares[4].innerHTML === ''){
            result = squares[4];
        }
        else if (block >= 0){
            result = squares[block]; // not lucky
        }
        else if (emptyCorner()){
            result = rng(gameBoard.corners);
        }
        else {
            result = rng(gameBoard.freeSpots);
        }

        if (gameBoard.gameOver !== true){    
            result.removeEventListener('click', gameBoard.fillSquare);
            return result;
        }
    }

    return{selectSquare};
}


let Player = (name, letter, color) => {
    let board = new Array(9);
    let declareWinner = (tie = 0) =>{
        container.appendChild(display);
        if (tie === 0){
            textbox.innerHTML = `${name} has won the game!`
        } else{
            textbox.innerHTML = "It's a tie game!";
        }
    }

    let choice = (self, square) => {
        if (gameBoard.gameOver === false){
            console.log(letter + " : " + square.id);
            square.innerHTML = letter;
            square.style.color = color;
            self.board[square.id] = letter;
            gameBoard.board[square.id] = letter;
            // remove this square from global freeSpots array
            let idx = gameBoard.freeSpots.indexOf(parseInt(square.id));
            gameBoard.freeSpots.splice(idx, 1);
            if (square.id % 2 === 0 && square.id !== 4){ // is a corner
                idx = gameBoard.corners.indexOf(parseInt(square.id));
                gameBoard.corners.splice(idx, 1);
            }  
        }
    }
    board.fill('');
    return {name, letter, color, board, choice, declareWinner};
}

let gameFlow = () => {
    
    let checkBoard = (side) => {
        let values = side.board;
        gameBoard.triplets.forEach((triplet) => {
            if (values[triplet[0]] === values[triplet[1]] && 
                values[triplet[0]] === values[triplet[2]] && 
                values[triplet[0]] !== ''){
                    gameBoard.gameOver = true;
                    side.declareWinner();
            }
            else if (gameBoard.turn === 9){
                gameBoard.gameOver = true;
                side.declareWinner(1);
            }
        });
    }
    let reset = () => {
        if (gameBoard.gameOver){
            gameBoard.squares.forEach((square) => {
                square.innerHTML = "";
            })
            gameBoard.player = Player("Player", "X", "#ff494d");
            gameBoard.computer = Player("Computer", "O", "#2acaea");
            gameBoard.board.fill('');
            gameBoard.freeSpots = [0,1,2,3,4,5,6,7,8];
            gameBoard.corners = [0,2,6,8];
            gameBoard.gameOver = false;
            gameBoard.turn = 0;
            container.removeChild(display);
            gameBoard.activateSquares();
        }
    }

    return {checkBoard, reset};
}


let gameBoard = (() => {

    let gameOver = false;
    let board = new Array(9);
    board.fill('');
    let freeSpots = [0,1,2,3,4,5,6,7,8];
    let player = Player("Player", "X", "#ff494d");
    let computer = Player("Computer", "O", "#2acaea");
    let turn = 0;
    let triplets = [[0,1,2], [3,4,5], [6,7,8],
                     [0,3,6], [1,4,7], [2,5,8],
                     [0,4,8], [2,4,6]];
    let corners = [0, 2, 6, 8];

    let squares = document.querySelectorAll('.square');
    let {fillSquare} = boardSquares();
    let {activateSquares} = boardSquares();    
    let {checkBoard} = gameFlow();
    let {selectSquare} = gameAI();
    let {reset} = gameFlow();

    return {gameOver, 
            board,
            freeSpots,
            player, 
            computer, 
            turn, 
            triplets,
            corners,
            squares, 
            checkBoard, 
            activateSquares,
            selectSquare,
            fillSquare,
            reset};
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
again.addEventListener('click', gameBoard.reset);
display.appendChild(textbox);
display.appendChild(again);