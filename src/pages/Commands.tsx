import React from 'react';
import { AnimatedBackground } from '../components/visual/VisualComponents';
import { TerminalHeader } from '../components/TerminalHeader';
import { CommandCheatsheet } from '../components/sandbox/CommandCheatsheet';

const Commands: React.FC = () => {
  return (
    <AnimatedBackground>
      <TerminalHeader
        command="man commands"
        description="Everyday Linux, Git, Docker, Kubernetes, cloud and database commands, plus what to let an AI agent run and what needs a human. Search by task, e.g. port in use or disk full."
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        <section>
          <h2 className="text-xl font-bold text-neutral-200 mb-4 font-mono">$ Command reference</h2>
          <CommandCheatsheet />
        </section>
      </div>
    </AnimatedBackground>
  );
};

export default Commands;
