import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, ExternalLink, Bot, Rocket, Building2, Server, ShieldCheck, Activity } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { PROJECTS, getProjectBySlug } from '../data/portfolio';
import {
  BUILDER_INTRO,
  BUILDER_STRENGTHS,
  BUILDER_PROCESS,
  BUILDER_SERVICES,
  BUILDER_EVIDENCE,
  BUILDER_MONITORING,
} from '../data/builder';

// Same order as BUILDER_STRENGTHS in src/data/builder.ts.
const STRENGTH_ICONS = [Rocket, Bot, Building2, ShieldCheck, Activity, Server];

const sectionMotion = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
  viewport: { once: true },
};

export const Builder = () => {
  const evidence = BUILDER_EVIDENCE.flatMap((item) => {
    const project = getProjectBySlug(item.slug);
    return project ? [{ ...item, project }] : [];
  });

  return (
    <div className="min-h-screen bg-bg-page">
      <PageHeader
        command="cat builder.md"
        description="Builder: từ ý tưởng đến sản phẩm chạy thật, làm việc cùng AI agents"
      />

      {/* Giới thiệu */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...sectionMotion} className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-200">
              {BUILDER_INTRO.headline}
            </h2>
            {BUILDER_INTRO.paragraphs.map((text) => (
              <p key={text} className="text-lg text-neutral-300 leading-relaxed">
                {text}
              </p>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Năng lực */}
      <section className="py-24 bg-bg-surface/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...sectionMotion} className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-200 mb-4">Mình làm được gì</h2>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {BUILDER_STRENGTHS.map((item, index) => {
              const Icon = STRENGTH_ICONS[index % STRENGTH_ICONS.length];
              return (
                <motion.div
                  key={item.title}
                  {...sectionMotion}
                  className="bg-bg-elevated border border-neutral-700 rounded-xl p-6 hover:border-neutral-600 transition-colors md:[&:last-child:nth-child(odd)]:col-span-2"
                >
                  <Icon size={28} className="text-primary-500 mb-4" />
                  <h3 className="text-lg font-semibold text-neutral-200 mb-2">{item.title}</h3>
                  <p className="text-neutral-400 leading-relaxed">{item.body}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Monitoring: Grafana LGTM stack */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...sectionMotion} className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-200 mb-4">
              {BUILDER_MONITORING.title}
            </h2>
            <p className="text-neutral-400 max-w-3xl mx-auto leading-relaxed">{BUILDER_MONITORING.intro}</p>
          </motion.div>
          <div className="grid lg:grid-cols-2 gap-8">
            {BUILDER_MONITORING.figures.map((figure) => (
              <motion.figure
                key={figure.file}
                {...sectionMotion}
                className="bg-bg-elevated border border-neutral-700 rounded-xl overflow-hidden"
              >
                <img
                  src={`${import.meta.env.BASE_URL}images/${figure.file}`}
                  alt={figure.alt}
                  width={960}
                  height={540}
                  loading="lazy"
                  className="w-full h-auto border-b border-neutral-700"
                />
                <figcaption className="p-5 text-sm text-neutral-400 leading-relaxed">{figure.caption}</figcaption>
              </motion.figure>
            ))}
          </div>
        </div>
      </section>

      {/* Quy trình */}
      <section className="py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...sectionMotion} className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-200 mb-4">Cách mình làm việc</h2>
            <p className="text-neutral-400">Từ ý tưởng đến vận hành, với AI agents hỗ trợ ở từng bước</p>
          </motion.div>
          <ol className="space-y-4">
            {BUILDER_PROCESS.map((item) => (
              <motion.li
                key={item.step}
                {...sectionMotion}
                className="flex gap-6 bg-bg-elevated border border-neutral-700 rounded-xl p-6"
              >
                <span className="text-2xl font-bold text-primary-500 shrink-0">{item.step}</span>
                <div>
                  <h3 className="text-lg font-semibold text-neutral-200 mb-1">{item.title}</h3>
                  <p className="text-neutral-400 leading-relaxed">{item.body}</p>
                </div>
              </motion.li>
            ))}
          </ol>
        </div>
      </section>

      {/* Dịch vụ */}
      <section className="py-24 bg-bg-surface/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...sectionMotion} className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-200 mb-4">
              Giải pháp cho doanh nghiệp vừa và nhỏ
            </h2>
            <p className="text-neutral-400 max-w-2xl mx-auto">
              Web, app và hệ thống nội bộ, thiết kế để AI agents làm trung tâm vận hành
            </p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {BUILDER_SERVICES.map((item) => (
              <motion.div
                key={item.title}
                {...sectionMotion}
                className="bg-bg-elevated border border-neutral-700 rounded-xl p-6"
              >
                <h3 className="text-base font-semibold text-neutral-200 mb-2">
                  <span className="text-neutral-500 mr-2">&gt;</span>
                  {item.title}
                </h3>
                <p className="text-sm text-neutral-400 leading-relaxed">{item.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Bằng chứng thực tế */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...sectionMotion} className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-200 mb-4">Bằng chứng thực tế</h2>
            <p className="text-neutral-400 max-w-2xl mx-auto">
              Các sản phẩm mình đã build, bạn có thể mở và dùng thử
            </p>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {evidence.map(({ project, proves, status }) => (
              <motion.div
                key={project.slug}
                {...sectionMotion}
                className="flex flex-col bg-bg-elevated border border-neutral-700 rounded-xl overflow-hidden hover:border-neutral-600 transition-colors"
              >
                <img
                  src={project.image}
                  alt={project.title}
                  loading="lazy"
                  className="h-40 w-full object-cover border-b border-neutral-700"
                />
                <div className="flex flex-col flex-1 p-6">
                  <div className="text-xs text-primary-500 mb-2">{status}</div>
                  <h3 className="text-lg font-semibold text-neutral-200 mb-3">{project.title}</h3>
                  <p className="text-sm text-neutral-400 leading-relaxed mb-5 flex-1">{proves}</p>
                  <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
                    {project.websiteLink && (
                      <a
                        href={project.websiteLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-primary-500 hover:text-primary-700 transition-colors"
                      >
                        <ExternalLink size={14} />
                        <span>Mở sản phẩm</span>
                      </a>
                    )}
                    <Link
                      to={`/projects/${project.slug}`}
                      className="inline-flex items-center gap-2 text-primary-500 hover:text-accent-700 transition-colors"
                    >
                      <ArrowRight size={14} />
                      <span>Xem chi tiết</span>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          <p className="text-center text-sm text-neutral-500 mt-8">
            Xem thêm {Math.max(PROJECTS.length - evidence.length, 0)} dự án khác tại{' '}
            <Link to="/projects" className="text-primary-500 hover:underline">
              trang Projects
            </Link>
            .
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-bg-elevated">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            {...sectionMotion}
            className="bg-bg-surface border border-neutral-700 rounded-xl p-8"
          >
            <div className="text-primary-500 mb-4">$ echo "Bạn có một ý tưởng?"</div>
            <p className="text-neutral-200 mb-6">Kể mình nghe bài toán của bạn, mình sẽ cùng biến nó thành sản phẩm chạy thật.</p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 border border-primary-500 text-primary-500 hover:bg-primary-50 transition-all duration-200 font-semibold tracking-wide rounded-lg"
            >
              Liên hệ với mình
              <ArrowRight size={18} />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};
