// no explicit React import required with the JSX transform
import { Helmet } from 'react-helmet-async'

export interface SeoProps {
  title?: string
  description?: string
  image?: string
  pathname?: string
}

const defaultTitle = 'Website Development & .NET Developer — John Philip Garcia'
const defaultDescription = 'Build performant, accessible and SEO-friendly websites with a .NET developer experienced in React and TypeScript.'

export default function Seo({ title, description, image, pathname }: SeoProps) {
  const siteUrl = (typeof window !== 'undefined' && window.location.origin) ? window.location.origin : (import.meta.env?.VITE_SITE_URL ?? '')
  const fullUrl = siteUrl + (pathname || '/')
  const metaTitle = title || defaultTitle
  const metaDesc = description || defaultDescription
  const metaImage = image || '/Media.jpg'

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Person',
        'name': 'John Philip Garcia',
        'url': siteUrl || '',
        'jobTitle': '.NET Developer',
        'sameAs': [
          'https://github.com/ip33haa',
          'https://www.linkedin.com/in/john-philip-g-01704b210'
        ]
      },
      {
        '@type': 'WebSite',
        'url': siteUrl || '',
        'name': 'John Philip Garcia',
        'potentialAction': {
          '@type': 'SearchAction',
          'target': `${siteUrl}/?s={search_term_string}`,
          'query-input': 'required name=search_term_string'
        }
      }
    ]
  }

  return (
    <Helmet>
      <title>{metaTitle}</title>
      <meta name="description" content={metaDesc} />
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href={fullUrl} />

      <meta property="og:title" content={metaTitle} />
      <meta property="og:description" content={metaDesc} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:image" content={metaImage} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={metaTitle} />
      <meta name="twitter:description" content={metaDesc} />
      <meta name="twitter:image" content={metaImage} />

      <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
    </Helmet>
  )
}
