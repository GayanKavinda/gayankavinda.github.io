import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '@components/layout/Navbar';
import Hero from '@features/home/components/Hero';
import MaskTransition from '@components/animations/MaskTransition';
import Projects from '@features/projects/components/Projects';
import TechStack from '@features/home/components/TechStack/index';
import Experience from '@features/home/components/Experience';
import Certifications from '@features/home/components/Certifications';
import About from '@features/about/components/About';
import EngineeringPhilosophy from '@features/about/components/EngineeringPhilosophy/index';
import Contact from '@features/contact/Contact';
import Footer from '@components/layout/Footer';
import SideNav from '@components/layout/SideNav';
import SectionReveal from '@components/animations/SectionReveal';
import { setSEO, injectPersonSchema } from '@lib/seo';
import FAQ from '@features/home/components/FAQ/index';

const Home = () => {
  const location = useLocation();

  useEffect(() => {
    setSEO();
    injectPersonSchema();
    return () => {
      document.getElementById('person-schema')?.remove();
    };
  }, []);

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      requestAnimationFrame(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      });
      // Clear the hash so the URL stays clean (no #contact visible)
      if (typeof window !== 'undefined') {
        window.history.replaceState(null, '', window.location.pathname + window.location.search);
      }
    }
  }, [location.hash]);

  return (
    <>
      <Navbar />
      <SideNav />

      <div id="home">
        <Hero />
      </div>

      <SectionReveal id="about" variant="scale" threshold={0.2}>
        <About />
      </SectionReveal>

      <SectionReveal id="experience" variant="rise" threshold={0.15}>
        <Experience />
      </SectionReveal>

      <MaskTransition />

      <SectionReveal id="projects" variant="scale" threshold={0.15}>
        <Projects />
      </SectionReveal>

      <SectionReveal variant="rise" threshold={0.15}>
        <EngineeringPhilosophy />
      </SectionReveal>

      <SectionReveal id="skills" variant="fade" threshold={0.15}>
        <TechStack />
      </SectionReveal>

      <SectionReveal variant="rise" threshold={0.15}>
        <Certifications />
      </SectionReveal>

      <SectionReveal variant="fade" threshold={0.2}>
        <FAQ />
      </SectionReveal>

      <SectionReveal id="contact" variant="scale" threshold={0.2}>
        <Contact />
      </SectionReveal>

      <SectionReveal variant="fade" threshold={0.1}>
        <Footer />
      </SectionReveal>
    </>
  );
};

export default Home;

