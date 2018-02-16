module.exports = function(users, gameId, matches, socket, io) {

    socket.on('find_game', function(user) {
        socket.join(user.userId);
        users.push(user);

        if (users.length <= 1) {
            return;
        }

        gameId++;

        var match = {
            gameId: gameId,
            user_1: {
                team: 'X',
                username: users[0].username,
                id: users[0].userId
            },
            user_2: {
                team: 'O',
                username: users[1].username,
                id: users[1].userId
            }
        };

        matches.set(gameId, match);
        users.forEach(user => io.sockets.in(user.userId).emit('match_found', { gameId: gameId })); // Might want to change it to ES5

        // users = []; This doesn't clear it
        users.length = 0;
    });

};
