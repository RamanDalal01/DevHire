'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { Briefcase, User, LogOut, Menu, X, LayoutDashboard, PlusCircle, Search } from 'lucide-react';

export default function Navbar() {
  const { user, logoutUser } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-[rgba(255,255,255,0.08)] bg-[#0A0F1D]/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-500 to-teal-400 p-0.5 text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-200">
                <Briefcase className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-400 bg-clip-text text-transparent">
                Dev<span className="text-teal-400 font-extrabold">Hire</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="flex items-center gap-6">
              <Link href="/jobs" className="text-sm font-medium text-slate-300 hover:text-white transition-colors duration-200 flex items-center gap-1.5">
                <Search className="h-4 w-4 text-slate-400" />
                Browse Jobs
              </Link>

              {user ? (
                <>
                  {user.role === 'developer' && (
                    <Link href="/dashboard/developer" className="text-sm font-medium text-slate-300 hover:text-white transition-colors duration-200 flex items-center gap-1.5">
                      <LayoutDashboard className="h-4 w-4 text-slate-400" />
                      Dashboard
                    </Link>
                  )}

                  {user.role === 'company' && (
                    <>
                      <Link href="/dashboard/company" className="text-sm font-medium text-slate-300 hover:text-white transition-colors duration-200 flex items-center gap-1.5">
                        <LayoutDashboard className="h-4 w-4 text-slate-400" />
                        Dashboard
                      </Link>
                      <Link href="/dashboard/company?post=true" className="text-sm font-medium text-teal-400 hover:text-teal-300 transition-colors duration-200 flex items-center gap-1.5 bg-teal-500/10 px-3 py-1.5 rounded-lg border border-teal-500/20">
                        <PlusCircle className="h-4 w-4" />
                        Post a Job
                      </Link>
                    </>
                  )}

                  {/* Profile & Logout */}
                  <div className="flex items-center gap-4 ml-2 border-l border-slate-700 pl-6">
                    <span className="text-sm text-slate-400 flex items-center gap-1">
                      <User className="h-4 w-4 text-indigo-400" />
                      {user.role === 'developer' ? user.name : user.companyName || user.name}
                    </span>
                    <button
                      onClick={logoutUser}
                      className="rounded-lg border border-[rgba(255,255,255,0.08)] bg-white/5 hover:bg-red-500/10 hover:border-red-500/20 hover:text-red-400 px-3 py-1.5 text-xs font-semibold text-slate-300 transition-all duration-200 flex items-center gap-1"
                    >
                      <LogOut className="h-3 w-3" />
                      Logout
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-3 border-l border-slate-700 pl-6">
                  <Link href="/login" className="text-sm font-semibold text-slate-300 hover:text-white transition-colors duration-200">
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    className="rounded-lg glow-btn-primary px-4 py-2 text-xs font-bold transition-all duration-200"
                  >
                    Join DevHire
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              onClick={toggleMenu}
              className="text-slate-400 hover:text-white focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {isOpen && (
        <div className="md:hidden border-t border-[rgba(255,255,255,0.08)] bg-[#0A0F1D] px-2 pt-2 pb-4 space-y-1 sm:px-3">
          <Link
            href="/jobs"
            onClick={toggleMenu}
            className="block rounded-lg px-3 py-2 text-base font-medium text-slate-300 hover:bg-white/5 hover:text-white transition-all duration-200"
          >
            Browse Jobs
          </Link>

          {user ? (
            <>
              {user.role === 'developer' ? (
                <Link
                  href="/dashboard/developer"
                  onClick={toggleMenu}
                  className="block rounded-lg px-3 py-2 text-base font-medium text-slate-300 hover:bg-white/5 hover:text-white transition-all duration-200"
                >
                  Developer Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    href="/dashboard/company"
                    onClick={toggleMenu}
                    className="block rounded-lg px-3 py-2 text-base font-medium text-slate-300 hover:bg-white/5 hover:text-white transition-all duration-200"
                  >
                    Recruiter Dashboard
                  </Link>
                  <Link
                    href="/dashboard/company?post=true"
                    onClick={toggleMenu}
                    className="block rounded-lg px-3 py-2 text-base font-medium text-teal-400 hover:bg-teal-500/10 transition-all duration-200"
                  >
                    Post a Job
                  </Link>
                </>
              )}

              <div className="border-t border-slate-700 my-2 pt-2 px-3">
                <div className="text-sm font-semibold text-indigo-400 mb-2 flex items-center gap-1.5">
                  <User className="h-4 w-4" />
                  {user.role === 'developer' ? user.name : user.companyName || user.name}
                </div>
                <button
                  onClick={() => {
                    toggleMenu();
                    logoutUser();
                  }}
                  className="w-full text-left rounded-lg px-3 py-2 text-base font-medium text-red-400 hover:bg-red-500/5 transition-all duration-200 flex items-center gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              </div>
            </>
          ) : (
            <div className="grid grid-cols-2 gap-2 border-t border-slate-700 pt-3 px-3">
              <Link
                href="/login"
                onClick={toggleMenu}
                className="flex items-center justify-center rounded-lg border border-[rgba(255,255,255,0.08)] bg-white/5 py-2 text-sm font-medium text-slate-300 hover:text-white"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                onClick={toggleMenu}
                className="flex items-center justify-center rounded-lg glow-btn-primary py-2 text-sm font-bold"
              >
                Join Now
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
