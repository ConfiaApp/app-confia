module.exports = {
  dialect: 'postgres',
  host: 'postgres',
  port: '5432',
  username: 'lucas',
  password: 'myPassword',
  database: 'confia_db',
  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true,
  },
};
