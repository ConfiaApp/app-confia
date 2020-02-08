import * as Yup from 'yup';

import Team from '../models/Team';

class TeamController {
  async index(req, res) {
    const { page = 1 } = req.query;

    const team = await Team.findAll({
      attributes: ['id', 'name'],
      order: [['created_at', 'DESC']],
      limit: 5,
      offset: (page - 1) * 5,
    });
    return res.json(team);
  }

  async show(req, res) {
    const team = await Team.findByPk(req.params.id, {
      attributes: ['id', 'name'],
    });
    if (!team) {
      return res.status(404).json({ error: 'Team does not exists' });
    }
    return res.json(team);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
    });
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: `Invalid request.` });
    }
    const team = await Team.findOne({
      where: { name: req.body.name },
    });
    if (team) {
      return res.status(404).json({ error: `The team already exists.` });
    }
    const { id, name } = await Team.create(req.body);
    return res.json({ id, name });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
    });
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Params validation failed' });
    }

    const team = await Team.findByPk(req.params.id);
    if (!team) {
      return res.status(404).json({ message: 'Team does not exists' });
    }

    const teamExists = await Team.findOne({
      where: { name: req.body.name },
    });
    if (teamExists) {
      return res.status(400).json({ error: 'The Team alredy exists' });
    }

    try {
      const { id, name } = await team.update(req.body);
      return res.json({ id, name });
    } catch (error) {
      return res.status(400).json({ error: 'The team was not update' });
    }
  }

  async delete(req, res) {
    const team = await Team.findByPk(req.params.id);
    if (team) {
      const deletedTeam = await Team.destroy({
        where: { id: req.params.id },
      });
      return res
        .status(200)
        .json({ message: `The team was deleted: ${deletedTeam}` });
    }
    return res.status(404).json({ message: 'The team does not exists' });
  }
}

export default new TeamController();
