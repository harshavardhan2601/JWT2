var mongoose = require('mongoose')
var registerScheme = new mongoose.Schema({
    first:String,
    email:String,
    password:String,
    mobile:String,
    status:Number,
  create_date: {
    type: Date,
    default: Date.now
  }
})

mongoose.model("register", registerScheme );