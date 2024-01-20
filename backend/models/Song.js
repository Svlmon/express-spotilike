const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Song', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: true,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    time: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    artist_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    type_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    album_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'Song',
    timestamps: false
  });
};
