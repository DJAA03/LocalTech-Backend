import { Schema, model, Document, Types } from 'mongoose';

export interface IProducto extends Document {
  nombre: string;
  descripcion: string;
  precio: number;
  categoria: Types.ObjectId;
  imagen: string;
  stock: number;
  isFeatured: boolean;
  calificacionPromedio: number;
  numeroDeResenas: number;
}

const ProductoSchema = new Schema<IProducto>({
  nombre: { type: String, required: true, trim: true },
  descripcion: { type: String, required: true, default: 'Sin descripción.' },
  precio: { type: Number, required: true },
  categoria: { type: Schema.Types.ObjectId, ref: 'Categoria', required: true },
  imagen: { type: String, required: true },
  stock: { type: Number, required: true, default: 0 },
  isFeatured: { type: Boolean, default: false },
  calificacionPromedio: { type: Number, default: 0 },
  numeroDeResenas: { type: Number, default: 0 },
}, { timestamps: true });

export const Producto = model<IProducto>('Producto', ProductoSchema);