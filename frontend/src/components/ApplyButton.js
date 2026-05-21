'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import api from '../utils/api';
import { Send, CheckCircle, AlertCircle } from 'lucide-react';

export default function ApplyButton({ jobId }) {
  const { user } = useAuth();
  const router = useRouter();
  const [applied, setApplied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [checkingStatus, setCheckingStatus] = useState(true);

  useEffect(() => {
    const checkAppliedStatus = async () => {
      if (!user || user.role !== 'developer') {
        setCheckingStatus(false);
        return;
      }
      try {
        // Fetch developer's applications to see if they've already applied
        const response = await api.get('/applications/me');
        if (response.data.success) {
          const hasApplied = response.data.applications.some(
            (app) => app.job?._id === jobId
          );
          setApplied(hasApplied);
        }
      } catch (error) {
        console.error('Error checking application status:', error);
      } finally {
        setCheckingStatus(false);
      }
    };
    checkAppliedStatus();
  }, [user, jobId]);

  const handleApply = async () => {
    if (!user) {
      router.push('/login');
      return;
    }

    try {
      setLoading(true);
      setErrorMsg('');
      const response = await api.post(`/jobs/${jobId}/apply`);
      if (response.data.success) {
        setApplied(true);
      }
    } catch (error) {
      console.error('Error applying to job:', error);
      setErrorMsg(
        error.response?.data?.message || 'Failed to submit application. Try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  if (checkingStatus) {
    return (
      <div className="h-10 w-full rounded-xl bg-slate-900 border border-[rgba(255,255,255,0.06)] animate-pulse flex items-center justify-center">
        <span className="text-xs text-slate-500 font-bold">Verifying details...</span>
      </div>
    );
  }

  // Recruiter blocker
  if (user && user.role === 'company') {
    return (
      <div className="w-full text-center rounded-xl bg-slate-900 border border-slate-800 p-4 text-xs font-semibold text-slate-500">
        Recruiters cannot apply to job postings
      </div>
    );
  }

  return (
    <div className="space-y-3 w-full">
      {errorMsg && (
        <div className="flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 p-3.5 text-xs text-red-400 font-medium">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {applied ? (
        <div className="w-full py-4 bg-teal-500/10 border border-teal-500/30 text-teal-400 rounded-xl flex items-center justify-center gap-2 text-sm font-bold shadow-md shadow-teal-500/5">
          <CheckCircle className="h-5 w-5" />
          Application Submitted Successfully
        </div>
      ) : (
        <button
          onClick={handleApply}
          disabled={loading}
          className="w-full rounded-xl py-4 font-bold glow-btn-primary cursor-pointer text-sm transition-all duration-300 flex items-center justify-center gap-2"
        >
          {loading ? (
            'Submitting Application...'
          ) : (
            <>
              <Send className="h-4 w-4" />
              {user ? 'Apply to Role instantly' : 'Sign in to Apply'}
            </>
          )}
        </button>
      )}
    </div>
  );
}
