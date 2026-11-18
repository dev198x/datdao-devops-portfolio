export const HERO_CONTENT = "Full-stack engineer building AI-powered applications and running them on reliable cloud platforms. From Node.js and React to RAG and AI agents, AWS, Kubernetes, and observability with Prometheus and Grafana, I take systems from code to production.";

export const ABOUT_TEXT = "I design, automate, and operate reliable cloud platforms that enable teams to deliver software efficiently and at scale. My journey began with software development before evolving into Cloud, DevOps, and Site Reliability Engineering, where I focus on building scalable infrastructure, automating operations, and improving system reliability. I work extensively across AWS and Google Cloud Platform (GCP), leveraging Terraform, Kubernetes, Docker, and CI/CD pipelines to deliver secure and resilient environments. My experience includes cloud networking, load balancing, Cloud Armor security policies, DDoS protection, private connectivity across projects, infrastructure automation, observability, and performance monitoring. Using tools such as Jenkins, GitHub Actions, GitLab CI/CD, Prometheus, Grafana, Dynatrace, Site24x7, and Bash scripting, I help organizations improve reliability, reduce operational overhead, and accelerate software delivery.";

export const SKILLS = [
  // Cloud
  {
    name: "AWS",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original.svg",
    category: "cloud",
    level: 90,
  },
  {
    name: "Google Cloud",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/googlecloud/googlecloud-original.svg",
    category: "cloud",
    level: 20,
  },
  {
    name: "AWS Compute (EC2, ECS, Lambda)",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original.svg",
    category: "cloud",
    level: 85,
  },
  {
    name: "AWS Storage & Database (S3, CloudFront, RDS)",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original.svg",
    category: "cloud",
    level: 85,
  },
  {
    name: "AWS Networking (VPC, Route53)",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original.svg",
    category: "cloud",
    level: 80,
  },
  {
    name: "AWS Messaging (SQS, SES)",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original.svg",
    category: "cloud",
    level: 75,
  },

  // Containers
  {
    name: "Docker",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg",
    category: "containers",
    level: 90,
  },
  {
    name: "Kubernetes",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kubernetes/kubernetes-plain.svg",
    category: "containers",
    level: 20,
  },

  // Infrastructure
  {
    name: "Terraform",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/terraform/terraform-original.svg",
    category: "infrastructure",
    level: 90,
  },
  {
    name: "Ansible",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/ansible/ansible-original-wordmark.svg",
    category: "infrastructure",
    level: 90,
  },
  {
    name: "AWS CloudFormation",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original.svg",
    category: "infrastructure",
    level: 80,
  },

  // DevOps / SRE
  {
    name: "Linux",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-plain.svg",
    category: "devops",
    level: 90,
  },
  // {
  //   name: "Jenkins",
  //   icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jenkins/jenkins-plain.svg",
  //   category: "devops",
  //   level: 90,
  // },
  {
    name: "GitHub Actions",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg",
    category: "devops",
    level: 90,
  },
  // {
  //   name: "GitLab CI",
  //   icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/gitlab/gitlab-original.svg",
  //   category: "devops",
  //   level: 90,
  // },
  {
    name: "Git",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg",
    category: "devops",
    level: 90,
  },
  {
    name: "AWS CodePipeline",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original.svg",
    category: "devops",
    level: 70,
  },
  {
    name: "AWS CodeBuild",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original.svg",
    category: "devops",
    level: 80,
  },
  {
    name: "Prometheus",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/prometheus/prometheus-original.svg",
    category: "devops",
    level: 80,
  },
  {
    name: "Grafana",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/grafana/grafana-original.svg",
    category: "devops",
    level: 80,
  },
  // {
  //   name: "Dynatrace",
  //   icon: "https://cdn.simpleicons.org/dynatrace",
  //   category: "devops",
  //   level: 90,
  // },
  {
    name: "Bash Scripting",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bash/bash-original.svg",
    category: "devops",
    level: 90,
  },

  // AI
  {
    name: "AI Agents",
    icon: "data:image/svg+xml,%3Csvg%20xmlns=%22http://www.w3.org/2000/svg%22%20viewBox=%220%200%2024%2024%22%20fill=%22none%22%20stroke=%22%2322c55e%22%20stroke-width=%221.8%22%20stroke-linecap=%22round%22%20stroke-linejoin=%22round%22%3E%3Crect%20x=%224%22%20y=%228%22%20width=%2216%22%20height=%2212%22%20rx=%222%22/%3E%3Cpath%20d=%22M12%208V4%22/%3E%3Ccircle%20cx=%2212%22%20cy=%223%22%20r=%221%22/%3E%3Ccircle%20cx=%229%22%20cy=%2214%22%20r=%221.2%22/%3E%3Ccircle%20cx=%2215%22%20cy=%2214%22%20r=%221.2%22/%3E%3Cpath%20d=%22M9%2017.5h6M2%2013v3M22%2013v3%22/%3E%3C/svg%3E",
    category: "ai",
    level: 70,
  },
  {
    name: "Retrieval-Augmented Generation (RAG)",
    icon: "data:image/svg+xml,%3Csvg%20xmlns=%22http://www.w3.org/2000/svg%22%20viewBox=%220%200%2024%2024%22%20fill=%22none%22%20stroke=%22%2322c55e%22%20stroke-width=%221.8%22%20stroke-linecap=%22round%22%20stroke-linejoin=%22round%22%3E%3Crect%20x=%224%22%20y=%228%22%20width=%2216%22%20height=%2212%22%20rx=%222%22/%3E%3Cpath%20d=%22M12%208V4%22/%3E%3Ccircle%20cx=%2212%22%20cy=%223%22%20r=%221%22/%3E%3Ccircle%20cx=%229%22%20cy=%2214%22%20r=%221.2%22/%3E%3Ccircle%20cx=%2215%22%20cy=%2214%22%20r=%221.2%22/%3E%3Cpath%20d=%22M9%2017.5h6M2%2013v3M22%2013v3%22/%3E%3C/svg%3E",
    category: "ai",
    level: 50,
  },
  {
    name: "AI Agents & Tool Calling",
    icon: "data:image/svg+xml,%3Csvg%20xmlns=%22http://www.w3.org/2000/svg%22%20viewBox=%220%200%2024%2024%22%20fill=%22none%22%20stroke=%22%2322c55e%22%20stroke-width=%221.8%22%20stroke-linecap=%22round%22%20stroke-linejoin=%22round%22%3E%3Crect%20x=%224%22%20y=%228%22%20width=%2216%22%20height=%2212%22%20rx=%222%22/%3E%3Cpath%20d=%22M12%208V4%22/%3E%3Ccircle%20cx=%2212%22%20cy=%223%22%20r=%221%22/%3E%3Ccircle%20cx=%229%22%20cy=%2214%22%20r=%221.2%22/%3E%3Ccircle%20cx=%2215%22%20cy=%2214%22%20r=%221.2%22/%3E%3Cpath%20d=%22M9%2017.5h6M2%2013v3M22%2013v3%22/%3E%3C/svg%3E",
    category: "ai",
    level: 80,
  },
  {
    name: "Observability & Evals",
    icon: "data:image/svg+xml,%3Csvg%20xmlns=%22http://www.w3.org/2000/svg%22%20viewBox=%220%200%2024%2024%22%20fill=%22none%22%20stroke=%22%2322c55e%22%20stroke-width=%221.8%22%20stroke-linecap=%22round%22%20stroke-linejoin=%22round%22%3E%3Crect%20x=%224%22%20y=%228%22%20width=%2216%22%20height=%2212%22%20rx=%222%22/%3E%3Cpath%20d=%22M12%208V4%22/%3E%3Ccircle%20cx=%2212%22%20cy=%223%22%20r=%221%22/%3E%3Ccircle%20cx=%229%22%20cy=%2214%22%20r=%221.2%22/%3E%3Ccircle%20cx=%2215%22%20cy=%2214%22%20r=%221.2%22/%3E%3Cpath%20d=%22M9%2017.5h6M2%2013v3M22%2013v3%22/%3E%3C/svg%3E",
    category: "ai",
    level: 70,
  },

  // Development
  {
    name: "Python",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
    category: "development",
    level: 70,
  },
  {
    name: "PHP",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg",
    category: "development",
    level: 70,
  },
  {
    name: "JavaScript",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-plain.svg",
    category: "development",
    level: 90,
  },
  {
    name: "Typescript",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg",
    category: "development",
    level: 90,
  },
  {
    name: "Node.js",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-plain.svg",
    category: "development",
    level: 90,
  },
  {
    name: "React",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
    category: "development",
    level: 70,
  },

  // Databases
  {
    name: "MongoDB",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg",
    category: "database",
    level: 90,
  },
  {
    name: "MySQL",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg",
    category: "database",
    level: 90,
  },
  {
    name: "PostgreSQL",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg",
    category: "database",
    level: 90,
  },
  {
    name: "Redis",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redis/redis-original.svg",
    category: "database",
    level: 70,
  },
];

export const PROJECTS = [
  {
    title: 'Customer Support Chatbot — RAG + LLM',
    image: '/images/chatbot-cskh.svg',
    description: 'Chatbot chăm sóc khách hàng cho cửa hàng điện tử: trả lời câu hỏi về chính sách (giao hàng, bảo hành, đổi trả) bằng RAG và giúp khách đã đăng nhập tra cứu đơn hàng của chính họ qua tool calling. Quan sát toàn bộ luồng bằng OpenTelemetry: log và span gửi qua OTel Collector (xoá header nhạy cảm, gom lô) vào grafana/otel-lgtm (Loki, Tempo, Prometheus, Grafana dashboard).',
    technologies: ['RAG', 'LLM', 'Tool Calling', 'OpenTelemetry', 'Grafana', 'Loki', 'Tempo', 'Prometheus'],
    category: 'fullstack',
    githubLink: '',
    websiteLink: '',
  },
  {
    title: 'Booking online - EKS && GihubActions',
    image: '/images/booking-online.webp',
    description: 'Deployed a production-grade booking online on AWS EKS with helm. Integrated CI/CD pipelines using GitHub Actions, containerized microservices with Docker.',
    technologies: ['AWS EKS', 'Kubernetes', 'Helm', 'GitHub Actions', 'Docker', 'Full-Stack'],
    category: 'devops',
    githubLink: '',
    websiteLink: '',
  },
  {
    title: 'Next.js CI/CD Pipeline with Docker & Kubernetes',
    image: '/images/cicd-k8s.webp',
    description: 'Developed and containerized a Next.js application, deploying it to Kubernetes clusters using GitHub Actions for automated CI/CD. Implemented multi-stage Docker builds, health probes, resource limits, and rolling updates for high availability.',
    technologies: ['Next.js', 'Docker', 'Kubernetes', 'GitHub Actions', 'GHCR'],
    category: 'devops',
    githubLink: '',
    websiteLink: '',
  },
  {
    title: 'Realtime Chat App — MERN + Socket.IO',
    image: '/images/todo-webapp.webp',
    description: 'Developed a real-time chat application using the MERN stack with Socket.IO for instant communication. Implemented custom hooks for efficient state management. Deployed behind Nginx as a reverse proxy, Dockerized for deployment.',
    technologies: ['React', 'Node', 'Express', 'MongoDB', 'Socket.IO', 'Nginx', 'Docker'],
    category: 'fullstack',
    githubLink: '',
    websiteLink: '',
  },
  {
    title: 'Cloud Infrastructure Automation',
    image: '/images/terraform-aws.webp',
    description: 'Automated AWS infrastructure provisioning using Terraform with reusable modules for EC2, VPC, and S3. Integrated CI/CD with GitHub Actions for continuous deployment of cloud environments.',
    technologies: ['AWS', 'Terraform', 'GitHub Actions', 'EC2', 'S3'],
    category: 'devops',
    githubLink: '',
    websiteLink: '',
  },
  {
    title: 'Shaire Salon using ParsePlatform/ReactJS',
    image: '/images/shaire-salon.webp',
    description: 'Built Shaire Salon on Parse Platform and React, with MongoDB and Redis for data and caching, Firebase for auxiliary services, and a production deployment on AWS EC2 behind Nginx, backed by S3 and CloudFront for static asset delivery.',
    technologies: ['ParsePlatform', 'ReactJS', 'MongoDB', 'Redis', 'Firebase', 'EC2', 'Nginx', 'S3', 'CloudFront'],
    category: 'fullstack',
    githubLink: '',
    websiteLink: '',
  },
  {
    title: 'Wine Auction using Symfony/MySQL',
    image: '/images/wine-auction.webp',
    description: 'Built a wine auction platform on Symfony with MySQL, deployed on AWS EC2 behind Nginx with S3 for asset storage.',
    technologies: ['Symfony', 'MySQL', 'EC2', 'Nginx', 'S3'],
    category: 'fullstack',
    githubLink: '',
    websiteLink: '',
  },
  {
    title: 'Portfolio Website',
    image: '/images/portfolio-personal.webp',
    description: 'This portfolio site itself — a cyber-terminal-themed single-page app built with React, TypeScript, and Vite, deployed as a static SPA.',
    technologies: ['React', 'TypeScript', 'Vite', 'React Router', 'Tailwind CSS', 'Framer Motion'],
    category: 'fullstack',
    githubLink: '',
    websiteLink: '',
  },
];

export const CONTACT = {
  address: 'Ho Chi Minh City, Vietnam',
  phoneNo: '093-49-24-247',
  email: 'datdaoaws1@gmail.com',
  social: {
    github: 'https://github.com/dev198x',
    linkedin: 'https://www.linkedin.com/in/dat-dao-db-ssa/',
  }
};

export const SKILLS_BY_CATEGORY = {
  cloud: SKILLS.filter(skill => skill.category === 'cloud'),
  containers: SKILLS.filter(skill => skill.category === 'containers'),
  infrastructure: SKILLS.filter(skill => skill.category === 'infrastructure'),
  devops: SKILLS.filter(skill => skill.category === 'devops'),
  ai: SKILLS.filter(skill => skill.category === 'ai'),
  development: SKILLS.filter(skill => skill.category === 'development'),
  database: SKILLS.filter(skill => skill.category === 'database'),
};

export const PROJECTS_BY_CATEGORY = {
  all: PROJECTS,
  devops: PROJECTS.filter(project => project.category === 'devops'),
  fullstack: PROJECTS.filter(project => project.category === 'fullstack'),
};
