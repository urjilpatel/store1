var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var supplier_schema = new Schema({
supplier_name:String,
supplierp_place:String,
supplier_contact:String

});

module.exports = mongoose.model('supplier',supplier_schema);