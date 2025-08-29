import { Request, Response } from 'express';
import { Orden } from '../models/orden.model';
import { Producto } from '../models/producto.model';
import { Counter } from '../models/counter.model';

async function getNextSequenceValue(sequenceName: string): Promise<number> {
    const sequenceDocument = await Counter.findByIdAndUpdate(
        sequenceName,
        { $inc: { sequence_value: 1 } },
        { new: true, upsert: true }
    );
    return sequenceDocument.sequence_value;
}

export const createOrder = async (req: Request, res: Response) => {
    const { items, total } = req.body;
    const clienteId = req.userId;

    if (!items || items.length === 0) {
        return res.status(400).json({ message: 'El carrito está vacío.' });
    }

    try {
        for (const item of items) {
            const productoDB = await Producto.findById(item.producto).select('stock nombre');
            if (!productoDB) throw new Error(`El producto con ID ${item.producto} ya no existe.`);
            if (productoDB.stock < item.cantidad) throw new Error(`No hay suficientes unidades para "${productoDB.nombre}". Solo quedan ${productoDB.stock}.`);
        }

        const nextOrderNumber = await getNextSequenceValue('orderId');
        const formattedOrderNumber = `LT-${nextOrderNumber}`; 

        const newOrder = new Orden({
            orderNumber: formattedOrderNumber,
            cliente: clienteId,
            items,
            total,
            estado: 'pendiente'
        });

        await newOrder.save();
        res.status(201).json({ message: 'Orden creada, pendiente de pago.', order: newOrder });

    } catch (error: any) {
        res.status(400).json({ message: error.message || 'Error al validar la orden.' });
    }
};

export const processPayment = async (req: Request, res: Response) => {
    try {
        const order = await Orden.findById(req.params.id);
        if (!order) return res.status(404).json({ message: 'Orden no encontrada.' });
        if (order.estado === 'pagado') return res.status(400).json({ message: 'Esta orden ya ha sido pagada.' });

        for (const item of order.items) {
            await Producto.findByIdAndUpdate(item.producto, { $inc: { stock: -item.cantidad } });
        }
        
        order.estado = 'pagado';
        await order.save();
        res.json({ message: 'Pago procesado y stock actualizado.' });
    } catch (error: any) {
        res.status(500).json({ message: error.message || 'Error al procesar el pago.' });
    }
};

export const getMyOrders = async (req: Request, res: Response) => {
    try {
        const orders = await Orden.find({ cliente: req.userId }).sort({ createdAt: -1 }).populate({ path: 'items.producto', select: 'nombre imagen' });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los pedidos.' });
    }
};

export const getOrderById = async (req: Request, res: Response) => {
    try {
        const order = await Orden.findById(req.params.id).populate('cliente', 'nombre email').populate('items.producto', 'nombre imagen');
        if (!order) return res.status(404).json({ message: 'Orden no encontrada.' });
        if (order.cliente._id.toString() !== req.userId && req.userRol !== 'admin') {
            return res.status(403).json({ message: 'Acceso no autorizado.' });
        }
        res.json(order);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener la orden.' });
    }
};

export const getAllOrders = async (req: Request, res: Response) => {
    try {
        const orders = await Orden.find().sort({ createdAt: -1 }).populate('cliente', 'nombre email');
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener todos los pedidos.' });
    }
};

export const updateOrderStatus = async (req: Request, res: Response) => {
    try {
        const { estado } = req.body;
        const order = await Orden.findByIdAndUpdate(req.params.id, { estado }, { new: true });
        if (!order) return res.status(404).json({ message: 'Pedido no encontrado.' });
        res.json({ message: 'Estado del pedido actualizado.', order });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el estado del pedido.' });
    }
};