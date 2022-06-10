import '@frontend/styles/globals.scss';
import type { AppProps } from 'next/app';
import { Layout } from 'antd';
import { ApolloProvider } from '@apollo/client';
import { useApollo } from '@frontend/apollo-client';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { NavBar } from '@components/navBar/NavBar';

const { Header, Content } = Layout;

NProgress.configure({
  minimum: 0.3,
  easing: 'ease',
  speed: 500,
  showSpinner: false,
});

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

  useEffect(() => {
    const handleStart = () => {
      NProgress.start();
    };
    const handleStop = () => {
      NProgress.done();
    };

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleStop);
    router.events.on('routeChangeError', handleStop);

    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleStop);
      router.events.off('routeChangeError', handleStop);
    };
  }, [router]);

  const client = useApollo(pageProps.initialApolloState);

  return (
    <ApolloProvider client={client}>
      <Layout>
        <Header>
          <NavBar />
        </Header>
        <Content>
          <Component {...pageProps} />
        </Content>
      </Layout>
    </ApolloProvider>
  );
}

export default MyApp;
