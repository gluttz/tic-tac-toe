
const Gameboard = (function(){
    let board = ['', '', '', '', '', '', '', '', ''];

    const getBoard = () => board;
    const setBoard = (tile) => {
        board[tile] = game.currentPlayer().mark();
    };
    const resetBoard = () =>{
        board = ['', '', '', '', '', '', '', '', ''];
    };
    return {getBoard, setBoard, resetBoard}
})();

const displayController = (function(){
    //Cache DOM / EventListeners
    const nodeList = document.querySelectorAll('.tile');
    const form = document.querySelector('.inputForm');
    const toggler = document.querySelector('#playerTwoCheck');
    const p2Form = document.querySelector('.p2Form');
    const submitButton = document.querySelector('#submit');
    const resetButton = document.querySelector('#reset');
    const handler = (e) => {
        onClick(e.target, game.currentPlayer().mark())
    }
    const listen = () => {
        for(let tile of nodeList){
            tile.addEventListener('click', handler)
        };
    }

    const stopListen = () => {
        for(let tile of nodeList){
            tile.removeEventListener('click', handler)
        };
    }
    const formListen = () => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const newSubmit = new FormData(form);
            const Obj = Object.fromEntries(newSubmit);
            game.setPlayer1(Obj.p1, 1);
            if(Obj.checkbox === "on"){
                //set P2 player
                Obj.checkbox = true;
                game.setPlayer2(Obj.p2, 2)
            }else{
                Obj.checkbox = false;
                //set p2 AI
            }
            onSubmit();
            resetButton.addEventListener('click', onReset);
        })
    }
    const checkboxListen = () => {
        toggler.addEventListener('change', onCheckboxChange);
    }
    const onClick = (target, playerMark) => {
        if(!target.textContent) {
            Gameboard.setBoard(target.id)
            display.updateBoard(target);
            game.playRound();
        }
    };

    const onReset = () => {
        display.resetBoard(nodeList);
        game.resetGame();
        buttonToggle();
        display.hideGameOver();
    }
    
    const onLoad = () =>{
        formListen();
        checkboxListen();
        
    };
    const onSubmit = () => {
        listen();
        form.reset();
        buttonToggle();
        display.hideGameOver();
    }
    const onCheckboxChange = () => {
        if(toggler.checked){
            p2Form.classList.replace('hide', 'show');
        }else{
            p2Form.classList.replace('show', 'hide')
        }
    }
    const onGameOver = (winner) => {
        display.displayGameOver(winner);
    }
    const onDraw = () => {

    }
    const buttonToggle = () => {
        submitButton.classList.toggle("hidden");
        resetButton.classList.toggle("hidden");
        
    }
    
    document.addEventListener('DOMContentLoaded', onLoad())
    return {stopListen, onReset, onGameOver}
})();

const display = (function() {
    let container = document.querySelector('.game-over');
    let message = document.querySelector('#message');
    const resetBoard = (nodeList) => {
        for(let node of nodeList){
            node.textContent = undefined;
        }
    };
    const updateBoard = ((target) => {
        target.textContent = game.currentPlayer().mark()
    })
    const displayGameOver = (winner) => {
        
        message.innerText = `${winner} wins!`
        if(winner === game.getPlayer1().getName()){
            container.setAttribute('style', 'background-color: rgba(21, 255, 0, 0.4); display: grid')
        }else{
            container.setAttribute('style', 'background-color: rgba(255, 0, 0, 0.4); display: grid')
        }
    }
    const hideGameOver = () =>{
        container.setAttribute('style', 'display: hidden;')
    }
    const displayP2Form = () => {

    }
    return {updateBoard, resetBoard, displayGameOver, displayP2Form, hideGameOver}
})();

const Player = (playerName, id) => {
    //add ID sent from input player field = 1 p2 field = 2
    let ID;
    const setID = () => {
        ID = id;
    }
    const getID = () => ID;
    const getName = () => playerName;{
        ID = id;
    }

    const mark = () => {
        if(ID === 1){
            return "X"
        }else{
            return "O"
        }
    }
    
    return {getName, mark, setID, getID};
};




const game = (function() {
    let round = 0;
    let winner;
    let Player1;
    let Player2;
    const setPlayer1 = (playerName, id) => {
        Player1 = Player(playerName, id);
    }
    const setPlayer2 = (playerName, id) => {
        Player2 = Player(playerName, id);
    }
    const getPlayer1 = () => Player1;
    const getPlayer2 = () => Player2;

    let currentPlayer = () => {
        if(round % 2 === 0){
            return Player1;
        }else{
            return Player2;
        }
    };
    const playRound = () => {
        console.log(round);
        checkWin();
        round++;
    }
    const checkWin = () => {
        const winningBoard = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
        let currentBoard = Gameboard.getBoard();
        if(round === 8){
            gameDraw();
        }
        for(let array of winningBoard){
            if(currentBoard[array[0]] !== '' && currentBoard[array[1]] !== '' && currentBoard[array[2]] !== ''){
                if(currentBoard[array[0]] === currentBoard[array[1]] && currentBoard[array[0]] === currentBoard[array[2]]){
                    if(currentBoard[array[0]] === 'X'){
                        winner = getPlayer1().getName();
                        displayController.onGameOver(winner);
                        // console.log(`${winner} wins`)
                    }else if(currentBoard[array[0]] === 'O'){
                        winner = getPlayer2().getName();
                        displayController.onGameOver(winner);
                        // console.log(`${winner} wins`)
                    }                   
                }
            }
        }       
    };

    const resetGame = () => {
        round = 0;
        winner = undefined;
    }
    const resetPlayers = () =>{
        Player1 = undefined;
        Player2 = undefined;
    }
    const newGame = () => {

    }
    
    
    return {currentPlayer, playRound, setPlayer1, setPlayer2, resetGame, getPlayer1, getPlayer2, resetPlayers}
})();
