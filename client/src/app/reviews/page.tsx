'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Sidebar } from '@/components/shared/Sidebar';
import { Navbar } from '@/components/shared/Navbar';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { 
  FileSearch, Calendar, Search, AlertCircle, Loader2, ArrowRight, Sparkles,
  TrendingUp, TrendingDown, ShieldAlert, Activity, Award, BarChart3, AlertTriangle,
  History, Clock, CheckCircle2, ChevronRight, FileCode2, Code, ShieldCheck
} from 'lucide-react';
import api from '@/services/api';
import Link from 'next/link';

export default function ReviewsHistoryPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  
  // Navigation & Tabs
  const [activeTab, setActiveTab] = useState<'analytics' | 'history'>('analytics');
  const [selectedProjectId, setSelectedProjectId] = useState<string>('all');
  
  // History Search/Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [minScoreFilter, setMinScoreFilter] = useState('0');
  const [latestOnly, setLatestOnly] = useState(false);

  // Tooltip state for interactive charts
  const [hoveredPoint, setHoveredPoint] = useState<{ x: number, y: number, score: number, date: string } | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  const fetchReviewsHistory = async () => {
    try {
      const response = await api.get('/reviews/history');
      if (response.data?.success) {
        setReviews(response.data.data);
      }
    } catch (err: any) {
      setErrorMsg('Failed to load code reviews history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchReviewsHistory();
    }
  }, [user]);

  // Project List Extracted from Reviews
  const projectsList = useMemo(() => {
    const listMap = new Map<string, string>();
    reviews.forEach(r => {
      const p = r.projectId;
      if (p && p._id && p.name) {
        listMap.set(p._id, p.name);
      }
    });
    return Array.from(listMap.entries()).map(([id, name]) => ({ id, name }));
  }, [reviews]);

  // Active reviews based on Project Selection
  const projectSpecificReviews = useMemo(() => {
    if (selectedProjectId === 'all') return reviews;
    return reviews.filter(r => (r.projectId?._id || r.projectId) === selectedProjectId);
  }, [reviews, selectedProjectId]);

  // Filtered reviews for the History Log Tab
  const filteredHistoryReviews = useMemo(() => {
    let list = projectSpecificReviews;
    if (latestOnly) {
      const seenProjects = new Set();
      list = projectSpecificReviews.filter((rev) => {
        const pId = rev.projectId?._id || rev.projectId;
        if (!pId) return true;
        if (seenProjects.has(pId)) return false;
        seenProjects.add(pId);
        return true;
      });
    }

    return list.filter((rev) => {
      const projectName = rev.projectId?.name || '';
      const matchesSearch = projectName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesScore = rev.overallScore >= parseInt(minScoreFilter);
      return matchesSearch && matchesScore;
    });
  }, [projectSpecificReviews, searchQuery, minScoreFilter, latestOnly]);

  // General Heuristics Helper to guess bug categories
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

  // Compile Analytics Dashboard Stats
  const analyticsData = useMemo(() => {
    const sorted = [...projectSpecificReviews].sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

    let totalScore = 0;
    let totalBugs = 0;
    let categoryCounts = { Security: 0, Bug: 0, Performance: 0, 'Best Practice': 0 };
    let severityCounts = { critical: 0, high: 0, medium: 0, low: 0 };

    sorted.forEach((rev) => {
      totalScore += rev.overallScore;
      if (rev.bugs) {
        totalBugs += rev.bugs.length;
        rev.bugs.forEach((b: any) => {
          // Categorize using heuristic
          const cat = getBugCategory(b.description);
          categoryCounts[cat]++;
          
          // Severity
          const sev = (b.severity || 'low').toLowerCase();
          if (sev in severityCounts) {
            severityCounts[sev as keyof typeof severityCounts]++;
          }
        });
      }
    });

    const averageScore = sorted.length > 0 ? Math.round(totalScore / sorted.length) : 100;

    // Compile repeating mistakes tracker
    const mistakeGroups = new Map<string, { title: string, category: string, severity: string, count: number, history: number[], lastSeen: string }>();
    
    sorted.forEach((rev, revIdx) => {
      if (rev.bugs) {
        rev.bugs.forEach((b: any) => {
          const desc = b.description || '';
          const title = desc.includes(':') ? desc.split(':')[0].trim() : desc.substring(0, 45).trim();
          
          const cat = getBugCategory(desc);
          const key = `${cat}-${title}`;

          if (!mistakeGroups.has(key)) {
            mistakeGroups.set(key, {
              title,
              category: cat,
              severity: b.severity,
              count: 0,
              history: Array(sorted.length).fill(0),
              lastSeen: new Date(rev.createdAt).toLocaleDateString()
            });
          }
          
          const group = mistakeGroups.get(key)!;
          group.count++;
          group.history[revIdx] = 1; // Mark present in this scan
          group.lastSeen = new Date(rev.createdAt).toLocaleDateString();
        });
      }
    });

    const repeatingMistakes = Array.from(mistakeGroups.values())
      .filter(g => g.count > 0)
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);

    return {
      sortedScans: sorted,
      averageScore,
      totalBugs,
      categoryCounts,
      severityCounts,
      repeatingMistakes
    };
  }, [projectSpecificReviews]);

  // Line Chart Calculations for Score and Bugs over time
  const lineChartPoints = useMemo(() => {
    const data = analyticsData.sortedScans;
    if (data.length === 0) return { 
      scorePath: '', 
      bugsPath: '', 
      gridLines: [], 
      points: [],
      width: 600,
      height: 240,
      padding: 40,
      chartW: 520,
      chartH: 160
    };

    const width = 600;
    const height = 240;
    const padding = 40;

    const chartW = width - padding * 2;
    const chartH = height - padding * 2;

    const points = data.map((rev, i) => {
      const x = padding + (data.length > 1 ? (i / (data.length - 1)) * chartW : chartW / 2);
      const yScore = padding + chartH - (rev.overallScore / 100) * chartH;
      
      const maxBugs = Math.max(...data.map(r => r.bugs?.length || 0), 5);
      const bugsCount = rev.bugs?.length || 0;
      const yBugs = padding + chartH - (bugsCount / maxBugs) * chartH;

      return {
        x,
        yScore,
        yBugs,
        score: rev.overallScore,
        bugs: bugsCount,
        date: new Date(rev.createdAt).toLocaleDateString()
      };
    });

    const scorePath = points.length > 1 
      ? points.reduce((path, p, i) => path + (i === 0 ? `M ${p.x} ${p.yScore}` : ` L ${p.x} ${p.yScore}`), '') 
      : '';

    const bugsPath = points.length > 1
      ? points.reduce((path, p, i) => path + (i === 0 ? `M ${p.x} ${p.yBugs}` : ` L ${p.x} ${p.yBugs}`), '')
      : '';

    const gridLines = [0, 0.25, 0.5, 0.75, 1].map(pct => padding + pct * chartH);

    return { scorePath, bugsPath, gridLines, points, width, height, padding, chartW, chartH };
  }, [analyticsData]);

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-paper-bg text-ink-black dot-grid-bg">
        <div className="border border-ink-black p-6 bg-paper-bg sharp-corners flex flex-col gap-2 max-w-sm w-full text-center">
          <span className="text-xs uppercase tracking-widest font-mono font-bold">CodeMind AI</span>
          <div className="h-0.5 bg-ink-black w-full my-1"></div>
          <span className="text-sm font-body italic animate-pulse">Authenticating Session...</span>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-paper-bg text-ink-black dot-grid-bg flex">
      <Sidebar />
      <div className="flex-1 pl-64">
        <Navbar />
        <main className="pt-20 p-6 min-h-[calc(100vh-4rem)] newsprint-texture">
          <div className="flex flex-col gap-8 max-w-7xl mx-auto">
            {/* Header row */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-ink-black pb-6 gap-4">
              <div className="flex flex-col gap-1">
                <h1 className="text-4xl lg:text-5xl font-serif font-black tracking-tight leading-none uppercase text-ink-black flex items-center gap-3">
                  Deep Analytics
                </h1>
                <p className="text-xs font-mono uppercase tracking-widest text-neutral-500 mt-2">Track scores progression, codebase bugs trendlines, and developer coding profiles.</p>
              </div>

              {/* Project Selector dropdown */}
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-ink-black">Filter Workspace:</span>
                <select
                  value={selectedProjectId}
                  onChange={(e) => setSelectedProjectId(e.target.value)}
                  className="bg-paper-bg border border-ink-black text-xs font-mono font-bold text-ink-black px-4 py-2 cursor-pointer focus:bg-neutral-100 outline-none sharp-corners"
                >
                  <option value="all">All Repositories ({projectsList.length})</option>
                  {projectsList.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div className="p-4 border border-editorial-red bg-editorial-red/5 text-editorial-red text-xs font-mono font-bold flex items-center gap-2 sharp-corners">
                <AlertCircle size={14} strokeWidth={1.5} />
                <span>ALERT: {errorMsg}</span>
              </div>
            )}

            {/* Dashboard Tabs navigation */}
            <div className="flex border-b border-ink-black">
              <button
                onClick={() => setActiveTab('analytics')}
                className={`px-5 py-3 border-b-2 text-xs font-mono uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
                  activeTab === 'analytics'
                    ? 'border-ink-black text-ink-black font-bold bg-neutral-100'
                    : 'border-transparent text-neutral-500 hover:text-ink-black'
                }`}
              >
                <Activity size={13} strokeWidth={1.5} />
                Analytics Dashboard
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`px-5 py-3 border-b-2 text-xs font-mono uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
                  activeTab === 'history'
                    ? 'border-ink-black text-ink-black font-bold bg-neutral-100'
                    : 'border-transparent text-neutral-500 hover:text-ink-black'
                }`}
              >
                <History size={13} strokeWidth={1.5} />
                Scan History Log
              </button>
            </div>

            {/* Active view */}
            {loading ? (
              <div className="py-24 flex flex-col items-center justify-center gap-3 text-ink-black text-xs font-mono">
                <Loader2 className="animate-spin text-ink-black" size={20} strokeWidth={1.5} />
                <span>Loading analytics database...</span>
              </div>
            ) : projectSpecificReviews.length === 0 ? (
              <div className="py-20 flex flex-col items-center justify-center gap-3 border border-dashed border-ink-black text-neutral-550 text-xs font-mono text-center max-w-lg mx-auto sharp-corners">
                <FileSearch size={28} className="text-neutral-400" strokeWidth={1.5} />
                <span className="font-bold text-ink-black uppercase tracking-wider">No Analysis History Found</span>
                <span className="italic">Select a repository or trigger a code review to start compiling your dashboard.</span>
                <Link href="/projects" className="mt-4 bg-ink-black text-paper-bg border border-transparent hover:bg-paper-bg hover:text-ink-black hover:border-ink-black px-4 py-2 font-mono text-xs uppercase tracking-widest font-bold sharp-corners transition-all duration-200">
                  Go to Projects
                </Link>
              </div>
            ) : activeTab === 'analytics' ? (
              <div className="flex flex-col gap-6">
                
                {/* Stats cards row */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  {/* Avg Score */}
                  <div className="bg-paper-bg border border-ink-black p-5 flex items-center justify-between relative overflow-hidden group sharp-corners hard-shadow-hover">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-ink-black"></div>
                    <div className="flex flex-col gap-1.5 pl-1 mt-1">
                      <span className="text-[10px] font-mono font-bold text-neutral-500 uppercase tracking-widest">Avg Quality Score</span>
                      <span className="text-4xl font-serif font-black text-ink-black">{analyticsData.averageScore}</span>
                      <span className="text-[9px] font-mono font-bold text-neutral-600 flex items-center gap-0.5 uppercase tracking-wide">
                        ✦ Highly Stable Code
                      </span>
                    </div>
                    <div className="p-2 border border-ink-black bg-neutral-100 text-ink-black sharp-corners">
                      <CheckCircle2 size={16} strokeWidth={1.5} />
                    </div>
                  </div>

                  {/* Total Scans */}
                  <div className="bg-paper-bg border border-ink-black p-5 flex items-center justify-between relative overflow-hidden group sharp-corners hard-shadow-hover">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-ink-black"></div>
                    <div className="flex flex-col gap-1.5 pl-1 mt-1">
                      <span className="text-[10px] font-mono font-bold text-neutral-500 uppercase tracking-widest">Total Scans Executed</span>
                      <span className="text-4xl font-serif font-black text-ink-black">{analyticsData.sortedScans.length}</span>
                      <span className="text-[9px] font-mono font-bold text-neutral-600 flex items-center gap-0.5 uppercase tracking-wide">
                        ✦ Continuous Scans
                      </span>
                    </div>
                    <div className="p-2 border border-ink-black bg-neutral-100 text-ink-black sharp-corners">
                      <History size={16} strokeWidth={1.5} />
                    </div>
                  </div>

                  {/* Total Bugs */}
                  <div className="bg-paper-bg border border-ink-black p-5 flex items-center justify-between relative overflow-hidden group sharp-corners hard-shadow-hover">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-editorial-red"></div>
                    <div className="flex flex-col gap-1.5 pl-1 mt-1">
                      <span className="text-[10px] font-mono font-bold text-neutral-500 uppercase tracking-widest">Total Bugs Detected</span>
                      <span className="text-4xl font-serif font-black text-ink-black">{analyticsData.totalBugs}</span>
                      <span className="text-[9px] font-mono font-bold text-editorial-red flex items-center gap-0.5 uppercase tracking-wide">
                        ✦ Requires Mitigation
                      </span>
                    </div>
                    <div className="p-2 border border-editorial-red/30 bg-editorial-red/5 text-editorial-red sharp-corners">
                      <ShieldAlert size={16} strokeWidth={1.5} />
                    </div>
                  </div>

                  {/* Security Health */}
                  <div className="bg-paper-bg border border-ink-black p-5 flex items-center justify-between relative overflow-hidden group sharp-corners hard-shadow-hover">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-editorial-red"></div>
                    <div className="flex flex-col gap-1.5 pl-1 mt-1">
                      <span className="text-[10px] font-mono font-bold text-neutral-500 uppercase tracking-widest">Critical Issues</span>
                      <span className="text-4xl font-serif font-black text-ink-black">
                        {analyticsData.severityCounts.critical + analyticsData.severityCounts.high}
                      </span>
                      <span className="text-[9px] font-mono font-bold text-editorial-red flex items-center gap-0.5 uppercase tracking-wide">
                        ✦ High Alert Items
                      </span>
                    </div>
                    <div className="p-2 border border-editorial-red/30 bg-editorial-red/5 text-editorial-red sharp-corners">
                      <Activity size={16} strokeWidth={1.5} />
                    </div>
                  </div>
                </div>

                {/* Graph grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-6">
                  
                  {/* Left Chart Card: Line Graph */}
                  <div className="lg:col-span-2 bg-paper-bg border border-ink-black p-6 flex flex-col gap-4 relative sharp-corners">
                    <div className="flex justify-between items-center border-b border-ink-black pb-3">
                      <div className="flex flex-col gap-1">
                        <h3 className="text-sm font-mono font-bold uppercase tracking-widest text-ink-black flex items-center gap-1.5">
                          <BarChart3 size={15} strokeWidth={1.5} />
                          Codebase Score & Bugs Trend
                        </h3>
                        <p className="text-[10px] font-mono uppercase tracking-wider text-neutral-500">Track quality score and bug frequency over scans.</p>
                      </div>
                      
                      {/* Legend indicators */}
                      <div className="flex items-center gap-4 text-[10px] font-mono font-bold uppercase tracking-wider">
                        <span className="flex items-center gap-1.5 text-ink-black">
                          <span className="w-2.5 h-2.5 bg-ink-black sharp-corners"></span> Score
                        </span>
                        <span className="flex items-center gap-1.5 text-editorial-red">
                          <span className="w-2.5 h-2.5 bg-editorial-red sharp-corners"></span> Bugs
                        </span>
                      </div>
                    </div>

                    {/* SVG Line Chart */}
                    {lineChartPoints.points.length > 0 ? (
                      <div className="relative flex justify-center py-2 h-64 select-none">
                        <svg 
                          viewBox={`0 0 ${lineChartPoints.width} ${lineChartPoints.height}`}
                          className="w-full h-full"
                        >
                          {/* Defs for gradients */}
                          <defs>
                            <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#111111" stopOpacity="0.1"/>
                              <stop offset="100%" stopColor="#111111" stopOpacity="0.0"/>
                            </linearGradient>
                            <linearGradient id="bugsGrad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#CC0000" stopOpacity="0.08"/>
                              <stop offset="100%" stopColor="#CC0000" stopOpacity="0.0"/>
                            </linearGradient>
                          </defs>

                          {/* Grid Lines */}
                          {lineChartPoints.gridLines.map((y, idx) => (
                            <line 
                              key={idx}
                              x1={lineChartPoints.padding}
                              y1={y}
                              x2={lineChartPoints.width - lineChartPoints.padding}
                              y2={y}
                              stroke="#111111"
                              strokeOpacity="0.08"
                              strokeWidth="1"
                              strokeDasharray="4 4"
                            />
                          ))}

                          {/* Render Filled Gradient Areas (under paths) */}
                          {lineChartPoints.points.length > 1 && (
                            <>
                              {/* Score Area */}
                              <path 
                                d={`${lineChartPoints.scorePath} L ${lineChartPoints.points[lineChartPoints.points.length - 1].x} ${lineChartPoints.height - lineChartPoints.padding} L ${lineChartPoints.points[0].x} ${lineChartPoints.height - lineChartPoints.padding} Z`}
                                fill="url(#scoreGrad)"
                              />
                              {/* Bugs Area */}
                              <path 
                                d={`${lineChartPoints.bugsPath} L ${lineChartPoints.points[lineChartPoints.points.length - 1].x} ${lineChartPoints.height - lineChartPoints.padding} L ${lineChartPoints.points[0].x} ${lineChartPoints.height - lineChartPoints.padding} Z`}
                                fill="url(#bugsGrad)"
                              />
                            </>
                          )}

                          {/* Render line paths */}
                          {lineChartPoints.points.length > 1 ? (
                            <>
                              <path 
                                d={lineChartPoints.scorePath}
                                fill="none"
                                stroke="#111111"
                                strokeWidth="2"
                                strokeLinecap="square"
                                strokeLinejoin="miter"
                              />
                              <path 
                                d={lineChartPoints.bugsPath}
                                fill="none"
                                stroke="#CC0000"
                                strokeWidth="1.5"
                                strokeLinecap="square"
                                strokeLinejoin="miter"
                              />
                            </>
                          ) : null}

                          {/* Interaction Data Points */}
                          {lineChartPoints.points.map((p, idx) => (
                            <g key={idx}>
                              {/* Vertical guide line on hover */}
                              {hoveredPoint?.date === p.date && (
                                <line 
                                  x1={p.x}
                                  y1={lineChartPoints.padding}
                                  x2={p.x}
                                  y2={lineChartPoints.height - lineChartPoints.padding}
                                  stroke="#111111"
                                  strokeWidth="1"
                                  strokeOpacity="0.2"
                                />
                              )}
                              {/* Score Point */}
                              <circle 
                                cx={p.x}
                                cy={p.yScore}
                                r="4"
                                fill="#111111"
                                stroke="#F9F9F7"
                                strokeWidth="1.5"
                                className="cursor-pointer transition-transform hover:scale-150"
                                onMouseEnter={(e) => setHoveredPoint({ x: p.x, y: p.yScore, score: p.score, date: p.date })}
                                onMouseLeave={() => setHoveredPoint(null)}
                              />
                              {/* Bugs Point */}
                              <circle 
                                cx={p.x}
                                cy={p.yBugs}
                                r="4"
                                fill="#CC0000"
                                stroke="#F9F9F7"
                                strokeWidth="1.5"
                                className="cursor-pointer transition-transform hover:scale-150"
                                onMouseEnter={(e) => setHoveredPoint({ x: p.x, y: p.yBugs, score: p.bugs, date: p.date })}
                                onMouseLeave={() => setHoveredPoint(null)}
                              />
                            </g>
                          ))}
                        </svg>

                        {/* Floating Tooltip */}
                        {hoveredPoint && (
                          <div 
                            className="absolute bg-paper-bg border border-ink-black p-2 shadow-none text-[10px] font-mono pointer-events-none z-10 flex flex-col gap-0.5 font-bold text-ink-black sharp-corners"
                            style={{ 
                              left: `${(hoveredPoint.x / lineChartPoints.width) * 100}%`,
                              top: `${(hoveredPoint.y / lineChartPoints.height) * 100 - 15}%`,
                              transform: 'translate(-50%, -100%)'
                            }}
                          >
                            <span className="text-neutral-500">{hoveredPoint.date}</span>
                            <span className="text-ink-black uppercase">Value: {hoveredPoint.score}</span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="py-20 text-center text-neutral-500 font-mono text-xs">Insufficient data points to plot trend.</div>
                    )}
                  </div>
                  {/* Right Chart Card: Bug Category Bar Distribution */}
                  <div className="lg:col-span-1 bg-paper-bg border border-ink-black p-6 flex flex-col gap-4 sharp-corners">
                    <div className="border-b border-ink-black pb-3 flex flex-col gap-0.5">
                      <h3 className="text-sm font-mono font-bold uppercase tracking-widest text-ink-black flex items-center gap-1.5">
                        <Activity size={15} strokeWidth={1.5} />
                        Issues by Category
                      </h3>
                      <p className="text-[10px] font-mono uppercase tracking-wider text-neutral-500">Distribution of bugs found across code classes.</p>
                    </div>

                    {/* Simple Pure CSS/HTML Bars */}
                    <div className="flex flex-col gap-4 py-2">
                      {Object.entries(analyticsData.categoryCounts).map(([cat, count]) => {
                        const total = Object.values(analyticsData.categoryCounts).reduce((a, b) => a + b, 0) || 1;
                        const pct = Math.round((count / total) * 100);
                        
                        // Map colors
                        let colorBar = 'bg-ink-black';
                        if (cat === 'Security') {
                          colorBar = 'bg-editorial-red';
                        } else if (cat === 'Bug') {
                          colorBar = 'bg-ink-black';
                        } else if (cat === 'Performance') {
                          colorBar = 'bg-neutral-600';
                        }

                        return (
                          <div key={cat} className="flex flex-col gap-1.5 font-mono text-xs text-ink-black">
                            <div className="flex justify-between items-center font-bold">
                              <span>{cat}</span>
                              <span>{count} ({pct}%)</span>
                            </div>
                            <div className="w-full h-2 bg-neutral-200 border border-ink-black sharp-corners overflow-hidden">
                              <div 
                                className={`h-full ${colorBar} transition-all duration-500`} 
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Developer security mistakes tracker card */}
                <div className="bg-paper-bg border border-ink-black p-6 flex flex-col gap-5 sharp-corners">
                  <div className="border-b border-ink-black pb-3 flex justify-between items-center flex-wrap gap-2">
                    <div className="flex flex-col gap-1">
                      <h3 className="text-sm font-mono font-bold uppercase tracking-widest text-ink-black flex items-center gap-2">
                        <ShieldCheck size={16} strokeWidth={1.5} />
                        Developer Security Mistakes Tracker
                      </h3>
                      <p className="text-[10px] font-mono uppercase tracking-wider text-neutral-500">Monitor repeating security mistakes or bugs across scans to improve codebase compliance.</p>
                    </div>
                    
                    <span className="text-[9px] font-mono font-bold uppercase tracking-widest bg-ink-black text-paper-bg border border-ink-black px-2.5 py-1 sharp-corners">
                      Developer: {user.name}
                    </span>
                  </div>

                  {analyticsData.repeatingMistakes.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs text-left text-ink-black font-mono">
                        <thead className="text-[9px] uppercase font-bold text-neutral-500 tracking-widest border-b border-ink-black pb-2">
                          <tr>
                            <th className="py-3 px-4">Mistake / Pattern Description</th>
                            <th className="py-3 px-4">Category</th>
                            <th className="py-3 px-4">Severity</th>
                            <th className="py-3 px-4 text-center">Frequency</th>
                            <th className="py-3 px-4 text-center">Bugs Trend</th>
                            <th className="py-3 px-4 text-right">Last Logged</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-ink-black/10">
                          {analyticsData.repeatingMistakes.map((mistake, idx) => {
                            const isCritical = mistake.severity?.toLowerCase() === 'critical' || mistake.severity?.toLowerCase() === 'high';
                            const historyPoints = mistake.history || [];
                            const sw = 80;
                            const sh = 18;
                            const gap = sw / (historyPoints.length - 1 || 1);
                            const sparkPath = historyPoints.length > 1
                              ? historyPoints.reduce((path, pt, i) => {
                                  const x = i * gap;
                                  // Invert y: 0 is at bottom (sh-2), 1 is at top (2)
                                  const y = pt === 1 ? 2 : sh - 2;
                                  return path + (i === 0 ? `M ${x} ${y}` : ` L ${x} ${y}`);
                                }, '')
                              : '';

                            return (
                              <tr key={idx} className="hover:bg-neutral-100 transition-colors">
                                <td className="py-3.5 px-4 font-sans font-bold text-ink-black max-w-sm truncate">{mistake.title}</td>
                                <td className="py-3.5 px-4">
                                  <span className={`px-2 py-0.5 border text-[8px] font-bold uppercase tracking-wider sharp-corners ${
                                    mistake.category === 'Security' 
                                      ? 'bg-editorial-red/5 text-editorial-red border-editorial-red/20' 
                                      : 'bg-paper-bg text-ink-black border-ink-black'
                                  }`}>
                                    {mistake.category}
                                  </span>
                                </td>
                                <td className="py-3.5 px-4">
                                  <span className={`font-bold ${isCritical ? 'text-editorial-red' : 'text-ink-black'}`}>
                                    {mistake.severity || 'low'}
                                  </span>
                                </td>
                                <td className="py-3.5 px-4 text-center font-bold">{mistake.count}x</td>
                                <td className="py-3.5 px-4 text-center">
                                  {historyPoints.length > 1 ? (
                                    <svg className="w-20 h-5 inline-block" viewBox={`0 0 ${sw} ${sh}`}>
                                      <path 
                                        d={sparkPath}
                                        fill="none"
                                        stroke={isCritical ? '#CC0000' : '#111111'}
                                        strokeWidth="1.5"
                                        strokeLinecap="square"
                                      />
                                      <circle 
                                        cx={sw}
                                        cy={historyPoints[historyPoints.length - 1] === 1 ? 2 : sh - 2}
                                        r="2.5"
                                        fill={isCritical ? '#CC0000' : '#111111'}
                                      />
                                    </svg>
                                  ) : (
                                    <span className="text-[9px] text-neutral-500">No trend</span>
                                  )}
                                </td>
                                <td className="py-3.5 px-4 text-right text-neutral-500">{mistake.lastSeen}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="py-8 text-center text-neutral-500 font-mono text-xs italic border border-dashed border-ink-black sharp-corners">
                      No repeating codebase security mistakes logged. Good compliance standard!
                    </div>
                  )}
                </div>

              </div>
            ) : (
              /* History Log View Tab */
              <div className="flex flex-col gap-6">
                         {/* Filters Row */}
                <div className="bg-paper-bg border border-ink-black p-4 sharp-corners flex flex-col md:flex-row items-center justify-between gap-4 font-mono text-xs text-ink-black">
                  {/* Search */}
                  <div className="w-full md:w-72 relative">
                    <Search size={13} className="absolute left-3 top-3.5 text-neutral-500" strokeWidth={1.5} />
                    <input 
                      type="text"
                      placeholder="Filter codebase name..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full text-xs font-mono text-ink-black bg-transparent border border-ink-black sharp-corners pl-9 pr-4 py-2.5 outline-none focus:bg-neutral-100"
                    />
                  </div>

                  {/* Latest Only Toggle */}
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest self-stretch md:self-auto justify-start">
                    <input 
                      type="checkbox"
                      id="latestOnly"
                      checked={latestOnly}
                      onChange={(e) => setLatestOnly(e.target.checked)}
                      className="border-ink-black text-ink-black focus:ring-0 w-4 h-4 cursor-pointer sharp-corners rounded-none"
                    />
                    <label htmlFor="latestOnly" className="cursor-pointer select-none">
                      Show latest scan only
                    </label>
                  </div>

                  {/* Score filter */}
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest self-stretch md:self-auto justify-between md:justify-start">
                    <span>Min Overall Score:</span>
                    <select 
                      value={minScoreFilter}
                      onChange={(e) => setMinScoreFilter(e.target.value)}
                      className="bg-paper-bg border border-ink-black text-ink-black px-3 py-2 cursor-pointer focus:bg-neutral-100 outline-none sharp-corners font-bold"
                    >
                      <option value="0">Show All</option>
                      <option value="90">90+ Excellent</option>
                      <option value="80">80+ Good</option>
                      <option value="70">70+ Fair</option>
                      <option value="50">50+ Needs Review</option>
                    </select>
                  </div>
                </div>

                {/* Grid Lists of Logs */}
                {filteredHistoryReviews.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {filteredHistoryReviews.map((rev) => {
                      const bugCounts = getBugCounts(rev.bugs);
                      return (
                        <div 
                          key={rev._id}
                          className="bg-paper-bg border border-ink-black hover:bg-neutral-100 p-6 flex flex-col justify-between gap-5 transition-all duration-200 sharp-corners hard-shadow-hover"
                        >
                          <div className="flex flex-col gap-3 font-mono text-xs">
                            <div className="flex justify-between items-start gap-4">
                              <div className="flex flex-col gap-1 min-w-0">
                                <span className="text-[9px] font-bold uppercase tracking-widest text-neutral-500">Codebase Project</span>
                                <span className="font-serif font-black text-ink-black text-base uppercase tracking-tight truncate">{rev.projectId?.name || 'Deleted Project'}</span>
                              </div>
                              
                              <div className="flex items-center justify-center w-12 h-12 border border-ink-black bg-ink-black text-paper-bg font-serif font-black text-sm sharp-corners">
                                <span>{rev.overallScore}</span>
                              </div>
                            </div>

                            <div className="flex items-center gap-1.5 text-[10px] text-neutral-550 font-bold uppercase tracking-wider">
                              <Calendar size={12} strokeWidth={1.5} />
                              {new Date(rev.createdAt).toLocaleString()}
                            </div>

                            <div className="grid grid-cols-4 gap-2 bg-neutral-100 p-3 border border-ink-black/25 text-[9px] text-neutral-500 font-bold uppercase tracking-wider sharp-corners">
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

                            <div className="flex items-center gap-1.5 flex-wrap mt-1">
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

                          <Link 
                            href={`/reviews/${rev._id}`}
                            className="w-full py-2.5 bg-ink-black hover:bg-paper-bg text-paper-bg hover:text-ink-black border border-transparent hover:border-ink-black text-xs font-mono font-bold uppercase tracking-widest transition-colors sharp-corners flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            Explore Analysis Report
                            <ArrowRight size={12} strokeWidth={1.5} />
                          </Link>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="py-20 flex flex-col items-center justify-center gap-2 border border-dashed border-ink-black text-neutral-500 text-xs font-mono sharp-corners bg-paper-bg">
                    <span className="font-bold uppercase tracking-wider text-ink-black">No reviews match the filters</span>
                    <span className="italic">Trigger a scan from a project configuration to begin.</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
