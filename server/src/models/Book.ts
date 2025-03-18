import { Schema } from 'mongoose';

// Define what a book document looks like
export interface BookDocument {
  authors: string[];
  description: string;
  bookId: string;
  image?: string;
  link?: string;
  title: string;
}

// Create a schema for embedding books within other documents
const bookSchema = new Schema({
  authors: [String],
  description: {
    type: String,
    required: true,
  },
  bookId: {
    type: String,
    required: true,
  },
  image: String,
  link: String,
  title: {
    type: String,
    required: true,
  },
});

export default bookSchema;