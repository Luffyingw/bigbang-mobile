import React from 'react'
import Tabs from './src/Tabs'
import Setup from "./componentLibrary/boot/setup";

import AWSAppSyncClient from "aws-appsync";
import { Rehydrated } from 'aws-appsync-react';
import { ApolloProvider } from 'react-apollo';

import appSyncConfig from './aws-exports';

const client = new AWSAppSyncClient({
  url: appSyncConfig.graphqlEndpoint,
  region: appSyncConfig.region,
  auth: {
    type: appSyncConfig.authType,
    apiKey: appSyncConfig.apiKey,
  }
});

const WithProvider = () => (
  <ApolloProvider client={client}>
    <Rehydrated>
      <Tabs />
    </Rehydrated>
  </ApolloProvider>
);

export default WithProvider

// export default class App extends React.Component {
//   render() {
//     return <Setup />;
//   }
// }