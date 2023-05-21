
function displayResult(result) {

    const text = result ? `The winner is: ${result.toUpperCase()}` : 'It is a tie!'.toUpperCase();

    const resultElement = document.getElementById('result');
    resultElement.textContent = text;

    if (result) {
        resultElement.classList.add('winner');
    } else {
        resultElement.classList.add('tie');
    }
}

function getPlayerInfo(info) {
    return document.getElementById(info);
}

function getPlayerName(symbol, players) {
    for (let i = 0; i < players.length; i++) {
        if (players[i].symbol.textContent === symbol) {
            return players[i].name.textContent;
        }
    }
    return null;
}
function checkWinner(board, players) {
    const winningCombos = [
        [0, 1, 2], // top row
        [3, 4, 5], // middle row
        [6, 7, 8], // bottom row
        [0, 3, 6], // left column
        [1, 4, 7], // middle column
        [2, 5, 8], // right column
        [0, 4, 8], // diagonal top left to bottom right
        [2, 4, 6]  // diagonal top right to bottom left
    ];

    for (let i = 0; i < winningCombos.length; i++) {
        const [a, b, c] = winningCombos[i];
        if (board[a].textContent && board[a].textContent === board[b].textContent && board[a].textContent === board[c].textContent) {

            board[a].style.backgroundColor = 'lightgreen';
            board[b].style.backgroundColor = 'lightgreen';
            board[c].style.backgroundColor = 'lightgreen';

            return getPlayerName(board[a].textContent, players); // returns the winner
        }
    }
    return null; // returns null if there is no winner
}

function checkTie(board) {
    for (let i = 0; i < board.length; i++) {
        if (board[i].textContent === '') {
            return false;
        }
    }
    return true;
}

function resetBoard(board) {
    for (let i = 0; i < board.length; i++) {
        board[i].textContent = '';
        board[i].style.backgroundColor = 'white';
    }

}
function main() {
    const players = [
        {
            name: getPlayerInfo('p1-name'),
            symbol: getPlayerInfo('p1-symbol'),
        },
        {
            name: getPlayerInfo('p2-name'),
            symbol: getPlayerInfo('p2-symbol')
        }
    ]

        players[0].name.textContent = prompt('Player 1, what is your name?').toUpperCase();
        players[1].name.textContent = prompt('Player 2, what is your name?').toUpperCase();

        if (players[0].name.textContent === '' || players[1].name.textContent === '') {
            players[0].name.textContent = 'ONE';
            players[1].name.textContent = 'TWO';
        }

    const squares = document.querySelectorAll('.square');
    const board = document.getElementById('board');
    const reset = document.getElementById('reset');

    function resetGame() {
        const resultElement = document.getElementById('result');
        resultElement.textContent = '';
        resultElement.classList.remove('winner');
        resultElement.classList.remove('tie');
        board.addEventListener('click', putSymbol);
        players.push(players.shift());
        resetBoard(squares);
    }

    function putSymbol(event) {
        const target = event.target;
        if (target.classList.contains('square') && target.textContent === '') {
            target.textContent = players[0].symbol.textContent;
            players.push(players.shift());
        }

        let winner = checkWinner(squares, players);
        if (winner) {
            displayResult(winner);
            board.removeEventListener('click', putSymbol);
        } else {
            if (checkTie(squares)) {
                displayResult(null);
                board.removeEventListener('click', putSymbol);
            }
        }
    }
    board.addEventListener('click', putSymbol);
    reset.addEventListener('click', resetGame);
}

main(); // starts the game.
