import mongoose, { Schema, Document } from 'mongoose';

export interface IChat extends Document {
  userId: mongoose.Types.ObjectId;
  date: Date;
}

const ChatSchema: Schema<IChat> = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, default: Date.now }
});

export default mongoose.models.Chat || mongoose.model<IChat>('Chat', ChatSchema);
