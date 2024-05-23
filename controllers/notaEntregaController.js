// controllers/notaEntregaController.js
const notaEntregaModel = require('../models/notaEntregaModel');

const getNotasEntrega = async (req, res) => {
  try {
    const notasEntrega = await notaEntregaModel.getNotasEntrega();
    res.json(notasEntrega);
  } catch (error) {
    console.error('Error al obtener las notas de entrega:', error);
    res.status(500).json({ error: 'Error al obtener las notas de entrega' });
  }
};

const getNotaEntregaById = async (req, res) => {
  const { nro } = req.params;
  try {
    const notaEntrega = await notaEntregaModel.getNotaEntregaById(nro);
    if (notaEntrega) {
      res.json(notaEntrega);
    } else {
      res.status(404).json({ error: 'Nota de entrega no encontrada' });
    }
  } catch (error) {
    console.error('Error al obtener la nota de entrega:', error);
    res.status(500).json({ error: 'Error al obtener la nota de entrega' });
  }
};

const createNotaEntrega = async (req, res) => {
  const notaEntrega = req.body;
  try {
    const result = await notaEntregaModel.createNotaEntrega(notaEntrega);
    res.status(201).json({ message: 'Nota de entrega creada', id: result.insertId });
  } catch (error) {
    console.error('Error al crear la nota de entrega:', error);
    res.status(500).json({ error: 'Error al crear la nota de entrega' });
  }
};

const updateNotaEntrega = async (req, res) => {
  const { nro } = req.params;
  const notaEntrega = req.body;
  try {
    await notaEntregaModel.updateNotaEntrega(nro, notaEntrega);
    res.json({ message: 'Nota de entrega actualizada' });
  } catch (error) {
    console.error('Error al actualizar la nota de entrega:', error);
    res.status(500).json({ error: 'Error al actualizar la nota de entrega' });
  }
};

const deleteNotaEntrega = async (req, res) => {
  const { nro } = req.params;
  try {
    await notaEntregaModel.deleteNotaEntrega(nro);
    res.json({ message: 'Nota de entrega eliminada' });
  } catch (error) {
    console.error('Error al eliminar la nota de entrega:', error);
    res.status(500).json({ error: 'Error al eliminar la nota de entrega' });
  }
};

module.exports = {
  getNotasEntrega,
  getNotaEntregaById,
  createNotaEntrega,
  updateNotaEntrega,
  deleteNotaEntrega,
};