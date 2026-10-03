export const profile = {
  name: 'Annu Mudgal',
  headline: 'Software Engineer | Web Developer | Innovator',
  summary:
    'I engineer scalable, user-centric web solutions with robust code and cutting-edge technologies. Let’s drive impactful innovation.',
  location: 'Bahadurgarh, Haryana, India',
  email: 'akshitmudgal001@gmail.com',
  phone: '+91 85068 50066',
  resumeUrl: '/resume.pdf',
  socials: {
    github: 'https://github.com/annumudgal001',
    linkedin: 'https://www.linkedin.com/in/annumudgal001/',
    leetcode: 'https://leetcode.com/u/AkshitMudgal001',
    twitter: 'https://twitter.com/annumudgal001',
    instagram: 'https://www.instagram.com/akshit_mudgal_/',
  },

  // Shown one by one in the hero. Add, remove or reword freely (10-20 works best).
  jargon: [
    'Turning coffee into REST APIs',
    "Fluent in 404, 500 and 'works on my machine'",
    'Debugging with console.log, like a professional',
    "git commit -m 'final_final_v2_REAL'",
    'Centering divs, one miracle at a time',
    'Sleeping is just a long-running async task',
    'Refactoring the refactor of the refactor',
    'Pushing to main… responsibly (mostly)',
    'Optimizing O(n²) into O(why-not)',
    'Converting caffeine into semicolons',
    'Rubber-duck debugging with a very patient duck',
    'Handling every exception except my own',
    'Turning bugs into undocumented features',
    'Promise.resolve(coffee).then(code)',
    'Fluent in JSON, YAML and mild sarcasm',
    'Deploying on a Friday. Living dangerously.',
    'Copy, paste, understand. In that order. Mostly.',
    'while (!bug.fixed) { coffee++; }',
  ],

  experience: [
    {
      company: 'iTech Mission Private Limited',
      role: 'Solutions Developer',
      type: 'Full-time',
      period: 'Sep 2026 – Present',
      location: '',
      industry: '',
      summary: 'Working full-time as a Solutions Developer, building and delivering software solutions.',
      logo: '/images/logos/itm.jpg',
      current: true,
    },
    {
      company: 'Infosys',
      role: 'Software Developer Intern',
      type: 'Internship',
      period: 'July 2025 – July 2026',
      location: 'Chandigarh',
      industry: 'Software Development',
      summary:
        'Worked on scalable full-stack applications, including an e-commerce proof of concept, delivering client-focused solutions with optimized APIs.',
      logo: '/images/logos/infosys.svg',
    },
    {
      company: 'Byld Group',
      role: 'Apprentice Web Developer (MERN)',
      type: 'Apprenticeship',
      period: 'Jan 2025 – July 2025',
      location: 'Gurugram',
      industry: 'Software Development',
      summary:
        'Streamlined scalable MERN stack applications, delivering client-focused solutions with optimized APIs.',
      logo: '/images/logos/byld.png',
    },
    {
      company: 'K.R. Mangalam University',
      role: 'AI/ML Intern',
      type: 'Internship',
      period: 'July 2024 – Aug 2024',
      location: 'Gurugram',
      industry: 'AI/ML',
      summary:
        'Engineered ML models with Python and TensorFlow, advancing research-driven AI solutions.',
      logo: '/images/logos/krmu.jpg',
    },
  ],

  education: [
    {
      degree: 'Master of Computer Applications',
      institution: 'KRMU, Gurugram',
      period: '2023 – 2025',
      score: '7.82 CGPA',
      logo: '/images/logos/krmu.jpg',
      coursework: ['Scalable Web Architectures', 'AI-Driven Solutions', 'Cloud Computing'],
      summary: 'Mastered advanced full-stack and AI technologies for impactful software solutions.',
    },
    {
      degree: 'Bachelor of Computer Applications',
      institution: 'MDU, Rohtak',
      period: '2020 – Aug 2023',
      score: '70% (~7.0 CGPA)',
      logo: '/images/logos/mdu.jpg',
      coursework: ['Modern Web Technologies', 'Data Optimization'],
      summary: 'Built a robust foundation in programming and web development.',
    },
  ],

  skillGroups: [
    {
      category: 'Front-End Development',
      items: [
        { name: 'HTML5', description: 'Semantic, accessible, well-structured pages.' },
        { name: 'CSS3 / SCSS', description: 'Responsive layouts with Flexbox, Grid and CSS variables.' },
        { name: 'Bootstrap', description: 'Fast responsive UIs with the grid and components.' },
        { name: 'Tailwind CSS', description: 'Utility-first design for flexible, efficient UIs.' },
        { name: 'React', description: 'Single-page apps with Redux and Context API.' },
        { name: 'Material UI', description: 'Consistent, polished interfaces with MUI.' },
      ],
    },
    {
      category: 'Back-End Development',
      items: [
        { name: 'Node.js', description: 'Scalable, efficient server-side applications.' },
        { name: 'Express.js', description: 'RESTful APIs and server-side logic.' },
        { name: 'MongoDB', description: 'Mongoose ODM, CRUD operations and data modeling.' },
        { name: 'Authentication', description: 'JWT login, role-based access and password resets.' },
      ],
    },
    {
      category: 'Full-Stack & Tools',
      items: [
        { name: 'Databases', description: 'SQL and NoSQL: MySQL, MongoDB, PostgreSQL.' },
        { name: 'Cloud Services', description: 'Deploying on AWS, Heroku and DigitalOcean.' },
        { name: 'Git & GitHub', description: 'Version control and collaboration.' },
        { name: 'Unit & Integration Testing', description: 'Jest and Mocha test suites.' },
      ],
    },
    {
      category: 'Core Skills',
      items: [
        { name: 'Analytical Thinking', description: 'Breaking complex problems into solvable parts.' },
        { name: 'Problem Solving', description: 'Creative, efficient solutions to technical challenges.' },
        { name: 'Team Collaboration', description: 'Clear communication in collaborative teams.' },
      ],
    },
    {
      category: 'Also working with',
      items: [
        { name: 'Angular', description: 'Building this portfolio with standalone components and signals.' },
        { name: 'Java & Spring Boot', description: 'Backend for my e-commerce project.' },
        { name: 'MySQL', description: 'Relational data modeling for the e-commerce project.' },
        { name: 'Selenium & TestNG', description: 'Page Object Model test automation.' },
      ],
    },
  ],

  services: [
    {
      title: 'Full-Stack Web Development',
      description:
        'End-to-end web apps with the MERN and MEAN stacks: responsive frontends, Express APIs and MongoDB data models.',
      icon: 'faSolidLaptopCode',
      tags: ['React', 'Angular', 'Node.js', 'MongoDB'],
    },
    {
      title: 'Freelance Web Projects',
      description:
        'Dynamic, responsive websites for individuals and small businesses using React, Node.js and Tailwind CSS.',
      icon: 'faSolidRocket',
      tags: ['Websites', 'Landing pages', 'Portfolios'],
    },
    {
      title: 'UI Engineering & Motion',
      description:
        'Pixel-careful interfaces with design systems, dark and light themes, accessibility and smooth micro-interactions.',
      icon: 'faSolidPalette',
      tags: ['SCSS', 'Animations', 'Accessibility'],
    },
    {
      title: 'REST API Design & Security',
      description:
        'Clean REST APIs with JWT authentication, validation, rate limiting and secure defaults.',
      icon: 'faSolidServer',
      tags: ['Express', 'JWT', 'Validation'],
    },
    {
      title: 'Database Design & Optimization',
      description:
        'Schema design, indexing and query tuning for MongoDB and SQL databases.',
      icon: 'faSolidDatabase',
      tags: ['MongoDB', 'MySQL', 'Modeling'],
    },
    {
      title: 'AI & Automation Integrations',
      description:
        'Python and TensorFlow experiments, smart assistants and AI-powered features wired into web apps.',
      icon: 'faSolidRobot',
      tags: ['Python', 'TensorFlow', 'Assistants'],
    },
    {
      title: 'Performance & Technical SEO',
      description:
        'Core Web Vitals, lazy loading, semantic markup and on-page SEO for faster, more discoverable sites.',
      icon: 'faSolidBolt',
      tags: ['Lighthouse', 'SEO', 'Speed'],
    },
    {
      title: 'Testing & Quality Assurance',
      description:
        'Functional, performance and security testing, plus automated suites with Jest and Mocha.',
      icon: 'faSolidBug',
      tags: ['Jest', 'Mocha', 'Manual QA'],
    },
    {
      title: 'Cloud Deployment & CI/CD Basics',
      description:
        'Shipping apps to cloud platforms with Git-based workflows and automated pipelines.',
      icon: 'faSolidCloud',
      tags: ['AWS', 'Git', 'Pipelines'],
    },
    {
      title: 'Team Collaboration',
      description:
        'Agile delivery, code reviews and clean version control for scalable, maintainable applications.',
      icon: 'faSolidUsers',
      tags: ['Agile', 'Code review', 'Git'],
    },
  ],

  certifications: [
    {
      title: 'Data Structures and Algorithms using Python – Part 1',
      issuer: 'Infosys Springboard',
      image: '/images/certificates/dsa-1.png',
    },
    {
      title: 'Database Management System – Part 1',
      issuer: 'Infosys Springboard',
      image: '/images/certificates/dbms-1.png',
    },
    {
      title: 'Database Management System – Part 2',
      issuer: 'Infosys Springboard',
      image: '/images/certificates/dbms-2.png',
    },
    {
      title: 'Programming using Java',
      issuer: 'Infosys Springboard',
      image: '/images/certificates/java.png',
    },
    {
      title: 'Object Oriented Programming using Python',
      issuer: 'Infosys Springboard',
      image: '/images/certificates/oops-python.png',
    },
  ],

  testimonials: [
    {
      quote:
        'Annu’s expertise in MERN development at Byld Group is exceptional. He streamlines workflows, delivering scalable, high-quality solutions.',
      author: 'Asheesh Kumar',
      role: 'Reporting Manager, Byld Group',
    },
    {
      quote:
        'Annu demonstrated technical excellence during his AI/ML internship at KRMU, contributing innovative models to our research.',
      author: 'Rupesh Kumar Tipu',
      role: 'Research Faculty, KRMU',
    },
    {
      quote:
        'Annu’s rapid learning and advanced skills shone in Hack KRMU 2.0. His Python-powered virtual assistant secured us a top 50 spot.',
      author: 'Keshav Sharma',
      role: 'Colleague & Hackathon Teammate',
    },
  ],

  quotes: [
    {
      title: 'Always Building, Always Growing',
      text: 'A developer is never done—every line of code is a step toward something greater.',
    },
    {
      title: 'Forever a Student',
      text: 'Learning never stops—every challenge is a chance to grow.',
    },
  ],
};

export const projects = [
  {
    title: 'E-Commerce Platform',
    slug: 'e-commerce-platform',
    description:
      'Full-stack e-commerce platform built during an Infosys proof of concept, with secure authentication, role-based access and reliable checkout.',
    details:
      'Built as a proof of concept during my Infosys internship. It has a Spring Boot REST backend with MySQL, a React (Vite) storefront with an admin side, and a separate Selenium test suite that checks the main user journeys end to end.',
    highlights: [
      'JWT authentication with role-based access control (admin and user)',
      'Atomic checkout transactions, so an order is saved completely or not at all',
      'Soft-deleted products, so catalogue history is never lost',
      'Price snapshots in order history, so old orders keep the price paid',
      'Gmail-based OTP password reset',
      'Selenium WebDriver and TestNG automation using the Page Object Model',
    ],
    technologies: ['Java', 'Spring Boot', 'React', 'Vite', 'MySQL', 'JWT', 'Selenium', 'TestNG'],
    thumbnail: '',
    repoUrl: 'https://github.com/annumudgal001/ecommerce-project',
    liveUrl: '',
    featured: true,
    order: 1,
  },
  {
    title: 'MEAN Stack Portfolio',
    slug: 'mean-stack-portfolio',
    description:
      'This site: an Angular frontend, a layered Express API and MongoDB Atlas, with light, dark and terminal themes.',
    details:
      'A full-stack personal portfolio. Content is stored in MongoDB and served by an Express API that is split into routes, controllers, services and models. The Angular frontend loads each page on demand.',
    highlights: [
      'Layered backend: routes, controllers, services and models',
      'Three themes: light, dark and an interactive terminal mode',
      'Contact and review forms validated on both the client and the server',
      'Scroll animations, sliders and a responsive dock navigation',
    ],
    technologies: ['MongoDB', 'Express', 'Angular', 'Node.js'],
    thumbnail: '',
    repoUrl: 'https://github.com/annumudgal001/AProject',
    liveUrl: '',
    featured: true,
    order: 2,
  },
  {
    title: 'WorldAtlas-Annu',
    slug: 'worldatlas-annu',
    description:
      'Interactive world atlas built with React and Vite, featuring a modern UI for exploring geographical data.',
    details:
      'An interactive atlas for exploring countries and geographical data, built with React and Vite and deployed on Netlify.',
    highlights: [
      'Modern, responsive interface for browsing country data',
      'Built with React and Vite for fast loading',
    ],
    technologies: ['React', 'Vite', 'REST API'],
    thumbnail: '/images/projects/worldatlas.png',
    repoUrl: 'https://github.com/annumudgal001/WorldAtlas-Annu',
    liveUrl: 'https://worldatlas-annu.netlify.app/',
    featured: true,
    order: 3,
  },
  {
    title: 'BlogAPI',
    slug: 'blogapi',
    description: 'RESTful blog API built with Node.js, Express and MongoDB.',
    details:
      'A REST API for managing blog content, built with Node.js, Express and MongoDB and deployed on Render.',
    highlights: [
      'Clean REST routes built with Express',
      'MongoDB for data storage',
      'Publicly deployed on Render',
    ],
    technologies: ['Node.js', 'Express', 'MongoDB'],
    thumbnail: '/images/projects/blogapi.png',
    repoUrl: 'https://github.com/annumudgal001/BlogAPI',
    liveUrl: 'https://annu-blogapi.onrender.com/',
    featured: true,
    order: 4,
  },
  {
    title: 'NOVA-Smart-Solution',
    slug: 'nova-smart-solution',
    description:
      'Python-based virtual assistant that streamlines desktop automation and boosts productivity in professional, academic and IT environments.',
    details:
      'Nova is a Python virtual assistant built with PyQt5 and AI APIs. It was built for Hack KRMU 2.0, where it secured a top 50 spot.',
    highlights: [
      'Desktop automation to save time on repetitive tasks',
      'PyQt5 desktop interface with AI API integration',
      'Top 50 finish at Hack KRMU 2.0',
    ],
    technologies: ['Python', 'PyQt5', 'AI APIs'],
    thumbnail: '/images/projects/nova.png',
    repoUrl: 'https://github.com/annumudgal001/NOVA-Smart-Solution',
    liveUrl: '',
    featured: true,
    order: 5,
  },
  {
    title: 'Authflow',
    slug: 'authflow',
    description:
      'Secure authentication system with user registration, JWT login, password resets, role-based access and email integration.',
    details:
      'A reusable authentication backend for modern web apps, built with Node.js and Express.',
    highlights: [
      'User registration and JWT-based login',
      'Password reset flow with email integration',
      'Role-based access control',
    ],
    technologies: ['Node.js', 'Express', 'JWT'],
    thumbnail: '',
    repoUrl: 'https://github.com/annumudgal001/Authflow',
    liveUrl: '',
    featured: false,
    order: 6,
  },
  {
    title: 'NeuraUser',
    slug: 'neurauser',
    description:
      'Authentication, file upload and CRUD system built with Node.js, Express, MongoDB and EJS.',
    details:
      'A user management application with sign-in, file uploads and create, view, edit and delete operations.',
    highlights: [
      'User authentication',
      'File upload support',
      'Full CRUD for managing users',
    ],
    technologies: ['Node.js', 'Express', 'MongoDB', 'EJS'],
    thumbnail: '/images/projects/neurauser.png',
    repoUrl: 'https://github.com/annumudgal001/NeuraUser',
    liveUrl: '',
    featured: false,
    order: 7,
  },
  {
    title: 'LiveTrack',
    slug: 'livetrack',
    description:
      'Real-time collaborative mapping system using WebSockets. Track multiple users simultaneously with live updates.',
    details:
      'A live location tracking app built with Node.js, Socket.io and Leaflet.js, where several users appear on a shared map in real time.',
    highlights: [
      'Real-time updates over WebSockets',
      'Track multiple users at once on a shared map',
      'Built with Node.js, Socket.io and Leaflet.js',
    ],
    technologies: ['Node.js', 'Socket.io', 'Leaflet.js'],
    thumbnail: '/images/projects/livetrack.png',
    repoUrl: 'https://github.com/annumudgal001/LiveTrack',
    liveUrl: '',
    featured: false,
    order: 8,
  },
];
