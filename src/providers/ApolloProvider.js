'use client';

import { ApolloProvider } from '@apollo/client/react';
import createApolloClient from '../lib/apolloClient';

const client = createApolloClient();

export function AppApolloProvider({ children }) {
  return (
    <ApolloProvider client={client}>
      {children}
    </ApolloProvider>
  );
}
