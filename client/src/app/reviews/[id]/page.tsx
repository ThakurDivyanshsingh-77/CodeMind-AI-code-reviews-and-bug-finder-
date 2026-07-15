'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { CodeReviewPanel } from '@/components/review/CodeReviewPanel';
import { ChatPanel } from '@/components/chat/ChatPanel';
import { ArrowLeft, Loader2, AlertCircle, Download } from 'lucide-react';
import api from '@/services/api';
import Link from 'next/link';

export default function ReviewPage() {
  const { id } = useParams();
  const router = useRouter();
  const [review, setReview] = useState<any>(null);
  const [files, setFiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [downloading, setDownloading] = useState(false);

  const fetchReviewData = async () => {
    try {
      // 1. Fetch review metrics and annotations
      const reviewResponse = await api.get(`/reviews/${id}`);
      if (!reviewResponse.data?.success) throw new Error('Failed to load review results');
      
      const reviewData = reviewResponse.data.data;
      setReview(reviewData);

      // 2. Fetch project source files contents
      const filesResponse = await api.get(`/projects/${reviewData.projectId._id}/files`);
      if (filesResponse.data?.success) {
        setFiles(filesResponse.data.data);
      }
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || err.message || 'Failed to load code review details');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadHtml = async () => {
    setDownloading(true);
    try {
      const response = await api.get(`/report/html/${id}`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'text/html' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `codemind_report_${id}.html`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      setErrorMsg('Failed to download HTML report');
    } finally {
      setDownloading(false);
    }
  };

  useEffect(() => {
    if (id) fetchReviewData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] bg-paper-bg text-ink-black dot-grid-bg">
        <div className="border border-ink-black p-6 bg-paper-bg sharp-corners flex flex-col gap-2 max-w-sm w-full text-center">
          <span className="text-xs uppercase tracking-widest font-mono font-bold">CodeMind AI</span>
          <div className="h-0.5 bg-ink-black w-full my-1"></div>
          <span className="text-sm font-body italic animate-pulse">Parsing Codebase & Loading AI Review findings...</span>
        </div>
      </div>
    );
  }

  if (errorMsg || !review) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4 text-ink-black">
        <div className="p-4 border border-editorial-red bg-editorial-red/5 text-editorial-red text-xs font-mono font-bold flex items-center gap-2 sharp-corners">
          <AlertCircle size={14} strokeWidth={1.5} />
          <span>ALERT: {errorMsg || 'Review data is missing.'}</span>
        </div>
        <Link href="/dashboard" className="text-xs font-mono font-bold uppercase tracking-widest hover:text-editorial-red underline flex items-center gap-1">
          <ArrowLeft size={12} /> Return to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:h-screen h-auto w-full text-ink-black p-4 md:p-6 md:overflow-hidden overflow-y-auto box-border">
      {/* Header bar */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center border-b border-ink-black pb-4 gap-4 flex-shrink-0">
        <div className="flex items-center gap-4">
          <Link 
            href="/dashboard" 
            className="p-2.5 border border-ink-black bg-paper-bg hover:bg-ink-black hover:text-paper-bg text-ink-black transition-colors sharp-corners flex items-center justify-center"
          >
            <ArrowLeft size={14} strokeWidth={1.5} />
          </Link>
          <div className="flex flex-col gap-1">
            <h1 className="text-lg font-serif font-black uppercase text-ink-black flex flex-wrap items-center gap-3">
              <span>Review Summary: {review.projectId?.name}</span>
              <button 
                onClick={handleDownloadHtml}
                disabled={downloading}
                className="flex items-center gap-1.5 px-3 py-1 bg-ink-black hover:bg-paper-bg text-paper-bg hover:text-ink-black border border-transparent hover:border-ink-black text-[10px] font-mono font-bold uppercase tracking-wider sharp-corners transition-colors cursor-pointer"
              >
                {downloading ? <Loader2 className="animate-spin" size={10} strokeWidth={1.5} /> : <Download size={10} strokeWidth={1.5} />}
                Export HTML
              </button>
            </h1>
            <p className="text-[10px] font-mono uppercase tracking-widest text-neutral-550">Overall Quality Rating Score: {review.overallScore}/100</p>
          </div>
        </div>

        {/* AI Summary card */}
        <div className="text-xs text-neutral-700 bg-paper-bg border border-ink-black p-3.5 sharp-corners max-w-xl italic leading-relaxed lg:self-stretch flex flex-col justify-center">
          <strong className="text-ink-black block not-italic mb-1 font-mono text-[9px] uppercase tracking-widest font-bold">AI Executive Summary:</strong>
          {review.aiSummary}
        </div>
      </div>

      {/* Code Review panel workspace with Chat Sidebar */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 md:flex-1 md:min-h-0 min-h-0 mt-6 pb-2">
        <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 md:h-full md:min-h-0 h-[600px] flex flex-col">
          <CodeReviewPanel 
            projectId={review.projectId?._id || review.projectId}
            bugs={review.bugs} 
            suggestions={review.suggestions} 
            files={files} 
          />
        </div>
        <div className="col-span-1 md:col-span-1 md:h-full md:min-h-0 h-[500px] flex flex-col">
          <ChatPanel reviewId={review._id} projectId={review.projectId._id} />
        </div>
      </div>
    </div>
  );
}
