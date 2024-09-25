import Head from "next/head";

function SEOHead({
  title,
  description,
  path,
  ogPath = "/og.png",
}: {
  title: string;
  description: string;
  path: string;
  ogPath: string;
}) {
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="icon" href="/favicon.ico" />

      {/* <!-- Facebook Meta Tags --> */}
      <meta property="og:site_name" content={title} />
      <meta property="og:url" content={`https://wasepje.com${path}`} />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={`https://wasepje.com${ogPath}`} />

      {/* <!-- Twitter Meta Tags --> */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta property="twitter:domain" content="wasepje.com" />
      <meta property="twitter:url" content={`https://wasepje.com${path}`} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={`https://wasepje.com${ogPath}`} />
    </Head>
  );
}

export default SEOHead;
