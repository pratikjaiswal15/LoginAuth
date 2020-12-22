const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// set up express app
const app = express();


//connect to mongodb
mongoose.connect('mongodb://127.0.0.1 /auth', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex : true,
  useFindAndModify : false,
});

var db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', function() {
  // we're connected!
  console.log("connected to mongodb")
});


// parse requests of content-type - application/json
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//cors erros
const cors = require('cors');
app.use(cors());

// allow requests from other access origins
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});



//error handling middleware
app.use((err, req, res, next) =>{
    // console.log(err)
    res.send({error : err.message})
})

const user = require('./routes/user-route')
app.use(user)
   
const PORT = process.env.PORT || 4000;

app.listen(PORT, function() {
    console.log('Node.js server is running on port ' + PORT);
})

