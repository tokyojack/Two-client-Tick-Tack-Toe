module.exports = function(gameId, matches, socket, io) {

    socket.on('finish', function(data) {
        gameId--;
        matches.delete(data.gameId);
    });

};
