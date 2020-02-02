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
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['id', 'name', 'email'],
            },
          ],
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
      challenger_id: Yup.number()
        .integer()
        .required(),
      opponent_id: Yup.number()
        .integer()
        .required(),
      type_id: Yup.number()
        .integer()
        .required(),
      status_id: Yup.number()
        .integer()
        .required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Params validation failed' });
    }
    const challenger = await User.findByPk(req.body.challenger_id);
    if (!challenger) {
      return res.status(404).json({ message: 'Challenger does not exists' });
    }

    const opponent = await User.findByPk(req.body.opponent_id);
    if (!opponent) {
      return res.status(404).json({ message: 'Opponent does not exists' });
    }

    if (challenger.id === opponent.id) {
      return res
        .status(400)
        .json({ error: 'You are not allowed to challenge yourself' });
    }

    try {
      const { id, challenger_id, opponent_id } = await Challenge.create(
        req.body
      );
      return res.json({ id, challenger_id, opponent_id });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ error: 'Challenge was not created' });
    }
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      id_challenger: Yup.number()
        .integer()
        .required(),
      id_opponent: Yup.number()
        .integer()
        .required(),
      type_id: Yup.number()
        .integer()
        .required(),
      status_id: Yup.number()
        .integer()
        .required(),
    });
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Params validation failed' });
    }
    const challenge = await Challenge.findByPk(req.params.id);
    if (!challenge) {
      return res.status(404).json({ message: 'Challenge does not exists' });
    }

    try {
      const {
        id,
        id_challenger,
        id_opponent,
        type_id,
        status_id,
      } = await challenge.update(req.body);
      return res.json({ id, id_challenger, id_opponent, type_id, status_id });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ error: 'Challenge was not update' });
    }
  }

  async delete(req, res) {
    const challenge = await Challenge.findByPk(req.params.id);
    if (challenge) {
      const deletedChallenge = await Challenge.destroy({
        where: { id: req.params.id },
      });
      return res
        .status(200)
        .json({ message: `User was deleted: ${deletedChallenge}` });
    }
    return res.status(404).json({ message: 'Challenge does not exists' });
  }
}
export default new ChallengeController();
