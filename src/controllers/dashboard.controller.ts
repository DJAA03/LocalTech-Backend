import { Request, Response } from 'express';
import { Producto } from '../models/producto.model';
import { Categoria } from '../models/categoria.model';
import { Orden } from '../models/orden.model';
import { Usuario } from '../models/usuario.model';

const LOW_STOCK_THRESHOLD = 10; 

export const getDashboardStats = async (req: Request, res: Response) => {
    try {
        const [
            totalProducts,
            totalCategories,
            totalOrders,
            totalUsers,
            lowStockProducts,
            recentOrders
        ] = await Promise.all([
            Producto.countDocuments(),
            Categoria.countDocuments(),
            Orden.countDocuments(),
            Usuario.countDocuments({ rol: 'cliente' }),
            Producto.find({ stock: { $lte: LOW_STOCK_THRESHOLD } }).sort({ stock: 'asc' }),
            Orden.find()
                .sort({ createdAt: -1 })
                .limit(5)
                .populate('cliente', 'nombre')
        ]);

        res.json({
            totalProducts,
            totalCategories,
            totalOrders,
            totalUsers,
            lowStockProducts,
            recentOrders
        });

    } catch (error) {
        res.status(500).json({ message: 'Error al obtener las estadísticas del dashboard.' });
    }
};