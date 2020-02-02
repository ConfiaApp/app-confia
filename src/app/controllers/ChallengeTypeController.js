import * as Yup from 'yup';

import ChallengeType from '../models/ChallengeType';
import Status from '../models/Status';

class ChallengeTypeController {
  async index(req, res) {
    const { page = 1 } = req.query;

    const challengeTypes = await ChallengeType.findAll({
      attributes: ['id', 'name'],
      order: [['created_at', 'DESC']],
      limit: 5,
      offset: (page - 1) * 5,
      include: [
        {
          model: Status,
          as: 'status',
          attributes: ['id', 'name'],
        },
      ],
    });
    return res.json(challengeTypes);
  }

  async show(req, res) {
    const challengeType = await ChallengeType.findByPk(req.params.id, {
      attributes: ['id', 'name'],
      include: [
        {
          model: Status,
          as: 'status',
          attributes: ['id', 'name'],
        },
      ],
    });
    if (!challengeType) {
      return res.status(404).json({ error: 'Challenge type does not exists' });
    }
    return res.json(challengeType);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      status_id: Yup.number().integer(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Params validation failed' });
    }
    try {
      const { id, name } = await ChallengeType.create(req.body);
      return res.json({ id, name });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ error: 'Challenge type was not created' });
    }
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      status_id: Yup.number().integer(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Params validation failed' });
    }

    const challengeType = await ChallengeType.findByPk(req.params.id);
    if (!challengeType) {
      return res
        .status(404)
        .json({ message: 'Challenge type does not exists' });
    }

    const challengeTypeExists = await Status.findOne({
      where: { name: req.body.name },
    });
    if (challengeTypeExists) {
      return res.status(400).json({ error: 'Challenge type alredy exists' });
    }

    try {
      const { id, name } = await challengeType.update(req.body);
      return res.json({ id, name });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ error: 'Challenge Type was not update' });
    }
  }

  async delete(req, res) {
    const challengeType = await ChallengeType.findByPk(req.params.id);

    if (challengeType) {
      try {
        const deletedChallenge = await ChallengeType.destroy({
          where: { id: req.params.id },
        });
        return res
          .status(200)
          .json({ message: `User was deleted: ${deletedChallenge}` });
      } catch (error) {
        console.log(error);
        return res
          .status(400)
          .json({ error: 'Challenge type was not deleted' });
      }
    }
    return res.status(404).json({ message: 'Challenge type does not exists' });
  }
}
export default new ChallengeTypeController();
