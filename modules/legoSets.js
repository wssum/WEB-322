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
 },
 {
    createdAt: false,
    updatedAt: false,
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

function getSetByNum(setNum) {
    return new Promise((resolve, reject) => {
        Set.findAll({
            include: [Theme],
            where: { set_num: setNum }
        }).then(data => {
            resolve(data[0]); // Returns the first set in the array
        }).catch(err => {
            reject(err);
        });
    });
}

function getSetsByTheme(dataTheme)
{
    return new Promise((resolve, reject)=>{
        Set.findAll({include: [Theme], where: {
            '$Theme.name$': {
            [Sequelize.Op.iLike]: `%${dataTheme}%`
            }
            }}).then(data=>
                        {
                            resolve(data);
                        }).catch(err=>{reject(err)});
    });
}

function addSet(setData)
{
  return new Promise(async (resolve,reject)=>
  {
    try{
       await Set.create(setData);
       resolve();
    }catch(err){
          reject(err);
    }
  });
}

function getAllThemes()
{
   return new Promise(async (resolve,reject)=>
   {
    try{
        var dummy = await Theme.findAll();
        resolve(dummy);
     }catch(err){
           reject(err.errors[0].message);
     }
   });
}

function editSet(setNum, setData)
{
    return new Promise(async (resolve,reject)=>{
        try{
           await Set.update(setData,{where:{set_num: setNum}});
           resolve();
        }
        catch(err)
        {
            reject(err.errors[0].message);
        }
    });
}

function deleteSet(setNum)
{
return new Promise(async (resolve,reject)=>
{
try{
await Set.destroy({where:{set_num:setNum}});
}catch(err)
{
    reject(err.errors[0].message);
}
});
}

module.exports = { initialize, getAllSets, getSetByNum, getSetsByTheme, addSet, getAllThemes, editSet,deleteSet};
// Code Snippet to insert existing data from Set / Themes

  