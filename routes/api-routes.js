// Requiring our models and passport as we've configured it
var db = require("../models");
var passport = require("../config/passport");

module.exports = function (app) {
  // Using the passport.authenticate middleware with our local strategy.
  // If the user has valid login credentials, send them to the members page.
  // Otherwise the user will be sent an error
  app.post("/api/login", passport.authenticate("local", { failureRedirect: '/login-failure', successRedirect: '/login-success' }));


  // Route for signing up a user. The user's password is automatically hashed and stored securely thanks to
  // how we configured our Sequelize User Model. If the user is created successfully, proceed to log the user in,
  // otherwise send back an error
  app.post("/api/signup", function (req, res, done) {
    //----------------

    db.User.findOne({ where: { email: req.body.email } }).then(function (user) {

      if (user) {
        console.log("found issue")
        res.status(401).json({success: false, msg:"That email is already taken"});
        //res.status(401).json({err:"That email is already taken"});
        //return done(null, false, { message: 'That email is already taken' });
      }
      else {
        db.User.create({
          email: req.body.email,
          password: req.body.password
        })
          .then(function () {
            res.redirect(307, "/api/login");
          })
          .catch(function (err) {
            console.log(err)
            res.status(401).json(err);
            //res.redirect("/"); 
          });
      }
    });
    //----------------
  });

  // Route for logging user out
  app.get("/logout", function (req, res) {
    req.logout();  //automatically removes the user from the session 
    res.redirect("/");
  });

  // Route for getting some data about our user to be used client side
  app.get("/api/user_data", function (req, res) {
    if (!req.user) {
      // The user is not logged in, send back an empty object
      res.json({});
    } else {
      // Otherwise send back the user's email and id
      // Sending back a password, even a hashed password, isn't a good idea
      res.json({ 
        email: req.user.email,
        id: req.user.id
      });
    }
  });
//------------
// Redirect the user to Facebook for authentication.  When complete,
// Facebook will redirect the user back to the application at
//     /auth/facebook/callback
app.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email', 'public_profile'] }));
// Facebook will redirect the user to this URL after approval.  Finish the
// authentication process by attempting to obtain an access token.  If
// access was granted, the user will be logged in.  Otherwise,
// authentication has failed.
app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { 
                                      failureRedirect: '/' }), (req, res) => {
                                        if(req.user){
                                          res.redirect('/members')
                                        }else{
                                          res.redirect('/')
                                        }
                                        
                                      });


// app.get('/auth/facebook', passport.authenticate('facebook', {scope: ['email']}));

// app.get('/auth/facebook/callback', 
//   passport.authenticate('facebook', { successRedirect: '/profile',
//                                       failureRedirect: '/' }));

};

//------


