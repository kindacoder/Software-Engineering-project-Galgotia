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
      res.redirect('/foods');
    })
  }
})

module.exports=route;
