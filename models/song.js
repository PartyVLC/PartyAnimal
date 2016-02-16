var mongoose = require('mongoose');

module.exports = mongoose.model('song',{
	id: String,
	title: String,
	url: String
});