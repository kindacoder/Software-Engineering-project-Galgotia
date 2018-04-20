const LocalStrategy=require('passport-local').Strategy;
const mongoose=require('mongoose');
const bcrypt=require('bcryptjs');

///load user model'
const User= require('../models/User');


module.exports=function(passport){
  passport.use(new LocalStrategy({usernameField:'email'},(email,password,done)=>{
    ///check if a user exists with the same email
    User.findOne({email:email})
    .then(user=>{
      if(!user){
        return done(null,false,{message:'No user Found for this email'})
      }


      ////check if password matched ?
      bcrypt.compare(password,user.password,(err,isMatch)=>{
        if(err) throw err;
        if(isMatch){
          return done(null,user);

        }else{
          return done(null,false,{message:'Incorrect password Entered'})
        }
      })
    })
  }))


  passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

}
