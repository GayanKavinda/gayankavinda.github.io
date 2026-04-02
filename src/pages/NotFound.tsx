//src/components/common/NotFound.tsx 
import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: Non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background relative overflow-hidden">
      {/* Design accents */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]" 
        style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)', backgroundSize: '32px 32px' }} />
      
      <div className="relative z-10 text-center px-6">
        <p className="font-mono text-[12px] uppercase tracking-[0.3em] text-[#C41E3A] mb-4">// System.Error: 404</p>
        <h1 className="font-playfair font-black text-[clamp(80px,15vw,160px)] leading-none text-foreground tracking-tighter mb-4 opacity-10">404</h1>
        
        <div className="max-w-[400px] mx-auto bg-card border border-border rounded-2xl p-8 elevation-card relative -mt-12 md:-mt-20">
          <h2 className="font-jakarta font-bold text-[20px] text-foreground mb-3">Endpoint Not Found</h2>
          <p className="font-sans text-[14px] text-muted-foreground leading-relaxed mb-8">
            The requested resource at <code className="bg-muted px-1.5 py-0.5 rounded text-[12px] text-crimson">{location.pathname}</code> does not exist on this node.
          </p>
          <a
            href="/"
            className="inline-flex items-center justify-center w-full bg-foreground text-background font-mono text-[12px] uppercase tracking-wider py-4 rounded hover:bg-[#C41E3A] hover:text-white transition-all"
          >
            Return to Cluster Root
          </a>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
