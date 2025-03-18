import express from 'express';
import db from './config/connection.js';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import Apollo Server
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';

// Import GraphQL schema
import typeDefs from './schemas/typeDefs.js';
import resolvers from './schemas/resolvers.js';

// Import auth helper
import { authenticateToken } from './services/auth.js';

// Create an Apollo server with the GraphQL schema
const startApolloServer = async () => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    formatError: (error) => {
      // Log errors for debugging
      console.error(error);
      return error;
    },
  });

  await server.start();
  
  // Connect to database
  await db();

  const PORT = process.env.PORT || 3001;
  const app = express();

  // Middleware for parsing request body
  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());

  // Apply Apollo middleware to Express with proper context setup
  app.use('/graphql', expressMiddleware(server, {
    context: async ({ req }) => {
      try {
        // Try to authenticate the user with the token
        return authenticateToken({ req });
      } catch (error) {
        // Return empty context if authentication fails
        console.error('Auth error:', error);
        return {};
      }
    },
  }));

  // Serve static assets in production
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../../client/dist')));
    
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, '../../client/dist/index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
    console.log(`Use GraphQL at http://localhost:${PORT}/graphql`);
  });
};

// Call the async function to start the server
startApolloServer();