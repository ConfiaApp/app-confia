module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('teams', 'updated_at', {
      type: Sequelize.DATE,
      allowNull: false,
    });
  },

  down: queryInterface => {
    return queryInterface.removeColumn('teams', 'updated_at');
  },
};
