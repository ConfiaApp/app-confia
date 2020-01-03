import * as Yup from 'yup';
import User from '../models/User';
import File from '../models/File';

class UserController {
  async index(req, res) {
    const users = await User.findAll({
      attributes: ['id', 'name', 'email'],
      include: [
        { model: File, as: 'avatar', attributes: ['name', 'path', 'url'] },
      ],
    });
    return res.json(users);
  }

  async show(req, res) {
    try {
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
    } catch (error) {
      return res.status(400).json({ error: 'It´s not possible to show user' });
    }
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
    const { id, name, email } = await User.create(req.body);
    return res.json({ id, name, email });
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
      return res.status(400).json({ error: 'User was not updated' });
    }
  }

  async delete(req, res) {
    try {
      await User.destroy({ where: { id: req.userId } });
      return res.status(200).json({ message: 'User was deleted' });
    } catch (error) {
      return res.status(400).json({ error: 'User was not deleted' });
    }
  }
}
export default new UserController();
