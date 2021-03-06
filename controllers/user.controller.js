const User = require('../models/user.model');
const passport = require("passport");
const bodyParser = require('body-parser');

var urlencodedParser = bodyParser.urlencoded({ extended: false })

module.exports = function (app) {

    app.get("/login", function (req, res) {
        res.render("login");
    });

    app.post("/login", urlencodedParser, (req, res, next) => {
        passport.authenticate("local", (err, user, info) => {
            if (err) {
                console.log("POST /login passport.authenticate()");
                console.log(err)
                req.flash("error", err.message);
                return next(err);
            }
            if (!user) {
                req.flash("error", "Invalid username or password");
                return res.redirect('/login');
            }
            req.logIn(user, err => {
                if (err) {
                    console.log("POST /login req.logIN()");
                    console.log(err)
                    req.flash("error", err.message);
                    return next(err);
                }
                let redirectTo = req.session.redirectTo ? req.session.redirectTo : '/'; //TODO
                delete req.session.redirectTo;
                console.log(user.username + " Logged in.");
                req.flash("success", "Good to see you again, " + user.username);
                res.redirect(redirectTo);
            });
        })(req, res, next);
    });

    // logout route
    app.get("/logout", (req, res) => {
        req.logout();
        req.flash("success", "Logged out seccessfully. Look forward to seeing you again!");
        res.redirect("/login");
    });


}