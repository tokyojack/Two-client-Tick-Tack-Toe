var socketController = (function() {

    var socket = io();

    var userId = parseInt(document.querySelector('userId').innerHTML);
    var username = document.querySelector('username').innerHTML;

    return {
        findGame: function() {
            var user = {
                userId: userId,
                username: username
            }
            socket.emit('find_game', user);
        },
        onMatchFound: function(callback) {
            socket.on("match_found", callback);
        }
    };

})();

var UIController = (function() {

    var DOMstrings = {
        messageInput: '.message-input',
        button: 'button'
    };

    return {
        addLoader: function() {

            var loader = '<div class="preloader-wrapper big active">\
                            <div class="spinner-layer spinner-blue-only">\
                              <div class="circle-clipper left">\
                                <div class="circle"></div>\
                              </div><div class="gap-patch">\
                                <div class="circle"></div>\
                              </div><div class="circle-clipper right">\
                                <div class="circle"></div>\
                              </div>\
                            </div>\
                          </div>'

            document.querySelector('main').insertAdjacentHTML('beforeend', loader);
        },
        getDOMstrings: function() {
            return DOMstrings;
        }
    };
})();

var controller = (function(socketCtrl, UICtrl) {

    var setupEventListeners = function() {
        var DOM = UICtrl.getDOMstrings();

        document.querySelector(DOM.button).addEventListener('click', function(event) {
            socketCtrl.findGame();
            UICtrl.addLoader();
        });

        socketCtrl.onMatchFound(function(game) {
            window.location.href = '/game/' + game.gameId;
        });
    };


    return {
        init: function() {
            setupEventListeners();
        }
    };
})(socketController, UIController);

controller.init();
