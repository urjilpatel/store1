var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var Admin_schema = new Schema({

Admin_name:{type:String},
Admin_email:String,
Admin_password:String,
created_date:{ type: Date, default: Date.now },
updated_date:{ type: Date, default: Date.now }


});
module.exports  = mongoose.model('Admin',Admin_schema);       