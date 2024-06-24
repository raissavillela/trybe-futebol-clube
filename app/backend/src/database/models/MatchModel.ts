import {
  DataTypes,
  Model,
} from 'sequelize';
import sequelize from './index';
import Team from './TeamModel';

class Match extends Model {
  declare id: number;
  declare homeTeamId: number;
  declare homeTeamGoals: number;
  declare awayTeamId: number;
  declare awayTeamGoals: number;
  declare inProgress: boolean;
}
Match.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    homeTeamId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'home_team_id',
    },
    homeTeamGoals: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'home_team_goals',
    },
    awayTeamId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'away_team_id',
    },
    awayTeamGoals: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'away_team_goals',
    },
    inProgress: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      field: 'in_progress',
    },
  },
  {
    sequelize,
    modelName: 'Match',
    tableName: 'matches',
    timestamps: false,
    underscored: true,
  },
);

Match.belongsTo(Team, {
  foreignKey: 'home_team_id',
  as: 'homeTeam',
});

Match.belongsTo(Team, {
  foreignKey: 'away_team_id',
  as: 'awayTeam',
});

export default Match;
