import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import '../styles/globals.css';
import { SessionProvider, useSession } from 'next-auth/react';
import React, { useEffect } from 'react';
import { NextRouter } from 'next/router';
// import { Analytics } from '@vercel/analytics/react';

interface WrappedAppProps extends Omit<AppProps, 'router'> {
  router: NextRouter;
}


export default function App({ Component, pageProps, router }: AppProps) {
  return (
    <SessionProvider session={pageProps.session}>
      <WrappedApp Component={Component} pageProps={pageProps} router={router} />
    </SessionProvider>
  );
}

function WrappedApp({ Component, pageProps, router }: WrappedAppProps) {
  
  return (
    <div>
      <Component {...pageProps} />
    </div>
  );
}
