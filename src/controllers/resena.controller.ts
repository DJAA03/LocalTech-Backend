import { Request, Response } from 'express';
import { Resena } from '../models/resena.model';
import { Producto } from '../models/producto.model';
import { Orden } from '../models/orden.model';

export const getResenasPorProducto = async (req: Request, res: Response) => {
    try {
        const resenas = await Resena.find({ producto: req.params.productId }).sort({ createdAt: -1 });
        res.json(resenas);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener las reseñas.' });
    }
};

export const createResena = async (req: Request, res: Response) => {
    try {
        const { calificacion, comentario } = req.body;
        const { productId } = req.params;
        const usuarioId = req.userId;
        const nombreUsuario = req.user?.nombre || 'Anónimo';

        const resenaExistente = await Resena.findOne({ producto: productId, usuario: usuarioId });
        if (resenaExistente) {
            return res.status(400).json({ message: 'Ya has dejado una reseña para este producto.' });
        }

        const ordenDeCompra = await Orden.findOne({
            cliente: usuarioId,
            'items.producto': productId,
            estado: 'pagado'
        });
        if (!ordenDeCompra) {
            return res.status(403).json({ message: 'Debes haber comprado este producto para poder dejar una reseña.' });
        }
        
        const nuevaResena = new Resena({
            producto: productId,
            usuario: usuarioId,
            nombreUsuario,
            calificacion,
            comentario
        });
        await nuevaResena.save();

        const resenasDelProducto = await Resena.find({ producto: productId });
        const numeroDeResenas = resenasDelProducto.length;
        const calificacionPromedio = resenasDelProducto.reduce((acc, item) => item.calificacion + acc, 0) / numeroDeResenas;

        await Producto.findByIdAndUpdate(productId, {
            numeroDeResenas,
            calificacionPromedio: calificacionPromedio.toFixed(1)
        });

        res.status(201).json(nuevaResena);

    } catch (error) {
        res.status(500).json({ message: 'Error al crear la reseña.' });
    }
};