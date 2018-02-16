var router = require("express").Router();

var middleMan = require("../../utils/middleMan");


// URL: "/game"
module.exports = function(matches, pool) {

    // "game.ejs" page
    router.get("/:id", middleMan.checkIfUserIsInThisGame, function(req, res) {
        var id = parseInt(req.params.id);

        var match = matches.get(id);
        var currentUserId = req.user.id;

        var turn = match.user_1.id == currentUserId ? match.user_1.team : match.user_2.team;

        res.render("messenging/game.ejs", {
            id: id,
            turn: turn
        });
    });

    return router;
};
