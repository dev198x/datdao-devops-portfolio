export const HERO_CONTENT = "Software engineer with 10+ years in backend development, system architecture, and cloud engineering. I build AI-powered engineering solutions, including a production-used observability platform that uses the Claude API with logs and distributed traces to cut incident investigation time by 50–75%, and I run systems on AWS with Terraform, Docker, and GitHub Actions.";

export type SkillLevel = 'expert' | 'advanced' | 'intermediate' | 'beginner';

export interface Skill {
  name: string;
  icon: string;
  category: string;
  level: SkillLevel;
}

export const SKILL_LEVELS: {
  id: SkillLevel;
  group: string;
  label: string;
  dots: number;
  description: string;
}[] = [
  { id: 'expert', group: 'Daily in production', label: 'Expert', dots: 4, description: 'Used every day in production; I can design, operate, and troubleshoot it independently.' },
  { id: 'advanced', group: 'Hands-on', label: 'Advanced', dots: 3, description: 'Regular hands-on use in real projects; comfortable building and debugging with it.' },
  { id: 'intermediate', group: 'Working knowledge', label: 'Intermediate', dots: 2, description: 'Practical experience on specific tasks; I use it with docs and some guidance.' },
  { id: 'beginner', group: 'Learning', label: 'Beginner', dots: 1, description: 'Basic exposure or currently learning; not yet used independently in production.' },
];

export const SKILLS: Skill[] = [
  // Cloud
  {
    name: "AWS",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original.svg",
    category: "cloud",
    level: 'expert',
  },
  {
    name: "Google Cloud",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/googlecloud/googlecloud-original.svg",
    category: "cloud",
    level: 'beginner',
  },
  {
    name: "AWS Compute (EC2, ECS, Lambda)",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original.svg",
    category: "cloud",
    level: 'expert',
  },
  {
    name: "AWS Storage & Database (S3, CloudFront, RDS)",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original.svg",
    category: "cloud",
    level: 'expert',
  },
  {
    name: "AWS Networking (VPC, Route53)",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original.svg",
    category: "cloud",
    level: 'advanced',
  },
  {
    name: "AWS Messaging (SQS, SES)",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original.svg",
    category: "cloud",
    level: 'advanced',
  },

  // Containers
  {
    name: "Docker",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg",
    category: "containers",
    level: 'expert',
  },
  {
    name: "Kubernetes",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kubernetes/kubernetes-plain.svg",
    category: "containers",
    level: 'beginner',
  },

  // Infrastructure
  {
    name: "Terraform",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/terraform/terraform-original.svg",
    category: "infrastructure",
    level: 'expert',
  },
  {
    name: "Ansible",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/ansible/ansible-original-wordmark.svg",
    category: "infrastructure",
    level: 'intermediate',
  },
  {
    name: "AWS CloudFormation",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original.svg",
    category: "infrastructure",
    level: 'advanced',
  },

  // DevOps / SRE
  {
    name: "Linux",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-plain.svg",
    category: "devops",
    level: 'expert',
  },
  // {
  //   name: "Jenkins",
  //   icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jenkins/jenkins-plain.svg",
  //   category: "devops",
  //   level: 'expert',
  // },
  {
    name: "GitHub Actions",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg",
    category: "devops",
    level: 'expert',
  },
  // {
  //   name: "GitLab CI",
  //   icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/gitlab/gitlab-original.svg",
  //   category: "devops",
  //   level: 'expert',
  // },
  {
    name: "Git",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg",
    category: "devops",
    level: 'expert',
  },
  {
    name: "AWS CodePipeline",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original.svg",
    category: "devops",
    level: 'advanced',
  },
  {
    name: "AWS CodeBuild",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original.svg",
    category: "devops",
    level: 'advanced',
  },
  {
    name: "Prometheus",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/prometheus/prometheus-original.svg",
    category: "devops",
    level: 'expert',
  },
  {
    name: "Grafana",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/grafana/grafana-original.svg",
    category: "devops",
    level: 'expert',
  },
  // {
  //   name: "Dynatrace",
  //   icon: "https://cdn.simpleicons.org/dynatrace",
  //   category: "devops",
  //   level: 'expert',
  // },
  {
    name: "Bash Scripting",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bash/bash-original.svg",
    category: "devops",
    level: 'expert',
  },
  {
    name: "OpenTelemetry",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/opentelemetry/opentelemetry-original.svg",
    category: "devops",
    level: 'expert',
  },
  {
    name: "Jaeger",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jaegertracing/jaegertracing-original.svg",
    category: "devops",
    level: 'advanced',
  },
  {
    name: "Nginx",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nginx/nginx-original.svg",
    category: "devops",
    level: 'advanced',
  },

  // AI
  {
    name: "AI Agents",
    icon: "data:image/svg+xml,%3Csvg%20xmlns=%22http://www.w3.org/2000/svg%22%20viewBox=%220%200%2024%2024%22%20fill=%22none%22%20stroke=%22%2322c55e%22%20stroke-width=%221.8%22%20stroke-linecap=%22round%22%20stroke-linejoin=%22round%22%3E%3Crect%20x=%224%22%20y=%228%22%20width=%2216%22%20height=%2212%22%20rx=%222%22/%3E%3Cpath%20d=%22M12%208V4%22/%3E%3Ccircle%20cx=%2212%22%20cy=%223%22%20r=%221%22/%3E%3Ccircle%20cx=%229%22%20cy=%2214%22%20r=%221.2%22/%3E%3Ccircle%20cx=%2215%22%20cy=%2214%22%20r=%221.2%22/%3E%3Cpath%20d=%22M9%2017.5h6M2%2013v3M22%2013v3%22/%3E%3C/svg%3E",
    category: "ai",
    level: 'advanced',
  },
  {
    name: "Retrieval-Augmented Generation (RAG)",
    icon: "data:image/svg+xml,%3Csvg%20xmlns=%22http://www.w3.org/2000/svg%22%20viewBox=%220%200%2024%2024%22%20fill=%22none%22%20stroke=%22%2322c55e%22%20stroke-width=%221.8%22%20stroke-linecap=%22round%22%20stroke-linejoin=%22round%22%3E%3Crect%20x=%224%22%20y=%228%22%20width=%2216%22%20height=%2212%22%20rx=%222%22/%3E%3Cpath%20d=%22M12%208V4%22/%3E%3Ccircle%20cx=%2212%22%20cy=%223%22%20r=%221%22/%3E%3Ccircle%20cx=%229%22%20cy=%2214%22%20r=%221.2%22/%3E%3Ccircle%20cx=%2215%22%20cy=%2214%22%20r=%221.2%22/%3E%3Cpath%20d=%22M9%2017.5h6M2%2013v3M22%2013v3%22/%3E%3C/svg%3E",
    category: "ai",
    level: 'intermediate',
  },
  {
    name: "AI Agents & Tool Calling",
    icon: "data:image/svg+xml,%3Csvg%20xmlns=%22http://www.w3.org/2000/svg%22%20viewBox=%220%200%2024%2024%22%20fill=%22none%22%20stroke=%22%2322c55e%22%20stroke-width=%221.8%22%20stroke-linecap=%22round%22%20stroke-linejoin=%22round%22%3E%3Crect%20x=%224%22%20y=%228%22%20width=%2216%22%20height=%2212%22%20rx=%222%22/%3E%3Cpath%20d=%22M12%208V4%22/%3E%3Ccircle%20cx=%2212%22%20cy=%223%22%20r=%221%22/%3E%3Ccircle%20cx=%229%22%20cy=%2214%22%20r=%221.2%22/%3E%3Ccircle%20cx=%2215%22%20cy=%2214%22%20r=%221.2%22/%3E%3Cpath%20d=%22M9%2017.5h6M2%2013v3M22%2013v3%22/%3E%3C/svg%3E",
    category: "ai",
    level: 'advanced',
  },
  {
    name: "Observability & Evals",
    icon: "data:image/svg+xml,%3Csvg%20xmlns=%22http://www.w3.org/2000/svg%22%20viewBox=%220%200%2024%2024%22%20fill=%22none%22%20stroke=%22%2322c55e%22%20stroke-width=%221.8%22%20stroke-linecap=%22round%22%20stroke-linejoin=%22round%22%3E%3Crect%20x=%224%22%20y=%228%22%20width=%2216%22%20height=%2212%22%20rx=%222%22/%3E%3Cpath%20d=%22M12%208V4%22/%3E%3Ccircle%20cx=%2212%22%20cy=%223%22%20r=%221%22/%3E%3Ccircle%20cx=%229%22%20cy=%2214%22%20r=%221.2%22/%3E%3Ccircle%20cx=%2215%22%20cy=%2214%22%20r=%221.2%22/%3E%3Cpath%20d=%22M9%2017.5h6M2%2013v3M22%2013v3%22/%3E%3C/svg%3E",
    category: "ai",
    level: 'advanced',
  },
  {
    name: "Claude API",
    icon: "data:image/svg+xml,%3Csvg%20xmlns=%22http://www.w3.org/2000/svg%22%20viewBox=%220%200%2024%2024%22%20fill=%22none%22%20stroke=%22%2322c55e%22%20stroke-width=%221.8%22%20stroke-linecap=%22round%22%20stroke-linejoin=%22round%22%3E%3Crect%20x=%224%22%20y=%228%22%20width=%2216%22%20height=%2212%22%20rx=%222%22/%3E%3Cpath%20d=%22M12%208V4%22/%3E%3Ccircle%20cx=%2212%22%20cy=%223%22%20r=%221%22/%3E%3Ccircle%20cx=%229%22%20cy=%2214%22%20r=%221.2%22/%3E%3Ccircle%20cx=%2215%22%20cy=%2214%22%20r=%221.2%22/%3E%3Cpath%20d=%22M9%2017.5h6M2%2013v3M22%2013v3%22/%3E%3C/svg%3E",
    category: "ai",
    level: 'advanced',
  },
  {
    name: "MCP (Model Context Protocol)",
    icon: "data:image/svg+xml,%3Csvg%20xmlns=%22http://www.w3.org/2000/svg%22%20viewBox=%220%200%2024%2024%22%20fill=%22none%22%20stroke=%22%2322c55e%22%20stroke-width=%221.8%22%20stroke-linecap=%22round%22%20stroke-linejoin=%22round%22%3E%3Crect%20x=%224%22%20y=%228%22%20width=%2216%22%20height=%2212%22%20rx=%222%22/%3E%3Cpath%20d=%22M12%208V4%22/%3E%3Ccircle%20cx=%2212%22%20cy=%223%22%20r=%221%22/%3E%3Ccircle%20cx=%229%22%20cy=%2214%22%20r=%221.2%22/%3E%3Ccircle%20cx=%2215%22%20cy=%2214%22%20r=%221.2%22/%3E%3Cpath%20d=%22M9%2017.5h6M2%2013v3M22%2013v3%22/%3E%3C/svg%3E",
    category: "ai",
    level: 'intermediate',
  },

  // Development
  {
    name: "Python",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
    category: "development",
    level: 'advanced',
  },
  {
    name: "PHP",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg",
    category: "development",
    level: 'advanced',
  },
  {
    name: "JavaScript",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-plain.svg",
    category: "development",
    level: 'expert',
  },
  {
    name: "Typescript",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg",
    category: "development",
    level: 'expert',
  },
  {
    name: "Node.js",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-plain.svg",
    category: "development",
    level: 'expert',
  },
  {
    name: "React",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
    category: "development",
    level: 'advanced',
  },
  {
    name: "NestJS",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nestjs/nestjs-original.svg",
    category: "development",
    level: 'expert',
  },
  {
    name: "RabbitMQ",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/rabbitmq/rabbitmq-original.svg",
    category: "development",
    level: 'intermediate',
  },

  // Databases
  {
    name: "MongoDB",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg",
    category: "database",
    level: 'expert',
  },
  {
    name: "MySQL",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg",
    category: "database",
    level: 'expert',
  },
  {
    name: "PostgreSQL",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg",
    category: "database",
    level: 'expert',
  },
  {
    name: "Redis",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redis/redis-original.svg",
    category: "database",
    level: 'expert',
  },
  {
    name: "Elasticsearch",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/elasticsearch/elasticsearch-original.svg",
    category: "database",
    level: 'advanced',
  },
];

export const PROJECTS = [
  {
    slug: 'ai-observability-platform',
    title: 'AI-Powered Observability & Incident Analysis Platform',
    image: `${import.meta.env.BASE_URL}images/ai-observability.svg`,
    description: 'Observability and incident analysis platform for microservices, used in a real environment. An error-scanner service pulls errors from Elasticsearch, correlates them with Jaeger trace spans, and sends the context to the Anthropic Claude Messages API for root-cause analysis and recommendations, with alerts delivered to Slack.',
    technologies: ['TypeScript', 'NestJS', 'Next.js', 'Claude API', 'OpenTelemetry', 'Jaeger', 'Prometheus', 'Grafana', 'Elasticsearch', 'Kibana', 'PostgreSQL', 'Slack', 'Docker', 'AWS EC2'],
    category: 'devops',
    githubLink: '',
    websiteLink: 'https://obs.247.id.vn/obs',
    detail: {
      summary: 'AI-powered root-cause analysis for microservice incidents, built on logs, traces, and the Claude Messages API.',
      role: 'Backend, AI Integration & Infrastructure Engineering',
      problem: 'Investigating incidents meant manually searching logs and cross-referencing traces across services, which took about 10 minutes for simple issues and about 40 minutes for complex, multi-service ones.',
      solution: 'An automated error-scanner periodically retrieves Elasticsearch errors and correlates them with Jaeger trace spans via request-ID and trace-ID. The context is analyzed by the Claude Messages API, alerts go to Slack, and analysis activity is recorded in PostgreSQL.',
      highlights: ['Investigation time reduced from ~10 to ~5 minutes (simple) and from ~40 to ~10 minutes (complex)', 'TypeScript pnpm monorepo with auth-service, product-service, and payment-service (NestJS)', 'Distributed tracing (OpenTelemetry, Jaeger), metrics (Prometheus, Grafana), centralized logging (Pino, Filebeat, Elasticsearch, Kibana)', 'PII and credential masking, internal service authentication, DTO validation, parameterized queries', 'Seven custom Claude Code subagents for security, logging, dashboard, Dockerfile, and testing reviews'],
      architecture: ['Microservices', 'OpenTelemetry / Structured Logging', 'Jaeger / Prometheus / Elasticsearch', 'Error Scanner', 'Claude AI Analysis', 'Slack Alerts'],
    },
  },
  {
    slug: 'customer-support-chatbot-rag',
    title: 'Customer Support Chatbot — RAG + LLM',
    image: `${import.meta.env.BASE_URL}images/chatbot-cskh.svg`,
    description: 'Chatbot chăm sóc khách hàng cho cửa hàng điện tử: trả lời câu hỏi về chính sách (giao hàng, bảo hành, đổi trả) bằng RAG và giúp khách đã đăng nhập tra cứu đơn hàng của chính họ qua tool calling. Quan sát toàn bộ luồng bằng OpenTelemetry: log và span gửi qua OTel Collector (xoá header nhạy cảm, gom lô) vào grafana/otel-lgtm (Loki, Tempo, Prometheus, Grafana dashboard).',
    technologies: ['RAG', 'LLM', 'Tool Calling', 'OpenTelemetry', 'Grafana', 'Loki', 'Tempo', 'Prometheus'],
    category: 'fullstack',
    githubLink: '',
    websiteLink: '',
    detail: {
      summary: 'Chatbot CSKH cho cửa hàng điện tử, kết hợp RAG và tool calling, quan sát toàn bộ bằng OpenTelemetry.',
      role: 'Design & Implementation',
      problem: 'Khách hỏi lặp đi lặp lại về chính sách (giao hàng, bảo hành, đổi trả) và tra cứu đơn hàng, tốn nhân lực hỗ trợ; đồng thời cần nhìn rõ chatbot đang trả lời gì và chậm ở đâu.',
      solution: 'Dùng RAG để trả lời câu hỏi chính sách từ tài liệu của cửa hàng, và tool calling để khách đã đăng nhập chỉ tra cứu được đơn hàng của chính họ. Log và span đi qua OTel Collector rồi vào grafana/otel-lgtm.',
      highlights: ['RAG trả lời câu hỏi về giao hàng, bảo hành, đổi trả', 'Tool calling tra cứu đơn hàng, giới hạn theo khách đã đăng nhập', 'OTel Collector xoá header nhạy cảm và gom lô trước khi lưu', 'Dashboard Grafana trên Loki (log), Tempo (trace), Prometheus (metric)'],
      architecture: ['Khách hàng (chat UI)', 'Chatbot API (RAG + LLM + tool calling)', 'OpenTelemetry Collector (scrub header, batch)', 'grafana/otel-lgtm: Loki / Tempo / Prometheus', 'Grafana dashboard'],
    },
  },
  {
    slug: 'booking-online-eks',
    title: 'Booking online - EKS && GihubActions',
    image: `${import.meta.env.BASE_URL}images/booking-online.webp`,
    description: 'Deployed a booking online application to AWS EKS with Helm in a development environment (basic Kubernetes exposure). Integrated CI/CD pipelines using GitHub Actions and containerized microservices with Docker.',
    technologies: ['AWS EKS', 'Kubernetes', 'Helm', 'GitHub Actions', 'Docker', 'Full-Stack'],
    category: 'devops',
    githubLink: '',
    websiteLink: '',
    detail: {
      summary: 'Hệ thống booking online deploy lên AWS EKS bằng Helm trong môi trường development, với CI/CD GitHub Actions.',
      role: 'DevOps Engineer',
      problem: 'Cần triển khai ứng dụng booking dạng microservices một cách lặp lại được và tự động hoá việc build/deploy.',
      solution: 'Container hoá từng microservice bằng Docker, đóng gói release bằng Helm chart và deploy lên EKS thông qua pipeline GitHub Actions.',
      highlights: ['Deploy lên AWS EKS (môi trường development, mức làm quen với Kubernetes)', 'Helm chart cho cấu hình và release', 'Pipeline GitHub Actions tự động build và deploy', 'Microservices được container hoá bằng Docker'],
      architecture: ['Developer push code', 'GitHub Actions (build, push image)', 'Helm release', 'AWS EKS cluster', 'Booking microservices'],
    },
  },
  {
    slug: 'nextjs-cicd-kubernetes',
    title: 'Next.js CI/CD Pipeline with Docker & Kubernetes',
    image: `${import.meta.env.BASE_URL}images/cicd-k8s.webp`,
    description: 'Developed and containerized a Next.js application, deploying it to Kubernetes in a development environment (basic Kubernetes exposure) using GitHub Actions for automated CI/CD. Implemented multi-stage Docker builds, health probes, resource limits, and rolling updates.',
    technologies: ['Next.js', 'Docker', 'Kubernetes', 'GitHub Actions', 'GHCR'],
    category: 'devops',
    githubLink: '',
    websiteLink: '',
    detail: {
      summary: 'Pipeline CI/CD tự động cho ứng dụng Next.js, build bằng Docker và deploy lên Kubernetes trong môi trường development.',
      role: 'DevOps Engineer',
      problem: 'Deploy thủ công dễ sai sót và khó cập nhật phiên bản mà không gián đoạn.',
      solution: 'Container hoá Next.js bằng multi-stage build, publish image lên GHCR, deploy lên Kubernetes qua GitHub Actions với health probe, resource limit và rolling update.',
      highlights: ['Multi-stage Docker build cho image gọn nhẹ', 'Health probes (liveness/readiness)', 'Resource requests/limits', 'Rolling update để giảm downtime', 'Image registry: GHCR'],
      architecture: ['Git push', 'GitHub Actions (build + test)', 'Docker image -> GHCR', 'kubectl/manifest deploy', 'Kubernetes (rolling update)'],
    },
  },
  {
    slug: 'realtime-chat-mern',
    title: 'Realtime Chat App — MERN + Socket.IO',
    image: `${import.meta.env.BASE_URL}images/todo-webapp.webp`,
    description: 'Developed a real-time chat application using the MERN stack with Socket.IO for instant communication. Implemented custom hooks for efficient state management. Deployed behind Nginx as a reverse proxy, Dockerized for deployment.',
    technologies: ['React', 'Node', 'Express', 'MongoDB', 'Socket.IO', 'Nginx', 'Docker'],
    category: 'fullstack',
    githubLink: '',
    websiteLink: '',
    detail: {
      summary: 'Ứng dụng chat thời gian thực trên MERN stack với Socket.IO, chạy sau Nginx reverse proxy.',
      role: 'Full-Stack Developer',
      problem: 'Cần giao tiếp tức thời giữa người dùng với state phía client dễ quản lý.',
      solution: 'Dùng Socket.IO cho kênh realtime, custom hooks của React để quản lý state, Nginx làm reverse proxy và Docker để đóng gói deploy.',
      highlights: ['Giao tiếp realtime bằng Socket.IO', 'Custom hooks quản lý state hiệu quả', 'Nginx reverse proxy phía trước', 'Dockerized để deploy'],
      architecture: ['React client', 'Nginx reverse proxy', 'Node/Express + Socket.IO', 'MongoDB'],
    },
  },
  {
    slug: 'cloud-infrastructure-automation',
    title: 'Cloud Infrastructure Automation',
    image: `${import.meta.env.BASE_URL}images/terraform-aws.webp`,
    description: 'Automated AWS infrastructure provisioning using Terraform with reusable modules for EC2, VPC, and S3. Integrated CI/CD with GitHub Actions for continuous deployment of cloud environments.',
    technologies: ['AWS', 'Terraform', 'GitHub Actions', 'EC2', 'S3'],
    category: 'devops',
    githubLink: '',
    websiteLink: '',
    detail: {
      summary: 'Tự động hoá provisioning hạ tầng AWS bằng Terraform module và GitHub Actions.',
      role: 'DevOps Engineer',
      problem: 'Tạo hạ tầng thủ công chậm, khó tái lập và dễ lệch giữa các môi trường.',
      solution: 'Viết Terraform module tái sử dụng cho EC2, VPC, S3 và tích hợp GitHub Actions để triển khai môi trường liên tục.',
      highlights: ['Reusable Terraform modules (EC2, VPC, S3)', 'Infrastructure as Code, tái lập được', 'CI/CD cho hạ tầng với GitHub Actions'],
      architecture: ['Terraform modules', 'Pull request / push', 'GitHub Actions (plan, apply)', 'AWS: VPC, EC2, S3'],
    },
  },
  {
    slug: 'shaire-salon',
    title: 'Shaire Salon using ParsePlatform/ReactJS',
    image: `${import.meta.env.BASE_URL}images/shaire-salon.webp`,
    description: 'Built Shaire Salon on Parse Platform and React, with MongoDB and Redis for data and caching, Firebase for auxiliary services, and a production deployment on AWS EC2 behind Nginx, backed by S3 and CloudFront for static asset delivery.',
    technologies: ['ParsePlatform', 'ReactJS', 'MongoDB', 'Redis', 'Firebase', 'EC2', 'Nginx', 'S3', 'CloudFront'],
    category: 'fullstack',
    githubLink: '',
    websiteLink: '',
    detail: {
      summary: 'Nền tảng salon xây trên Parse Platform và React, deploy trên AWS EC2 với S3 và CloudFront.',
      role: 'Full-Stack Developer',
      problem: 'Cần backend nhanh để phát triển, có cache và phân phối static asset hiệu quả.',
      solution: 'Parse Platform làm backend với MongoDB và Redis (cache), Firebase cho dịch vụ phụ trợ, deploy trên EC2 sau Nginx; asset lưu S3 và phân phối qua CloudFront.',
      highlights: ['Parse Platform + ReactJS', 'MongoDB cho dữ liệu, Redis cho cache', 'Firebase cho dịch vụ phụ trợ', 'S3 + CloudFront cho static asset'],
      architecture: ['React client', 'CloudFront (static assets)', 'Nginx on EC2', 'Parse Server', 'MongoDB / Redis'],
    },
  },
  {
    slug: 'wine-auction',
    title: 'Wine Auction using Symfony/MySQL',
    image: `${import.meta.env.BASE_URL}images/wine-auction.webp`,
    description: 'Built a wine auction platform on Symfony with MySQL, deployed on AWS EC2 behind Nginx with S3 for asset storage.',
    technologies: ['Symfony', 'MySQL', 'EC2', 'Nginx', 'S3'],
    category: 'fullstack',
    githubLink: '',
    websiteLink: '',
    detail: {
      summary: 'Nền tảng đấu giá rượu vang xây trên Symfony và MySQL, deploy trên AWS EC2.',
      role: 'Full-Stack Developer',
      problem: 'Cần một nền tảng đấu giá web với dữ liệu quan hệ và lưu trữ asset đáng tin cậy.',
      solution: 'Symfony + MySQL cho ứng dụng, deploy trên EC2 sau Nginx, dùng S3 lưu asset.',
      highlights: ['Symfony + MySQL', 'Deploy EC2 sau Nginx', 'S3 lưu trữ asset'],
      architecture: ['Browser', 'Nginx on EC2', 'Symfony app', 'MySQL / S3'],
    },
  },
  {
    slug: 'portfolio-website',
    title: 'Portfolio Website',
    image: `${import.meta.env.BASE_URL}images/portfolio-personal.webp`,
    description: 'This portfolio site itself — a cyber-terminal-themed single-page app built with React, TypeScript, and Vite, deployed as a static SPA.',
    technologies: ['React', 'TypeScript', 'Vite', 'React Router', 'Tailwind CSS', 'Framer Motion'],
    category: 'fullstack',
    githubLink: '',
    websiteLink: '',
    detail: {
      summary: 'Chính trang portfolio này: SPA theme cyber-terminal bằng React, TypeScript và Vite.',
      role: 'Design & Development',
      problem: 'Cần một nơi trình bày kỹ năng, dự án và bài viết gọn gàng, không cần backend.',
      solution: 'SPA tĩnh với React Router, Tailwind CSS và Framer Motion, deploy dạng static.',
      highlights: ['Theme cyber-terminal', 'Client-side routing với React Router', 'Tailwind CSS + Framer Motion', 'Static deploy, không backend'],
      architecture: ['Vite build', 'Static files (dist/)', 'Static hosting (Vercel / GitHub Pages)'],
    },
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

export type Project = (typeof PROJECTS)[number];

export const getProjectBySlug = (slug: string | undefined): Project | undefined =>
  PROJECTS.find(project => project.slug === slug);
