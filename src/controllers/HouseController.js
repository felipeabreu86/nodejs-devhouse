import path from 'path';
import fs from 'fs';
import * as Yup from 'yup';
import User from '../models/User';
import House from '../models/House';

function isEmpty(str) {
  return !str || str.length === 0;
}

class HouseController {
  async index(req, res) {
    const { status } = req.query;

    const houses = await House.find({
      status,
    });

    return res.json(houses);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      description: Yup.string().required(),
      price: Yup.number().required(),
      location: Yup.string().required(),
      status: Yup.string().required(),
    });

    const { filename } = req.file;

    const { description, price, location, status } = req.body;

    const { user_id } = req.headers;

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({
        error: 'Falha na validação',
      });
    }

    const house = await House.create({
      user: user_id,
      thumbnail: filename,
      description,
      price,
      location,
      status,
    });

    return res.json(house);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      description: Yup.string().required(),
      price: Yup.number().required(),
      location: Yup.string().required(),
      status: Yup.string().required(),
    });

    const { filename } = req.file;

    const { house_id } = req.params;

    const { description, price, location, status } = req.body;

    const { user_id } = req.headers;

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({
        error: 'Falha na validação',
      });
    }

    const user = await User.findById(user_id);
    const house = await House.findById(house_id);

    if (String(user._id) !== String(house.user._id)) {
      return res.status(401).status({
        error: 'Não autorizado!',
      });
    }

    // Apagar arquivo armazenado anteriormente
    if (!isEmpty(house.thumbnail) && !isEmpty(filename)) {
      if (String(filename) !== String(house.thumbnail)) {
        const pathFile = path.resolve(__dirname, '..', '..', 'uploads');
        const file = path.join(pathFile, String(house.thumbnail));
        if (fs.existsSync(file)) {
          fs.unlinkSync(file);
        }
      }
    }

    await House.updateOne(
      {
        _id: house_id,
      },
      {
        user: user_id,
        thumbnail: filename,
        description,
        price,
        location,
        status,
      }
    );

    return res.send();
  }

  async destroy(req, res) {
    const { house_id } = req.body;

    const { user_id } = req.headers;

    const user = await User.findById(user_id);
    const house = await House.findById(house_id);

    if (String(user._id) !== String(house.user._id)) {
      return res.status(401).status({
        error: 'Não autorizado!',
      });
    }

    await House.findByIdAndDelete({
      _id: house_id,
    });

    return res.json({
      message: 'Casa excluída com sucesso!',
    });
  }
}

export default new HouseController();
