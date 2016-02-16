var mongoose = require('mongoose');

module.exports = mongoose.model('DJ',{
	id: String,
	username: String,
	password: String,
	email: String,
	firstName: String,
	lastName: String,
	playlists: []
});