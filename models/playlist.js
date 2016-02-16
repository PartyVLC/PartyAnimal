var mongoose = require('mongoose');

module.exports = mongoose.model('DJ',{
	id: String,
	title: String,
	users: [],
	songs: []
});