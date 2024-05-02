const { db } = require('../db');
const { DataTypes } = require('sequelize');

const Item = db.define('item', {
  name: {
    type: DataTypes.STRING
  },
  image: {
    type: DataTypes.STRING
  },
  price: {
    type: DataTypes.FLOAT
  },
  vegetarian: {
    type: DataTypes.BOOLEAN
  }
})


module.exports = Item