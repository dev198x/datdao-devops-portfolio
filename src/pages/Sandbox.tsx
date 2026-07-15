import React from 'react';
import { AnimatedBackground } from '../components/visual/VisualComponents';
import { TerminalHeader } from '../components/TerminalHeader';
import { LinuxTerminal } from '../components/sandbox/LinuxTerminal';
import { CommandCheatsheet } from '../components/sandbox/CommandCheatsheet';

const Sandbox: React.FC = () => {
  return (
    <AnimatedBackground>
      <TerminalHeader
        command="~/sandbox --linux"
        description="Practice common Linux commands in a simulated terminal with a fake filesystem, or browse the reference cheatsheet below. Nothing here touches a real machine — type 'reset' in the terminal to start over."
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        <section>
          <h2 className="text-xl font-bold text-neutral-200 mb-4 font-mono">$ Try it live</h2>
          <LinuxTerminal />
        </section>

        <section>
          <h2 className="text-xl font-bold text-neutral-200 mb-4 font-mono">$ Command reference</h2>
          <CommandCheatsheet />
        </section>
      </div>
    </AnimatedBackground>
  );
};

export default Sandbox;
