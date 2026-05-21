'use client';

import React from 'react';
import Link from 'next/link';
import { Terminal, Compass, ShieldCheck, Activity, ChevronRight, Cpu, Users, Building } from 'lucide-react';

const popularSkills = [
  'React', 'NodeJS', 'Python', 'TypeScript', 'Go', 'NextJS', 'Docker', 'Kubernetes', 'AWS', 'GraphQL'
];

export default function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-hidden flex flex-col justify-center">
      
      {/* Background Decorative Glow Accents */}
      <div className="glow-accent top-[-100px] left-[-50px]"></div>
      <div className="glow-accent bottom-[-50px] right-[-50px]"></div>

      {/* Hero Section */}
      <section className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center">
        
        {/* Release Tag */}
        <div className="inline-flex items-center gap-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3.5 py-1.5 text-xs font-semibold text-indigo-300 mb-6">
          <Terminal className="h-3.5 w-3.5" />
          <span>DevHire v1.0 Launch</span>
        </div>

        {/* Primary Header */}
        <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-6xl max-w-4xl mx-auto leading-[1.15]">
          The Skill-First Job Board Built <br />
          <span className="gradient-text font-black">Exclusively for Developers</span>
        </h1>

        {/* Sub-text */}
        <p className="mt-6 text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Skip the noise. DevHire brings you pre-screened technical job openings with full transparency, deep tech-stack filters, and interactive direct tracking.
        </p>

        {/* Actions */}
        <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4">
          <Link
            href="/jobs"
            className="w-full sm:w-auto text-center rounded-xl glow-btn-primary px-8 py-4 text-base font-bold flex items-center justify-center gap-2 group"
          >
            Browse Job Openings
            <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/register"
            className="w-full sm:w-auto text-center rounded-xl border border-[rgba(255,255,255,0.08)] bg-white/5 hover:bg-white/10 hover:border-slate-500 px-8 py-4 text-base font-bold transition-all"
          >
            Post a Listing (Recruiters)
          </Link>
        </div>

        {/* Popular Skills Pills */}
        <div className="mt-12 max-w-3xl mx-auto">
          <p className="text-xs font-semibold text-slate-500 tracking-wider uppercase mb-4">Filter by core technology stack</p>
          <div className="flex flex-wrap justify-center gap-2.5">
            {popularSkills.map((skill) => (
              <Link
                key={skill}
                href={`/jobs?techStack=${skill}`}
                className="rounded-full border border-slate-800 bg-[#0E1326] px-4 py-1.5 text-xs text-slate-300 hover:border-indigo-400 hover:text-white hover:shadow-[0_0_12px_rgba(99,102,241,0.25)] transition-all duration-300"
              >
                #{skill}
              </Link>
            ))}
          </div>
        </div>

      </section>

      {/* Platform Statistics Section */}
      <section className="relative z-10 border-y border-[rgba(255,255,255,0.06)] bg-[#070A14]/50 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3 text-center">
            
            {/* Stat 1 */}
            <div className="space-y-2">
              <p className="text-3xl font-extrabold text-white sm:text-4xl flex items-center justify-center gap-2">
                <Cpu className="h-6 w-6 text-indigo-400" />
                50+
              </p>
              <p className="text-sm font-medium tracking-wider text-slate-500 uppercase">Verified Tech Openings</p>
            </div>

            {/* Stat 2 */}
            <div className="space-y-2">
              <p className="text-3xl font-extrabold text-white sm:text-4xl flex items-center justify-center gap-2">
                <Users className="h-6 w-6 text-teal-400" />
                300+
              </p>
              <p className="text-sm font-medium tracking-wider text-slate-500 uppercase">Talented Developers Registered</p>
            </div>

            {/* Stat 3 */}
            <div className="space-y-2">
              <p className="text-3xl font-extrabold text-white sm:text-4xl flex items-center justify-center gap-2">
                <Building className="h-6 w-6 text-pink-400" />
                20+
              </p>
              <p className="text-sm font-medium tracking-wider text-slate-500 uppercase">Hiring Engineering Teams</p>
            </div>

          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-2xl font-bold tracking-tight text-white sm:text-4xl">
            Designed Specifically for Developer Recruitment
          </h2>
          <p className="mt-4 text-sm text-slate-400">
            DevHire focuses strictly on matching deep skills, eliminating early screening friction for both hiring teams and candidates.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          
          {/* Card 1 */}
          <div className="glass-card p-8 relative overflow-hidden group">
            <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-indigo-500 to-indigo-600"></div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400 mb-6 group-hover:scale-110 transition-transform">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Verified Skill-First Search</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Find and list positions by exact, structured technology layers. Avoid wordy job listings and query exactly what stack you love.
            </p>
          </div>

          {/* Card 2 */}
          <div className="glass-card p-8 relative overflow-hidden group">
            <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-teal-400 to-teal-500"></div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-500/10 text-teal-400 mb-6 group-hover:scale-110 transition-transform">
              <Compass className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Decoupled Dashboards</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Tailored, custom workspaces for Developer and Company roles. Recruiter application inboxes are structured with status updates.
            </p>
          </div>

          {/* Card 3 */}
          <div className="glass-card p-8 relative overflow-hidden group">
            <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-pink-500 to-pink-600"></div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-pink-500/10 text-pink-400 mb-6 group-hover:scale-110 transition-transform">
              <Activity className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Fast, Optimized Server-Rendering</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Public listings are pre-rendered server-side for maximum search indexing and speed. Load index pages under 200ms with SEO metadata.
            </p>
          </div>

        </div>

      </section>

    </div>
  );
}
