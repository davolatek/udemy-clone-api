import express from 'express'
import cors from 'cors'
import fs from 'fs'
const morgan = require('morgan');
require('dotenv').config();
import mongoose from 'mongoose';


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


//routes

fs.readdirSync('./routes').map((route)=>{
    app.use('/api', require(`./routes/${route}`));
})

app.listen(port, ()=>{
    console.log(`App running on ${port}`)
})


