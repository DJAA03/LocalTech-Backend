import { Schema, model, Document, Types } from 'mongoose';

interface IOrderItem {
    producto: Types.ObjectId;
    cantidad: number;
    precio: number;
}

export interface IOrder extends Document {
    orderNumber: string;
    cliente: Types.ObjectId;
    items: IOrderItem[];
    total: number;
    estado: 'pendiente' | 'pagado' | 'enviado' | 'entregado';
}

const OrderSchema = new Schema<IOrder>({
    orderNumber: { type: String, unique: true, required: true },
    cliente: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true },
    items: [{
        producto: { type: Schema.Types.ObjectId, ref: 'Producto', required: true },
        cantidad: { type: Number, required: true, min: 1 },
        precio: { type: Number, required: true }
    }],
    total: { type: Number, required: true },
    estado: { type: String, enum: ['pendiente', 'pagado', 'enviado', 'entregado'], default: 'pendiente' }
}, { timestamps: true });

export const Orden = model<IOrder>('Orden', OrderSchema);