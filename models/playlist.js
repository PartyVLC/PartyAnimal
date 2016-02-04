var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Playlist = new Schema({
    plname: String,
    owner: String,
    songs: String
});

Playlist.plugin(passportLocalMongoose);

module.exports = mongoose.model('Playlist', Playlist);