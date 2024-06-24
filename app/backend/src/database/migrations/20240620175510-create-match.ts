import { QueryInterface, DataTypes } from "sequelize";

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.createTable('Matches', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      homeTeamId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Teams',
          key: 'id'
        }
      },
      homeTeamGoals: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      awayTeamId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Teams',
          key: 'id'
        }
      },
      awayTeamGoals: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      inProgress: {
        type: DataTypes.BOOLEAN,
        allowNull: false
      }
    });
  },
  down: async (queryInterface: QueryInterface) => {
    await queryInterface.dropTable('Matches');
  }
};