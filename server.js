/*/////////////////////////////////////////////////////////////////////////

Assignment #2

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
var express = require("express");
var path = require("path");
var app = express();
var port = process.env.PORT || 8080;
app.use(express.static('public'));
app.set("view engine", "ejs");

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

//problem here is for some odd reason the /lego/sets/:id keeps leading to here
//and theres not even an error
app.use((err,req,res,next)=>
{
   res.status(404).render("404",{message: err.message});
});

legoData.initialize().then(()=>{
     app.listen(port, ()=>{
          console.log("server listening on port: " + port)
     });
}).catch(err=>{
     console.log(err)
})

