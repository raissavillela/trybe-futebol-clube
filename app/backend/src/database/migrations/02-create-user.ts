import { QueryInterface, DataTypes, Model } from "sequelize";
import iUsers from "../../Interfaces/iUsers"

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.createTable<Model<iUsers>>('users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      username: {
        type: DataTypes.STRING
      },
      role: {
        type: DataTypes.STRING
      },
      email: {
        type: DataTypes.STRING
      },
      password: {
        type: DataTypes.STRING
      },
    });
  },
  down: async (queryInterface: QueryInterface) => {
    await queryInterface.dropTable('users');
  }
};