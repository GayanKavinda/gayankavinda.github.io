import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '@components/layout/Navbar';
import Hero from '@features/home/components/Hero';
import MaskTransition from '@components/animations/MaskTransition';
import Projects from '@features/projects/components/Projects';
import TechStack from '@features/home/components/TechStack/index';
import Experience from '@features/home/components/Experience';
import About from '@features/about/components/About';
import EngineeringPhilosophy from '@features/about/components/EngineeringPhilosophy/index';
import Contact from '@features/contact/Contact';
import Footer from '@components/layout/Footer';
import SideNav from '@components/layout/SideNav';
import { setSEO, injectPersonSchema } from '@lib/seo';

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
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [location.hash]);

  return (
    <>
      <Navbar />
      <SideNav />

      <div id="home">
        <Hero />
      </div>

      <MaskTransition />
      <Projects />
      <TechStack />



      <Experience />
      <About />
      <EngineeringPhilosophy />

      <Contact />
      <Footer />
    </>
  );
};

export default Home;

