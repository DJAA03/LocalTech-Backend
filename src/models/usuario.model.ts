import { Schema, model, Document, Types } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  nombre: string;
  email: string;
  password?: string;
  rol: 'cliente' | 'admin';
  wishlist: Types.ObjectId[];
  comparePassword(password: string): Promise<boolean>;
}

const UsuarioSchema = new Schema<IUser>({
  nombre: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, select: false },
  rol: { type: String, enum: ['cliente', 'admin'], default: 'cliente' },
  wishlist: [{ type: Schema.Types.ObjectId, ref: 'Producto' }],
}, { timestamps: true });

UsuarioSchema.pre<IUser>('save', async function(next) {
  if (!this.isModified('password') || !this.password) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

UsuarioSchema.methods.comparePassword = async function(password: string): Promise<boolean> {
  if (!this.password) return false;
  return await bcrypt.compare(password, this.password);
};

export const Usuario = model<IUser>('Usuario', UsuarioSchema);