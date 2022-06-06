// NOTE User Schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const validator = require('../utils/validator');
const bcrypt = require('bcrypt');

var UserSchema = new Schema({
	name: {
		type: String,
	},
	email: {
		type: String,
		validate: {
			validator: validator.validateEmail,
			message: (props) => `${props.value} is not a valid email!`,
		},
		trim: true,
		unique: true,
	},
	password: {
		type: String,
		default: '',
		minlength: 8,
		validate: {
			validator: validator.validatePassword,
			message: (props) => `${props.value} is not a valid password!`,
		},
	},
	address1: {
		type: String,
		default: '',
	},
	address2: {
		type: String,
		default: '',
	},
	profileImageUrl: {
		type: String,
		default: '',
	},
	// FIXME it won't save on the DB!!
	isAdmin: {
		type: Boolean,
		default: false,
	},
});

UserSchema.statics.findAndValidate = async function (email, password) {
	const user = await this.findOne({ email });
	if (!user) {
		return false;
	}
	const isValid = await bcrypt.compare(password, user.password);
	return isValid ? user : false;
};

UserSchema.pre('save', async function (next) {
	if (!this.isModified('password')) return next();
	this.password = await bcrypt.hash(this.password, 10);
	next();
});

module.exports = mongoose.model('User', UserSchema);
