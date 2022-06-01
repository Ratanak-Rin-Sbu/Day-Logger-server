// NOTE Question Schema
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var QuestionSchema = new Schema(
  {
    text: {type: String},
    type: {type: String},
    date: {type: String},
    choices: {type: Array},
    responses: {type: String},
    agent: { type: Schema.Types.ObjectId, ref: 'User', required: false },
  }
)

module.exports = mongoose.model('Question', QuestionSchema);
