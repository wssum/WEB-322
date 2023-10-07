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
app.use(express.static('views'));

app.get("/",(req,res)=>
{
     res.sendFile(path.join(__dirname+"/views/home.html"));
});

app.get("/views/home.html",(req,res)=>
{
     res.sendFile(path.join(__dirname+"/views/about.html"));
});

app.get("/lego/sets/:id?",(req,res,next)=>
{
     if(req.params.id)
     {
          legoData.getSetByNum(req.params.id).then(data=>{
                    res.send(data);
           }).catch(err=>{
               next(err);
               console.log("404: "+err);
          });
     }
     else if(req.query.theme)
     {///lego/sets?theme=technic
          legoData.getSetsByTheme(req.query.theme).then(data=>{
          res.send(data)}).catch(err=>{
               next(err);
               console.log("404: "+err);
          }); 
     }
     else
     {
          legoData.getAllSets().then((data)=>{
               res.send(data);
          }).catch(err=>{
               next(err);
               console.log("404: "+err);
          })
     }     
});

app.use((err,req,res,next)=>
{
     res.sendFile(path.join(__dirname+"/views/404.html"));
});

legoData.initialize().then(()=>{
     app.listen(port, ()=>{
          console.log("server listening on port: " + port)
     });
}).catch(err=>{
     console.log(err)
})

