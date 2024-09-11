import { Head, Html, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en" data-theme="retro">
      <Head>
        <script
          src="https://beamanalytics.b-cdn.net/beam.min.js"
          data-token={process.env.NEXT_PUBLIC_BEAM_ANALYTICS_DATA_TOKEN}
          async
        />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5654598090665312"
          crossOrigin="anonymous"
        />
        <meta name="google-adsense-account" content="ca-pub-5654598090665312" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
