module.exports = function(socket, io) {

    socket.on('new_slot', data => io.sockets.in(data.gameId).emit('set_slot', { turn: data.turn, slotId: data.slotId }));

};
