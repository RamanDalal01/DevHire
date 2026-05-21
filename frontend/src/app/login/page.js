'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import { Mail, Lock, AlertCircle, LogIn, Sparkles } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function Login() {
  const { loginUser, loading } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrorMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setErrorMsg('Please enter both email and password.');
      toast.error('Please enter both email and password.');
      return;
    }

    const res = await loginUser(formData.email, formData.password);
    if (!res.success) {
      setErrorMsg(res.message);
      toast.error(res.message);
    } else {
      toast.success('Welcome back to DevHire!');
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8">
      
      {/* Decorative Glow */}
      <div className="glow-accent top-[15%] left-[25%]"></div>
      <div className="glow-accent bottom-[15%] right-[25%]"></div>

      <div className="relative z-10 w-full max-w-md space-y-8 glass-card p-10">
        
        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-white flex items-center justify-center gap-2">
            <Sparkles className="h-6 w-6 text-indigo-400" />
            Welcome Back
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            Don't have an account?{' '}
            <Link href="/register" className="font-semibold text-teal-400 hover:text-teal-300">
              Create one here
            </Link>
          </p>
        </div>

        {/* Validation Errors */}
        {errorMsg && (
          <div className="flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-xs font-medium text-red-400">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          
          <div className="space-y-4">
            
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Email Address</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Mail className="h-4 w-4" />
                </span>
                <input
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@example.com"
                  className="block w-full rounded-xl border border-[rgba(255,255,255,0.08)] bg-slate-900/60 pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Password</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Lock className="h-4 w-4" />
                </span>
                <input
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="block w-full rounded-xl border border-[rgba(255,255,255,0.08)] bg-slate-900/60 pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none transition"
                />
              </div>
            </div>

          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl py-3.5 text-sm font-bold shadow-md glow-btn-primary cursor-pointer transition-all duration-300 flex items-center justify-center gap-2"
            >
              {loading ? (
                'Signing In...'
              ) : (
                <>
                  <LogIn className="h-4 w-4" />
                  Sign In
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
