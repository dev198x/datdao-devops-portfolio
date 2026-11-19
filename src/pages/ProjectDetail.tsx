import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, ExternalLink, Github, Layers, User, Tag, Star } from 'lucide-react';
import { TerminalHeader } from '../components/TerminalHeader';
import { PROJECTS_BY_CATEGORY, getProjectBySlug } from '../data/portfolio';

const SectionTitle = ({ cmd }: { cmd: string }) => (
  <h2 className="font-mono text-lg text-accent-500 mb-4">
    <span className="mr-2">$</span>
    {cmd}
  </h2>
);

export const ProjectDetail = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const project = getProjectBySlug(projectId);

  if (!project) {
    return (
      <div className="min-h-screen bg-bg-page">
        <TerminalHeader command={`cat projects/${projectId ?? ''}`} description="No such file or directory" />
        <div className="max-w-3xl mx-auto px-4 py-24 text-center">
          <div className="font-mono text-5xl text-neutral-600 mb-4">404</div>
          <p className="text-neutral-400 mb-8">Project not found.</p>
          <Link
            to="/projects"
            className="inline-flex items-center space-x-2 font-mono text-primary-500 hover:text-primary-400"
          >
            <ArrowLeft size={16} />
            <span>cd ../projects</span>
          </Link>
        </div>
      </div>
    );
  }

  // Same order as the list page, so prev/next match what the visitor just browsed.
  const ordered = PROJECTS_BY_CATEGORY.all;
  const index = ordered.findIndex((p) => p.slug === project.slug);
  const prev = ordered[(index - 1 + ordered.length) % ordered.length];
  const next = ordered[(index + 1) % ordered.length];
  const { detail } = project;
  const categoryLabel = project.category === 'devops' ? 'DevOps' : 'Full-Stack';

  return (
    <div className="min-h-screen bg-bg-page">
      <TerminalHeader command={`cat projects/${project.slug}/README.md`} description={detail.summary} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link
          to="/projects"
          className="inline-flex items-center space-x-2 font-mono text-sm text-neutral-400 hover:text-primary-500 transition-colors mb-8"
        >
          <ArrowLeft size={16} />
          <span>cd ../projects</span>
        </Link>

        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-bg-surface border border-neutral-700 rounded-xl overflow-hidden mb-12"
        >
          <div className="relative aspect-[21/9] overflow-hidden">
            <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-bg-surface via-bg-surface/30 to-transparent" />
          </div>
          <div className="p-6 sm:p-8 space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`inline-block px-3 py-1 rounded-full text-xs font-mono font-medium ${
                  project.category === 'devops'
                    ? 'bg-green-500/20 text-green-500 border border-green-500/30'
                    : 'bg-blue-500/20 text-blue-500 border border-blue-500/30'
                }`}
              >
                {categoryLabel}
              </span>
              {project.featured && (
                <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-mono font-medium bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
                  <Star size={12} className="fill-current" />
                  <span>Featured</span>
                </span>
              )}
            </div>
            <h1 className="font-mono text-2xl sm:text-4xl font-bold text-primary-500">{project.title}</h1>
            {(project.githubLink || project.websiteLink) && (
              <div className="flex flex-wrap gap-4 pt-2">
                {project.githubLink && (
                  <a
                    href={project.githubLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 px-4 py-2 border border-neutral-600 rounded-lg text-neutral-200 hover:border-primary-500 hover:text-primary-500 transition-colors font-mono text-sm"
                  >
                    <Github size={16} />
                    <span>Source Code</span>
                  </a>
                )}
                {project.websiteLink && (
                  <a
                    href={project.websiteLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 px-4 py-2 bg-primary-500 text-bg-surface rounded-lg hover:bg-primary-700 transition-colors font-mono text-sm"
                  >
                    <ExternalLink size={16} />
                    <span>Live Demo</span>
                  </a>
                )}
              </div>
            )}
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main column */}
          <div className="lg:col-span-2 space-y-10">
            <section>
              <SectionTitle cmd="cat overview.md" />
              <p className="text-neutral-200 leading-relaxed">{project.description}</p>
            </section>

            <section>
              <SectionTitle cmd="cat problem.md" />
              <p className="text-neutral-200 leading-relaxed">{detail.problem}</p>
            </section>

            <section>
              <SectionTitle cmd="cat solution.md" />
              <p className="text-neutral-200 leading-relaxed">{detail.solution}</p>
            </section>

            {detail.challenges && detail.challenges.length > 0 && (
              <section>
                <SectionTitle cmd="ls challenges/" />
                <div className="space-y-8">
                  {detail.challenges.map((challenge) => (
                    <div key={challenge.title} className="space-y-4">
                      <h3 className="font-mono text-primary-500 text-lg font-semibold">{challenge.title}</h3>
                      {challenge.summary && <p className="text-neutral-300 leading-relaxed">{challenge.summary}</p>}
                      <div className="space-y-4">
                        {challenge.items.map((item) => (
                          <div
                            key={item.heading}
                            className="bg-bg-surface border border-neutral-700 rounded-xl p-5 space-y-3"
                          >
                            <h4 className="font-semibold text-neutral-200">{item.heading}</h4>
                            {item.body && <p className="text-neutral-400 text-sm leading-relaxed">{item.body}</p>}
                            {item.code && (
                              <pre className="bg-bg-page border border-neutral-700 rounded-lg p-3 overflow-x-auto font-mono text-xs text-primary-500 whitespace-pre-wrap">
                                {item.code}
                              </pre>
                            )}
                            {item.points && (
                              <ul className="space-y-1.5">
                                {item.points.map((point) => (
                                  <li key={point} className="flex items-start space-x-2 text-neutral-400 text-sm leading-relaxed">
                                    <span className="font-mono text-primary-500">&gt;</span>
                                    <span>{point}</span>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            <section>
              <SectionTitle cmd="ls highlights/" />
              <ul className="space-y-2">
                {detail.highlights.map((item) => (
                  <li key={item} className="flex items-start space-x-3 text-neutral-200">
                    <span className="font-mono text-primary-500 mt-0.5">&gt;</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <SectionTitle cmd="show architecture --flow" />
              <ol className="bg-bg-surface border border-neutral-700 rounded-xl p-6 font-mono text-sm space-y-2">
                {detail.architecture.map((step, i) => (
                  <li key={step} className="space-y-2">
                    <div className="text-neutral-200">
                      <span className="text-primary-500 mr-2">[{i + 1}]</span>
                      {step}
                    </div>
                    {i < detail.architecture.length - 1 && <div className="text-neutral-600 pl-2">↓</div>}
                  </li>
                ))}
              </ol>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6 lg:sticky lg:top-24 self-start">
            <div className="bg-bg-surface border border-neutral-700 rounded-xl p-6 space-y-4">
              <h3 className="font-mono text-primary-500 flex items-center space-x-2">
                <Layers size={16} />
                <span>tech_stack</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="px-2 py-1 bg-neutral-800 text-neutral-300 text-xs rounded border border-neutral-700"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-bg-surface border border-neutral-700 rounded-xl p-6 space-y-3 font-mono text-sm">
              <div className="flex items-center justify-between text-neutral-300">
                <span className="flex items-center space-x-2"><Tag size={14} /><span>Category</span></span>
                <span className="text-primary-500">{categoryLabel}</span>
              </div>
              <div className="flex items-center justify-between text-neutral-300">
                <span className="flex items-center space-x-2"><User size={14} /><span>Role</span></span>
                <span className="text-primary-500 text-right">{detail.role}</span>
              </div>
            </div>
          </aside>
        </div>

        {/* Prev / Next */}
        <nav className="grid sm:grid-cols-2 gap-4 mt-16 pt-8 border-t border-neutral-700">
          <Link
            to={`/projects/${prev.slug}`}
            className="group flex items-center space-x-3 p-4 bg-bg-surface border border-neutral-700 rounded-xl hover:border-primary-500/50 transition-colors"
          >
            <ArrowLeft size={18} className="text-neutral-400 group-hover:text-primary-500" />
            <div className="min-w-0">
              <div className="text-xs font-mono text-neutral-500">Previous</div>
              <div className="font-mono text-sm text-neutral-200 truncate">{prev.title}</div>
            </div>
          </Link>
          <Link
            to={`/projects/${next.slug}`}
            className="group flex items-center justify-end space-x-3 p-4 bg-bg-surface border border-neutral-700 rounded-xl hover:border-primary-500/50 transition-colors text-right"
          >
            <div className="min-w-0">
              <div className="text-xs font-mono text-neutral-500">Next</div>
              <div className="font-mono text-sm text-neutral-200 truncate">{next.title}</div>
            </div>
            <ArrowRight size={18} className="text-neutral-400 group-hover:text-primary-500" />
          </Link>
        </nav>
      </div>
    </div>
  );
};
