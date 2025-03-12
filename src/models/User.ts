import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password: string;
  telegramId: string;
  phonenumber: string;
  name: string;
  walletAddress: string;
  contacts: string[];
}

const UserSchema: Schema<IUser> = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  telegramId: { type: String },
  phonenumber: { type: String },
  name: { type: String },
  walletAddress: { type: String },
  contacts: [{ type: String }]
}, { timestamps: true });

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
