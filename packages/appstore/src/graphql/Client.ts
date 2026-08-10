import { ApolloClient, gql, InMemoryCache } from '@apollo/client';
import initialClientState from '@src/graphql/initialClientState';
import { typeDefs } from '@src/graphql/typeDefs';

import resolvers from './resolvers/index';

const cache = new InMemoryCache();

const INITIAL_CLIENT_STATE = gql`
  query InitialClientState {
    isBurgerOpen @client { value }
    search @client { searchString searchStringAfterEnterPress isEnterPressed }
    activeScreenName @client { value }
    appRequestMode @client { appRequestIsOpen currentMode }
    selectedCustomApp @client {
      app {
        id
        bxAppManifestURL
        category { name }
        iconURL
        startURL
        name
        themeColor
      }
    }
    appModalStatus @client { isAppModalOpen }
  }
`;

const client = new ApolloClient({
  cache,
  typeDefs,
  resolvers,
});

cache.writeQuery({
  query: INITIAL_CLIENT_STATE,
  data: initialClientState,
});

export default client;
