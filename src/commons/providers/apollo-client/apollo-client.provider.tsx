'use client';

import { ApolloClient, InMemoryCache } from '@apollo/client';
import { ApolloProvider } from '@apollo/client/react';
import { ReactNode } from 'react';
import UploadHttpLink from 'apollo-upload-client/UploadHttpLink.mjs';

interface ApolloClientProviderProps {
  children: ReactNode;
}

const uploadLink = new UploadHttpLink({
  uri: '/api/graphql',
  credentials: 'same-origin',
});

const client = new ApolloClient({
  link: uploadLink,
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          // 필요에 따라 캐시 정책을 설정할 수 있습니다
        },
      },
    },
  }),
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'all',
    },
    query: {
      errorPolicy: 'all',
    },
  },
});

export const ApolloClientProviderWrapper = ({ children }: ApolloClientProviderProps) => {
  return (
    <ApolloProvider client={client}>
      {children}
    </ApolloProvider>
  );
};

export default ApolloClientProviderWrapper;
