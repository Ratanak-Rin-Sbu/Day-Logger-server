// NOTE setup MongoDB and Express here
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors());

var mongoDB = 'mongodb+srv://Cse316rnsj:cse316finalp@cluster0.le5hh.mongodb.net/DayLogger'
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => console.log("Connected to DB")).catch(console.error);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const Question = require('./models/Question');

app.get('/api/questions', async (req, res) => {
  const questions = await Question.find();

  res.json(questions);
})

app.post('/api/questions', async (req, res) => {
  const question = new Question({
    text: req.body.text,
    type: req.body.type,
    date: req.body.date,
    choices: req.body.choices
  });

  question.save();

  res.json(question)
})

app.put('/api/questions/:id', async function (req,res) {
  let id = req.params.id;
  Question.findByIdAndUpdate(id,
      {'text': req.body.text, "type": req.body.type, "date": req.body.date, "choices": req.body.choices},
      function (err, result) {
          if (err) {
              console.log("ERROR: " + err);
              res.send(err);
          } else {
              // Status 204 represents success with no content
              // https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/204
              res.sendStatus(204);
          }
      });
});

app.delete('/api/questions/:id', async (req,res) => {
  const result = await Question.findByIdAndDelete(req.params.id);

  res.json(result);
});

const port = 5000;
app.listen(port, () => console.log(`Server started on port ${port}`));