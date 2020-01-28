import * as Yup from 'yup';
import Challenge from '../models/Challenge';
import ChallengeType from '../models/ChallengeType';
import Player from '../models/Player';
import User from '../models/User';

class ChallengeController {
  async index(req, res) {
    const { page = 1 } = req.query;

    const challenges = await Challenge.findAll({
      attributes: ['id'],
      order: [['created_at', 'DESC']],
      limit: 5,
      offset: (page - 1) * 5,
      include: [
        {
          model: Player,
          as: 'challenger',
          attributes: ['id', 'trusts', 'beers'],
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['id', 'name', 'email'],
            },
          ],
        },
        {
          model: Player,
          as: 'opponent',
          attributes: ['id', 'trusts', 'beers'],
        },
      ],
    });
    return res.json(challenges);
  }

  async show(req, res) {
    const challenge = await Challenge.findByPk(req.params.id, {
      attributes: ['id'],
      include: [
        {
          model: Player,
          as: 'challenger',
          attributes: ['id', 'trusts', 'beers'],
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['id', 'name', 'email'],
            },
          ],
        },
        {
          model: Player,
          as: 'opponent',
          attributes: ['id', 'trusts', 'beers'],
        },
        {
          model: ChallengeType,
          as: 'challengeType',
          attributes: ['id', 'name'],
        },
      ],
    });
    if (!challenge) {
      return res.status(404).json({ error: 'Challenge does not exists' });
    }
    return res.json(challenge);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      id_challenger: Yup.integer().required(),
      id_opponent: Yup.integer().required(),
      type_id: Yup.integer().required(),
    });
  }
}
export default new ChallengeController();
