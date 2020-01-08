import Sequelize, { Model } from 'sequelize';

class Player extends Model {
  static init(sequelize) {
    super.init(
      {
        trusts: Sequelize.INTEGER,
        beers: Sequelize.INTEGER,
      },
      {
        sequelize,
      }
    );
    return this;
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'user_id' });
    this.belongsTo(models.Team, { foreignKey: 'team_id' });
  }
}

export default Player;
