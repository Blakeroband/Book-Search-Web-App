import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

// Define the interface for User document
interface IUser extends mongoose.Document {
  username: string;
  email: string;
  password: string;
  savedBooks: Array<{
    bookId: string;
    authors: string[];
    description: string;
    title: string;
    image?: string | null;
    link?: string | null;
  }>;
  // Add the method signature here
  isCorrectPassword(password: string): Promise<boolean>;
}

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/.+@.+\..+/, 'Must use a valid email address'],
  },
  password: {
    type: String,
    required: true,
  },
  savedBooks: [
    {
      bookId: {
        type: String,
        required: true,
      },
      authors: [String],
      description: {
        type: String,
        required: true,
      },
      title: {
        type: String,
        required: true,
      },
      image: {
        type: String,
      },
      link: {
        type: String,
      },
    },
  ],
});

// Set up pre-save middleware to create password
userSchema.pre('save', async function (next) {
  if (this.isNew || this.isModified('password')) {
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
  }
  next();
});

// Compare the incoming password with the hashed password
userSchema.methods.isCorrectPassword = async function (password: string): Promise<boolean> {
  return bcrypt.compare(password, this.password);
};

// Create and export the User model with the IUser interface
const User = mongoose.model<IUser>('User', userSchema);

export default User;