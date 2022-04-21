import '../styles/globals.scss';
import type { AppProps } from 'next/app';
import { Layout } from 'antd';
import { ApolloProvider } from '@apollo/client';
import { Provider } from 'react-redux';
import { store } from '../store';
import { client } from '../apollo-client';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <ApolloProvider client={client}>
        <Provider store={store}>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </Provider>
      </ApolloProvider>
    </>
  );
}

export default MyApp;
