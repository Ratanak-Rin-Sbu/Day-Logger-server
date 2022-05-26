// NOTE Question Schema
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var QuestionSchema = new Schema({
	text: { type: String },
	type: { type: String },
	date: { type: String },
	choices: { type: Array },
	// responses: {type: Array}
});

module.exports = mongoose.model('Question', QuestionSchema);
