// NOTE Check if it is a valid email address
exports.validateEmail = function (email) {
	return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(email);
};

// NOTE Check if it is a valid password
exports.validatePassword = function (password) {
	return /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/.test(password);
};
