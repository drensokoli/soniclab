import { Html, Head, Main, NextScript } from 'next/document'
import { useEffect } from 'react';

export default function Document() {
  useEffect(() => {
    function signalGooglefcPresent() {
      if (!(window.frames as any)['googlefcPresent']) {
        if (document.body) {
          const iframe = document.createElement('iframe');
          iframe.setAttribute('style', 'width: 0; height: 0; border: none; z-index: -1000; left: -1000px; top: -1000px;');
          iframe.style.display = 'none';
          iframe.name = 'googlefcPresent';
          document.body.appendChild(iframe);
        } else {
          setTimeout(signalGooglefcPresent, 0);
        }
      }
    }
    signalGooglefcPresent();
  }, []);

  return (
    <Html lang="en">
      <title>SonicLab</title>
      <meta name="SonicLab" content="" />
      <meta name="google-adsense-account" content="ca-pub-3464540666338005" />

      <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r121/three.min.js" defer></script>
      <script src="https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.net.min.js" defer></script>

      <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3464540666338005" crossOrigin="anonymous"></script>
      <link rel="manifest" href="/manifest.webmanifest" />

      <Head>
        <title>SonicLab</title>
        <meta name="description" content="Save popular and trending movies to your Notion list or search for your favourites. All your movies in one place, displayed in a beautiful Notion template." />
        <meta name="robots" content="all"></meta>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="author" content="Dren Sokoli" />

        <link rel="icon" href="/favicon.ico" />
        <link rel="canonical" href="https://soniclab.vercel.app" />

        <meta property="og:title" content="SonicLab - Create Spotify playlists tailored to you." />
        <meta property="og:description" content="Create playlists with your top tracks, recent tracks or have SonicLab create them for you automatically every month." />
        <meta property="og:image" content="https://soniclab.vercel.app/og.png" />
        <meta property="og:url" content="https://soniclab.vercel.app/" />
        <meta property="og:site_name" content="SonicLab" />
        <meta property="og:type" content="website" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@SokoliDren" />
        <meta name="twitter:creator" content="@SokoliDren" />
        <meta name="twitter:title" content="SonicLab - Create Spotify playlists tailored to you." />
        <meta name="twitter:description" content="Create playlists with your top tracks, recent tracks or have SonicLab create them for you automatically every month." />
        <meta name="twitter:image" content="https://soniclab.vercel.app/og.png" />
        <meta name="twitter:domain" content="soniclab.vercel.app" />
        <meta name="twitter:url" content="https://soniclab.vercel.app/" />

        <script data-name="BMC-Widget" data-cfasync="false" src="https://cdnjs.buymeacoffee.com/1.0.0/widget.prod.min.js" data-id="drenso" data-description="Support me on Buy me a coffee!" data-message="" data-color="#BD5FFF" data-position="Right" data-x_margin="18" data-y_margin="18" defer></script>

        {/* <script async src="https://fundingchoicesmessages.google.com/i/pub-3464540666338005?ers=1" nonce="RH0oI1spY4eKumxENDXqgg"></script> */}
        {/* <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3464540666338005" crossOrigin="anonymous"></script> */}
        {/* <meta name="google-adsense-account" content="ca-pub-3464540666338005" /> */}
      </Head>
      <body>
        <Main />
        <NextScript />
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3464540666338005" crossOrigin="anonymous"></script>
      </body>
    </Html>
  )
}
