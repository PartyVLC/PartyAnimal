var mongoose = require('mongoose'),
    Schema = mongoose.Schema

module.exports = mongoose.model('DJ',{
  isAdmin: Boolean,
  isActive: Boolean,
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
        }],
      currentSong: Number
    }],
  currentPlaylist: 
    { 
      title: String,
      songs: 
        [{ 
          title: String,
          id: String,
          score: Number
        }],
      currentSong: Number
    },
});