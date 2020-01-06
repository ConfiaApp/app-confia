import Sequelize from 'sequelize';

import databaseConfig from '../config/database';

import User from '../app/models/User';
import File from '../app/models/File';
import Player from '../app/models/Player';
import Status from '../app/models/Status';
import Team from '../app/models/Team';
import Challenge from '../app/models/Challenge';
import ChallengeType from '../app/models/ChallengeType';

const models = [User, File, Player, Status, Team, Challenge, ChallengeType];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);
    models
      .map(model => model.init(this.connection))
      .map(model => model.associate && model.associate(this.connection.models));
  }
}
export default new Database();
