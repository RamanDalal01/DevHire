'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useRouter } from 'next/navigation';
import api from '../../../utils/api';
import { FileText, Upload, CheckCircle, Clock, User, Tags, AlertCircle, ExternalLink, Sliders, Briefcase, MapPin, DollarSign } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function DeveloperDashboard() {
  const { user, updateProfile, token } = useAuth();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState('applications'); // 'applications' or 'profile'
  const [applications, setApplications] = useState([]);
  const [loadingApps, setLoadingApps] = useState(true);

  // Profile Form States
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [skills, setSkills] = useState('');
  const [resumeUrl, setResumeUrl] = useState('');
  
  // File Upload State
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Redirect if guest or not developer
  useEffect(() => {
    if (!token && !user) {
      router.push('/login');
    } else if (user && user.role !== 'developer') {
      router.push('/dashboard/company');
    }
  }, [user, token]);

  // Load Developer Applications
  const fetchApplications = async () => {
    try {
      setLoadingApps(true);
      const response = await api.get('/applications/me');
      if (response.data.success) {
        setApplications(response.data.applications);
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoadingApps(false);
    }
  };

  useEffect(() => {
    if (user && user.role === 'developer') {
      fetchApplications();
      // Populate profile inputs
      setName(user.name || '');
      setBio(user.bio || '');
      setSkills(user.skills ? user.skills.join(', ') : '');
      setResumeUrl(user.resumeUrl || '');
    }
  }, [user]);

  const handleFileUpload = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    if (selectedFile.type !== 'application/pdf') {
      setErrorMsg('Invalid file type. Only PDF documents are allowed.');
      toast.error('Invalid file type. Only PDF documents are allowed.');
      return;
    }

    setFile(selectedFile);
    setErrorMsg('');
    setUploadSuccess(false);

    // Trigger upload automatically
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('resume', selectedFile);

      const response = await api.post('/auth/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        setResumeUrl(response.data.resumeUrl);
        setUploadSuccess(true);
        setSuccessMsg('Resume uploaded successfully! Submit changes below to save to your profile.');
        toast.success('Resume uploaded successfully!');
      }
    } catch (error) {
      console.error('Upload failed:', error);
      const errMsg = error.response?.data?.message || 'Resume upload failed. Try again.';
      setErrorMsg(errMsg);
      toast.error(errMsg);
    } finally {
      setUploading(false);
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const payload = {
      name,
      bio,
      skills: skills ? skills.split(',').map((s) => s.trim()).filter((s) => s.length > 0) : [],
      resumeUrl,
    };

    const res = await updateProfile(payload);
    if (res.success) {
      setSuccessMsg('Your developer profile has been updated successfully!');
      toast.success('Profile updated successfully!');
    } else {
      setErrorMsg(res.message);
      toast.error(res.message);
    }
  };

  const getStatusBadgeClass = (status) => {
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

  if (!user || user.role !== 'developer') {
    return (
      <div className="flex-grow flex items-center justify-center py-20">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-500/20 border-t-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 relative z-10 flex-grow">
      
      {/* Decorative Blur */}
      <div className="glow-accent top-[10%] left-[5%]"></div>

      {/* Intro Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10 pb-6 border-b border-[rgba(255,255,255,0.06)]">
        <div>
          <span className="text-xs font-bold text-indigo-400 tracking-wider uppercase">Welcome Back</span>
          <h1 className="text-3xl font-extrabold text-white mt-1">{user.name}</h1>
          <p className="text-xs text-slate-400 mt-1">Manage your active job applications and keep your technical CV updated.</p>
        </div>

        {/* Tab toggle */}
        <div className="flex p-1 rounded-xl bg-slate-900 border border-[rgba(255,255,255,0.06)] shrink-0">
          <button
            onClick={() => setActiveTab('applications')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition ${
              activeTab === 'applications'
                ? 'bg-indigo-500 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            My Applications ({applications.length})
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition ${
              activeTab === 'profile'
                ? 'bg-indigo-500 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Edit Profile
          </button>
        </div>
      </div>

      {/* Main Body content by Tab */}
      {activeTab === 'applications' ? (
        <div className="space-y-6">
          {loadingApps ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500/20 border-t-indigo-500"></div>
              <p className="text-xs text-slate-500">Retrieving applications history...</p>
            </div>
          ) : applications.length === 0 ? (
            <div className="glass-card p-12 text-center flex flex-col items-center justify-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-800 text-slate-500">
                <Briefcase className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">No Applications Yet</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                  Start applying to elite developer job posts on DevHire to see them tracked live on your workspace dashboard.
                </p>
              </div>
              <button
                onClick={() => router.push('/jobs')}
                className="mt-2 rounded-xl glow-btn-primary px-5 py-2.5 text-xs font-bold"
              >
                Browse Job Board
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {applications.map((app) => (
                <div
                  key={app._id}
                  className="glass-card p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
                >
                  <div className="space-y-2 flex-grow">
                    <div className="flex items-center gap-2.5">
                      <span className="text-[10px] font-bold text-teal-400 uppercase tracking-widest">
                        {app.job?.postedBy?.companyName || 'Verified Company'}
                      </span>
                      <span className="text-slate-600 text-xs">&#8226;</span>
                      <span className="text-[10px] text-slate-400">
                        Applied: {new Date(app.appliedAt).toLocaleDateString()}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-white">
                      {app.job?.title || 'Unknown Position'}
                    </h3>

                    {/* Quick Stats */}
                    {app.job && (
                      <div className="flex flex-wrap gap-4 text-xs text-slate-400">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5 text-slate-500" />
                          {app.job.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <DollarSign className="h-3.5 w-3.5 text-slate-500" />
                          ${app.job.salaryMin.toLocaleString()} - ${app.job.salaryMax.toLocaleString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Briefcase className="h-3.5 w-3.5 text-slate-500" />
                          {app.job.jobType}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Status Indicator & View Listing */}
                  <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-4 w-full md:w-auto shrink-0 pt-4 md:pt-0 border-t md:border-t-0 border-slate-800">
                    <span
                      className={`rounded-full border px-3.5 py-1 text-xs font-bold flex items-center gap-1.5 ${getStatusBadgeClass(
                        app.status
                      )}`}
                    >
                      {app.status === 'Accepted' && <CheckCircle className="h-3.5 w-3.5" />}
                      {app.status === 'Pending' && <Clock className="h-3.5 w-3.5 animate-pulse" />}
                      {app.status}
                    </span>

                    {app.job && (
                      <button
                        onClick={() => router.push(`/jobs/${app.job._id}`)}
                        className="text-xs font-bold text-indigo-400 hover:text-indigo-300 transition flex items-center gap-1"
                      >
                        View Original Post
                        <ExternalLink className="h-3 w-3" />
                      </button>
                    )}
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* Edit profile tab */
        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleProfileSubmit} className="glass-card p-8 space-y-6">
            
            <h2 className="text-xl font-bold text-white border-b border-slate-800 pb-3 flex items-center gap-2">
              <User className="h-5 w-5 text-indigo-400" />
              Developer Profile Settings
            </h2>

            {/* Alert Logs */}
            {errorMsg && (
              <div className="flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-xs text-red-400 font-medium">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}
            {successMsg && (
              <div className="flex items-center gap-2 rounded-lg border border-teal-500/20 bg-teal-500/10 p-4 text-xs text-teal-400 font-medium animate-fade-in">
                <CheckCircle className="h-4 w-4 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* Form Inputs */}
            <div className="space-y-4">
              
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your Name"
                  className="block w-full rounded-xl border border-[rgba(255,255,255,0.08)] bg-slate-900/60 px-4 py-3 text-sm text-white focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Technical Biography</label>
                <textarea
                  rows="4"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Share a short summary of your background, experience level, and preferred engineering systems."
                  className="block w-full rounded-xl border border-[rgba(255,255,255,0.08)] bg-slate-900/60 px-4 py-3 text-sm text-white focus:border-indigo-500 focus:outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Skills (Comma-separated)</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Tags className="h-4 w-4" />
                  </span>
                  <input
                    type="text"
                    value={skills}
                    onChange={(e) => setSkills(e.target.value)}
                    placeholder="React, Node, Go, Kubernetes, PostgreSQL"
                    className="block w-full rounded-xl border border-[rgba(255,255,255,0.08)] bg-slate-900/60 pl-10 pr-4 py-3 text-sm text-white focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* PDF Resume upload */}
              <div className="border-t border-slate-800/60 pt-4">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Upload PDF Resume</label>
                
                <div className="flex flex-col sm:flex-row items-center gap-4 mt-2">
                  <div className="relative w-full sm:w-auto">
                    <input
                      type="file"
                      accept="application/pdf"
                      id="resume-file"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <label
                      htmlFor="resume-file"
                      className={`w-full sm:w-auto rounded-xl border border-dashed border-[rgba(255,255,255,0.15)] bg-slate-900/50 hover:bg-slate-900 hover:border-indigo-500 px-5 py-4 flex items-center justify-center gap-2 cursor-pointer text-xs font-bold text-slate-300 transition duration-200 ${
                        uploading ? 'opacity-50 pointer-events-none' : ''
                      }`}
                    >
                      <Upload className="h-4 w-4 text-indigo-400" />
                      {uploading ? 'Uploading resume...' : 'Select PDF Document'}
                    </label>
                  </div>

                  <div className="text-center sm:text-left flex-grow">
                    {resumeUrl ? (
                      <div className="space-y-1">
                        <span className="text-xs text-slate-500">Active Resume Attachment:</span>
                        <a
                          href={resumeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-bold text-teal-400 hover:underline flex items-center justify-center sm:justify-start gap-1"
                        >
                          <FileText className="h-3.5 w-3.5 shrink-0" />
                          View Uploaded Document
                          <ExternalLink className="h-3 w-3 shrink-0" />
                        </a>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-500">No document uploaded yet. Standard size limit is 5MB.</span>
                    )}
                  </div>
                </div>
              </div>

            </div>

            {/* Submit */}
            <div className="pt-4 border-t border-slate-800">
              <button
                type="submit"
                className="w-full rounded-xl py-3.5 font-bold glow-btn-primary cursor-pointer text-sm shadow-md transition"
              >
                Save Profile Changes
              </button>
            </div>

          </form>
        </div>
      )}

    </div>
  );
}
