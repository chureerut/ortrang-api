const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  prefixes:  String, 
  name: String,
  gender: String,
  age: String,
  birthday: Date ,
  address:String,
  tel:String,
  rights: String,
  telcontact:String,
  createdate:{ type: Date, default: Date.now },
  status:Boolean,
  lineid: String,
  linename: String,
  step: String,
});

// const userSchema = new mongoose.Schema({
//     name:  String, 
//     salary: String,
//     createdate:{ type: Date, default: Date.now }
//   });

const user = mongoose.model('users',userSchema);
module.exports = user;