// NOTE setup MongoDB and Express here
const express = require('express');
const mongoose = require('mongoose');
const Question = require('./models/Question');
const cors = require('cors');
const app = express();
const {wrapAsync} = require('./utils/helper');

app.use(express.json());
app.use(cors());

var mongoDB =
	'mongodb+srv://Cse316rnsj:cse316finalp@cluster0.le5hh.mongodb.net/DayLogger';
mongoose
	.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true })
	.then(() => console.log('Connected to DB'))
	.catch(console.error);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// NOTE get all questions
app.get('/api/questions', wrapAsync (async function (req, res) {
	const questions = await Question.find();
	res.json(questions);
}));

// app.get('/api/questions', async function (req, res) {
// 	const questions = await Question.find({ agent: req.session.userId });
// 	const modifiedQuestions = questions.map((mappedQuestion) => {
// 		return mappedQuestion.toObject();
// 	});
// 	res.json(modifiedQuestions.reverse());
// });

// NOTE create new question
app.post('/api/questions', wrapAsync (async function (req, res) {
	const newQuestion = new Question({
		text: req.body.text,
		type: req.body.type,
		date: req.body.date,
		choices: req.body.choices,
		responses: req.body.responses
	});
	await newQuestion.save();
	res.json(newQuestion);
}))

// NOTE udpdate a question
app.put('/api/questions/:id', wrapAsync(async function (req, res) {
	let id = req.params.id;
	if (!mongoose.Types.ObjectId.isValid(id)) 
      return res.status(404).json({ msg: `No task with id :${id}` });
	Question.findByIdAndUpdate(
		id,
		{
			text: req.body.text,
			type: req.body.type,
			date: req.body.date,
			choices: req.body.choices,
			responses: req.body.responses,
		},
		function (err, result) {
			if (err) {
				console.log('ERROR: ' + err);
				res.send(err);
			} else {
				// Status 204 represents success with no content
				// https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/204
				res.sendStatus(204);
			}
		}
	);
}));

// NOTE delete a question
app.delete('/api/questions/:id', wrapAsync(async (req, res) => {
	const { id: id } = req.params;
	if (!mongoose.Types.ObjectId.isValid(id)) 
      return res.status(404).json({ msg: `No task with id :${id}` });
			
	const result = await Question.findByIdAndDelete(req.params.id);
	res.json(result);
}));

const port = 5000;
app.listen(port, () => console.log(`Server started on port ${port}`));
