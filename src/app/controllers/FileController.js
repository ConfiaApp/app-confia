import File from '../models/File';

class FileController {
  async index(req, res) {
    const { page = 1 } = req.query;

    const files = await File.findAll({
      attributes: ['id', 'name', 'path'],
      order: [['created_at', 'DESC']],
      limit: 5,
      offset: (page - 1) * 5,
    });
    return res.json(files);
  }

  async show(req, res) {
    const file = await File.findByPk(req.params.id, {
      attributes: ['id', 'name', 'path'],
    });
    if (!file) {
      return res.status(404).json({ error: 'File does not exists' });
    }
    return res.json(file);
  }

  async store(req, res) {
    const { originalname: name, filename: path } = req.file;
    const file = await File.create({ name, path });
    return res.json(file);
  }

  async update(req, res) {
    try {
      const { originalname: name, filename: path } = req.file;

      const file = await File.findByPk(req.params.id);
      if (!file) {
        return res.status(404).json({ message: 'File does not exists' });
      }
      const updatedFile = await file.update({ name, path });
      return res.json(updatedFile);
    } catch (error) {
      console.log(error);
      return res.status(400).json({ message: 'File does not update' });
    }
  }

  async delete(req, res) {
    const file = await File.findByPk(req.params.id);
    if (file) {
      const deletedFile = await File.destroy({
        where: { id: req.params.id },
      });
      return res
        .status(200)
        .json({ message: `File was deleted: ${deletedFile}` });
    }
    return res.status(404).json({ message: 'File does not exists' });
  }
}

export default new FileController();
