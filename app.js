let boardSquares = () => {

    let fillSquare = (e) => {
        let square = e.target;
        // how does this self reference actually work ? 
        square.removeEventListener('click', fillSquare);

        if (gameBoard.turn % 2 === 0){
            square.innerHTML = 'X';
        }
        if (gameBoard.turn % 2 !== 0){
            square.innerHTML = 'O';
        }

        gameBoard.board[square.id] = square.innerHTML;
        gameBoard.turn += 1;

        gameBoard.checkBoard();
        gameBoard.reset();
    }

    let activateSquares = () => {
        if (gameBoard.turn === 0){
            gameBoard.squares.forEach((square) => {
                square.addEventListener('click', fillSquare);
            })
        }
    }
    return {fillSquare, activateSquares};
}

let gameFlow = () => {
    
    let positions = [[0,1,2], [3,4,5], [6,7,8],
                     [0,3,6], [1,4,7], [2,5,8],
                     [0,4,8], [2,4,6]];
    let checkBoard = () => {
        positions.forEach((triplet) => {
            if (gameBoard.board[triplet[0]] === gameBoard.board[triplet[1]] && 
                gameBoard.board[triplet[0]] === gameBoard.board[triplet[2]] && 
                gameBoard.board[triplet[0]] !== ""){
                gameBoard.gameOver = true;
            }
            else if (gameBoard.turn === 9){
                gameBoard.gameOver = true;
            }
        });
    }
    let reset = () => {
        if (gameBoard.gameOver){
            gameBoard.squares.forEach((square) => {
                square.innerHTML = "";
                gameBoard.board[square.id] = "";
            })
            gameBoard.gameOver = false;
            gameBoard.turn = 0;
            gameBoard.activateSquares();
        }
    }
    return {checkBoard, reset};
}

let gameBoard = (() => {

    let gameOver = false;
    let board = new Array(9);
    board.fill('');
    let turn = 0;

    let squares = document.querySelectorAll('.square');
    let {activateSquares} = boardSquares();    
    let {checkBoard} = gameFlow();
    let {reset} = gameFlow();

    return {board, turn, squares, reset, checkBoard, activateSquares};
})();

gameBoard.activateSquares();