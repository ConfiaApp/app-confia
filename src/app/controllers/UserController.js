import * as Yup from 'yup';
import User from '../models/User';

class UserController {
  async index(req, res) {
    return res.json();
  }

  async show(req, res) {
    return res.json();
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
        return res.status(401).json({ error: 'Password does not match' });
      }
      const { id, name } = await user.update(req.body);
      return res.json({ id, name, email });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ error: 'User does not updated' });
    }
  }

  async delete(req, res) {
    return res.json();
  }
}
export default new UserController();
