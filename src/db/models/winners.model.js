module.exports = (sequelize, Sequelize) => {
  return sequelize.define("winners", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    squares: {
      type: Sequelize.STRING,
      allowNull: false
    }
  });
};