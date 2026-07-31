import { FaqSection } from '@components/ui/faq-section';

const DEV_FAQS = [
  {
    question: "What is your typical process for a new project?",
    answer: "I start with a thorough Discovery phase to understand your goals, target audience, and requirements. From there, we move into UI/UX design (Figma), followed by full-stack development, rigorous automated testing, and finally a CI/CD pipeline for a smooth launch. You're kept in the loop at every stage.",
  },
  {
    question: "What technologies do you specialize in?",
    answer: "My core stack includes React, Next.js, TypeScript, Node.js, and Tailwind CSS. For backend and databases, I frequently use PostgreSQL, MongoDB, and Express. I also have strong experience with modern tooling like Vite, Framer Motion for animations, and Docker for deployment.",
  },
  {
    question: "How do you handle project communication and updates?",
    answer: "I believe transparent communication is key to a successful project. I provide weekly progress updates, host regular sync calls, and use asynchronous tools like Slack or Discord to ensure you always know the status of your project and can provide feedback early.",
  },
  {
    question: "Do you provide ongoing support after launch?",
    answer: "Yes, I offer a standard warranty period for bug fixes immediately following launch. For long-term peace of mind, I also offer monthly retainer packages covering maintenance, performance optimization, and new feature development.",
  }
];

const FAQ = () => {
  return (
    <section style={{ position: 'relative', overflow: 'hidden' }}>
      <FaqSection
        title="Frequently Asked Questions"
        description="Common questions clients ask before we start working together."
        items={DEV_FAQS}
        contactInfo={{
          title: "Still have questions?",
          description: "I'm always happy to chat about your next big idea.",
          buttonText: "Get in Touch",
          onContact: () => {
            document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
          },
        }}
      />
    </section>
  );
};

export default FAQ;
