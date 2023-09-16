import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <title>SpotiLab</title>
      <meta name="SpotiLab" content="" />

      <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r121/three.min.js" async></script>
      <script src="https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.net.min.js" async></script>
      <div className='hidden'>
        <script data-name="BMC-Widget" data-cfasync="false" src="https://cdnjs.buymeacoffee.com/1.0.0/widget.prod.min.js" data-id="drensokoli" data-description="Support me on Buy me a coffee!" data-message="" data-color="#BD5FFF" data-position="Right" data-x_margin="18" data-y_margin="18" async></script>
      </div>

      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
