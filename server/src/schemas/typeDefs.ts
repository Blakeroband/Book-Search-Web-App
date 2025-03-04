const typeDefs = `
  type Book {
    bookId: ID!
    title: String
    authors: [String]
    description: String
    image: String
    link: String
    }
  type user {
    _id: ID!
    username: String
    email: String
    password: String
    }

  type Query {
    books: [Book]
    users: [User]
  }
`

export default typeDefs;