// Requiring necessary npm packages
var express = require("express");
var session = require("express-session");  // this is the express-session middle ware that allows us to have session on server side
// to save info for each user session
// Requiring passport as we've configured it
// passport express middleware uses express-session middleware to store its own data
var passport = require("./config/passport"); 
var PORT = process.env.PORT || 8080;
var db = require("./models");

// Creating express app and configuring middleware needed for authentication
var app = express();
//middlware are essentionally functions that take req, res, next as variables and will call next only when it wants to move 
//to the next function of middleware.... in the process it changes req and res the way the function wants.
app.use(express.urlencoded({ extended: true }));  //mainly about POST , PUT  requests.. not requried for GET & Delete requests, 
//  for post requests which has body parser working on back ground -  the pulls out the data from "body" wrapping.
// express.json() is a method inbuilt in express to recognize the incoming Request Object as a JSON Object.
//express.urlencoded() is a method inbuilt in express to recognize the incoming Request Object as strings or arrays.
// can use bodyParser instead of these inbuilt express functions.
app.use(express.json()); // used for REST application , changes raw data to Json.  In general 
app.use(express.static("public"));
// We need to use sessions to keep track of our user's login status
app.use(session({ secret: "keyboard cat", resave: true, saveUninitialized: true })); // here we call the 
//session package and give it an object which represents our options
// in the options we can use {store:  sessionStoreObj - which contains info on to connect to database  also can add 
//collection: "session" - than is the collection name where session info is saved}  so in conclusion we are telling the 
//server that we want to use our database to store session info
// to store session data instead of this program using it on server memory
//secret will be saved in environment variables and wont be shown to user
//basically saying if secret is invalid the session is invalid
// when a request is sent, session ID is created and the session ID will be passed by cookie
// resave & saveUninitialized tells server/middleware what to do and how to react if nothing has changed and etc..
// we can add:  cookie: { maxAge: 1000 * 60 * 60 * 24 } equals to 1 day
// so what will happen is that when we send a get request, the middleware is going to create a session
// and take that sessionID and set the cookie equal to session ID then the cookie will be put in the "http header"
// which will be the response header and brower will receive it and save it and from then onwards every request will 
// sent with that cookie. 


app.use(passport.initialize());
app.use(passport.session());

// Requiring our routes
require("./routes/html-routes.js")(app);
require("./routes/api-routes.js")(app);

// Syncing our database and logging a message to the user upon success
db.sequelize.sync().then(function() {
  app.listen(PORT, function() {
    console.log("==> 🌎  Listening on port %s. Visit http://localhost:%s/ in your browser.", PORT, PORT);
  });
});
