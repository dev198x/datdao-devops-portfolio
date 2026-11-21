import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ExternalLink, Github, Code2, Bot, Award, Database, ArrowRight } from 'lucide-react';
import { HERO_CONTENT, SKILLS, PROJECTS, CONTACT } from '../data/portfolio';

export const Home = () => {
  const stats = [
    { label: 'Years Experience', value: '10+' },
    { label: 'Projects', value: String(PROJECTS.length) },
    { label: 'Technologies', value: String(SKILLS.length) },
    { label: 'Faster Incident Investigation', value: '50–75%' },
  ];

  // Highlight order: Backend -> AI -> Cloud/DevOps -> Observability
  const FEATURED_SKILL_NAMES = [
    'Node.js', 'Typescript', 'NestJS', 'PostgreSQL',
    'Claude API', 'Retrieval-Augmented Generation (RAG)',
    'AWS', 'Terraform', 'Docker', 'GitHub Actions',
    'OpenTelemetry', 'Grafana',
  ];

  const highlights = [
    {
      icon: Bot,
      title: 'AI-Powered Observability',
      description: 'Claude Messages API on logs and distributed traces for root-cause analysis, used in a real environment. Investigation time cut by 50–75%.',
      to: '/projects/ai-observability-platform',
      cta: 'View project',
    },
    {
      icon: Award,
      title: 'AWS Certified Solutions Architect – Associate',
      description: 'Certified in 2025, with hands-on AWS work across EC2, S3, CloudFront, ECS, Lambda, RDS, IAM, and VPC using Terraform and GitHub Actions.',
      to: '/about',
      cta: 'See background',
    },
    {
      icon: Database,
      title: 'Internal Knowledge AI (in development)',
      description: 'RAG application on a PostgreSQL vector database so employees can retrieve internal company knowledge through an AI interface.',
      to: '/about',
      cta: 'Learn more',
    },
  ];
  const featuredSkills = FEATURED_SKILL_NAMES
    .map((name) => SKILLS.find((skill) => skill.name === name))
    .filter((skill): skill is (typeof SKILLS)[number] => Boolean(skill));

  return (
    <div className="bg-bg-page">
      {/* Hero */}
      <section className="border-b border-neutral-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-20 md:pt-28 md:pb-24">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="max-w-3xl"
          >
            <p className="font-mono text-sm text-neutral-500 mb-5">
              <span className="mr-2 select-none">$</span>whoami
            </p>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-neutral-200 leading-[1.08]">
              Backend, DevOps &amp; AI Engineer
            </h1>
            <p className="mt-6 text-lg md:text-xl text-neutral-400 leading-relaxed max-w-2xl">
              {HERO_CONTENT}
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-3">
              <Link
                to="/projects"
                className="inline-flex items-center justify-center px-6 py-3 rounded-md bg-primary-500 text-white text-sm font-semibold hover:bg-primary-700 transition-colors"
              >
                <Code2 className="mr-2 h-4 w-4" />
                View Projects
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center px-6 py-3 rounded-md border border-neutral-700 bg-white text-neutral-200 text-sm font-semibold hover:bg-neutral-50 transition-colors"
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                Contact Me
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-neutral-700 bg-bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <dl className="grid grid-cols-2 md:grid-cols-4 divide-x divide-neutral-700">
            {stats.map((stat) => (
              <div key={stat.label} className="flex flex-col-reverse justify-end px-6 py-8 first:pl-0">
                <dt className="text-sm text-neutral-400">{stat.label}</dt>
                <dd className="mt-1 text-3xl font-bold tracking-tight text-neutral-200 tabular-nums">
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Highlights */}
      <section className="pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10 max-w-2xl">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-neutral-200">Highlights</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {highlights.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="bg-white border border-neutral-700 rounded-lg p-6 flex flex-col transition-colors hover:border-neutral-600"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary-50 text-primary-500 mb-5">
                    <Icon size={20} />
                  </div>
                  <h3 className="font-semibold text-lg text-neutral-200 mb-2">{item.title}</h3>
                  <p className="text-neutral-400 text-sm leading-relaxed flex-1">{item.description}</p>
                  <Link
                    to={item.to}
                    className="inline-flex items-center gap-1.5 mt-5 text-sm font-semibold text-primary-500 hover:text-primary-700"
                  >
                    {item.cta}
                    <ArrowRight size={14} />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured technologies */}
      <section className="pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10 max-w-2xl">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-neutral-200">
              Featured Technologies
            </h2>
            <p className="mt-3 text-neutral-400">
              From backend and AI to cloud, DevOps, and observability: the technologies I use to build, ship, and run production systems
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {featuredSkills.map((skill) => (
              <div
                key={skill.name}
                className="bg-white border border-neutral-700 p-4 rounded-lg text-center transition-colors hover:border-neutral-600"
              >
                <img src={skill.icon} alt={skill.name} className="w-8 h-8 mx-auto mb-3" />
                <div className="text-sm text-neutral-200 font-medium">{skill.name}</div>
              </div>
            ))}
          </div>

          <div className="mt-8">
            <Link
              to="/skills"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-500 hover:text-primary-700"
            >
              View all skills
              <ExternalLink size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* Closing */}
      <section className="pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-bg-surface border border-neutral-700 rounded-lg p-8 md:p-12 flex flex-col md:flex-row md:items-center md:justify-between gap-8">
            <div className="max-w-2xl">
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-neutral-200">
                Ready to Deploy Your Vision?
              </h2>
              <p className="mt-3 text-neutral-400 leading-relaxed">
                Let's build something amazing together. From infrastructure automation to full-stack development,
                I'm here to turn your ideas into production reality.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <Link
                to="/contact"
                className="inline-flex items-center justify-center px-6 py-3 rounded-md bg-primary-500 text-white text-sm font-semibold hover:bg-primary-700 transition-colors"
              >
                Start a Project
              </Link>
              <a
                href={CONTACT.social.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-md border border-neutral-700 bg-white text-neutral-200 text-sm font-semibold hover:bg-neutral-50 transition-colors"
              >
                <Github className="h-4 w-4" />
                View Code
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
