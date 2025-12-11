import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

type Language = "pt" | "en";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

// Função para detectar a linguagem do sistema/navegador
const detectSystemLanguage = (): Language => {
  // Verifica se estamos no navegador
  if (typeof window === "undefined") return "pt";

  // Lista de idiomas suportados
  const supportedLanguages: Language[] = ["pt", "en"];

  // Tenta detectar pela propriedade navigator.language
  const browserLang = navigator.language || "en";

  // Extrai apenas o código de idioma (ex: 'pt-BR' -> 'pt')
  const langCode = browserLang.split("-")[0].toLowerCase();

  // Verifica se o idioma detectado é suportado
  if (supportedLanguages.includes(langCode as Language)) {
    return langCode as Language;
  }

  // Também verifica navigator.languages (array de idiomas preferidos)
  if (navigator.languages) {
    for (const lang of navigator.languages) {
      const code = lang.split("-")[0].toLowerCase();
      if (supportedLanguages.includes(code as Language)) {
        return code as Language;
      }
    }
  }

  // Fallback para português
  return "pt";
};
function getIdadeNascimento(): number {
  const nascimento = new Date(2000, 7, 12);
  return new Date().getFullYear() - nascimento.getFullYear();
}
function getTempoExperiencia(): number {
  const inicio = new Date(2019, 5, 1);
  return new Date().getFullYear() - inicio.getFullYear();
}
const translations = {
  pt: {
    // Navigation
    "nav.home": "Início",
    "nav.about": "Sobre",
    "nav.experience": "Experiência",
    "nav.education": "Educação",
    "nav.skills": "Habilidades",
    "nav.projects": "Projetos",
    "nav.certificates": "Certificados",
    "nav.contact": "Contato",

    // Hero
    "hero.greeting": "Olá, eu sou",
    "hero.name": "Lucas Gabriel Rubo",
    "hero.title": "Desenvolvedor Web",
    "hero.description":
      "Transformando ideias em experiências digitais excepcionais com código limpo e design elegante.",
    "hero.cta": "Currículo",
    "hero.contact": "Entrar em Contato",

    // About
    "about.title": "Sobre Mim",
    "about.description1": `Olá, eu sou Rubo, tenho ${getIdadeNascimento()} anos. Possuo ${getTempoExperiencia()} anos de experiência em desenvolvimento web.`,
    "about.description2":
      "Apaixonado por criar soluções inovadoras e eficientes. Com experiência em desenvolvimento web moderno, busco constantemente novos desafios e oportunidades de aprendizado.",
    "about.description3":
      "Com forte experiência em tecnologias modernas como React, Node.js, TypeScript e muito mais, eu transformo requisitos complexos em soluções elegantes e funcionais.",

    // Experience
    "experience.title": "Experiência Profissional",

    // Education
    "education.title": "Formação Acadêmica",

    // Skills
    "skills.title": "Habilidades & Tecnologias",
    "skills.frontend": "Frontend",
    "skills.backend": "Backend",
    "skills.tools": "Ferramentas",
    "skills.other": "Outras",

    // Projects
    "projects.title": "Projetos em Destaque",
    "projects.viewCode": "Ver Código",
    "projects.viewLive": "Ver Demo",

    // Certificates
    "certificates.title": "Certificados & Conquistas",

    // Contact
    "contact.title": "Vamos Conversar",
    "contact.description":
      "Estou sempre aberto a novas oportunidades e colaborações. Entre em contato!",
    "contact.send": "Enviar Mensagem",

    // Footer
    "footer.rights": "Todos os direitos reservados.",
    "footer.built": "Desenvolvido com",

    // Profile Data for Resume
    "profile.name": "Lucas Gabriel Rubo",
    "profile.title": "Desenvolvedor Web",
    "profile.email": "lucasrubo1@gmail.com",
    "profile.phone": "+55 19 994019804",
    "profile.location": "Valinhos, SP - Brasil",
    "profile.linkedin": "linkedin.com/in/lucas-rubo/",
    "profile.github": "github.com/lucasrubo",

    // Resume Sections
    "resume.professionalSummary": "Resumo Profissional",
    "resume.experience": "Experiência",
    "resume.education": "Formação Acadêmica",
    "resume.technicalSkills": "Habilidades Técnicas",
    "resume.coreCompetencies": "Competências Principais",
    "resume.keyCertifications": "Certificações Principais",
    "resume.links": "Links",

    // Profile About Paragraphs
    "profile.about.paragraph1":
      "Tenho 25 anos e sou formado em Ciência da Computação pela Universidade Paulista.",
    "profile.about.paragraph2":
      "Atualmente, trabalho como desenvolvedor na Areco, onde me especializo em desenvolvimento front-end para o sistema ERP Web usando Blazor. Além disso, contribuo para a construção de sistemas complementares com Blazor, Next.js e Delphi, garantindo integração perfeita e desempenho. Minha paixão está no desenvolvimento front-end, onde gosto de criar interfaces de usuário intuitivas e responsivas que melhoram a usabilidade e eficiência. Além do Blazor, também tenho experiência com React e TypeScript, que utilizo ativamente em projetos pessoais e profissionais para me manter na vanguarda do desenvolvimento web moderno.",
    "profile.about.paragraph3":
      "Anteriormente, trabalhei como Desenvolvedor na NB41 Comunicação e Marketing LTDA, onde desenvolvi e customizei sistemas baseados em PHP, projetei layouts e gerenciei bancos de dados. Antes disso, estagiei como Desenvolvedor de Sistemas na IBM na equipe CI/CD, focando em automação de testes, criação de pipelines Jenkins e scripting (Docker, Git) para otimizar processos de implantação.",
    "profile.about.paragraph4":
      "Sou profundamente apaixonado por tecnologias front-end, particularmente React e TypeScript, e busco continuamente expandir minha expertise em frameworks modernos e melhores práticas. Além disso, tenho experiência com linguagens back-end como Java, Python e C++, bem como sistemas de banco de dados como MySQL e PostgreSQL.",
    "profile.about.paragraph5":
      "Um forte defensor do aprendizado ao longo da vida, prospero em ambientes dinâmicos onde posso aplicar minhas habilidades de resolução de problemas e adaptabilidade para entregar soluções de alta qualidade. Seja trabalhando em sistemas complexos ou experimentando novas tecnologias, estou sempre ansioso para crescer e contribuir para projetos impactantes.",

    // Aprix
    "aprix.online": "Online",
    "aprix.offline": "Offline",
    "aprix.title": "Aprix",
    "aprix.fixedMode": "Modo fixo (não seguir mouse)",
    "aprix.closeModal": "Fechar modal",
  },
  en: {
    // Navigation
    "nav.home": "Home",
    "nav.about": "About",
    "nav.experience": "Experience",
    "nav.education": "Education",
    "nav.skills": "Skills",
    "nav.projects": "Projects",
    "nav.certificates": "Certificates",
    "nav.contact": "Contact",

    // Hero
    "hero.greeting": "Hi, I'm",
    "hero.name": "Lucas Gabriel Rubo",
    "hero.title": "Web Developer",
    "hero.description":
      "Transforming ideas into exceptional digital experiences with clean code and elegant design.",
    "hero.cta": "Resume",
    "hero.contact": "Get in Touch",

    // About
    "about.title": "About Me",
    "about.description1": `Hi, I'm Rubo, I'm ${getIdadeNascimento()} years old. I have ${getTempoExperiencia()} years of experience in web development.`,
    "about.description2":
      "Web Developer passionate about creating innovative and efficient solutions. With experience in modern web development, I constantly seek new challenges and learning opportunities.",
    "about.description3":
      "With strong experience in modern technologies like React, Node.js, TypeScript and much more, I transform complex requirements into elegant and functional solutions.",

    // Experience
    "experience.title": "Professional Experience",

    // Education
    "education.title": "Education",

    // Skills
    "skills.title": "Skills & Technologies",
    "skills.frontend": "Frontend",
    "skills.backend": "Backend",
    "skills.tools": "Tools",
    "skills.other": "Other",

    // Projects
    "projects.title": "Featured Projects",
    "projects.viewCode": "View Code",
    "projects.viewLive": "View Live",

    // Certificates
    "certificates.title": "Certificates & Achievements",

    // Contact
    "contact.title": "Let's Talk",
    "contact.description":
      "I'm always open to new opportunities and collaborations. Get in touch!",
    "contact.send": "Send Message",

    // Footer
    "footer.rights": "All rights reserved.",
    "footer.built": "Built with",

    // Profile Data for Resume
    "profile.name": "Lucas Gabriel Rubo",
    "profile.title": "Web Developer",
    "profile.email": "lucasrubo1@gmail.com",
    "profile.phone": "+55 19 994019804",
    "profile.location": "Valinhos, SP - Brazil",
    "profile.linkedin": "linkedin.com/in/lucas-rubo/",
    "profile.github": "github.com/lucasrubo",

    // Resume Sections
    "resume.professionalSummary": "Professional Summary",
    "resume.experience": "Experience",
    "resume.education": "Education",
    "resume.technicalSkills": "Technical Skills",
    "resume.coreCompetencies": "Core Competencies",
    "resume.keyCertifications": "Key Certifications",
    "resume.links": "Links",

    // Profile About Paragraphs
    "profile.about.paragraph1":
      "I am 24 years old and hold a degree in Computer Science from Universidade Paulista.",
    "profile.about.paragraph2":
      "Currently, I work as a developer at Areco, where I specialize in front-end development for the ERP Web system using Blazor. Additionally, I contribute to building supplementary systems with Blazor, Next.js, and Delphi, ensuring seamless integration and performance. My passion lies in front-end development, where I enjoy crafting intuitive, responsive user interfaces that enhance usability and efficiency. Beyond Blazor, I also have experience with React and TypeScript, which I actively use in personal and professional projects to stay at the forefront of modern web development.",
    "profile.about.paragraph3":
      "Previously, I worked as a Developer at NB41 Comunicação e Marketing LTDA, where I developed and customized PHP-based systems, designed layouts, and managed databases. Before that, I interned as a Systems Developer at IBM in the CI/CD team, focusing on test automation, Jenkins pipeline creation, and scripting (Docker, Git) to streamline deployment processes.",
    "profile.about.paragraph4":
      "I am deeply passionate about front-end technologies, particularly React and TypeScript, and continuously seek to expand my expertise in modern frameworks and best practices. Additionally, I have experience with back-end languages like Java, Python, and C++, as well as database systems such as MySQL and PostgreSQL.",
    "profile.about.paragraph5":
      "A strong believer in lifelong learning, I thrive in dynamic environments where I can apply my problem-solving skills and adaptability to deliver high-quality solutions. Whether working on complex systems or experimenting with new technologies, I am always eager to grow and contribute to impactful projects.",

    // Aprix
    "aprix.online": "Online",
    "aprix.offline": "Offline",
    "aprix.title": "Aprix",
    "aprix.fixedMode": "Fixed mode (don't follow mouse)",
    "aprix.closeModal": "Close modal",
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>(() =>
    detectSystemLanguage()
  );

  const t = (key: string): string => {
    return (
      translations[language][key as keyof (typeof translations)["pt"]] || key
    );
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
};
