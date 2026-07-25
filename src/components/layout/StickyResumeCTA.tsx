import { motion } from 'framer-motion';
import { Download, FileText } from 'lucide-react';

export const StickyResumeCTA = () => {
  return (
    <>
      <style>
        {`@import url('https://fonts.googleapis.com/css2?family=Fira+Sans:wght@300;400;500&display=swap');`}
      </style>
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, delay: 1 }}
        className="fixed bottom-6 right-6 z-50 flex items-center justify-center"
      >
        <a
          href="/resume.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-3 overflow-hidden rounded-full bg-white/30 dark:bg-white/20 p-2.5 shadow-[0_4px_16px_rgba(0,0,0,0.08)] backdrop-blur-2xl transition-all duration-500 hover:bg-white/40 dark:hover:bg-white/30 hover:shadow-[0_8px_24px_rgba(0,0,0,0.12)] border-none"
        >
          <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary transition-transform duration-300 group-hover:scale-110">
            <FileText className="absolute h-5 w-5 transition-all duration-300 group-hover:scale-0 group-hover:opacity-0" />
            <Download className="absolute h-5 w-5 scale-0 opacity-0 transition-all duration-300 group-hover:scale-100 group-hover:opacity-100" />
          </div>
          
          <div className="flex flex-col items-start justify-center max-w-0 opacity-0 transition-all duration-500 ease-out group-hover:max-w-[150px] group-hover:opacity-100 group-hover:pr-3 overflow-hidden whitespace-nowrap">
            <span className="text-sm font-medium leading-tight text-foreground/90">
              Resume / CV
            </span>
            <span 
              className="mt-0.5 text-[11px] font-light tracking-wide text-foreground/70"
              style={{ fontFamily: "'Fira Sans', sans-serif" }}
            >
              Download PDF
            </span>
          </div>
        </a>
      </motion.div>
    </>
  );
};

export default StickyResumeCTA;
