// NOTE Number Response Schema
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var NumberResponseSchema = new Schema(
  {
    response: {type: String},
    date: {type: String},
    di: {type: String},
    type: {type: String},
  }
)

module.exports = mongoose.model('NumberResponse', NumberResponseSchema);