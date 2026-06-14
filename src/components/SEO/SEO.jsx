import { Helmet } from 'react-helmet-async';

const SITE_NAME = 'Lumora Studio';

export default function SEO({ title, description, image, type = 'website', url }) {
  const fullTitle = title ? `${title} — ${SITE_NAME}` : `${SITE_NAME} — Architecture & Interior Design`;
  return (
    <Helmet>
      <title>{fullTitle}</title>
      {description && <meta name="description" content={description} />}
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={fullTitle} />
      {description && <meta property="og:description" content={description} />}
      <meta property="og:type" content={type} />
      {image && <meta property="og:image" content={image} />}
      {url && <link rel="canonical" href={url} />}
      <meta name="twitter:card" content={image ? 'summary_large_image' : 'summary'} />
    </Helmet>
  );
}
