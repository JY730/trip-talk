'use client';

import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { ApolloProvider } from '@apollo/client/react';
import { ReactNode } from 'react';

interface ApolloClientProviderProps {
  children: ReactNode;
}

// HTTP Link 생성
const httpLink = createHttpLink({
  uri: '/api/graphql',
});

// Apollo Client 인스턴스 생성
const client = new ApolloClient({
  link: httpLink,
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
