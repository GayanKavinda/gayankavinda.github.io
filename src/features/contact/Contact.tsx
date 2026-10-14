import ContactWithGlobe from "@/components/ui/contact-with-globe";

export default function Contact() {
  const contactEmail = import.meta.env.VITE_CONTACT_EMAIL || "gayankavinda98v.lk@gmail.com";
  const contactGithub = import.meta.env.VITE_CONTACT_GITHUB || "https://github.com/GayanKavinda";
  const contactLinkedin = import.meta.env.VITE_CONTACT_LINKEDIN || "https://linkedin.com/in/yourprofile";
  const contactLocation = import.meta.env.VITE_CONTACT_LOCATION || "Colombo, Sri Lanka";
  const contactStatus = import.meta.env.VITE_CONTACT_STATUS || "Available for selective opportunities";
  const contactX = import.meta.env.VITE_CONTACT_X || "https://twitter.com";

  return (
    <ContactWithGlobe
      id="contact"
      email={contactEmail}
      location={contactLocation}
      status={contactStatus}
      githubUrl={contactGithub}
      linkedinUrl={contactLinkedin}
      twitterUrl={contactX}
    />
  );
}