import * as Yup from 'yup';
import Status from '../models/Status';

class StatusController {
  async index(req, res) {
    const { page = 1 } = req.query;

    const status = await Status.findAll({
      attributes: ['id', 'name'],
      order: [['created_at', 'DESC']],
      limit: 5,
      offset: (page - 1) * 5,
    });
    return res.json(status);
  }

  async show(req, res) {
    const status = await Status.findByPk(req.params.id, {
      attributes: ['id', 'name'],
    });
    if (!status) {
      return res.status(404).json({ error: 'Status does not exists' });
    }
    return res.json(status);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
    });
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: `Invalid request.` });
    }
    const status = await Status.findOne({
      where: { name: req.body.name },
    });
    if (status) {
      return res.status(404).json({ error: `The status already exists.` });
    }
    const result = await Status.create(req.body);
    return res.json({ result });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
    });
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Params validation failed' });
    }

    const status = await Status.findByPk(req.params.id);
    if (!status) {
      return res.status(404).json({ message: 'Status does not exists' });
    }

    const statusExists = await Status.findOne({
      where: { name: req.body.name },
    });
    if (statusExists) {
      return res.status(400).json({ error: 'Status alredy exists' });
    }

    try {
      const { id, name } = await status.update(req.body);
      return res.json({ id, name });
    } catch (error) {
      return res.status(400).json({ error: 'Status was not update' });
    }
  }

  async delete(req, res) {
    const status = await Status.findByPk(req.params.id);
    if (status) {
      const deletedStatus = await Status.destroy({
        where: { id: req.params.id },
      });
      return res
        .status(200)
        .json({ message: `Status was deleted: ${deletedStatus}` });
    }
    return res.status(404).json({ message: 'Status does not exists' });
  }
}

export default new StatusController();
