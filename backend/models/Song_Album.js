const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Song_Album', {
    song_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      unique: true
    },
    album_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      unique: true
    }
  }, {
    sequelize,
    tableName: 'Song_Album',
    timestamps: false,
    indexes: [
      {
        name: "sqlite_autoindex_Song_Album_1",
        unique: true,
        fields: [
          { name: "song_id" },
          { name: "album_id" },
        ]
      },
    ]
  });
};
