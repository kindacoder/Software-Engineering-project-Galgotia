const mongoose=require('mongoose');
const Schema=mongoose.Schema;

///creartring a Schema for notes
const notesSchema=new Schema({
  title:{type:String,required:true},
  details:{type:String,required:true},
  date:{type:Date,default:Date()},
  user:{type:String,required:true}
})


const notesModel=mongoose.model('note',notesSchema);
module.exports=notesModel;
