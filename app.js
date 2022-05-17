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

const port = 5000;
app.listen(port, () => console.log(`Server started on port ${port}`));