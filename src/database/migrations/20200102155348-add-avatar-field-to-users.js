module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('user', 'avatar_id', {
      type: Sequelize.INTEGER,
      references: { model: 'file', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
      allowNull: true,
    });
  },

  down: queryInterface => {
    return queryInterface.removeColumn('user', 'avatar_id');
  },
};
