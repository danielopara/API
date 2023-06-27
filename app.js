const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cors = require('cors')
const app = express()
const morgan = require('morgan')

const userRoutes = require('./api/user')

mongoose.connect('mongodb+srv://oparadaniv:root@cluster0.2srooen.mongodb.net/?retryWrites=true&w=majority',{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    connectTimeoutMS: 5000, 
  }).then(() => {
      console.log('Connected to MongoDB');
      // Start your application or perform database operations here
    })
    .catch((error) => {
      console.error('Error connecting to MongoDB:', error);
    });


app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


app.use('/users', userRoutes);

app.use((req, res, next)=>{
    const error = new Error("Not found");
    error.status = 404;
    next(error);
})

app.use((error, req, res, next)=>{
    res.status(error.status || 500);
    res.json({
        error:{
            message: error.message
        }
    })
})

module.exports = app;