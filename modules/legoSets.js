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
require('dotenv').config();
var Sequelize = require('sequelize');
var sequelize = new Sequelize(process.env.DB_DATABASE,process.env.DB_USER,process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: 'postgres',
        port: 5432,
        dialectOptions: {
          ssl: { rejectUnauthorized: false },
        },
      });
     
const Theme = sequelize.define('Theme', { 
    id:{
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoincrement: true,
    },
    name: Sequelize.STRING
 });

const Set = sequelize.define('Set', { 
    set_num:{
        type:Sequelize.STRING,
        primaryKey:true,
    },
    name: Sequelize.STRING,
    year: Sequelize.INTEGER,
    num_parts: Sequelize.INTEGER,
    theme_id: Sequelize.INTEGER,
    img_url: Sequelize.STRING,
 },
 {
    createdAt: false,
    updatedAt: false,
 });


 Set.belongsTo(Theme, {foreignKey: 'theme_id'});



function initialize()
{
    return new Promise((resolve,reject)=>{
        sequelize.sync().then(data=>{
            resolve(data);
        }).catch(err=>
            {
                reject(err);
            })
    });
   
}

function getAllSets()
{
    return new Promise((resolve, reject)=>{
        Set.findAll({include: [Theme]}).then(data=>
            {
                resolve(data);
            }).catch(err=>{reject(err)});
    });
}

function getSetByNum(setNum)
{
    return new Promise((resolve,reject)=>{
        var yRn = false;
        var dummy = [];
        for(x of sets)
        {
            if(x.set_num == setNum)
            { 
                dummy.push(x)
                yRn = true;
            }
        }
        if(yRn == true)
        {
            resolve(dummy);   
        }
        else{
            reject("No data found...");
        }
    })

}

function getSetsByTheme(Theme)
{
    return new Promise((resolve,reject)=>{    
        var dummy = [];
        for(x of sets)
        {
            if(x.theme.toLowerCase().includes(Theme.toLowerCase()))
            {
                dummy.push(x);
            }
        }
        if(dummy.length > 0)
        {
            resolve(dummy);
        }
        else{
            reject("No data found....");
        }
    })

     
}


module.exports = { initialize, getAllSets, getSetByNum, getSetsByTheme }
