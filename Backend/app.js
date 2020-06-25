const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();

const postsRoutes = require('./routes/posts');
const userRoutes = require('./routes/users');
const mongoose = require('mongoose');

mongoose.connect("mongodb+srv://premkbM@cluster0-z6cvv.mongodb.net/meanDB?retryWrites=true&w=majority")
        .then(()=>{
          console.log("Database Connected");
        })
        .catch(()=>{
          console.log('connection Failed!')
        });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : false}));
app.use("/images", express.static(path.join("Backend/images")));

app.use((req,res,next)=>{
  res.setHeader("Access-Control-Allow-Origin","*");
  res.setHeader("Access-control-Allow-Headers","Content-Type,X-Requested-With, Origin, Accept, Authorization");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, PUT, OPTIONS");
  next();
})


app.use("/api/posts/",postsRoutes);
app.use("/api/user/",userRoutes);

module.exports = app;
