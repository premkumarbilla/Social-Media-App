const express = require('express');
const User = require('../models/user');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const tokenAuth = require('../middleware/chech-auth');


router.post("/signup", (req,res,next) => {

  bcrypt.hash(req.body.password,10)
      .then(hash=>{
          const user = new User({
          username: req.body.username,
          password: hash
      });
      user.save()
          .then(result => {
              res.status(201).json({
              message: "Sign Up Successful",
              result: result
            })
          })
          .catch(err=>{
            console.log("error caught");
            console.log(err.message);
              res.status(500).json({
              message: "Sign Up Unsuccessful",
              error :err
            })
          });
  });
});

router.post("/login", (req, res, next)=>{
    let fetchedUser;
    User.findOne({username : req.body.username})
      .then(user => {
        //find the user from database using email from the req.body
        //console.log(user);
        if(!user){
          return res.status(401).json({
            message: "Auth Failed"
          })
        }
        fetchedUser = user;
        return bcrypt.compare(req.body.password, user.password);
      })
      .then(result => {
        //console.log(result);
        if(!result){
          return res.status(401).json({
            message: "Auth Failed"
          })
        }
        //Create JSON Web Token
        const token = jwt.sign({email: fetchedUser.email, userId: fetchedUser._id},
                                "secret_this_should_be_longer",
                                {expiresIn: "1h"});

        return res.status(200).json({
          token: token,
          expiresIn: 3600
        })
      })
      .catch(err => {
            return res.status(401).json({
              message: "Auth Failed"
          });
      });
})

module.exports = router;
