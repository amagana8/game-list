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
import { useAuthStore } from '@frontend/authStore';
import App from 'next/app';
import { sendRefreshToken } from '@backend/auth/sendRefreshToken';
import { isServer } from '@utils/isServer';
import { HOST_URL } from '@utils/hostUrl';

const { Header, Content } = Layout;

NProgress.configure({
  minimum: 0.3,
  easing: 'ease',
  speed: 500,
  showSpinner: false,
});

function MyApp({ Component, pageProps, serverUser }: any) {
  const setUser = useAuthStore((state) => state.setUser);
  setUser(serverUser);
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

MyApp.getInitialProps = async (appContext: any) => {
  const appProps = await App.getInitialProps(appContext);

  let serverUser = { username: '', accessToken: '' };
  if (isServer()) {
    const cookies = appContext.ctx.req.cookies;
    if (cookies.refreshToken) {
      const response = await fetch(`${HOST_URL}/api/refresh_token`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          cookie: `refreshToken=${cookies.refreshToken}`,
        },
      });
      const data = await response.json();
      const newTokenCookie = response.headers.get('set-cookie');
      if (newTokenCookie) {
        appContext.ctx.res.setHeader('Set-Cookie', newTokenCookie);
      } else {
        sendRefreshToken(appContext.ctx.res, '');
      }
      serverUser = data;
    }
  }
  return { ...appProps, serverUser };
};

export default MyApp;
