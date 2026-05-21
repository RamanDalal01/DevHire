'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import api from '../../utils/api';
import { Search, MapPin, DollarSign, Briefcase, Tag, Sliders, X, ChevronRight, AlertCircle } from 'lucide-react';

function JobsBoardContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [location, setLocation] = useState(searchParams.get('location') || '');
  const [jobType, setJobType] = useState(searchParams.get('jobType') || '');
  const [techStack, setTechStack] = useState(searchParams.get('techStack') || '');
  const [salaryMin, setSalaryMin] = useState(searchParams.get('salaryMin') || '');
  const [salaryMax, setSalaryMax] = useState(searchParams.get('salaryMax') || '');

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (location) params.append('location', location);
      if (jobType) params.append('jobType', jobType);
      if (techStack) params.append('techStack', techStack);
      if (salaryMin) params.append('salaryMin', salaryMin);
      if (salaryMax) params.append('salaryMax', salaryMax);

      const response = await api.get(`/jobs?${params.toString()}`);
      if (response.data.success) {
        setJobs(response.data.jobs);
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  // Re-fetch when URL changes or filters are applied
  useEffect(() => {
    fetchJobs();
  }, [searchParams]);

  const handleFilterSubmit = (e) => {
    if (e) e.preventDefault();
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (location) params.append('location', location);
    if (jobType) params.append('jobType', jobType);
    if (techStack) params.append('techStack', techStack);
    if (salaryMin) params.append('salaryMin', salaryMin);
    if (salaryMax) params.append('salaryMax', salaryMax);

    router.push(`/jobs?${params.toString()}`);
  };

  const handleReset = () => {
    setSearch('');
    setLocation('');
    setJobType('');
    setTechStack('');
    setSalaryMin('');
    setSalaryMax('');
    router.push('/jobs');
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 relative z-10">
      
      {/* Decorative Glow */}
      <div className="glow-accent top-[10%] right-[10%]"></div>

      {/* Header */}
      <div className="mb-10 text-center md:text-left">
        <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
          Browse Developer Openings
        </h1>
        <p className="mt-2 text-sm text-slate-400">
          Find your next software engineering challenge. Use the deep filters to locate the exact technology fit.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
        
        {/* Sidebar Filters */}
        <div className="lg:col-span-1">
          <form onSubmit={handleFilterSubmit} className="glass-card p-6 space-y-6 sticky top-24">
            
            <div className="flex justify-between items-center pb-4 border-b border-[rgba(255,255,255,0.06)]">
              <span className="text-sm font-bold text-white flex items-center gap-1.5">
                <Sliders className="h-4 w-4 text-indigo-400" />
                Refine Search
              </span>
              <button
                type="button"
                onClick={handleReset}
                className="text-xs font-semibold text-slate-400 hover:text-teal-400 transition"
              >
                Clear All
              </button>
            </div>

            {/* Keyword Search */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Keywords</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Search className="h-4 w-4" />
                </span>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="e.g. Frontend, React"
                  className="block w-full rounded-xl border border-[rgba(255,255,255,0.08)] bg-slate-900/60 pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Location</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <MapPin className="h-4 w-4" />
                </span>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Remote, Bangalore"
                  className="block w-full rounded-xl border border-[rgba(255,255,255,0.08)] bg-slate-900/60 pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Job Type */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Job Type</label>
              <select
                value={jobType}
                onChange={(e) => setJobType(e.target.value)}
                className="block w-full rounded-xl border border-[rgba(255,255,255,0.08)] bg-slate-900/60 px-3 py-2.5 text-xs text-white focus:border-indigo-500 focus:outline-none"
              >
                <option value="">All Types</option>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
                <option value="Remote">Remote Only</option>
              </select>
            </div>

            {/* Tech Stack */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Required Tech Stacks</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Tag className="h-4 w-4" />
                </span>
                <input
                  type="text"
                  value={techStack}
                  onChange={(e) => setTechStack(e.target.value)}
                  placeholder="e.g. React, Node"
                  className="block w-full rounded-xl border border-[rgba(255,255,255,0.08)] bg-slate-900/60 pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                />
              </div>
              <p className="text-[10px] text-slate-500 mt-1">Comma-separated tags</p>
            </div>

            {/* Salary Range */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Annual Salary Range</label>
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <span className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-500">
                    <DollarSign className="h-3 w-3" />
                  </span>
                  <input
                    type="number"
                    value={salaryMin}
                    onChange={(e) => setSalaryMin(e.target.value)}
                    placeholder="Min"
                    className="block w-full rounded-xl border border-[rgba(255,255,255,0.08)] bg-slate-900/60 pl-7 pr-2 py-2 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <span className="text-slate-500 text-xs">-</span>
                <div className="relative flex-1">
                  <span className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-500">
                    <DollarSign className="h-3 w-3" />
                  </span>
                  <input
                    type="number"
                    value={salaryMax}
                    onChange={(e) => setSalaryMax(e.target.value)}
                    placeholder="Max"
                    className="block w-full rounded-xl border border-[rgba(255,255,255,0.08)] bg-slate-900/60 pl-7 pr-2 py-2 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full rounded-xl py-3 text-xs font-bold glow-btn-primary cursor-pointer transition"
            >
              Apply Filters
            </button>

          </form>
        </div>

        {/* Listings view */}
        <div className="lg:col-span-3 space-y-4">
          
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-500/20 border-t-indigo-500"></div>
              <p className="text-sm text-slate-400">Loading listings...</p>
            </div>
          ) : jobs.length === 0 ? (
            <div className="glass-card p-12 text-center flex flex-col items-center justify-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-800 text-slate-400">
                <AlertCircle className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">No Listings Found</h3>
                <p className="text-sm text-slate-400 mt-1 max-w-sm">
                  We couldn't find any job posts matching your criteria. Try adjusting filters or expanding search terms.
                </p>
              </div>
              <button
                onClick={handleReset}
                className="mt-2 rounded-lg glow-btn-secondary px-5 py-2.5 text-xs font-bold"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <>
              {/* Header result bar */}
              <div className="flex justify-between items-center px-2">
                <span className="text-xs font-bold text-slate-400">
                  Showing <span className="text-white">{jobs.length}</span> matching opportunities
                </span>
              </div>

              {/* Jobs List */}
              <div className="space-y-4">
                {jobs.map((job) => (
                  <div
                    key={job._id}
                    className="glass-card p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden group"
                  >
                    {/* Border highlight glow */}
                    <div className="absolute left-0 top-0 h-full w-1.5 bg-gradient-to-b from-indigo-500 to-teal-400 opacity-80"></div>

                    {/* Left content */}
                    <div className="space-y-3">
                      <div>
                        <span className="text-[10px] font-bold text-teal-400 tracking-widest uppercase">
                          {job.postedBy?.companyName || 'Verified Company'}
                        </span>
                        <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors mt-0.5">
                          {job.title}
                        </h3>
                      </div>

                      {/* Specs Row */}
                      <div className="flex flex-wrap gap-4 text-xs text-slate-400">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5 text-slate-500" />
                          {job.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <DollarSign className="h-3.5 w-3.5 text-slate-500" />
                          ${job.salaryMin.toLocaleString()} - ${job.salaryMax.toLocaleString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Briefcase className="h-3.5 w-3.5 text-slate-500" />
                          {job.jobType}
                        </span>
                      </div>

                      {/* Stack pills */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {job.techStack.map((tech) => (
                          <span
                            key={tech}
                            className="rounded-md bg-slate-900 border border-[rgba(255,255,255,0.06)] px-2 py-0.5 text-[10px] font-bold text-slate-300"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Right button */}
                    <div className="self-stretch md:self-auto flex items-center">
                      <Link
                        href={`/jobs/${job._id}`}
                        className="w-full md:w-auto text-center rounded-xl bg-indigo-500/10 hover:bg-indigo-500 hover:text-white text-indigo-400 border border-indigo-500/20 px-5 py-3 text-xs font-bold flex items-center justify-center gap-1.5 transition-all duration-300"
                      >
                        View Details
                        <ChevronRight className="h-4 w-4" />
                      </Link>
                    </div>

                  </div>
                ))}
              </div>
            </>
          )}

        </div>

      </div>

    </div>
  );
}

export default function JobsBoard() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-500/20 border-t-indigo-500"></div>
        <p className="text-sm text-slate-400">Loading Job Board...</p>
      </div>
    }>
      <JobsBoardContent />
    </Suspense>
  );
}
