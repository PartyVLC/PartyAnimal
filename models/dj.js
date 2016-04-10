var mongoose = require('mongoose'),
    Schema = mongoose.Schema

module.exports = mongoose.model('DJ',{
	username: String,
	password: String,
	email: String,
	firstName: String,
	lastName: String,
	playlists: []
});