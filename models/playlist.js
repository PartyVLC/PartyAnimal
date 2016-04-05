var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

module.exports = mongoose.model('Playlist',{
	_creator: [ {type: Schema.Types.ObjectId, ref: 'DJ'} ],
	title: String,
	followers: [ {type: Schema.Types.ObjectId, ref: 'DJ'} ],
	songs: [ {type: Schema.Types.ObjectId, ref: 'Song'} ]
});
