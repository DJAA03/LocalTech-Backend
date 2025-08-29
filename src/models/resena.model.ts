import { Schema, model, Document, Types } from 'mongoose';

export interface IResena extends Document {
    producto: Types.ObjectId;
    usuario: Types.ObjectId;
    nombreUsuario: string;
    calificacion: number;
    comentario: string;
}

const ResenaSchema = new Schema<IResena>({
    producto: { type: Schema.Types.ObjectId, ref: 'Producto', required: true },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true },
    nombreUsuario: { type: String, required: true },
    calificacion: { type: Number, required: true, min: 1, max: 5 },
    comentario: { type: String, required: true, trim: true },
}, { timestamps: true });

export const Resena = model<IResena>('Resena', ResenaSchema);