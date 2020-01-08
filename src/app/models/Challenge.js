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
    this.belongsTo(models.Player, { foreignKey: 'challenger_id' });
    this.belongsTo(models.Player, { foreignKey: 'opponent_id' });
    this.belongsTo(models.Player, { foreignKey: 'type_id' });
    this.belongsTo(models.Player, { foreignKey: 'status_id' });
  }
}

export default Challenge;
