import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { Code2, Rocket, Users, Smartphone } from "lucide-react";

const About = () => {
  const { t, language } = useLanguage();

  const features = [
    {
      icon: Code2,
      title: language === "pt" ? "Clean Code" : "Clean Code",
      description:
        language === "pt"
          ? "Código limpo, testável e mantível"
          : "Clean, testable and maintainable code",
    },
    {
      icon: Rocket,
      title: language === "pt" ? "Performance" : "Performance",
      description:
        language === "pt"
          ? "Otimização e alta performance"
          : "Optimization and high performance",
    },
    {
      icon: Users,
      title: language === "pt" ? "Colaboração" : "Collaboration",
      description:
        language === "pt"
          ? "Trabalho em equipe e comunicação"
          : "Team work and communication",
    },
    {
      icon: Smartphone,
      title:
        language === "pt"
          ? "Aplicativos Cross-Platform"
          : "Cross-Platform Applications",
      description:
        language === "pt"
          ? "Aplicativos iOS, Android e web com desempenho nativo"
          : "iOS, Android & web apps with native performance",
    },
  ];

  const paragraphs = [
    t("about.description1"),
    t("about.description2"),
    t("about.description3"),
  ];

  return (
    <section id="about" className="py-20 md:py-32 bg-background relative">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-5xl mx-auto motion-optimize"
          layout
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-8 text-center">
            {t("about.title")}
          </h2>
          <div className="h-1 w-20 bg-gradient-primary mx-auto mb-12" />

          <div className="grid md:grid-cols-3 gap-8 lg:gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative group max-w-xs mx-auto md:mx-0 order-2 md:order-1"
            >
              <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 p-1">
                <div className="relative overflow-hidden rounded-xl bg-card">
                  <img
                    src="/lucasrubo/images/eu.jpg"
                    alt="Lucas Gabriel Rubo - Desenvolvedor Full Stack"
                    className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105 aspect-square"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-primary/10 rounded-full blur-xl group-hover:bg-primary/20 transition-colors duration-300" />
            </motion.div>

            <div className="space-y-6 md:col-span-2 order-1 md:order-2">
              {paragraphs.map((para, index) => (
                <motion.p
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 + 0.4 }}
                  className="text-lg text-muted-foreground leading-relaxed"
                >
                  {para}
                </motion.p>
              ))}
            </div>
          </div>

          <div className="mt-12 md:mt-16">
            <div className="grid md:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-30px" }}
                  transition={{
                    delay: index * 0.1,
                    duration: 0.6,
                    ease: "easeOut",
                  }}
                  className="flex items-start space-x-4 p-4 rounded-lg bg-card border border-border hover:border-primary/50 transition-all transform-gpu motion-optimize"
                  layout
                >
                  <div className="p-3 rounded-lg bg-primary/10">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
