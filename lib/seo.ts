import { brand, pricing, faq, plans } from './content';

// the site's absolute URL: {{DOMAIN}} once it's set, else the Vercel production URL, else localhost
export const siteUrl = !brand.domain.startsWith('{{')
  ? brand.url
  : process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}/`
    : 'http://localhost:3000/';

const title = `${brand.name} · JEE, NEET & Olympiad mentorship, with parents in the loop`;
const description = `Personal mentorship, structured preparation and someone to guide you through your JEE, NEET and Olympiad journey, with parents kept in the loop. From ₹${pricing.monthly.toLocaleString('en-IN')}/month.`;

export const seo = { title, description };

const org = {
  '@type': 'EducationalOrganization',
  '@id': `${siteUrl}#org`,
  name: brand.name,
  url: siteUrl,
  email: brand.email,
  telephone: brand.phone,
  address: { '@type': 'PostalAddress', addressLocality: brand.city.replace(/, IN$/, ''), addressCountry: 'IN' },
  sameAs: [brand.instagram, brand.youtube, brand.linkedin],
};

const offer = (price: number, name: string) => ({
  '@type': 'Offer',
  name,
  price: String(price),
  priceCurrency: 'INR',
  category: 'Subscription',
  url: `${siteUrl}#pricing`,
});

const course = (name: string, about: string) => ({
  '@type': 'Course',
  name: `${brand.name} One · ${name}`,
  description: about,
  provider: { '@id': `${siteUrl}#org` },
  inLanguage: 'en-IN',
  offers: plans.cycles.map((c) => offer(c.price, `${brand.name} One · ${c.cycle}`)),
  hasCourseInstance: { '@type': 'CourseInstance', courseMode: 'online', courseWorkload: 'P1W' },
});

export const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    org,
    course('JEE (Main + Advanced)', 'Mentorship, study material, tests and analytics for JEE Main and JEE Advanced: class 11, 12 and droppers.'),
    course('NEET-UG', 'Mentorship, NCERT-mapped study material, tests and analytics for NEET-UG: class 11, 12 and droppers.'),
    course('Olympiad', 'Mentorship and stage-wise preparation for IOQM/INMO, NSEP/INPhO, NSEC/INChO, NSEB/INBO and NSEJS: class 8 to 12.'),
    {
      '@type': 'FAQPage',
      mainEntity: faq.items.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    },
  ],
};
