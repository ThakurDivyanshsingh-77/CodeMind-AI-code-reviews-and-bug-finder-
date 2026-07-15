'use client';

import React, { useState } from 'react';
import { Upload, GitBranch, ArrowRight, Loader2 } from 'lucide-react';
import api from '@/services/api';

interface UploadWidgetProps {
  onSuccess: (project: any) => void;
  onError: (message: string) => void;
}

export const UploadWidget = ({ onSuccess, onError }: UploadWidgetProps) => {
  const [activeTab, setActiveTab] = useState<'zip' | 'github'>('zip');
  const [name, setName] = useState('');
  const [language, setLanguage] = useState('JavaScript');
  const [repoUrl, setRepoUrl] = useState('');
  const [zipFile, setZipFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleZipChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setZipFile(e.target.files[0]);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return onError('Please enter a project name');

    setLoading(true);
    try {
      if (activeTab === 'zip') {
        if (!zipFile) throw new Error('Please select a ZIP file');
        const formData = new FormData();
        formData.append('file', zipFile);
        formData.append('name', name);
        formData.append('language', language);

        const response = await api.post('/projects/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        if (response.data?.success) onSuccess(response.data.data);
      } else {
        if (!repoUrl.trim()) throw new Error('Please enter a GitHub repository URL');
        const response = await api.post('/projects/github', {
          name,
          language,
          repoUrl
        });
        if (response.data?.success) onSuccess(response.data.data);
      }
    } catch (err: any) {
      onError(err.response?.data?.message || err.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-paper-bg border border-ink-black p-6 flex flex-col gap-6 sharp-corners">
      {/* Tabs */}
      <div className="flex border border-ink-black self-start sharp-corners p-0 bg-transparent">
        <button
          type="button"
          onClick={() => setActiveTab('zip')}
          className={`flex items-center gap-2 px-4 py-2 text-[10px] font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
            activeTab === 'zip'
              ? 'bg-ink-black text-paper-bg'
              : 'text-ink-black hover:bg-neutral-100'
          }`}
        >
          <Upload size={12} strokeWidth={1.5} />
          ZIP Upload
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('github')}
          className={`flex items-center gap-2 px-4 py-2 text-[10px] font-mono font-bold uppercase tracking-wider transition-all cursor-pointer border-l border-ink-black ${
            activeTab === 'github'
              ? 'bg-ink-black text-paper-bg'
              : 'text-ink-black hover:bg-neutral-100'
          }`}
        >
          <GitBranch size={12} strokeWidth={1.5} />
          GitHub Repo
        </button>
      </div>

      <form onSubmit={handleUpload} className="flex flex-col gap-6">
        {/* Form fields */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-mono font-bold uppercase tracking-widest text-ink-black">Project Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. MyPortfolio"
              className="border-b-2 border-ink-black bg-transparent px-3 py-2 font-mono text-xs focus:bg-neutral-100 focus:outline-none sharp-corners text-ink-black w-full"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-mono font-bold uppercase tracking-widest text-ink-black">Language</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="border-b-2 border-ink-black bg-transparent px-3 py-2 font-mono text-xs focus:bg-neutral-100 focus:outline-none sharp-corners text-ink-black w-full cursor-pointer"
            >
              <option className="bg-paper-bg text-ink-black">JavaScript</option>
              <option className="bg-paper-bg text-ink-black">TypeScript</option>
              <option className="bg-paper-bg text-ink-black">Python</option>
              <option className="bg-paper-bg text-ink-black">Java</option>
              <option className="bg-paper-bg text-ink-black">Go</option>
            </select>
          </div>
        </div>

        {/* Tab views */}
        {activeTab === 'zip' ? (
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-mono font-bold uppercase tracking-widest text-ink-black">Archive File</label>
            <div className="border border-dashed border-ink-black bg-transparent hover:bg-neutral-100 p-8 flex flex-col items-center gap-3 relative cursor-pointer group sharp-corners min-h-[140px] justify-center">
              {/* Halftone simulation texture layer */}
              <div className="bg-[radial-gradient(#111111_1px,transparent_1px)] opacity-5 absolute inset-0 [background-size:10px_10px] pointer-events-none" />
              
              <input
                type="file"
                accept=".zip"
                onChange={zipFile ? undefined : handleZipChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <Upload size={28} className="text-ink-black group-hover:scale-110 transition-transform duration-200" strokeWidth={1.5} />
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-ink-black z-10">
                {zipFile ? zipFile.name : 'Click or Drag ZIP file here'}
              </span>
              <span className="text-[10px] font-mono text-neutral-500 z-10">Max size 50MB</span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-mono font-bold uppercase tracking-widest text-ink-black">Repository URL</label>
            <input
              type="url"
              required
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              placeholder="https://github.com/user/repository"
              className="border-b-2 border-ink-black bg-transparent px-3 py-2 font-mono text-xs focus:bg-neutral-100 focus:outline-none sharp-corners text-ink-black w-full"
            />
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="bg-ink-black text-paper-bg border border-transparent hover:bg-paper-bg hover:text-ink-black hover:border-ink-black py-3.5 px-4 font-mono text-xs uppercase tracking-widest transition-all duration-200 sharp-corners flex items-center justify-center gap-2 cursor-pointer w-full disabled:bg-neutral-400 disabled:text-neutral-200 disabled:border-transparent disabled:cursor-not-allowed font-bold"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" size={14} strokeWidth={1.5} />
              Ingesting Codebase...
            </>
          ) : (
            <>
              Ingest & Start Analysis
              <ArrowRight size={14} strokeWidth={1.5} />
            </>
          )}
        </button>
      </form>
    </div>
  );
};
