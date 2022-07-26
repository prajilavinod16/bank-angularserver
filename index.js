//server creation 

//import express

const express = require('express')

//import jswebtoken
const jwt=require('jsonwebtoken')

//import cors
const cors=require('cors')

//import data service

const dataService = require('./services/data.services')  

//server app creation using expres

const app = express()

// cores use in app
app.use(cors({
    origin:'http://localhost:4200'
}))

//parse json data

app.use(express.json())

//application specific midleware
const appMiddleware=(req,res,next)=>{
    console.log("application specific middleware");
    next()
}

//use middleware in app
app.use(appMiddleware)



//bank server

const jwtMiddleware=(req,res,next)=>{
    //fetch token
    try{
        token = req.headers['x-access-token']
        console.log(token);
        //verify token
        const data =jwt.verify(token,'supersecretkey12345')
        console.log(data);
        req.currentAcno=data.currentAcno;
        next()
    }
     
    catch{
        res.status(401).json({
            status:false,
            statusCode:401,
            message:'please login'
        })
    }
   

}

//register API
app.post('/register', (req, res) => {
    dataService.register(req.body.acno, req.body.username, req.body.password)
        .then(result=>{
            res.status(result.statusCode).json(result)

        })
    // if(result){
    //     res.send("resgister successfully")
    // }else{
    //     res.send("already registered....please login")
    // }


})

//login API

app.post('/login', (req, res) => {
    dataService.login(req.body.acno, req.body.pswd)
    .then(result=>{
        res.status(result.statusCode).json(result)

    })

})

//deposit API

app.post('/deposit',jwtMiddleware, (req, res) => {
    dataService.deposit(req, req.body.acno, req.body.password, req.body.amt)
    .then(result=>{
        res.status(result.statusCode).json(result)

    })

})

//withdraw API

app.post('/withdraw',jwtMiddleware, (req, res) => {
    dataService.withdraw(req, req.body.acno, req.body.password, req.body.amt)
    .then(result=>{
        res.status(result.statusCode).json(result)

    })

})


//transaction API

app.post('/transaction',jwtMiddleware, (req, res) => {
    dataService.getTransaction(req.body.acno)
    .then(result=>{
        res.status(result.statusCode).json(result)
    })

})

app.delete('/deleteAcc/:acno',jwtMiddleware,(req,res)=>{
    //delete solving
    dataService.deleteAcc(req.params.acno)
    .then(result=>{
        res.status(result.statusCode).json(result)

    })
})



//user request resolving

//GET request to fetch data 

app.get('/', (req, res) => {
    res.send("GET request")
})

//POST request to create data in server 
app.post('/', (req, res) => {
    res.send("POST request")
})

// PUT request to modify entire require

app.put('/', (req, res) => {
    res.send("PUT request")
})

//PATCH request for partialy modify data

app.patch('/', (req, res) => {
    res.send("patch request")
})

//DELETE request 

app.delete('/', (req, res) => {
    res.send("delete request")
})



//set up port numbet to the server app

app.listen(3000, () => {
    console.log("server started");
})