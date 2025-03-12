import mongoose, { Schema, Document } from 'mongoose';

export type TransactionType = 'onramp' | 'offramp' | 'transfer';

export interface ITransaction extends Document {
  type: TransactionType;
  from: string;
  to: string;
  amount: number;
  date: Date;
}

const TransactionSchema: Schema<ITransaction> = new Schema({
  type: { type: String, enum: ['onramp', 'offramp', 'transfer'], required: true },
  from: { type: String, required: true },
  to: { type: String, required: true },
  amount: { type: Number, required: true },
  date: { type: Date, default: Date.now }
});

export default mongoose.models.Transaction || mongoose.model<ITransaction>('Transaction', TransactionSchema);
