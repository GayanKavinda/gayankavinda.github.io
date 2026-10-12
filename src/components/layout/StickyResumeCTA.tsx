import { motion } from 'framer-motion';
import { Download, FileText } from 'lucide-react';

export const StickyResumeCTA = () => {
  return (
    <>
      <style>
        {`@import url('https://fonts.googleapis.com/css2?family=Fira+Sans:wght@300;400;500&display=swap');`}
      </style>
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex items-center justify-center"
      >
        <a
          href="/resume.pdf"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Download Resume / CV"
          className="group flex items-center gap-2 sm:gap-2.5 overflow-hidden rounded-full bg-background/80 dark:bg-zinc-900/80 p-1.5 sm:p-2 border border-foreground/10 dark:border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.12)] backdrop-blur-xl transition-all duration-300 hover:border-[#d60d86]/40 hover:shadow-[0_8px_30px_rgba(214,13,134,0.2)]"
        >
          <div className="relative flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-full bg-[#d60d86]/15 text-[#d60d86] transition-transform duration-300 group-hover:scale-105">
            <FileText className="absolute h-4 w-4 transition-all duration-300 group-hover:scale-0 group-hover:opacity-0" />
            <Download className="absolute h-4 w-4 scale-0 opacity-0 transition-all duration-300 group-hover:scale-100 group-hover:opacity-100" />
          </div>
          
          <div className="flex flex-col items-start justify-center max-w-0 opacity-0 transition-all duration-500 ease-out group-hover:max-w-[140px] group-hover:opacity-100 group-hover:pr-2.5 overflow-hidden whitespace-nowrap">
            <span className="text-xs font-semibold leading-tight text-foreground">
              Resume / CV
            </span>
            <span 
              className="text-[10px] font-normal text-muted-foreground"
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
