module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('player', 'team_id', {
      type: Sequelize.INTEGER,
      references: { model: 'team', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
      allowNull: true,
    });
  },

  down: queryInterface => {
    return queryInterface.removeColumn('player', 'team_id');
  },
};
