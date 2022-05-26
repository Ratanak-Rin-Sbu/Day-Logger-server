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
	},

	// REVIEW Address: the address should be stored as two separate strings, one for each text field. The
	// address strings should NOT be stored directly in the User schema – either store the
	// Address in an embedded document in the User’s schema or referenced in a separate
	// document.

	// address1: {
	// 	type: String,
	// 	default: '',
	// },
	// address2: {
	// 	type: String,
	// 	default: '',
	// },
	profileImageUrl: {
		type: String,
		default: '',
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
