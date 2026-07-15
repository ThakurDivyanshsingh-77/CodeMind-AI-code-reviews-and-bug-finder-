'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Loader2, AlertCircle, FileSearch, Trash2, Play, Calendar, Terminal, Shield, Zap, Sparkles, FolderDot, Code2 } from 'lucide-react';
import api from '@/services/api';
import Link from 'next/link';

export default function ProjectDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [project, setProject] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const fetchProjectData = async () => {
    try {
      // 1. Fetch project details
      const projectResponse = await api.get(`/projects/${id}`);
      if (!projectResponse.data?.success) throw new Error('Failed to load project details');
      setProject(projectResponse.data.data);

      // 2. Fetch project reviews history
      const reviewsResponse = await api.get(`/projects/${id}/reviews`);
      if (reviewsResponse.data?.success) {
        setReviews(reviewsResponse.data.data);
      }
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || err.message || 'Failed to load project data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchProjectData();
  }, [id]);

  const handleStartReview = async () => {
    setErrorMsg('');
    setSuccessMsg('Initiating AI review pipeline...');
    setActionLoading(true);
    try {
      const response = await api.post('/reviews/start', { projectId: id });
      if (response.data?.success) {
        setSuccessMsg('Review completed successfully!');
        // Refresh project and reviews
        fetchProjectData();
      }
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Failed to complete review');
      setSuccessMsg('');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteProject = async () => {
    if (!confirm('Are you sure you want to delete this project? This will permanently delete the project and all its associated reviews.')) return;
    setActionLoading(true);
    try {
      await api.delete(`/projects/${id}`);
      router.push('/projects');
    } catch (err) {
      setErrorMsg('Failed to remove project');
      setActionLoading(false);
    }
  };

  // Helper to count bug severities
  const getBugCounts = (bugs: any[]) => {
    const counts = { critical: 0, high: 0, medium: 0, low: 0 };
    if (!bugs) return counts;
    bugs.forEach((b: any) => {
      const sev = (b.severity || 'low').toLowerCase();
      if (sev in counts) {
        counts[sev as keyof typeof counts]++;
      }
    });
    return counts;
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] bg-paper-bg text-ink-black dot-grid-bg">
        <div className="border border-ink-black p-6 bg-paper-bg sharp-corners flex flex-col gap-2 max-w-sm w-full text-center">
          <span className="text-xs uppercase tracking-widest font-mono font-bold">CodeMind AI</span>
          <div className="h-0.5 bg-ink-black w-full my-1"></div>
          <span className="text-sm font-body italic animate-pulse">Loading project configuration...</span>
        </div>
      </div>
    );
  }

  if (errorMsg && !project) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4 text-ink-black">
        <div className="p-4 border border-editorial-red bg-editorial-red/5 text-editorial-red text-xs font-mono font-bold flex items-center gap-2 sharp-corners">
          <AlertCircle size={14} strokeWidth={1.5} />
          <span>ALERT: {errorMsg}</span>
        </div>
        <Link href="/projects" className="text-xs font-mono font-bold uppercase tracking-widest hover:text-editorial-red underline flex items-center gap-1">
          <ArrowLeft size={12} /> Return to Projects
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 max-w-7xl mx-auto text-ink-black">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-ink-black pb-6 gap-4">
        <div className="flex items-center gap-4">
          <Link 
            href="/projects" 
            className="p-2.5 border border-ink-black bg-paper-bg hover:bg-ink-black hover:text-paper-bg text-ink-black transition-colors sharp-corners flex items-center justify-center"
          >
            <ArrowLeft size={14} strokeWidth={1.5} />
          </Link>
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-serif font-black uppercase text-ink-black flex items-center gap-3">
              {project.name}
              <span className={`px-2.5 py-0.5 border text-[9px] font-mono font-bold uppercase tracking-wider sharp-corners ${
                project.status === 'completed' 
                  ? 'bg-ink-black text-paper-bg border-ink-black'
                  : project.status === 'processing'
                  ? 'bg-editorial-red text-paper-bg border-editorial-red animate-pulse'
                  : 'bg-paper-bg text-ink-black border-ink-black'
              }`}>
                {project.status}
              </span>
            </h1>
            <p className="text-[10px] font-mono uppercase tracking-widest text-neutral-550">Repository workspace and AI review logs.</p>
          </div>
        </div>

        {/* Trigger Review Button */}
        <div>
          {project.status === 'processing' || actionLoading ? (
            <div className="flex items-center gap-2 px-5 py-3 bg-neutral-200 border border-ink-black text-ink-black rounded-none text-xs font-mono uppercase tracking-wider animate-pulse">
              <Loader2 className="animate-spin" size={12} strokeWidth={1.5} />
              Review Pipeline Processing...
            </div>
          ) : (
            <button
              onClick={handleStartReview}
              className="flex items-center gap-2 px-5 py-3 bg-ink-black hover:bg-paper-bg text-paper-bg hover:text-ink-black border border-transparent hover:border-ink-black text-xs font-mono font-bold uppercase tracking-widest transition-all sharp-corners cursor-pointer"
            >
              <Play size={10} fill="currentColor" strokeWidth={1.5} />
              Trigger AI Code Review
            </button>
          )}
        </div>
      </div>

      {/* Messages */}
      {errorMsg && (
        <div className="p-4 border border-editorial-red bg-editorial-red/5 text-editorial-red text-xs font-mono font-bold flex items-center gap-2 sharp-corners">
          <AlertCircle size={14} strokeWidth={1.5} />
          <span>ALERT: {errorMsg}</span>
        </div>
      )}
      {successMsg && (
        <div className="p-4 border border-ink-black bg-neutral-100 text-ink-black text-xs font-mono font-bold flex items-center gap-2 sharp-corners">
          <AlertCircle size={14} strokeWidth={1.5} />
          <span>LOG: {successMsg}</span>
        </div>
      )}

      {/* Workspace grid splits */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left side: Project Details & History */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Metadata Cards */}
          <div className="bg-paper-bg border border-ink-black p-6 flex flex-col gap-6 sharp-corners">
            <h2 className="text-sm font-mono font-bold text-ink-black flex items-center gap-2 border-b border-ink-black pb-2 uppercase tracking-widest">
              <FolderDot size={16} className="text-ink-black" strokeWidth={1.5} />
              Codebase Configuration
            </h2>

            <div className="grid grid-cols-2 gap-6 text-xs border-b border-ink-black pb-6 font-mono uppercase tracking-wider">
              <div className="flex flex-col gap-1.5">
                <span className="text-neutral-550 font-bold text-[9px]">Programming Language</span>
                <span className="text-ink-black font-bold text-xs flex items-center gap-1.5 font-sans">
                  <Code2 size={13} className="text-neutral-500" strokeWidth={1.5} />
                  {project.language}
                </span>
              </div>
              <div className="flex flex-col gap-1.5">
                <span className="text-neutral-550 font-bold text-[9px]">Ingestion Type</span>
                <span className="text-ink-black font-bold text-xs font-sans">{project.uploadType}</span>
              </div>
              {project.repositoryUrl && (
                <div className="col-span-2 flex flex-col gap-1.5">
                  <span className="text-neutral-550 font-bold text-[9px]">GitHub Repository URL</span>
                  <span className="text-ink-black font-bold underline font-sans break-all select-all">{project.repositoryUrl}</span>
                </div>
              )}
              <div className="col-span-2 flex flex-col gap-1.5">
                <span className="text-neutral-550 font-bold text-[9px]">Local Directory Path</span>
                <span className="text-ink-black font-bold break-all bg-neutral-100 p-2 border border-ink-black select-all text-xs">{project.projectPath}</span>
              </div>
            </div>

            <div className="flex justify-between text-[9px] font-mono uppercase tracking-wider text-neutral-500 font-bold">
              <span>Ingested: {new Date(project.createdAt).toLocaleString()}</span>
              <span>Updated: {new Date(project.updatedAt).toLocaleString()}</span>
            </div>
          </div>

          {/* History */}
          <div className="bg-paper-bg border border-ink-black p-6 flex flex-col gap-6 sharp-corners">
            <h2 className="text-sm font-mono font-bold text-ink-black flex items-center gap-2 border-b border-ink-black pb-2 uppercase tracking-widest">
              <Sparkles size={16} className="text-ink-black" strokeWidth={1.5} />
              AI Code Review Runs
            </h2>

            {reviews.length > 0 ? (
              <div className="flex flex-col gap-4">
                {reviews.map((rev) => {
                  const bugCounts = getBugCounts(rev.bugs);
                  return (
                    <div 
                      key={rev._id}
                      className="p-4 bg-paper-bg hover:bg-neutral-100 border border-ink-black flex flex-col md:flex-row md:items-center justify-between gap-4 sharp-corners transition-colors"
                    >
                      <div className="flex flex-col gap-3 font-mono">
                        <div className="flex items-center gap-3 text-[10px] text-neutral-550 font-bold uppercase tracking-wider">
                          <span className="flex items-center gap-1">
                            <Calendar size={11} strokeWidth={1.5} />
                            {new Date(rev.createdAt).toLocaleString()}
                          </span>
                          <span>•</span>
                          <span className="text-ink-black font-extrabold font-sans">Score: {rev.overallScore}/100</span>
                        </div>

                        {/* Detailed Scores Row */}
                        <div className="grid grid-cols-4 gap-2 text-[9px] text-neutral-500 font-bold uppercase tracking-wider border-b border-ink-black/10 pb-2">
                          <div className="flex flex-col">
                            <span className="text-[8px]">Qual</span>
                            <span className="text-ink-black font-extrabold text-xs mt-0.5">{rev.qualityScore}</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[8px]">Sec</span>
                            <span className="text-ink-black font-extrabold text-xs mt-0.5">{rev.securityScore}</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[8px]">Perf</span>
                            <span className="text-ink-black font-extrabold text-xs mt-0.5">{rev.performanceScore}</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[8px]">Maint</span>
                            <span className="text-ink-black font-extrabold text-xs mt-0.5">{rev.maintainabilityScore}</span>
                          </div>
                        </div>

                        {/* Bugs Counts */}
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[9px] text-neutral-500 font-extrabold uppercase mr-1">Issues:</span>
                          {bugCounts.critical > 0 && (
                            <span className="px-2 py-0.5 bg-editorial-red text-paper-bg border border-editorial-red text-[8px] font-bold uppercase tracking-wider sharp-corners">
                              {bugCounts.critical} Critical
                            </span>
                          )}
                          {bugCounts.high > 0 && (
                            <span className="px-2 py-0.5 bg-editorial-red/10 text-editorial-red border border-editorial-red/20 text-[8px] font-bold uppercase tracking-wider sharp-corners">
                              {bugCounts.high} High
                            </span>
                          )}
                          {bugCounts.medium > 0 && (
                            <span className="px-2 py-0.5 bg-ink-black text-paper-bg border border-ink-black text-[8px] font-bold uppercase tracking-wider sharp-corners">
                              {bugCounts.medium} Med
                            </span>
                          )}
                          {bugCounts.low > 0 && (
                            <span className="px-2 py-0.5 bg-paper-bg text-ink-black border border-ink-black text-[8px] font-bold uppercase tracking-wider sharp-corners">
                              {bugCounts.low} Low
                            </span>
                          )}
                          {rev.bugs?.length === 0 && (
                            <span className="px-2 py-0.5 bg-ink-black text-paper-bg border border-ink-black text-[8px] font-bold uppercase tracking-wider sharp-corners">
                              0 Issues
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Link
                          href={`/reviews/${rev._id}`}
                          className="px-4 py-2 bg-paper-bg hover:bg-ink-black text-ink-black hover:text-paper-bg border border-ink-black text-xs font-mono uppercase tracking-widest font-bold sharp-corners transition-colors"
                        >
                          Explore Report
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-12 text-center text-neutral-500 font-mono text-xs border border-dashed border-ink-black sharp-corners">
                <span>No review scans executed yet. Click "Trigger AI Code Review" above to run analysis.</span>
              </div>
            )}
          </div>
        </div>

        {/* Right side: Actions & Danger Zone */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <div className="bg-paper-bg border border-ink-black p-6 flex flex-col gap-4 sharp-corners">
            <h2 className="text-sm font-mono font-bold text-ink-black flex items-center gap-2 border-b border-ink-black pb-2 uppercase tracking-widest">
              <Terminal size={16} className="text-editorial-red" strokeWidth={1.5} />
              Danger Zone
            </h2>
            <p className="text-xs text-neutral-600 font-body italic leading-relaxed">
              Permanently delete this project from the workspace, along with all repository content, review history records, and discussion context.
            </p>

            <button
              onClick={handleDeleteProject}
              disabled={actionLoading}
              className="mt-2 w-full py-3.5 border border-editorial-red text-editorial-red bg-transparent hover:bg-editorial-red hover:text-paper-bg hover:border-editorial-red font-mono text-xs uppercase tracking-widest transition-all duration-200 sharp-corners cursor-pointer font-bold"
            >
              Delete Project
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
