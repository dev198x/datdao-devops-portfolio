import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Menu,
  X,
  ChevronRight,
  BookOpen,
  TerminalSquare,
  Home,
  User,
  Cpu,
  FolderGit2,
  Hammer,
  Mail,
} from 'lucide-react';
import { Clock } from './Clock';

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/about', label: 'About', icon: User },
    { path: '/skills', label: 'Skills', icon: Cpu },
    { path: '/projects', label: 'Projects', icon: FolderGit2 },
    { path: '/blog', label: 'Blog', icon: BookOpen },
    { path: '/builder', label: 'Builder', icon: Hammer },
    { path: '/commands', label: 'Commands', icon: TerminalSquare },
    { path: '/contact', label: 'Contact', icon: Mail },
  ];

  const isActive = (path: string) =>
    location.pathname === path || location.pathname.startsWith(`${path}/`);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur border-b border-neutral-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="flex h-9 w-11 items-center justify-center rounded-md border border-neutral-700 bg-bg-surface font-mono font-bold text-lg leading-none text-primary-500 group-hover:border-neutral-600 transition-colors">
                <span>&gt;</span>
                <span>_</span>
              </div>
            </Link>

            {/* Live clock (visitor's local time). Hidden on md where the nav links need the room. */}
            <Clock className="flex md:hidden lg:flex mr-auto ml-4" />

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-0 xl:space-x-8">
              {navItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className="relative px-2 xl:px-3 py-2 text-sm font-medium transition-colors duration-200 group flex items-center gap-1.5 xl:gap-2"
                  >
                    {IconComponent && (
                      <IconComponent 
                        size={16}
                        // Icons from lg up; the spacing above is tightened below xl so eight links, icons and the clock fit.
                        className={`hidden lg:block ${
                          isActive(item.path)
                            ? 'text-neutral-200'
                            : 'text-neutral-500 group-hover:text-neutral-200'
                        }`}
                      />
                    )}
                    <span
                      className={`${
                        isActive(item.path)
                          ? 'text-neutral-200'
                          : 'text-neutral-400 group-hover:text-neutral-200'
                      }`}
                    >
                      {item.label}
                    </span>
                    {isActive(item.path) && (
                      <motion.div
                        layoutId="navbar-indicator"
                        className="absolute -bottom-[17px] left-2 right-2 h-0.5 bg-primary-500"
                        initial={false}
                        transition={{ duration: 0.2 }}
                      />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-md text-neutral-300 hover:bg-neutral-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 transition-colors"
                aria-label="Toggle menu"
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-bg-elevated border-t border-neutral-700"
          >
            <div className="px-4 py-2 space-y-1">
              {navItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center justify-between px-3 py-3 rounded-md text-base font-medium transition-all duration-200 ${
                      isActive(item.path)
                        ? 'text-primary-500 bg-primary-50'
                        : 'text-neutral-300 hover:bg-bg-surface'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {IconComponent && (
                        <IconComponent 
                          size={16} 
                          className={`${
                            isActive(item.path) ? 'text-primary-500' : ''
                          }`}
                        />
                      )}
                      <span>$ {item.label.toLowerCase()}</span>
                    </div>
                    <ChevronRight
                      size={16}
                      className={`transition-transform ${
                        isActive(item.path) ? 'text-primary-500' : ''
                      }`}
                    />
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </nav>
    </>
  );
};
