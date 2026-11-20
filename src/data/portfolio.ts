import { CHATBOT_DATABASE, type DatabaseSection } from './chatbot-database';
import { BOOKING_DATABASE } from './booking-database';

export const HERO_CONTENT = "Building reliable systems, from code to cloud.";

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
  {
    name: "Loki",
    icon: `${import.meta.env.BASE_URL}images/loki.png`,
    category: "devops",
    level: 'advanced',
  },
  {
    name: "Tempo",
    icon: `${import.meta.env.BASE_URL}images/tempo.png`,
    category: "devops",
    level: 'advanced',
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

export interface CodeExample {
  /** Fence language: sql | javascript | bash | lua | json (see CodeBlock.tsx). */
  language: string;
  code: string;
  /** Short label shown in the block header, e.g. "Khoá dòng + trừ tồn kho". */
  caption?: string;
}

export interface ChallengeItem {
  heading: string;
  body?: string;
  points?: string[];
  code?: string;
  examples?: CodeExample[];
}

export interface Challenge {
  title: string;
  summary?: string;
  items: ChallengeItem[];
}

export interface ProjectDetail {
  summary: string;
  role: string;
  problem: string;
  solution: string;
  highlights: string[];
  architecture: string[];
  challenges?: Challenge[];
  /** Optional database schema section (tables, relations, end-to-end data flow). */
  database?: DatabaseSection;
}

export interface Project {
  slug: string;
  title: string;
  featured?: boolean;
  image: string;
  description: string;
  technologies: string[];
  category: 'devops' | 'fullstack';
  githubLink: string;
  websiteLink: string;
  detail: ProjectDetail;
}

export const PROJECTS: Project[] = [
  {
    slug: 'ai-observability-platform',
    featured: true,
    title: 'AI-Powered Observability & Incident Analysis Platform',
    image: `${import.meta.env.BASE_URL}images/ai-observability.svg`,
    description: 'Observability and incident analysis platform for microservices, used in a real environment. An error-scanner service pulls errors from Elasticsearch, correlates them with Jaeger trace spans, and sends the context to the Anthropic Claude Messages API for root-cause analysis and recommendations, with alerts delivered to Slack.',
    technologies: ['TypeScript', 'NestJS', 'Next.js', 'Claude API', 'OpenTelemetry', 'Jaeger', 'Prometheus', 'Grafana', 'Elasticsearch', 'Kibana', 'PostgreSQL', 'Slack', 'Docker', 'AWS EC2'],
    category: 'fullstack',
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
    featured: true,
    title: 'Customer Support Chatbot — RAG + LLM',
    image: `${import.meta.env.BASE_URL}images/chatbot-cskh.svg`,
    description: 'Chatbot chăm sóc khách hàng cho cửa hàng điện tử: trả lời câu hỏi về chính sách (giao hàng, bảo hành, đổi trả) bằng RAG và giúp khách đã đăng nhập tra cứu đơn hàng của chính họ qua tool calling. Quan sát toàn bộ luồng bằng OpenTelemetry: log và span gửi qua OTel Collector (xoá header nhạy cảm, gom lô) vào grafana/otel-lgtm (Loki, Tempo, Prometheus, Grafana dashboard).',
    technologies: ['RAG', 'LLM', 'Tool Calling', 'OpenTelemetry', 'Grafana', 'Loki', 'Tempo', 'Prometheus'],
    category: 'fullstack',
    githubLink: '',
    websiteLink: 'https://demo.247.id.vn',
    detail: {
      summary: 'Chatbot CSKH cho cửa hàng điện tử, kết hợp RAG và tool calling, quan sát toàn bộ bằng OpenTelemetry.',
      role: 'Design & Implementation',
      problem: 'Khách hỏi lặp đi lặp lại về chính sách (giao hàng, bảo hành, đổi trả) và tra cứu đơn hàng, tốn nhân lực hỗ trợ; đồng thời cần nhìn rõ chatbot đang trả lời gì và chậm ở đâu.',
      solution: 'Dùng RAG để trả lời câu hỏi chính sách từ tài liệu của cửa hàng, và tool calling để khách đã đăng nhập chỉ tra cứu được đơn hàng của chính họ. Log và span đi qua OTel Collector rồi vào grafana/otel-lgtm.',
      highlights: ['RAG trả lời câu hỏi về giao hàng, bảo hành, đổi trả', 'Tool calling tra cứu đơn hàng, giới hạn theo khách đã đăng nhập', 'OTel Collector xoá header nhạy cảm và gom lô trước khi lưu', 'Dashboard Grafana trên Loki (log), Tempo (trace), Prometheus (metric)'],
      architecture: ['Khách hàng (chat UI)', 'Chatbot API (RAG + LLM + tool calling)', 'OpenTelemetry Collector (scrub header, batch)', 'grafana/otel-lgtm: Loki / Tempo / Prometheus', 'Grafana dashboard'],
      database: CHATBOT_DATABASE,
    },
  },
  {
    slug: 'booking-online-eks',
    featured: true,
    title: 'Booking online - EKS && GitHub Actions',
    image: `${import.meta.env.BASE_URL}images/booking-online.webp`,
    description: 'Hệ thống booking online (khách sạn, vé máy bay, nhà hàng, dịch vụ) được thiết kế để đảm bảo tính nhất quán dữ liệu khi nhiều người đặt cùng lúc và chịu tải cao: row locking, distributed lock bằng Redis, giữ chỗ tạm thời có TTL, chống trùng lịch, chuẩn hoá thời gian theo UTC, thanh toán idempotent với state machine cho đơn hàng. Chạy trên Kubernetes (AWS EKS) với ba môi trường development, UAT và production, đóng gói bằng Helm, CI/CD GitHub Actions và Docker.',
    technologies: ['AWS EKS', 'Kubernetes', 'Helm', 'GitHub Actions', 'Docker', 'Redis', 'PostgreSQL', 'BullMQ', 'Webhook', 'NestJS', 'Next.js', 'Full-Stack'],
    category: 'fullstack',
    githubLink: '',
    websiteLink: 'https://ricokatsu.com/',
    detail: {
      summary: 'Hệ thống booking online (khách sạn, vé máy bay, nhà hàng, dịch vụ) tập trung vào tính nhất quán dữ liệu khi nhiều người đặt cùng lúc; deploy lên AWS EKS bằng Helm với CI/CD GitHub Actions.',
      role: 'Backend, Frontend, DevOps & System Design',
      problem: 'Bài toán cốt lõi của hệ thống booking online (khách sạn, vé máy bay, nhà hàng, dịch vụ) là đảm bảo tính nhất quán dữ liệu khi nhiều người đặt cùng lúc và chịu tải cao: không đặt trùng, không bán quá số lượng, không thanh toán hay hoàn tiền hai lần.',
      solution: 'Kết hợp khoá ở tầng database, distributed lock bằng Redis, giữ chỗ tạm thời có TTL, chuẩn hoá thời gian theo UTC, idempotency key và state machine cho đơn hàng. Ứng dụng được container hoá bằng Docker, đóng gói bằng Helm và deploy lên Kubernetes (AWS EKS) qua pipeline GitHub Actions, qua ba môi trường development, UAT và production.',
      highlights: [
        'Row locking (SELECT ... FOR UPDATE) kết hợp điều kiện quantity >= :needed để số lượng không bao giờ bị âm',
        'Distributed lock bằng Redis (SETNX / Redlock) theo key resource_id:date_or_slot cho hệ thống nhiều server',
        'Reservation hold 5–15 phút, tự nhả slot khi hết hạn (TTL Redis, delayed queue hoặc scheduler)',
        'Chống trùng lịch bằng điều kiện (newStart < existingEnd) AND (newEnd > existingStart), cho phép đặt lịch nối tiếp',
        'Lưu mọi mốc thời gian theo UTC (ISO 8601), hiển thị theo múi giờ local',
        'Idempotency key và state machine rõ ràng để tránh thanh toán hoặc hoàn tiền hai lần',
        'Chạy trên Kubernetes (AWS EKS) với ba môi trường development, UAT và production, deploy bằng Helm qua CI/CD GitHub Actions',
      ],
      architecture: ['Developer push code', 'GitHub Actions (build, push image)', 'Helm release', 'AWS EKS cluster', 'Booking microservices'],
      database: BOOKING_DATABASE,
      challenges: [
        {
          title: '1. Chống tranh chấp và đặt trùng (Concurrency & Overbooking)',
          summary: 'Race condition: hai người cùng chọn slot hoặc phòng cuối cùng tại cùng một thời điểm.',
          items: [
            {
              heading: 'Record / Row Locking ở database',
              examples: [
                {
                  language: 'sql',
                  caption: 'Khoá dòng tồn kho rồi trừ số lượng',
                  code: `BEGIN;

-- khoá dòng: giao dịch khác phải chờ đến khi COMMIT / ROLLBACK
SELECT quantity FROM inventory WHERE id = 42 FOR UPDATE;

-- điều kiện quantity >= :needed giúp số lượng không bao giờ âm
UPDATE inventory
SET quantity = quantity - 2
WHERE id = 42 AND quantity >= 2;   -- 0 dòng bị ảnh hưởng = hết hàng, hãy ROLLBACK

COMMIT;`,
                },
              ],
              body: 'Dùng cho tài nguyên có số lượng giới hạn (tồn kho flash sale, vé máy bay, voucher). Khoá từng dòng dữ liệu tương ứng để chỉ một transaction được kiểm tra và trừ số lượng tại một thời điểm, tránh bán quá số lượng (overselling) hoặc ghi đè sai lệch khi nhiều người truy cập đồng thời.',
              points: [
                'Đặt khoá lên dòng ngay khi đọc để chuẩn bị sửa (thường dùng SELECT ... FOR UPDATE). Các transaction khác phải chờ đến khi transaction hiện tại COMMIT hoặc ROLLBACK.',
                'Kiểm tra điều kiện ngay lúc cập nhật: kết hợp khoá với điều kiện quantity >= :needed trong câu lệnh UPDATE để đảm bảo số lượng không bao giờ bị âm.',
              ],
            },
            {
              heading: 'Distributed lock (Redis SETNX / Redlock) theo key resource_id:date_or_slot',
              examples: [
                {
                  language: 'bash',
                  caption: 'Xin khoá cho một slot (Redis)',
                  code: `# chỉ thành công nếu key chưa tồn tại (NX), tự hết hạn sau 10 giây (PX 10000)
# value là token ngẫu nhiên để biết ai đang giữ khoá
SET lock:san_bong_1:2026-12-01T09 8f14e45f-ceea-467f NX PX 10000`,
                },
                {
                  language: 'lua',
                  caption: 'Nhả khoá an toàn (chỉ xoá nếu đúng chủ)',
                  code: `-- KEYS[1] = lock key, ARGV[1] = token của người đang gọi
if redis.call('GET', KEYS[1]) == ARGV[1] then
  return redis.call('DEL', KEYS[1])
end
return 0`,
                },
              ],
              body: 'Khi ứng dụng chạy trên nhiều server (microservices hoặc auto-scaling), khoá trên RAM của từng server (synchronized trong Java, Mutex trong Go) không thể giao tiếp với nhau. Distributed lock dùng một kho lưu trữ trung gian (thường là Redis) làm "trọng tài" để tất cả các server cùng xin quyền truy cập trước khi xử lý.',
              points: ['Cấu trúc key, ví dụ: san_bong_1, bac_si_A, ghe_B12'],
            },
            {
              heading: 'Reservation Hold (giữ chỗ tạm thời)',
              examples: [
                {
                  language: 'bash',
                  caption: 'Giữ chỗ 10 phút, tự nhả khi hết hạn',
                  code: `# NX: chỉ giữ được nếu chưa ai giữ, EX 600: tự xoá sau 600 giây
SET hold:event_1:seat_A1 user_A NX EX 600

# còn bao nhiêu giây (-2 = key không còn, tức ghế đã trống lại)
TTL hold:event_1:seat_A1`,
                },
                {
                  language: 'sql',
                  caption: 'Xác nhận thanh toán: DB là nguồn sự thật',
                  code: `-- chỉ một giao dịch lật được ghế sang BOOKED; 0 dòng = ghế đã thuộc người khác
UPDATE event_seats
SET status = 'BOOKED', user_id = 'user_A', updated_at = NOW()
WHERE event_id = 'event_1' AND seat_id = 'seat_A1' AND status = 'AVAILABLE';`,
                },
              ],
              body: 'Khoá tạm slot trong 5–15 phút khi khách đang thanh toán, tự nhả slot nếu hết hạn (qua TTL Redis, delayed queue hoặc cron/scheduler). Tránh treo slot vĩnh viễn khi người dùng tắt app, rớt mạng hoặc bỏ giỏ hàng.',
              points: ['Lưu key giữ chỗ (ví dụ hold:event_1:seat_A1) kèm EX 600 (10 phút).'],
            },
          ],
        },
        {
          title: '2. Kiểm tra khả dụng, múi giờ và quy tắc vận hành',
          items: [
            {
              heading: '2.1. Kiểm tra tính khả dụng (Availability Check) và chống trùng lịch (Conflict Detection)',
              examples: [
                {
                  language: 'javascript',
                  caption: 'Công thức trong code',
                  code: `const isOverlapping = (newStart, newEnd, existingStart, existingEnd) =>
  newStart < existingEnd && newEnd > existingStart;

// lịch cũ 09:00-10:00
isOverlapping(t('10:00'), t('11:00'), t('09:00'), t('10:00')); // false, đặt nối tiếp được
isOverlapping(t('09:30'), t('10:30'), t('09:00'), t('10:00')); // true, bị trùng`,
                },
                {
                  language: 'sql',
                  caption: 'Để database lọc thay vì kéo dữ liệu về',
                  code: `SELECT EXISTS (
  SELECT 1
  FROM bookings
  WHERE resource_id = 1
    AND status <> 'CANCELLED'                      -- bỏ qua lịch đã huỷ
    AND start_time < '2026-12-01 03:30:00+00'      -- newEnd
    AND end_time   > '2026-12-01 02:30:00+00'      -- newStart
) AS is_overlapping;`,
                },
                {
                  language: 'sql',
                  caption: 'PostgreSQL: để constraint chặn cả race condition',
                  code: `CREATE EXTENSION IF NOT EXISTS btree_gist;

ALTER TABLE bookings
  ADD CONSTRAINT no_overlapping_bookings
  EXCLUDE USING gist (
    resource_id WITH =,
    tstzrange(start_time, end_time, '[)') WITH &&
  ) WHERE (status <> 'CANCELLED');`,
                },
              ],
              body: 'Khi người dùng muốn đặt khoảng thời gian [newStart, newEnd], hệ thống phải đối chiếu với tất cả lịch đã tồn tại [existingStart, existingEnd] trong cơ sở dữ liệu. Hai khoảng thời gian giao nhau (bị trùng) khi và chỉ khi khoảng này bắt đầu trước khi khoảng kia kết thúc, và ngược lại.',
              code: 'isOverlapping = (newStart < existingEnd) AND (newEnd > existingStart)',
              points: [
                'Dùng dấu < và > (thay vì <=) để cho phép đặt lịch nối tiếp nhau ngay lập tức. Ví dụ: lịch cũ kết thúc lúc 10:00, lịch mới bắt đầu lúc 10:00 thì 10:00 < 10:00 là False, không tính là trùng.',
              ],
            },
            {
              heading: '2.2. Xử lý múi giờ (Timezone Handling)',
              examples: [
                {
                  language: 'javascript',
                  caption: 'Lưu UTC, hiển thị theo múi giờ local',
                  code: `// người dùng ở UTC+7 chọn 14:00 -> lưu xuống database theo UTC (ISO 8601)
const startUtc = new Date('2026-11-20T14:00:00+07:00').toISOString();
// '2026-11-20T07:00:00.000Z'

// hiển thị theo múi giờ của địa điểm (ví dụ khách sạn ở Nhật, UTC+9)
new Intl.DateTimeFormat('en-GB', {
  timeZone: 'Asia/Tokyo',
  dateStyle: 'medium',
  timeStyle: 'short',
}).format(new Date(startUtc)); // '20 Nov 2026, 16:00'`,
                },
              ],
              body: 'Người dùng có thể ở bất kỳ đâu trên thế giới (ví dụ người Việt ở UTC+7 đặt khách sạn ở Nhật UTC+9). Nếu không chuẩn hoá, dữ liệu sẽ bị lệch giờ nghiêm trọng.',
              points: [
                'Lưu trữ chuẩn UTC: toàn bộ mốc thời gian (startTime, endTime) khi lưu xuống database (PostgreSQL, MySQL, MongoDB...) phải quy đổi về UTC, thường theo chuẩn ISO 8601, ví dụ 2026-11-20T07:00:00Z. Mọi phép so sánh ở backend nhờ đó nằm trên cùng một hệ quy chiếu.',
                'Hiển thị theo local timezone: khi trả dữ liệu về giao diện, dựa vào múi giờ của trình duyệt người dùng (hoặc múi giờ của địa điểm cung cấp dịch vụ) để cộng/trừ số giờ tương ứng.',
              ],
            },
            {
              heading: '2.3. Giờ mở cửa, check-in, check-out (Business Hours & Rules)',
              body: 'Ngay cả khi khoảng thời gian không trùng với ai và đã đúng múi giờ, hệ thống vẫn phải kiểm tra yêu cầu có tuân thủ quy định vận hành của cơ sở kinh doanh hay không.',
              points: [
                'Giờ mở cửa (Operating Hours): dùng cho dịch vụ theo giờ (sân bóng, spa, phòng khám). Kiểm tra newStart và newEnd có nằm trọn trong khung giờ làm việc của ngày đó không, ví dụ chỉ nhận khách từ 08:00 đến 22:00 và có thể nghỉ trưa từ 12:00 đến 13:00.',
              ],
            },
          ],
        },
        {
          title: '3. Thanh toán, Idempotency và trạng thái đơn (Payment & State Machine)',
          summary: 'Giải quyết bài toán thanh toán hai lần và hoàn tiền hai lần.',
          items: [
            {
              heading: 'Idempotency key',
              examples: [
                {
                  language: 'bash',
                  caption: 'Client gửi lại đúng key khi retry',
                  code: `curl -X POST https://api.example.com/payments -H 'Content-Type: application/json' -H 'Idempotency-Key: 6f1c2b7e-3a54-4d0e-9a52-0c1f5d8b7a11' -d '{"orderId":"A1","amount":150000}'`,
                },
                {
                  language: 'sql',
                  caption: 'Lưu key bằng ràng buộc UNIQUE, trong cùng transaction',
                  code: `INSERT INTO idempotency_keys (idempotency_key, request_hash, status)
VALUES ('6f1c2b7e-3a54-4d0e-9a52-0c1f5d8b7a11', 'e3b0c442...', 'IN_PROGRESS')
ON CONFLICT (idempotency_key) DO NOTHING;
-- 1 dòng: request đầu tiên, được xử lý
-- 0 dòng: request trùng, trả lại kết quả đã lưu (hoặc 409 nếu đang xử lý)`,
                },
              ],
              body: 'Tránh trừ tiền hoặc tạo hai đơn trùng khi mạng chập chờn và client retry request.',
            },
            {
              heading: 'State machine rõ ràng',
              examples: [
                {
                  language: 'javascript',
                  caption: 'Chỉ cho phép các bước chuyển hợp lệ',
                  code: `const TRANSITIONS = {
  PENDING_HOLD: ['PAYMENT_PROCESSING', 'EXPIRED', 'CANCELLED'],
  PAYMENT_PROCESSING: ['CONFIRMED', 'EXPIRED', 'CANCELLED'],
  CONFIRMED: ['REFUNDED'],
  EXPIRED: [],
  CANCELLED: [],
  REFUNDED: [],
};

const canTransition = (from, to) => TRANSITIONS[from]?.includes(to) ?? false;

canTransition('PAYMENT_PROCESSING', 'CONFIRMED'); // true
canTransition('CONFIRMED', 'EXPIRED');            // false`,
                },
                {
                  language: 'sql',
                  caption: 'Ép luật ngay trong câu UPDATE (Optimistic Locking)',
                  code: `UPDATE orders
SET status = 'CONFIRMED', updated_at = NOW()
WHERE id = 1 AND status = 'PAYMENT_PROCESSING';
-- 0 dòng: bên khác (webhook / response đồng bộ) đã đổi trạng thái trước, bỏ qua`,
                },
              ],
              code: 'PENDING_HOLD → PAYMENT_PROCESSING → CONFIRMED / EXPIRED / CANCELLED / REFUNDED',
            },
            {
              heading: 'Xử lý bất đồng bộ và hoàn tiền',
              examples: [
                {
                  language: 'sql',
                  caption: 'Chống xử lý trùng webhook bằng event id',
                  code: `INSERT INTO webhook_events (event_id) VALUES ('evt_1') ON CONFLICT DO NOTHING;
-- 1 dòng: event mới, xử lý tiếp
-- 0 dòng: cổng thanh toán gửi lặp, bỏ qua`,
                },
              ],
              body: 'Webhook từ cổng thanh toán có thể đến trễ hoặc gửi lặp; cần đối soát trạng thái và xử lý hoàn tiền, giữ cọc an toàn.',
            },
          ],
        },
      ],
    },
  },
  {
    slug: 'aws-cdk-lab',
    title: 'AWS CDK Lab — IaC bằng TypeScript',
    image: `${import.meta.env.BASE_URL}images/aws-cdk-lab.svg`,
    description: 'Lab AWS CDK (TypeScript) cho S3, IAM và AWS Budgets, tách môi trường dev/prod bằng context. Kiểm tra bảo mật bằng cdk-nag, unit test bằng Template assertions, và CI/CD với GitHub Actions dùng OIDC, không lưu access key.',
    technologies: ['AWS CDK', 'TypeScript', 'CloudFormation', 'cdk-nag', 'Jest', 'GitHub Actions', 'OIDC', 'S3', 'IAM'],
    category: 'devops',
    githubLink: '',
    websiteLink: '',
    detail: {
      summary: 'Lab nhỏ để luyện AWS CDK theo hướng thực tế: default an toàn, test và kiểm tra bảo mật trước khi deploy.',
      role: 'DevOps Engineer (personal lab)',
      problem: 'Cần cách quản lý hạ tầng AWS bằng code thật, tách dev/prod, chặn cấu hình kém an toàn và tránh hóa đơn bất ngờ trước khi deploy.',
      solution: 'Một stack CDK (TypeScript) với S3, IAM role dùng grantRead() và AWS Budgets lọc theo tag. cdk-nag chạy lúc synth, Jest test chạy local không cần credentials, GitHub Actions dùng OIDC để diff và deploy.',
      highlights: ['L2 construct với default an toàn: SSE-S3, BLOCK_ALL, enforceSSL', 'IAM least privilege bằng grantRead(), acknowledge từng finding của cdk-nag kèm lý do', 'Một code cho dev/prod qua context: RemovalPolicy DESTROY (dev) và RETAIN (prod), budget $5 / $50', 'CI/CD: validate, diff, deploy-dev, deploy-prod (Required reviewers), OIDC không access key'],
      architecture: ['TypeScript (CDK app)', 'cdk synth: CloudFormation template + cdk-nag', 'Jest (Template assertions)', 'GitHub Actions (OIDC)', 'AWS: S3, IAM, Budgets'],
    },
  },
  {
    slug: 'shaire-salon',
    title: 'Shaire Salon using ParsePlatform/ReactJS',
    image: `${import.meta.env.BASE_URL}images/shaire-salon.webp`,
    description: 'Shaire Salon được xây dựng trên Parse Platform và React để ra mắt MVP nhanh: Parse cung cấp sẵn database, xác thực người dùng, lưu trữ tệp, push notification, LiveQuery, REST/GraphQL API và Cloud Code. Dữ liệu dùng MongoDB, cache bằng Redis, Firebase cho dịch vụ phụ trợ; deploy production trên AWS EC2 sau Nginx, asset tĩnh phân phối qua S3 và CloudFront.',
    technologies: ['ParsePlatform', 'ReactJS', 'MongoDB', 'Redis', 'Firebase', 'EC2', 'Nginx', 'S3', 'CloudFront'],
    category: 'fullstack',
    githubLink: '',
    websiteLink: 'https://shaire.app/',
    detail: {
      summary: 'Nền tảng salon xây trên Parse Platform và React để rút ngắn thời gian ra mắt MVP, deploy trên AWS EC2 với S3 và CloudFront.',
      role: 'Full-Stack Developer',
      problem: 'Cần ra mắt sản phẩm nhanh (MVP, time-to-market) mà không phải tự viết lại các phần lặp lại như mô hình hoá dữ liệu, REST API, quản lý người dùng và xác thực, đồng thời vẫn có cache và phân phối static asset hiệu quả.',
      solution: 'Chọn Parse Platform làm backend vì cung cấp sẵn database, xác thực, lưu trữ tệp, API tự sinh và Cloud Code, giúp giảm đáng kể boilerplate. Dữ liệu lưu trên MongoDB, cache bằng Redis, Firebase cho dịch vụ phụ trợ; ứng dụng chạy trên EC2 sau Nginx, asset lưu S3 và phân phối qua CloudFront.',
      highlights: [
        'Parse Platform + ReactJS giúp ra mắt MVP nhanh, giảm khối lượng boilerplate code',
        'MongoDB cho dữ liệu, Redis cho cache',
        'Firebase cho dịch vụ phụ trợ',
        'Deploy trên AWS EC2 sau Nginx; S3 + CloudFront cho static asset',
      ],
      architecture: ['React client', 'CloudFront (static assets)', 'Nginx on EC2', 'Parse Server', 'MongoDB / Redis'],
      challenges: [
        {
          title: 'Vì sao chọn Parse Platform',
          summary: 'Parse Platform tự động hoá nhiều tác vụ lặp lại, phù hợp khi cần đưa sản phẩm ra thị trường nhanh.',
          items: [
            {
              heading: 'Tăng tốc độ ra mắt (MVP)',
              body: 'Tự động hoá các tác vụ lặp lại như mô hình hoá dữ liệu, tạo sẵn REST API, quản lý người dùng và xác thực OAuth.',
            },
            {
              heading: 'Tăng tốc độ làm sản phẩm (Time-to-market)',
              body: 'Cung cấp sẵn database, xác thực người dùng (đăng ký, đăng nhập, đặt lại mật khẩu), lưu trữ tệp, push notification và LiveQuery (cập nhật dữ liệu real-time), giúp giảm khối lượng boilerplate code.',
            },
            {
              heading: 'Tự động sinh API và hỗ trợ đa nền tảng',
              body: 'Tự động tạo REST API và GraphQL từ schema dữ liệu, kèm SDK cho nhiều nền tảng như iOS, Android, JavaScript/Node.js, Unity, .NET hay PHP.',
            },
            {
              heading: 'Tuỳ biến logic linh hoạt qua Cloud Code',
              body: 'Viết hàm xử lý phía server, database trigger và background job bằng Node.js khi cần nghiệp vụ riêng.',
            },
            {
              heading: 'Phân quyền dữ liệu tích hợp',
              body: 'Hỗ trợ Class-Level Permissions (CLP), Access Control Lists (ACL) và Protected Fields để kiểm soát quyền truy cập dữ liệu.',
            },
          ],
        },
      ],
    },
  },
  {
    slug: 'realtime-chat-mern',
    title: 'Realtime Chat App — MERN + Socket.IO',
    image: `${import.meta.env.BASE_URL}images/todo-webapp.webp`,
    description: 'Bản demo ứng dụng nhắn tin thời gian thực trên MERN stack (MongoDB, Express.js, React, Node.js) kết hợp Socket.IO. Thiết kế schema Conversation/Message để truy vấn nhanh lịch sử chat và mở rộng từ chat 1-1 sang chat nhóm; xác thực bằng JWT cho cả REST API và kết nối socket; custom hooks quản lý state phía client. Chạy sau Nginx reverse proxy và đóng gói bằng Docker.',
    technologies: ['React', 'Node', 'Express', 'MongoDB', 'Socket.IO', 'JWT', 'Nginx', 'Docker'],
    category: 'fullstack',
    githubLink: '',
    websiteLink: '',
    detail: {
      summary: 'Demo ứng dụng nhắn tin thời gian thực trên MERN stack với Socket.IO: schema chat 1-1 và nhóm, xác thực JWT cho REST và socket, chạy sau Nginx.',
      role: 'Full-Stack Developer',
      problem: 'Xây dựng ứng dụng nhắn tin thời gian thực hoạt động trơn tru đòi hỏi giải quyết các nhóm bài toán cốt lõi: thiết kế database để truy vấn nhanh lịch sử chat và mở rộng sang chat nhóm; xác thực và bảo mật để người dùng chỉ đọc và gửi tin nhắn trong phạm vi quyền hạn của mình; đồng thời giữ state phía client dễ quản lý.',
      solution: 'Dùng MongoDB với hai model Conversation và Message, JWT cho REST API và cho kết nối Socket.IO, custom hooks của React để quản lý state, Nginx làm reverse proxy và Docker để đóng gói deploy.',
      highlights: [
        'Giao tiếp realtime bằng Socket.IO',
        'Schema Conversation/Message hỗ trợ chat 1-1 và chat nhóm, lưu lastMessage để hiển thị nhanh danh sách hội thoại',
        'JWT bảo vệ REST API và xác thực kết nối socket qua socket.handshake.auth',
        'Custom hooks quản lý state hiệu quả',
        'Nginx reverse proxy phía trước, Dockerized để deploy',
      ],
      architecture: ['React client', 'Nginx reverse proxy', 'Node/Express + Socket.IO', 'MongoDB'],
      challenges: [
        {
          title: '1. Thiết kế cơ sở dữ liệu (Database Schema Design)',
          summary: 'Cấu trúc dữ liệu trên MongoDB cần tối ưu để truy vấn nhanh lịch sử chat và hỗ trợ mở rộng từ chat 1-1 sang chat nhóm.',
          items: [
            {
              heading: 'Conversation (hoặc Room) model',
              body: 'Quản lý danh sách người tham gia (participants), phân biệt chat 1-1 hay nhóm (isGroupChat), và lưu lastMessage để hiển thị nhanh ở danh sách bên ngoài.',
            },
            {
              heading: 'Message model',
              body: 'Lưu nội dung tin nhắn, người gửi (senderId), cuộc hội thoại tương ứng (conversationId), loại tin nhắn (text, hình ảnh, file) và trạng thái đã xem (seenBy).',
            },
          ],
        },
        {
          title: '2. Xác thực và bảo mật kết nối (Authentication & Socket Auth)',
          summary: 'Hệ thống cần đảm bảo người dùng chỉ đọc và gửi được tin nhắn trong phạm vi quyền hạn của mình.',
          items: [
            {
              heading: 'Xác thực REST API',
              body: 'Sử dụng JWT (JSON Web Token) để đăng ký, đăng nhập và bảo vệ các API lấy danh sách hội thoại hoặc lịch sử tin nhắn.',
            },
            {
              heading: 'Xác thực kết nối Socket',
              body: 'Gửi kèm JWT qua socket.handshake.auth khi client khởi tạo kết nối WebSocket, để server định danh chính xác userId của kết nối đó.',
            },
          ],
        },
      ],
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
    slug: 'portfolio-website',
    featured: true,
    title: 'Portfolio Website — React, Vite & GitHub Pages',
    image: `${import.meta.env.BASE_URL}images/portfolio-website.webp`,
    description: 'Chính trang portfolio này: SPA theme cyber-terminal bằng React 18, TypeScript và Vite, không backend. Build xong tự prerender 23 trang HTML tĩnh kèm title, meta, canonical, Open Graph, sitemap.xml và robots.txt để Google đọc được từng route. Deploy tự động bằng GitHub Actions lên GitHub Pages với tên miền riêng profile.247.id.vn.',
    technologies: ['React', 'TypeScript', 'Vite', 'React Router', 'Tailwind CSS', 'Framer Motion', 'highlight.js', 'GitHub Actions', 'GitHub Pages', 'SEO', 'Web3Forms'],
    category: 'fullstack',
    githubLink: 'https://github.com/dev198x/datdao-devops-portfolio',
    websiteLink: 'https://profile.247.id.vn/',
    detail: {
      summary: 'Portfolio cá nhân dạng SPA tĩnh: theme cyber-terminal, prerender cho SEO, CI/CD tự động lên GitHub Pages, không cần backend.',
      role: 'Design, Development & Deployment',
      problem: 'Cần một nơi trình bày kỹ năng, dự án và bài viết kỹ thuật, chạy gần như miễn phí và không phải vận hành server. SPA thuần có hai điểm yếu trên GitHub Pages: đường dẫn sâu như /blog/<slug> không có file thật nên bị trả HTTP 404 (Google coi là trang không tồn tại), và mọi trang đều dùng chung một title/meta.',
      solution: 'React + TypeScript + Vite cho giao diện; nội dung tách khỏi component vào src/data. Sau vite build, script prerender dựng sẵn dist/<route>/index.html cho từng route với title, description, canonical và Open Graph riêng, cộng sitemap.xml và robots.txt. GitHub Actions build và deploy lên GitHub Pages ở tên miền riêng; Vercel vẫn được hỗ trợ qua vercel.json.',
      highlights: [
        'Stack gọn: React 18, TypeScript, Vite 6, React Router 6, Tailwind CSS, Framer Motion; không backend, không database',
        'Prerender sau build: 23 trang HTML tĩnh (trang chính, /projects/<slug>, /blog/<slug>) trả HTTP 200 thay vì 404, mỗi trang có title, meta, canonical, Open Graph riêng',
        'Tự sinh sitemap.xml và robots.txt từ cùng nguồn dữ liệu; thêm dự án hoặc bài viết mới không cần sửa tay',
        'CI/CD bằng GitHub Actions: push vào main là build và deploy lên GitHub Pages, tên miền riêng profile.247.id.vn',
        'Blog tự viết renderer nhẹ và CodeBlock dùng highlight.js (chỉ đăng ký sql, javascript, bash, lua, json để bundle nhỏ)',
        'Theme terminal bằng Tailwind (primary, bg-page, bg-surface), hiệu ứng gõ chữ và nền CSS thuần, không dùng Three.js',
        'Form liên hệ gửi thẳng tới Web3Forms từ client, key đưa qua biến môi trường VITE_WEB3FORMS_KEY và GitHub secret, không cần backend',
        'Hỗ trợ cả GitHub Pages (copy index.html thành 404.html) và Vercel (rewrite về /index.html)',
      ],
      architecture: [
        'Content: src/data/portfolio.ts, src/data/blog.ts',
        'React SPA (Vite, React Router, Tailwind)',
        'Build: tsc + vite build + prerender.mjs',
        'dist/<route>/index.html + sitemap.xml + robots.txt',
        'GitHub Actions → GitHub Pages (custom domain)',
      ],
      challenges: [
        {
          title: 'SPA trên GitHub Pages bị trả 404 cho đường dẫn sâu',
          summary: 'GitHub Pages chỉ biết file thật. Mở thẳng /blog/<slug> sẽ nhận 404.html kèm HTTP 404, dù React vẫn render đúng; công cụ tìm kiếm hiểu là trang không tồn tại.',
          items: [
            {
              heading: 'Prerender từng route thành file HTML thật',
              body: 'Script chạy ngay sau vite build, đọc danh sách slug từ src/data rồi ghi dist/<route>/index.html. Mỗi file có title, description, canonical và Open Graph riêng nên Google đọc được trước khi chạy JavaScript. Đường dẫn không có trong danh sách vẫn rơi về 404.html, đúng với ý nghĩa HTTP.',
              examples: [
                {
                  language: 'json',
                  caption: 'package.json: prerender chạy sau build',
                  code: `{
  "scripts": {
    "build": "tsc && vite build && node scripts/prerender.mjs"
  }
}`,
                },
                {
                  language: 'bash',
                  caption: 'Kết quả build',
                  code: `prerender: 23 pages, sitemap.xml and robots.txt written to dist/`,
                },
              ],
            },
            {
              heading: 'Vẫn giữ SPA fallback cho mọi host',
              body: 'Workflow copy dist/index.html thành 404.html để client-side routing hoạt động trên GitHub Pages; vercel.json rewrite mọi đường dẫn về /index.html cho Vercel.',
              examples: [
                {
                  language: 'bash',
                  caption: 'GitHub Actions: bước cuối của job build',
                  code: `npm run build
cp dist/index.html dist/404.html`,
                },
              ],
            },
          ],
        },
        {
          title: 'Một nguồn dữ liệu cho cả giao diện và SEO',
          summary: 'Nội dung không nằm trong component mà trong src/data, nên cùng một nguồn nuôi cả trang web, prerender và sitemap.',
          items: [
            {
              heading: 'Thêm nội dung không cần bước thủ công',
              points: [
                'Thêm một dự án vào PROJECTS hoặc một bài vào blogPosts là có sẵn route, trang tĩnh, canonical và dòng trong sitemap',
                'Slug là URL công khai: chữ thường ASCII, dùng dấu gạch nối, không trùng và không đổi sau khi đã đăng',
                'URL cũ dạng /blog/{id} chuyển hướng sang slug để không gãy liên kết',
              ],
            },
          ],
        },
        {
          title: 'Giữ bundle nhỏ và bảo mật khi không có backend',
          summary: 'Mọi thứ gửi xuống trình duyệt đều là công khai, nên chỉ đưa vào đó những gì được phép.',
          items: [
            {
              heading: 'Quyết định kỹ thuật',
              points: [
                'highlight.js chỉ đăng ký 5 ngôn ngữ thực sự dùng trong bài viết thay vì nạp toàn bộ',
                'Nền terminal dùng CSS và DOM thuần thay vì Three.js để tránh thêm dependency nặng',
                'Form liên hệ dùng Web3Forms với public access key; không có secret nào nằm trong source, CI dùng GitHub secret',
                'Quyền CI tối thiểu: contents read, pages write, id-token write',
              ],
            },
          ],
        },
      ],
    },
  },
];

export interface Certification {
  name: string;
  issuer: string;
  year: string;
  /** Public credential page (Credly). */
  link: string;
  /** Badge image under public/images; optional. */
  image?: string;
  /** Short list of what the certification covers, shown on the Skills page. */
  covers?: string[];
}

export const CERTIFICATIONS: Certification[] = [
  {
    name: 'AWS Certified Solutions Architect – Associate',
    issuer: 'Amazon Web Services',
    year: '2025',
    link: 'https://www.credly.com/earner/earned/badge/7d26b06f-c5f3-4a97-9846-1ba1d2170f4c',
    image: `${import.meta.env.BASE_URL}images/aws-certified-solutions-architect-associate.png`,
    covers: ['Resilient, secure and cost-optimized architectures', 'EC2, S3, CloudFront, ECS, Lambda, RDS', 'IAM, VPC and networking'],
  },
  {
    name: 'CCNA and MCSA',
    issuer: '',
    year: '2008 - 2009',
    link: '',
  },
];

export const CONTACT = {
  address: 'Ho Chi Minh City, Vietnam',
  // Only masked values are shipped to the browser. The full details live in the vCard QR code
  // (public/images/contact-qr.svg), which a visitor opts into by scanning it.
  phoneNo: '093-49-**-247',
  email: 'datd****s1@gmail.com',
  qrImage: `${import.meta.env.BASE_URL}images/contact-qr.svg`,
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

// Featured projects are listed first; the sort is stable, so the original order is kept within each group.
const PROJECTS_FEATURED_FIRST = [...PROJECTS].sort(
  (a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured))
);

export const PROJECTS_BY_CATEGORY = {
  all: PROJECTS_FEATURED_FIRST,
  featured: PROJECTS_FEATURED_FIRST.filter(project => project.featured),
  devops: PROJECTS_FEATURED_FIRST.filter(project => project.category === 'devops'),
  fullstack: PROJECTS_FEATURED_FIRST.filter(project => project.category === 'fullstack'),
};

export const getProjectBySlug = (slug: string | undefined): Project | undefined =>
  PROJECTS.find(project => project.slug === slug);
