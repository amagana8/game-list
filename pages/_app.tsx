import '@frontend/styles/globals.scss';
import type { AppProps } from 'next/app';
import { Layout } from 'antd';
import { ApolloProvider } from '@apollo/client';
import { Provider } from 'react-redux';
import { store, persistor } from '@frontend/store';
import { client } from '@frontend/apollo-client';
import { PersistGate } from 'redux-persist/integration/react';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <ApolloProvider client={client}>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </PersistGate>
        </Provider>
      </ApolloProvider>
    </>
  );
}

export default MyApp;
