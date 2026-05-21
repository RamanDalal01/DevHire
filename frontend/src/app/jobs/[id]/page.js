export const dynamic = 'force-dynamic';

import Link from 'next/link';
import ApplyButton from '../../../components/ApplyButton';
import { ChevronLeft, MapPin, DollarSign, Briefcase, Calendar, Building, Globe, Tag } from 'lucide-react';

async function getJob(id) {
  // Fetch directly from Express API during SSR build/request
  const res = await fetch(`http://127.0.0.1:5000/api/jobs/${id}`, {
    cache: 'no-store', // Disable caching for real-time application accuracy
  });
  
  if (!res.ok) {
    throw new Error('Job listing not found');
  }
  return res.json();
}

// Generate dynamic SEO headers for the listing
export async function generateMetadata({ params }) {
  try {
    const data = await getJob(params.id);
    const job = data.job;
    return {
      title: `${job.title} | ${job.postedBy?.companyName || 'DevHire Careers'}`,
      description: job.description.slice(0, 160) + '...',
      openGraph: {
        title: `${job.title} at ${job.postedBy?.companyName || 'DevHire'}`,
        description: `Apply today on DevHire. Required skills: ${job.techStack.join(', ')}`,
      },
    };
  } catch (error) {
    return {
      title: 'Job Listing Details | DevHire',
      description: 'Explore verified skill-first software developer jobs on DevHire.',
    };
  }
}

export default async function JobDetailPage({ params }) {
  let job = null;
  let fetchError = false;

  try {
    const data = await getJob(params.id);
    job = data.job;
  } catch (error) {
    fetchError = true;
  }

  if (fetchError || !job) {
    return (
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-20 text-center relative z-10">
        <h2 className="text-2xl font-bold text-white">Listing Not Found</h2>
        <p className="text-slate-400 mt-2 text-sm">
          The job listing you are looking for does not exist, has expired, or has been removed by the recruiter.
        </p>
        <Link
          href="/jobs"
          className="mt-6 inline-flex items-center gap-1 text-teal-400 hover:text-teal-300 font-bold text-xs uppercase tracking-wider"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Listings
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 relative z-10">
      
      {/* Decorative Glow */}
      <div className="glow-accent top-[10%] left-[10%]"></div>

      {/* Back Button */}
      <div className="mb-6">
        <Link
          href="/jobs"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white transition uppercase tracking-wider"
        >
          <ChevronLeft className="h-4.5 w-4.5 text-slate-500" />
          Back to Browse Jobs
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        
        {/* Left Side: Job Specs & Details */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Main Card */}
          <div className="glass-card p-8 space-y-6 relative overflow-hidden">
            {/* Border glow decoration */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-teal-400"></div>

            {/* Role Header */}
            <div>
              <span className="text-xs font-extrabold text-teal-400 uppercase tracking-widest">
                {job.postedBy?.companyName || 'Verified Company'}
              </span>
              <h1 className="text-2xl font-extrabold text-white sm:text-3xl mt-1.5 leading-tight">
                {job.title}
              </h1>
            </div>

            {/* Quick Specs grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 border-y border-[rgba(255,255,255,0.06)] py-6">
              
              <div className="flex items-center gap-2.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400 shrink-0">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Location</p>
                  <p className="text-sm font-semibold text-slate-200 mt-0.5">{job.location}</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-500/10 text-teal-400 shrink-0">
                  <DollarSign className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Salary Range</p>
                  <p className="text-sm font-semibold text-slate-200 mt-0.5">${job.salaryMin.toLocaleString()} - ${job.salaryMax.toLocaleString()}</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 col-span-2 md:col-span-1">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-pink-500/10 text-pink-400 shrink-0">
                  <Briefcase className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Employment</p>
                  <p className="text-sm font-semibold text-slate-200 mt-0.5">{job.jobType}</p>
                </div>
              </div>

            </div>

            {/* Detailed Description */}
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-white">Job Description</h2>
              <div className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">
                {job.description}
              </div>
            </div>

            {/* Tech Stack tags */}
            <div className="space-y-3 pt-4 border-t border-[rgba(255,255,255,0.06)]">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Required Technologies</h3>
              <div className="flex flex-wrap gap-2">
                {job.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-lg bg-slate-900 border border-[rgba(255,255,255,0.06)] px-3.5 py-1.5 text-xs font-bold text-slate-300 flex items-center gap-1.5 hover:border-indigo-500 transition-colors"
                  >
                    <Tag className="h-3.5 w-3.5 text-indigo-400" />
                    {tech}
                  </span>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Right Side: Apply Card & Company Profile */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Apply instant Card */}
          <div className="glass-card p-6 space-y-4">
            <h3 className="text-base font-bold text-white">Submit Application</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Applying matches your developer profile (resume URL, bio, and listed tags) instantly with this role. Make sure your profile details are up to date.
            </p>
            
            {/* Embed the interactive Client component */}
            <ApplyButton jobId={job._id} />

            <div className="flex justify-between items-center text-[10px] font-bold text-slate-500 uppercase tracking-wider pt-2 border-t border-[rgba(255,255,255,0.06)]">
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5 text-slate-500" />
                Posted: {new Date(job.createdAt).toLocaleDateString()}
              </span>
              <span>
                {job.applicationsCount} Applied
              </span>
            </div>
          </div>

          {/* Company Profile Details */}
          <div className="glass-card p-6 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Building className="h-5 w-5 text-indigo-400" />
              Company Details
            </h3>
            
            <div className="space-y-3 text-xs">
              <div>
                <p className="font-bold text-slate-500 uppercase tracking-wider">Company Name</p>
                <p className="text-sm font-semibold text-slate-200 mt-0.5">{job.postedBy?.companyName || 'Verified Corporate Partner'}</p>
              </div>

              {job.postedBy?.website && (
                <div>
                  <p className="font-bold text-slate-500 uppercase tracking-wider">Website</p>
                  <a
                    href={job.postedBy.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-semibold text-teal-400 hover:text-teal-300 flex items-center gap-1 mt-0.5"
                  >
                    <Globe className="h-3.5 w-3.5" />
                    Visit Corporate Site
                  </a>
                </div>
              )}

              {job.postedBy?.description && (
                <div>
                  <p className="font-bold text-slate-500 uppercase tracking-wider">About Company</p>
                  <p className="text-slate-400 mt-1 leading-relaxed leading-normal">{job.postedBy.description}</p>
                </div>
              )}
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
