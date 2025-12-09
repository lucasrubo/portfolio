import { motion } from "framer-motion";
import { ChevronDown, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import PrintableResume from "./PrintableResume";
import { useReactToPrint } from "react-to-print";
import { useRef } from "react";
import { Suspense } from "react";
import ColorBends from "./ColorBends";

const Hero = () => {
  const { t } = useLanguage();
  const resumeRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: resumeRef,
    documentTitle: "Lucas_Rubo_Resume",
    pageStyle: `
      @page {
        size: A4;
        margin: 20mm;
      }
      @media print {
        body {
          -webkit-print-color-adjust: exact;
          color-adjust: exact;
        }
      }
    `,
  });

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-hero"
    >
      {/* 3D Background */}
      <div className="absolute inset-0 z-0 opacity-20">
        <Suspense fallback={<div className="w-full h-full bg-gradient-hero" />}>
          <ColorBends
            colors={["#ff5c7a", "#8a5cff", "#00ffd1"]}
            rotation={125}
            autoRotate={0.1}
            speed={0.2}
            scale={1}
            frequency={1}
            warpStrength={1}
            mouseInfluence={0.5}
            parallax={0}
            noise={0.1}
            transparent
          />
        </Suspense>
      </div>

      {/* Gradient Overlay */}
      <div className="inset-0 absolute bg-gradient-to-b from-transparent via-background/50 to-background z-10" />

      {/* Content */}
      <div className="container mx-auto px-4 z-20 relative">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-primary text-lg md:text-xl mb-4 font-medium">
              {t("hero.greeting")}
            </p>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent">
              {t("hero.name")}
            </h1>
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-secondary mb-8">
              {t("hero.title")}
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
              {t("hero.description")}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-glow"
                onClick={handlePrint}
              >
                <Download />
                {t("hero.cta")}
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-primary text-primary hover:bg-primary/10"
                asChild
              >
                <a href="#contact">{t("hero.contact")}</a>
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <a href="#about" className="flex flex-col items-center text-primary">
          <ChevronDown className="h-8 w-8" />
        </a>
      </motion.div>

      {/* Hidden Printable Resume for Download */}
      <div className="hidden">
        <PrintableResume ref={resumeRef} />
      </div>
    </section>
  );
};

export default Hero;
