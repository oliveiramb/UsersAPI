import jwt from 'jsonwebtoken';
import * as Yup from 'yup';

import authConfig from '../config/auth';
import User from '../schemas/UserSchema';

class SessionController {
  async store(req, res) {
    const schema = Yup.object().shape({
      email: Yup.string().email().required(),
      password: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ mensagem: 'erro ao validar os campos' });
    }

    console.log(req.body);
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ mensagem: 'Usuario nao encontrado' });
    }

    if (!(await user.comparePassword(password))) {
      return res.status(401).json({ mensagem: 'senha nao confere' });
    }

    const { _id } = user;
    return res.status(201).json({
      token: jwt.sign({ _id, email }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      }),
    });
  }
}

export default new SessionController();
