import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar                from '@/components/layout/Navbar';
import Hero                  from '@/components/sections/Hero/Hero';
import MaskTransition        from '@/components/animations/MaskTransition';
import Projects              from '@/components/sections/Projects';
import TechStack             from '@/components/sections/TechStack/index';
import Experience            from '@/components/sections/Experience';
import About                 from '@/components/sections/About';
import EngineeringPhilosophy from '@/components/sections/EngineeringPhilosophy/index';
import Certifications        from '@/components/sections/Certifications';
import Achievements          from '@/components/sections/Achievements';
import OpenSource            from '@/components/sections/OpenSource';
import Testimonials          from '@/components/sections/Testimonials';
import ImpactMetrics         from '@/components/sections/ImpactMetrics';
import CodeCadence           from '@/components/sections/CodeCadence';
import Blog                  from '@/components/sections/Blog';
import Contact               from '@/components/sections/Contact';
import Footer                from '@/components/layout/Footer';
import SideNav               from '@/components/layout/SideNav';
import { setSEO, injectPersonSchema } from '@/lib/seo';

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