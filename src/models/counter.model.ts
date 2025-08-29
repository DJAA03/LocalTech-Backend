import { Schema, model, Document } from 'mongoose';

export interface ICounter extends Document {
    _id: string;
    sequence_value: number;
}

const CounterSchema = new Schema({
    _id: { type: String, required: true },
    sequence_value: { type: Number, default: 1000 } 
});

export const Counter = model<ICounter>('Counter', CounterSchema);