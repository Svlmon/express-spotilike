const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Song_Type', {
    song_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      unique: true
    },
    type_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      unique: true
    }
  }, {
    sequelize,
    tableName: 'Song_Type',
    timestamps: false,
    indexes: [
      {
        name: "sqlite_autoindex_Song_Type_1",
        unique: true,
        fields: [
          { name: "song_id" },
          { name: "type_id" },
        ]
      },
    ]
  });
};
