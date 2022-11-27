const Sequelize = require("sequelize");

const sequelize = require("../util/database");

const Product = sequelize.define("product", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },

  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },

  imageUrl: {
    type: Sequelize.STRING,
    allowNull: false,
  },

  quantity: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },

  unitPrice: {
    type: Sequelize.DOUBLE,
    allowNull: false,
  },
});

module.exports = Product;
