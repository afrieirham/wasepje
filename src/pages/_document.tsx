import { Head, Html, Main, NextScript } from "next/document";

import { env } from "~/env.mjs";

export default function Document() {
  return (
    <Html lang="en" data-theme="retro">
      <Head>
        <script
          src="https://beamanalytics.b-cdn.net/beam.min.js"
          data-token={env.NEXT_PUBLIC_BEAM_ANALYTICS_DATA_TOKEN}
          async
        />
        <script
          defer
          src="https://analytics.afrieirham.com/script.js"
          data-website-id="bec7b9e3-72cd-4032-87bc-31d454d237be"
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
