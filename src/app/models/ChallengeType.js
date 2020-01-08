import Sequelize, { Model } from 'sequelize';

class ChallengeType extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
      },
      {
        sequelize,
      }
    );
    return this;
  }

  static associate(models) {
    this.belongsTo(models.Status, { foreignKey: 'status_id' });
  }
}

export default ChallengeType;
