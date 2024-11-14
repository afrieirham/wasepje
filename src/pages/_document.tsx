import { env } from "@/env.mjs";
import { Head, Html, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en" data-theme="retro">
      <Head>
        <script
          defer
          src="https://analytics.afrieirham.com/script.js"
          data-website-id={env.NEXT_PUBLIC_UMAMI_WEBSITE_ID}
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
