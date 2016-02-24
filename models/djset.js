var mongoose = require('mongoose');

module.exports = mongoose.model('Set',{
	id: String,
	title: String,
	users: [],
	songs: []
});