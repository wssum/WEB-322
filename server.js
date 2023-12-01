/*/////////////////////////////////////////////////////////////////////////
  <a class="<%= (page == "/lego/addSet") ? 'active' : '' %>" href="/lego/addSet">Add to Collection</a>
    <p> </p>
Assignment #6

Full Name :Wilson Sum

Student ID#:017142142

Email :wssum@myseneca.ca

Section :WEB322NAA

Authenticity Declaration:

I declare this submission is the result of my own work and has not been

shared with any other student or 3rd party content provider. This submitted

piece of work is entirely of my own creation.

/////////////////////////////////////////////////////////////////////////*/
const legoData = require("./modules/legoSets");
const authData = require("./modules/auth-service");
var clientSessions = require("client-sessions");
var express = require("express");
var path = require("path");
var app = express();
var port = process.env.PORT || 8080;
app.use(express.static('public'));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(
     clientSessions({
       cookieName: 'session', // this is the object name that will be added to 'req'
       secret: process.env.DB_SECRET, // this should be a long un-guessable string.
       duration: 2 * 60 * 1000, // duration of the session in milliseconds (2 minutes)
       activeDuration: 1000 * 60, // the session will be extended by this many ms each request (1 minute)
     })
   );

   app.use((req, res, next) => {
     res.locals.session = req.session;
     console.log(res.locals.session);
     next();
     });
   function ensureLogin(req, res, next) {
     if (!req.session.user) {
       res.redirect('/login');
     } else {
       next();
     }
   }

   app.get("/lego/editSet/:num",ensureLogin, async (req,res)=>
   {
     try{
          var setData = await legoData.getSetByNum(req.params.num);
          var themeData = await legoData.getAllThemes();
          res.render("editSet", { themes: themeData, set: setData });
          }catch(err)
          {
               res.status(404).render("404", { message: err });
          }
   });

   app.post("/lego/editSet",ensureLogin,(req,res)=>
   {
     legoData.editSet(req.body.set_num, req.body).then(data=>{
          res.redirect("/lego/sets");
      }).catch(err=>{
          res.render("500", { message: `I'm sorry, but we have encountered the following error: ${err}` });
          console.log("500: "+err);
     });
   });

   app.get("/lego/addSet",ensureLogin, (req,res,next)=>
   {
     legoData.getAllThemes().then(data=>{
          res.render("addSet", { themes: data });
      }).catch(err=>{
          next({message: "Unable to find requested set."});
          console.log("404: "+err);
     }); 
   });

   app.get("/lego/deleteSet/:num",ensureLogin,(req,res)=>
   {
     legoData.deleteSet(req.params.num).then(data=>
          {
               res.redirect("/lego/sets");
          }).catch(err=>{
               res.render("500", { message: `I'm sorry, but we have encountered the following error: ${err}` });
               console.log("500: "+err);
          });
   });

   app.post("/lego/addSet",ensureLogin, (req,res)=>
   {
     legoData.addSet(req.body).then(data=>{
          res.redirect("/lego/sets");
      }).catch(err=>{
          res.render("500", { message: `I'm sorry, but we have encountered the following error: ${err}` });
          console.log("500: "+err);
     });
   });

   app.post("/register",(req,res)=>
   {
    authData.registerUser(req.body).then(data=>
     {res.render("register", {errorMessage: "", successMessage:"Registered Successfully!!!"})})
    .catch(err=>{res.render("register", {errorMessage: err, userName: req.body.userName, successMessage:""})});
   });

   app.get("/register",(req,res)=>
   {
     res.render("register", {errorMessage:"",successMessage:""});
   });

app.get("/login",(req,res)=>
{
  res.render("login", {errorMessage:""});
});

app.post("/login",(req,res)=>
{
  req.body.userAgent = req.get('User-Agent');
  authData.checkUser(req.body).then((user) => {
     req.session.user = {
     userName: user.userName, // authenticated user's userName
     email: user.email,// authenticated user's email
     loginHistory: user.loginHistory// authenticated user's loginHistory
     };
     res.redirect('/lego/sets');
     }).catch(err => {res.render("login", {errorMessage: err, userName: req.body.userName});});
});

app.get("/userHistory",ensureLogin, (req,res)=>
{
  res.render("userHistory");
});

app.get("/logout",(req,res)=>
{
  req.session.reset();
  res.redirect("/");
});

app.get("/",(req,res)=>
{
     res.render("home")
});

app.get("/lego/sets/:id",(req,res,next)=>
{
     legoData.getSetByNum(req.params.id).then(data=>{
          res.render("set", {set: data});
      }).catch(err=>{
          next({message: "Unable to find requested set."});
          console.log("404: "+err);
     });
});

app.get("/views/about",(req,res)=>
{
     res.render("about");
});

app.get("/lego/sets",(req,res,next)=>
{
     if(req.query.theme)
     {
          legoData.getSetsByTheme(req.query.theme).then(data=>{
               res.render("sets",{lego:data});}).catch(err=>{
               next({message: "Unable to find requested sets."});
               console.log("404: "+err);
          }); 
     }
     else
     {
          legoData.getAllSets().then((data)=>{
               res.render("sets",{lego:data});
          }).catch(err=>{
               next({message: "I'm sorry, we're unable to find what you're looking for."});
               console.log("404: "+err);
          })
     }     
});

app.use((err,req,res,next)=>
{
   res.status(404).render("404",{message: err.message});
});

legoData.initialize()
.then(authData.initialize)
.then(function(){
app.listen(port, function(){
console.log(`app listening on: ${port}`);
});
}).catch(function(err){
console.log(`unable to start server: ${err}`);
});