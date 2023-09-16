import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import '../styles/globals.css';
import { SessionProvider, useSession } from 'next-auth/react';
import React, { useEffect } from 'react';
import { NextRouter } from 'next/router';
import { createServer } from 'http';
import { parse } from 'url';

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
  const { data: session } = useSession();
  useEffect(() => {
    const getUser = async () => {
      const response = await fetch('/api/getUser', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userEmail: session?.user?.email }),
      });
      const user = await response.json();
    };

    getUser();
  }, [session, router.pathname]);

  return (
    <div>
      <Component {...pageProps} />
    </div>
  );
}

// Custom server implementation
if (typeof window === 'undefined') {
  createServer((req, res) => {
    const parsedUrl = parse(req.url || '', true);

    if (parsedUrl.pathname === '/api/auth/callback/spotify') {
      res.setHeader('Connection', 'keep-alive');
      res.setHeader('Keep-Alive', 'timeout=60');
    }

    // Your other custom server logic here
  }).listen(3000);
}
