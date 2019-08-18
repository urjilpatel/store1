var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var today_inc_schema = new Schema({
today_inc_amount:String,
today_inc_date:Date,



});

module.exports = mongoose.model('today_inc',today_inc_schema);