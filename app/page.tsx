import Hero from '@/components/Hero';
import { Short, Receipts } from '@/components/Short';
import Work from '@/components/Work';
import { Pricing, Faq } from '@/components/Pricing';
import { Play, Journey } from '@/components/PlayJourney';
import About from '@/components/About';
import Footer from '@/components/Footer';
import Behaviors from '@/components/Behaviors';
import Loader from '@/components/Loader';
import { jsonLd } from '@/lib/seo';

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Loader />
      <a className="skip" href="#p-jee">
        skip to programs
      </a>
      <div className="sheet">
        <Hero />
        <Short />
        <Receipts />
        <Work />
        <Pricing />
        <Play />
        <Journey />
        <About />
        <Faq />
      </div>
      <Footer />
      <Behaviors />
    </>
  );
}
