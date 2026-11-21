import { useState } from 'react';
import { motion } from 'framer-motion';
import { PageHeader } from '../components/PageHeader';
import { Cloud, Container, Code, Database, Bot, Terminal as TerminalIcon, Award, ExternalLink } from 'lucide-react';
import { SKILLS, SKILL_LEVELS, CERTIFICATIONS, type SkillLevel } from '../data/portfolio';

const levelOf = (id: SkillLevel) => SKILL_LEVELS.find(l => l.id === id)!;

const renderDots = (filled: number) => '●'.repeat(filled) + '○'.repeat(4 - filled);

export const Skills = () => {
  const [terminalOutput, setTerminalOutput] = useState<string[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const categories = [
    {
      id: 'ai',
      short: 'AI',
      title: 'AI & Agents',
      icon: Bot,
      color: 'text-cyan-400',
    },
    {
      id: 'database',
      short: 'Database',
      title: 'Databases',
      icon: Database,
      color: 'text-red-500',
    },
    {
      id: 'development',
      short: 'Dev',
      title: 'Development Stack',
      icon: Code,
      color: 'text-orange-500',
    },
    {
      id: 'cloud',
      short: 'Cloud',
      title: 'Cloud Platforms',
      icon: Cloud,
      color: 'text-blue-500',
    },
    {
      id: 'infrastructure',
      short: 'IaC',
      title: 'Infrastructure as Code',
      icon: TerminalIcon,
      color: 'text-purple-500',
    },
    {
      id: 'containers',
      short: 'Containers',
      title: 'Container & Orchestration',
      icon: Container,
      color: 'text-blue-400',
    },
    {
      id: 'devops',
      short: 'DevOps',
      title: 'DevOps & Automation',
      icon: Code,
      color: 'text-green-500',
    },
  ];

  const commands = {
    help: [
      'Available commands:',
      '  ls <category>     - List skills in a category',
      '  cat <skill>       - Show skill details',
      '  levels            - Show proficiency levels',
      '  clear             - Clear terminal',
      '  help              - Show this help',
    ],
    levels: [
      'Proficiency Levels:',
      ...SKILL_LEVELS.map(l => `  ${renderDots(l.dots)} ${l.label} (${l.group}) - ${l.description}`),
    ],
    clear: () => setTerminalOutput([]),
    default: (input: string) => [
      `Command not found: ${input}`,
      'Type "help" for available commands.',
    ],
  };

  const executeCommand = (input: string) => {
    setIsProcessing(true);
    
    const cmd = input.toLowerCase().trim();
    const args = cmd.split(' ');
    const mainCmd = args[0];

    setTimeout(() => {
      let output: string[] = [];
      
      switch (mainCmd) {
        case 'help':
          output = commands.help;
          break;
        case 'levels':
          output = commands.levels;
          break;
        case 'clear':
          commands.clear();
          setIsProcessing(false);
          return;
        case 'ls':
          const category = args[1];
          if (category && categories.find(c => c.id === category)) {
            const cat = categories.find(c => c.id === category)!;
            output = [
              `${cat.title}:`,
              ...SKILLS.filter(skill => skill.category === cat.id).map(skill => `  ${skill.name} (${levelOf(skill.level).label})`)
            ];
          } else {
            output = [
              'Available categories:',
              ...categories.map(cat => `  ${cat.id} - ${cat.title}`)
            ];
          }
          break;
        case 'cat':
          const skillName = args.slice(1).join(' ');
          const skill = SKILLS.find(s => s.name.toLowerCase() === skillName);

          if (skill) {
            output = [
              `Skill: ${skill.name}`,
              `Category: ${skill.category}`,
              `Level: ${renderDots(levelOf(skill.level).dots)} ${levelOf(skill.level).label} (${levelOf(skill.level).group})`,
              '',
              `Icon: ${skill.icon}`,
            ];
          } else {
            output = [`Skill "${skillName}" not found`];
          }
          break;
        default:
          output = commands.default(cmd);
      }

      setTerminalOutput(prev => [...prev, `$ ${input}`, ...output, '']);
      setCurrentInput('');
      setIsProcessing(false);
    }, 500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && currentInput.trim() && !isProcessing) {
      executeCommand(currentInput);
    }
  };

  return (
    <div className="min-h-screen bg-bg-page">
      {/* Terminal Header */}
      <PageHeader
        command="ls -la skills/"
        description="Exploring technical expertise across cloud, development, and DevOps domains"
      />

      {/* Skills Categories */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-200 mb-4">
              Technical Expertise
            </h2>
            <p className="text-neutral-400 max-w-2xl mx-auto">
              Grouped by how I actually use each skill, from daily production work to things I am still learning
            </p>
          </motion.div>

          {/* Level legend */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
            {SKILL_LEVELS.map((level) => (
              <div key={level.id} className="bg-bg-elevated border border-neutral-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-primary-500">{level.label}</span>
                  <span className="text-primary-500 tracking-widest" aria-hidden="true">{renderDots(level.dots)}</span>
                </div>
                <p className="text-xs text-neutral-400 leading-relaxed">{level.description}</p>
              </div>
            ))}
          </div>

          <div className="space-y-12">
            {SKILL_LEVELS.map((level, levelIndex) => {
              const tierSkills = SKILLS.filter((skill) => skill.level === level.id);
              if (tierSkills.length === 0) return null;
              return (
                <motion.div
                  key={level.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: levelIndex * 0.05, duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  <div className="flex items-center space-x-3 mb-4">
                    <span className="text-primary-500 tracking-widest" aria-hidden="true">{renderDots(level.dots)}</span>
                    <h3 className="text-xl font-semibold text-neutral-200">{level.group}</h3>
                    <span className="text-xs text-neutral-500">{tierSkills.length}</span>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {tierSkills.map((skill) => {
                      const category = categories.find((c) => c.id === skill.category);
                      return (
                        <div
                          key={skill.name}
                          title={`${skill.name} — ${level.label}`}
                          className="flex items-center space-x-3 bg-bg-elevated border border-neutral-700 rounded-lg px-4 py-3 hover:border-neutral-600 transition-colors group"
                        >
                          <img
                            src={skill.icon}
                            alt=""
                            className="w-6 h-6 opacity-80 group-hover:opacity-100 transition-opacity"
                          />
                          <span className="text-sm text-neutral-200">{skill.name}</span>
                          {category && (
                            <span className={`text-xs ${category.color}`}>{category.short}</span>
                          )}
                          <span className="sr-only">{level.label}</span>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-200 mb-4">
              Certifications
            </h2>
            <p className="text-neutral-400 max-w-2xl mx-auto">
              Verified credentials backing the skills above
            </p>
          </motion.div>

          <div className="grid gap-6 max-w-4xl mx-auto">
            {CERTIFICATIONS.filter(cert => cert.image).map((cert) => (
              <motion.div
                key={cert.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="flex flex-col sm:flex-row items-center gap-8 bg-bg-elevated border border-neutral-700 rounded-xl p-8  hover:border-neutral-600 transition-colors"
              >
                <img
                  src={cert.image}
                  alt={`${cert.name} badge`}
                  width={160}
                  height={160}
                  loading="lazy"
                  className="h-40 w-40 shrink-0"
                />
                <div className="text-center sm:text-left">
                  <div className="flex items-center justify-center sm:justify-start gap-2 text-sm text-primary-500 mb-2">
                    <Award size={16} />
                    <span>{[cert.issuer, cert.year].filter(Boolean).join(' | ')}</span>
                  </div>
                  <h3 className="text-xl font-bold text-neutral-200 mb-3">{cert.name}</h3>
                  {cert.covers && (
                    <ul className="space-y-1 text-sm text-neutral-400 mb-4">
                      {cert.covers.map((item) => (
                        <li key={item}>
                          <span className="text-primary-500 mr-2">&gt;</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  )}
                  {cert.link && (
                    <a
                      href={cert.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-2 text-sm text-primary-500 hover:text-primary-700 transition-colors"
                    >
                      <ExternalLink size={14} />
                      <span>Verify on Credly</span>
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Terminal */}
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
              Interactive Skill Explorer
            </h2>
            <p className="text-neutral-400 max-w-2xl mx-auto">
              Use terminal commands to explore my skills in detail
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <div className="bg-bg-elevated border border-neutral-700 rounded-xl overflow-hidden ">
              {/* Terminal Header */}
              <div className="bg-bg-surface border-b border-neutral-700 p-4 flex items-center justify-between">
                <span className="font-mono text-sm text-neutral-400">skills-terminal</span>
              </div>

              {/* Terminal Content */}
              <div className="p-6 font-mono text-sm bg-bg-page h-96 overflow-y-auto">
                {terminalOutput.length === 0 && (
                  <div className="text-neutral-400">
                    <span className="block">Welcome to Skills Explorer. Type 'help' to see available commands.</span>
                    <div className="mt-4">
                      <span className="text-primary-500">$</span>
                      <span className="text-neutral-400 ml-2">ready for input...</span>
                    </div>
                  </div>
                )}

                {terminalOutput.map((line, index) => (
                  <div
                    key={index}
                    className={`${
                      line.startsWith('$') ? 'text-primary-500' : 
                      line.includes('Command not found') ? 'text-rose-600' :
                      'text-neutral-200'
                    }`}
                  >
                    {line}
                  </div>
                ))}

                {isProcessing && (
                  <div className="flex items-center space-x-2">
                    <span className="text-primary-500">$</span>
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                      <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    </div>
                  </div>
                )}

                {/* Input Line */}
                <div className="flex items-center">
                  <span className="text-primary-500 mr-2">$</span>
                  <input
                    type="text"
                    value={currentInput}
                    onChange={(e) => setCurrentInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="flex-1 bg-transparent text-primary-500 outline-none placeholder-neutral-600 font-mono"
                    placeholder={isProcessing ? "processing..." : "enter command..."}
                    disabled={isProcessing}
                  />
                  {!isProcessing && (
                    <div className="w-2 h-5 bg-primary-500 animate-pulse ml-1" />
                  )}
                </div>
              </div>
            </div>

            {/* Quick Commands */}
            <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { cmd: 'help', desc: 'Show commands' },
                { cmd: 'ls cloud', desc: 'Cloud skills' },
                { cmd: 'levels', desc: 'Level guide' },
                { cmd: 'cat Docker', desc: 'Skill details' },
              ].map((item) => (
                <button
                  key={item.cmd}
                  onClick={() => setCurrentInput(item.cmd)}
                  className="p-3 bg-bg-elevated border border-neutral-700 rounded-lg text-left hover:border-neutral-600 transition-colors group"
                >
                  <div className="font-mono text-sm text-primary-500 group-hover:text-primary-400">
                    $ {item.cmd}
                  </div>
                  <div className="text-xs text-neutral-400 mt-1">{item.desc}</div>
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};
