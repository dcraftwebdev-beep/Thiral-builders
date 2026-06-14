import { motion } from 'framer-motion';
import SEO from '../../components/SEO/SEO.jsx';
import Hero from './sections/Hero/Hero.jsx';
import Marquee from './sections/Marquee/Marquee.jsx';
import About from './sections/About/About.jsx';
import Services from './sections/Services/Services.jsx';
import Projects from './sections/Projects/Projects.jsx';
import Stats from './sections/Stats/Stats.jsx';
import Process from './sections/Process/Process.jsx';
import Testimonials from './sections/Testimonials/Testimonials.jsx';
import BlogPreview from './sections/BlogPreview/BlogPreview.jsx';
import CTA from './sections/CTA/CTA.jsx';

export default function Home() {
  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -24 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <SEO
        title="Architecture & Interior Design"
        description="Lumora Studio is an architecture and interior design practice crafting calm, enduring spaces for living and work."
      />
      <Hero />
      {/* <Marquee /> */}
      <About />
      <Services />
      <Stats />
      <Projects />
      <Process />
      <Testimonials />
      <BlogPreview />
      <CTA />
    </motion.main>
  );
}
