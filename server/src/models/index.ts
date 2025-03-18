import User from './User.js';
import mongoose from 'mongoose';
import bookSchema from './Book.js';

// Create a standalone Book model if needed for queries
const Book = mongoose.model('Book', bookSchema);

export { User, Book };