import { QueryInterface, DataTypes, Model } from "sequelize";
import iTeams from "../../Interfaces/iTeams"

module.exports = {
    up: async (queryInterface: QueryInterface) => {
      await queryInterface.createTable<Model<iTeams>>("teams", {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: DataTypes.INTEGER,
        },
        teamName: {
          type: DataTypes.STRING,
          allowNull: false,
          field: "team_name"
        },
      });
    },
    down: async (queryInterface: QueryInterface) => {
      await queryInterface.dropTable("teams");
    },
  };
  