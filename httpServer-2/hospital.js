const express = require("express");

const app = express();

const users = [{
    name: "david",
    lungs: [{
        healthy: true
    },{
        healthy: false
    }]
}]

app.use(express.json());

app.get('/', (req,res)=>{
    //get number of lungs, healthy lungs and unhealthy lungs
    const johnLungs = users[0].lungs;
    const numberOfLungs = johnLungs.length;
    const numberOfHealthyLungs = johnLungs.filter((lung) => lung.healthy == true).length;
    const numberOfUnhealthyLungs = numberOfLungs - numberOfHealthyLungs;
    res.json({
        numberOfLungs,
        numberOfHealthyLungs,
        numberOfUnhealthyLungs
    }) 
})

app.post('/', (req, res) => {
    //add new lungs
    try{
        const isHealthy = req.body.isHealthy;
        if(typeof isHealthy !== 'boolean'){//to check that user passing correct parameters
            res.status(400).json({
                error: 'Invalid request body'
            })
        }
        else{
            users[0].lungs.push({
                healthy: isHealthy
            })
            res.json({
                msg: "done"
            }) 

        }
    }
    catch (error){
        res.status(500).json({
            error: "Internal Server Error"
        })
    }


})

app.put('/', (req, res) => {
    //make all unhealthy lungs as healthy
    if(isUnhealthyLungPresent()){
        const lungs = users[0].lungs;
        lungs.map((lung) => lung.healthy = true);
        res.json({
            msg: "done"
        })
    }
    else{
        res.status(411).json({
            msg: "you have no bad lungs to make it healthy"
        })
    }
})

app.delete('/', (req,res) => {
    //delete all unhealthy lungs
    if(isUnhealthyLungPresent()){ //delete only if you have bad lungs
        users[0].lungs = users[0].lungs.filter((lung)=> lung.healthy == true);
        res.json({
            msg: "done"
        })
    }
    else{
        res.status(411).json({
            msg: "you have no bad lungs to remove"
        })
    }
})

function isUnhealthyLungPresent(){
    let isUnhealthyLungs = false;
    const lungs = users[0].lungs;
    lungs.map((lung) => (lung.healthy == false) ? isUnhealthyLungs = true : isUnhealthyLungs = isUnhealthyLungs)
    return isUnhealthyLungs;
}

app.listen(3000);