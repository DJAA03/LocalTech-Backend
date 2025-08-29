import { Schema, model, Document, Types } from 'mongoose';

export interface IProductVector extends Document {
    producto: Types.ObjectId;
    vector: number[];
    contenido: string; 
}

const ProductVectorSchema = new Schema<IProductVector>({
    producto: { type: Schema.Types.ObjectId, ref: 'Producto', required: true, unique: true },
    vector: { type: [Number], required: true },
    contenido: { type: String, required: true },
}, { timestamps: true });

export const ProductVector = model<IProductVector>('ProductVector', ProductVectorSchema);