var DataTypes = require("sequelize").DataTypes;
var _Album = require("./Album");
var _Artist = require("./Artist");
var _Song = require("./Song");
var _Song_Album = require("./Song_Album");
var _Song_Artist = require("./Song_Artist");
var _Song_Type = require("./Song_Type");
var _Type = require("./Type");
var _User = require("./User");

function initModels(sequelize) {
  var Album = _Album(sequelize, DataTypes);
  var Artist = _Artist(sequelize, DataTypes);
  var Song = _Song(sequelize, DataTypes);
  var Song_Album = _Song_Album(sequelize, DataTypes);
  var Song_Artist = _Song_Artist(sequelize, DataTypes);
  var Song_Type = _Song_Type(sequelize, DataTypes);
  var Type = _Type(sequelize, DataTypes);
  var User = _User(sequelize, DataTypes);


  return {
    Album,
    Artist,
    Song,
    Song_Album,
    Song_Artist,
    Song_Type,
    Type,
    User,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
