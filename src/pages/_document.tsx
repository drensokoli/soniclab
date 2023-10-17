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
      <title>SpotiLab</title>
      <meta name="SpotiLab" content="" />
      <meta name="google-adsense-account" content="ca-pub-3464540666338005" />

      <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r121/three.min.js" defer></script>
      <script src="https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.net.min.js" defer></script>

      <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3464540666338005" crossOrigin="anonymous"></script>

      <Head>
        <script async src="https://fundingchoicesmessages.google.com/i/pub-3464540666338005?ers=1" nonce="RH0oI1spY4eKumxENDXqgg"></script>
        <meta name="google-adsense-account" content="ca-pub-3464540666338005" />
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3464540666338005" crossOrigin="anonymous"></script>
      </Head>
      <body>
        <Main />
        <NextScript />
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3464540666338005" crossOrigin="anonymous"></script>
      </body>
    </Html>
  )
}
