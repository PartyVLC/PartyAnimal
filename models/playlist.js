'use strict';
module.exports = function(sequelize, DataTypes) {
  var Playlist = sequelize.define('Playlist', {
    title: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Playlist;
};