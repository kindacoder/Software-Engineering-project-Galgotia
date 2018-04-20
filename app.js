const express=require('express');
const app=express();
const port=process.env.PORT || 5100;
const mongoose=require('mongoose');
const bodyParser=require('body-parser');
const session=require('express-session');
const flash=require('connect-flash');
const methodOverride = require('method-override')
const exphbs  = require('express-handlebars');
const passport=require('passport')
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

app.get('/createdb',(req,res)=>{
  let sql='CREATE DATABASE test1';
  db.query(sql,(err,result)=>{
    if(err) throw err;
    res.send('Database created');
    console.log(result);
  })
})

//create table
app.get('/createtable',(req,res)=>{
  let sql=`CREATE TABLE items (
    MobileNumber int,
    LastName varchar(255),
    FirstName varchar(255),
    Address varchar(255),
    itemDetails varchar(255),
    pinCode int
);`;
  db.query(sql,(err,result)=>{
    if(err) throw err;
    res.send('Database created');
    console.log(result);
  })
})


//addding routers
const notesRoute=require('./routes/notes');
const foodsRoute=require('./routes/foods');
const userRoute=require('./routes/users');

//passport config
require('./config/passport')(passport)




///Connecting to database
mongoose.connect('mongodb://godiary:godiary@ds145188.mlab.com:45188/godiary')
.then(()=>{
  console.log('Connected to Database')
}).catch(()=>{
  console.log('Database connection error')
})

///Load notes model
var Note=require('./models/Notes');


//using the body parser middleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

///Method-override middleware
app.use(methodOverride('_method'))

//express session middleware
app.use(session({
  secret: 'my amazing secret',
  resave: true,
  saveUninitialized: true

}))

//passport middleware
app.use(passport.initialize());
  app.use(passport.session());


app.use(flash());
///setting some global variables for messages
app.use(function(req,res,next){
  res.locals.success_msg=req.flash('success_msg');
  res.locals.error_msg=req.flash('error_msg');
  res.locals.error=req.flash('error');
  res.locals.user=req.user || null;
  next();

})

///serve static files
app.use('/public',express.static('public'));

///using router
app.use('/notes',notesRoute);
app.use('/foods',foodsRoute);
app.use('/users',userRoute);

///setting-up the views .. Hnadlebars
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');


app.get('/',(req,res)=>{
  res.render('index')
})

app.get('/about',(req,res)=>{
  res.render('about');
})

app.listen(port,()=>{
  console.log('Server started at port '+port);
})
