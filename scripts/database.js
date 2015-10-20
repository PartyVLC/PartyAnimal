var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(':PartyAnimal:');

db.serialize(function() {
	db.run("CREATE TABLE IF NOT EXISTS Playlist ( \
		PlaylistID INTEGER PRIMARY KEY AUTOINCREMENT, \
		Name TEXT)");

	db.run("CREATE TABLE IF NOT EXISTS Song ( \
		SongID INTEGER PRIMARY KEY AUTOINCREMENT, \
		Title TEXT)");

	db.run("CREATE TABLE IF NOT EXISTS PlaylistSong ( \
		PlaylistID INTEGER FOREIGN KEY, \
		SongID INTEGER FOREIGN KEY, \
		Score INTEGER, \
		FOREIGN KEY(PlaylistID) REFERENCES Playlist(PlaylistID), \
		FOREIGN KEY(SongID) REFERENCES Song(SongID) \
		))");
});

db.close();