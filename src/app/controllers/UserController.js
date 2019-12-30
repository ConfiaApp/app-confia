import User from '../models/User';

class UserController {
  async index(req, res) {
    return res.json();
  }

  async show(req, res) {
    return res.json();
  }

  async store(req, res) {
    const UserExists = await User.findOne({ where: { email: req.body.email } });
    if (UserExists) {
      return res.status(400).json({ error: 'User already exists' });
    }
    const { id, name, email } = await User.create(req.body);
    return res.json({ id, name, email });
  }

  async update(req, res) {
    return res.json();
  }

  async delete(req, res) {
    return res.json();
  }
}
export default new UserController();
