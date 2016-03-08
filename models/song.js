var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

module.exports = mongoose.model('Song',{
	_playlists: [ {type: Schema.Types.ObjectId, ref: 'Playlist'} ],
	title: String,
	url: String
});