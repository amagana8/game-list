import { isServer } from '@utils/isServer';
import { setUser } from '@frontend/user';
import App from 'next/app';

export function withAuth(PageComponent: any) {
  const WithAuth = ({ serverUser, ...pageProps }: any) => {
    setUser(serverUser);
    return <PageComponent {...pageProps} />;
  };

  WithAuth.getInitialProps = async (appContext: any) => {
    const appProps = await App.getInitialProps(appContext);

    let serverUser = { username: '', accessToken: '' };
    if (isServer()) {
      const cookies = appContext.ctx.req.cookies;
      if (cookies.refreshToken) {
        const response = await fetch(
          'http://localhost:3000/api/refresh_token',
          {
            method: 'POST',
            credentials: 'include',
            headers: {
              cookie: `refreshToken=${cookies.refreshToken}`,
            },
          },
        );
        const data = await response.json();
        serverUser = data;
      }
    }

    return { ...appProps, serverUser };
  };

  return WithAuth;
}
