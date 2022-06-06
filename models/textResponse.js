// NOTE Text Response Schema
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var TextResponseSchema = new Schema(
  {
    response: {type: String},
    date: {type: String},
    di: {type: String},
    type: {type: String},
    agent: { type: Schema.Types.ObjectId, ref: 'User', required: false },
  }
)

module.exports = mongoose.model('TextResponse', TextResponseSchema);