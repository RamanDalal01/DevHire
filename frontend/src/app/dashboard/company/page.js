'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import api from '../../../utils/api';
import { PlusCircle, Briefcase, Users, Check, X, FileText, AlertCircle, ExternalLink, MapPin, DollarSign, Tag, Globe, Sliders } from 'lucide-react';
import { toast } from 'react-hot-toast';

function CompanyDashboardContent() {
  const { user, token } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [activeTab, setActiveTab] = useState('postings'); // 'postings' or 'applicants'
  const [jobs, setJobs] = useState([]);
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingApplicants, setLoadingApplicants] = useState(true);

  // Job Posting Form Modal
  const [showPostModal, setShowPostModal] = useState(false);
  const [jobTitle, setJobTitle] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [jobLocation, setJobLocation] = useState('');
  const [jobType, setJobType] = useState('Full-time');
  const [jobTechStack, setJobTechStack] = useState('');
  const [jobSalaryMin, setJobSalaryMin] = useState('');
  const [jobSalaryMax, setJobSalaryMax] = useState('');
  const [submittingJob, setSubmittingJob] = useState(false);

  // Success / Error Alerts
  const [alertMsg, setAlertMsg] = useState({ type: '', text: '' });

  // Check URL query parameter to trigger Job Post modal
  useEffect(() => {
    if (searchParams.get('post') === 'true') {
      setShowPostModal(true);
    }
  }, [searchParams]);

  // Auth Redirects
  useEffect(() => {
    if (!token && !user) {
      router.push('/login');
    } else if (user && user.role !== 'company') {
      router.push('/dashboard/developer');
    }
  }, [user, token]);

  const fetchCompanyData = async () => {
    if (!user || user.role !== 'company') return;

    try {
      setLoading(true);
      const jobsResponse = await api.get('/jobs');
      if (jobsResponse.data.success) {
        const filtered = jobsResponse.data.jobs.filter(
          (j) => j.postedBy?._id === user.id || j.postedBy === user.id
        );
        setJobs(filtered);
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchApplicants = async () => {
    try {
      setLoadingApplicants(true);
      const response = await api.get('/applications/company');
      if (response.data.success) {
        setApplicants(response.data.applications);
      }
    } catch (error) {
      console.error('Error fetching company applicants:', error);
    } finally {
      setLoadingApplicants(false);
    }
  };

  useEffect(() => {
    if (user && user.role === 'company') {
      fetchCompanyData();
      fetchApplicants();
    }
  }, [user]);

  const handlePostJob = async (e) => {
    e.preventDefault();
    setAlertMsg({ type: '', text: '' });

    if (!jobTitle || !jobDescription || !jobLocation || !jobSalaryMin || !jobSalaryMax || !jobTechStack) {
      setAlertMsg({ type: 'error', text: 'All job specs are required.' });
      toast.error('All job specs are required.');
      return;
    }

    try {
      setSubmittingJob(true);
      const payload = {
        title: jobTitle,
        description: jobDescription,
        location: jobLocation,
        jobType,
        techStack: jobTechStack.split(',').map((s) => s.trim()).filter((s) => s.length > 0),
        salaryMin: Number(jobSalaryMin),
        salaryMax: Number(jobSalaryMax),
      };

      const response = await api.post('/jobs', payload);
      if (response.data.success) {
        toast.success('Job listing posted successfully!');
        setAlertMsg({ type: 'success', text: 'Job listing posted successfully!' });
        
        setJobTitle('');
        setJobDescription('');
        setJobLocation('');
        setJobTechStack('');
        setJobSalaryMin('');
        setJobSalaryMax('');
        setShowPostModal(false);
        
        router.replace('/dashboard/company');
        fetchCompanyData();
      }
    } catch (error) {
      console.error('Failed to post job:', error);
      const errText = error.response?.data?.message || 'Error occurred. Please try again.';
      setAlertMsg({ type: 'error', text: errText });
      toast.error(errText);
    } finally {
      setSubmittingJob(false);
    }
  };

  const handleStatusChange = async (appId, newStatus) => {
    try {
      const response = await api.put(`/applications/${appId}/status`, { status: newStatus });
      if (response.data.success) {
        setApplicants((prev) =>
          prev.map((app) => (app._id === appId ? { ...app, status: newStatus } : app))
        );
        toast.success(`Application status updated to ${newStatus}`);
      }
    } catch (error) {
      console.error('Error changing applicant status:', error);
      toast.error('Failed to update application status.');
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job listing?')) return;
    try {
      const response = await api.delete(`/jobs/${jobId}`);
      if (response.data.success) {
        setJobs((prev) => prev.filter((j) => j._id !== jobId));
        toast.success('Job listing deleted successfully.');
      }
    } catch (error) {
      console.error('Failed to delete job post:', error);
      toast.error('Failed to delete job post.');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Accepted':
        return 'bg-teal-500/10 border-teal-500/30 text-teal-400';
      case 'Rejected':
        return 'bg-red-500/10 border-red-500/30 text-red-400';
      case 'Reviewed':
        return 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400';
      default:
        return 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400';
    }
  };

  if (!user || user.role !== 'company') {
    return (
      <div className="flex-grow flex items-center justify-center py-20">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-500/20 border-t-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 relative z-10 flex-grow">
      
      <div className="glow-accent top-[10%] right-[5%]"></div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10 pb-6 border-b border-[rgba(255,255,255,0.06)]">
        <div>
          <span className="text-xs font-bold text-teal-400 tracking-wider uppercase">Recruitment Console</span>
          <h1 className="text-3xl font-extrabold text-white mt-1">{user.companyName || user.name}</h1>
          <p className="text-xs text-slate-400 mt-1">Configure active vacancies, track applicant profiles, and update application pipelines.</p>
        </div>

        <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
          <div className="flex p-1 rounded-xl bg-slate-900 border border-[rgba(255,255,255,0.06)]">
            <button
              onClick={() => setActiveTab('postings')}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition ${
                activeTab === 'postings'
                  ? 'bg-teal-500 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Active Postings ({jobs.length})
            </button>
            <button
              onClick={() => setActiveTab('applicants')}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition ${
                activeTab === 'applicants'
                  ? 'bg-teal-500 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Applicants Inbox ({applicants.length})
            </button>
          </div>

          <button
            onClick={() => setShowPostModal(true)}
            className="rounded-xl glow-btn-secondary px-5 py-2.5 text-xs font-bold flex items-center gap-1.5 shadow-md shrink-0 cursor-pointer"
          >
            <PlusCircle className="h-4.5 w-4.5" />
            Create Job Post
          </button>
        </div>
      </div>

      {activeTab === 'postings' ? (
        <div className="space-y-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-teal-500/20 border-t-teal-500"></div>
              <p className="text-xs text-slate-500">Retrieving company job postings...</p>
            </div>
          ) : jobs.length === 0 ? (
            <div className="glass-card p-12 text-center flex flex-col items-center justify-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-800 text-slate-500">
                <Briefcase className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">No active listings</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                  Create a new detailed developer vacancy posting to receive applications from premium engineering talent.
                </p>
              </div>
              <button
                onClick={() => setShowPostModal(true)}
                className="mt-2 rounded-xl glow-btn-secondary px-5 py-2.5 text-xs font-bold cursor-pointer"
              >
                Post Your First Job
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {jobs.map((job) => (
                <div
                  key={job._id}
                  className="glass-card p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
                >
                  <div className="space-y-2 flex-grow">
                    <h3 className="text-base font-bold text-white hover:text-teal-400 transition cursor-pointer" onClick={() => router.push(`/jobs/${job._id}`)}>
                      {job.title}
                    </h3>
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

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {job.techStack.map((tech) => (
                        <span
                          key={tech}
                          className="rounded bg-slate-900 border border-[rgba(255,255,255,0.06)] px-2 py-0.5 text-[10px] font-bold text-slate-300"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-4 w-full md:w-auto shrink-0 pt-4 md:pt-0 border-t md:border-t-0 border-slate-800">
                    <span className="text-xs font-bold text-slate-400 bg-slate-900 px-3 py-1.5 rounded-lg border border-[rgba(255,255,255,0.06)]">
                      {job.applicationsCount} Applications
                    </span>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => router.push(`/jobs/${job._id}`)}
                        className="text-xs font-bold text-teal-400 hover:text-teal-300 transition"
                      >
                        View Post
                      </button>
                      <span className="text-slate-700">|</span>
                      <button
                        onClick={() => handleDeleteJob(job._id)}
                        className="text-xs font-bold text-red-500 hover:text-red-400 transition"
                      >
                        Remove
                      </button>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {loadingApplicants ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-teal-500/20 border-t-teal-500"></div>
              <p className="text-xs text-slate-500">Opening recruiter mailbox...</p>
            </div>
          ) : applicants.length === 0 ? (
            <div className="glass-card p-12 text-center flex flex-col items-center justify-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-800 text-slate-500">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Inbox Empty</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                  No applicants have registered for your vacancies yet. As soon as a developer applies, their details will display here.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {applicants.map((app) => (
                <div
                  key={app._id}
                  className="glass-card p-6 space-y-6 relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 h-full w-1 bg-gradient-to-b from-teal-500 to-indigo-500 opacity-60"></div>
                  
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-4">
                    <div>
                      <span className="text-[10px] font-extrabold text-teal-400 uppercase tracking-widest">
                        Applied Role: {app.job?.title || 'Unknown Role'}
                      </span>
                      <h3 className="text-lg font-bold text-white mt-1">
                        {app.applicant?.name || 'Developer Candidate'}
                      </h3>
                      <p className="text-xs text-slate-400">{app.applicant?.email}</p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className={`rounded-full border px-3 py-0.5 text-[10px] font-bold ${getStatusBadge(app.status)}`}>
                        {app.status}
                      </span>
                      <span className="text-xs text-slate-500">
                        {new Date(app.appliedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                    <div className="md:col-span-2 space-y-3">
                      <div>
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Candidate Profile Bio</span>
                        <p className="text-xs text-slate-300 mt-1 leading-relaxed whitespace-pre-wrap bg-slate-900/40 p-3 rounded-lg border border-[rgba(255,255,255,0.04)]">
                          {app.applicant?.bio || 'No technical bio supplied by developer.'}
                        </p>
                      </div>

                      {app.applicant?.skills && app.applicant.skills.length > 0 && (
                        <div>
                          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">Developer Skills</span>
                          <div className="flex flex-wrap gap-1">
                            {app.applicant.skills.map((skill) => (
                              <span
                                key={skill}
                                className="rounded bg-slate-900 border border-[rgba(255,255,255,0.06)] px-2 py-0.5 text-[10px] font-bold text-slate-300"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="lg:col-span-1 border-t md:border-t-0 md:border-l border-slate-800 pt-4 md:pt-0 md:pl-6 space-y-4 flex flex-col justify-center">
                      <div>
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Resume Attachment</span>
                        {app.applicant?.resumeUrl ? (
                          <a
                            href={app.applicant.resumeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-teal-500/10 hover:bg-teal-500 hover:text-white border border-teal-500/20 px-4 py-3 text-xs font-bold text-teal-400 transition duration-300"
                          >
                            <FileText className="h-4.5 w-4.5 shrink-0" />
                            Open Resume PDF
                            <ExternalLink className="h-3 w-3 shrink-0" />
                          </a>
                        ) : (
                          <span className="text-xs text-slate-500 italic block">No resume document uploaded yet by applicant.</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-800 text-xs">
                    <span className="font-bold text-slate-500 uppercase tracking-wider">Change Application Status</span>
                    
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        onClick={() => handleStatusChange(app._id, 'Reviewed')}
                        disabled={app.status === 'Reviewed'}
                        className={`rounded-lg px-3.5 py-2 font-bold border transition ${
                          app.status === 'Reviewed'
                            ? 'bg-indigo-500 border-indigo-600 text-white cursor-default'
                            : 'border-[rgba(255,255,255,0.08)] bg-white/5 text-slate-300 hover:bg-indigo-500/10 hover:text-indigo-400 hover:border-indigo-500/20'
                        }`}
                      >
                        Mark Reviewed
                      </button>
                      <button
                        onClick={() => handleStatusChange(app._id, 'Accepted')}
                        disabled={app.status === 'Accepted'}
                        className={`rounded-lg px-3.5 py-2 font-bold border transition ${
                          app.status === 'Accepted'
                            ? 'bg-teal-500 border-teal-600 text-white cursor-default'
                            : 'border-[rgba(255,255,255,0.08)] bg-white/5 text-slate-300 hover:bg-teal-500/10 hover:text-teal-400 hover:border-teal-500/20'
                        }`}
                      >
                        Accept Applicant
                      </button>
                      <button
                        onClick={() => handleStatusChange(app._id, 'Rejected')}
                        disabled={app.status === 'Rejected'}
                        className={`rounded-lg px-3.5 py-2 font-bold border transition ${
                          app.status === 'Rejected'
                            ? 'bg-red-500 border-red-600 text-white cursor-default'
                            : 'border-[rgba(255,255,255,0.08)] bg-white/5 text-slate-300 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20'
                        }`}
                      >
                        Reject Applicant
                      </button>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {showPostModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg glass-card p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Briefcase className="h-5.5 w-5.5 text-teal-400" />
                Post New Opportunity
              </h2>
              <button
                onClick={() => {
                  setShowPostModal(false);
                  router.replace('/dashboard/company');
                }}
                className="text-slate-400 hover:text-white transition"
              >
                <X className="h-5.5 w-5.5" />
              </button>
            </div>

            {alertMsg.text && (
              <div className={`flex items-center gap-2 rounded-lg border p-4 text-xs font-medium ${
                alertMsg.type === 'error'
                  ? 'border-red-500/20 bg-red-500/10 text-red-400'
                  : 'border-teal-500/20 bg-teal-500/10 text-teal-400'
              }`}>
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{alertMsg.text}</span>
              </div>
            )}

            <form onSubmit={handlePostJob} className="space-y-4">
              
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Job Title</label>
                <input
                  type="text"
                  required
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  placeholder="e.g. Senior NodeJS Backend Engineer"
                  className="block w-full rounded-xl border border-[rgba(255,255,255,0.08)] bg-slate-900 px-4 py-2.5 text-xs text-white focus:border-teal-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Detailed Description</label>
                <textarea
                  rows="4"
                  required
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Responsibilities, specifications, requirements..."
                  className="block w-full rounded-xl border border-[rgba(255,255,255,0.08)] bg-slate-900 px-4 py-2.5 text-xs text-white focus:border-teal-500 focus:outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Location</label>
                  <input
                    type="text"
                    required
                    value={jobLocation}
                    onChange={(e) => setJobLocation(e.target.value)}
                    placeholder="e.g. Remote, Bangalore"
                    className="block w-full rounded-xl border border-[rgba(255,255,255,0.08)] bg-slate-900 px-4 py-2.5 text-xs text-white focus:border-teal-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Employment Type</label>
                  <select
                    value={jobType}
                    onChange={(e) => setJobType(e.target.value)}
                    className="block w-full rounded-xl border border-[rgba(255,255,255,0.08)] bg-slate-900 px-3 py-2.5 text-xs text-white focus:border-teal-500 focus:outline-none"
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                    <option value="Remote">Remote</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Required Tech Stacks (Comma-separated)</label>
                <input
                  type="text"
                  required
                  value={jobTechStack}
                  onChange={(e) => setJobTechStack(e.target.value)}
                  placeholder="NodeJS, Express, MongoDB, Docker"
                  className="block w-full rounded-xl border border-[rgba(255,255,255,0.08)] bg-slate-900 px-4 py-2.5 text-xs text-white focus:border-teal-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Annual Salary Range (USD / INR)</label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    required
                    value={jobSalaryMin}
                    onChange={(e) => setJobSalaryMin(e.target.value)}
                    placeholder="Min (e.g. 70000)"
                    className="block w-full rounded-xl border border-[rgba(255,255,255,0.08)] bg-slate-900 px-4 py-2.5 text-xs text-white focus:border-teal-500 focus:outline-none"
                  />
                  <span className="text-slate-500 text-xs">-</span>
                  <input
                    type="number"
                    required
                    value={jobSalaryMax}
                    onChange={(e) => setJobSalaryMax(e.target.value)}
                    placeholder="Max (e.g. 110000)"
                    className="block w-full rounded-xl border border-[rgba(255,255,255,0.08)] bg-slate-900 px-4 py-2.5 text-xs text-white focus:border-teal-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setShowPostModal(false);
                    router.replace('/dashboard/company');
                  }}
                  className="rounded-xl border border-[rgba(255,255,255,0.08)] bg-white/5 hover:bg-white/10 px-5 py-2.5 text-xs font-bold text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingJob}
                  className="rounded-xl glow-btn-secondary px-5 py-2.5 text-xs font-bold cursor-pointer"
                >
                  {submittingJob ? 'Posting Opportunity...' : 'Post Listing'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}

export default function CompanyDashboard() {
  return (
    <Suspense fallback={
      <div className="flex-grow flex items-center justify-center py-20">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-teal-500/20 border-t-teal-500"></div>
      </div>
    }>
      <CompanyDashboardContent />
    </Suspense>
  );
}
