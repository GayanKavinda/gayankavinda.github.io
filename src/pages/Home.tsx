import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar                from '@shared/components/layout/Navbar';
import Hero                  from '@features/home/components/Hero/Hero';
import MaskTransition        from '@shared/components/animations/MaskTransition';
import Projects              from '@features/projects/components/Projects';
import TechStack             from '@features/home/components/TechStack/index';
import Experience            from '@features/home/components/Experience';
import About                 from '@features/about/components/About';
import EngineeringPhilosophy from '@features/about/components/EngineeringPhilosophy/index';
import Certifications        from '@features/about/components/Certifications';
import Achievements          from '@features/about/components/Achievements';
import OpenSource            from '@features/home/components/OpenSource';
import Testimonials          from '@features/home/components/Testimonials';
import ImpactMetrics         from '@features/home/components/ImpactMetrics';
import CodeCadence           from '@features/home/components/CodeCadence';
import Blog                  from '@features/blog/components/Blog';
import Contact               from '@features/contact/components/Contact';
import Footer                from '@shared/components/layout/Footer';
import SideNav               from '@shared/components/layout/SideNav';
import { setSEO, injectPersonSchema } from '@shared/lib/seo';

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
      <Certifications />
      <Achievements />

      {/* Open Source — after achievements, shows community involvement */}
      <OpenSource />

      <Testimonials />
      <ImpactMetrics />
      <CodeCadence />

      {/* Blog — near bottom, before contact */}
      <Blog />

      <Contact />
      <Footer />
    </>
  );
};

export default Home;

