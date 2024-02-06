const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Song_Artist', {
    song_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      unique: true
    },
    artist_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      unique: true
    }
  }, {
    sequelize,
    tableName: 'Song_Artist',
    timestamps: false,
    indexes: [
      {
        name: "sqlite_autoindex_Song_Artist_1",
        unique: true,
        fields: [
          { name: "song_id" },
          { name: "artist_id" },
        ]
      },
    ]
  });
};
