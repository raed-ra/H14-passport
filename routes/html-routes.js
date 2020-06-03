// Requiring path to so we can use relative routes to our HTML files
var path = require("path");

// Requiring our custom middleware for checking if a user is logged in
var isAuth = require("../config/middleware/isAuthenticated").isAuth;

module.exports = function(app) {

  app.get("/", function(req, res) {
    //if going to root and user logged in already itll direct you to member page otherwise it'll stay in root page
    // by adding console.log(req.session) we can check the session info
    // If the user already has an account send them to the members page
    // by having below line you count how many times the user has visited this session
    // if (req.session.viewcount) {
    //   req.session.viewCount ++;
    // }
    if (req.user) {
      res.redirect("/members");
    }
    res.sendFile(path.join(__dirname, "../public/signup.html"));
  });

  app.get("/login", function(req, res) {  //if user is not logged in login page comesup otherwise it'll go to member page
    
    if (req.user) {
      res.redirect("/members");
    }
    res.sendFile(path.join(__dirname, "../public/login.html"));
  });

  // Here we've add our isAuthenticated middleware to this route.
  // If a user who is not logged in tries to access this route they will be redirected to the signup page
  app.get("/members", isAuth, function(req, res) {  // If the user already has an account send them to the members page
    res.sendFile(path.join(__dirname, "../public/members.html"));  
  });

  app.get("/login-success", (req, res, next) => {//after making a post request with login, that gets
    //intercepted by passport.authenticate middleware and check the username password. The passport then populates the email and password
    // in the passport
    res.send('<p>You successfully logged in. --> <a href="/members">Got to memberse</a></p>');
    //res.json(req.user);
  });
  app.get('/login-failure', (req, res, next) => {
    res.send('<p>Wrong credentials - failed to log in. --> <a href="/login">Try again</a></p>');
});
}

