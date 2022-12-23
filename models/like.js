'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Like extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Like.init({
    likeId: {
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    userId: DataTypes.STRING,
    postId: DataTypes.STRING,
    amount: DataTypes.SMALLINT
  }, {
    sequelize,
    modelName: 'Like',
  });
  return Like;
};