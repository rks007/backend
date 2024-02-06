const express = require("express");

const app = express();

const users = [{
    name: "john",
    kidneys: [{
        healthy: false
    },{
        healthy: true
    },{
        healthy: true
    }]
}]

app.use(express.json());

app.get('/', (req, res) => {
    //write logic to show number of kidneys,number of healthy kidneys
    const johnKidney = users[0].kidneys;
    const numberOfKidneys = johnKidney.length;
    const numberOfHealthyKidneys = johnKidney.filter((kidney) => kidney.healthy == true).length;
    const numberOfUnhealthyKidneys = numberOfKidneys - numberOfHealthyKidneys;
    res.json({
        numberOfKidneys,
        numberOfHealthyKidneys,
        numberOfUnhealthyKidneys
    })
    
})

app.post('/', (req, res) => {
    //write logic to add new kidneys 
    const isHealthy = req.body.isHealthy;
    users[0].kidneys.push({
        healthy: isHealthy
    })
    res.json({
        msg: "Done"
    })
})

app.put('/', (req, res) => {
    //write logic to make all kidneys healthy status true
    const kidneys = users[0].kidneys;
    kidneys.map((kidney) => kidney.healthy = true)
    res.json({})
})

app.delete('/', (req, res) => {
    //delete unhealthy kidneys and and have a check that delete will work only if you have any bad kidneys present otherwise not
    if(isUnhealthyKidneyPresent()){
        users[0].kidneys = users[0].kidneys.filter((kidney) => kidney.healthy == true)
        res.json({
            msg: "done"
        })
    }
    else{
        res.status(411).json({
            msg: "you have no bad kidneys to remove"
        })
    }
})

function isUnhealthyKidneyPresent(){
    let isUnhealthyKidney = false;
    const userKidney = users[0].kidneys.forEach((kidney)=> (kidney.healthy == false) ? isUnhealthyKidney = true : isUnhealthyKidney = isUnhealthyKidney)

    return isUnhealthyKidney;
}

app.listen(3000)