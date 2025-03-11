import mongoose, { Schema, Document } from 'mongoose';

export type MessageType = 'user' | 'ai';

export interface IMessage extends Document {
  chatId: mongoose.Types.ObjectId;
  type: MessageType;
  text: string;
}

const MessageSchema: Schema<IMessage> = new Schema({
  chatId: { type: Schema.Types.ObjectId, ref: 'Chat', required: true },
  type: { type: String, enum: ['user', 'ai'], required: true },
  text: { type: String, required: true }
}, { timestamps: true });

export default mongoose.models.Message || mongoose.model<IMessage>('Message', MessageSchema);
