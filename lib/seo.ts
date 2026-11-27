import { brand, pricing, faq, plans } from './content';

const title = `${brand.name} · JEE, NEET & Olympiad mentorship app with parent tracking`;
const description = `A personal mentor, complete study material, tests with real analytics and a parent dashboard, in one app for JEE, NEET and Olympiad aspirants. From ₹${pricing.monthly.toLocaleString('en-IN')}/month.`;

export const seo = { title, description };

const org = {
  '@type': 'EducationalOrganization',
  '@id': `${brand.url}#org`,
  name: brand.name,
  url: brand.url,
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
  url: `${brand.url}#pricing`,
});

const course = (name: string, about: string) => ({
  '@type': 'Course',
  name: `${brand.name} One · ${name}`,
  description: about,
  provider: { '@id': `${brand.url}#org` },
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
