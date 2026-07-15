'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Terminal, ChevronDown, Menu, X } from 'lucide-react';

export const PublicNavbar = () => {
  const pathname = usePathname();
  const [solutionsOpen, setSolutionsOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => pathname === path;

  const navLinks = [
    { name: 'Features', path: '/features' },
    { name: 'Docs', path: '/docs' },
    { name: 'Changelog', path: '/changelog' },
    { name: 'Pricing', path: '/pricing' },
    { name: 'About', path: '/about' },
  ];

  return (
    <header className="bg-paper-bg border-b-4 border-ink-black sticky top-0 z-40">
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between px-6 py-4">
        {/* Logo and Brand */}
        <Link href="/" className="flex items-center gap-3 cursor-pointer">
          <div className="h-10 w-10 border border-ink-black flex items-center justify-center bg-ink-black text-paper-bg sharp-corners">
            <Terminal size={18} strokeWidth={1.5} />
          </div>
          <div className="flex flex-col">
            <span className="font-serif font-black text-xl tracking-tight leading-none text-ink-black">
              CodeMind AI
            </span>
            <span className="text-[9px] font-mono tracking-widest uppercase text-neutral-500 mt-1">
              The Editorial Reviewer
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-6">
          {/* Solutions Dropdown */}
          <div className="relative">
            <button
              onClick={() => setSolutionsOpen(!solutionsOpen)}
              className="text-xs font-mono uppercase tracking-widest text-ink-black hover:text-editorial-red transition-all flex items-center gap-1 cursor-pointer focus:outline-none"
            >
              <span>Solutions</span>
              <ChevronDown size={11} className={`transition-transform ${solutionsOpen ? 'rotate-180' : ''}`} />
            </button>
            {solutionsOpen && (
              <div className="absolute top-full left-0 mt-2 w-48 bg-paper-bg border-2 border-ink-black sharp-corners shadow-[3px_3px_0px_0px_#111111] z-50 flex flex-col font-mono text-[10px] uppercase">
                <Link 
                  href="/login" 
                  onClick={() => setSolutionsOpen(false)}
                  className="p-3 border-b border-ink-black/10 hover:bg-neutral-100/50 hover:text-editorial-red transition-colors"
                >
                  For Startups
                </Link>
                <Link 
                  href="/login" 
                  onClick={() => setSolutionsOpen(false)}
                  className="p-3 border-b border-ink-black/10 hover:bg-neutral-100/50 hover:text-editorial-red transition-colors"
                >
                  For Open Source
                </Link>
                <Link 
                  href="/login" 
                  onClick={() => setSolutionsOpen(false)}
                  className="p-3 hover:bg-neutral-100/50 hover:text-editorial-red transition-colors"
                >
                  For Agencies
                </Link>
              </div>
            )}
          </div>

          {/* Core Nav Links */}
          {navLinks.map((link) => (
            <Link
              key={link.path}
              href={link.path}
              className={`text-xs font-mono uppercase tracking-widest text-ink-black hover:text-editorial-red transition-all ${
                isActive(link.path)
                  ? 'underline decoration-2 decoration-editorial-red underline-offset-4 font-bold'
                  : ''
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Desktop Authentication Buttons */}
        <div className="hidden md:flex items-center gap-6">
          <Link
            href="/login"
            className="text-xs font-mono uppercase tracking-widest text-ink-black hover:text-editorial-red hover:underline underline-offset-4 decoration-2 decoration-editorial-red transition-all"
          >
            Sign In
          </Link>
          <Link
            href="/register"
            className="bg-ink-black hover:bg-paper-bg text-paper-bg hover:text-ink-black border border-ink-black px-5 py-2.5 text-xs font-mono font-bold uppercase tracking-widest transition-all duration-200 sharp-corners cursor-pointer"
          >
            Start Free
          </Link>
        </div>

        {/* Mobile Menu Button Trigger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="flex md:hidden border border-ink-black p-2 bg-paper-bg hover:bg-neutral-100 text-ink-black focus:outline-none cursor-pointer sharp-corners"
          aria-label="Toggle Menu"
        >
          {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* Mobile Navigation Drawer Dropdown */}
      {mobileMenuOpen && (
        <div className="border-t-2 border-ink-black bg-paper-bg px-6 py-4 flex flex-col gap-4 md:hidden font-mono text-xs uppercase tracking-wider">
          <div className="flex flex-col gap-2.5 pb-3 border-b border-ink-black/10">
            <span className="font-bold text-neutral-400 text-[10px]">Solutions</span>
            <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="pl-4 py-1 hover:text-editorial-red transition-colors">
              For Startups
            </Link>
            <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="pl-4 py-1 hover:text-editorial-red transition-colors">
              For Open Source
            </Link>
            <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="pl-4 py-1 hover:text-editorial-red transition-colors">
              For Agencies
            </Link>
          </div>
          {navLinks.map((link) => (
            <Link 
              key={link.path}
              href={link.path} 
              onClick={() => setMobileMenuOpen(false)} 
              className={`py-2 border-b border-ink-black/10 transition-colors ${
                isActive(link.path) ? 'text-editorial-red font-bold' : 'hover:text-editorial-red'
              }`}
            >
              {link.name}
            </Link>
          ))}
          <div className="flex flex-col gap-2 pt-2">
            <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="py-2.5 text-center border border-ink-black hover:bg-neutral-100 font-bold transition-all sharp-corners">
              Sign In
            </Link>
            <Link href="/register" onClick={() => setMobileMenuOpen(false)} className="py-2.5 text-center bg-ink-black text-paper-bg hover:bg-paper-bg hover:text-ink-black border border-ink-black font-bold transition-all sharp-corners">
              Start Free
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
