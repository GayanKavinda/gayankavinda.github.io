import { ReactNode } from 'react';
import { cn } from '@lib/utils';
import { useTheme } from '@app/providers/theme-provider';

interface BentoCardProps {
  title?: string;
  className?: string;
  children: ReactNode;
}

const BentoCard = ({ title, className, children }: BentoCardProps) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div 
      className={cn(
        "group relative overflow-hidden rounded-2xl border transition-colors duration-500",
        "border-foreground/5 bg-foreground/[0.02] hover:border-foreground/20",
        "flex flex-col p-6",
        className
      )}
    >
      {/* Soft radial glow on hover */}
      <div 
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100"
        style={{
          background: isDark
            ? 'radial-gradient(circle at 50% 120%, rgba(255,255,255,0.08), transparent 70%)'
            : 'radial-gradient(circle at 50% 120%, rgba(0,0,0,0.04), transparent 70%)'
        }}
      />
      
      {/* Content wrapper */}
      <div className="relative z-10 flex h-full flex-col">
        {title && (
          <h3 className="mb-4 font-mono text-[10px] uppercase tracking-widest text-foreground/40">
            {title}
          </h3>
        )}
        <div className="flex-1">
          {children}
        </div>
      </div>
    </div>
  );
};

export default BentoCard;
