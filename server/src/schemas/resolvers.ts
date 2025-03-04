import { Book, User } from '../models/index.js'; // import the Book and User models

const resolvers = {
  Query: {
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
  }
}

export default resolvers;