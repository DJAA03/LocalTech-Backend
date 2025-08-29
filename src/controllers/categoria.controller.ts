import { Request, Response } from 'express';
import { Categoria } from '../models/categoria.model';

export const getCategorias = async (req: Request, res: Response) => {
  try {
    const categorias = await Categoria.find().sort({ nombre: 1 });
    res.json(categorias);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener las categorías.' });
  }
};

export const createCategoria = async (req: Request, res: Response) => {
  try {
    const { nombre } = req.body;
    if (!nombre) return res.status(400).json({ message: 'El nombre es requerido.' });
    
    const categoriaExists = await Categoria.findOne({ nombre });
    if (categoriaExists) return res.status(400).json({ message: 'La categoría ya existe.' });

    const nuevaCategoria = new Categoria({ nombre });
    await nuevaCategoria.save();
    res.status(201).json(nuevaCategoria);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear la categoría.' });
  }
};

export const updateCategoria = async (req: Request, res: Response) => {
    try {
        const { nombre } = req.body;
        const updatedCategoria = await Categoria.findByIdAndUpdate(req.params.id, { nombre }, { new: true });
        if (!updatedCategoria) return res.status(404).json({ message: 'Categoría no encontrada.' });
        res.json(updatedCategoria);
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar la categoría.' });
    }
};

export const deleteCategoria = async (req: Request, res: Response) => {
    try {
        const deletedCategoria = await Categoria.findByIdAndDelete(req.params.id);
        if (!deletedCategoria) return res.status(404).json({ message: 'Categoría no encontrada.' });
        res.json({ message: 'Categoría eliminada exitosamente.' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar la categoría.' });
    }
};