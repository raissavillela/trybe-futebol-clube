import { QueryInterface, DataTypes, Model } from "sequelize";
import iMatches from "../../Interfaces/iMatches"

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.createTable<Model<iMatches>>('matches', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      homeTeamId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "home_team_id",
        references: {
          model: 'teams',
          key:
           'id'
        }
      },
      homeTeamGoals: {
        type: DataTypes.INTEGER,
        field: "home_team_goals",
        allowNull: false
      },
      awayTeamId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "away_team_id",
        references: {
          model: 'teams',
          key: 'id'
        }
      },
      awayTeamGoals: {
        type: DataTypes.INTEGER,
        field: "away_team_goals",
        allowNull: false
      },
      inProgress: {
        type: DataTypes.BOOLEAN,
        field: "in_progress",
        allowNull: false
      }
    });
  },
  down: async (queryInterface: QueryInterface) => {
    await queryInterface.dropTable('matches');
  }
};