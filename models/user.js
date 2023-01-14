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
  step: { type: String, default: "0"},
},{
  collection: 'users'
});

const user = mongoose.model('user',userSchema);
module.exports = user;