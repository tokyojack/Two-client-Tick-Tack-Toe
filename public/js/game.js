var totalSlots = 9;

var socketController = (function() {

    var socket = io();

    return {
        join: function(gameId) {
            socket.emit('join', { gameId: gameId });
        },
        newSlot: function(turn, slotId, gameId) {
            socket.emit('new_slot', { turn: turn, slotId: slotId, gameId: gameId })
        },
        finish: function(gameId) {
            socket.emit('finish', { gameId: gameId })
        },
        onSetSlot: function(callback) {
            socket.on("set_slot", callback);
        }
    };

})();

var boardController = (function() {

    var getEmptyBoard = function getEmptyBoard() {
        var board = [];

        for (var i = 0; i < totalSlots; i++)
            board.push(' ');

        return board;
    };

    var data = {
        playerTurn: 'X',
        board: getEmptyBoard(),
        hasWon: false
    };

    return {
        setWon: function() {
            data.hasWon = true;
        },
        getTeamSwitched: function() {
            var playerTurn = data.playerTurn;
            playerTurn === 'O' ? data.playerTurn = 'X' : data.playerTurn = 'O';
            return data.playerTurn;
        },
        getTurn: function() {
            return data.playerTurn;
        },
        getBoard: function() {
            return data.board;
        },
        getHasWon: function() {
            return data.hasWon;
        },
        addSlot: function(slot) {
            data.board[slot] = data.playerTurn;
        }
    };

})();

var winningController = (function() {

    var winningConditions = [
        [
            'G', 'G', 'G',
            ' ', ' ', ' ',
            ' ', ' ', ' '
        ],
        [
            ' ', ' ', ' ',
            'G', 'G', 'G',
            ' ', ' ', ' '
        ],
        [
            ' ', ' ', ' ',
            ' ', ' ', ' ',
            'G', 'G', 'G'
        ],
        [
            'G', ' ', ' ',
            'G', ' ', ' ',
            'G', ' ', ' '
        ],
        [
            ' ', 'G', ' ',
            ' ', 'G', ' ',
            ' ', 'G', ' '
        ],
        [
            ' ', ' ', 'G',
            ' ', ' ', 'G',
            ' ', ' ', 'G'
        ],
        [
            'G', ' ', ' ',
            ' ', 'G', ' ',
            ' ', ' ', 'G'
        ],
        [
            ' ', ' ', 'G',
            ' ', 'G', ' ',
            'G', ' ', ' '
        ]
    ];

    return {
        hasWon: function(board, turn) {
            for (var x = 0; x < winningConditions.length; x++) {
                var condition = winningConditions[x];
                var amount = 0;

                for (var y = 0; y < totalSlots; y++) {
                    var conditionSlot = condition[y];
                    var boardSlot = board[y];

                    if (conditionSlot === 'G' && boardSlot === turn)
                        amount++;

                    if (amount === 3) return true;
                }
            }

            return false;
        },
        hasTied: function(board) {
            var amount = 0;
            for (var i = 0; i < totalSlots; i++) {
                var boardSlot = board[i];

                if (boardSlot === 'X' || boardSlot === 'O')
                    amount++;

                if (amount === totalSlots) return true;
            }

            return false;
        }
    };

})();

var UIController = (function() {
    var DOMstrings = {
        turn: '.turn',
        button: '.button',
        hiddenButton: '.hidden--button'
    };

    return {
        setSlot: function(playerTurn, slot) {
            var color = playerTurn === 'X' ? 'red' : 'blue';
            document.getElementById(slot).innerHTML = '<h1 style="color:' + color + ';font-size: 30px;">' + playerTurn + '</h1>';
        },
        setTurnText: function(playerTurn) {
            document.querySelector(DOMstrings.turn).textContent = 'Player ' + playerTurn + ' turn';
        },
        setWonText: function(playerTurn) {
            document.querySelector(DOMstrings.turn).textContent = 'Player ' + playerTurn + ' won! Wohoo!';
        },
        setTieText: function() {
            document.querySelector(DOMstrings.turn).textContent = 'Tied!';
        },
        getDOMstrings: function() {
            return DOMstrings;
        },
        showButton: function() {
            //I'm removing the . (Not removing it from DOM strings for visability when editing it.
            document.querySelector(DOMstrings.button).classList.remove(DOMstrings.hiddenButton.replace(/\./g, ''));
        }
    };

})();

var controller = (function(socketCtrl, boardCtrl, UICtrl, winningCtrl) {


    var setupEventListeners = function() {
        var DOM = UICtrl.getDOMstrings();

        document.querySelector('table').addEventListener('click', function(item) {
            var slotId = item.target.id;
            var turn = document.querySelector('turn').innerHTML;

            socketCtrl.newSlot(turn, slotId, gameId);
        });
        document.querySelector('button').addEventListener('click', function() {
            window.location.href = '/home';
        });

        socketCtrl.onSetSlot(function(item) {

            var id = item.slotId;
            var clickedItem = document.getElementById(id);

            if (!(id || clickedItem)) return;
            if (boardCtrl.getHasWon()) return;
            if (boardCtrl.getTurn() != item.turn) return;

            var playerTurn = boardCtrl.getTurn();

            if (clickedItem.textContent === '') {
                boardCtrl.addSlot(id);
                UICtrl.setSlot(playerTurn, id);
                UICtrl.setTurnText(boardCtrl.getTeamSwitched());
            }

            if (winningCtrl.hasWon(boardCtrl.getBoard(), playerTurn))
                UICtrl.setWonText(playerTurn);
            else if (winningCtrl.hasTied(boardCtrl.getBoard()))
                UICtrl.setTieText();

            var turnText = document.querySelector(UICtrl.getDOMstrings().turn).textContent;
            if (containsString(turnText, 'won') || containsString(turnText, 'Tied')) {
                boardCtrl.setWon();
                UICtrl.showButton();
                socketCtrl.finish(gameId);
            }
        });

        var gameId = parseInt(document.querySelector('gameId').innerHTML);
        socketCtrl.join(gameId);
    };

    var containsString = function containsString(string, containingString) {
        return string.indexOf(containingString) !== -1;
    };

    return {
        init: function() {
            setupEventListeners();
        }
    };
})(socketController, boardController, UIController, winningController);

controller.init();