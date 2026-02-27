import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { ExternalLink, Github } from "lucide-react";
import { Button } from "@/components/ui/button";

const Projects = () => {
  const { t, language } = useLanguage();

  const projects = [
    {
      title: "Roteirum",
      description:
        language === "pt"
          ? "Rede social inovadora para criação cinematográfica com IA. Crie sinopses, cartazes e imagens com inteligência artificial, compita no ranking e ganhe reconhecimento pela criatividade."
          : "Innovative social network for cinematic creation with AI. Create synopses, posters and images with artificial intelligence, compete in rankings and earn recognition for creativity.",
      image: "/portfolio/images/roteirum.png",
      technologies: [
        "React",
        "TypeScript",
        "Tailwind CSS",
        "Vite",
        "React Query",
        "Radix UI",
      ],
      github: "https://github.com/lucasrubo/Roteirum",
      live: "https://lucasrubo.github.io/Roteirum/",
    },
    {
      title: "ERP Multi-Empresa",
      description:
        language === "pt"
          ? "Sistema ERP moderno e responsivo para gestão multi-empresa. Inclui dashboard administrativo, criação de pedidos, gerenciamento de vendas e interface unificada para múltiplas empresas."
          : "Modern and responsive multi-company ERP system. Includes administrative dashboard, order creation, sales management and unified interface for multiple companies.",
      image: "/portfolio/images/erp.png",
      technologies: [
        "React",
        "TypeScript",
        "Tailwind CSS",
        "Zustand",
        "TanStack Query",
        "React Hook Form",
      ],
      github: "https://github.com/lucasrubo/ERP",
      live: "https://lucasrubo.github.io/ERP/dashboard",
    },
    {
      title: "Larissa Arendt - Portfolio",
      description:
        language === "pt"
          ? "Portfólio pessoal moderno e elegante desenvolvido com React e TypeScript. Apresenta projetos, habilidades e informações profissionais de forma interativa e responsiva."
          : "Modern and elegant personal portfolio developed with React and TypeScript. Showcases projects, skills and professional information in an interactive and responsive way.",
      image: "/portfolio/images/portfolio.png",
      technologies: [
        "React",
        "TypeScript",
        "Tailwind CSS",
        "Vite",
        "Radix UI",
        // "QrCode",
      ],
      github: "https://github.com/larissaarendt/portfolio",
      live: "https://larissaarendt.github.io/portfolio/",
    },
  ];

  return (
    <section id="projects" className="py-20 md:py-32 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-8 text-center">
            {t("projects.title")}
          </h2>
          <div className="h-1 w-20 bg-gradient-primary mx-auto mb-16" />

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {projects.map((project, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                whileHover={{ y: -10 }}
                className="group bg-card rounded-lg overflow-hidden border border-border hover:border-primary/50 transition-all shadow-card flex flex-col"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent opacity-60" />
                </div>

                <div className="p-6 flex flex-col justify-between flex-1">
                  <h3 className="text-xl font-bold mb-2 text-foreground">
                    {project.title}
                  </h3>
                  <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies.map((tech, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 text-xs font-medium bg-muted text-foreground rounded"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-3">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 border-primary/50 hover:bg-primary/10"
                      asChild
                    >
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Github className="h-4 w-4 mr-2" />
                        {t("projects.viewCode")}
                      </a>
                    </Button>
                    <Button
                      size="sm"
                      className="flex-1 bg-primary hover:bg-primary/90"
                      asChild
                    >
                      <a
                        href={project.live}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        {t("projects.viewLive")}
                      </a>
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Projects;
