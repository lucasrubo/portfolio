import { useState, useEffect } from "react";
import { Menu, X, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { key: "nav.home", href: "#hero" },
    { key: "nav.about", href: "#about" },
    { key: "nav.experience", href: "#experience" },
    { key: "nav.education", href: "#education" },
    { key: "nav.skills", href: "#skills" },
    { key: "nav.projects", href: "#projects" },
    { key: "nav.certificates", href: "#certificates" },
    { key: "nav.contact", href: "#contact" },
  ];

  const toggleLanguage = () => {
    setLanguage(language === "pt" ? "en" : "pt");
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 w-full ${
        scrolled
          ? "bg-background/95 backdrop-blur-md shadow-lg"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 max-w-8xl">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <motion.a
            href="#hero"
            className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            LR
          </motion.a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item, index) => (
              <motion.a
                key={item.key}
                href={item.href}
                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors relative group"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {t(item.key)}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
              </motion.a>
            ))}

            <Button
              variant="ghost"
              size="icon"
              onClick={toggleLanguage}
              className="ml-4 w-16"
            >
              <Globe className="h-5 w-5" />
              <span className="ml-2 text-sm">{language.toUpperCase()}</span>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <Button variant="ghost" size="icon" onClick={toggleLanguage}>
              <Globe className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-card border-t border-border"
          >
            <div className="container mx-auto px-4 py-4 space-y-2">
              {navItems.map((item) => (
                <a
                  key={item.key}
                  href={item.href}
                  className="block px-4 py-3 text-sm font-medium text-muted-foreground hover:text-primary hover:bg-muted rounded-lg transition-all"
                  onClick={() => setIsOpen(false)}
                >
                  {t(item.key)}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default NavBar;
