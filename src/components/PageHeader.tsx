import { motion } from 'framer-motion';

interface PageHeaderProps {
  command: string;
  description?: string;
}

/** Flat page header: the page's command as the title, description below, hairline divider. */
export const PageHeader = ({ command, description }: PageHeaderProps) => {
  return (
    <header className="bg-bg-surface border-b border-neutral-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-14">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="max-w-3xl"
        >
          <h1 className="font-mono text-2xl lg:text-3xl font-semibold tracking-tight text-neutral-200">
            <span className="text-neutral-500 mr-3 select-none">$</span>
            {command}
          </h1>
          {description && (
            <p className="mt-4 text-base leading-relaxed text-neutral-400">{description}</p>
          )}
        </motion.div>
      </div>
    </header>
  );
};
