'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import { User, Mail, Lock, Building, Globe, Tags, FileText, AlertCircle, Sparkles } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function Register() {
  const { registerUser, loading } = useAuth();
  const [role, setRole] = useState('developer'); // developer or company
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    bio: '',
    skills: '',
    companyName: '',
    website: '',
    description: '',
  });
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrorMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.password) {
      setErrorMsg('Please fill in all core fields (Name, Email, Password).');
      toast.error('Please fill in all core fields (Name, Email, Password).');
      return;
    }

    const payload = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role: role,
    };

    if (role === 'developer') {
      // Split skills by commas
      payload.skills = formData.skills
        ? formData.skills.split(',').map((s) => s.trim()).filter((s) => s.length > 0)
        : [];
      payload.bio = formData.bio;
    } else {
      if (!formData.companyName) {
        setErrorMsg('Please specify a company name.');
        toast.error('Please specify a company name.');
        return;
      }
      payload.companyName = formData.companyName;
      payload.website = formData.website;
      payload.description = formData.description;
    }

    const res = await registerUser(payload);
    if (!res.success) {
      setErrorMsg(res.message);
      toast.error(res.message);
    } else {
      toast.success('Registration successful! Welcome to DevHire.');
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8">
      
      {/* Decorative Blur */}
      <div className="glow-accent top-[10%] left-[20%]"></div>
      <div className="glow-accent bottom-[10%] right-[20%]"></div>

      <div className="relative z-10 w-full max-w-md space-y-8 glass-card p-10">
        
        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-white flex items-center justify-center gap-2">
            <Sparkles className="h-6 w-6 text-indigo-400" />
            Create Account
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            Already have an account?{' '}
            <Link href="/login" className="font-semibold text-teal-400 hover:text-teal-300">
              Sign in here
            </Link>
          </p>
        </div>

        {/* Role Toggle Selector */}
        <div className="flex p-1 rounded-xl bg-slate-900 border border-[rgba(255,255,255,0.06)]">
          <button
            type="button"
            onClick={() => setRole('developer')}
            className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all duration-200 ${
              role === 'developer'
                ? 'bg-indigo-500 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            I am a Developer
          </button>
          <button
            type="button"
            onClick={() => setRole('company')}
            className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all duration-200 ${
              role === 'company'
                ? 'bg-teal-500 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            I am a Recruiter
          </button>
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
            
            {/* Core fields */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Full Name</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <User className="h-4 w-4" />
                </span>
                <input
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Raman Dalal"
                  className="block w-full rounded-xl border border-[rgba(255,255,255,0.08)] bg-slate-900/60 pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none transition"
                />
              </div>
            </div>

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
                  placeholder="raman@example.com"
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

            {/* Developer fields */}
            {role === 'developer' && (
              <>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Technical Bio</label>
                  <div className="relative">
                    <span className="absolute top-3.5 left-3.5 pointer-events-none text-slate-500">
                      <FileText className="h-4 w-4" />
                    </span>
                    <textarea
                      name="bio"
                      rows="3"
                      value={formData.bio}
                      onChange={handleChange}
                      placeholder="e.g. Full-stack Node/React engineer with 3 years of production SaaS experience."
                      className="block w-full rounded-xl border border-[rgba(255,255,255,0.08)] bg-slate-900/60 pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none transition resize-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Skills (Comma-separated)</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                      <Tags className="h-4 w-4" />
                    </span>
                    <input
                      name="skills"
                      type="text"
                      value={formData.skills}
                      onChange={handleChange}
                      placeholder="React, Node, Go, AWS, Docker"
                      className="block w-full rounded-xl border border-[rgba(255,255,255,0.08)] bg-slate-900/60 pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none transition"
                    />
                  </div>
                </div>
              </>
            )}

            {/* Company fields */}
            {role === 'company' && (
              <>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Company Name</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                      <Building className="h-4 w-4" />
                    </span>
                    <input
                      name="companyName"
                      type="text"
                      required
                      value={formData.companyName}
                      onChange={handleChange}
                      placeholder="e.g. Vercel Inc."
                      className="block w-full rounded-xl border border-[rgba(255,255,255,0.08)] bg-slate-900/60 pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:border-teal-500 focus:outline-none transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Company Website URL</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                      <Globe className="h-4 w-4" />
                    </span>
                    <input
                      name="website"
                      type="url"
                      value={formData.website}
                      onChange={handleChange}
                      placeholder="https://vercel.com"
                      className="block w-full rounded-xl border border-[rgba(255,255,255,0.08)] bg-slate-900/60 pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:border-teal-500 focus:outline-none transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Company Profile Description</label>
                  <div className="relative">
                    <span className="absolute top-3.5 left-3.5 pointer-events-none text-slate-500">
                      <FileText className="h-4 w-4" />
                    </span>
                    <textarea
                      name="description"
                      rows="3"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="e.g. Building the frontend cloud platform for modern web frameworks."
                      className="block w-full rounded-xl border border-[rgba(255,255,255,0.08)] bg-slate-900/60 pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:border-teal-500 focus:outline-none transition resize-none"
                    />
                  </div>
                </div>
              </>
            )}

          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full rounded-xl py-3.5 text-sm font-bold shadow-md transition-all duration-300 ${
                loading
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50'
                  : role === 'developer'
                  ? 'glow-btn-primary cursor-pointer'
                  : 'glow-btn-secondary cursor-pointer'
              }`}
            >
              {loading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
