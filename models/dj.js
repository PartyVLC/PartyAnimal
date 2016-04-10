var mongoose = require('mongoose'),
    Schema = mongoose.Schema

module.exports = mongoose.model('DJ',{
	username: String,
	password: String,
	email: String,
	firstName: String,
	lastName: String,
	playlists: 
    [{ 
      title: String,
      songs: 
        [{ 
          title: String,
          id : String
        }]
    }]
  currentPlaylist: 
    { 
      title: String,
      songs: 
        [{ 
          title: String,
          id : String
        }] 
    },
  currentSong: Number
});