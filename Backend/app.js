const express = require('express');

const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : false}));

app.use((req,res,next)=>{
  res.setHeader("Access-Control-Allow-Origin","*");
  res.setHeader("Access-control-Allow-Headers","Content-Type,X-Requested-With, Origin, Accept");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, PUT, OPTIONS");
  next();
})

app.post('/api/posts',(req,res,next)=>{
  const post = req.body;
  console.log(post);
  res.status(201).json({
    message:"Post Method Successful"
  })
});

app.get('/api/posts',(req,res,next) => {

  const posts = [
    {id: "fsadsa13", title:"1", content: "1"},
    {id: "fsadsa11", title:"3", content: "3"},
    {id: "fsadsa11", title:"4", content: "4"},
    {id: "fsadsa12", title:"2", content: "2"}
  ];
  res.status(200).json({
    message: "Posts delivered successfully!!!",
    posts: posts
  });
});




module.exports = app;
