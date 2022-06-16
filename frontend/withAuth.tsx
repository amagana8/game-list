import { isServer } from '@utils/isServer';
import { useAuthStore } from './authStore';
import App from 'next/app';
import { sendRefreshToken } from '@backend/auth/sendRefreshToken';

export function withAuth(PageComponent: any) {
  const WithAuth = ({ serverUser, ...pageProps }: any) => {
    const setUser = useAuthStore((state) => state.setUser);
    if (serverUser.accessToken) {
      setUser(serverUser);
    }
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

  return WithAuth;
}
