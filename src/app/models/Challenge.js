import { Model } from 'sequelize';

class Challenge extends Model {
  static init(sequelize) {
    super.init(
      {},
      {
        sequelize,
      }
    );
    return this;
  }

  static associate(models) {
    this.belongsTo(models.Player, {
      foreignKey: 'challenger_id',
      as: 'challenger',
    });
    this.belongsTo(models.Player, {
      foreignKey: 'opponent_id',
      as: 'opponent',
    });
    this.belongsTo(models.ChallengeType, { foreignKey: 'type_id', as: 'type' });
    this.belongsTo(models.Status, { foreignKey: 'status_id', as: 'status' });
  }
}

export default Challenge;
