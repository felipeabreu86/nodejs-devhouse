import * as Yup from 'yup';
import User from '../models/User';

/*
  métodos de uma controller: index, show, update, store, destroy

  index: listar e exibir vários itens
  store: criar um item
  show: listar um único item
  update: atualizar um item
  destroy: deletar um item
*/

class SessionController {
  async store(req, res) {
    const schema = Yup.object().shape({
      email: Yup.string().email().required(),
    });

    const { email } = req.body;

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({
        error: 'Falha na validação',
      });
    }

    // verificando se usuário já existe
    let user = await User.findOne({
      email,
    });

    if (!user) {
      // criar novo usuário
      user = await User.create({
        email,
      });
    }

    return res.json(user);
  }
}

export default new SessionController();
