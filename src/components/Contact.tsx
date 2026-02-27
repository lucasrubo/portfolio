import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { Mail, Github, Linkedin, MapPin, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";

const Contact = () => {
  const { t } = useLanguage();

  const handleSubmit = (e: React.FormEvent) => {
    // e.preventDefault();
    // const { fullname, email, message } = formState;
    // const phone = profile.phone.replace(/\D/g, "");
    // const text = encodeURIComponent(
    //   `Name: ${fullname}\nEmail: ${email}\nMessage: ${message}`
    // );
    // const url = `https://wa.me/${phone}?text=${text}`;
    // window.open(url, "_blank");
  };

  const contactLinks = [
    {
      icon: Mail,
      label: "Email",
      value: "lucasrubo1@gmail.com",
      href: "mailto:lucasrubo1@gmail.com",
    },
    {
      icon: Github,
      label: "GitHub",
      value: "github.com/lucasrubo",
      href: "https://github.com/lucasrubo",
    },
    {
      icon: Linkedin,
      label: "LinkedIn",
      value: "linkedin.com/in/lucas-rubo/",
      href: "https://linkedin.com/in/lucas-rubo/",
    },
    {
      icon: MapPin,
      label: "Location",
      value: "Valinhos, Brasil",
      href: "https://maps.app.goo.gl/aTQJe4pgyyy9hc839",
    },
  ];

  return (
    <section
      id="contact"
      className="py-20 md:py-32 bg-background relative overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-b from-muted/30 to-transparent" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-8">
            {t("contact.title")}
          </h2>
          <div className="h-1 w-20 bg-gradient-primary mx-auto mb-8" />
          <p className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto">
            {t("contact.description")}
          </p>

          <div className="grid sm:grid-cols-2 gap-6 mb-12">
            {contactLinks.map((link, index) => (
              <motion.a
                key={index}
                href={link.href}
                target={link.href.startsWith("http") ? "_blank" : undefined}
                rel={
                  link.href.startsWith("http")
                    ? "noopener noreferrer"
                    : undefined
                }
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="flex items-center space-x-4 p-6 bg-card rounded-lg border border-border hover:border-primary/50 transition-all shadow-card group"
              >
                <div className="p-3 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <link.icon className="h-6 w-6 text-primary" />
                </div>
                <div className="text-left">
                  <p className="text-sm text-muted-foreground">{link.label}</p>
                  <p className="font-medium text-foreground">{link.value}</p>
                </div>
              </motion.a>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            <Button
              size="lg"
              className="bg-gradient-primary text-white shadow-glow hover:shadow-xl transition-all"
              asChild
            >
              <a
                href="https://wa.me/5519994019804?text=Vamos%20conversar!"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Mail className="h-5 w-5 mr-2" />
                {t("contact.send")}
              </a>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;
