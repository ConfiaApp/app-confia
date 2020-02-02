import * as Yup from 'yup';
import User from '../models/User';
import File from '../models/File';

class UserController {
  async index(req, res) {
    const { page = 1 } = req.query;

    const users = await User.findAll({
      attributes: ['id', 'name', 'email'],
      order: [['created_at', 'DESC']],
      limit: 5,
      offset: (page - 1) * 5,
      include: [
        { model: File, as: 'avatar', attributes: ['name', 'path', 'url'] },
      ],
    });
    return res.json(users);
  }

  async show(req, res) {
    const user = await User.findByPk(req.params.id, {
      attributes: ['id', 'name', 'email'],
      include: [
        { model: File, as: 'avatar', attributes: ['name', 'path', 'url'] },
      ],
    });
    if (!user) {
      return res.status(404).json({ error: 'User does not exists' });
    }
    return res.json(user);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string()
        .min(6)
        .required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Params validation failed' });
    }

    const userExists = await User.findOne({ where: { email: req.body.email } });
    if (userExists) {
      return res.status(400).json({ error: 'User already exists' });
    }
    try {
      const { id, name, email, avatar_id } = await User.create(req.body);
      return res.json({ id, name, email, avatar_id });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ error: 'User was not created' });
    }
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      oldPassword: Yup.string().min(6),
      password: Yup.string()
        .min(6)
        .when('oldPassword', (oldPassword, field) =>
          oldPassword ? field.required() : field
        ),
      confirmPassword: Yup.string().when('password', (confirmPassword, field) =>
        confirmPassword ? field.required().oneOf([Yup.ref('password')]) : field
      ),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Params validation failed' });
    }

    const user = await User.findByPk(req.userId);
    const { email, oldPassword } = req.body;

    try {
      if (email !== user.email) {
        const emailExists = await User.findOne({
          where: { email },
        });
        if (emailExists) {
          return res.status(400).json({ error: 'Email already exists' });
        }
      }
      if (oldPassword && !(await user.checkPassword(oldPassword))) {
        return res.status(401).json({ error: 'Passwords does not match' });
      }
      const { id, name } = await user.update(req.body);
      return res.json({ id, name, email });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ error: 'User was not updated' });
    }
  }

  async delete(req, res) {
    const user = await User.findByPk(req.params.id);
    if (user) {
      const deletedUser = await User.destroy({ where: { id: req.params.id } });
      return res
        .status(200)
        .json({ message: `User was deleted: ${deletedUser}` });
    }
    return res.status(404).json({ message: 'User does not exists' });
  }
}
export default new UserController();
