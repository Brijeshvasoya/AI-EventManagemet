import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema({
  id: { type: String, required: true },
  role: { type: String, required: true },
  text: { type: String, required: true }
}, { _id: false });

const ChatSchema = new mongoose.Schema({
  chatId: { type: String, required: true, unique: true },
  userId: { type: String, required: true },
  title: { type: String },
  lastMessage: { type: String },
  messages: [MessageSchema],
}, { timestamps: true });

export default mongoose.models.Chat || mongoose.model('Chat', ChatSchema);
