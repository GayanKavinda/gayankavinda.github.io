//src/components/sections/Testimonials.tsx

import React from "react";
import { motion } from "motion/react";
import { useTheme } from '@app/providers/theme-provider';

const testimonials = [
  {
    text: "This ERP revolutionized our operations, streamlining finance and inventory. The cloud-based platform keeps us productive, even remotely.",
    image: "https://randomuser.me/api/portraits/women/1.jpg",
    name: "Briana Patton",
    role: "Operations Manager",
  },
  {
    text: "Implementing this ERP was smooth and quick. The customizable, user-friendly interface made team training effortless.",
    image: "https://randomuser.me/api/portraits/men/2.jpg",
    name: "Bilal Ahmed",
    role: "IT Manager",
  },
  {
    text: "The support team is exceptional, guiding us through setup and providing ongoing assistance, ensuring our satisfaction.",
    image: "https://randomuser.me/api/portraits/women/3.jpg",
    name: "Saman Malik",
    role: "Customer Support Lead",
  },
  {
    text: "This ERP's seamless integration enhanced our business operations and efficiency. Highly recommend for its intuitive interface.",
    image: "https://randomuser.me/api/portraits/men/4.jpg",
    name: "Omar Raza",
    role: "CEO",
  },
  {
    text: "Its robust features and quick support have transformed our workflow, making us significantly more efficient.",
    image: "https://randomuser.me/api/portraits/women/5.jpg",
    name: "Zainab Hussain",
    role: "Project Manager",
  },
  {
    text: "The smooth implementation exceeded expectations. It streamlined processes, improving overall business performance.",
    image: "https://randomuser.me/api/portraits/women/6.jpg",
    name: "Aliza Khan",
    role: "Business Analyst",
  },
  {
    text: "Our business functions improved with a user-friendly design and positive customer feedback.",
    image: "https://randomuser.me/api/portraits/men/7.jpg",
    name: "Farhan Siddiqui",
    role: "Marketing Director",
  },
  {
    text: "They delivered a solution that exceeded expectations, understanding our needs and enhancing our operations.",
    image: "https://randomuser.me/api/portraits/women/8.jpg",
    name: "Sana Sheikh",
    role: "Sales Manager",
  },
  {
    text: "Using this ERP, our online presence and conversions significantly improved, boosting business performance.",
    image: "https://randomuser.me/api/portraits/men/9.jpg",
    name: "Hassan Ali",
    role: "E-commerce Manager",
  },
];

const firstColumn = testimonials.slice(0, 3);
const secondColumn = testimonials.slice(3, 6);
const thirdColumn = testimonials.slice(6, 9);

const Testimonials = () => {
  return (
    <section id="testimonials" className="bg-background py-[80px] md:py-[100px] relative overflow-hidden">
      <div className="container z-10 mx-auto px-6 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="flex flex-col items-center justify-center max-w-[540px] mx-auto mb-8 md:mb-12"
        >
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#E8A820] mb-3">// Social Proof</p>
          <h2 className="font-jakarta font-extrabold text-[clamp(32px,5vw,44px)] text-foreground tracking-tight">
            Client <em className="font-playfair italic font-medium text-crimson">Testimonials</em>
          </h2>
          {/* Minimal divider */}
          <div className="flex items-center justify-center gap-3 mt-5">
            <div className="w-12 h-px bg-gradient-to-r from-transparent to-[#C41E3A]" />
            <div className="w-2 h-2 rounded-full bg-[#E8A820]" />
            <div className="w-12 h-px bg-gradient-to-l from-transparent to-[#C41E3A]" />
          </div>
          <p className="text-center mt-4 font-sans text-[13px] md:text-[15px] text-foreground/50 leading-relaxed">
            Scalable solutions, delivered with intent. Hear from the leaders who share our vision.
          </p>
        </motion.div>

        {/* The Fade Mask */}
        <div className="flex justify-center gap-4 md:gap-6 mt-6 [mask-image:linear-gradient(to_bottom,transparent,black_15%,black_85%,transparent)] max-h-[640px] overflow-hidden">
          <TestimonialsColumn testimonials={firstColumn} duration={25} />
          <TestimonialsColumn testimonials={secondColumn} className="hidden md:block" duration={35} />
          <TestimonialsColumn testimonials={thirdColumn} className="hidden lg:block" duration={30} />
        </div>
      </div>
    </section>
  );
};

export const TestimonialsColumn = (props: {
  className?: string;
  testimonials: typeof testimonials;
  duration?: number;
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className={props.className}>
      <motion.div
        animate={{
          translateY: "-50%",
        }}
        transition={{
          duration: props.duration || 10,
          repeat: Infinity,
          ease: "linear",
          repeatType: "loop",
        }}
        className="flex flex-col gap-4 md:gap-6 pb-6"
      >
        {[
          ...new Array(2).fill(0).map((_, index) => (
            <React.Fragment key={index}>
              {props.testimonials.map(({ text, image, name, role }, i) => (
                <div
                  className="p-6 md:p-8 rounded-2xl border border-border bg-card shadow-lg shadow-crimson/[0.03] elevation-card max-w-[280px] md:max-w-xs w-full transition-all duration-300 hover:border-crimson/20 hover:shadow-crimson/[0.08]"
                  key={i}
                >
                  <blockquote className="font-sans text-[13px] md:text-[14px] text-foreground/75 leading-[1.7] mb-6">
                    "{text}"
                  </blockquote>
                  <div className="flex items-center gap-3">
                    <img
                      width={36}
                      height={36}
                      src={image}
                      alt={name}
                      className="h-9 w-9 rounded-full border border-gold/30 grayscale hover:grayscale-0 transition-all duration-300"
                    />
                    <div className="flex flex-col">
                      <div className="font-jakarta text-[11px] md:text-[12px] font-bold text-foreground leading-tight tracking-tight">
                        {name}
                      </div>
                      <div className="font-sans text-[9px] md:text-[10px] text-gold uppercase tracking-wider font-medium mt-0.5 opacity-80">
                        {role}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </React.Fragment>
          )),
        ]}
      </motion.div>
    </div>
  );
};

export default Testimonials;



