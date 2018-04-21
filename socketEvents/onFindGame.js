module.exports = function(users, gameId, matches, socket, io) {

    socket.on('find_game', function(user) {
        socket.join(user.userId);
        users.push(user);

        if (users.length <= 1) 
            return;
        

        // You would most likely want to do a more intricate game-finding system, but this is fine for this level that
        // i'm running it at   

        gameId++;

        // Generates a new match info and inserts it into the HashMap
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

        // Emit's that a match has been found, redirecting the person
        users.forEach(user => io.sockets.in(user.userId).emit('match_found', { gameId: gameId })); 

        // users = []; This doesn't clear it
        users.length = 0;
    });

};
