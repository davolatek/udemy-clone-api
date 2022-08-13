import express from 'express'
import cors from 'cors'
import fs from 'fs'
import csrf from 'csurf'
import cookieParser from 'cookie-parser'
const morgan = require('morgan');
require('dotenv').config();
import mongoose from 'mongoose';



const csrfProtection = csrf({cookie: true})

// create express app
const app = express()



// port

const port = process.env.PORT || 8000

// db connection

mongoose.connect(process.env.MONGO_URL).then(()=>{
    console.log("Database connected successfully");
}).catch((error)=>{
    console.error(error.message);
})
// apply middlewares

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// use cookieparser

app.use(cookieParser())


//routes

fs.readdirSync('./routes').map((route)=>{
    app.use('/api', require(`./routes/${route}`));
})

app.use(csrfProtection);

app.get('/api/csrf-token', (req, res)=>{
    res.json({csrfToken: req.csrfToken()})
})
app.listen(port, ()=>{
    console.log(`App running on ${port}`)
})


