// NOTE setup MongoDB and Express here
const express = require('express');
// const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();

const MongoStore = require('connect-mongo');
const session = require('express-session');
const Question = require('./models/question');
const User = require('./models/user');
const numberResponse = require('./models/numberResponse');
const textResponse = require('./models/textResponse');
const booleanResponse = require('./models/booleanResponse');
const mcqResponse = require('./models/mcqResponse');

const { wrapAsync } = require('./utils/helper');

// app.use(express.json());
// app.use(cors());
// app.use(cors({ origin: 'http://localhost:3000', optionsSuccessStatus: 200 }));
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

// function wrapAsync(fn) {
// 	return function (req, res, next) {
// 		fn(req, res, next).catch((e) => next(e));
// 	};
// }

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
app.get('/api/questions', async function (req, res) {
	const questions = await Question.find({ agent: req.session.userId });
	const modifiedQuestions = questions.map((mappedQuestion) => {
		return mappedQuestion.toObject();
	});
	res.json(modifiedQuestions.reverse());
});

// NOTE create new question
app.post(
	'/api/questions',
	wrapAsync(async function (req, res) {
		const newQuestion = new Question({
			text: req.body.text,
			type: req.body.type,
			date: req.body.date,
			choices: req.body.choices,
			agent: req.session.userId,
		});
		await newQuestion.save();
		res.json(newQuestion);
	})
);

// NOTE udpdate a question
app.put(
	'/api/questions/:id',
	wrapAsync(async function (req, res) {
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
	})
);

// NOTE delete a question
app.delete(
	'/api/questions/:id',
	wrapAsync(async (req, res) => {
		const { id: id } = req.params;
		if (!mongoose.Types.ObjectId.isValid(id))
			return res.status(404).json({ msg: `No task with id :${id}` });

		const result = await Question.findByIdAndDelete(req.params.id);
		res.json(result);
	})
);


// REVIEW get all number responses
app.get('/api/number/responses', async function (req, res) {
	const numberResponses = await numberResponse.find({ agent: req.session.userId });
	const modifiedResponses = numberResponses.map((mappedResponse) => {
		return mappedResponse.toObject();
	});
	res.json(modifiedResponses.reverse());
});

// REVIEW get all text responses
app.get('/api/text/responses', async function (req, res) {
	const textResponses = await textResponse.find({ agent: req.session.userId });
	const modifiedResponses = textResponses.map((mappedResponse) => {
		return mappedResponse.toObject();
	});
	res.json(modifiedResponses.reverse());
});

// REVIEW get all boolean responses
app.get('/api/boolean/responses', async function (req, res) {
	const booleanResponses = await booleanResponse.find({ agent: req.session.userId });
	const modifiedResponses = booleanResponses.map((mappedResponse) => {
		return mappedResponse.toObject();
	});
	res.json(modifiedResponses.reverse());
});

// REVIEW get all mcq responses
app.get('/api/mcq/responses', async function (req, res) {
	const mcqResponses = await mcqResponse.find({ agent: req.session.userId });
	const modifiedResponses = mcqResponses.map((mappedResponse) => {
		return mappedResponse.toObject();
	});
	res.json(modifiedResponses.reverse());
});

// NOTE delete a number response
app.delete('/api/number/responses/:id', async function (req, res) {
	let id = req.params.id;
	const numberAfterDelete = await numberResponse.findByIdAndDelete(id);
	res.json(numberAfterDelete);
});

// NOTE delete a boolean response
app.delete('/api/boolean/responses/:id', async function (req, res) {
	let id = req.params.id;
	const booleanAfterDelete = await booleanResponse.findByIdAndDelete(id);
	res.json(booleanAfterDelete);
});

// NOTE delete a text response
app.delete('/api/text/responses/:id', async function (req, res) {
	let id = req.params.id;
	const textAfterDelete = await textResponse.findByIdAndDelete(id);
	res.json(textAfterDelete);
});

// NOTE delete a mcq response
app.delete('/api/mcq/responses/:id', async function (req, res) {
	let id = req.params.id;
	const mcqAfterDelete = await mcqResponse.findByIdAndDelete(id);
	res.json(mcqAfterDelete);
});

// for admin
app.get('/api/questions/admin', async function (req, res) {
	const questions = await Question.find();
	const modifiedQuestions = questions.map((mappedQuestion) => {
		return mappedQuestion.toObject();
	});
	res.json(modifiedQuestions.reverse());
});

app.get('/api/number/responses/admin', async function (req, res) {
	const numberResponses = await numberResponse.find();
	const modifiedResponses = numberResponses.map((mappedResponse) => {
		return mappedResponse.toObject();
	});
	res.json(modifiedResponses.reverse());
});

app.get('/api/text/responses/admin', async function (req, res) {
	const textResponses = await textResponse.find();
	const modifiedResponses = textResponses.map((mappedResponse) => {
		return mappedResponse.toObject();
	});
	res.json(modifiedResponses.reverse());
});

app.get('/api/boolean/responses/admin', async function (req, res) {
	const booleanResponses = await booleanResponse.find();
	const modifiedResponses = booleanResponses.map((mappedResponse) => {
		return mappedResponse.toObject();
	});
	res.json(modifiedResponses.reverse());
});

app.get('/api/mcq/responses/admin', async function (req, res) {
	const mcqResponses = await mcqResponse.find();
	const modifiedResponses = mcqResponses.map((mappedResponse) => {
		return mappedResponse.toObject();
	});
	res.json(modifiedResponses.reverse());
});

// NOTE create new number response
app.post(
	'/api/number/responses',
	wrapAsync(async function (req, res) {
		const newNumberResponse = new numberResponse({
			response: req.body.response,
			date: req.body.date,
			di: req.body.di,
			type: req.body.type,
			agent: req.session.userId,
		});
		await newNumberResponse.save();
		res.json(newNumberResponse);
	})
);

// NOTE create new text response
app.post(
	'/api/text/responses',
	wrapAsync(async function (req, res) {
		const newTextResponse = new textResponse({
			response: req.body.response,
			date: req.body.date,
			di: req.body.di,
			type: req.body.type,
			agent: req.session.userId,
		});
		await newTextResponse.save();
		res.json(newTextResponse);
	})
);

// NOTE create new boolean response
app.post(
	'/api/boolean/responses',
	wrapAsync(async function (req, res) {
		const newBooleanResponse = new booleanResponse({
			response: req.body.response,
			date: req.body.date,
			di: req.body.di,
			type: req.body.type,
			agent: req.session.userId,
		});
		await newBooleanResponse.save();
		res.json(newBooleanResponse);
	})
);

// NOTE create new mcq response
app.post(
	'/api/mcq/responses',
	wrapAsync(async function (req, res) {
		const newMcqResponse = new mcqResponse({
			response: req.body.response,
			date: req.body.date,
			di: req.body.di,
			type: req.body.type,
			agent: req.session.userId,
		});
		await newMcqResponse.save();
		res.json(newMcqResponse);
	})
);

// NOTE register user
app.post(
	`/api/register`,
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

// NOTE get all users
app.get('/api/users', async function (req, res) {
	const users = await User.find({});
	// const modifiedUsers = users.map((mappedUsers) => {
	// 	return mappedUsers.toObject();
	// });
	// res.json(modifiedUsers.reverse());
	res.json(users);
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
			address1: req.body.address1,
			address2: req.body.address2,
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

// NOTE delete a user by id
app.delete('/api/users/:id', async function (req, res) {
	let id = req.params.id;
	const usersAfterDelete = await User.findByIdAndDelete(id);
	res.json(usersAfterDelete);
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
	console.log('server started!');
});
