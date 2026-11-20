import { motion } from 'framer-motion';
import { TerminalHeader } from '../components/TerminalHeader';
import { Typewriter } from '../components/Typewriter';
import { CERTIFICATIONS } from '../data/portfolio';
import { Award, Briefcase, Code, ExternalLink, GraduationCap, MapPin, Zap, Bot } from 'lucide-react';

interface TimelineGroup {
  label: string;
  items: string[];
}

interface TimelineItem {
  year: string;
  title: string;
  company: string;
  description?: string;
  groups?: TimelineGroup[];
  icon: typeof Code;
}

const TIMELINE: TimelineItem[] = [
  {
    year: 'May 2021 - Present',
    title: 'Senior Software Engineer – Backend, DevOps & AI Engineering',
    company: 'C2C TechHub',
    description:
      'Working across backend development, AWS infrastructure, DevOps automation, and AI-powered engineering solutions.',
    groups: [
      {
        label: 'AI Engineering',
        items: [
          'Designed and implemented an AI-powered observability and incident analysis platform for microservices.',
          'Built an automated error-scanner service that retrieves application errors from Elasticsearch and correlates them with Jaeger trace spans.',
          'Integrated the Anthropic Claude Messages API to analyze error and trace context, identify potential root causes, and generate actionable recommendations.',
          'Reduced incident investigation time by 50% for simple issues (~10 to ~5 minutes) and by 75% for complex, multi-service issues (~40 to ~10 minutes).',
          'Automated incident notifications through Slack and maintained AI analysis audit logs in PostgreSQL.',
          'Currently developing an internal company AI application using RAG and PostgreSQL Vector Database.',
          'Developed custom Claude Code subagents for security, logging, observability, and test scenario reviews.',
        ],
      },
      {
        label: 'DevOps & AWS Cloud Engineering (2025 - Present)',
        items: [
          'Manage AWS infrastructure across Development, Staging, and UAT environments with full operational control; support selected small-to-medium Production projects.',
          'Work extensively with EC2, S3, CloudFront, SES, ECS, IAM, VPC, RDS, Lambda, and CloudWatch.',
          'Write and maintain Terraform code for infrastructure management.',
          'Build and maintain GitHub Actions CI/CD pipelines, including AWS OIDC and IAM role-based authentication.',
          'Build and manage Docker images, Docker Compose environments, and Amazon ECR workflows.',
          'Automate deployment and operational tasks using Bash scripts.',
          'Investigate application and infrastructure issues using logs and AWS monitoring services.',
        ],
      },
      {
        label: 'Backend Engineering (May 2021 - Present)',
        items: [
          'Develop and maintain backend services using Node.js, TypeScript, NestJS, Express.js, and Parse Platform.',
          'Design REST APIs and microservice integrations.',
          'Work with MongoDB, PostgreSQL, Redis, and RabbitMQ.',
          'Optimize database queries and backend performance.',
          'Integrate third-party services, including payment gateways, LINE, and Google Maps.',
          'Participate in technical design, code reviews, troubleshooting, and team support.',
        ],
      },
    ],
    icon: Briefcase,
  },
  {
    year: 'May 2016 - May 2021',
    title: 'Senior Backend Developer / Sub-lead',
    company: 'Grevo',
    groups: [
      {
        label: 'Highlights',
        items: [
          'Developed backend applications and APIs using Node.js and Parse Platform.',
          'Worked with MongoDB, PostgreSQL, Redis, and React.',
          'Used Docker and AWS EC2 for application deployment.',
          'Supported technical planning, code reviews, and team collaboration.',
        ],
      },
    ],
    icon: Code,
  },
  {
    year: 'March 2008 - May 2016',
    title: 'PHP Developer / Backend Developer',
    company: 'Sunrise Software Solutions, Vitalify, PA Vietnam',
    groups: [
      {
        label: 'Highlights',
        items: [
          'Developed and maintained PHP-based web applications.',
          'Implemented backend functionality, database integration, and web application features.',
        ],
      },
    ],
    icon: Code,
  },
  {
    year: '2003 - 2008',
    title: 'Bachelor of Computer Science',
    company: 'An Giang University',
    icon: GraduationCap,
  },
];

const CORE_SKILLS = [
  { label: 'AWS & Cloud', items: 'Amazon EC2, S3, CloudFront, SES, ECS, Lambda, RDS, IAM, VPC, Route 53, CloudWatch' },
  { label: 'Infrastructure & DevOps', items: 'Terraform, Bash scripting, Linux, Docker, Docker Compose, GitHub Actions, AWS OIDC, Amazon ECR, PM2, Nginx' },
  { label: 'AI & LLM Engineering', items: 'Anthropic Claude API, Claude Messages API, LLM integration, prompt engineering, RAG, Vector Databases, AI-powered error analysis, AI agents, Claude Code subagents, MCP' },
  { label: 'Backend Engineering', items: 'Node.js, TypeScript, NestJS, Express.js, Parse Platform, REST APIs, Microservices, PostgreSQL, MongoDB, Redis, RabbitMQ' },
  { label: 'Observability', items: 'OpenTelemetry, Jaeger, Prometheus, Grafana, Elasticsearch, Kibana, Filebeat, Pino, Distributed Tracing, Centralized Logging' },
  { label: 'Additional Exposure', items: 'Python / FastAPI (basic); Kubernetes / Helm (basic, development environment); PHP (previous professional experience)' },
];

const AI_PROJECTS = [
  {
    title: 'AI-Powered Observability & Incident Analysis Platform',
    status: 'Implemented and used in a real environment',
    role: 'Backend, AI Integration & Infrastructure Engineering',
    stack: 'TypeScript, NestJS, Next.js 15, Anthropic Claude Messages API, OpenTelemetry, Jaeger, Prometheus, Grafana, Elasticsearch, Kibana, PostgreSQL, Slack, Docker, AWS EC2',
    links: [
      { label: 'Technology Stack', href: 'https://obs.247.id.vn/tech-stack' },
      { label: 'Observability Logs & Tracing', href: 'https://obs.247.id.vn/obs' },
    ],
    highlights: [
      'Designed a TypeScript pnpm monorepo with three NestJS microservices: auth-service, product-service, and payment-service.',
      'Implemented distributed tracing with OpenTelemetry and Jaeger, metrics monitoring with Prometheus and Grafana, and centralized logging with Pino, Filebeat, Elasticsearch, and Kibana.',
      'Built request-ID and trace-ID correlation across microservices to connect logs and distributed traces.',
      'Developed an automated error-scanner service that periodically retrieves Elasticsearch errors and correlates them with Jaeger trace spans.',
      'Integrated the Anthropic Claude Messages API for AI-powered root-cause analysis and actionable incident recommendations.',
      'Delivered incident alerts to Slack and recorded analysis activities in PostgreSQL.',
      'Average investigation time dropped from 10 to 5 minutes for simple tasks and from 40 to 10 minutes for complex tasks, by eliminating manual log searching and trace cross-referencing.',
      'Applied security practices including PII and credential masking, internal service authentication, DTO validation, and parameterized database queries.',
      'Created seven custom Claude Code subagents to support security, logging, dashboard, Dockerfile, and testing reviews.',
    ],
    architecture: 'Microservices → OpenTelemetry / Structured Logging → Jaeger / Prometheus / Elasticsearch → Error Scanner → Claude AI Analysis → Slack Alerts',
  },
  {
    title: 'Internal AI for Company Knowledge Management',
    status: 'In Development',
    role: 'AI Application & Backend Engineering',
    stack: 'Retrieval-Augmented Generation (RAG), PostgreSQL Vector Database',
    links: [],
    highlights: [
      'Developing an internal AI application to support company knowledge retrieval and information access.',
      'Exploring RAG architecture to retrieve relevant knowledge and provide contextual information to an LLM.',
      'Using PostgreSQL as the vector database for storing and retrieving vector embeddings.',
      'Objective: enable employees to retrieve relevant internal knowledge through an AI-powered interface.',
    ],
    architecture: '',
  },
  {
    title: 'Multi-Agent Software Engineering Workflow',
    status: '',
    role: '',
    stack: 'Claude Code, LLM APIs, MCP, AI Agents',
    links: [],
    highlights: [
      'Explore and develop AI-assisted software engineering workflows using specialized agents for software development tasks, technical analysis, security review, and verification.',
    ],
    architecture: '',
  },
];

const CAPABILITIES = [
  {
    title: 'Technical problem solving',
    description: 'Breaking down complex technical problems and driving them to a working solution.',
  },
  {
    title: 'Business domain understanding',
    description: 'Understanding sales, booking, and inventory workflows, not just the code behind them.',
  },
  {
    title: 'Production monitoring',
    description: 'Monitoring production systems with Logs, Tracing, Metrics, and Health checks.',
  },
  {
    title: 'Requirements analysis for fast MVPs',
    description: "Analyzing customers' user stories to help them ship an MVP to market quickly.",
  },
  {
    title: 'Cross-functional collaboration',
    description: 'Working closely with QC, PM, Developers, and DevOps.',
  },
  {
    title: 'Team task allocation',
    description: 'Dividing work so teammates stay motivated, work effectively, and grow together.',
  },
  {
    title: 'Learning from teammates',
    description: 'Learning from every team member, whether younger or older, and open to ideas regardless of seniority.',
  },
  {
    title: 'Working with AI agents',
    description: 'Using AI agents as part of everyday engineering work.',
  },
];

export const About = () => {

  const philosophyPoints = [
    {
      icon: Zap,
      title: 'Automation First',
      description: 'Every manual process should be automated, every deployment should be reproducible.',
    },
    {
      icon: Code,
      title: 'Infrastructure as Code',
      description: 'Treat infrastructure with the same discipline as application code.',
    },
    {
      icon: MapPin,
      title: 'Cloud Native',
      description: 'Build for the cloud from day one, embrace containerization and orchestration.',
    },
  ];

  return (
    <div className="min-h-screen bg-bg-page">
      {/* Terminal Header */}
      <TerminalHeader
        command="cat about.txt"
        description="Displaying professional background and technical philosophy"
      />

      {/* Bio Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 items-start">
            {/* Bio Text */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="lg:col-span-7 space-y-8"
            >
              <div className="bg-bg-surface border border-neutral-700 rounded-xl p-8 shadow-card">
                <div className="font-mono text-lg mb-6">
                  <span className="text-accent-500">$</span>
                  <span className="text-primary-500"> cat</span>
                  <span className="text-neutral-400"> bio.txt</span>
                </div>
                <div className="space-y-4 text-neutral-200 leading-relaxed">
                  <Typewriter
                    text="Hello, I'm Dat Dao, a Software Engineer with 10+ years of experience in backend development, system architecture, and cloud engineering."
                    delay={30}
                    className="text-primary-500 font-semibold block mb-4"
                  />
                  <p>
                    I have approximately <span className="text-primary-500">2 years of hands-on DevOps experience</span>, with strong practical skills
                    in AWS, Terraform, Bash scripting, Node.js, TypeScript, Docker, and GitHub Actions.
                  </p>
                  <p>
                    I build <span className="text-primary-500">AI-powered engineering solutions</span>, including a production-used observability
                    platform that integrates the Anthropic Claude Messages API with application logs and distributed traces, cutting incident
                    investigation time by 50–75%.
                  </p>
                  <p>
                    I am currently developing an internal AI application for company knowledge retrieval using{' '}
                    <span className="text-primary-500">Retrieval-Augmented Generation (RAG)</span> and PostgreSQL Vector Database.
                  </p>
                  <div className="pt-2">
                    <div className="font-mono text-sm text-accent-500 mb-3">$ ls capabilities/</div>
                    <ul className="space-y-3">
                      {CAPABILITIES.map((item) => (
                        <li key={item.title} className="flex items-start space-x-3">
                          <span className="font-mono text-primary-500 mt-0.5">&gt;</span>
                          <span>
                            <span className="text-primary-500 font-medium">{item.title}</span>
                            <span className="text-neutral-400"> — {item.description}</span>
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <p className="text-primary-500 font-medium">
                    I combine software engineering, cloud infrastructure, and AI integration experience to build practical engineering solutions.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="lg:col-span-5 space-y-6"
            >
              <div className="bg-bg-elevated border border-neutral-700 rounded-xl p-6">
                <h3 className="font-mono text-primary-500 font-semibold mb-4 text-lg">
                  Quick Stats
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-400">Experience</span>
                    <span className="text-primary-500 font-mono text-right">10+ years</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-400">DevOps</span>
                    <span className="text-primary-500 font-mono text-right">~2 years</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-400">Certification</span>
                    <span className="text-primary-500 font-mono text-right">AWS SA Associate (2025)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-400">Incident Analysis</span>
                    <span className="text-primary-500 font-mono text-right">50–75% faster</span>
                  </div>
                </div>
              </div>

              <div className="bg-bg-elevated border border-neutral-700 rounded-xl p-6">
                <h3 className="font-mono text-primary-500 font-semibold mb-4 text-lg">
                  Specializations
                </h3>
                <div className="flex flex-wrap gap-2">
                  {[
  'Backend Engineering',
  'AI & LLM Engineering',
  'RAG & Vector Databases',
  'AWS Cloud Engineering',
  'Infrastructure as Code',
  'CI/CD Automation',
  'Observability',
  'Claude Code & MCP'
].map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 bg-neutral-800 text-neutral-200 text-sm rounded-md border border-neutral-700 hover:border-primary-500/50 transition-colors"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-24 bg-bg-surface/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-mono text-3xl md:text-4xl font-bold text-primary-500 mb-4">
              Career Timeline
            </h2>
            <p className="text-neutral-400 max-w-2xl mx-auto">
              Professional experience and education
            </p>
          </motion.div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary-500 via-primary-700 to-transparent" />

            <div className="space-y-12">
              {TIMELINE.map((item, index) => {
                const IconComponent = item.icon;
                const isEven = index % 2 === 0;
                
                return (
                  <motion.div
                    key={`${item.year}-${item.title}`}
                    initial={{ opacity: 0, x: isEven ? -50 : 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.6 }}
                    viewport={{ once: true }}
                    className={`relative flex items-center ${
                      isEven ? 'md:flex-row' : 'md:flex-row-reverse'
                    }`}
                  >
                    {/* Timeline dot */}
                    <div className="absolute left-4 md:left-1/2 transform md:-translate-x-1/2 w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center border-4 border-bg-page shadow-glow z-10">
                      <IconComponent size={16} className="text-bg-surface" />
                    </div>

                    {/* Content */}
                    <div className={`ml-16 md:ml-0 md:w-1/2 ${isEven ? 'md:pr-12' : 'md:pl-12'}`}>
                      <div className="bg-bg-elevated border border-neutral-700 rounded-lg p-6 hover:border-primary-500/50 transition-colors shadow-card">
                        <div className="font-mono text-accent-500 text-sm mb-2">{item.year}</div>
                        <h3 className="font-semibold text-xl text-neutral-200 mb-1">{item.title}</h3>
                        {item.company && (
  <div className="text-primary-500 font-medium mb-3">
    {item.company}
  </div>
)}
                        {item.description && (
                          <p className="text-neutral-400 text-sm leading-relaxed">{item.description}</p>
                        )}
                        {item.groups?.map((group) => (
                          <div key={group.label} className="mt-4">
                            <div className="font-mono text-xs text-accent-500 mb-2">{group.label}</div>
                            <ul className="space-y-1.5">
                              {group.items.map((point) => (
                                <li key={point} className="flex items-start space-x-2 text-neutral-400 text-sm leading-relaxed">
                                  <span className="font-mono text-primary-500">&gt;</span>
                                  <span>{point}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Core Skills Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-mono text-3xl md:text-4xl font-bold text-primary-500 mb-4">Core Technical Skills</h2>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-6">
            {CORE_SKILLS.map((group, index) => (
              <motion.div
                key={group.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.5 }}
                viewport={{ once: true }}
                className="bg-bg-elevated border border-neutral-700 rounded-xl p-6 hover:border-primary-500/50 transition-colors"
              >
                <h3 className="font-mono text-primary-500 font-semibold mb-2">{group.label}</h3>
                <p className="text-neutral-400 text-sm leading-relaxed">{group.items}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Selected AI Projects Section */}
      <section className="py-24 bg-bg-surface/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-mono text-3xl md:text-4xl font-bold text-primary-500 mb-4">Selected AI Projects</h2>
          </motion.div>
          <div className="space-y-8">
            {AI_PROJECTS.map((project, index) => (
              <motion.div
                key={project.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
                className="bg-bg-elevated border border-neutral-700 rounded-xl p-6 sm:p-8 hover:border-primary-500/50 transition-colors"
              >
                <div className="flex items-start space-x-3 mb-4">
                  <Bot size={22} className="text-primary-500 mt-1 shrink-0" />
                  <h3 className="font-semibold text-xl text-neutral-200">{index + 1}. {project.title}</h3>
                </div>
                <dl className="space-y-1 text-sm mb-4">
                  {project.status && (
                    <div className="flex gap-2"><dt className="font-mono text-accent-500">Status:</dt><dd className="text-neutral-300">{project.status}</dd></div>
                  )}
                  {project.role && (
                    <div className="flex gap-2"><dt className="font-mono text-accent-500">Role:</dt><dd className="text-neutral-300">{project.role}</dd></div>
                  )}
                  <div className="flex gap-2"><dt className="font-mono text-accent-500 shrink-0">Stack:</dt><dd className="text-neutral-300">{project.stack}</dd></div>
                </dl>
                <ul className="space-y-1.5 mb-4">
                  {project.highlights.map((point) => (
                    <li key={point} className="flex items-start space-x-2 text-neutral-400 text-sm leading-relaxed">
                      <span className="font-mono text-primary-500">&gt;</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
                {project.architecture && (
                  <div className="bg-bg-surface border border-neutral-700 rounded-lg p-4 font-mono text-xs text-neutral-300 leading-relaxed mb-4">
                    <span className="text-accent-500">Architecture: </span>
                    {project.architecture}
                  </div>
                )}
                {project.links.length > 0 && (
                  <div className="flex flex-wrap gap-4">
                    {project.links.map((link) => (
                      <a
                        key={link.href}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-2 text-sm font-mono text-primary-500 hover:text-primary-400 transition-colors"
                      >
                        <ExternalLink size={14} />
                        <span>Live Demo: {link.label}</span>
                      </a>
                    ))}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-mono text-3xl md:text-4xl font-bold text-primary-500 mb-4">Certifications</h2>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {CERTIFICATIONS.map((cert) => (
              <div
                key={cert.name}
                className="bg-bg-elevated border border-neutral-700 rounded-xl p-6 hover:border-primary-500/50 transition-colors"
              >
                {cert.image ? (
                  <img
                    src={cert.image}
                    alt={`${cert.name} badge`}
                    width={96}
                    height={96}
                    loading="lazy"
                    className="h-24 w-24 mb-3"
                  />
                ) : (
                  <Award size={24} className="text-primary-500 mb-3" />
                )}
                <h3 className="font-semibold text-neutral-200 mb-1">{cert.name}</h3>
                <div className="text-sm text-neutral-400">
                  {[cert.issuer, cert.year].filter(Boolean).join(' | ')}
                </div>
                {cert.link && (
                  <a
                    href={cert.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 mt-3 text-sm font-mono text-primary-500 hover:text-primary-400 transition-colors"
                  >
                    <ExternalLink size={14} />
                    <span>View credential</span>
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-24 bg-bg-surface/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-mono text-3xl md:text-4xl font-bold text-primary-500 mb-4">
              Tech Philosophy
            </h2>
            <p className="text-neutral-400 max-w-2xl mx-auto">
              Core principles that guide my approach to software engineering and DevOps
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {philosophyPoints.map((point, index) => {
              const IconComponent = point.icon;
              return (
                <motion.div
                  key={point.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  viewport={{ once: true }}
                  className="bg-bg-elevated border border-neutral-700 rounded-xl p-8 text-center hover:border-primary-500/50 transition-all duration-300 group"
                >
                  <div className="w-16 h-16 bg-primary-500/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-primary-500/20 transition-colors">
                    <IconComponent size={32} className="text-primary-500" />
                  </div>
                  <h3 className="font-semibold text-xl text-neutral-200 mb-4">{point.title}</h3>
                  <p className="text-neutral-400 leading-relaxed">{point.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};
