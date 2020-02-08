module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('challenges', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      challenger_id: {
        type: Sequelize.INTEGER,
        references: { model: 'players', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        allowNull: false,
      },
      opponent_id: {
        type: Sequelize.INTEGER,
        references: { model: 'players', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        allowNull: false,
      },
      type_id: {
        type: Sequelize.INTEGER,
        references: { model: 'challenge_types', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        allowNull: true,
      },
      status_id: {
        type: Sequelize.INTEGER,
        references: { model: 'statuses', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        allowNull: true,
      },
    });
  },

  down: queryInterface => {
    return queryInterface.dropTable('challenges');
  },
};
