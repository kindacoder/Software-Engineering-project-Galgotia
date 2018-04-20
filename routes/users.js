const route=require('express').Router();
const mongoose=require('mongoose');
const bcrypt=require('bcryptjs');
const passport=require('passport');

//load  helpers
const {ensureAuthenticated}=require('../helpers/auth')

//import user model
const User=require('../models/User');

///Login Route
route.get('/login',(req,res)=>{
  res.render('users/login');
})





///Register Route
route.get('/register',(req,res)=>{
  res.render('users/register');
})

//login POST route handling
route.post('/login',(req,res,next)=>{
  passport.authenticate('local',{
    successRedirect:'/foods',
    failureRedirect:'/users/login',
    failureFlash:true
  })(req,res,next);
})


///logout functionality
route.get('/logout',(req,res)=>{
req.logout();
req.flash('success_msg','You have been Logged Out');
res.redirect('/users/login');
})



///register post
route.post('/register',(req,res)=>{
  ///doing some validation here
  const errors=[]
if(req.body.password !=req.body.password2){
  errors.push({text:'Password needs to be matched'})
}
///check the length of the password
if(req.body.password.length<4){
  errors.push({text:'password must be atleast 4 characters'});
}
if(errors.length>0){
  res.render('users/register',{
    errors:errors,
    name:req.body.name,
    email:req.body.email,
    password:req.body.password,
    password2:req.body.password2

  })
}

else{
  //create new user
  const newUser={
    name:req.body.name,
    email:req.body.email,
    password:req.body.password
  }
  ///check inthe database if user already exists with that email
  User.findOne({email:req.body.email})
  .then(data=>{
    if(data){
      req.flash('error_msg','User already exists')
      res.redirect('/users/register')
    }
    else{
      //hash the password with the help of beryptjs
      bcrypt.genSalt(10, function(err, salt) {
          bcrypt.hash(newUser.password, salt, function(err, hash) {
            if(err) throw err;
            else{
            newUser.password=hash;
            new User(newUser)
            .save()
            .then(data=>{
              req.flash('success_msg','Signup successfull, Now you can log in')
              res.redirect('/users/login')
            })
            }
          });
      });
    }
  })
}
})




module.exports=route;
