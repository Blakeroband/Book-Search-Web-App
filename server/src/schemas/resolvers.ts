import { Book, User } from '../models/index.js'; // import the Book and User models
import { AuthenticationError } from 'apollo-server-express' // import AuthenticationError from apollo-server-express
import { signToken } from '../services/auth.js'; // import signToken from auth.js
const resolvers = {
  Query: {
    me: async (_parent: null, _args: any, context: any) => {
      if (context.user) {
        const userData = await User.findOne({ _id: context.user._id })
          .select('-__v -password')
          .populate('savedBooks');

        return userData;
      }
      throw new AuthenticationError('Not logged in');
    },
    books: async () => {
      try {
        return await Book.find({});
      } catch (error) {
        console.error("Error fetching books:", error);
        throw new Error("Failed to fetch books");
      }
    },
    users: async () => {
      try {
        return await User.find({});
      } catch (error) {
        console.error("Error fetching users:", error);
        throw new Error("Failed to fetch users");
      }
    }
  },
  Mutation: {
    createUser: async (_parent: null, args: any, _context: any) => {
      try {
        const user = await User.create(args);
        const token = signToken(user.username, user.email, user._id);
        return { token, user };
      } catch (error) {
        console.error("Error creating user:", error);
        throw new Error("Failed to create user");
      }
    },
    login: async (_parent: any, { email, password }: { email: string, password: string }, _context: any) => {
      // Find a user with the provided email
      const user = await User.findOne({ email });
    
      // If no user is found, throw an AuthenticationError
      if (!user) {
        throw new AuthenticationError('Could not authenticate user.');
      }
    
      const validPassword = await user.isCorrectPassword(password);
      if (!validPassword) {
        throw new AuthenticationError('Invalid password');
      }
    
      // Generate JWT token
      const token = signToken(user.username, user.email, user._id);
    
      return { token, user }; // Return both token and user
    },
    saveBook: async (_parent: null, args: any) => {
      try {
        return await User.findOneAndUpdate(
          { _id: args.userId },
          { $addToSet: { savedBooks: args.bookId } },
          { new: true, runValidators: true }
        )
      } catch (error) {
        console.error("Error saving book:", error);
        throw new Error("Failed to save book");
      }
    },
    deleteBook: async (_parent: null, { bookId }: any, context: any) => {
      if (context.user) {
        try {
          const updatedUser = await User.findOneAndUpdate(
            { _id: context.user._id },
            { $pull: { savedBooks: { bookId } } },
            { new: true }
          ).populate('savedBooks');
          
          return updatedUser;
        } catch (error) {
          console.error("Error deleting book:", error);
          throw new Error("Failed to delete book");
        }
      }
      throw new AuthenticationError('You need to be logged in!');
    }
  }
};

export default resolvers;