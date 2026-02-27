import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

const Skills = () => {
  const { t } = useLanguage();

  const skillCategories = [
    {
      title: t("skills.frontend"),
      skills: [
        "Next.js",
        "Blazor",
        "React",
        "TypeScript",
        "Tailwind",
        "HTML/CSS",
        "JavaScript",
        "WPF",
      ],
      color: "from-primary to-cyan-400",
    },
    {
      title: t("skills.backend"),
      skills: ["C#", "NodeJS", "PHP", "SQL", "Delphi", "Python", "PostgreSQL"],
      color: "from-secondary to-purple-400",
    },
    {
      title: t("skills.tools"),
      skills: ["Git", "Docker", "Figma", "PowerShell"],
      color: "from-accent to-blue-400",
    },
    {
      title: t("skills.other"),
      skills: ["Clean Code", "CI/CD", "Agile", "Scrum"],
      color: "from-primary to-secondary",
    },
  ];

  return (
    <section id="skills" className="py-20 md:py-32 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-8 text-center">
            {t("skills.title")}
          </h2>
          <div className="h-1 w-20 bg-gradient-primary mx-auto mb-16" />

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {skillCategories.map((category, categoryIndex) => (
              <motion.div
                key={categoryIndex}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: categoryIndex * 0.1 }}
                className="bg-card p-6 rounded-lg border border-border hover:border-primary/50 transition-all shadow-card"
              >
                <h3
                  className={`text-xl font-bold mb-6 bg-gradient-to-r ${category.color} bg-clip-text text-transparent`}
                >
                  {category.title}
                </h3>
                <div className="flex flex-wrap gap-3">
                  {category.skills.map((skill, skillIndex) => (
                    <motion.span
                      key={skillIndex}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{
                        delay: categoryIndex * 0.1 + skillIndex * 0.05,
                      }}
                      whileHover={{ scale: 1.1, y: -5 }}
                      className="px-4 py-2 bg-muted text-foreground rounded-lg font-medium text-sm border border-border hover:border-primary/50 hover:shadow-glow transition-all cursor-default"
                    >
                      {skill}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Skills;
