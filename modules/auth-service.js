require('dotenv').config();
var bcrypt = require("bcryptjs");
var mongoose = require("mongoose");
var schema = mongoose.Schema;
var userSchema = new schema(
{
userName:{
    type:String,
    unique:true
},
password: String,
email: String,
loginHistory: [{dateTime:Date, userAgent: String}]
});
let User; 

function initialize()
{
    return new Promise(function (resolve, reject) {
        let db = mongoose.createConnection("mongodb+srv://wssum:7895123Zz@wssumcluster.mtthdw5.mongodb.net/a6?retryWrites=true&w=majority");//ask prof about database
        db.on('error', (err)=>{
        reject(err); // reject the promise with the provided error
        });
        db.once('open', ()=>{
        User = db.model("users", userSchema);
        resolve();
        });
        });
}

function registerUser(userData)
{
    return new Promise((resolve, reject) => {
        console.log(userData)
        if(userData.password == userData.password2)
        {
            let newUser = new User(userData);
            bcrypt.hash(newUser.password, 10).then(hash=>{
                newUser.password = hash;
                newUser.save().then( data=>{resolve(data);console.log(userData.password);
                    console.log(newUser.password);}).catch(err=>
                    {
                      var dummy = (err.code == 11000)? "User Name already taken": "There was an error creating the user:"+err;
                        reject(dummy);
                  });
                })
                .catch(err=>{
                console.log(err);
                reject("There was an error encrypting the password"); // Show any errors that occurred during the process
                });

            
        }
        else{
         reject("Passwords do not match");   
        }
    })
 
}



function checkUser(userData) {
    return new Promise(async (resolve, reject) => {
        try {
            let users = await User.find({ userName: userData.userName });
            if (users.length === 0) {
                reject("Unable to find user: " + userData.userName);
                return;
            }
            const passwordMatch = await bcrypt.compare(userData.password, users[0].password);
            if (!passwordMatch) {
                reject("Incorrect Password for user: " + userData.userName);
                return;
            }
            if(users[0].loginHistory.length == 8)
            {
                users[0].loginHistory.pop();     
            }
            users[0].loginHistory.unshift({dateTime: (new Date()).toString(), userAgent:
                userData.userAgent});
            await User.updateOne({ userName: users[0].userName }, { $set: { loginHistory: users[0].loginHistory } });
            resolve(users[0]);
        } catch (err) {
            reject(err);
        }
    });
}

module.exports = {initialize, checkUser, registerUser};