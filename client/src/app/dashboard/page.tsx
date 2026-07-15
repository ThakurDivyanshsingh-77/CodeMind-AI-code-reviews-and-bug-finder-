'use client';

import React, { useState, useEffect } from 'react';
import { ScoreCard } from '@/components/dashboard/ScoreCard';
import { UploadWidget } from '@/components/dashboard/UploadWidget';
import { FolderCode, Play, AlertCircle, FileSearch, Trash2 } from 'lucide-react';
import api from '@/services/api';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';

export default function DashboardPage() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<any[]>([]);
  const [reviewsHistory, setReviewsHistory] = useState<any[]>([]);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  const fetchDashboardData = async () => {
    try {
      const projectsResponse = await api.get('/projects');
      if (projectsResponse.data?.success) {
        setProjects(projectsResponse.data.data);
      }
      
      const reviewsResponse = await api.get('/reviews/history');
      if (reviewsResponse.data?.success) {
        setReviewsHistory(reviewsResponse.data.data || []);
      }
    } catch (err: any) {
      setErrorMsg('Failed to load project database list');
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [refreshKey]);

  const handleUploadSuccess = (project: any) => {
    setSuccessMsg(`Project "${project.name}" uploaded successfully!`);
    setErrorMsg('');
    setRefreshKey(prev => prev + 1);
  };

  const handleUploadError = (msg: string) => {
    setErrorMsg(msg);
    setSuccessMsg('');
  };

  const handleStartReview = async (projectId: string) => {
    setErrorMsg('');
    setSuccessMsg('Initiating AI review pipeline...');
    try {
      const response = await api.post('/reviews/start', { projectId });
      if (response.data?.success) {
        setSuccessMsg('Review completed successfully!');
        setRefreshKey(prev => prev + 1);
      }
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Failed to complete review');
      setSuccessMsg('');
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    try {
      await api.delete(`/projects/${projectId}`);
      setSuccessMsg('Project removed successfully');
      setRefreshKey(prev => prev + 1);
    } catch (err) {
      setErrorMsg('Failed to remove project');
    }
  };

  // Helper to guess bug categories (exactly identical to reviews page categorizer)
  const getBugCategory = (bugDesc: string) => {
    const desc = bugDesc.toLowerCase();
    if (
      desc.includes('secret') || desc.includes('jwt') || desc.includes('key') || 
      desc.includes('pass') || desc.includes('security') || desc.includes('xss') || 
      desc.includes('csrf') || desc.includes('auth') || desc.includes('inject') || 
      desc.includes('vuln') || desc.includes('cors') || desc.includes('token')
    ) {
      return 'Security';
    }
    if (
      desc.includes('loop') || desc.includes('complexity') || desc.includes('leak') || 
      desc.includes('perf') || desc.includes('slow') || desc.includes('cache') || 
      desc.includes('timeout') || desc.includes('optimize')
    ) {
      return 'Performance';
    }
    if (
      desc.includes('dry') || desc.includes('naming') || desc.includes('format') || 
      desc.includes('refactor') || desc.includes('clean') || desc.includes('best practice') || 
      desc.includes('eslint') || desc.includes('redundant') || desc.includes('architecture') ||
      desc.includes('solid')
    ) {
      return 'Best Practice';
    }
    return 'Bug';
  };

  const calculateReviewScores = (review: any) => {
    let quality = 100;
    let security = 100;
    let performance = 100;
    let maintainability = 100;

    if (review && review.bugs) {
      review.bugs.forEach((b: any) => {
        const cat = getBugCategory(b.description || '');
        const sev = (b.severity || 'low').toLowerCase();
        
        let deduction = 2;
        if (sev === 'critical') deduction = 15;
        else if (sev === 'high') deduction = 10;
        else if (sev === 'medium') deduction = 5;

        if (cat === 'Bug') quality -= deduction;
        else if (cat === 'Security') security -= deduction;
        else if (cat === 'Performance') performance -= deduction;
        else if (cat === 'Best Practice') maintainability -= deduction;
      });
    }

    quality = Math.max(0, Math.min(100, quality));
    security = Math.max(0, Math.min(100, security));
    performance = Math.max(0, Math.min(100, performance));
    maintainability = Math.max(0, Math.min(100, maintainability));

    const overall = Math.round((quality + security + performance + maintainability) / 4);

    return { overall, quality, security, performance, maintainability };
  };

  // Helper to extract only the latest review score for each project to calculate average
  const getLatestProjectReviews = () => {
    const latestReviewsMap: { [key: string]: any } = {};
    const sorted = [...reviewsHistory].sort((a, b) => 
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
    sorted.forEach(review => {
      const projId = review.projectId?._id || review.projectId;
      if (projId) {
        latestReviewsMap[projId] = review;
      }
    });
    return Object.values(latestReviewsMap);
  };

  const activeReviews = getLatestProjectReviews();
  const hasReviews = activeReviews.length > 0;

  // Calculate scores for each active review on the fly to match categories
  const activeReviewScores = activeReviews.map(r => calculateReviewScores(r));

  const overallScore = hasReviews
    ? Math.round(activeReviewScores.reduce((sum, r) => sum + r.overall, 0) / activeReviews.length)
    : 88;

  const qualityScore = hasReviews
    ? Math.round(activeReviewScores.reduce((sum, r) => sum + r.quality, 0) / activeReviews.length)
    : 88;

  const securityScore = hasReviews
    ? Math.round(activeReviewScores.reduce((sum, r) => sum + r.security, 0) / activeReviews.length)
    : 92;

  const performanceScore = hasReviews
    ? Math.round(activeReviewScores.reduce((sum, r) => sum + r.performance, 0) / activeReviews.length)
    : 85;

  const maintainabilityScore = hasReviews
    ? Math.round(activeReviewScores.reduce((sum, r) => sum + r.maintainability, 0) / activeReviews.length)
    : 89;

  return (
    <div className="flex flex-col gap-8 max-w-7xl mx-auto text-ink-black">
      {/* Newspaper Editorial Header */}
      <div className="flex flex-col gap-3 pb-6 border-b border-ink-black">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div className="flex flex-col gap-1">
            <h1 className="text-4xl lg:text-5xl font-serif font-black tracking-tight leading-none">
              Welcome back, {user?.name}
            </h1>
            <p className="text-xs font-mono uppercase tracking-widest text-neutral-500 mt-2">
              Scan and review your codebase issues with machine precision.
            </p>
          </div>
        </div>

        {/* Edition metadata bar typical of morning papers */}
        <div className="border-y-2 border-ink-black py-2.5 mt-2 flex flex-col sm:flex-row justify-between items-center text-[10px] font-mono uppercase tracking-widest font-bold text-ink-black w-full gap-2">
          <span>Edition: Vol. I / No. 12</span>
          <span className="hidden sm:inline">•</span>
          <span>Printed in NYC</span>
          <span className="hidden sm:inline">•</span>
          <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
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

      {/* Scorecards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <ScoreCard 
          title="Overall Code Quality" 
          score={overallScore} 
          description="Average health of active code repositories."
          color="blue"
        />
        <ScoreCard 
          title="Security Index" 
          score={securityScore} 
          description="Average safety from injection and leaks."
          color="emerald"
        />
        <ScoreCard 
          title="Performance Index" 
          score={performanceScore} 
          description="Optimization levels of modules."
          color="amber"
        />
        <ScoreCard 
          title="Maintainability" 
          score={maintainabilityScore} 
          description="Cognitive load and documentation ratios."
          color="rose"
        />
      </div>

      {/* Workspaces & uploads split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Projects Card container in Newsprint style */}
          <div className="bg-paper-bg border border-ink-black p-6 flex flex-col gap-6 sharp-corners">
            <h2 className="text-lg font-serif font-black text-ink-black flex items-center gap-2 pb-3 border-b border-ink-black uppercase tracking-wider">
              <FolderCode size={20} className="text-ink-black" strokeWidth={1.5} />
              Active Project Index
            </h2>

            {projects.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-ink-black text-ink-black font-mono font-bold uppercase tracking-wider">
                      <th className="py-3 px-4">Project Name</th>
                      <th className="py-3 px-4">Language</th>
                      <th className="py-3 px-4">Ingestion Type</th>
                      <th className="py-3 px-4">Review Status</th>
                      <th className="py-3 px-4 text-right">Action Pipeline</th>
                    </tr>
                  </thead>
                  <tbody>
                    {projects.map((proj) => (
                      <tr key={proj._id} className="border-b border-neutral-300 hover:bg-neutral-100 text-ink-black transition-colors font-mono">
                        <td className="py-4 px-4 font-bold font-sans">
                          <Link href={`/projects/${proj._id}`} className="underline hover:text-editorial-red transition-colors">
                            {proj.name}
                          </Link>
                        </td>
                        <td className="py-4 px-4 text-[11px] uppercase">{proj.language}</td>
                        <td className="py-4 px-4 text-[11px] uppercase tracking-wider">{proj.uploadType}</td>
                        <td className="py-4 px-4">
                          <span className={`px-2.5 py-0.5 border text-[9px] font-mono font-bold uppercase tracking-wider sharp-corners ${
                            proj.status === 'completed' 
                              ? 'bg-ink-black text-paper-bg border-ink-black'
                              : proj.status === 'processing'
                              ? 'bg-editorial-red text-paper-bg border-editorial-red animate-pulse'
                              : 'bg-paper-bg text-ink-black border-ink-black'
                          }`}>
                            {proj.status}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-right flex justify-end gap-2">
                          {proj.status === 'uploaded' && (
                            <button
                              onClick={() => handleStartReview(proj._id)}
                              className="p-2 bg-ink-black hover:bg-paper-bg text-paper-bg hover:text-ink-black border border-ink-black transition-colors sharp-corners cursor-pointer"
                              title="Start AI Review"
                            >
                              <Play size={10} strokeWidth={1.5} />
                            </button>
                          )}
                          {proj.status === 'completed' && (
                            <Link
                              href={`/reviews/${proj._id}`}
                              className="p-2 bg-paper-bg hover:bg-ink-black text-ink-black hover:text-paper-bg border border-ink-black transition-colors sharp-corners"
                              title="View Report"
                            >
                              <FileSearch size={10} strokeWidth={1.5} />
                            </Link>
                          )}
                          <button
                            onClick={() => handleDeleteProject(proj._id)}
                            className="p-2 border border-editorial-red/20 text-editorial-red hover:bg-editorial-red hover:text-paper-bg hover:border-editorial-red transition-all duration-150 sharp-corners cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 size={10} strokeWidth={1.5} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="py-16 flex flex-col items-center justify-center border border-dashed border-ink-black gap-2 text-neutral-500 text-xs font-mono sharp-corners">
                <span className="font-bold uppercase tracking-wider text-ink-black">No Active Repositories</span>
                <span className="italic">Upload a ZIP file or import a GitHub repository on the sidebar.</span>
              </div>
            )}
          </div>
        </div>

        {/* Upload widget sidebar */}
        <div className="lg:col-span-1">
          <UploadWidget onSuccess={handleUploadSuccess} onError={handleUploadError} />
        </div>
      </div>
    </div>
  );
}
