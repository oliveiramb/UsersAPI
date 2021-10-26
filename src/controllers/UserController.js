import * as Yup from 'yup';

import User from '../schemas/UserSchema';

class UserController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().email().required(),
      password: Yup.string().required().min(6),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ mensagem: 'Erro na validacao dos campos' });
    }

    const userExists = await User.findOne({ email: req.body.email });

    if (userExists) {
      return res.status(400).json({ mensagem: 'Usuario ja existe.' });
    }

    const { id, name, email } = await User.create(req.body);

    return res.status(201).json({ id, name, email });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      password: Yup.string().required().min(6),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ mensagem: 'Erro na validacao dos campos' });
    }

    console.log(req.userId);

    let userExists;
    try {
      const { password, name } = req.body;
      userExists = await User.findByIdAndUpdate(
        { _id: req.userId },
        { password, name },
        {
          new: true,
        }
      );
    } catch (e) {
      console.log(e);
    }

    console.log(userExists);

    console.log(userExists.password);

    return res.json({ mensagem: `Usuario alterado` });
  }
}

export default new UserController();
