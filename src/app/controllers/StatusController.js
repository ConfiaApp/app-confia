import * as Yup from 'yup';
import Status from '../models/Status';

class StatusController {
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
}

export default new StatusController();
