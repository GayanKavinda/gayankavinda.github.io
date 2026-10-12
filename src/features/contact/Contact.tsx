import { useState } from "react";
import ContactWithGlobe, { type ContactLinkItem } from "@/components/ui/contact-with-globe";
import { Mail, Github, Linkedin, MapPin } from "lucide-react";

export default function Contact() {
  const [loading, setLoading] = useState(false);

  const contactEmail = import.meta.env.VITE_CONTACT_EMAIL || "gayan982822513.lk@gmail.com";
  const contactGithub = import.meta.env.VITE_CONTACT_GITHUB || "https://github.com/GayanKavinda";
  const contactLinkedin = import.meta.env.VITE_CONTACT_LINKEDIN || "https://linkedin.com/in/yourprofile";
  const contactLocation = import.meta.env.VITE_CONTACT_LOCATION || "Colombo, Sri Lanka";

  const contactLinks: ContactLinkItem[] = [
    {
      icon: Mail,
      label: contactEmail,
      href: `mailto:${contactEmail}`,
    },
    {
      icon: Github,
      label: "GitHub / GayanKavinda",
      href: contactGithub,
    },
    {
      icon: Linkedin,
      label: "LinkedIn Profile",
      href: contactLinkedin,
    },
    {
      icon: MapPin,
      label: contactLocation,
      href: "https://maps.google.com/?q=Colombo,Sri+Lanka",
    },
  ];

  const handleSendMessage = async (data: { name: string; email: string; company?: string; message: string }) => {
    setLoading(true);
    try {
      // Simulate submission or connect to email service
      console.log("Contact submission:", data);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } finally {
      setLoading(false);
    }
  };

  return (
    <ContactWithGlobe
      id="contact"
      title="Connect With Me"
      subtitle="Get in Touch"
      description="Have a project in mind, an engineering problem to discuss, or just want to connect? Drop a message and I'll get back to you promptly."
      contactLinks={contactLinks}
      onSubmitMessage={handleSendMessage}
      isLoading={loading}
    />
  );
}