import { gql } from '@apollo/client';

export const GET_USER = gql`
  query user {
    user {
      username
      email
      _id
      savedBooks {
        bookId
        title
        authors
        description
        image
        link
      }
    }
  }
`;

export const GET_ME = gql`
  query me {
    me {
      username
      email
      _id
      savedBooks {
        bookId
        title
        authors
        description
        image
        link
      }
    }
  }
`;