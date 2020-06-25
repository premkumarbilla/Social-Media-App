const express = require('express');
const Post = require('../models/post');
const router = express.Router();
const multer = require('multer');
const tokenAuth = require('../middleware/chech-auth');
const chechAuth = require('../middleware/chech-auth');

const MIME_TYPE_MAP = {
  'image/png':'png',
  'image/jpeg':'jpg',
  'image/jpg':'jpg'

}
const storage = multer.diskStorage({
  destination: (req, file, cb)=> {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error(" Invalid Image");
    if(isValid) error = null;
    cb(error,"Backend/images");
  },
  filename: (req, file, cb)=>{
    const name = file.originalname.toLowerCase().split(' ').join('-');
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name+"-"+Date.now()+"-"+ext);
  }
})
router.post('', tokenAuth , multer({storage:storage}).single("image"),(req,res,next)=>{
  const url = req.protocol+ "://" + req.get("host");
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + "/images/" + req.file.filename
  });
  console.log(post);
  post.save().then(createdPost => {
    res.status(201).json({
      message:"Post Method Successful",
      post : {
        ...createdPost,
        id: createdPost._id
      }
    })
  });
});

router.put('/:id',tokenAuth, multer({storage:storage}).single("image"),(req,res,next)=>{
  let imagePath = req.body.imagePath;
  if(req.file){
    const url = req.protocol+ "://" + req.get("host");
    imagePath =  url + "/images/" + req.file.filename
  }

  const post = {_id: req.body.id,title: req.body.title, content: req.body.content,imagePath: imagePath};
  Post.updateOne({_id:req.params.id}, post).then((result) => {
    res.status(200).json({
      message: " Update Successful !!! ",
      post : post
    });
  });
})

router.get('',tokenAuth,(req,res,next) => {
  const pageSize = +req.query.pageSize;
  const currentPage = +req.query.currentPage;
  const postQuery = Post.find();
  let fetchedPosts;
  if(pageSize && currentPage){
    postQuery.skip(pageSize*(currentPage-1))
             .limit(pageSize);
  }
  postQuery.then(docs =>{
        fetchedPosts = docs
        return Post.count();
        }).then(count=>{
          res.status(200).json({
            message: "Posts delivered successfully!!!",
            posts: fetchedPosts,
            maxPosts: count
          });
        })
});

router.get("/:id",tokenAuth, (req, res, next) => {
  Post.findById(req.params.id).then(post => {
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({ message:"Post not found!"});
    }
  });
});

router.delete('/:id',tokenAuth,(req,res,next)=>{

  Post.deleteOne({_id:req.params.id}).then((result) => {
    res.status(200).json({
      message: " delete successful "
    });
  });
})



module.exports  = router;
