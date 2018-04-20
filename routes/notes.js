const route=require('express').Router();
const Note=require('../models/Notes')
var methodOverride = require('method-override')
var flash=require('connect-flash');


///mysql work


const mysql=require('mysql');
var db = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database:'test1'
});
db.connect((err)=>{
  if(err) throw err;
  console.log('mysql connected');
})



//load  helpers
const {ensureAuthenticated}=require('../helpers/auth')


route.get('/',ensureAuthenticated,(req,res)=>{
  let sql='SELECT * FROM items';
  let query=db.query(sql,(err,results)=>{
    if(err) throw err;
    console.log(results);
    res.render('items/index',{data:results});
  })
})
// route.get('/items',(req,res)=>{
//   let sql='SELECT * FROM items';
//   let query=db.query(sql,(err,results)=>{
//     if (err) throw err;
//     console.log(results);
//
//   })
// })

//add items by mysql
//
// route.get('/items/add',(req,res)=>{
//   let item={MobileNumber:9560386672,LastName:'Dwivedi',FirstName:'Ashutosh',Address:'E-182 ALPHA COMMERCIAL',pinCode:230301};
//   let sql='INSERT INTO items SET ?';
//
//   let query=db.query(sql,item,(err,results)=>{
//     if (err) throw err;
//     console.log(results);
//     res.send('new food added');
//   })
// })

// route.get('/newform',(req,res)=>{
//ensureAuthenticated,
// })
route.get('/add',ensureAuthenticated,(req,res)=>{
res.render('items/add');
})

//mysql added

route.post('/items/add',ensureAuthenticated,(req,res)=>{
  console.log(req.body);
  ///check errors
  const errors=[];
  if(!req.body.MobileNumber){
    errors.push({text:'Your must have a MobileNumber bro !'})
  }
  if(!req.body.FirstName){
    errors.push({text:'You should have first name !'})
  }
  if(!req.body.Address){
    errors.push({text:'You should ahave a valid address !'})
  }
  if(!req.body.pinCode){
    errors.push({text:'You should have a valid pinCode!'})
  }
  if(!req.body.LastName){
    errors.push({text:'You should have  a last name !'})
  }
  if(errors.length>0){
    res.render('notes/add',{errors:errors,title:req.body.title,details:req.body.details})
  }else{
    //save data to mysql
    let item={MobileNumber:'${req.body.MobileNumber}',LastName:'${req.body.LastName}',FirstName:'${req.body.FirstName}',Address:'${req.body.Address}',pinCode:'${req.body.pinCode}',itemDetails:'${req.body.itemDetails}'};
    let sql=`
    INSERT INTO items (MobileNumber, LastName, FirstName, Address, pinCode,itemDetails)
    VALUES ('${req.body.MobileNumber}', '${req.body.LastName}', '${req.body.FirstName}','${req.body.Address}','${req.body.pinCode}','${req.body.item}');
    `;

    let query=db.query(sql,item,(err,results)=>{
      if (err) throw err;
      console.log(results);
      req.flash('success_msg','New food added')
      res.redirect('/notes');
    })
  }
})


// route.post('/',ensureAuthenticated,(req,res)=>{
//   ///check errors
//   const errors=[];
//   if(!req.body.title){
//     errors.push({text:'Your Notes must have a title bro !'})
//   }
//   if(!req.body.details){
//     errors.push({text:'You should add some details for the Notes !'})
//   }
//   if(errors.length>0){
//     res.render('notes/add',{errors:errors,title:req.body.title,details:req.body.details})
//   }else{
//     //save data to mongodb
//     const newUser={
//       title:req.body.title,
//       details:req.body.details,
//       user:req.user.id
//     }
//     new Note(newUser)
//     .save()
//     .then(idea=>{
//
//     })
//   }
// })


//edit the notes

// route.get('/edit/:id',ensureAuthenticated,(req,res)=>{
//   //get the id from the req object and find them in mongodb and update it
//   Note.findOne({_id:req.params.id})
// .then((data)=>{
//   if(data.user !=req.user.id){
//     req.flash('error_msg','You are not authorized');
//     res.redirect('/notes')
//   }else{
//     res.render('notes/edit',{data:data})
//   }
// })
// })


// ///edit process
// route.put('/:id',ensureAuthenticated,ensureAuthenticated,(req,res)=>{
//   ///find a notes
//   Note.findOne({_id:req.params.id})
//   .then(data=>{
//     data.title=req.body.title;
//     data.details=req.body.details;
//     data.save()
//     .then(data=>{
// req.flash('success_msg','Notes Updated')
//       res.redirect('/notes')
//     })
//   })
//
// })

// //deleting the notes
// route.delete('/:id',ensureAuthenticated,(req,res)=>{
//   //get the note and delete it
//   Note.findOne({_id:req.params.id})
//   .remove()
//   .then(data=>{
//     req.flash('success_msg','Notes removed');
//     res.redirect('/notes')
//   })
// })

module.exports=route;
