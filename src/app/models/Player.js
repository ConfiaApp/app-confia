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
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'user_id' });
  }
}

export default Player;
