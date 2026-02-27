import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { ExternalLink } from "lucide-react";
const PrintableResume = React.forwardRef<HTMLDivElement>((_props, ref) => {
  const { t, language } = useLanguage();

  // Calculate age dynamically
  const age = new Date().getFullYear() - 2000; // Born in 2000

  // Get condensed about text from translations
  const condensedAbout =
    t("profile.about.paragraph1") +
    " " +
    t("profile.about.paragraph2").split(". ")[0] +
    ". " +
    t("profile.about.paragraph3").split(". ")[0] +
    ". " +
    t("profile.about.paragraph4").split(". ")[0] +
    ".";

  // Resume data - should be translated based on language
  const experience = [
    {
      title:
        t("experience.title") === "Experiência Profissional"
          ? "Analista de Desenvolvimento"
          : "Development Analyst",
      company: "Areco",
      period:
        t("experience.title") === "Experiência Profissional"
          ? "2024 - Presente"
          : "2024 - Present",
      description:
        t("experience.title") === "Experiência Profissional"
          ? "Desenvolvimento front-end para sistema ERP Web usando Blazor. Construção de sistemas complementares com Blazor, Next.js e Delphi."
          : "Front-end development for ERP Web system using Blazor. Building supplementary systems with Blazor, Next.js and Delphi.",
    },
    {
      title:
        t("experience.title") === "Experiência Profissional"
          ? "Desenvolvedor"
          : "Developer",
      company: "NB41 Comunicação e Marketing LTDA",
      period: "2022 - 2024",
      description:
        t("experience.title") === "Experiência Profissional"
          ? "Desenvolvimento e customização de sistemas PHP, design de layouts e gerenciamento de bancos de dados."
          : "Development and customization of PHP systems, layout design and database management.",
    },
    {
      title:
        t("experience.title") === "Experiência Profissional"
          ? "Estagiário Desenvolvedor de Sistemas"
          : "Systems Developer Intern",
      company: "IBM",
      period: "2021 - 2022",
      description:
        t("experience.title") === "Experiência Profissional"
          ? "Equipe CI/CD focada em automação de testes, criação de pipelines Jenkins e scripting (Docker, Git)."
          : "CI/CD team focused on test automation, Jenkins pipeline creation and scripting (Docker, Git).",
    },
  ];

  const education = [
    {
      title:
        t("experience.title") === "Experiência Profissional"
          ? "Bacharelado em Ciência da Computação"
          : "Bachelor's in Computer Science",
      period: "2019 - 2023",
      description:
        t("experience.title") === "Experiência Profissional"
          ? "Universidade Paulista - Conclusão com ênfase em desenvolvimento de software e tecnologias web."
          : "Universidade Paulista - Completion with emphasis on software development and web technologies.",
    },
  ];

  const skills = [
    { name: "Next.js", value: 95 },
    { name: "Blazor", value: 95 },
    { name: "C#", value: 90 },
    { name: "Tailwind", value: 95 },
    { name: "Sass", value: 95 },
    { name: "React", value: 80 },
    { name: "TypeScript", value: 80 },
    { name: "Node.js", value: 70 },
    { name: "PHP", value: 80 },
    { name: "SQL", value: 80 },
    { name: "JavaScript", value: 70 },
    { name: "Git", value: 75 },
    { name: "CI/CD", value: 65 },
    { name: "HTML/CSS", value: 100 },
    { name: "Python", value: 60 },
    { name: "WPF", value: 50 },
    { name: "Delphi", value: 55 },
  ];

  const services = [
    {
      title:
        t("experience.title") === "Experiência Profissional"
          ? "Desenvolvimento Front-end"
          : "Front-end Development",
      description:
        t("experience.title") === "Experiência Profissional"
          ? "Interfaces de usuário intuitivas e performáticas"
          : "Intuitive and high-performance user interfaces",
    },
    {
      title:
        t("experience.title") === "Experiência Profissional"
          ? "Desenvolvimento Back-end"
          : "Back-end Development",
      description:
        t("experience.title") === "Experiência Profissional"
          ? "APIs robustas e sistemas escaláveis"
          : "Robust APIs and scalable systems",
    },
    {
      title:
        t("experience.title") === "Experiência Profissional"
          ? "Integração de Sistemas"
          : "System Integration",
      description:
        t("experience.title") === "Experiência Profissional"
          ? "Conexão perfeita entre diferentes plataformas"
          : "Seamless connection between different platforms",
    },
  ];

  const certificates = [
    {
      name: "AWS Certified Cloud Practitioner",
      issuer: "Amazon Web Services",
      issueDate: "2024",
    },
    {
      name: "Microsoft Certified: Azure Fundamentals",
      issuer: "Microsoft",
      issueDate: "2024",
    },
    {
      name: "Meta Front-End Developer",
      issuer: "Meta",
      issueDate: "2023",
    },
    {
      name: "Microsoft Certified: TypeScript",
      issuer: "Microsoft",
      issueDate: "2023",
    },
    {
      name: "OpenJS Node.js Application Developer",
      issuer: "OpenJS Foundation",
      issueDate: "2023",
    },
    {
      name: "Zend Certified PHP Engineer",
      issuer: "Zend Technologies",
      issueDate: "2022",
    },
  ];

  return (
    <div
      ref={ref}
      className="w-[210mm] h-[297mm] mx-auto bg-white text-black p-8 font-sans"
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-6 pb-4 border-b-2 border-gray-300">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">
            {t("profile.name")}
          </h1>
          <h2 className="text-xl text-blue-600 font-semibold">
            {t("profile.title")}
          </h2>
        </div>
        <div className="text-right text-sm">
          <p className="mb-1">{t("profile.email")}</p>
          <p className="mb-1">{t("profile.phone")}</p>
          <p className="mb-1">{t("profile.location")}</p>
          <p>{language === "pt" ? `Idade: ${age}` : `Age: ${age}`}</p>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-3 gap-6 min-h-[180mm]">
        {/* Left Column - Experience & Education */}
        <div className="col-span-2 space-y-4">
          {/* Professional Summary */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-2 uppercase tracking-wide">
              {t("resume.professionalSummary")}
            </h3>
            <p className="text-sm text-gray-700 leading-relaxed">
              {condensedAbout}
            </p>
          </div>

          {/* Experience */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-3 uppercase tracking-wide">
              {t("resume.experience")}
            </h3>
            <div className="space-y-3">
              {experience.map((item, index) => (
                <div key={index} className="relative pl-4">
                  <div className="absolute left-0 top-2 w-2 h-2 bg-blue-600 rounded-full"></div>
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-semibold text-gray-900">
                      {item.title}
                    </h4>
                    <span className="text-sm text-gray-600">{item.period}</span>
                  </div>
                  <p className="text-sm font-medium text-blue-600 mb-1">
                    {item.company}
                  </p>
                  <p className="text-sm text-gray-700">{item.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Education */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-3 uppercase tracking-wide">
              {t("resume.education")}
            </h3>
            <div className="space-y-2">
              {education.map((item, index) => (
                <div key={index}>
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-semibold text-gray-900">
                      {item.title}
                    </h4>
                    <span className="text-sm text-gray-600">{item.period}</span>
                  </div>
                  <p className="text-sm text-gray-700">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Skills, Competencies, Certifications */}
        <div className="space-y-4">
          {/* Technical Skills */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-3 uppercase tracking-wide">
              {t("resume.technicalSkills")}
            </h3>
            <div className="space-y-2">
              {skills.map((skill, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="w-24 text-sm text-gray-900">
                    {skill.name}
                  </span>
                  <div className="flex w-full items-center">
                    <div className="flex-1 mx-2 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${skill.value}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-600 w-8">
                      {skill.value}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Core Competencies */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-3 uppercase tracking-wide">
              {t("resume.coreCompetencies")}
            </h3>
            <div className="space-y-2">
              {services.map((service, index) => (
                <div key={index} className="mb-3">
                  <h4 className="font-semibold text-gray-900 text-sm mb-1">
                    {service.title}
                  </h4>
                  <p className="text-xs text-gray-700">{service.description}</p>
                </div>
              ))}
            </div>
          </div>
          {/* Key Certifications */}
          {/* <div>
            <h3 className="text-lg font-bold text-gray-900 mb-3 uppercase tracking-wide">
              {t("resume.keyCertifications")}
            </h3>
            <div className="space-y-2">
              {certificates.slice(0, 6).map((cert, index) => (
                <div key={index} className="mb-2">
                  <h4 className="font-semibold text-gray-900 text-sm">
                    {cert.name}
                  </h4>
                  <p className="text-xs text-gray-600">
                    {cert.issuer} • {cert.issueDate}
                  </p>
                </div>
              ))}
            </div>
          </div> */}
          {/* Contact Links */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-3 uppercase tracking-wide">
              {t("resume.links")}
            </h3>
            <div className="space-y-1 text-sm">
              <p>
                <a
                  className="flex items-center justify-between"
                  target="_blank"
                  href={"https://" + t("profile.linkedin")}
                >
                  {t("profile.linkedin")}{" "}
                  <ExternalLink className="inline w-3 h-3 text-blue-600" />
                </a>
              </p>
              <p>
                <a
                  className="flex items-center justify-between"
                  target="_blank"
                  href={"https://" + t("profile.github")}
                >
                  {t("profile.github")}{" "}
                  <ExternalLink className="inline w-3 h-3 text-blue-600" />
                </a>
              </p>
              <p>
                <a
                  className="flex items-center justify-between"
                  target="_blank"
                  href="https://lucasrubo.github.io/lucasrubo/"
                >
                  lucasrubo.github.io/lucasrubo/{" "}
                  <ExternalLink className="inline w-3 h-3 text-blue-600" />
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

PrintableResume.displayName = "PrintableResume";

export default PrintableResume;
