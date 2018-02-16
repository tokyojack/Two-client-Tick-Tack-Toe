module.exports = function(socket, io) {

    socket.on('join', data => socket.join(data.gameId));

};
