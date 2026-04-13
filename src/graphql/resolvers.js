import connectToDatabase from '../lib/mongoose';
import User from '../models/User';
import Chat from '../models/Chat';

const resolvers = {
  Query: {
    getCurrentUser: async (_, { email }) => {
      await connectToDatabase();
      const user = await User.findOne({ email });
      if (!user) return null;
      return {
        id: user._id.toString(),
        name: user.name,
        email: user.email
      };
    },
    getChatHistory: async (_, { userId }) => {
      await connectToDatabase();
      const chats = await Chat.find({ userId }).sort({ updatedAt: -1 }).limit(50);
      return chats.map(chat => ({
        id: chat.chatId,
        title: chat.title,
        lastMessage: chat.lastMessage,
        timestamp: chat.updatedAt.toISOString(),
      }));
    },
    getChat: async (_, { chatId, userId }) => {
      await connectToDatabase();
      const chat = await Chat.findOne({ chatId, userId });
      return chat;
    }
  },
  Mutation: {
    signup: async (_, { name, email, password }) => {
      await connectToDatabase();
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw new Error('User with this email already exists');
      }
      // Simple raw password for migration parity (in production use bcrypt)
      const newUser = new User({ name, email, password });
      await newUser.save();
      return {
        id: newUser._id.toString(),
        name: newUser.name,
        email: newUser.email
      };
    },
    login: async (_, { email, password }) => {
      await connectToDatabase();
      const user = await User.findOne({ email });
      if (!user) {
        throw new Error('Invalid email or password');
      }
      if (user.password !== password) {
        throw new Error('Invalid email or password');
      }
      return {
        id: user._id.toString(),
        name: user.name,
        email: user.email
      };
    },
    saveChat: async (_, { chatId, userId, title, lastMessage, messages }) => {
      await connectToDatabase();
      await Chat.findOneAndUpdate(
        { chatId, userId },
        { 
          $set: { title, lastMessage, messages }
        },
        { upsert: true, new: true }
      );
      return true;
    },
    deleteChat: async (_, { chatId, userId }) => {
      await connectToDatabase();
      await Chat.findOneAndDelete({ chatId, userId });
      return true;
    }
  }
};

export default resolvers;
