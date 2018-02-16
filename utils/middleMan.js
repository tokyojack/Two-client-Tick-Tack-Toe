exports.checkIfUserIsInThisGame = function(req, res, next) {
    if (!isLoggedIn(req, res))
        return;

    var matches = require('../index').matches;
    var match = matches.get(parseInt(req.params.id));

    var currentUserId = req.user.id;

    if (!(match.user_1.id === currentUserId || match.user_2.id === currentUserId))
        return;

    next();
};

exports.isLoggedIn = function(req, res, next) {
    if (!(isLoggedIn(req, res)))
        return;

    return next();
};

function isLoggedIn(req, res) {
    if (req.isAuthenticated())
        return true;

    req.flash("error", "You must be logged in todo that.");
    res.redirect("/login");
    return false;
}
