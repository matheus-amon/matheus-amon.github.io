import type { CV } from '../content/types';
import { htmlLang } from './i18n';

export type JsonLdNode = { '@type': string; '@id': string } & Record<string, unknown>;

export interface JsonLd {
  '@context': 'https://schema.org';
  '@graph': JsonLdNode[];
}

export function personJsonLd(cv: CV, pageUrl: string, imageUrl: string): JsonLd {
  const personId = `${pageUrl}#person`;
  const knowsAbout = cv.skills.filter((g) => g.id !== 'languages').flatMap((g) => g.items);

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ProfilePage',
        '@id': `${pageUrl}#page`,
        url: pageUrl,
        name: cv.meta.title,
        inLanguage: htmlLang[cv.locale],
        mainEntity: { '@id': personId },
      },
      {
        '@type': 'Person',
        '@id': personId,
        name: cv.person.name,
        url: pageUrl,
        image: imageUrl,
        email: `mailto:${cv.person.email}`,
        jobTitle: cv.person.title,
        description: cv.meta.description,
        homeLocation: {
          '@type': 'Place',
          address: { '@type': 'PostalAddress', addressRegion: 'PB', addressCountry: 'BR' },
        },
        knowsAbout,
        knowsLanguage: ['pt-BR', 'en'],
        sameAs: [cv.person.linkedin, cv.person.github],
      },
    ],
  };
}

/** JSON seguro para `<script type="application/ld+json">`. */
export function serializeJsonLd(data: JsonLd): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}
