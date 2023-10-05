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

const setData = require("../data/setData");
const themeData = require("../data/themeData");
let sets = [];

function initialize()
{
    return new Promise((resolve,reject)=>{
        var dummyID = 0;
        for(const x of setData)
        {
            for(const z of themeData)
            {
                if(x.theme_id == z.id)
                {
                   x.theme = z.name;
                }
            }
            sets.push(x);
        }
        if(sets.length> 0)
        {
            resolve();
        }
        else
        {
            reject();
        }
    });
   
}

function getAllSets()
{
    return new Promise((resolve, reject)=>{
        if(sets.length>0)
        {
            resolve(sets);
        }
        else
        {
            reject();
        }
    });
}

function getSetByNum(setNum)
{
    return new Promise((resolve,reject)=>{
        var yRn = false;
        for(x of sets)
        {
            if(x.set_num == setNum)
            { 
                resolve(x)
                yRn = true;
            }
        }
        if(yRn == false)
        {
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

// initialize().then(data=>{console.log(data)}).catch(err=>{console.log(err)});;
// getAllSets().then(data=>{console.log(data)}).catch(err=>{console.log(err)});
// getSetByNum("01-2").then(data=>{console.log(data)}).catch(err=>{console.log(err)});
// getSetsByTheme("te").then(data=>{console.log(data)}).catch(err=>{console.log(err)});

module.exports = { initialize, getAllSets, getSetByNum, getSetsByTheme }
