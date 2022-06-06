// NOTE Boolean Response Schema
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var BooleanResponseSchema = new Schema(
  {
    response: {type: String},
    date: {type: String},
    di: {type: String},
    type: {type: String},
  }
)

module.exports = mongoose.model('BooleanResponse', BooleanResponseSchema);