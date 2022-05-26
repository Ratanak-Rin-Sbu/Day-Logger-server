// NOTE setup MongoDB and Express here
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const Question = require('./models/question');
const User = require('./models/user');
const bodyParser = require('body-parser');
const app = express();
const MongoStore = require('connect-mongo');
const session = require('express-session');

app.use(express.json());
// app.use(cors());
app.use(cors({ origin: 'http://localhost:3000', optionsSuccessStatus: 200 }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

var mongoDB =
	'mongodb+srv://Cse316rnsj:cse316finalp@cluster0.le5hh.mongodb.net/DayLogger';
mongoose
	.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true })
	.then(() => console.log('Connected to DB'))
	.catch(console.error);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

function wrapAsync(fn) {
	return function (req, res, next) {
		fn(req, res, next).catch((e) => next(e));
	};
}

const sessionSecret = 'make a secret string';

const store = MongoStore.create({
	mongoUrl: mongoDB,
	secret: sessionSecret,
	touchAfter: 24 * 60 * 60,
});

const sessionConfig = {
	store,
	name: 'session',
	secret: sessionSecret,
	resave: false,
	saveUninitialized: true,
	cookie: {
		httpOnly: true,
		expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
		maxAge: 1000 * 60 * 60 * 24 * 7,
	},
};

app.use(session(sessionConfig));

app.use((req, res, next) => {
	req.requestTime = Date.now();
	console.log(req.method, req.path);
	next();
});

app.use((err, req, res, next) => {
	console.log('Error handling called');
	res.statusMessage = err.message;

	if (err.name === 'ValidationError') {
		res.status(400).end();
	} else {
		res.status(500).end();
	}
});

// NOTE get all questions
app.get('/api/questions', async (req, res) => {
	const questions = await Question.find();
	res.json(questions);
});

// app.get('/api/questions', async function (req, res) {
// 	const questions = await Question.find({ agent: req.session.userId });
// 	const modifiedQuestions = questions.map((mappedQuestion) => {
// 		return mappedQuestion.toObject();
// 	});
// 	res.json(modifiedQuestions.reverse());
// });

// NOTE create new question
app.post('/api/questions', async (req, res) => {
	const newQuestion = new Question({
		text: req.body.text,
		type: req.body.type,
		date: req.body.date,
		choices: req.body.choices,
	});
	await newQuestion.save();
	res.json(newQuestion);
});

// NOTE udpdate a question
app.put('/api/questions/:id', async function (req, res) {
	let id = req.params.id;
	Question.findByIdAndUpdate(
		id,
		{
			text: req.body.text,
			type: req.body.type,
			date: req.body.date,
			choices: req.body.choices,
		},
		function (err, result) {
			if (err) {
				console.log('ERROR: ' + err);
				res.send(err);
			} else {
				res.sendStatus(204);
			}
		}
	);
});

// NOTE delete a question
app.delete('/api/questions/:id', async (req, res) => {
	const result = await Question.findByIdAndDelete(req.params.id);

	res.json(result);
});

// NOTE register user
app.post(
	'/api/register',
	wrapAsync(async function (req, res) {
		const { name, email, password } = req.body;
		const user = new User({ name, email, password });
		await user.save();
		req.session.userId = user._id;
		console.log(user);
		res.json(user);
	})
);

// NOTE login user
app.post(
	'/api/login',
	wrapAsync(async function (req, res) {
		const { email, password } = req.body;
		const user = await User.findAndValidate(email, password);
		console.log(user);
		if (user) {
			req.session.userId = user._id;
			res.json(user);
		} else {
			res.sendStatus(401);
		}
	})
);

// NOTE logout user
app.post(
	'/api/logout',
	wrapAsync(async function (req, res) {
		req.session.userId = null;
		res.sendStatus(204);
	})
);

// NOTE get a user
app.get('/api/users/loggedInUser', async function (req, res) {
	const user = await User.findOne({ _id: req.session.userId });
	console.log(user);
	res.json(user);
});

// NOTE update a user
app.put('/api/users', async function (req, res) {
	const id = req.session.userId;
	console.log(req.body);
	User.findByIdAndUpdate(
		id,
		{
			name: req.body.name,
			email: req.body.email,
			profileImageUrl: req.body.profileImageUrl,
		},
		function (err, result) {
			if (err) {
				console.log('ERROR: ' + err);
				res.send(err);
			} else {
				res.sendStatus(204);
			}
		}
	);
});

const port = 5000;
app.listen(port, () => console.log(`Server started on port ${port}`));
