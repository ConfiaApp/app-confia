import * as Yup from 'yup';

import User from '../models/User';
import Player from '../models/Player';
import Team from '../models/Team';

class PlayerController {
  async index(req, res) {
    const { page = 1 } = req.query;

    const players = await Player.findAll({
      attributes: ['id', 'trusts', 'beers'],
      order: [['created_at', 'DESC']],
      limit: 5,
      offset: (page - 1) * 5,
      include: [
        { model: User, as: 'user', attributes: ['id', 'name', 'email'] },
        { model: Team, as: 'team', attributes: ['id', 'name'] },
      ],
    });
    return res.json(players);
  }

  async show(req, res) {
    const player = await Player.findByPk(req.params.id, {
      attributes: ['id', 'trusts', 'beers'],
      include: [
        { model: User, as: 'user', attributes: ['id', 'name', 'email'] },
        { model: Team, as: 'team', attributes: ['id', 'name'] },
      ],
    });
    if (!player) {
      return res.status(404).json({ error: 'Player does not exists' });
    }
    return res.json(player);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      trusts: Yup.number().integer(),
      beers: Yup.number().integer(),
      user_id: Yup.number()
        .integer()
        .required(),
      team_id: Yup.number()
        .integer()
        .required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Params validation failed' });
    }

    const userExists = await User.findByPk(req.body.user_id);
    if (!userExists) {
      return res.status(404).json({ error: 'User does not exists' });
    }

    const teamExists = await Team.findByPk(req.body.team_id);
    if (!teamExists) {
      return res.status(404).json({ error: 'Team does not exists' });
    }

    const playerExists = await Player.findOne({
      where: { user_id: req.body.user_id },
    });
    if (playerExists) {
      return res.status(400).json({ error: 'Player alredy exists' });
    }

    try {
      const { id, trusts, beers, user_id, team_id } = await Player.create(
        req.body
      );
      return res.json({
        id,
        trusts,
        beers,
        user_id,
        team_id,
      });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ error: 'PLayer was not created' });
    }
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      trusts: Yup.number().integer(),
      beers: Yup.number().integer(),
      user_id: Yup.number().integer(),
      team_id: Yup.number().integer(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Params validation failed' });
    }

    if (req.body.user_id) {
      const userExists = await User.findByPk(req.body.user_id);
      if (!userExists) {
        return res.status(404).json({ error: 'User does not exists' });
      }
    }

    if (req.body.team_id) {
      const teamExists = await Team.findByPk(req.body.team_id);
      if (!teamExists) {
        return res.status(404).json({ error: 'Team does not exists' });
      }
    }

    const player = await Player.findByPk(req.params.id);
    if (!player) {
      return res.status(400).json({ error: 'Player does not exists' });
    }

    try {
      const { id, trusts, beers, user_id, team_id } = await player.update(
        req.body
      );
      return res.json({ id, trusts, beers, user_id, team_id });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ error: 'Player was not updated' });
    }
  }

  async delete(req, res) {
    const player = await Player.findByPk(req.params.id);
    if (player) {
      const deletedPlayer = await Player.destroy({
        where: { id: req.params.id },
      });
      return res
        .status(200)
        .json({ message: `Player was deleted: ${deletedPlayer}` });
    }
    return res.status(404).json({ message: 'Player does not exists' });
  }
}
export default new PlayerController();
