var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var pay_schema = new Schema({
    purchase:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'purchase'
    },
pay_amount:String,
pay_date:Date,
pay_recno:String,
pay_remaining:Number,
supplier:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'supplier'
}
});

module.exports = mongoose.model('pay',pay_schema);