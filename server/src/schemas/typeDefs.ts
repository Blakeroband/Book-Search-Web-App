const typeDefs = `
  type Book {
    bookId: ID!
    title: String
    authors: [String]
    description: String
    image: String
    link: String
    }

  type Query {
    books: [Book]
  }
`

export default typeDefs;