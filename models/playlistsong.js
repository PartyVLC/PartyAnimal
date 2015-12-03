"use strict";

module.exports = function(sequelize, DataTypes) {
  var PlaylistSong = sequelize.define("PlaylistSong", {
    title: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        PlaylistSong.hasMany(models.Song)
        PlaylistSong.belongsTo(models.Playlist, {
          onDelete: "CASCADE",
          foreignKey: {
            allowNull: false
          }
        });
      }
    }
  });

  return PlaylistSong;
};