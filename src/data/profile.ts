const profile = {
  name: "Lucas Gabriel Rubo",
  title: "Web developer",
  avatar: "./images/avatar.jpg",
  email: "lucasrubo1@gmail.com",
  phone: "+55 (19) 9940-19804",
  birthday: "2000-07-12",
  birthdayText: "July 12, 2000",
  location: "Valinhos, São Paulo, Brazil",
  infoButton: "Show Contacts",

  navBar: {
    about: "About",
    resume: "Resume",
    contact: "Contact",
  },

  about: {
    title: "About me",
    paragraphs: [
      `I am 24 years old and hold a degree in Computer Science from Universidade Paulista.`,
      `Currently, I work as a developer at Areco, where I specialize in front-end development for the ERP Web system using Blazor. Additionally, I contribute to building supplementary systems with Blazor and Delphi, ensuring seamless integration and performance. My passion lies in front-end development, where I enjoy crafting intuitive, responsive user interfaces that enhance usability and efficiency. Beyond Blazor, I also have experience with React and TypeScript, which I actively use in personal and professional projects to stay at the forefront of modern web development.`,
      `Previously, I worked as a Junior Developer at NB41 Comunicação e Marketing LTDA, where I developed and customized PHP-based systems, designed layouts, and managed databases. Before that, I interned as a Systems Developer at IBM in the CI/CD team, focusing on test automation, Jenkins pipeline creation, and scripting (Docker, Git) to streamline deployment processes.`,
      `I am deeply passionate about front-end technologies, particularly React and TypeScript, and continuously seek to expand my expertise in modern frameworks and best practices. Additionally, I have experience with back-end languages like Java, Python, and C++, as well as database systems such as MySQL and PostgreSQL.`,
      `A strong believer in lifelong learning, I thrive in dynamic environments where I can apply my problem-solving skills and adaptability to deliver high-quality solutions. Whether working on complex systems or experimenting with new technologies, I am always eager to grow and contribute to impactful projects.`,
    ],
    instagram: "https://www.instagram.com/lucas.rubo/",
    linkedin: "https://www.linkedin.com/in/lucas-rubo/",
    github: "https://github.com/lucasrubo",
  },

  services: [
    {
      icon: "./images/icon-design.svg",
      title: "Front-End Development",
      description:
        "Modern web apps with React, TypeScript, Blazor – fast, scalable, user-friendly.",
    },
    {
      icon: "./images/icon-dev.svg",
      title: "Web development",
      description:
        "End-to-end solutions: APIs, databases, and dynamic interfaces.",
    },
    {
      icon: "./images/icon-app.svg",
      title: "Cross-Platform Applications",
      description: "iOS, Android & web apps with native performance.",
    },
  ],
  resume: {
    education: [
      {
        title: "Paulista University (UNIP)",
        period: "2019 — 2023",
        description:
          "Bachelor's degree in Computer Science, with a focus on algorithms, programming, and software development. Actively participated in academic projects aimed at innovation and technology.",
      },
      {
        title: "SENAI São Paulo",
        period: "2017 — 2019",
        description:
          "Completed technical course in Computer Science and IT. Emphasis on development with C#, Git, databases, and programming logic fundamentals.",
      },
    ],
    experience: [
      {
        title: "Junior Development Analyst B",
        company: "Areco",
        period: "2024 — Present",
        description:
          "Development of complementary systems using C# with Blazor. Integrations with Delphi, PHP, and SQL in a hybrid environment at Areco Sistemas Empresariais.",
      },
      {
        title: "Junior Developer",
        company: "Areco",
        period: "2023 — 2024",
        description:
          "Remote work at NB41 Comunicação e Marketing LTDA. Development and maintenance of PHP systems, database modeling, and creation of dynamic interfaces to meet specific demands.",
      },
      {
        title: "Systems Developer (Internship)",
        company: "IBM",
        period: "2021 — 2022",
        description:
          "Remote internship at IBM in the CI/CD area. Pipeline creation, test automation, technical documentation, and script development for continuous integration.",
      },
      {
        title: "Programming Assistant",
        company: "NB41",
        period: "2019 — 2021",
        description:
          "Creation and maintenance of web systems, website development in PHP, and database management at NB41 Comunicação e Marketing LTDA.",
      },
      {
        title: "Programming Intern",
        company: "NB41",
        period: "2019",
        description:
          "Front-end development and support in software tasks, including system maintenance and feature testing.",
      },
    ],
    skills: [
      { name: "C#", value: 90 },
      { name: "Blazor", value: 85 },
      { name: "React", value: 80 },
      { name: "TypeScript", value: 80 },
      { name: "NodeJS", value: 70 },
      { name: "PHP", value: 80 },
      { name: "SQL", value: 80 },
      { name: "JavaScript", value: 70 },
      { name: "Git", value: 75 },
      { name: "CI/CD (Jenkins)", value: 65 },
      { name: "HTML/CSS", value: 70 },
      { name: "PowerShell", value: 60 },
      { name: "WPF", value: 55 },
      { name: "Delphi", value: 55 },
    ],
  },

  certificates: [
    {
      name: "ASP.NET Core Enterprise Applications",
      issuer: "desenvolvedor.io",
      type: "Web Development",
      issueDate: "Feb 2025",
      credentialId: "ab2e42c7-09a6-48dc-ae2d-72557295ea59",
      url: "https://desenvolvedor.io/certificado/ab2e42c7-09a6-48dc-ae2d-72557295ea59",
    },
    {
      name: "Mastering ASP.NET Core MVC",
      issuer: "desenvolvedor.io",
      type: "Web Development",
      issueDate: "Feb 2025",
      credentialId: "9a2fbf67-cd5e-456c-bf5a-7fffad43d18f",
      url: "https://desenvolvedor.io/certificado/9a2fbf67-cd5e-456c-bf5a-7fffad43d18f",
    },
    {
      name: "Data Access Expert Training",
      issuer: "desenvolvedor.io",
      type: "Database",
      issueDate: "Feb 2025",
      credentialId: "77852047-d43e-453e-b520-b95a491a1d3f",
      url: "https://desenvolvedor.io/certificado/77852047-d43e-453e-b520-b95a491a1d3f",
    },
    {
      name: ".NET Full Stack Developer Training",
      issuer: "desenvolvedor.io",
      type: "Web Development",
      issueDate: "Feb 2025",
      credentialId: "1fc502b9-f3b8-46fb-b0a5-4264daa15bcb",
      url: "https://desenvolvedor.io/certificado/1fc502b9-f3b8-46fb-b0a5-4264daa15bcb",
    },
    {
      name: "Software Architecture Fundamentals",
      issuer: "desenvolvedor.io",
      type: "Architecture",
      issueDate: "Feb 2025",
      credentialId: "c92ede62-4a94-41a9-b953-587861373598",
      url: "https://desenvolvedor.io/certificado/c92ede62-4a94-41a9-b953-587861373598",
    },
    {
      name: "Professional Programming with Clean Code",
      issuer: "desenvolvedor.io",
      type: "Best Practices",
      issueDate: "Feb 2025",
      credentialId: "55f6e819-97f2-4382-a803-f96b1ee477dd",
      url: "https://desenvolvedor.io/certificado/55f6e819-97f2-4382-a803-f96b1ee477dd",
    },
    {
      name: "Designing Three-Layer Architectures",
      issuer: "desenvolvedor.io",
      type: "Architecture",
      issueDate: "Feb 2025",
      credentialId: "4fd18ea1-b1a2-4b50-9d88-e18f3678ed96",
      url: "https://desenvolvedor.io/certificado/4fd18ea1-b1a2-4b50-9d88-e18f3678ed96",
    },
    {
      name: "SQL for Developers",
      issuer: "desenvolvedor.io",
      type: "Database",
      issueDate: "Feb 2025",
      credentialId: "fbf539be-d93f-459c-aff3-d90b02daf2d2",
      url: "https://desenvolvedor.io/certificado/fbf539be-d93f-459c-aff3-d90b02daf2d2",
    },
    {
      name: "Mastering Entity Framework Core",
      issuer: "desenvolvedor.io",
      type: "Database",
      issueDate: "Jan 2025",
      credentialId: "e0e9520b-24f6-4e8e-baf0-5f32c54c96fe",
      url: "https://desenvolvedor.io/certificado/e0e9520b-24f6-4e8e-baf0-5f32c54c96fe",
    },
    {
      name: "REST with ASP.NET Core WebAPI",
      issuer: "desenvolvedor.io",
      type: "Web Development",
      issueDate: "Jan 2025",
      credentialId: "cf2e347e-d25a-4fe4-9811-6e71fbf40f46",
      url: "https://desenvolvedor.io/certificado/cf2e347e-d25a-4fe4-9811-6e71fbf40f46",
    },
    {
      name: ".NET Developer Training",
      issuer: "desenvolvedor.io",
      type: "Web Development",
      issueDate: "Dec 2024",
      credentialId: "9adf6fb3-23a0-4aa1-a497-4676c0b7437a",
      url: "https://desenvolvedor.io/certificado/9adf6fb3-23a0-4aa1-a497-4676c0b7437a",
    },
    {
      name: "APIs Fundamentals in ASP.NET Core",
      issuer: "desenvolvedor.io",
      type: "Web Development",
      issueDate: "Dec 2024",
      credentialId: "98470ba0-3f05-433a-bb3d-faad6203e1bb",
      url: "https://desenvolvedor.io/certificado/98470ba0-3f05-433a-bb3d-faad6203e1bb",
    },
    {
      name: "Blazor Fundamentals",
      issuer: "desenvolvedor.io",
      type: "Web Development",
      issueDate: "Dec 2024",
      credentialId: "e9cbb0e3-bf29-41e2-9c9f-843e1f1e0a97",
      url: "https://desenvolvedor.io/certificado/e9cbb0e3-bf29-41e2-9c9f-843e1f1e0a97",
    },
    {
      name: "Introduction to Entity Framework Core",
      issuer: "desenvolvedor.io",
      type: "Database",
      issueDate: "Dec 2024",
      credentialId: "3c16a65f-d8fc-4b79-b900-47987a705174",
      url: "https://desenvolvedor.io/certificado/3c16a65f-d8fc-4b79-b900-47987a705174",
    },
    {
      name: "ASP.NET MVC Fundamentals",
      issuer: "desenvolvedor.io",
      type: "Web Development",
      issueDate: "Sep 2024",
      credentialId: "2848bef3-957b-4575-b52b-afcdb40e6cb6",
      url: "https://desenvolvedor.io/certificado/2848bef3-957b-4575-b52b-afcdb40e6cb6",
    },
    {
      name: "C# Fundamentals",
      issuer: "desenvolvedor.io",
      type: "Programming",
      issueDate: "Sep 2024",
      credentialId: "825cd238-dbe9-40d3-b344-4bc6074d5f80",
      url: "https://desenvolvedor.io/certificado/825cd238-dbe9-40d3-b344-4bc6074d5f80",
    },
    {
      name: "Getting Started with ASP.NET Core",
      issuer: "desenvolvedor.io",
      type: "Web Development",
      issueDate: "Sep 2024",
      credentialId: "11351ec3-bf2a-417b-a81c-4319a6be4c60",
      url: "https://desenvolvedor.io/certificado/11351ec3-bf2a-417b-a81c-4319a6be4c60",
    },
    {
      name: "DevOps Project - 2022: CI/CD with Jenkins Ansible Kubernetes",
      issuer: "Udemy",
      type: "DevOps",
      issueDate: "Oct 2022",
      credentialId: "UC-065c45ab-bb1b-4904-8737-fb510cbb5630",
      url: "https://www.udemy.com/certificate/UC-065c45ab-bb1b-4904-8737-fb510cbb5630/",
    },
    {
      name: "JavaScript from Basic to Advanced (with Node.js and projects)",
      issuer: "Udemy",
      type: "Programming",
      issueDate: "Oct 2022",
      credentialId: "UC-38fd00fe-0b73-4564-8322-219371e04804",
      url: "https://www.udemy.com/certificate/UC-38fd00fe-0b73-4564-8322-219371e04804/",
    },
    {
      name: "Python 3 Course from Basic to Advanced (with real projects)",
      issuer: "Udemy",
      type: "Programming",
      issueDate: "Sep 2022",
      credentialId: "UC-af83d567-aa2b-4796-8bc3-2c58a4f07bba",
      url: "https://www.udemy.com/certificate/UC-af83d567-aa2b-4796-8bc3-2c58a4f07bba/",
    },
    {
      name: "Clean Code",
      issuer: "Udemy",
      type: "Best Practices",
      issueDate: "Jul 2022",
      credentialId: "UC-0d026173-2ed7-468f-93cf-9fa08606ffac",
      url: "https://www.udemy.com/certificate/UC-0d026173-2ed7-468f-93cf-9fa08606ffac/",
    },
  ],

  contact: {
    title: "Contact",
    form: "Contact Form",
    buttonSend: "Send Message",
    location:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d58768.43300337679!2d-47.01880025!3d-22.986032299999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94c8cdaee7763fcf%3A0x382e43ff2cf3dd00!2sValinhos%2C%20SP%2C%2013274-465!5e0!3m2!1spt-BR!2sbr!4v1750898025689!5m2!1spt-BR!2sb",
  },
};

export default profile;
