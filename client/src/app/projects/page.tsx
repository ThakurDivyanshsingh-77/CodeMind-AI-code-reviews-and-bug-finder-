'use client';

import React, { useState, useEffect } from 'react';
import { UploadWidget } from '@/components/dashboard/UploadWidget';
import { FolderCode, Play, AlertCircle, FileSearch, Trash2, Calendar, FileCode2 } from 'lucide-react';
import api from '@/services/api';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';

export default function ProjectsPage() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<any[]>([]);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchProjects = async () => {
    try {
      const response = await api.get('/projects');
      if (response.data?.success) {
        setProjects(response.data.data);
      }
    } catch (err: any) {
      setErrorMsg('Failed to load projects list');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
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

  return (
    <div className="flex flex-col gap-8 max-w-7xl mx-auto text-ink-black">
      {/* Editorial Header */}
      <div className="flex flex-col gap-3 pb-6 border-b border-ink-black">
        <div className="flex justify-between items-center">
          <div className="flex flex-col gap-1">
            <h1 className="text-4xl lg:text-5xl font-serif font-black tracking-tight leading-none flex items-center gap-3">
              Projects Workspace
            </h1>
            <p className="text-xs font-mono uppercase tracking-widest text-neutral-500 mt-2">
              Manage your repositories and inspect AI analysis reports.
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

      {/* Main split view */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left side: Projects List */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="bg-paper-bg border border-ink-black p-6 flex flex-col gap-6 sharp-corners">
            <h2 className="text-lg font-serif font-black text-ink-black flex items-center gap-2 pb-3 border-b border-ink-black uppercase tracking-wider">
              <FileCode2 size={20} className="text-ink-black" strokeWidth={1.5} />
              Your Codebase Index
            </h2>

            {loading ? (
              <div className="py-12 text-center text-neutral-500 font-mono text-xs">
                <span>Loading repositories...</span>
              </div>
            ) : projects.length > 0 ? (
              <div className="flex flex-col gap-4">
                {projects.map((proj) => (
                  <div 
                    key={proj._id} 
                    className="p-4 bg-paper-bg hover:bg-neutral-100 border border-ink-black flex items-center justify-between gap-4 transition-all duration-200 sharp-corners"
                  >
                    <div className="flex flex-col gap-1.5 min-w-0">
                      <Link 
                        href={`/projects/${proj._id}`}
                        className="font-bold text-ink-black underline hover:text-editorial-red transition-colors text-sm truncate"
                      >
                        {proj.name}
                      </Link>
                      <div className="flex flex-wrap items-center gap-3 text-[10px] text-neutral-550 font-mono uppercase tracking-wider">
                        <span>Language: {proj.language}</span>
                        <span>•</span>
                        <span>Type: {proj.uploadType}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Calendar size={11} strokeWidth={1.5} />
                          {new Date(proj.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 flex-shrink-0">
                      <span className={`px-2.5 py-0.5 border text-[9px] font-mono font-bold uppercase tracking-wider sharp-corners ${
                        proj.status === 'completed' 
                          ? 'bg-ink-black text-paper-bg border-ink-black'
                          : proj.status === 'processing'
                          ? 'bg-editorial-red text-paper-bg border-editorial-red animate-pulse'
                          : 'bg-paper-bg text-ink-black border-ink-black'
                      }`}>
                        {proj.status}
                      </span>

                      <div className="flex gap-1.5">
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
                        <Link
                          href={`/projects/${proj._id}`}
                          className="p-2 bg-paper-bg hover:bg-ink-black text-ink-black hover:text-paper-bg border border-ink-black transition-colors sharp-corners"
                          title="Project Details"
                        >
                          <FolderCode size={10} strokeWidth={1.5} />
                        </Link>
                        <button
                          onClick={() => handleDeleteProject(proj._id)}
                          className="p-2 border border-editorial-red/20 text-editorial-red hover:bg-editorial-red hover:text-paper-bg hover:border-editorial-red transition-all duration-150 sharp-corners cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 size={10} strokeWidth={1.5} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-16 flex flex-col items-center justify-center border border-dashed border-ink-black gap-2 text-neutral-500 text-xs font-mono sharp-corners">
                <span className="font-bold uppercase tracking-wider text-ink-black">No Active Repositories</span>
                <span className="italic">Upload a ZIP file or import a GitHub repository on the sidebar.</span>
              </div>
            )}
          </div>
        </div>

        {/* Right side: Upload Widget */}
        <div className="lg:col-span-1">
          <UploadWidget onSuccess={handleUploadSuccess} onError={handleUploadError} />
        </div>
      </div>
    </div>
  );
}
